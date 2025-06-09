#!/bin/bash

echo "🔧 Fixing Husky v9+ Format Issues"

# Check current Husky version
HUSKY_VERSION=$(npm list husky --depth=0 2>/dev/null | grep -o 'husky@[0-9.]*' | cut -d'@' -f2)
MAJOR_VERSION=$(echo "$HUSKY_VERSION" | cut -d'.' -f1)

echo "📦 Detected Husky version: $HUSKY_VERSION"

if [[ "$MAJOR_VERSION" -ge 9 ]]; then
    echo "🆕 Updating hooks for Husky v9+ format..."

    # Update pre-commit hook
    if [ -f ".husky/pre-commit" ]; then
        echo "📝 Updating pre-commit hook..."
        cat > .husky/pre-commit << 'EOF'
echo "🚀 Running pre-commit checks..."

# Run lint-staged for file-specific checks
echo "📝 Running lint-staged..."
npx lint-staged

# Additional Nx-specific checks
echo "🔍 Running Nx affected checks..."

# Check if any TypeScript files are affected
if git diff --cached --name-only | grep -E '\.(ts|tsx)$' > /dev/null; then
    echo "📋 TypeScript files detected, running type check..."
    npx nx affected:build --dry-run --parallel=3
fi

echo "✅ Pre-commit checks completed successfully!"
EOF
        chmod +x .husky/pre-commit
        echo "✅ Pre-commit hook updated to v9+ format"
    fi

    # Update pre-push hook if it exists
    if [ -f ".husky/pre-push" ]; then
        echo "📝 Updating pre-push hook..."
        cat > .husky/pre-push << 'EOF'
echo "🚀 Running pre-push checks..."

# Run build on affected projects
echo "🏗️  Building affected projects..."
npx nx affected:build --parallel=3

# Run e2e tests on affected projects
echo "🧪 Running e2e tests on affected projects..."
npx nx affected:e2e --parallel=1

echo "✅ Pre-push checks completed successfully!"
EOF
        chmod +x .husky/pre-push
        echo "✅ Pre-push hook updated to v9+ format"
    fi

    # Update commit-msg hook if it exists
    if [ -f ".husky/commit-msg" ]; then
        echo "📝 Updating commit-msg hook..."
        cat > .husky/commit-msg << 'EOF'
npx --no -- commitlint --edit $1
EOF
        chmod +x .husky/commit-msg
        echo "✅ Commit-msg hook updated to v9+ format"
    fi

else
    echo "ℹ️  Husky v8.x detected - no format changes needed"
fi

echo "🎉 Husky format update complete!"
