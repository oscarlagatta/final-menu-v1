#!/bin/bash

echo "🔍 Step 1: Verifying Directory Structure"

# Check if we're in the monorepo root
check_monorepo_root() {
    local checks_passed=0
    local total_checks=4

    echo "Checking monorepo root indicators..."

    # Check 1: package.json exists
    if [ -f "package.json" ]; then
        echo "✅ package.json found"
        ((checks_passed++))
    else
        echo "❌ package.json not found"
    fi

    # Check 2: nx.json exists
    if [ -f "nx.json" ]; then
        echo "✅ nx.json found"
        ((checks_passed++))
    else
        echo "❌ nx.json not found"
    fi

    # Check 3: .git directory exists
    if [ -d ".git" ]; then
        echo "✅ .git directory found"
        ((checks_passed++))
    else
        echo "❌ .git directory not found"
    fi

    # Check 4: apps or libs directories exist
    if [ -d "apps" ] || [ -d "libs" ]; then
        echo "✅ Nx workspace structure found (apps/libs directories)"
        ((checks_passed++))
    else
        echo "❌ Nx workspace structure not found"
    fi

    echo "📊 Checks passed: $checks_passed/$total_checks"

    if [ $checks_passed -eq $total_checks ]; then
        echo "🎉 You're in the correct monorepo root directory"
        return 0
    else
        echo "❌ Please navigate to the monorepo root directory"
        return 1
    fi
}

check_monorepo_root
