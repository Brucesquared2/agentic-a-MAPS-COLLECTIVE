#!/usr/bin/env bash
set -e

echo "🔍 Connectivity probe: Checking GitHub reachability..."

fail_or_warn() {
  local msg="$1"
  if [ "${HOOK_MODE:-}" = "pre-commit" ]; then
    echo "⚠️ $msg — continuing because HOOK_MODE=pre-commit"
    return 0
  else
    echo "❌ $msg"
    exit 1
  fi
}

# Ping test
if ping -c 2 github.com > /dev/null 2>&1; then
  echo "✅ Ping to github.com succeeded"
else
  fail_or_warn "Ping to github.com failed — check DNS/network"
fi

# Curl test
if curl -I -sS https://github.com > /dev/null 2>&1; then
  echo "✅ HTTP reachability to github.com succeeded"
else
  fail_or_warn "HTTP reachability to github.com failed — check network/proxy"
fi

# Authenticated API probe (optional, only if token env var is set)
if [ -n "$REPO_WRITE_TOKEN" ]; then
  if curl -sS -H "Authorization: token $REPO_WRITE_TOKEN" https://api.github.com/user > /dev/null 2>&1; then
    echo "✅ Authenticated API call succeeded"
  else
    fail_or_warn "Authenticated API call failed — check REPO_WRITE_TOKEN"
  fi
else
  echo "⚠️ No REPO_WRITE_TOKEN env var set — skipping auth probe"
fi

echo "✅ Connectivity OK — proceed"
