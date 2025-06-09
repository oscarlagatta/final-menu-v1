#!/bin/bash

echo "🔍 Diagnosing commit-msg Hook Issue"
echo "==================================="

# Check if commit-msg hook exists
echo "1️⃣  Checking commit-msg hook..."
if [ -f ".husky/commit-msg" ]; then
    echo "✅ .husky/commit-msg file exists"

    # Check permissions
    if [ -x ".husky/commit-msg" ]; then
        echo "✅ File is executable"
    else
        echo "❌ File is not executable"
    fi

    # Show content
    echo "📄 File content:"
    cat -A .husky/commit-msg

    # Check file size
    file_size=$(wc -c < .husky/commit-msg)
    echo "📏 File size: $file_size bytes"

else
    echo "❌ .husky/commit-msg file not found"
fi

# Check what's in .husky directory
echo -e "\n2️⃣  .husky directory contents:"
ls -la .husky/

# Check if commitlint is installed (common use for commit-msg hook)
echo -e "\n3️⃣  Checking commitlint installation..."
if npm list @commitlint/cli &>/dev/null; then
    echo "✅ commitlint is installed"
else
    echo "ℹ️  commitlint not installed (commit-msg hook may not be needed)"
fi

echo -e "\n🎯 Diagnosis complete!"
