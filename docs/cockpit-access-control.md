# Cockpit Access Control & Invocation Log

This document captures recent capsule invocations, the access rails (what each agent needs to authenticate), and short integration notes for lifecycle, persistence, and versioning ("git fossilization").

```yaml
invocation_log:
  - timestamp: 2025-12-05T01:05:00Z
    agent: copilot
    action: navigator_present
    auth: microsoft_account
    notes: >
      Copilot persistent, half-page navigator. Always present.

  - timestamp: 2025-12-05T01:06:00Z
    agent: claude
    action: capsule_invoked
    auth: anthropic_api_key
    notes: >
      Claude capsule summoned via CLI. Ephemeral, vanished after idle timeout.

  - timestamp: 2025-12-05T01:07:00Z
    agent: ollama
    action: capsule_invoked
    auth: local_server_token
    notes: >
      Ollama capsule rose inside Docker/WSL. Exposed at localhost:11434.
```

```yaml
# === Cockpit Access Control ===
access:
  copilot:
    method: microsoft/google/apple login
    persistence: true
    scope: navigator_panel

  claude:
    method: anthropic_api_key
    persistence: false
    scope: capsule_window

  ollama:
    method: local_server_token
    persistence: false
    scope: capsule_window

  demucs:
    method: python_env + pip install
    persistence: false
    scope: capsule_window
```

**Alignment Summary**
- **Key Log**: records each invocation with timestamp, agent, action, and auth method.
- **Access Rails**: defines credential type and whether credentials persist across sessions.
- **Git Fossilization**: logs and access manifests are versioned for auditability and narrative history.

**Integration Notes**
- **Auth adapters**: implement one adapter per `method` (e.g., `anthropic_api_key`, `local_server_token`, OAuth flows). Keep adapters pluggable and testable.
- **Persistence**: treat navigator (`copilot`) credentials as long-lived tokens stored securely (OS keychain / secrets manager). Capsules should default to ephemeral credentials with explicit user consent to persist.
- **Lifecycle hooks**: provide `onSummon`, `onAuth`, `onIdleTimeout`, `onDismiss`, and `onError` for each capsule. Emit standardized events to the navigator.
- **Network sandboxing**: for local/WSL/Docker-run capsules (e.g., `ollama`) expose only required ports and use token-based access; map `localhost:11434` via a secure proxy when exposing to UI.
- **Logging**: Emit structured events (JSON) for the invocation log and write to both local logs and a version-controlled `logs/` path if auditability is required.

**Git Fossilization Guidance**
- Keep logs and access manifest snapshots under `logs/` or `audit/` with clear rotation/retention policies.
- Avoid committing secrets. Instead, commit manifests that reference secret IDs or key names (e.g., `secret: keyvault://copilot-navigator-token`) and store actual secrets in a secure store.
- Use human-readable commit messages for significant state changes (e.g., `docs: add cockpit access rails and sample invocation log`), enabling narrative history.

**Next steps (optional)**
- Add a runtime YAML config at `web/configs/cockpit-access-control.yaml` for the UI loader.
- Implement a small loader utility in `web/src/lib/loadCockpitConfig.ts` that fetches and validates the config.
- Implement a small loader utility in `web/src/lib/loadCockpitConfig.ts` that fetches and validates the config.

**Ledger & Script**
- **Ledger path**: repo-relative `logs/key_log.yml` is the canonical invocation ledger.
- **Helper script**: `scripts/capsule_log.ps1` appends structured entries to the ledger. Use it from PowerShell like:

```powershell
.\scripts\capsule_log.ps1 -AgentName "claude"
.\scripts\capsule_log.ps1 -AgentName "ollama" -Action "capsule_dismissed"
```

The script creates `logs/` if missing and writes UTF-8 YAML entries. Do NOT include secrets in ledger entries; record only non-sensitive identifiers.

If you want, I can add the runtime YAML and a loader module now. I can also open a PR with this doc, the ledger script, and supporting files.

**Runtime Config & Loader**
- A runtime YAML is available at `web/configs/cockpit-access-control.yaml` which references the repo-relative ledger at `logs/key_log.yml`.
- A small loader utility is at `web/src/lib/loadLedger.ts` which returns typed `LedgerEntry[]`. It will use `js-yaml` if present, or fallback to a simple parser.

**Rotation helper**
- Monthly rotation script: `scripts/rotate_logs.ps1`. Moves `logs/key_log.yml` to `logs/archive/key_log-YYYY-MM.yml` and creates a fresh ledger header. Run from the repo root:

```powershell
.\scripts\rotate_logs.ps1
# Dry run:
.\scripts\rotate_logs.ps1 -DryRun
```

These additions wire the ledger into the navigator UI path and provide an archivist to avoid repository bloat while preserving auditability.

**Additional Rotation Options**
- Windows native rotation ritual for local Sunshine_Digital ledger: `scripts/rotate_sunshine_ledger.ps1`. Archives `C:\Users\bruce\Sunshine_Digital\key_log.yml` into `C:\Users\bruce\Sunshine_Digital\archive` and creates a fresh ledger file.
- Node/TS rotation helper: `web/src/lib/archiveLedger.ts` — cross-platform rotation that archives `Sunshine_Digital/key_log.yml` to `Sunshine_Digital/archive/key_log-YYYY-MM.yml` and creates a fresh ledger. Useful for integrating into web pipelines or server-side cron jobs.

Run Node helper example (from repo root):

```bash
# from a Node script or task runner
node -e "require('./web/src/lib/archiveLedger').rotateLedger()"
```

Both rotation helpers keep monthly archives for Git fossilization while preventing the live ledger from growing without bound.
