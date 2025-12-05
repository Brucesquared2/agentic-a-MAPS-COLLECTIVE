# 📜 Pull Request: Cockpit Chat Split + Ledger Helpers

## ✨ Summary
Introduces dual system chat architecture spec, append‑only ledger rituals, rotation helpers, and optional UI/workflow wiring. Fossilizes capsule invocation lineage and surfaces activity into cockpit navigator.

## 🔧 Changes Included
- Spec file: `docs/cockpit-chat-split.md`
- Ledger rituals: `rotate_sunshine_ledger.ps1`, `web/src/lib/archiveLedger.ts`
- Loader utility: `web/src/lib/loadLedger.ts`
- Navigator UI (optional): `web/src/components/NavigatorPanel.tsx`
- Scheduled rotation workflow (optional): `.github/workflows/ledger-rotation.yml`
- Docs update: `cockpit-access-control.md`

## 🧱 Purpose
- Establish split‑screen cockpit (capsules left, Copilot right).
- Maintain append‑only YAML ledger for auditability.
- Provide cross‑platform rotation helpers.
- Surface capsule activity into cockpit UI.
- Fossilize lineage in Git.

## ✅ Testing
- Run PowerShell ritual → archives ledger, creates fresh file.
- Run Node helper → same behavior cross‑platform.
- Mount NavigatorPanel → displays last 10 invocations.
- Verify workflow rotates ledger monthly.

## 📦 Next Steps
- Merge with Navigator UI or workflow included.
- Bundle into main branch to fossilize lineage.
- Extend loader with polling/WebSocket for live updates.

Usage:

```powershell
gh pr create --body-file PR_BODY.md
```
