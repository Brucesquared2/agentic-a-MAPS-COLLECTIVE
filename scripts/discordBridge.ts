// scripts/discordBridge.ts
import express from "express";
import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID!;
const SSE_URL = process.env.COCKPIT_SSE_URL || "http://copilot_navigator:3000/api/cockpit/stream";
const METRICS_PUSH = process.env.BRIDGE_METRICS_URL; // optional
const DEV_ECHO = process.env.BRIDGE_DEV_ECHO === "true";
const METRICS_URL = process.env.COCKPIT_METRICS_URL || "http://copilot_navigator:3000/api/metrics";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let delivered = 0, failed = 0, retried = 0, dropped = 0;

client.once("ready", async () => {
  console.log(`🤖 Discord bridge online as ${client.user?.tag}`);
  await registerCommands();
  subscribeSSE();
});

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  await rest.put(
    Routes.applicationCommands(client.user!.id),
    { body: [
      { name: "cockpit-status", description: "Show active assignments + counters" },
      { name: "cockpit-recent", description: "List recent events (last 10)" },
    ]}
  );
}

async function subscribeSSE(backoffMs = 1000) {
  try {
    const res = await fetch(SSE_URL);
    if (!res.ok || !res.body) throw new Error(`SSE connect failed: ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      for (const line of buffer.split("\n")) {
        if (line.startsWith("data:")) {
          const json = line.slice(5).trim();
          processEventSafe(json);
        }
      }
      buffer = ""; // naive reset; adjust if events can span chunks
    }
    // unexpected end — reconnect
    retried++;
    setTimeout(() => subscribeSSE(Math.min(backoffMs * 2, 30000)), backoffMs);
  } catch (e) {
    retried++;
    setTimeout(() => subscribeSSE(Math.min(backoffMs * 2, 30000)), backoffMs);
  }
}

async function processEventSafe(json: string) {
  try {
    const event = JSON.parse(json);
    const metricsText = await fetchMetrics();
    await postEmbed(event, metricsText);
    delivered++;
    if (DEV_ECHO) console.log("Event:", event);
    if (METRICS_PUSH) pushMetrics();
  } catch (e) {
    failed++;
    if (METRICS_PUSH) pushMetrics();
  }
}

async function fetchMetrics(): Promise<string | null> {
  try {
    const res = await fetch(METRICS_URL);
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    return null;
  }
}

function buildEmbed(event: any, metricsText: string | null) {
  const { agent = "unknown", action = "event", notes = "", timestamp = new Date().toISOString(), links = {}, metrics = {} } = event;

  const color = actionColor(action);
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`Cockpit • ${titleCase(action)}`)
    .setDescription(notes || "—")
    .addFields(
      { name: "Agent", value: agent, inline: true },
      { name: "Timestamp", value: timestamp, inline: true },
    )
    .setFooter({ text: "AMEN THE COLLECTIVE • lineage is the foresight" });

  const metricLines = Object.entries(metrics)
    .map(([k, v]) => `• ${k}: ${v}`)
    .join("\n");
  if (metricLines) embed.addFields({ name: "Metrics", value: metricLines });

  const linkLines = Object.entries(links)
    .map(([k, v]) => `[${k}](${String(v)})`)
    .join(" • ");
  if (linkLines) embed.addFields({ name: "Links", value: linkLines });

  if (metricsText) {
    embed.addFields({ name: "Metrics Snapshot", value: "```\n" + metricsText + "\n```" });
  }

  return embed;
}

function actionColor(action: string) {
  switch (action) {
    case "task_assigned": return 0x3498db; // blue
    case "task_completed": return 0x2ecc71; // green
    case "rotation": return 0xf1c40f; // yellow
    case "business_plan_update": return 0x9b59b6; // purple
    case "error": return 0xe74c3c; // red
    default: return 0x95a5a6; // gray
  }
}

async function postEmbed(event: any, metricsText: string | null) {
  const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
  if (!channel || !("send" in channel)) throw new Error("Channel not found or send not available");
  await (channel as any).send({ embeds: [buildEmbed(event, metricsText)] });
}

function pushMetrics() {
  const body = `cockpit_bridge_delivered ${delivered}\ncockpit_bridge_failed ${failed}\ncockpit_bridge_retried ${retried}\ncockpit_bridge_dropped ${dropped}\n`;
  fetch(METRICS_PUSH!, { method: "POST", headers: { "Content-Type": "text/plain" }, body }).catch(() => {});
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase()).replace(/_/g, " ");
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "cockpit-status") {
    // Minimal live status — expand by querying /api/metrics if desired
    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("Cockpit Status")
        .setDescription("Live bridge counters")
        .addFields(
          { name: "Delivered", value: String(delivered), inline: true },
          { name: "Failed", value: String(failed), inline: true },
          { name: "Retried", value: String(retried), inline: true },
        )
      ]
    });
  }
  if (interaction.commandName === "cockpit-recent") {
    await interaction.reply("Recent events are streaming live. History persistence can be enabled via ledger replay.");
  }
});

// Entrypoint
client.login(DISCORD_TOKEN);

// --- lightweight HTTP server for health, metrics and Alertmanager webhook ---
const httpPort = parseInt(process.env.DISCORD_BRIDGE_PORT || "8080", 10);
const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.post("/alert", async (req, res) => {
  const alerts = req.body?.alerts || [];
  for (const alert of alerts) {
    try {
      await postAlertToDiscord(alert);
    } catch (err) {
      console.error("Failed to post alert to Discord:", err);
    }
  }
  res.sendStatus(200);
});

async function postAlertToDiscord(alert: any) {
  const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID!);
  if (!channel || !("send" in channel)) return;
  const status = alert.status || "firing";
  const severity = alert.labels?.severity || "info";

  let color = severityColor(severity);
  let titlePrefix = "🚨 Alert";
  let emoji = "";

  if (status === "resolved") {
    color = 0x2ecc71; // green
    titlePrefix = "✅ Alert Cleared";
    emoji = "✅";
  } else {
    emoji = severityEmoji(severity);
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${emoji} ${titlePrefix}: ${alert.labels?.alertname}`)
    .setDescription(alert.annotations?.description || "")
    .addFields(
      { name: "Severity", value: severity, inline: true },
      { name: "Summary", value: alert.annotations?.summary || "—", inline: true }
    )
    .setFooter({ text: "AMEN THE COLLECTIVE • lineage is the foresight" });

  await (channel as any).send({ embeds: [embed] });
}

function severityColor(severity: string) {
  switch (severity) {
    case "critical": return 0xe74c3c; // red
    case "warning": return 0xf1c40f; // yellow
    case "info": return 0x3498db; // blue
    default: return 0x95a5a6; // gray
  }
}

function severityEmoji(severity: string) {
  switch (severity) {
    case "critical": return "🔴";
    case "warning": return "🟡";
    case "info": return "🔵";
    default: return "⚪";
  }
}

app.listen(httpPort, () => {
  console.log(`📡 Discord bridge HTTP server listening on port ${httpPort}`);
});
