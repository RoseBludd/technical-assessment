# Database verification script
Write-Host "Verifying database schema..." -ForegroundColor Cyan

$DB_URL = "postgresql://neondb_owner:npg_Y0CM8vIVoilD@ep-soft-pine-a56drgaq-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# List all tables
Write-Host "`nListing all tables:" -ForegroundColor Yellow
psql "$DB_URL" -c "\dt"

# Check developers table structure
Write-Host "`nDevelopers table structure:" -ForegroundColor Yellow
psql "$DB_URL" -c "\d developers"

# Check developer_tasks table structure
Write-Host "`nDeveloper tasks table structure:" -ForegroundColor Yellow
psql "$DB_URL" -c "\d developer_tasks"

# Check task_attachments table structure
Write-Host "`nTask attachments table structure:" -ForegroundColor Yellow
psql "$DB_URL" -c "\d task_attachments"

# Check task_assignments table structure
Write-Host "`nTask assignments table structure:" -ForegroundColor Yellow
psql "$DB_URL" -c "\d task_assignments"

# Verify triggers
Write-Host "`nVerifying triggers:" -ForegroundColor Yellow
psql "$DB_URL" -c "\dg"

# Verify indexes
Write-Host "`nVerifying indexes:" -ForegroundColor Yellow
psql "$DB_URL" -c "\di" 