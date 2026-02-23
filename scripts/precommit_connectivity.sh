#!/usr/bin/env bash
set -e

echo "🔍 Pre-commit: Checking connectivity to GitHub..."

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

echo "✅ Connectivity OK — commit allowed"
