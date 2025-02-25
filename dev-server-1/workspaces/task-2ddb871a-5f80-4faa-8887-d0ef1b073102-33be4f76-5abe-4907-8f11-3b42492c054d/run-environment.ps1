
# Environment Setup Script
$ErrorActionPreference = "Stop"

# Check OpenVPN Installation
function Test-OpenVPN {
    $openVPNPath = "C:\Program Files\OpenVPN"
    return Test-Path $openVPNPath
}

# Server Connection Details
$SERVER_IP = "192.168.1.100"
$SERVER_NAME = "Development Server 1"

# Check VPN Status
$vpnInstalled = Test-OpenVPN
if (-not $vpnInstalled) {
    Write-Host "OpenVPN is not installed. Please install it first."
    exit 1
}

# Connect to Remote Desktop
function Connect-ToWorkspace {
    param(
        [string]$ServerIP,
        [string]$ServerName
    )
    
    try {
        mstsc /v:$ServerIP /f
    } catch {
        Write-Host "Failed to connect to workspace: $_"
        exit 1
    }
}

# Main execution
Write-Host "Connecting to workspace on $SERVER_NAME..."
Connect-ToWorkspace -ServerIP $SERVER_IP -ServerName $SERVER_NAME
