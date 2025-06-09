# Comprehensive Developer Guide to Husky and Git Hooks

**Version:** 1.0  
**Date:** December 2024  
**Author:** Development Team  
**Document Type:** Technical Guide

---

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Git Hooks and Husky](#understanding-git-hooks-and-husky)
3. [Hook Types and Their Purpose](#hook-types-and-their-purpose)
4. [Installation and Setup](#installation-and-setup)
5. [Interpreting Hook Output](#interpreting-hook-output)
6. [Troubleshooting Common Issues](#troubleshooting-common-issues)
7. [Tool Integration](#tool-integration)
8. [Customizing Hooks for Code Quality](#customizing-hooks-for-code-quality)
9. [Team Management and Updates](#team-management-and-updates)
10. [Resolving Verification Warnings](#resolving-verification-warnings)
11. [Best Practices](#best-practices)
12. [Appendices](#appendices)

---

## 1. Introduction

### 1.1 Purpose of This Guide

This comprehensive guide provides developers with everything needed to effectively utilize Husky and Git hooks within a project. Whether you're a junior developer new to Git hooks or a senior developer looking to implement advanced automation, this guide covers all aspects of hook configuration, customization, and maintenance.

### 1.2 What You'll Learn

By the end of this guide, you will:

- Understand the purpose and timing of each Git hook
- Know how to interpret hook output and error messages
- Be able to troubleshoot common hook-related issues
- Understand how to integrate linting and formatting tools
- Know how to customize hooks for your project's needs
- Be prepared to manage hooks across a development team

### 1.3 Prerequisites

- Basic understanding of Git commands
- Familiarity with Node.js and npm
- Basic command line knowledge
- Understanding of JavaScript/TypeScript development

---

## 2. Understanding Git Hooks and Husky

### 2.1 What Are Git Hooks?

Git hooks are scripts that Git executes automatically at certain points in the Git workflow. They allow you to customize Git's internal behavior and trigger customizable actions at key points in the development lifecycle.

**Key Benefits:**

- **Automated Quality Checks:** Ensure code meets standards before commits
- **Consistent Formatting:** Automatically format code according to team standards
- **Error Prevention:** Catch issues before they reach the repository
- **Team Consistency:** Enforce the same standards across all team members

### 2.2 What Is Husky?

Husky is a popular npm package that makes Git hooks easy to use in Node.js projects. It:

- Simplifies hook installation and management
- Ensures hooks are shared across the team
- Provides a consistent way to configure hooks
- Supports modern JavaScript tooling

### 2.3 How Husky Works

```
Developer Action → Git Command → Husky Hook → Validation → Success/Failure
```

**Example Flow:**

1. Developer runs `git commit -m "fix: resolve login issue"`
2. Git triggers the pre-commit hook
3. Husky executes `.husky/pre-commit` script
4. Script runs ESLint, Prettier, and tests
5. If all checks pass, commit proceeds; otherwise, it's blocked

---

## 3. Hook Types and Their Purpose

### 3.1 Pre-commit Hook

**Purpose:** Validates changes before they are committed to the repository.

**When Triggered:** Every time you run `git commit`

**Typical Duration:** 10-30 seconds

**Common Use Cases:**

- Code linting (ESLint, TSLint)
- Code formatting (Prettier)
- Running unit tests on changed files
- Checking for debugging code (console.log, debugger)
- Validating file sizes
- Checking for sensitive information

**Example Pre-commit Hook:**

```bash
#!/bin/sh
echo "🚀 Running pre-commit checks..."

# Run lint-staged for file-specific checks
echo "📝 Running lint-staged..."
npx lint-staged

# Check for debugging code
echo "🐛 Checking for debugging code..."
if git diff --cached | grep -E "(console\.(log|debug|info|warn|error)|debugger;)"; then
    echo "⚠️  Found debugging code in staged files"
    echo "Please remove console.log, debugger statements"
    exit 1
fi

echo "✅ Pre-commit checks completed!"
```

### 3.2 Commit-msg Hook

**Purpose:** Validates and potentially modifies commit messages.

**When Triggered:** After entering a commit message but before the commit is finalized

**Typical Duration:** 1-5 seconds

**Common Use Cases:**

- Enforcing conventional commit format
- Adding ticket numbers automatically
- Checking commit message length
- Preventing commits with certain keywords
- Ensuring proper grammar and spelling

**Example Commit-msg Hook:**

```bash
#!/bin/sh
echo "📝 Validating commit message..."

# Get the commit message
commit_msg=$(cat $1)

# Check minimum length
if [ ${#commit_msg} -lt 10 ]; then
    echo "❌ Commit message too short (minimum 10 characters)"
    exit 1
fi

# Check for conventional commit format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)($$.+$$)?: .+"; then
    echo "❌ Commit message must follow conventional format:"
    echo "   feat: add new feature"
    echo "   fix: resolve bug"
    echo "   docs: update documentation"
    exit 1
fi

echo "✅ Commit message validation passed!"
```

### 3.3 Pre-push Hook

**Purpose:** Performs final validation before pushing commits to remote repository.

**When Triggered:** Every time you run `git push`

**Typical Duration:** 30 seconds to several minutes

**Common Use Cases:**

- Running full test suite
- Building the entire project
- Checking for secrets in commit history
- Validating branch naming conventions
- Running end-to-end tests

**Example Pre-push Hook:**

```bash
#!/bin/sh
echo "🚀 Running pre-push checks..."

# Get current branch
current_branch=$(git branch --show-current)

# Prevent direct push to main/master
if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    echo "❌ Direct push to $current_branch is not allowed"
    echo "Please create a feature branch and submit a pull request"
    exit 1
fi

# Run full test suite
echo "🧪 Running full test suite..."
npm test

# Build project
echo "🏗️  Building project..."
npm run build

echo "✅ Pre-push checks completed!"
```

---

## 4. Installation and Setup

### 4.1 Initial Installation

**Step 1: Install Husky**

```bash
npm install --save-dev husky
```

**Step 2: Initialize Husky**

```bash
# For Husky v9+
npx husky init

# For Husky v8.x
npx husky install
npm pkg set scripts.prepare="husky install"
```

**Step 3: Install Supporting Tools**

```bash
npm install --save-dev lint-staged eslint prettier
```

### 4.2 Basic Configuration

**Create Pre-commit Hook:**

```bash
# For Husky v9+
echo "npx lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit

# For Husky v8.x
npx husky add .husky/pre-commit "npx lint-staged"
```

**Configure lint-staged in package.json:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### 4.3 Verification

**Test Your Setup:**

```bash
# Create a test file with intentional errors
echo "const test=()=>{console.log('test')}" > test.js

# Stage and try to commit
git add test.js
git commit -m "test: verify hooks"

# The hook should catch the formatting issues and fix them
```

---

## 5. Interpreting Hook Output

### 5.1 Understanding Output Symbols

| Symbol | Meaning            | Action Required     |
| ------ | ------------------ | ------------------- |
| ✅     | Success/Pass       | None - continue     |
| ❌     | Error/Failure      | Fix the issue       |
| ⚠️     | Warning            | Review and decide   |
| 🔍     | Information        | Read for context    |
| 📝     | Action in progress | Wait for completion |

### 5.2 Common Output Patterns

**Successful Pre-commit:**

```
🚀 Running pre-commit checks...
📝 Running lint-staged...
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
✅ Pre-commit checks completed!
```

**Failed ESLint Check:**

```
🚀 Running pre-commit checks...
📝 Running lint-staged...
❌ ESLint found errors:

/src/components/Button.tsx
  15:7  error  'unused' is defined but never used  no-unused-vars
  23:1  error  Missing semicolon                   semi

✖ 2 problems (2 errors, 0 warnings)
```

**Successful Auto-fix:**

```
🚀 Running pre-commit checks...
📝 Running lint-staged...
✔ Preparing lint-staged...
✔ Running tasks for staged files...
  ↳ ESLint fixed 3 issues automatically
  ↳ Prettier formatted 2 files
✔ Applying modifications from tasks...
✅ Pre-commit checks completed!
```

### 5.3 Reading Error Messages

**ESLint Errors:**

- **Format:** `line:column error message rule-name`
- **Action:** Fix the code or disable the rule if appropriate
- **Example:** `15:7 error 'unused' is defined but never used no-unused-vars`

**Prettier Errors:**

- **Format:** Usually auto-fixed, but may show formatting conflicts
- **Action:** Let Prettier fix automatically or resolve conflicts manually

**Test Failures:**

- **Format:** Shows which tests failed and why
- **Action:** Fix the failing tests or update test expectations

---

## 6. Troubleshooting Common Issues

### 6.1 Hook Not Running

**Symptoms:**

- Commits succeed without any hook output
- No validation messages appear

**Diagnosis:**

```bash
# Check if hooks are installed
ls -la .husky/

# Check git configuration
git config core.hooksPath

# Verify hook is executable
ls -la .husky/pre-commit
```

**Solutions:**

```bash
# Reinstall Husky
npx husky install

# Set correct git hooks path
git config core.hooksPath .husky

# Make hook executable
chmod +x .husky/pre-commit
```

### 6.2 "Cannot spawn" Error

**Symptoms:**

```
error: cannot spawn .husky/pre-commit: No such file or directory
```

**Common Causes:**

- Hook file doesn't exist
- Hook file isn't executable
- Windows line ending issues

**Solutions:**

```bash
# Check if file exists
ls -la .husky/pre-commit

# Make executable
chmod +x .husky/pre-commit

# Fix line endings (Windows)
sed -i 's/\r$//' .husky/pre-commit
```

### 6.3 Dependency Issues

**Symptoms:**

- "Command not found" errors
- Module resolution failures

**Solutions:**

```bash
# Install missing dependencies
npm install

# Check for conflicting versions
npm ls

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 6.4 Performance Issues

**Symptoms:**

- Hooks take too long to run
- Timeouts during hook execution

**Solutions:**

```bash
# Use parallel execution
npx eslint --fix --parallel

# Limit to changed files only
# Configure lint-staged properly

# Skip hooks when necessary
git commit --no-verify
```

### 6.5 Troubleshooting Script

```bash
#!/bin/bash
echo "🔧 Husky Troubleshooting Script"

# Check Husky installation
if npm list husky &>/dev/null; then
    echo "✅ Husky is installed"
else
    echo "❌ Husky not installed - run: npm install --save-dev husky"
fi

# Check hook files
for hook in pre-commit commit-msg pre-push; do
    if [ -f ".husky/$hook" ]; then
        if [ -x ".husky/$hook" ]; then
            echo "✅ $hook hook is ready"
        else
            echo "❌ $hook hook not executable - run: chmod +x .husky/$hook"
        fi
    else
        echo "ℹ️  $hook hook not found (optional)"
    fi
done

# Check git configuration
hooks_path=$(git config core.hooksPath)
if [ "$hooks_path" = ".husky" ]; then
    echo "✅ Git hooks path correctly configured"
else
    echo "❌ Git hooks path incorrect - run: git config core.hooksPath .husky"
fi

echo "🎯 Troubleshooting complete!"
```

---

## 7. Tool Integration

### 7.1 ESLint Integration

**Installation:**

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Configuration (.eslintrc.js):**

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', '@typescript-eslint/recommended'],
  rules: {
    // Error level rules (will fail pre-commit)
    'no-console': 'error',
    'no-debugger': 'error',

    // Warning level rules
    'prefer-const': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
```

**Integration with Husky:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix --max-warnings=0"]
  }
}
```

### 7.2 Prettier Integration

**Installation:**

```bash
npm install --save-dev prettier
```

**Configuration (prettier.config.js):**

```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'avoid',
};
```

**Integration with Husky:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,md,css}": ["prettier --write"]
  }
}
```

### 7.3 Advanced lint-staged Configuration

```javascript
// lint-staged.config.js
const path = require('path');

module.exports = {
  // JavaScript/TypeScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix --max-warnings=0',
    'prettier --write',
    // Run tests for related files
    (filenames) => {
      const testCommand = `jest --findRelatedTests ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')} --passWithNoTests`;
      return testCommand;
    },
  ],

  // JSON files
  '*.json': [
    'prettier --write',
    // Validate JSON syntax
    (filenames) => `node -e "
      ${JSON.stringify(filenames)}.forEach(file => {
        try {
          JSON.parse(require('fs').readFileSync(file, 'utf8'));
        } catch (e) {
          console.error('Invalid JSON:', file);
          process.exit(1);
        }
      });
    "`,
  ],

  // CSS/SCSS files
  '*.{css,scss}': ['stylelint --fix', 'prettier --write'],

  // Markdown files
  '*.md': ['prettier --write', 'markdownlint --fix'],
};
```

### 7.4 Testing Integration

**Jest Integration:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "jest --findRelatedTests --passWithNoTests"]
  }
}
```

**Custom Test Script:**

```bash
#!/bin/sh
# .husky/pre-commit

echo "🚀 Running pre-commit checks..."

# Run lint-staged
npx lint-staged

# Run tests on changed files
changed_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$')

if [ -n "$changed_files" ]; then
    echo "🧪 Running tests for changed files..."
    npx jest --findRelatedTests $changed_files --passWithNoTests
fi

echo "✅ Pre-commit checks completed!"
```

---

## 8. Customizing Hooks for Code Quality

### 8.1 Advanced Pre-commit Hook

```bash
#!/bin/sh
echo "🚀 Running advanced pre-commit checks..."

# Configuration
MAX_FILE_SIZE=1048576  # 1MB
FORBIDDEN_PATTERNS="(TODO|FIXME|XXX|HACK)"

# Function to check file sizes
check_file_sizes() {
    echo "📏 Checking file sizes..."
    git diff --cached --name-only | while read file; do
        if [ -f "$file" ]; then
            size=$(wc -c < "$file")
            if [ $size -gt $MAX_FILE_SIZE ]; then
                echo "❌ File $file is too large ($size bytes > $MAX_FILE_SIZE)"
                echo "   Consider optimizing or using Git LFS"
                exit 1
            fi
        fi
    done
}

# Function to check for forbidden patterns
check_forbidden_patterns() {
    echo "🔍 Checking for forbidden patterns..."
    if git diff --cached | grep -nE "$FORBIDDEN_PATTERNS"; then
        echo "⚠️  Found forbidden patterns in staged files"
        echo "   Please resolve TODO/FIXME comments before committing"
        read -p "Continue anyway? (y/N): " confirm
        if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
            exit 1
        fi
    fi
}

# Function to check for secrets
check_secrets() {
    echo "🔐 Checking for potential secrets..."
    secret_patterns="(password|secret|key|token|api_key).*=.*['\"][^'\"]{8,}['\"]"

    if git diff --cached | grep -iE "$secret_patterns"; then
        echo "❌ Potential secrets detected!"
        echo "   Please use environment variables for sensitive data"
        exit 1
    fi
}

# Run all checks
check_file_sizes
check_forbidden_patterns
check_secrets

# Run standard lint-staged
echo "📝 Running lint-staged..."
npx lint-staged

echo "✅ Advanced pre-commit checks completed!"
```

### 8.2 Commit Message Validation

```bash
#!/bin/sh
# .husky/commit-msg

echo "📝 Validating commit message..."

commit_msg=$(cat $1)

# Check minimum length
if [ ${#commit_msg} -lt 10 ]; then
    echo "❌ Commit message too short (minimum 10 characters)"
    exit 1
fi

# Check maximum length for first line
first_line=$(echo "$commit_msg" | head -n1)
if [ ${#first_line} -gt 72 ]; then
    echo "❌ First line too long (maximum 72 characters)"
    echo "   Current length: ${#first_line}"
    exit 1
fi

# Check conventional commit format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)($$.+$$)?: .+"; then
    echo "❌ Commit message must follow conventional format:"
    echo ""
    echo "   feat(scope): add new feature"
    echo "   fix(scope): resolve bug"
    echo "   docs: update documentation"
    echo "   style: formatting changes"
    echo "   refactor: code restructuring"
    echo "   test: add or update tests"
    echo "   chore: maintenance tasks"
    echo "   perf: performance improvements"
    echo "   ci: CI/CD changes"
    echo "   build: build system changes"
    echo "   revert: revert previous commit"
    echo ""
    exit 1
fi

# Check for proper capitalization
if echo "$first_line" | grep -qE ": [a-z]"; then
    echo "⚠️  Consider capitalizing the first word after the colon"
fi

echo "✅ Commit message validation passed!"
```

### 8.3 Branch-specific Hooks

```bash
#!/bin/sh
# .husky/pre-push

echo "🚀 Running pre-push checks..."

current_branch=$(git branch --show-current)
target_branch=$(git rev-parse --abbrev-ref @{upstream} 2>/dev/null | cut -d'/' -f2)

echo "📋 Current branch: $current_branch"
echo "📋 Target branch: $target_branch"

# Prevent direct push to protected branches
protected_branches="main master develop"
if echo "$protected_branches" | grep -wq "$current_branch"; then
    echo "❌ Direct push to $current_branch is not allowed"
    echo "   Please create a feature branch and submit a pull request"
    exit 1
fi

# Branch naming validation
if ! echo "$current_branch" | grep -qE "^(feature|bugfix|hotfix|release|chore)/[a-z0-9-]+$"; then
    echo "⚠️  Branch name doesn't follow convention: $current_branch"
    echo "   Expected: type/description (e.g., feature/user-login)"
    echo "   Allowed types: feature, bugfix, hotfix, release, chore"
fi

# Run different checks based on target branch
case "$target_branch" in
    "main"|"master")
        echo "🏗️  Building for production..."
        npm run build:prod
        echo "🧪 Running full test suite..."
        npm run test:ci
        ;;
    "develop")
        echo "🏗️  Building for development..."
        npm run build
        echo "🧪 Running affected tests..."
        npm run test:affected
        ;;
    *)
        echo "🧪 Running basic tests..."
        npm test
        ;;
esac

echo "✅ Pre-push checks completed!"
```

---

## 9. Team Management and Updates

### 9.1 Team Onboarding

**New Developer Setup Script:**

```bash
#!/bin/bash
# scripts/setup-dev-environment.sh

echo "👥 Setting up development environment..."

# Check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."

    if ! command -v node >/dev/null 2>&1; then
        echo "❌ Node.js not found. Please install from nodejs.org"
        exit 1
    fi

    if ! command -v git >/dev/null 2>&1; then
        echo "❌ Git not found. Please install Git"
        exit 1
    fi

    echo "✅ Prerequisites met"
}

# Configure Git
setup_git() {
    echo "⚙️  Configuring Git..."

    if ! git config user.name >/dev/null 2>&1; then
        read -p "Enter your full name: " name
        git config --global user.name "$name"
    fi

    if ! git config user.email >/dev/null 2>&1; then
        read -p "Enter your email: " email
        git config --global user.email "$email"
    fi

    # Set recommended settings
    git config --global init.defaultBranch main
    git config --global pull.rebase false
    git config --global core.autocrlf input

    echo "✅ Git configured"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
}

# Show guidelines
show_guidelines() {
    cat << 'EOF'
📋 Development Guidelines
========================

🚀 Pre-commit Hook:
   - Automatically runs ESLint and Prettier
   - Fixes formatting issues automatically
   - Blocks commits with linting errors

📝 Commit Messages:
   - Use conventional commit format
   - Examples: "feat: add login", "fix: resolve bug"
   - Types: feat, fix, docs, style, refactor, test, chore

🌿 Branch Naming:
   - Format: type/description
   - Examples: feature/user-auth, bugfix/login-error
   - Types: feature, bugfix, hotfix, release, chore

🛠️  Bypassing Hooks (use sparingly):
   - Skip pre-commit: git commit --no-verify
   - Skip pre-push: git push --no-verify

❓ Need Help?
   - Run: npm run lint (check for issues)
   - Run: npm run format (fix formatting)
   - Ask team lead for assistance
EOF
}

# Main execution
check_prerequisites
setup_git
install_dependencies
show_guidelines

echo "🎉 Development environment setup complete!"
```

### 9.2 Hook Update Management

**Update Script:**

````bash
#!/bin/bash
# scripts/update-hooks.sh

echo "🔄 Updating Git hooks..."

# Backup current hooks
backup_hooks() {
    if [ -d ".husky" ]; then
        backup_dir=".husky-backup-$(date +%Y%m%d-%H%M%S)"
        cp -r .husky "$backup_dir"
        echo "💾 Backed up hooks to $backup_dir"
    fi
}

# Update dependencies
update_dependencies() {
    echo "📦 Updating dependencies..."
    npm update husky lint-staged eslint prettier
    echo "✅ Dependencies updated"
}

# Migrate hook format if needed
migrate_hooks() {
    husky_version=$(npm list husky --depth=0 | grep -o 'husky@[0-9.]*' | cut -d'@' -f2)
    major_version=$(echo "$husky_version" | cut -d'.' -f1)

    if [[ "$major_version" -ge 9 ]]; then
        echo "🔄 Migrating to Husky v9+ format..."

        for hook in .husky/pre-commit .husky/commit-msg .husky/pre-push; do
            if [ -f "$hook" ]; then
                # Remove deprecated lines
                sed -i '/^#!/d' "$hook"
                sed -i '/\. "$(dirname -- "$0")/_\/husky\.sh"/d' "$hook"
                chmod +x "$hook"
                echo "✅ Updated $(basename "$hook")"
            fi
        done
    fi
}

# Validate hooks
validate_hooks() {
    echo "🔍 Validating hooks..."

    if npx lint-staged --dry-run >/dev/null 2>&1; then
        echo "✅ lint-staged configuration valid"
    else
        echo "❌ lint-staged configuration has issues"
    fi

    for hook in pre-commit commit-msg pre-push; do
        if [ -f ".husky/$hook" ] && [ -x ".husky/$hook" ]; then
            echo "✅ $hook hook is valid"
        fi
    done
}

# Generate team notification
create_notification() {
    cat > HOOK_UPDATE_NOTICE.md << 'EOF'
# Git Hooks Updated

## What Changed
- Updated Husky and related dependencies
- Migrated hooks to latest format
- Validated all configurations

## Action Required
Please run the following commands:

```bash
git pull
npm install
````

## Testing

Verify your setup:

```bash
npm run lint
git add .
git commit -m "test: verify hooks" --dry-run
```

Contact the team if you encounter issues.
EOF

    echo "📢 Created HOOK_UPDATE_NOTICE.md"

}

# Execute updates

backup_hooks
update_dependencies
migrate_hooks
validate_hooks
create_notification

echo "🎉 Hook update complete!"

````

### 9.3 Continuous Integration

**GitHub Actions Workflow (.github/workflows/validate-hooks.yml):**
```yaml
name: Validate Git Hooks

on:
  push:
    branches: [main, develop]
    paths:
      - '.husky/**'
      - 'package.json'
      - 'lint-staged.config.js'
  pull_request:
    branches: [main, develop]

jobs:
  validate-hooks:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Validate Husky
      run: npx husky --version

    - name: Check hook files
      run: |
        for hook in .husky/*; do
          if [ -f "$hook" ] && [ "$(basename "$hook")" != "_" ]; then
            if [ ! -x "$hook" ]; then
              echo "❌ $hook is not executable"
              exit 1
            fi
          fi
        done

    - name: Validate lint-staged
      run: npx lint-staged --dry-run

    - name: Test hook simulation
      run: |
        echo "const test = 'hello';" > test.js
        git add test.js
        npx lint-staged
        rm test.js
````

---

## 10. Resolving Verification Warnings

### 10.1 Common Warnings and Solutions

**Warning: Git hooks path not set to .husky**

```bash
# Solution
git config core.hooksPath .husky
```

**Warning: lint-staged configuration not found**

```bash
# Add to package.json
npm pkg set lint-staged='{"*.{js,jsx,ts,tsx}":["eslint --fix","prettier --write"]}'
```

**Warning: Husky deprecation message**

```bash
# For Husky v9+, update hook format
# Remove these lines from hooks:
# #!/usr/bin/env sh
# . "$(dirname -- "$0")/_/husky.sh"
```

### 10.2 Complete Resolution Script

```bash
#!/bin/bash
# scripts/resolve-warnings.sh

echo "🔧 Resolving verification warnings..."

# Fix git hooks path
echo "1️⃣  Setting git hooks path..."
git config core.hooksPath .husky

# Add lint-staged if missing
echo "2️⃣  Checking lint-staged configuration..."
if ! grep -q '"lint-staged"' package.json; then
    npm pkg set lint-staged='{"*.{js,jsx,ts,tsx}":["eslint --fix","prettier --write"],"*.{json,md}":["prettier --write"]}'
    echo "✅ Added lint-staged configuration"
fi

# Install missing dependencies
echo "3️⃣  Installing dependencies..."
npm install --save-dev lint-staged

# Fix Husky format
echo "4️⃣  Updating Husky format..."
for hook in .husky/pre-commit .husky/commit-msg .husky/pre-push; do
    if [ -f "$hook" ]; then
        sed -i '/^#!/d' "$hook"
        sed -i '/\. "$(dirname -- "$0")/_\/husky\.sh"/d' "$hook"
        chmod +x "$hook"
    fi
done

# Verify fixes
echo "5️⃣  Verifying fixes..."
if npx lint-staged --dry-run >/dev/null 2>&1; then
    echo "✅ All warnings resolved!"
else
    echo "⚠️  Some issues may remain - check configuration"
fi

echo "🎉 Resolution complete!"
```

---

## 11. Best Practices

### 11.1 Hook Performance

**Optimize for Speed:**

- Use `lint-staged` to only process changed files
- Run tests in parallel when possible
- Cache results when appropriate
- Use `--parallel` flags for tools that support it

**Example Optimized Configuration:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix --max-warnings=0 --cache", "prettier --write"]
  }
}
```

### 11.2 Error Handling

**Graceful Degradation:**

```bash
#!/bin/sh
# .husky/pre-commit

echo "🚀 Running pre-commit checks..."

# Run lint-staged with error handling
if ! npx lint-staged; then
    echo "❌ Lint-staged failed"
    echo "💡 Try running: npm run lint:fix"
    exit 1
fi

# Optional checks that shouldn't block commits
echo "🔍 Running optional checks..."
npm run test:quick || echo "⚠️  Quick tests failed (not blocking commit)"

echo "✅ Pre-commit checks completed!"
```

### 11.3 Documentation

**Keep Documentation Updated:**

- Document custom hooks and their purpose
- Maintain a changelog for hook updates
- Provide troubleshooting guides for common issues
- Include examples for different scenarios

### 11.4 Team Communication

**Communicate Changes:**

- Announce hook updates to the team
- Provide migration guides for breaking changes
- Offer training sessions for complex configurations
- Create feedback channels for hook-related issues

---

## 12. Appendices

### Appendix A: Command Reference

**Husky Commands:**

```bash
# Initialize Husky
npx husky init                    # v9+
npx husky install                 # v8.x

# Add hooks
npx husky add .husky/pre-commit "npm test"  # v8.x
echo "npm test" > .husky/pre-commit         # v9+

# Remove hooks
rm .husky/pre-commit
```

**Git Commands:**

```bash
# Bypass hooks
git commit --no-verify
git push --no-verify

# Check hook configuration
git config core.hooksPath

# Manual hook execution
./.husky/pre-commit
```

**Debugging Commands:**

```bash
# Test lint-staged
npx lint-staged --dry-run

# Check ESLint
npx eslint --print-config file.js

# Validate Prettier
npx prettier --check .
```

### Appendix B: Configuration Templates

**Basic ESLint Configuration:**

```javascript
module.exports = {
  extends: ['eslint:recommended'],
  env: {
    node: true,
    es2021: true,
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
  },
};
```

**Basic Prettier Configuration:**

```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
};
```

**Basic lint-staged Configuration:**

```json
{
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### Appendix C: Troubleshooting Checklist

**Pre-commit Issues:**

- [ ] Husky is installed (`npm list husky`)
- [ ] Hook file exists (`.husky/pre-commit`)
- [ ] Hook is executable (`chmod +x .husky/pre-commit`)
- [ ] Git hooks path is set (`git config core.hooksPath`)
- [ ] Dependencies are installed (`npm install`)

**Performance Issues:**

- [ ] Using `lint-staged` for file filtering
- [ ] Parallel execution enabled where possible
- [ ] Caching enabled for tools that support it
- [ ] Only necessary checks are included

**Team Issues:**

- [ ] All team members have run `npm install`
- [ ] Hook configurations are committed to repository
- [ ] Documentation is up to date
- [ ] Training provided for new team members

---

## Conclusion

This guide provides a comprehensive foundation for implementing and maintaining Git hooks with Husky in your development workflow. By following these practices and configurations, your team can ensure consistent code quality, reduce bugs, and maintain high development standards.

Remember to:

- Start with basic configurations and gradually add complexity
- Communicate changes clearly to your team
- Monitor hook performance and optimize as needed
- Keep documentation updated as your setup evolves

For additional support or questions, refer to the official documentation:

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Next Review:** March 2025

```

This comprehensive guide can be copied directly into Microsoft Word. To format it properly in Word:

1. **Copy the content** into a new Word document
2. **Apply heading styles** using Word's built-in heading styles (Heading 1, Heading 2, etc.)
3. **Format code blocks** using a monospace font like Consolas or Courier New
4. **Add a table of contents** using Word's automatic TOC feature
5. **Apply consistent formatting** for bullet points, numbered lists, and emphasis
6. **Add page numbers** and headers/footers as needed
7. **Use Word's styles** to ensure consistent formatting throughout

The document is structured to be easily navigable and includes all the practical information developers need to effectively use Husky and Git hooks in their projects.

```
