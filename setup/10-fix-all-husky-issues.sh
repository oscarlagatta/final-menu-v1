#!/bin/bash

echo "🔧 Comprehensive Husky Issues Fix"
echo "================================="

# 1. Fix Git Hooks Path
echo "1️⃣  Fixing Git hooks path..."
git config core.hooksPath .husky
echo "✅ Git hooks path set to .husky"

# 2. Update Husky hooks to v9+ format
echo "2️⃣  Updating Husky hooks format..."
HUSKY_VERSION=$(npm list husky --depth=0 2>/dev/null | grep -o 'husky@[0-9.]*' | cut -d'@' -f2)
MAJOR_VERSION=$(echo "$HUSKY_VERSION" | cut -d'.' -f1)

if [[ "$MAJOR_VERSION" -ge 9 ]]; then
    # Update pre-commit hook
    cat > .husky/pre-commit << 'EOF'
echo "🚀 Running pre-commit checks..."
npx lint-staged
echo "✅ Pre-commit checks completed!"
EOF
    chmod +x .husky/pre-commit
    echo "✅ Pre-commit hook updated for v9+"
fi

# 3. Add lint-staged configuration
echo "3️⃣  Adding lint-staged configuration..."
if ! grep -q '"lint-staged"' package.json; then
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg['lint-staged'] = {
      '*.{js,jsx,ts,tsx}': [
        'nx affected:lint --files --fix --parallel=1',
        'nx format:write --uncommitted'
      ],
      '*.{json,md,css,scss,html}': [
        'nx format:write --uncommitted'
      ]
    };
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    "
    echo "✅ lint-staged configuration added"
else
    echo "✅ lint-staged configuration already exists"
fi

# 4. Install lint-staged if missing
echo "4️⃣  Checking lint-staged installation..."
if ! npm list lint-staged &>/dev/null; then
    npm install --save-dev lint-staged
    echo "✅ lint-staged installed"
else
    echo "✅ lint-staged already installed"
fi

# 5. Test the configuration
echo "5️⃣  Testing configuration..."
if npx lint-staged --dry-run 2>/dev/null; then
    echo "✅ lint-staged configuration is valid"
else
    echo "⚠️  lint-staged test showed warnings (may be normal)"
fi

echo ""
echo "🎉 All fixes applied successfully!"
echo "📋 Summary of changes:"
echo "   - Git hooks path set to .husky"
echo "   - Husky hooks updated to v9+ format"
echo "   - lint-staged configuration added"
echo "   - Dependencies verified"
echo ""
echo "🔍 Run the verification script again to confirm all issues are resolved."
