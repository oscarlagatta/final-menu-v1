#!/bin/bash

echo "🚀 Step 1: Installing dependencies..."

# Check current Prettier version
CURRENT_PRETTIER=$(npm list prettier --depth=0 2>/dev/null | grep -o 'prettier@[0-9.]*' | cut -d'@' -f2)
echo "📦 Current Prettier version: ${CURRENT_PRETTIER:-not installed}"

# Determine if we need to update Prettier
if [[ -z "$CURRENT_PRETTIER" || $(echo "$CURRENT_PRETTIER" | cut -d'.' -f1) -lt 3 ]]; then
    echo "⚠️  Prettier needs to be updated to version 3.x for compatibility with prettier-plugin-tailwindcss"
    echo "Would you like to update Prettier to version 3.x? (y/n)"
    read -r update_prettier

    if [[ "$update_prettier" =~ ^[Yy]$ ]]; then
        echo "📦 Updating Prettier to version 3.x..."
        npm install --save-dev prettier@^3.0.0
    else
        echo "📦 Installing compatible version of prettier-plugin-tailwindcss..."
        # Use a version compatible with Prettier 2.x
        TAILWIND_PLUGIN_VERSION="0.4.1"
    fi
else
    echo "✅ Prettier version 3.x already installed"
fi

# Install core dependencies
echo "📦 Installing core dependencies..."
npm install --save-dev \
  husky \
  lint-staged \
  @eslint/js \
  @nx/eslint-plugin \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint

# Install React-specific plugins
echo "📦 Installing React-specific plugins..."
npm install --save-dev \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import \
  eslint-plugin-simple-import-sort \
  eslint-plugin-unused-imports

# Install Tailwind plugins with version handling
echo "📦 Installing Tailwind plugins..."
if [[ -n "$TAILWIND_PLUGIN_VERSION" ]]; then
    npm install --save-dev eslint-plugin-tailwindcss prettier-plugin-tailwindcss@$TAILWIND_PLUGIN_VERSION
else
    npm install --save-dev eslint-plugin-tailwindcss prettier-plugin-tailwindcss
fi

echo "✅ Dependencies installed successfully"
