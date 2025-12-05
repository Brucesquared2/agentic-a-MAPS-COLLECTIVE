<#
Monthly rotation helper for `logs/key_log.yml`.
Moves current ledger into `logs/archive/key_log-YYYY-MM.yml` and creates a fresh `logs/key_log.yml` header.
Usage:
  .\scripts\rotate_logs.ps1
  .\scripts\rotate_logs.ps1 -DryRun
#>
[CmdletBinding()]
param(
    [switch]$DryRun
)

try {
    $scriptDir = Split-Path -Parent $PSCommandPath
    $repoRoot = Resolve-Path (Join-Path $scriptDir '..')
    $logsDir = Join-Path $repoRoot 'logs'
    $archiveDir = Join-Path $logsDir 'archive'

    if (-not (Test-Path $logsDir)) { Write-Host "No logs/ directory found; nothing to rotate."; exit 0 }
    if (-not (Test-Path $archiveDir)) { if (-not $DryRun) { New-Item -ItemType Directory -Path $archiveDir | Out-Null } }

    $source = Join-Path $logsDir 'key_log.yml'
    if (-not (Test-Path $source)) { Write-Host "No key_log.yml to rotate."; exit 0 }

    $now = Get-Date
    $archiveName = "key_log-{0:yyyy-MM}.yml" -f $now
    $dest = Join-Path $archiveDir $archiveName

    if ($DryRun) {
        Write-Host "[DryRun] Would move $source -> $dest"
    } else {
        Move-Item -Path $source -Destination $dest -Force
        Write-Host "Moved $source -> $dest"

        # Create an empty ledger with a small header
        $header = "# Ledger reset on $(Get-Date -Format o)`n# Previous entries archived to archive/$archiveName`n"
        Set-Content -Path $source -Value $header -Encoding UTF8
        Write-Host "Created new ledger at $source"
    }
}
catch {
    Write-Error "Rotation failed: $_"
    exit 1
}
