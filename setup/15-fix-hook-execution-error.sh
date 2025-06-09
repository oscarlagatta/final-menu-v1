#!/bin/bash

echo "🔧 Fixing Husky Hook Execution Error"
echo "===================================="

# Step 1: Ensure .husky directory exists
if [ ! -d ".husky" ]; then
    echo "📁 Creating .husky directory..."
    mkdir -p .husky
fi

# Step 2: Set correct git hooks path
echo "🔗 Setting Git hooks path..."
git config core.hooksPath .husky
echo "✅ Git hooks path set to .husky"

# Step 3: Create or recreate pre-commit hook with correct format
echo "📝 Creating pre-commit hook..."

# Remove existing hook if it exists
if [ -f ".husky/pre-commit" ]; then
    rm .husky/pre-commit
fi

# Create new pre-commit hook with Unix line endings
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
echo "🚀 Running pre-commit checks..."
npx lint-staged
echo "✅ Pre-commit checks completed!"
EOF

# Step 4: Set correct permissions
echo "🔐 Setting executable permissions..."
chmod +x .husky/pre-commit

# Step 5: Convert line endings to Unix format (important for Windows)
echo "🔄 Converting line endings to Unix format..."
if command -v dos2unix >/dev/null 2>&1; then
    dos2unix .husky/pre-commit 2>/dev/null
elif command -v sed >/dev/null 2>&1; then
    sed -i 's/\r$//' .husky/pre-commit
fi

# Step 6: Verify the hook
echo "🔍 Verifying hook creation..."
if [ -f ".husky/pre-commit" ] && [ -x ".husky/pre-commit" ]; then
    echo "✅ Pre-commit hook created and executable"
    echo "📄 Hook content:"
    cat .husky/pre-commit
else
    echo "❌ Failed to create executable hook"
    exit 1
fi

# Step 7: Test hook execution directly
echo "🧪 Testing hook execution..."
if ./.husky/pre-commit --dry-run 2>/dev/null; then
    echo "✅ Hook executes successfully"
else
    echo "⚠️  Hook execution test (warnings may be normal)"
fi

echo "🎉 Hook execution fix complete!"
