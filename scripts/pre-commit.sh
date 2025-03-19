#!/bin/bash

echo "Running pre-commit checks..."

# Run typecheck
echo "Running typecheck..."
pnpm typecheck || exit 1

# Run lint
echo "Running lint..."
pnpm lint || exit 1

# Run format check
echo "Running format check..."
pnpm format || exit 1

# Run build
echo "Running build..."
pnpm build || exit 1

echo "All checks passed! 🎉" 