<#
Capsule Invocation Ledger Ritual
Usage:
  .\capsule_log.ps1 -AgentName "claude"
  .\capsule_log.ps1 -AgentName "ollama" -Action "capsule_dismissed"

By default writes to the repo-relative `logs/key_log.yml` file.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$AgentName,
    [string]$Action = "capsule_invoked",
    [string]$LogFile
)

try {
    # Determine repo-relative logs path: <repo_root>/logs/key_log.yml
    $scriptDir = Split-Path -Parent $PSCommandPath
    $repoRoot = Resolve-Path (Join-Path $scriptDir '..')

    if (-not $LogFile) {
        $logsDir = Join-Path $repoRoot 'logs'
        if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }
        $LogFile = Join-Path $logsDir 'key_log.yml'
    }

    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

    $entry = @"
- timestamp: $timestamp
  agent: $AgentName
  action: $Action
  notes: >
    Invocation recorded automatically by PowerShell ritual.
"@

    Add-Content -Path $LogFile -Value $entry -Encoding UTF8
    Write-Host "✅ Invocation of $AgentName recorded in $LogFile" -ForegroundColor Green
}
catch {
    Write-Error "Failed to write invocation: $_"
    exit 1
}
