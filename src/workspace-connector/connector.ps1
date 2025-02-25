# Workspace Connector
# This script handles the custom protocol to connect to workspaces

param(
    [Parameter(Mandatory=$true)]
    [string]$Uri
)

# Parse the URI
$parsedUri = [System.Uri]$Uri
$rdpHost = $parsedUri.Host
$query = [System.Web.HttpUtility]::ParseQueryString($parsedUri.Query)
$user = $query["user"]

# Check if OpenVPN is running
$ovpnProcess = Get-Process "openvpn" -ErrorAction SilentlyContinue
if (-not $ovpnProcess) {
    # Start OpenVPN with pre-configured profile
    Start-Process "C:\Program Files\OpenVPN\bin\openvpn-gui.exe" -ArgumentList "--connect base.ovpn"
    
    # Wait for VPN connection
    Start-Sleep -Seconds 5
}

# Create RDP file with settings
$rdpContent = @"
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,1,0,0,800,600
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
displayconnectionbar:i:1
username:s:$user
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:1
allow desktop composition:i:1
disable full window drag:i:0
disable menu anims:i:0
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:$rdpHost
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
"@

# Save RDP file
$rdpPath = "$env:TEMP\workspace.rdp"
$rdpContent | Out-File -FilePath $rdpPath -Encoding ASCII

# Launch RDP
Start-Process "mstsc.exe" -ArgumentList $rdpPath

# Clean up RDP file after a delay
Start-Sleep -Seconds 5
Remove-Item $rdpPath 