param(
    [string]$LogFile = "C:\Users\bruce\Sunshine_Digital\key_log.yml",
    [string]$ArchiveDir = "C:\Users\bruce\Sunshine_Digital\archive"
)

# Ensure archive directory exists
if (!(Test-Path $ArchiveDir)) {
    New-Item -ItemType Directory -Path $ArchiveDir | Out-Null
}

# Build archive filename with current month/year
$timestamp = (Get-Date).ToString("yyyy-MM")
$archiveFile = Join-Path $ArchiveDir "key_log-$timestamp.yml"

# Move current log to archive
if (Test-Path $LogFile) {
    Move-Item -Path $LogFile -Destination $archiveFile -Force
    Write-Host "📦 Archived ledger to $archiveFile" -ForegroundColor Cyan
}

# Create a fresh empty ledger
New-Item -ItemType File -Path $LogFile -Force | Out-Null
Write-Host "✅ New key_log.yml created for fresh entries" -ForegroundColor Green

# Publish rotation event (append to ledger)
$rotationEntry = @"
- timestamp: $(Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
  agent: system
  action: rotation
  notes: >
    Monthly rotation ritual cleared active assignments.
"@
Add-Content -Path $LogFile -Value $rotationEntry
Write-Host "⚡ Rotation event published to ledger" -ForegroundColor Yellow
