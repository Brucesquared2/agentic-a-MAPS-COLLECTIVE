// scripts/orchestrator.ts
// Ingests a full project plan (YAML/JSON) and distributes tasks to agents automatically

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { appendSuggestionToLedger } from "../web/src/lib/suggestionEngine";
import { publishAssignment } from "../web/src/lib/sseBus";

// Helper to POST events to publish endpoint with retry/backoff
async function forwardToPublish(
  event: { timestamp: string; agent: string; action: string; notes: string },
  maxRetries: number = 3,
  baseDelayMs: number = 1000
) {
  const url = process.env.COCKPIT_PUBLISH_URL || "http://localhost:3000/api/cockpit/publish";
  const token = process.env.COCKPIT_PUBLISH_TOKEN;

  // Resolve fetch (global or node-fetch fallback)
  let _fetch: any = (globalThis as any).fetch;
  if (!_fetch) {
    try {
      const mod = await import("node-fetch");
      _fetch = mod.default;
    } catch (e) {
      console.error("⚠️ fetch is not available and node-fetch failed to import:", e);
      return;
    }
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await _fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-publish-token": token } : {}),
        },
        body: JSON.stringify(event),
      });

      if (res.ok) {
        console.log(`📡 Event forwarded to SSE bus (attempt ${attempt})`);
        return;
      } else {
        const text = typeof res.text === "function" ? await res.text() : String(res.status);
        console.error(`⚠️ Publish failed (attempt ${attempt}): ${text}`);
      }
    } catch (err) {
      console.error(`⚠️ Network error (attempt ${attempt}):`, err);
    }

    if (attempt < maxRetries) {
      const delay = baseDelayMs * Math.pow(2, attempt - 1); // exponential backoff
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.error("❌ All publish attempts failed");
}

interface Task {
  id: string;
  type: "workflow" | "hardware" | "software";
  payload?: any;
}

const agents = {
  copilot: ["manifest", "lineage", "audit"],
  claude: ["batch", "planning", "repo"],
  ollama: ["local_inference", "capsule_persistence"],
  qwen: ["execution", "validation"],
  deepseek: ["compute", "simulation"],
  cad: ["design", "bom"],
  amd: ["drivers", "firmware"],
  printer: ["hardware_output", "gcode"],
};

function assignTask(task: Task): string {
  switch (task.type) {
    case "workflow":
      return "claude";
    case "hardware":
      return "printer";
    case "software":
      return "cad";
    default:
      return "copilot";
  }
}

function loadProjectPlan(planFile: string): Task[] {
  const fullPath = path.resolve(process.cwd(), planFile);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Plan file not found: ${fullPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  if (planFile.endsWith(".yaml") || planFile.endsWith(".yml")) {
    return (yaml.load(fileContents) as Task[]) || [];
  } else {
    return JSON.parse(fileContents) as Task[];
  }
}

export function runOrchestration(planFile: string, dryRun: boolean = false) {
  const tasks = loadProjectPlan(planFile);

  tasks.forEach((task) => {
    const agent = assignTask(task);
    const entry = {
      timestamp: new Date().toISOString(),
      agent,
      action: "task_assigned",
      notes: `Task ${task.id} of type ${task.type} assigned to ${agent}`,
    };

    appendSuggestionToLedger(
      {
        timestamp: entry.timestamp,
        agent,
        type: task.type,
        message: entry.notes,
      },
      undefined,
      dryRun
    );

    // Publish to SSE bus so UI updates in real-time (in-process)
    try {
      publishAssignment(entry as any);
    } catch (e) {
      // non-fatal if bus not available in runtime
    }

    // Also forward to the Next `/api/cockpit/publish` endpoint so external
    // processes or containers can inject events into the UI bus.
    void forwardToPublish(entry);

    console.log(`✅ ${task.id} → ${agent}`);
  });
}

// mark a task as completed and publish completion event
export function completeTask(taskId: string, agent: string) {
  const event = {
    timestamp: new Date().toISOString(),
    agent,
    action: "task_completed" as const,
    notes: `Task ${taskId} completed by ${agent}`,
  };

  try {
    publishAssignment(event as any);
  } catch (e) {}
  // forward completion to the publish endpoint as well
  void forwardToPublish(event);
}

// rotation ritual: clear active assignments and publish rotation event
export function rotateAssignments() {
  const event = {
    timestamp: new Date().toISOString(),
    agent: "system",
    action: "rotation" as const,
    notes: "Monthly rotation ritual cleared active assignments",
  };

  try {
    publishAssignment(event as any);
  } catch (e) {}
  // notify publish endpoint about rotation ritual too
  void forwardToPublish(event);
}

// CLI entrypoint
if (require.main === module) {
  const args = process.argv.slice(2);
  const planFile = args[0] || "project-plan.yaml";
  const dryRun = args.includes("--dry-run") || args.includes("-d");

  console.log(`🔧 Running orchestration for ${planFile} ${dryRun ? "(dry-run)" : ""}`);
  try {
    runOrchestration(planFile, dryRun);
  } catch (err: any) {
    console.error(err?.message || err);
    process.exit(1);
  }
}
