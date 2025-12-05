#!/usr/bin/env bash
set -e

echo "🔍 Pre-push: running centralized connectivity probe..."

scripts/connectivity_probe.sh

echo "✅ Pre-push probe passed"
