# Workspace Environment Setup Script
# This script installs and configures everything needed for workspace connections

# Ensure running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator"
    Exit
}

Write-Host "Setting up workspace environment..."

# Create application directories
$appDir = "$env:LOCALAPPDATA\WorkspaceConnector"
$configDir = "$appDir\config"
New-Item -ItemType Directory -Force -Path $appDir
New-Item -ItemType Directory -Force -Path $configDir

# Copy OpenVPN config
Write-Host "Setting up OpenVPN configuration..."
$ovpnConfig = @"
client
dev tun
proto udp
remote 128.177.144.197 1194
resolv-retry infinite
nobind
persist-key
persist-tun
ca ca.crt
cert client.crt
key client.key
remote-cert-tls server
tls-auth ta.key 1
cipher AES-256-GCM
connect-retry-max 25
verb 3
"@
Set-Content -Path "$configDir\base.ovpn" -Value $ovpnConfig

# Install OpenVPN if not present
if (-not (Test-Path "C:\Program Files\OpenVPN")) {
    Write-Host "Installing OpenVPN..."
    # Download OpenVPN installer
    $ovpnUrl = "https://swupdate.openvpn.org/community/releases/OpenVPN-2.5.8-I601-amd64.msi"
    $ovpnInstaller = "$env:TEMP\openvpn-install.msi"
    Invoke-WebRequest -Uri $ovpnUrl -OutFile $ovpnInstaller
    
    # Install OpenVPN silently
    Start-Process msiexec.exe -ArgumentList "/i `"$ovpnInstaller`" /quiet /norestart" -Wait
    Remove-Item $ovpnInstaller
}

# Copy connector script
Write-Host "Installing workspace connector..."
$connectorScript = Get-Content "$PSScriptRoot\..\src\workspace-connector\connector.ps1" -Raw
Set-Content -Path "$appDir\workspace-connector.ps1" -Value $connectorScript

# Create executable wrapper
$wrapperContent = @"
@echo off
powershell.exe -ExecutionPolicy Bypass -File "%~dp0workspace-connector.ps1" %*
"@
Set-Content -Path "$appDir\workspace-connector.cmd" -Value $wrapperContent

# Register protocol handler
Write-Host "Registering protocol handler..."
$protocolName = "connectworkspace"
$handlerPath = "$appDir\workspace-connector.cmd"

# Create registry entries
New-Item -Path "HKCU:\SOFTWARE\Classes\$protocolName" -Force
Set-ItemProperty -Path "HKCU:\SOFTWARE\Classes\$protocolName" -Name "(Default)" -Value "URL:Workspace Connection Protocol"
Set-ItemProperty -Path "HKCU:\SOFTWARE\Classes\$protocolName" -Name "URL Protocol" -Value ""
New-Item -Path "HKCU:\SOFTWARE\Classes\$protocolName\shell\open\command" -Force
Set-ItemProperty -Path "HKCU:\SOFTWARE\Classes\$protocolName\shell\open\command" -Name "(Default)" -Value "`"$handlerPath`" `"%1`""

# Configure RDP settings
Write-Host "Configuring RDP settings..."
# Trust RDP certificate
$regPath = "HKCU:\Software\Microsoft\Terminal Server Client"
if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force
}
New-ItemProperty -Path $regPath -Name "AuthenticationLevelOverride" -Value 0 -PropertyType DWORD -Force

Write-Host "Setup complete! Workspace connection environment is ready." 