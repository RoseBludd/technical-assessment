# Get the database URL from environment variable or parameter
param(
    [string]$DatabaseUrl = $env:DATABASE_URL
)

if (-not $DatabaseUrl) {
    Write-Error "Database URL is required. Please set DATABASE_URL environment variable or provide it as a parameter."
    exit 1
}

# Read the SQL file
$sqlContent = Get-Content -Path "scripts/create_test_tables.sql" -Raw

# Execute the SQL using psql
$env:PGPASSWORD = $DatabaseUrl.Split('?')[0].Split('@')[0].Split(':')[-1]
$dbInfo = $DatabaseUrl.Split('?')[0].Split('@')[1].Split('/')
$dbHost = $dbInfo[0]
$dbName = $dbInfo[1]
$user = $DatabaseUrl.Split('?')[0].Split('@')[0].Split(':')[-2].Split('//')[-1]

Write-Host "Executing SQL against database..."
$sqlContent | psql -h $dbHost -U $user -d $dbName

Write-Host "Database setup completed!" 