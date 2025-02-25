# Get the database URL from .env file
$envContent = Get-Content ../.env
$databaseUrl = $envContent | Where-Object { $_ -match "^DATABASE_URL=" } | ForEach-Object { $_ -replace "^DATABASE_URL=", "" }

# Execute the SQL file
Write-Host "Applying migration: developer_tasks.sql"
Get-Content ./developer_tasks.sql | psql $databaseUrl

# Check for errors
if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration applied successfully!"
} else {
    Write-Host "Error applying migration. Please check the output above for details."
    exit 1
} 