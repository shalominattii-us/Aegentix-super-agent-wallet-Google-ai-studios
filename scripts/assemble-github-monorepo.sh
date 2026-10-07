#!/usr/bin/env bash
# ==============================================================================
# AEGENTIX Monorepo Assembly & GitHub Synchronizer
# Target: https://github.com/shalominattii-us/Aegentix.git
# ==============================================================================
set -e

echo "=== [AEGENTIX] Assembling Sovereign GitHub Monorepo ==="

# 1. Ensure Git initialized
if [ ! -d ".git" ]; then
  git init
  git branch -m main
fi

# 2. Configure Git user
git config user.name "shalominattii-us"
git config user.email "magacops2024@gmail.com"

# 3. Configure remotes
git remote remove origin 2>/dev/null || true
git remote remove cybercore 2>/dev/null || true
git remote remove mesh 2>/dev/null || true

git remote add origin https://github.com/shalominattii-us/Aegentix.git
git remote add cybercore https://github.com/shalominattii-us/CYBERCORE-ai-studio.git
git remote add mesh https://github.com/shalominattii-us/AEGENTIX-AGENT-MESH.git

echo "Configured remotes:"
git remote -v

# 4. Stage all files
git add .

# 5. Commit with attestation
COMMIT_MSG="feat(monorepo): assemble AEGENTIX sovereign OS ecosystem for @shalominattii-us"
git commit -m "$COMMIT_MSG" || echo "Working tree clean, nothing to commit"

echo "=== Monorepo Assembly Complete ==="
echo "To push to GitHub, run:"
echo "  git push origin main"
echo "  git push cybercore main"
