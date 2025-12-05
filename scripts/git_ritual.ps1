<#
Git Ritual Alias Installer

Usage:
  # Install aliases globally (default)
  pwsh ./scripts/git_ritual.ps1

  # Install aliases for current user/session only
  pwsh ./scripts/git_ritual.ps1 -Global:$false

This script sets a small set of narratable Git aliases for branch, commit,
push/PR, and log rituals. It is opinionated and meant to speed up common
operations while keeping commit messages and branches consistent.
#>

param(
    [switch]$Global = $true
)

function Set-GitAlias {
    param(
        [string]$Name,
        [string]$Command
    )
    $scope = $Global.IsPresent ? "--global" : ""
    git config $scope alias.$Name $Command
    Write-Host "✅ Alias '$Name' set to '$Command'" -ForegroundColor Green
}

# Branching
Set-GitAlias nb '!f() { git checkout -b "$1"; }; f'
Set-GitAlias cb '!f() { git checkout "$1"; }; f'

# Commit with emoji + type
Set-GitAlias cm '!f() { git commit -m "$1: $2"; }; f'

# Stage and commit quickly
Set-GitAlias sc '!f() { git add . && git commit -m "$1"; }; f'

# Log lineage
Set-GitAlias lg 'log --oneline --graph --decorate --all'

# Push and open PR (requires gh CLI)
Set-GitAlias pr '!f() { git push origin HEAD && gh pr create --body-file PR_BODY.md; }; f'

Write-Host "🎉 Git ritual aliases installed. AMEN THE COLLECTIVE." -ForegroundColor Cyan
