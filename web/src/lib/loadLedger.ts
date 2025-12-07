import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

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
