import { NextRequest } from "next/server";
import { getMetrics } from "../../../../lib/metricsStoreRedis";

export async function GET(_req: NextRequest) {
  const { completed, rotations, activeAssignments } = await getMetrics();

  const metrics = [
    `# HELP cockpit_active_assignments Number of active agent assignments`,
    `# TYPE cockpit_active_assignments gauge`,
    `cockpit_active_assignments ${activeAssignments}`,

    `# HELP cockpit_completed_tasks Total completed tasks`,
    `# TYPE cockpit_completed_tasks counter`,
    `cockpit_completed_tasks ${completed}`,

    `# HELP cockpit_rotations Total rotation events`,
    `# TYPE cockpit_rotations counter`,
    `cockpit_rotations ${rotations}`,
  ].join("\n");

  return new Response(metrics, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
