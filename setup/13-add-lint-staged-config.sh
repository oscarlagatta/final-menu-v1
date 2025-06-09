#!/bin/bash

echo "📝 Adding lint-staged Configuration"

# Check if lint-staged is already configured
if grep -q '"lint-staged"' package.json; then
    echo "✅ lint-staged configuration already exists"
    echo "📋 Current configuration:"
    grep -A 10 '"lint-staged"' package.json
else
    echo "⚠️  lint-staged configuration not found"
    echo "📝 Adding lint-staged configuration to package.json..."

    # Create a temporary file with the lint-staged configuration
    temp_file=$(mktemp)

    # Read the current package.json and add lint-staged config
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // Add lint-staged configuration
    pkg['lint-staged'] = {
      '*.{js,jsx,ts,tsx}': [
        'nx affected:lint --files --fix --parallel=1',
        'nx format:write --uncommitted'
      ],
      '*.{json,md,css,scss,html}': [
        'nx format:write --uncommitted'
      ]
    };

    // Write back to package.json
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    console.log('✅ lint-staged configuration added');
    "

    # Verify the addition
    if grep -q '"lint-staged"' package.json; then
        echo "✅ lint-staged configuration successfully added"
        echo "📋 Added configuration:"
        grep -A 10 '"lint-staged"' package.json
    else
        echo "❌ Failed to add lint-staged configuration"
        exit 1
    fi
fi

# Install lint-staged if not already installed
if ! npm list lint-staged &>/dev/null; then
    echo "📦 Installing lint-staged..."
    npm install --save-dev lint-staged
    echo "✅ lint-staged installed"
else
    echo "✅ lint-staged already installed"
fi

echo "🎉 lint-staged configuration complete!"
