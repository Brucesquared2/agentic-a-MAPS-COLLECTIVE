# Pull Request Checklist

Please fill in the following when creating a pull request.

- **PR Title**: Use the commit-style prefix (emoji + type) followed by a short summary.
  - Example: `🧱 feat: add cockpit chat split spec`

- **Branch name**: Use `<type>/<short-description>` (see `docs/branch-naming.md`).

- **Summary**: Brief description of what this PR changes and why.

- **Files changed**: List notable files added/updated.

- **Testing**: How to verify the change locally.

- **Notes for reviewers**: Any important context or tradeoffs.

---

## Usage Guidance
- To create a PR with the prepared `PR_BODY.md`, use the GitHub CLI from the repo root:

```bash
gh pr create --body-file PR_BODY.md
```

- We provide `scripts/git_ritual.ps1` to install helpful git aliases for creating branches, committing with emoji, and opening PRs.

*** End Patch
