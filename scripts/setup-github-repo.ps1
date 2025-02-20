# Setup GitHub repository structure

# Create necessary directories
Write-Host "Creating directory structure..."
$directories = @(
    "frontend",
    "backend",
    "integration",
    "infrastructure",
    "qa",
    "docs",
    ".github/workflows",
    ".github/ISSUE_TEMPLATE"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir"
    }
}

# Copy existing files to appropriate locations
Write-Host "Copying files to appropriate locations..."

# Copy README files
Copy-Item "assessment-repo/frontend/README.md" -Destination "frontend/README.md" -Force
Copy-Item "assessment-repo/backend/README.md" -Destination "backend/README.md" -Force
Copy-Item "assessment-repo/integration/README.md" -Destination "integration/README.md" -Force
Copy-Item "assessment-repo/infrastructure/README.md" -Destination "infrastructure/README.md" -Force
Copy-Item "assessment-repo/qa/README.md" -Destination "qa/README.md" -Force

# Copy PR template
Copy-Item "assessment-repo/.github/pull_request_template.md" -Destination ".github/pull_request_template.md" -Force

# Initialize git if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..."
    git init
}

# Create GitHub Actions workflow for automated testing
Write-Host "Creating GitHub Actions workflow..."
$workflowContent = @"
name: Assessment Tests

on:
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: Determine Assessment Type
      id: assessment-type
      run: |
        PR_BRANCH=`${{ github.head_ref }}
        if [[ `$PR_BRANCH == assessment/frontend/* ]]; then
          echo "type=frontend" >> `$GITHUB_OUTPUT
        elif [[ `$PR_BRANCH == assessment/backend/* ]]; then
          echo "type=backend" >> `$GITHUB_OUTPUT
        elif [[ `$PR_BRANCH == assessment/integration/* ]]; then
          echo "type=integration" >> `$GITHUB_OUTPUT
        elif [[ `$PR_BRANCH == assessment/infrastructure/* ]]; then
          echo "type=infrastructure" >> `$GITHUB_OUTPUT
        elif [[ `$PR_BRANCH == assessment/qa/* ]]; then
          echo "type=qa" >> `$GITHUB_OUTPUT
        fi
        
    - name: Install Dependencies
      run: |
        cd `${{ steps.assessment-type.outputs.type }}
        npm install
        
    - name: Run Tests
      run: |
        cd `${{ steps.assessment-type.outputs.type }}
        npm test
"@

$workflowContent | Out-File -FilePath ".github/workflows/assessment-tests.yml" -Encoding UTF8

# Create issue templates
Write-Host "Creating issue templates..."
$questionTemplate = @"
---
name: Assessment Question
about: Ask a question about the assessment
title: '[QUESTION] '
labels: question
assignees: ''
---

**Your Role**
- [ ] Frontend Specialist
- [ ] Backend Specialist
- [ ] Integration Specialist
- [ ] DevOps Engineer
- [ ] QA Engineer

**Question**
<!-- Clearly state your question -->

**Context**
<!-- Provide any relevant context or code snippets -->

**What you've tried**
<!-- Describe what you've already attempted, if applicable -->
"@

$questionTemplate | Out-File -FilePath ".github/ISSUE_TEMPLATE/question.md" -Encoding UTF8

# Create initial commit
Write-Host "Creating initial commit..."
git add .
git commit -m "Initial assessment repository setup"

Write-Host "Repository setup complete!"
Write-Host "Next steps:"
Write-Host "1. Create a new repository on GitHub"
Write-Host "2. Add the remote origin:"
Write-Host "   git remote add origin <repository-url>"
Write-Host "3. Push the repository:"
Write-Host "   git push -u origin main" 