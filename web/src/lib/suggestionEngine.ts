import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { execSync } from "child_process";

export interface LedgerEntry {
  timestamp: string;
  agent: string;
  action: string;
  notes?: string;
}

export interface Suggestion {
  timestamp: string;
  agent: string;
  type: "hardware" | "software" | "workflow";
  message: string;
}

// Load ledger entries
export function loadLedger(
  logFile: string = path.resolve(process.cwd(), "logs/key_log.yml")
): LedgerEntry[] {
  try {
    if (!fs.existsSync(logFile)) return [];
    const fileContents = fs.readFileSync(logFile, "utf8");
    const data = yaml.load(fileContents) as LedgerEntry[] | undefined;
    return Array.isArray(data) ? data : Array.isArray((data as any)?.entries) ? (data as any).entries : [];
  } catch (err) {
    // malformed or empty
    return [];
  }
}

// Analyze ledger and generate suggestions
export function generateSuggestions(entries: LedgerEntry[]): Suggestion[] {
  const recent = entries.slice(-20); // last 20 entries
  const counts: Record<string, number> = {};

  recent.forEach((e) => {
    const key = (e.agent || "unknown").toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });

  const suggestions: Suggestion[] = [];

  if ((counts["claude"] || 0) > 5) {
    suggestions.push({
      timestamp: new Date().toISOString(),
      agent: "Claude Capsule",
      type: "workflow",
      message:
        "Claude has been invoked frequently — consider automating batch transforms with a dedicated script.",
    });
  }

  if ((counts["ollama"] || 0) > 3) {
    suggestions.push({
      timestamp: new Date().toISOString(),
      agent: "Ollama Local",
      type: "hardware",
      message:
        "Ollama capsule is rising often — a GPU upgrade may improve local inference speed.",
    });
  }

  if ((counts["cad"] || 0) > 2) {
    suggestions.push({
      timestamp: new Date().toISOString(),
      agent: "CAD Integration Agent",
      type: "software",
      message:
        "CAD agent active — consider installing the latest AutoCAD plugin for BOM extraction.",
    });
  }

  return suggestions;
}

// Append suggestion to ledger (with dry-run option)
export function appendSuggestionToLedger(
  suggestion: Suggestion,
  logFile: string = path.resolve(process.cwd(), "logs/key_log.yml"),
  dryRun: boolean = false
): void {
  const entry: LedgerEntry = {
    timestamp: suggestion.timestamp,
    agent: suggestion.agent,
    action: "recommendation",
    notes: suggestion.message,
  };

  // Dump as a YAML sequence containing a single mapping so it appends as list items
  const yamlEntry = yaml.dump([entry], { lineWidth: -1 });

  if (dryRun) {
    // eslint-disable-next-line no-console
    console.log("🔎 Dry-run: would append suggestion:\n", yamlEntry);
    return;
  }

  // ensure dir exists
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, "\n" + yamlEntry, "utf8");
    // eslint-disable-next-line no-console
    console.log(`✅ Suggestion from ${suggestion.agent} appended to ledger (${logFile})`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to append suggestion to ledger:", err);
    throw err;
  }
}

export function commitLedger(
  logFile: string = path.resolve(process.cwd(), "logs/key_log.yml"),
  message?: string,
  dryRun: boolean = false
): void {
  const commitMsg = message || `chore: append suggestion to ${path.basename(logFile)}`;

  if (dryRun) {
    // eslint-disable-next-line no-console
    console.log("🔎 Dry-run: would run: git add && git commit -m", commitMsg);
    return;
  }

  try {
    execSync(`git add "${logFile}"`, { stdio: "inherit" });
    execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
    // eslint-disable-next-line no-console
    console.log("✅ Ledger committed to git");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Git commit failed:", err);
    throw err;
  }
}

// Run generator and append suggestions
export function runSuggestionEngine(
  logFile: string = path.resolve(process.cwd(), "logs/key_log.yml"),
  dryRun: boolean = false,
  commit: boolean = false,
  commitMessage?: string
): void {
  const entries = loadLedger(logFile);
  const suggestions = generateSuggestions(entries);

  if (!suggestions.length) {
    // eslint-disable-next-line no-console
    console.log("No suggestions generated.");
    return;
  }

  suggestions.forEach((s) => appendSuggestionToLedger(s, logFile, dryRun));

  if (commit) {
    commitLedger(logFile, commitMessage, dryRun);
  }
}

// Simple CLI: run with `pnpm exec ts-node web/src/lib/suggestionEngine.ts --dry-run --commit`
if ((require as any).main === module) {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run") || argv.includes("-d");
  const commit = argv.includes("--commit") || argv.includes("-c");
  const logFileArg = argv.find((a) => a.startsWith("--log="));
  const msgArg = argv.find((a) => a.startsWith("--message="));
  const logFile = logFileArg ? logFileArg.split("=")[1] : undefined;
  const message = msgArg ? msgArg.split("=")[1] : undefined;

  try {
    runSuggestionEngine(logFile, dryRun, commit, message);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
}
