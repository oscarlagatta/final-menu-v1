#!/bin/bash

echo "⚙️  Advanced Husky Hook Configuration for Nx Monorepo"

# Create comprehensive pre-commit hook
create_comprehensive_precommit() {
    cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

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

# Check for test files and run affected tests
if git diff --cached --name-only | grep -E '\.(spec|test)\.(ts|tsx|js|jsx)$' > /dev/null; then
    echo "🧪 Test files detected, running affected tests..."
    npx nx affected:test --passWithNoTests --parallel=3
fi

echo "✅ Pre-commit checks completed successfully!"
EOF

    chmod +x .husky/pre-commit
    echo "✅ Comprehensive pre-commit hook created"
}

# Create pre-push hook for additional checks
create_prepush_hook() {
    cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

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
    echo "✅ Pre-push hook created"
}

# Create commit-msg hook for conventional commits
create_commitmsg_hook() {
    # First install commitlint if not already installed
    if ! npm list @commitlint/cli &>/dev/null; then
        echo "📦 Installing commitlint..."
        npm install --save-dev @commitlint/cli @commitlint/config-conventional

        # Create commitlint config
        cat > commitlint.config.js << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'app',
        'lib',
        'shared',
        'ui',
        'api',
        'config',
        'deps',
        'ci',
        'docs'
      ]
    ]
  }
};
EOF
    fi

    cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
EOF

    chmod +x .husky/commit-msg
    echo "✅ Commit message hook created"
}

# Execute hook creation
create_comprehensive_precommit
echo ""
create_prepush_hook
echo ""
create_commitmsg_hook
