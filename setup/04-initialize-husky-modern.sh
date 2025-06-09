#!/bin/bash

echo "🔧 Step 2: Initializing Husky (Modern Approach)..."

# Check if we're in the root of the repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in the root of a Git repository"
    echo "Please run this script from the monorepo root directory"
    exit 1
fi

# Check Husky version to determine the correct command
HUSKY_VERSION=$(npm list husky --depth=0 2>/dev/null | grep -o 'husky@[0-9.]*' | cut -d'@' -f2)
if [[ -z "$HUSKY_VERSION" ]]; then
    echo "❌ Husky not found. Please install it first:"
    echo "npm install --save-dev husky"
    exit 1
fi

MAJOR_VERSION=$(echo "$HUSKY_VERSION" | cut -d'.' -f1)

echo "📦 Detected Husky version: $HUSKY_VERSION"

# Use appropriate initialization command based on version
if [[ "$MAJOR_VERSION" -ge 9 ]]; then
    echo "🆕 Using modern Husky v9+ initialization..."

    # Initialize with the new command
    npx husky init

    # The init command creates .husky/ directory and sets up the prepare script
    echo "✅ Husky initialized with 'husky init'"

else
    echo "🔄 Using legacy Husky v8.x initialization..."

    # Use the legacy command
    npx husky install

    # Add prepare script manually for legacy versions
    npm pkg set scripts.prepare="husky install"

    echo "✅ Husky initialized with 'husky install'"
fi

# Verify initialization
if [ -d ".husky" ]; then
    echo "✅ .husky directory created successfully"
    echo "📁 Contents:"
    ls -la .husky/
else
    echo "❌ Failed to create .husky directory"
    exit 1
fi

# Check if prepare script is set
if grep -q '"prepare".*"husky' package.json; then
    echo "✅ Prepare script configured in package.json"
else
    echo "⚠️  Adding prepare script to package.json..."
    if [[ "$MAJOR_VERSION" -ge 9 ]]; then
        npm pkg set scripts.prepare="husky"
    else
        npm pkg set scripts.prepare="husky install"
    fi
fi

echo "🎉 Husky initialization complete!"
