import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_req: NextRequest) {
  const files = [
    "dashboard.yml",
    "AGENTS.yml",
    "signal_routing.yml",
    "logs/key_log.yml",
  ];

  const watchedFiles = files.map((f) => {
    const fullPath = path.resolve(process.cwd(), f);
    return {
      file: f,
      exists: fs.existsSync(fullPath),
      path: fullPath,
    };
  });

  return new Response(
    JSON.stringify({
      status: "ok",
      watchedFiles,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
