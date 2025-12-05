<#
=== Dry-Run Rotation Ritual (PowerShell) ===
Echoes actions without committing or creating branches

Usage:
  pwsh ./scripts/verify_rotation_dry.ps1
#>

# Compute YYYY-MM
$rotationBranch = "rotation/" + (Get-Date -Format "yyyy-MM")

Write-Host "Would create branch: $rotationBranch"
Write-Host "Would stage files: Sunshine_Digital/archive/*.yml Sunshine_Digital/key_log.yml"
Write-Host "Would commit with message: 📦 chore: monthly ledger rotation archive"

Write-Host "✅ Dry-run complete: no changes made." -ForegroundColor Cyan
