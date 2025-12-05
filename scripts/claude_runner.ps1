<#
=== Claude Capsule Task Runner (PowerShell) ===
Reads docs/CLAUDE_TASKS.md, invokes Claude API for each task,
logs results into Sunshine_Digital/key_log.yml

Usage:
  pwsh ./scripts/claude_runner.ps1
#>

param(
    [switch]$DryRun
)

$tasksPath = Join-Path -Path (Get-Location) -ChildPath "docs\CLAUDE_TASKS.md"
$ledgerPath = Join-Path -Path (Get-Location) -ChildPath "Sunshine_Digital\key_log.yml"

function Log-Invocation($Agent, $Task, $Response) {
    $entry = @{
        timestamp = (Get-Date).ToString("o")
        agent     = $Agent
        task      = $Task
        response  = $Response
    }

    if ($DryRun) {
        Write-Host "[DRY-RUN] Would log entry:" ($entry | ConvertTo-Json -Depth 3)
        return
    }

    if (Test-Path $ledgerPath) {
        try {
            $raw = Get-Content $ledgerPath -Raw
            $ledger = ConvertFrom-Yaml $raw
        } catch {
            Write-Warning "Failed to read existing ledger, starting fresh: $_"
            $ledger = @()
        }
    } else {
        $ledger = @()
    }

    $ledger += $entry
    try {
        $dir = Split-Path $ledgerPath -Parent
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
        $ledger | ConvertTo-Yaml | Set-Content -Path $ledgerPath -Encoding UTF8
        Write-Host "✅ Logged $Agent task: $Task"
    } catch {
        Write-Error "Failed to write ledger: $_"
    }
}

function Invoke-Claude($Task) {
    if ($DryRun) {
        Write-Host "[DRY-RUN] Would invoke Claude for task: $Task"
        Log-Invocation "Claude Capsule" $Task "Simulated response"
        return
    }

    if (-not $env:CLAUDE_API_KEY) { throw "CLAUDE_API_KEY not set in environment" }

    $body = @{
        model = "claude-3-opus-20240229"
        max_tokens = 512
        messages = @(@{ role = "user"; content = $Task })
    } | ConvertTo-Json -Depth 4

    try {
        $response = Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method Post -Headers @{ Authorization = "Bearer $env:CLAUDE_API_KEY"; "Content-Type" = "application/json" } -Body $body
        $text = $null
        if ($response -and $response.content -and $response.content[0] -and $response.content[0].text) { $text = $response.content[0].text }
        if (-not $text) { $text = ($response | ConvertTo-Json -Depth 4) }
        Log-Invocation "Claude Capsule" $Task $text
    } catch {
        Write-Warning "Claude invocation failed: $_"
        Log-Invocation "Claude Capsule (error)" $Task $_.Exception.Message
    }
}

# Parse tasks (headings like ### 1. Pull MDPS Brain Files)
$tasks = @()
if (Test-Path $tasksPath) {
    $lines = Get-Content $tasksPath
    foreach ($line in $lines) {
        if ($line -match '^###\s+\d+\.\s+(.+)$') { $tasks += $Matches[1].Trim() }
    }
} else {
    Write-Error "Tasks file not found at $tasksPath"
    exit 1
}

foreach ($task in $tasks) {
    Write-Host "Invoking Claude for task: $task"
    Invoke-Claude $task
}

Write-Host "All tasks processed."
