# Branch Naming Convention Guide

**Structure**

<type>/<short-description>

- `type` → category of change (`feature`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `rotation`).
- `short-description` → concise, kebab‑case summary of the branch purpose.

🔹 Types
- `feature/` → new functionality (e.g., loader, UI component).
- `fix/` → bug fixes or corrections.
- `docs/` → documentation updates.
- `chore/` → maintenance, cleanup, rituals.
- `refactor/` → restructuring without changing behavior.
- `test/` → adding or updating tests.
- `ci/` → pipeline/workflow changes.
- `rotation/` → ledger archival or rotation tasks.

🔹 Examples
- `feature/ledger-loader` → adds Node/TS loader utility.
- `feature/navigator-ui` → adds `NavigatorPanel.tsx` component.
- `fix/ledger-paths` → corrects default paths in `archiveLedger.ts`.
- `docs/cockpit-spec` → adds cockpit chat split spec file.
- `chore/powershell-rotation` → adds Windows rotation ritual.
- `ci/ledger-rotation-workflow` → adds GitHub Actions workflow for monthly rotation.
- `rotation/monthly` → auto‑generated branch for monthly ledger archival.

🔹 Guidelines
- Use kebab‑case for descriptions (`navigator-ui`, not `NavigatorUI`).
- Keep descriptions short but narratable (2–4 words).
- Align branch `type` with commit message `type` for consistency.
- Archive/rotation branches should be auto‑named (e.g., `rotation/2025-12`).

✅ Alignment
- **Branch name** → narrates purpose at a glance.
- **Commit message** → narrates change details.
- **PR template** → fossilizes lineage permanently.

---

**Commit Message Style Guide (Reference)**

Use this style for commit messages to make history narratable and searchable.

**Structure**

<emoji> <type>: <short summary>

<detailed body explaining what changed, why, and how>

🔹 Types
- `feat` — new feature (e.g., loader utility, UI component)
- `fix` — bug fix or correction
- `docs` — documentation changes (specs, usage notes)
- `chore` — maintenance, cleanup, rotation rituals
- `refactor` — restructuring code without changing behavior
- `test` — adding or updating tests
- `ci` — pipeline/workflow changes

🔹 Examples
- `🧱 feat: add cockpit chat split spec`
- `📦 chore: add PowerShell rotation ritual for Sunshine_Digital ledger`
- `🌐 feat: add Node/TS archiveLedger helper`
- `🧾 docs: update cockpit-access-control.md with ledger usage examples`
- `🔧 ci: add GitHub Actions workflow for monthly ledger rotation`
- `🎨 feat: add NavigatorPanel.tsx to surface capsule activity in UI`

🔹 Body Guidelines
- Explain what changed.
- Explain why it was needed.
- Mention how it was implemented.
- Keep it concise but narratable.

**Example Commit**

```
🧱 feat: add cockpit chat split spec

Added docs/cockpit-chat-split.md defining dual system chat layout.
Includes YAML manifest for capsule vs navigator split.
Purpose: fossilize cockpit architecture for reproducibility.
```

---

Keep this guide handy when creating branches and commits so repository history remains clear and narratable.
