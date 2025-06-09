#!/bin/bash

echo "🔧 Fixing commit-msg Hook"
echo "========================="

# Check if commitlint is installed
if npm list @commitlint/cli &>/dev/null; then
    echo "✅ commitlint detected - creating commit-msg hook"

    # Create commit-msg hook
    cat > .husky/commit-msg << 'EOF'
#!/bin/sh
npx --no -- commitlint --edit $1
EOF

else
    echo "📦 commitlint not found. Installing commitlint..."
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

    # Create commit-msg hook
    cat > .husky/commit-msg << 'EOF'
#!/bin/sh
npx --no -- commitlint --edit $1
EOF

    echo "✅ commitlint installed and configured"
fi

# Set permissions and fix line endings
chmod +x .husky/commit-msg

# Fix line endings for Windows
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$MINGW_PREFIX" ]]; then
    sed -i 's/\r$//' .husky/commit-msg 2>/dev/null || true
fi

echo "✅ commit-msg hook fixed"

# Test the hook
echo "🧪 Testing commit-msg hook..."
if [ -x ".husky/commit-msg" ]; then
    echo "✅ Hook is executable"
else
    echo "❌ Hook is not executable"
fi
