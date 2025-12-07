# List Buddy Status Report Script (PowerShell)
# Quick script to show status of the 34 core items

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  List Buddy - Status Report" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if required files exist
if (-not (Test-Path "STATUS_CHECKLIST.md")) {
    Write-Host "❌ Error: STATUS_CHECKLIST.md not found" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "REPAIR_STATUS.md")) {
    Write-Host "❌ Error: REPAIR_STATUS.md not found" -ForegroundColor Red
    exit 1
}

# Count total items
$totalMatches = Select-String -Path "STATUS_CHECKLIST.md" -Pattern "^\- \[ \]" -AllMatches
$totalItems = if ($totalMatches) { $totalMatches.Matches.Count } else { 0 }

$completedMatches = Select-String -Path "STATUS_CHECKLIST.md" -Pattern "^\- \[x\]" -AllMatches
$completedItems = if ($completedMatches) { $completedMatches.Matches.Count } else { 0 }

Write-Host "📊 Overall Progress:" -ForegroundColor Green
Write-Host "   Total Items: $totalItems"
Write-Host "   Completed: $completedItems"
Write-Host "   Remaining: $($totalItems - $completedItems)"
Write-Host ""

# Count by priority
$criticalMatches = Select-String -Path "REPAIR_STATUS.md" -Pattern "🔴" -AllMatches
$critical = if ($criticalMatches) { $criticalMatches.Matches.Count } else { 0 }

$highMatches = Select-String -Path "REPAIR_STATUS.md" -Pattern "🟡" -AllMatches
$high = if ($highMatches) { $highMatches.Matches.Count } else { 0 }

$mediumMatches = Select-String -Path "REPAIR_STATUS.md" -Pattern "🟢" -AllMatches
$medium = if ($mediumMatches) { $mediumMatches.Matches.Count } else { 0 }

Write-Host "🎯 Priority Breakdown:" -ForegroundColor Yellow
Write-Host "   🔴 Critical: $critical items"
Write-Host "   🟡 High: $high items"
Write-Host "   🟢 Medium: $medium items"
Write-Host ""

# Show category summary
Write-Host "📁 Categories:" -ForegroundColor Magenta
Write-Host "   Infrastructure & Build: 8 items"
Write-Host "   Security & Authentication: 5 items"
Write-Host "   Features & Functionality: 12 items"
Write-Host "   UI/UX & Documentation: 6 items"
Write-Host "   DevOps & Monitoring: 3 items"
Write-Host ""

Write-Host "📋 Quick Access:" -ForegroundColor Blue
Write-Host "   View Checklist: Get-Content STATUS_CHECKLIST.md"
Write-Host "   View Details:   Get-Content REPAIR_STATUS.md"
Write-Host "   View Guide:     Get-Content LIST_BUDDY_GUIDE.md"
Write-Host ""

Write-Host "✅ List Buddy is ready to help!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
