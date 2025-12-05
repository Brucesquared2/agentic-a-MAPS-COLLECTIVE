// scripts/claude_runner.ts
// Claude capsule runner: ingests project plans and dispatches tasks via orchestrator

import { runOrchestration } from "./orchestrator";
import fs from "fs";
import path from "path";

function getPlanFile(): string {
  // Default plan file path
  const defaultPlan = path.resolve(process.cwd(), "project-plan.yaml");

  // If CLAUDE_PLAN env is set, use that
  const envPlan = process.env.CLAUDE_PLAN;
  if (envPlan && fs.existsSync(envPlan)) {
    return envPlan;
  }

  return defaultPlan;
}

export function runClaudeDispatcher(dryRun: boolean = false) {
  const planFile = getPlanFile();
  console.log(`📜 Claude Dispatcher: ingesting ${planFile}`);
  runOrchestration(planFile, dryRun);
}

// CLI entrypoint
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || args.includes("-d");

  runClaudeDispatcher(dryRun);
}
