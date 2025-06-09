#!/bin/bash

echo "🔧 Step 2: Husky Installation Process Analysis"

# Function to analyze what happens during husky install/init
analyze_husky_installation() {
    echo "📋 What happens during Husky initialization:"
    echo ""

    echo "1. 📁 Creates .husky directory structure:"
    echo "   .husky/"
    echo "   ├── _/"
    echo "   │   └── husky.sh (helper script)"
    echo "   └── (hook files will be added here)"
    echo ""

    echo "2. ⚙️  Configures Git to use .husky directory for hooks:"
    echo "   - Sets git config core.hooksPath to .husky"
    echo "   - This tells Git to look for hooks in .husky instead of .git/hooks"
    echo ""

    echo "3. 📝 Updates package.json with prepare script:"
    echo "   - Adds 'prepare': 'husky install' (v8.x) or 'husky' (v9.x)"
    echo "   - This ensures hooks are installed when team members run 'npm install'"
    echo ""

    echo "4. 🔗 Creates symbolic link or reference in .git/hooks:"
    echo "   - Links .git/hooks/pre-commit to .husky infrastructure"
    echo ""
}

# Function to verify installation
verify_installation() {
    echo "🔍 Verifying Husky installation:"

    # Check .husky directory
    if [ -d ".husky" ]; then
        echo "✅ .husky directory exists"

        # Check for husky.sh helper
        if [ -f ".husky/_/husky.sh" ]; then
            echo "✅ Husky helper script found"
        else
            echo "❌ Husky helper script missing"
        fi
    else
        echo "❌ .husky directory not found"
    fi

    # Check git config
    local hooks_path=$(git config core.hooksPath 2>/dev/null)
    if [ "$hooks_path" = ".husky" ]; then
        echo "✅ Git hooks path configured correctly: $hooks_path"
    else
        echo "⚠️  Git hooks path: ${hooks_path:-default (.git/hooks)}"
    fi

    # Check prepare script
    if grep -q '"prepare"' package.json; then
        local prepare_script=$(grep '"prepare"' package.json)
        echo "✅ Prepare script found: $prepare_script"
    else
        echo "❌ Prepare script not found in package.json"
    fi
}

analyze_husky_installation
echo ""
verify_installation
