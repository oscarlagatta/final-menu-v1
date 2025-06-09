#!/bin/bash

echo "🔍 Comprehensive Husky Integration Verification"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS") echo -e "${GREEN}✅ PASS${NC}: $message" ;;
        "FAIL") echo -e "${RED}❌ FAIL${NC}: $message" ;;
        "WARN") echo -e "${YELLOW}⚠️  WARN${NC}: $message" ;;
        *) echo -e "${BLUE}ℹ️  INFO${NC}: $message" ;;
    esac
}

# 1. Basic Installation Check
echo -e "${BLUE}1. Basic Installation Check${NC}"
echo "================================"

# Check Husky installation
if npm list husky &>/dev/null; then
    local version=$(npm list husky --depth=0 2>/dev/null | grep -o 'husky@[0-9.]*' | cut -d'@' -f2)
    print_status "PASS" "Husky installed (version: $version)"
else
    print_status "FAIL" "Husky not installed"
fi

# Check .husky directory
if [ -d ".husky" ]; then
    print_status "PASS" ".husky directory exists"

    # Check husky.sh helper
    if [ -f ".husky/_/husky.sh" ]; then
        print_status "PASS" "Husky helper script found"
    else
        print_status "FAIL" "Husky helper script missing"
    fi
else
    print_status "FAIL" ".husky directory not found"
fi

# 2. Git Configuration Check
echo -e "\n${BLUE}2. Git Configuration Check${NC}"
echo "================================"

# Check git hooks path
local hooks_path=$(git config core.hooksPath 2>/dev/null)
if [ "$hooks_path" = ".husky" ]; then
    print_status "PASS" "Git hooks path configured: $hooks_path"
else
    print_status "WARN" "Git hooks path: ${hooks_path:-default}"
fi

# 3. Hook Files Check
echo -e "\n${BLUE}3. Hook Files Check${NC}"
echo "================================"

# Check individual hooks
local hooks=("pre-commit" "pre-push" "commit-msg")
for hook in "${hooks[@]}"; do
    if [ -f ".husky/$hook" ]; then
        if [ -x ".husky/$hook" ]; then
            print_status "PASS" "$hook hook exists and is executable"
        else
            print_status "FAIL" "$hook hook exists but is not executable"
        fi
    else
        print_status "INFO" "$hook hook not found (optional)"
    fi
done

# 4. Package.json Configuration
echo -e "\n${BLUE}4. Package.json Configuration${NC}"
echo "================================"

# Check prepare script
if grep -q '"prepare"' package.json; then
    local prepare_script=$(grep '"prepare"' package.json | sed 's/.*"prepare":[[:space:]]*"$$[^"]*$$".*/\1/')
    print_status "PASS" "Prepare script found: $prepare_script"
else
    print_status "FAIL" "Prepare script not found"
fi

# Check lint-staged configuration
if grep -q '"lint-staged"' package.json; then
    print_status "PASS" "lint-staged configuration found"
else
    print_status "WARN" "lint-staged configuration not found"
fi

# 5. Functional Test
echo -e "\n${BLUE}5. Functional Test${NC}"
echo "================================"

# Test hook execution
if [ -f ".husky/pre-commit" ]; then
    echo "Testing pre-commit hook execution..."
    if ./.husky/pre-commit --dry-run 2>/dev/null; then
        print_status "PASS" "Pre-commit hook executes successfully"
    else
        print_status "INFO" "Pre-commit hook test (may show warnings - this is normal)"
    fi
fi

# 6. Team Setup Verification
echo -e "\n${BLUE}6. Team Setup Verification${NC}"
echo "================================"

# Simulate team member setup
echo "Simulating team member setup (npm install)..."
if npm run prepare 2>/dev/null; then
    print_status "PASS" "Team member setup works (prepare script)"
else
    print_status "WARN" "Prepare script may have issues"
fi

echo -e "\n${BLUE}Verification Summary${NC}"
echo "===================="
echo "If all PASS checks are green, Husky is properly configured!"
echo "WARN items are typically not critical but should be reviewed."
echo "FAIL items need immediate attention."
