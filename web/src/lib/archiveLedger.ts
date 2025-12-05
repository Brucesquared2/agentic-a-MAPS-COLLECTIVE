import fs from "fs";
import path from "path";

export function rotateLedger(
  logFile: string = path.resolve(process.cwd(), "Sunshine_Digital/key_log.yml"),
  archiveDir: string = path.resolve(process.cwd(), "Sunshine_Digital/archive")
): void {
  try {
    // Ensure archive directory exists
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // Build archive filename with current month/year
    const timestamp = new Date().toISOString().slice(0, 7); // YYYY-MM
    const archiveFile = path.join(archiveDir, `key_log-${timestamp}.yml`);

    // Move current log to archive if it exists
    if (fs.existsSync(logFile)) {
      fs.renameSync(logFile, archiveFile);
      console.log(`📦 Archived ledger to ${archiveFile}`);
    }

    // Create a fresh empty ledger
    fs.writeFileSync(logFile, "");
    console.log("✅ New key_log.yml created for fresh entries");
  } catch (err) {
    console.error("⚠️ Ledger rotation failed:", err);
  }
}

export default rotateLedger;
