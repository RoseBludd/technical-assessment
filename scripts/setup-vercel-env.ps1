# PowerShell script to set up Vercel environment variables
# Run this script after installing Vercel CLI and logging in

Write-Host "Setting up Vercel environment variables..."

# Set environment variables first
$env:VERCEL_PROJECT_SETTINGS = "1"

# Database Configuration
Write-Output "postgres://neondb_owner:npg_Y0CM8vIVoilD@ep-soft-pine-a56drgaq-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require" | vercel env add DATABASE_URL production

# NextAuth Configuration
Write-Output "https://dev-applications.vercel.app" | vercel env add NEXTAUTH_URL production
$nextAuthSecret = -join ((65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Output $nextAuthSecret | vercel env add NEXTAUTH_SECRET production

# Remote Access Configuration
Write-Output "10.24.1.10" | vercel env add RDP_HOST production
Write-Output "vpnuser3" | vercel env add RDP_USERNAME production
Write-Output "Roof$7663" | vercel env add RDP_PASSWORD production

# VPN Configuration
Write-Output "128.177.144.197" | vercel env add VPN_SERVER production
Write-Output "1194" | vercel env add VPN_PORT production
Write-Output "udp" | vercel env add VPN_PROTOCOL production

Write-Host "Environment variables have been set up in Vercel."
Write-Host "You can now deploy your application." 