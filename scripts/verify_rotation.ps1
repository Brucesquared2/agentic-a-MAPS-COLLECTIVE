<#
=== Verify Rotation Ritual (PowerShell) ===
Simulates creating a rotation/YYYY-MM branch and committing an archive locally.

Usage:
  pwsh ./scripts/verify_rotation.ps1
#>

# Compute YYYY-MM
$rotationBranch = "rotation/" + (Get-Date -Format "yyyy-MM")

Write-Host "Creating branch: $rotationBranch" -ForegroundColor Cyan
# Create branch (fails if branch already exists)
git checkout -b $rotationBranch

# Stage example archive + ledger files (adjust paths if necessary)
git add Sunshine_Digital/archive/*.yml Sunshine_Digital/key_log.yml

# Commit with narratable message
$commitMsg = "📦 chore: monthly ledger rotation archive"
git commit -m $commitMsg

Write-Host "✅ Verification complete: branch + commit conventions applied." -ForegroundColor Green
