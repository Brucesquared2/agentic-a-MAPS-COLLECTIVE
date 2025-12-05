// scripts/ledgerMetricsAggregator.js
// Rebuild cockpit metrics from append-only ledger files

import fs from "fs";
import path from "path";

const LEDGER_DIR = process.env.LEDGER_PATH || path.resolve(process.cwd(), "logs/ledger");

/**
 * Aggregate metrics from all ledger files
 * @returns {Object} metrics
 */
export function aggregateMetrics() {
  const files = fs.readdirSync(LEDGER_DIR).filter(f => f.endsWith(".jsonl"));
  let completed = 0;
  let rotations = 0;
  let assignments = 0;

  for (const file of files) {
    const lines = fs.readFileSync(path.join(LEDGER_DIR, file), "utf-8").split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line);
        switch (event.action) {
          case "task_completed":
            completed++;
            break;
          case "rotation":
            rotations++;
            break;
          case "task_assigned":
            assignments++;
            break;
        }
      } catch (err) {
        console.error("⚠️ Failed to parse ledger line:", err);
      }
    }
  }

  return { completed, rotations, assignments };
}

// CLI entrypoint
if (require.main === module) {
  const metrics = aggregateMetrics();
  console.log("📊 Ledger-derived metrics:", metrics);
}
