# Register custom URL protocol handler for workspace connections
$protocolName = "connectworkspace"
$handlerPath = "$env:LOCALAPPDATA\WorkspaceConnector\workspace-connector.exe"

# Create the registry key
New-Item -Path "HKCU:\SOFTWARE\Classes\$protocolName" -Force
Set-ItemProperty -Path "HKCU:\SOFTWARE\Classes\$protocolName" -Name "(Default)" -Value "URL:Workspace Connection Protocol"
Set-ItemProperty -Path "HKCU:\SOFTWARE\Classes\$protocolName" -Name "URL Protocol" -Value ""

# Create command registry keys
New-Item -Path "HKCU:\SOFTWARE\Classes\$protocolName\shell\open\command" -Force
Set-ItemProperty -Path "HKCU:\SOFTWARE\Classes\$protocolName\shell\open\command" -Name "(Default)" -Value "`"$handlerPath`" `"%1`""

Write-Host "Protocol handler registered successfully" 