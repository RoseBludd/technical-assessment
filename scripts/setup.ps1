# Setup script for Dev Portal

Write-Host "Setting up Dev Portal..." -ForegroundColor Green

# Check if pnpm is installed
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Setup database
Write-Host "Setting up database..." -ForegroundColor Yellow
Write-Host "Note: If this is your first time running the setup, Prisma will create the database automatically" -ForegroundColor Cyan
pnpm prisma generate
pnpm prisma db push --accept-data-loss # This will create the database if it doesn't exist
pnpm prisma migrate reset --force # This will apply all migrations and seed data

# Build the project
Write-Host "Building the project..." -ForegroundColor Yellow
pnpm build

Write-Host "`nSetup complete! You can now run 'pnpm dev' to start the development server." -ForegroundColor Green
Write-Host "The application will be available at http://localhost:3000" -ForegroundColor Green 