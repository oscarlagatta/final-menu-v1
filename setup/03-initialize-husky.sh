#!/bin/bash

echo "🔍 Analyzing Husky Deprecation Warning"
echo "====================================="

# Check Husky version
HUSKY_VERSION=$(npm list husky --depth=0 2>/dev/null | grep -o 'husky@[0-9.]*' | cut -d'@' -f2)
echo "📦 Current Husky version: ${HUSKY_VERSION:-not installed}"

# Explain the deprecation
echo ""
echo "📋 Deprecation Explanation:"
echo "- Husky v8.x: 'husky install' is the standard command"
echo "- Husky v9.x: 'husky install' is deprecated in favor of 'husky init'"
echo "- This is NOT an error - it's a migration notice"
echo ""

# Check which version we're dealing with
if [[ -n "$HUSKY_VERSION" ]]; then
    MAJOR_VERSION=$(echo "$HUSKY_VERSION" | cut -d'.' -f1)
    if [[ "$MAJOR_VERSION" -ge 9 ]]; then
        echo "✅ You have Husky v9+: Use 'husky init' instead of 'husky install'"
        echo "💡 The new command: npx husky init"
    else
        echo "✅ You have Husky v8.x: Continue using 'husky install'"
        echo "💡 Current command: npx husky install"
    fi
fi

