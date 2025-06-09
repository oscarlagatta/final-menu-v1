#!/bin/bash

echo "🔧 Fixing Git Hooks Path Configuration"

# Check current git hooks path
current_path=$(git config core.hooksPath 2>/dev/null)
echo "📋 Current git hooks path: ${current_path:-default (.git/hooks)}"

# Set the correct path
if [ "$current_path" != ".husky" ]; then
    echo "⚙️  Setting git hooks path to .husky..."
    git config core.hooksPath .husky

    # Verify the change
    new_path=$(git config core.hooksPath)
    if [ "$new_path" = ".husky" ]; then
        echo "✅ Git hooks path successfully set to: $new_path"
    else
        echo "❌ Failed to set git hooks path"
        exit 1
    fi
else
    echo "✅ Git hooks path already correctly configured"
fi

# Verify hooks are working
echo "🔍 Verifying hooks are accessible..."
if [ -d ".husky" ]; then
    echo "📁 .husky directory contents:"
    ls -la .husky/
else
    echo "❌ .husky directory not found"
    exit 1
fi

echo "🎉 Git hooks path configuration complete!"
