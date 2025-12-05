Logs directory

This folder contains invocation ledger snapshots and other non-secret logs related to the cockpit.

Guidance:
- The primary ledger file is `key_log.yml` and is append-only by design for auditability.
- Do NOT commit secrets or API keys into `logs/`.
- If you need to record a reference to a secret, store a non-secret identifier (e.g., `secret: keyvault://copilot-navigator-token`).
- Rotation/Retention: periodically archive or rotate large logs to avoid repository bloat.
