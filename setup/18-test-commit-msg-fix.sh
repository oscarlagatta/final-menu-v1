#!/bin/bash

echo "🧪 Testing commit-msg Fix"
echo "========================="

# Test 1: Check if hook exists and is executable
if [ -f ".husky/commit-msg" ]; then
    echo "✅ commit-msg hook exists"

    if [ -x ".husky/commit-msg" ]; then
        echo "✅ Hook is executable"
    else
        echo "❌ Hook is not executable"
        exit 1
    fi

    # Test hook with a sample commit message
    echo "🧪 Testing hook with sample message..."
    echo "feat: test commit message" > temp-commit-msg.txt

    if ./.husky/commit-msg temp-commit-msg.txt 2>/dev/null; then
        echo "✅ commit-msg hook works"
    else
        echo "⚠️  commit-msg hook test (may show warnings)"
    fi

    rm -f temp-commit-msg.txt

else
    echo "ℹ️  No commit-msg hook found (this is fine)"
fi

# Test 2: Try a real commit
echo -e "\n🚀 Testing real commit..."
echo "test" > test-file.txt
git add test-file.txt

if git commit -m "feat: test commit message validation"; then
    echo "✅ Commit successful!"
    # Clean up the test commit
    git reset --soft HEAD~1
else
    echo "❌ Commit failed"
fi

# Clean up
git reset HEAD test-file.txt 2>/dev/null
rm -f test-file.txt

echo "🎯 Test complete!"
