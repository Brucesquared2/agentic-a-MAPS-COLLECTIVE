import { NextRequest } from "next/server";
import { publishAssignment } from "../../../../lib/sseBus";

// Accept either PUBLISH_AUTH_TOKEN (primary) or COCKPIT_PUBLISH_TOKEN (CI/older workflows)
const AUTH_TOKEN = process.env.PUBLISH_AUTH_TOKEN || process.env.COCKPIT_PUBLISH_TOKEN;

export async function POST(req: NextRequest) {
  try {
    // Check token header
    const token = req.headers.get("x-publish-token");
    if (!AUTH_TOKEN || token !== AUTH_TOKEN) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.agent || !body.action || !body.notes) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: agent, action, notes" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Enforce action enum
    const validActions = ["task_assigned", "task_completed", "rotation"];
    if (!validActions.includes(body.action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const event = {
      timestamp: new Date().toISOString(),
      agent: body.agent,
      action: body.action,
      notes: body.notes,
    };

    publishAssignment(event as any);

    return new Response(JSON.stringify({ status: "ok", event }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("⚠️ Publish endpoint error:", err);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
