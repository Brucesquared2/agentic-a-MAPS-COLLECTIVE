// apps/web/src/lib/metricsStoreRedis.ts
import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://cockpit-redis:6379";
const client = createClient({ url: REDIS_URL });

client.on("error", (err) => console.error("⚠️ Redis error:", err));

await client.connect();

export async function incrementCompleted() {
  await client.incr("cockpit_completed_tasks");
}

export async function incrementRotation() {
  await client.incr("cockpit_rotations");
}

export async function getMetrics() {
  const completed = parseInt((await client.get("cockpit_completed_tasks")) || "0", 10);
  const rotations = parseInt((await client.get("cockpit_rotations")) || "0", 10);
  const activeAssignments = parseInt((await client.get("cockpit_active_assignments")) || "0", 10);

  return { completed, rotations, activeAssignments };
}

export async function setActiveAssignments(count: number) {
  await client.set("cockpit_active_assignments", String(count));
}
