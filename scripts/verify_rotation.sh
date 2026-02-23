#!/usr/bin/env bash
# === Verify Rotation Ritual (Bash) ===
# Simulates creating a rotation/YYYY-MM branch and committing an archive locally.

set -euo pipefail

rotationBranch="rotation/$(date +'%Y-%m')"
echo "Creating branch: $rotationBranch"
git checkout -b "$rotationBranch"

# Stage example archive + ledger files (adjust paths if necessary)
git add Sunshine_Digital/archive/*.yml Sunshine_Digital/key_log.yml || true

# Commit with narratable message
commitMsg="📦 chore: monthly ledger rotation archive"
git commit -m "$commitMsg"

echo "✅ Verification complete: branch + commit conventions applied."
