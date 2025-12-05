import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const METRICS_FILE = path.resolve(process.cwd(), "metrics.json");
const PUSHGATEWAY_URL = process.env.PUSHGATEWAY_URL || "http://pushgateway:9091/metrics/job/cockpit";

let metrics = {
  completed: 0,
  rotations: 0,
};

function loadMetrics() {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      const data = JSON.parse(fs.readFileSync(METRICS_FILE, "utf-8"));
      metrics = { ...metrics, ...data };
    }
  } catch (err) {
    console.error("⚠️ Failed to load metrics:", err);
  }
}

function persistMetrics() {
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
  } catch (err) {
    console.error("⚠️ Failed to persist metrics:", err);
  }
}

function pushToGateway() {
  try {
    const body = [
      `cockpit_completed_tasks ${metrics.completed}`,
      `cockpit_rotations ${metrics.rotations}`,
    ].join("\n");

    fetch(PUSHGATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body,
    }).catch((err) => console.error("⚠️ Pushgateway error:", err));
  } catch (err) {
    console.error("⚠️ Pushgateway error:", err);
  }
}

export function incrementCompleted() {
  metrics.completed++;
  persistMetrics();
  pushToGateway();
}

export function incrementRotation() {
  metrics.rotations++;
  persistMetrics();
  pushToGateway();
}

export function getMetrics() {
  return metrics;
}

// Load on startup
loadMetrics();
