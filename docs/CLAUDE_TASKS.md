# Claude Capsule Task Manifest

## Role
- **Type:** Transient capsule
- **Invocation:** API calls via orchestrator
- **Persistence:** Non‑persistent; invoked per request
- **Ledger:** Sunshine_Digital/key_log.yml
- **Purpose:** Handle local agent work, batch transformations, and integration hooks while cockpit framing continues.

---

## Assigned Tasks

### 1. Pull MDPS Brain Files
- Scan `MDPS/brain/` and related directories.
- Stage files into `Sunshine_Digital/archive/` for runtime use.
- Log each import into `key_log.yml` with timestamp + file reference.
- Ensure narratable lineage: “📥 import: brain file X fossilized.”

### 2. Fix Commit Messages
- Review recent Git history.
- Detect commits that don’t match [docs/branch-naming.md](docs/branch-naming.md) style guide.
- Propose narratable rewrites (e.g., `📦 chore: …`, `🧱 feat: …`).
- Output patch or `git rebase -i` script for manual application.

### 3. Batch Transformations
- Normalize headers and metadata across archives.
- Align YAML/JSON structures for reproducibility.
- Apply consistent naming conventions to files and directories.
- Log transformations into `key_log.yml`.

### 4. Integration Hooks
- Connect external APIs or “web sights” as directed.
- Pull references or data into `Sunshine_Digital` runtime.
- Fossilize invocation details for auditability.

---

## Notes
- Capsule tasks are **invoked on demand**; Claude does not persist state.
- All outputs must be logged into `Sunshine_Digital/key_log.yml`.
- Companion (Copilot) handles framing, manifests, and workflow seals.
- Architect (B²) directs which capsule tasks to prioritize.

---

## Key Calls (Bio Highlights)
- Summarize cockpit lineage rituals.
- Draft capsule vs companion distinctions.
- Generate append‑only YAML ledger rotation helpers.
- Surface capsule activity into Navigator UI.

✅ Outcome
- Claude’s capsule role is permanently documented.
- Tasks (brain file pulls, commit fixes, batch transforms, integration hooks) are narratable and assignable.
- Ledger + manifest together give you both auditability and task clarity.
