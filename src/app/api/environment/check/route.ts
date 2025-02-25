import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Check and setup VPN
    const vpnStatus = await setupVPN();
    
    // Check and setup Workspace
    const workspaceStatus = await setupWorkspace();
    
    // Check and setup GitHub
    const githubStatus = await setupGitHub();
    
    // Check and setup IDE
    const ideStatus = await setupIDE();

    return NextResponse.json({
      vpn: vpnStatus,
      workspace: workspaceStatus,
      github: githubStatus,
      ide: ideStatus
    });
  } catch (error) {
    console.error('Environment setup failed:', error);
    return NextResponse.json({
      vpn: false,
      workspace: false,
      github: false,
      ide: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function setupVPN() {
  try {
    // Check if OpenVPN is installed
    const { stdout: vpnCheck } = await execAsync('powershell.exe Test-Path "C:\\Program Files\\OpenVPN"');
    
    if (vpnCheck.trim() !== 'True') {
      // Install OpenVPN if not present
      await execAsync('powershell.exe Start-Process -Wait -FilePath "winget" -ArgumentList "install", "OpenVPN.OpenVPN"');
    }

    // Check VPN connection
    const { stdout } = await execAsync('powershell.exe Get-NetAdapter | Where-Object {$_.InterfaceDescription -Match "TAP-Windows Adapter"}');
    return stdout.includes('TAP-Windows Adapter');
  } catch {
    return false;
  }
}

async function setupWorkspace() {
  try {
    // Create workspace directory if it doesn't exist
    await execAsync('powershell.exe New-Item -ItemType Directory -Force -Path $env:WORKSPACE_PATH');
    
    // Check workspace setup
    const { stdout } = await execAsync('powershell.exe Test-Path $env:WORKSPACE_PATH');
    return stdout.trim() === 'True';
  } catch {
    return false;
  }
}

async function setupGitHub() {
  try {
    // Check git installation
    const { stdout: gitCheck } = await execAsync('git --version');
    
    if (!gitCheck.includes('git version')) {
      // Install Git if not present
      await execAsync('powershell.exe Start-Process -Wait -FilePath "winget" -ArgumentList "install", "Git.Git"');
    }

    // Check GitHub configuration
    const { stdout } = await execAsync('git config --get user.name');
    return !!stdout.trim();
  } catch {
    return false;
  }
}

async function setupIDE() {
  try {
    // Check if VS Code or Cursor is installed
    const { stdout: ideCheck } = await execAsync('powershell.exe Get-Process | Where-Object {$_.ProcessName -Match "Code|cursor"}');
    
    if (!ideCheck.trim()) {
      // Install Cursor if not present
      await execAsync('powershell.exe Start-Process -Wait -FilePath "winget" -ArgumentList "install", "Cursor.Cursor"');
    }

    return true;
  } catch {
    return false;
  }
} 