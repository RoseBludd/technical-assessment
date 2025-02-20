# Verify assessment repository setup

Write-Host "Verifying assessment repository setup..."

# Check directory structure
$requiredDirs = @(
    "frontend",
    "backend",
    "integration",
    "infrastructure",
    "qa",
    "docs",
    ".github/workflows",
    ".github/ISSUE_TEMPLATE"
)

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✓ Found directory: $dir" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing directory: $dir" -ForegroundColor Red
        exit 1
    }
}

# Check required files
$requiredFiles = @(
    ".github/pull_request_template.md",
    ".github/workflows/assessment-tests.yml",
    ".github/ISSUE_TEMPLATE/question.md",
    "README.md",
    "CHANGELOG.md",
    "frontend/package.json",
    "backend/package.json",
    "frontend/jest.config.js",
    "frontend/jest.setup.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ Found file: $file" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing file: $file" -ForegroundColor Red
        exit 1
    }
}

# Verify frontend setup
Write-Host "`nVerifying frontend setup..."
Set-Location frontend
npm install
npm run test -- --watchAll=false
Set-Location ..

# Verify GitHub workflow
$workflow = Get-Content ".github/workflows/assessment-tests.yml" -Raw
if ($workflow -match "assessment/frontend/" -and 
    $workflow -match "assessment/backend/" -and
    $workflow -match "assessment/integration/" -and
    $workflow -match "assessment/infrastructure/" -and
    $workflow -match "assessment/qa/") {
    Write-Host "✓ GitHub workflow contains all role patterns" -ForegroundColor Green
} else {
    Write-Host "✗ GitHub workflow missing some role patterns" -ForegroundColor Red
    exit 1
}

Write-Host "`nVerification complete! Repository is ready for GitHub."
Write-Host "Next steps:"
Write-Host "1. Create repository on GitHub"
Write-Host "2. Add remote: git remote add origin <repository-url>"
Write-Host "3. Push: git push -u origin main" 