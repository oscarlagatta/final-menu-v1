#!/bin/bash

echo "🔧 Setting up Prettier for Nx monorepo..."

# Check if nx.json exists
if [ ! -f "nx.json" ]; then
    echo "❌ nx.json not found. Are you in an Nx workspace?"
    exit 1
fi

# Ensure Prettier is configured in nx.json
if grep -q "format" nx.json; then
    echo "✅ Format target already configured in nx.json"
else
    echo "⚠️ Format target not found in nx.json"
    echo "Please add the following to your nx.json targetDefaults section:"
    echo '
  "targetDefaults": {
    "format": {
      "inputs": ["default", "{workspaceRoot}/.prettierrc.js", "{workspaceRoot}/.prettierignore"]
    },
    // other targets...
  }'
fi

# Create or update .prettierignore
cat > .prettierignore << 'EOF'
# Add files/directories to ignore for prettier
node_modules
dist
coverage
.nx
EOF

# Add format scripts to package.json
npm pkg set scripts.format="nx format:write"
npm pkg set scripts.format:check="nx format:check"

echo "✅ Nx Prettier setup complete"
