#!/bin/bash

echo "🔍 Checking Prettier configuration..."

# Check Prettier version
PRETTIER_VERSION=$(npx prettier --version 2>/dev/null)
echo "📦 Prettier version: ${PRETTIER_VERSION:-not installed}"

# Check if prettier config exists
if [ -f ".prettierrc.js" ] || [ -f "prettier.config.js" ] || [ -f ".prettierrc" ]; then
    echo "✅ Prettier configuration file found"

    # Display config
    if [ -f ".prettierrc.js" ]; then
        echo "📄 .prettierrc.js content:"
        cat .prettierrc.js
    elif [ -f "prettier.config.js" ]; then
        echo "📄 prettier.config.js content:"
        cat prettier.config.js
    elif [ -f ".prettierrc" ]; then
        echo "📄 .prettierrc content:"
        cat .prettierrc
    fi
else
    echo "⚠️ No Prettier configuration file found"

    # Create basic config
    echo "Creating basic Prettier configuration..."
    cat > .prettierrc.js << 'EOF'
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
};
EOF
    echo "✅ Created .prettierrc.js"
fi

# Test Prettier with a sample file
echo "Testing Prettier with a sample file..."
echo "const test = { a: 1, b: 2 };" > test-prettier.js
npx prettier --write test-prettier.js
cat test-prettier.js
rm test-prettier.js

echo "✅ Prettier check complete"
