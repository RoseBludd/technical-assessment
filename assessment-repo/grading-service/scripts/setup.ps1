# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Install specific type definitions
Write-Host "Installing type definitions..."
npm install --save-dev @types/express @types/dotenv @types/simple-git

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

Write-Host "Setup complete!" 