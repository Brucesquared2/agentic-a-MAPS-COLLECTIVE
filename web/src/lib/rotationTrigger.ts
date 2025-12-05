import fs from "fs";
import path from "path";
import { publishAssignment } from "./sseBus";

export function rotateLedger(
  logFile: string = path.resolve(process.cwd(), "logs/key_log.yml"),
  archiveDir: string = path.resolve(process.cwd(), "logs/archive")
): void {
  try {
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().slice(0, 7); // YYYY-MM
    const archiveFile = path.join(archiveDir, `key_log-${timestamp}.yml`);

    if (fs.existsSync(logFile)) {
      fs.renameSync(logFile, archiveFile);
      console.log(`📦 Archived ledger to ${archiveFile}`);
    }

    fs.writeFileSync(logFile, "");

    const rotationEvent = {
      timestamp: new Date().toISOString(),
      agent: "system",
      action: "rotation",
      notes: "Monthly rotation ritual cleared active assignments.",
    } as const;

    // Append rotation event to new ledger
    fs.appendFileSync(
      logFile,
      `- timestamp: ${rotationEvent.timestamp}\n  agent: ${rotationEvent.agent}\n  action: ${rotationEvent.action}\n  notes: >\n    ${rotationEvent.notes}\n`
    );

    // Publish to SSE bus
    publishAssignment(rotationEvent as any);

    console.log("⚡ Rotation event published to ledger and SSE stream");
  } catch (err) {
    console.error("⚠️ Rotation trigger failed:", err);
  }
}

// CLI entrypoint
if (require.main === module) {
  rotateLedger();
}
