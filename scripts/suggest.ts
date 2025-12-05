#!/usr/bin/env ts-node

// scripts/suggest.ts
// CLI wrapper for the suggestion engine

import { runSuggestionEngine } from "../web/src/lib/suggestionEngine";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("-d");
const commit = args.includes("--commit") || args.includes("-c");
const logFileArg = args.find((a) => a.startsWith("--log="));
const logFile = logFileArg ? logFileArg.replace("--log=", "") : undefined;
const messageArg = args.find((a) => a.startsWith("--message="));
const message = messageArg ? messageArg.replace("--message=", "") : undefined;

console.log(`🔧 Running suggestion engine ${dryRun ? "(dry-run)" : ""}...`);
runSuggestionEngine(logFile, dryRun, commit, message);
