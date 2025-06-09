#!/bin/bash

echo "🪝 Step 3: Creating Pre-commit Hook for Nx Monorepo"

# Function to create pre-commit hook based on Husky version
create_precommit_hook() {
    local husky_version=$(npm list husky --depth=0 2>/dev/null | grep -o 'husky@[0-9.]*' | cut -d'@' -f2)
    local major_version=$(echo "$husky_version" | cut -d'.' -f1)

    echo "📦 Husky version: $husky_version"

    if [[ "$major_version" -ge 9 ]]; then
        # Husky v9+ approach
        echo "🆕 Creating pre-commit hook for Husky v9+..."

        # Create pre-commit hook file
        cat > .husky/pre-commit << 'EOF'
npx lint-staged
EOF

    else
        # Husky v8.x approach
        echo "🔄 Creating pre-commit hook for Husky v8.x..."
        npx husky add .husky/pre-commit "npx lint-staged"
    fi

    # Make executable
    chmod +x .husky/pre-commit

    echo "✅ Pre-commit hook created"
}

# Function to verify hook creation
verify_hook_creation() {
    echo "🔍 Verifying pre-commit hook..."

    if [ -f ".husky/pre-commit" ]; then
        echo "✅ Pre-commit hook file exists"

        if [ -x ".husky/pre-commit" ]; then
            echo "✅ Pre-commit hook is executable"
        else
            echo "❌ Pre-commit hook is not executable"
            echo "🔧 Fix: chmod +x .husky/pre-commit"
        fi

        echo "📄 Hook content:"
        cat .husky/pre-commit | sed 's/^/   /'

    else
        echo "❌ Pre-commit hook file not found"
    fi
}

create_precommit_hook
echo ""
verify_hook_creation
