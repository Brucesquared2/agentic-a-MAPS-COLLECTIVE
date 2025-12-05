import fs from "fs"
import path from "path"
import yaml from "js-ya🧱 grafana-dashboard-live-vs-ledger.json
json
{
  "id": null,
  "title": "Cockpit Live vs Ledger Comparison",
  "tags": ["cockpit", "audit", "ledger"],
  "timezone": "browser",
  "schemaVersion": 36,
  "version": 1,
  "refresh": "10s",
  "panels": [
    {
      "type": "stat",
      "title": "Completed Tasks (Live)",
      "datasource": "Prometheus",
      "targets": [
        { "expr": "cockpit_completed_tasks" }
      ],
      "fieldConfig": {
        "defaults": { "unit": "short", "color": { "mode": "continuous-GrYlRd" } }
      },
      "gridPos": { "x": 0, "y": 0, "w": 6, "h": 6 }
    },
    {
      "type": "stat",
      "title": "Completed Tasks (Ledger)",
      "datasource": "Prometheus",
      "targets": [
        { "expr": "cockpit_completed_tasks_ledger" }
      ],
      "fieldConfig": {
        "defaults": { "unit": "short", "color": { "mode": "continuous-BlPu" } }
      },
      "gridPos": { "x": 6, "y": 0, "w": 6, "h": 6 }
    },
    {
      "type": "stat",
      "title": "Rotations (Live)",
      "datasource": "Prometheus",
      "targets": [
        { "expr": "cockpit_rotations" }
      ],
      "fieldConfig": {
        "defaults": { "unit": "short", "color": { "mode": "continuous-GrYlRd" } }
      },
      "gridPos": { "x": 0, "y": 6, "w": 6, "h": 6 }
    },
    {
      "type": "stat",
      "title": "Rotations (Ledger)",
      "datasource": "Prometheus",
      "targets": [
        { "expr": "cockpit_rotations_ledger" }
      ],
      "fieldConfig": {
        "defaults": { "unit": "short", "color": { "mode": "continuous-BlPu" } }
      },
      "gridPos": { "x": 6, "y": 6, "w": 6, "h": 6 }
    },
    {
      "type": "stat",
      "title": "Assignments (Ledger)",
      "datasource": "Prometheus",
      "targets": [
        { "expr": "cockpit_assignments_ledger" }
      ],
      "fieldConfig": {
        "defaults": { "unit": "short", "color": { "mode": "continuous-YlGnBu" } }
      },
      "gridPos": { "x": 12, "y": 0, "w": 6, "h": 6 }
    },
    {
      "type": "timeseries",
      "title": "Live vs Ledger Over Time",
      "datasource": "Prometheus",
      "targets": [
        { "expr": "cockpit_completed_tasks" },
        { "expr": "cockpit_completed_tasks_ledger" },
        { "expr": "cockpit_rotations" },
        { "expr": "cockpit_rotations_ledger" }
      ],
      "fieldConfig": {
        "defaults": { "unit": "short", "color": { "mode": "palette-classic" } }
      },
      "gridPos": { "x": 0, "y": 12, "w": 18, "h": 10 }
    }
  ]
}
🔧 How It Works
Stat panels: Show live vs ledger totals side‑by‑side for completed tasks and rotations.

Assignments (Ledger): Displays total assignments reconstructed from ledger replay.

Time‑series panel: Plots live vs ledger counters together, so you can spot drift or discrepancies.

Colors: Live metrics use green/red palette, ledger metrics use blue/purple palette for clarity.

✅ Outcome
Grafana now visualizes audit alignment: you can confirm live counters match ledger replay.

Any discrepancies (e.g., live reset vs ledger totals) are visible instantly.

Complements Discord ritual feed and Prometheus alerts with visual assurance.ml"

export interface LedgerEntry {
  timestamp: string
  agent: string
  action: string
  notes?: string
}

export function loadLedger(
  logFile: string = path.resolve(process.cwd(), "logs/key_log.yml")
): LedgerEntry[] {
  try {
    const fileContents = fs.readFileSync(logFile, "utf8")
    const data = yaml.load(fileContents) as LedgerEntry[]
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("⚠️ Failed to load ledger:", err)
    return []
  }
}

// Example: surface entries to navigator UI
export function getRecentInvocations(limit: number = 10): LedgerEntry[] {
  const entries = loadLedger()
  return entries.slice(-limit).reverse() // last N entries, newest first
}

export default loadLedger
