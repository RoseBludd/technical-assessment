import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Check VPN
    const vpnStatus = await checkVPN();
    
    // Check Workspace
    const workspaceStatus = await checkWorkspace();
    
    // Check GitHub
    const githubStatus = await checkGitHub();
    
    // Check IDE
    const ideStatus = await checkIDE();

    return NextResponse.json({
      vpn: vpnStatus,
      workspace: workspaceStatus,
      github: githubStatus,
      ide: ideStatus
    });
  } catch (error) {
    console.error('Environment check failed:', error);
    return NextResponse.json({
      vpn: false,
      workspace: false,
      github: false,
      ide: false
    });
  }
}

async function checkVPN() {
  try {
    const { stdout } = await execAsync('powershell.exe Get-NetAdapter | Where-Object {$_.InterfaceDescription -Match "TAP-Windows Adapter"}');
    return stdout.includes('TAP-Windows Adapter');
  } catch {
    return false;
  }
}

async function checkWorkspace() {
  try {
    const { stdout } = await execAsync('powershell.exe Test-Path $env:WORKSPACE_PATH');
    return stdout.trim() === 'True';
  } catch {
    return false;
  }
}

async function checkGitHub() {
  try {
    const { stdout } = await execAsync('git config --get user.name');
    return !!stdout.trim();
  } catch {
    return false;
  }
}

async function checkIDE() {
  try {
    const { stdout } = await execAsync('powershell.exe Get-Process | Where-Object {$_.ProcessName -Match "Code|cursor"}');
    return !!stdout.trim();
  } catch {
    return false;
  }
} 