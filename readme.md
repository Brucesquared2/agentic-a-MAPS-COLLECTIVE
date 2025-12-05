<p align="center">
  <a href="https://agentic.so">
    <img alt="Agentic" src="https://raw.githubusercontent.com/transitive-bullshit/agentic/main/apps/web/public/agentic-social-image-light.jpg" width="640">
  </a>
</p>

<p>
  <a href="https://github.com/transitive-bullshit/agentic/actions/workflows/main.yml"><img alt="Build Status" src="https://github.com/transitive-bullshit/agentic/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

<!-- Cockpit verification badges -->
<p>
  <a href="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/verify-cockpit.yml"><img alt="Verify Cockpit Ritual" src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/verify-cockpit.yml/badge.svg" /></a>
  <a href="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/verify-cockpit.yml"><img alt="Verify — Windows" src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/verify-cockpit.yml/badge.svg?branch=main&job=verify&os=windows-latest" /></a>
  <a href="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/verify-cockpit.yml"><img alt="Verify — Ubuntu" src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/verify-cockpit.yml/badge.svg?branch=main&job=verify&os=ubuntu-latest" /></a>
</p>

<!-- Connectivity, Validator, PR, and Metrics badges -->
<p>
  <a href="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/check-connectivity.yml"><img alt="Connectivity Check" src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/check-connectivity.yml/badge.svg" /></a>
  <a href="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/risk-merge-combined.yml"><img alt="Manifest Validator" src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/risk-merge-combined.yml/badge.svg?event=push" /></a>
  <a href="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/risk-merge-combined.yml"><img alt="Risk Merge PR" src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/risk-merge-combined.yml/badge.svg?event=pull_request" /></a>
  <a href="https://shields.io"><img alt="Manifest Validation Errors" src="https://img.shields.io/endpoint?url=https://your-metrics-endpoint/manifest_validation_errors_total.json" /></a>
</p>

| Connectivity | Validator | Risk Merge PR | Manifest Errors |
|--------------|-----------|---------------|----------------|
| <img src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/check-connectivity.yml/badge.svg" alt="Connectivity"/> | <img src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/risk-merge-combined.yml/badge.svg?event=push" alt="Validator"/> | <img src="https://github.com/Brucesquared2/agentic-a-MAPS-COLLECTIVE/actions/workflows/risk-merge-combined.yml/badge.svg?event=pull_request" alt="Risk Merge PR"/> | <img src="https://img.shields.io/endpoint?url=https://your-metrics-endpoint/manifest_validation_errors_total.json" alt="Manifest Errors"/> |

## 🛠️ Troubleshooting Rituals

When a badge goes red, follow the ritual below:

| Badge | Meaning | Ritual Fix |
|-------|---------|------------|
| Connectivity | Runner cannot reach GitHub (DNS/HTTP) or token invalid | Run `make connectivity-check` locally. If it fails, fix DNS/proxy. Verify `REPO_WRITE_TOKEN` secret in GitHub. |
| Validator | Manifest schema or unit tests failed | Run `make validate` locally. Fix YAML errors or failing pytest cases before pushing. |
| Risk Merge PR | Auto-merge into `risk.yml` or PR creation failed | Check validator and connectivity logs first. If both are green, verify `REPO_WRITE_TOKEN` has correct repo scope. |
| Ledger Rotation | Token/secret rotation workflow failed | Confirm rotation secrets are valid and not expired. Update GitHub secrets if needed. |
| Manifest Errors (Grafana) | Live Prometheus metric shows validation errors | Inspect dashboards. Run `make validate` locally to reproduce. Fix manifests until metric count drops. |

✅ Outcome
Contributors see exact fixes tied to each badge.

No more guessing whether failures are network, validation, or secrets.

README becomes a cockpit manual: health signals + remedies in one place.

# Agentic <!-- omit from toc -->

You can think of Agentic as **RapidAPI for LLM tools**.

All tools listed on Agentic's marketplace have been carefully hand curated and are regularly tested with a comprehensive set of integration tests and evals. **Agentic aims for quality, not quantity**.

On the flip side, Agentic makes it easy to **publish your own MCP servers & OpenAPI services** to Agentic's MCP Gateway and instantly start charging for agentic tool use.

- [Website](https://agentic.so)
- [Docs](https://docs.agentic.so)

## Key features

- **Highly Curated Tools**: All publicly listed Agentic tools are manually vetted to keep an extremely high quality bar.
- **Agentic UX**: All Agentic tools have been hand-crafted specifically for LLM tool use. We call this Agentic UX, and it's at the heart of why Agentic tools work better for LLM & MCP use cases than legacy APIs.
- **First-Class MCP Support**: On both the publishing and consumption sides, Agentic supports MCP as a truly first-class primitive – not an afterthought.
- **World-Class TypeScript DX**: Agentic is written in TS and strives for a Vercel-like DX, including one-line integrations with every major TS LLM SDK.
- **Stripe Billing**: Agentic uses Stripe for billing, and most tools are _usage-based_, so you'll only pay for what you (and your agents) actually use.
- **Blazing Fast MCP Gateway**: Agentic's MCP gateway is powered by _Cloudflare's global edge network_. Tools come with customizable caching and rate-limits, so you can REST assured that your agents will always have a fast and reliable experience.
- **Semver**: All Agentic tools are versioned using semver, so you can choose how to handle breaking changes.

## Getting started

- [MCP Marketplace](https://docs.agentic.so/marketplace) - Using tools
- [MCP Publishing](https://docs.agentic.so/publishing/quickstart) - Publishing your own tools

### TypeScript LLM SDKs

Agentic has first-class support for every major TS LLM SDK, including:

- [Vercel AI SDK](https://docs.agentic.so/marketplace/ts-sdks/ai-sdk)
- [OpenAI](https://docs.agentic.so/marketplace/ts-sdks/openai-chat)
- [LangChain](https://docs.agentic.so/marketplace/ts-sdks/langchain)
- [LlamaIndex](https://docs.agentic.so/marketplace/ts-sdks/llamaindex)
- [Firebase Genkit](https://docs.agentic.so/marketplace/ts-sdks/genkit)
- [Mastra](https://docs.agentic.so/marketplace/ts-sdks/mastra)

## Publish your own MCP products

<p align="center">
  <a href="https://agentic.so/publishing">
    <img alt="Agentic" src="https://raw.githubusercontent.com/transitive-bullshit/agentic/main/apps/web/public/agentic-publishing-social-image-dark-github.jpg" width="640">
  </a>
</p>

- [Learn more about publishing with Agentic](https://agentic.so/publishing)
- [Publish an existing MCP server with Agentic](https://docs.agentic.so/publishing/guides/existing-mcp-server)
- [Publish an existing OpenAPI service with Agentic](https://docs.agentic.so/publishing/guides/existing-openapi-service)

Anyone can publish their own live MCP products with Agentic, but you'll need to submit your MCP to us before it can be listed on the main Agentic marketplace.

## Join the community

- Follow us on [Twitter](https://x.com/transitive_bs)
- Read more in our [docs](https://docs.agentic.so)

## Contributing

**Agentic is proudly 100% open source.**

Interested in contributing or building Agentic from scratch? See [contributing.md](./contributing.md).

## Secrets & Environment Files

⚠️ Do not commit a `.env` file containing secrets. Use the provided `.env.sample` as a reference and copy it to `.env` locally.

Example:

```powershell
copy .env.sample .env
```

This repository's CI and Docker Compose read `LEDGER_PATH` and `CLAUDE_API_KEY` from environment variables. Keep secrets out of the git history.

## Claude Runner Sidecar

We run the Claude capsule (`claude_capsule`) alongside a Node.js sidecar (`claude_runner`) that dispatches project plans and forwards assignment events to the cockpit UI.

1. Start services

```bash
docker compose up -d claude_capsule claude_runner web
```

2. Environment setup

Make sure your `.env` file includes:

```env
CLAUDE_API_KEY=your_claude_api_key
CLAUDE_PLAN=/app/configs/project-plan.yaml
COCKPIT_PUBLISH_URL=http://web:3000/api/cockpit/publish
COCKPIT_PUBLISH_TOKEN=supersecret123
LEDGER_PATH=/app/logs/key_log.yml
```

`COCKPIT_PUBLISH_TOKEN` must match the secret configured in the publish route.

3. Verify publish flow

```bash
curl -X POST http://localhost:3000/api/cockpit/publish \
  -H "Content-Type: application/json" \
  -H "x-publish-token: supersecret123" \
  -d '{"agent":"claude","action":"task_assigned","notes":"Test assignment event from README snippet"}'
```

Expected response:

```json
{
  "status": "ok",
  "event": {
    "timestamp": "...",
    "agent": "claude",
    "action": "task_assigned",
    "notes": "Test assignment event from README snippet"
  }
}
```

4. Check cockpit UI

Open `http://localhost:3000` and confirm:

- Assignment event appears in the navigator panel.
- Diagram updates with a ⚡ badge on the claude node.

---

## Rotation Ritual (CI)

The repository includes a monthly ledger rotation workflow that runs the rotation trigger and archives `logs/key_log.yml`.

When configuring GitHub Actions, add the secret `COCKPIT_PUBLISH_TOKEN` (Settings → Secrets → Actions) with the same value used by your runner sidecar.

The workflow injects the secret into the rotation step so rotation jobs can authenticate when posting events to the publish endpoint.

If you want, we also provide a helper `scripts/rotation_trigger.ps1` and `web/src/lib/rotationTrigger.ts` for Windows and Node environments respectively.

