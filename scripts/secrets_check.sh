#!/usr/bin/env bash
# Lists presence of expected GITHUB_ENV keys without printing values

echo "🔒 Secrets check (presence only)"
for key in ANTHROPIC_API_KEY GITHUB_TOKEN GITLAB_TOKEN REPO_WRITE_TOKEN; do
  if [ -n "${!key-}" ]; then
    echo "✔ $key: present in environment"
  else
    echo "✖ $key: NOT present in environment"
  fi
done

# For GitHub Actions environment, check $GITHUB_ENV file if available
if [ -n "$GITHUB_ENV" ] && [ -f "$GITHUB_ENV" ]; then
  echo "\n🔎 Checking $GITHUB_ENV file for exported keys (CI runner)"
  for key in ANTHROPIC_API_KEY GITHUB_TOKEN GITLAB_TOKEN REPO_WRITE_TOKEN; do
    if grep -q "^$key=" "$GITHUB_ENV"; then
      echo "✔ $key: exported to GITHUB_ENV"
    else
      echo "✖ $key: not exported to GITHUB_ENV"
    fi
  done
fi
