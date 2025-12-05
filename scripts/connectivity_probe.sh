#!/usr/bin/env bash
set -e

echo "🔍 Connectivity probe: Checking GitHub reachability..."

# Ping test
if ping -c 2 github.com > /dev/null 2>&1; then
  echo "✅ Ping to github.com succeeded"
else
  echo "❌ Ping to github.com failed — check DNS/network"
  exit 1
fi

# Curl test
if curl -I -sS https://github.com > /dev/null 2>&1; then
  echo "✅ HTTP reachability to github.com succeeded"
else
  echo "❌ HTTP reachability to github.com failed — check network/proxy"
  exit 1
fi

# Authenticated API probe (optional, only if token env var is set)
if [ -n "$REPO_WRITE_TOKEN" ]; then
  if curl -sS -H "Authorization: token $REPO_WRITE_TOKEN" https://api.github.com/user > /dev/null 2>&1; then
    echo "✅ Authenticated API call succeeded"
  else
    echo "❌ Authenticated API call failed — check REPO_WRITE_TOKEN"
    exit 1
  fi
else
  echo "⚠️ No REPO_WRITE_TOKEN env var set — skipping auth probe"
fi

echo "✅ Connectivity OK — proceed"
