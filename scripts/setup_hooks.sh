#!/usr/bin/env bash
set -e

echo "🔧 Setting up Git hooks and pre-commit..."

# Ensure .git/hooks exists
mkdir -p .git/hooks

# Install pre-commit hooks via pre-commit framework if available
if command -v pre-commit >/dev/null 2>&1; then
  pre-commit install
  echo "✅ pre-commit installed"
else
  echo "⚠️ pre-commit not found — please install with 'pip install pre-commit'"
fi

# Copy pre-push script into .git/hooks/pre-push
if [ -f "scripts/prepush_connectivity.sh" ]; then
  cp scripts/prepush_connectivity.sh .git/hooks/pre-push
  chmod +x .git/hooks/pre-push
  echo "✅ pre-push hook installed"
else
  echo "⚠️ scripts/prepush_connectivity.sh not found — skipping pre-push installation"
fi

echo "🎉 Hooks setup complete"
