import { WorkspaceConfig, WorkspaceStatus, DeveloperSession } from '../config/workspace-management';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { prisma } from '@/lib/prisma';

interface ServerConfig {
  id: string;
  workspace_path: string;
  vpn_config_path: string;
  rdp_username: string;
  rdp_password: string;
}

export class WorkspaceManagementService {
  private config: WorkspaceConfig;
  
  constructor(config: WorkspaceConfig) {
    this.config = config;
  }

  async createWorkspace(developerId: string, taskId: string): Promise<string> {
    try {
      // Get next available workspace from database
      const workspace = await prisma.$queryRaw<ServerConfig[]>`
        SELECT * FROM get_next_available_workspace()
      `;
      
      if (!workspace?.length) {
        throw new Error('No available workspaces found');
      }

      const server = workspace[0];
      const workspaceId = `task-${taskId}-${developerId}`;
      const workspacePath = path.join(workspaceId);
      
      // Create workspace directory structure
      await this.createWorkspaceStructure(workspacePath);
      
      // Create test users and authentication data
      await this.setupTestUsers(workspacePath, taskId);
      
      // Create workspace README
      await this.createReadme(workspacePath, taskId);
      
      // Create PowerShell environment script
      await this.createEnvironmentScript(workspacePath, server);

      return workspaceId;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to create workspace: ${error.message}`);
      } else {
        logger.error('Failed to create workspace: Unknown error');
      }
      throw error;
    }
  }

  private async createWorkspaceStructure(workspacePath: string): Promise<void> {
    const { workspaceStructure } = this.config;
    
    // Create main workspace directory
    await fs.mkdir(workspacePath, { recursive: true });
    
    // Create subdirectories
    await Promise.all([
      fs.mkdir(path.join(workspacePath, workspaceStructure.componentsDir), { recursive: true }),
      fs.mkdir(path.join(workspacePath, workspaceStructure.authKeysDir), { recursive: true }),
      fs.mkdir(path.join(workspacePath, workspaceStructure.logsDir), { recursive: true }),
    ]);
  }

  private async setupTestUsers(workspacePath: string, taskId: string): Promise<void> {
    const testUsers = await this.generateTestUsers(taskId);
    await fs.writeFile(
      path.join(workspacePath, this.config.workspaceStructure.testUsersFile),
      JSON.stringify(testUsers, null, 2)
    );
  }

  private async createEnvironmentScript(workspacePath: string, server: ServerConfig): Promise<void> {
    const scriptContent = `# Environment Setup Script
$ErrorActionPreference = "Stop"

# Check OpenVPN Installation
function Test-OpenVPN {
    $openVPNPath = "C:\\Program Files\\OpenVPN"
    if (-not (Test-Path $openVPNPath)) {
        Write-Host "OpenVPN is not installed. Installing now..."
        # Download OpenVPN installer
        $installerUrl = "https://swupdate.openvpn.org/community/releases/OpenVPN-2.5.8-I601-amd64.msi"
        $installerPath = Join-Path $env:TEMP "openvpn-installer.msi"
        Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
        
        # Install OpenVPN
        Start-Process msiexec.exe -ArgumentList "/i \`"$installerPath\`" /quiet /norestart" -Wait
        Remove-Item $installerPath
    }
    return Test-Path $openVPNPath
}

# Connect to VPN
function Connect-VPN {
    try {
        # Stop any existing OpenVPN processes
        Get-Process openvpn -ErrorAction SilentlyContinue | Stop-Process -Force
        
        # Copy the OpenVPN config file from server path
        $ovpnSource = "${server.vpn_config_path}"
        $ovpnDest = Join-Path $PSScriptRoot "workspace.ovpn"
        Copy-Item -Path $ovpnSource -Destination $ovpnDest -Force
        
        # Start OpenVPN with the config
        $openVpnExe = "C:\\Program Files\\OpenVPN\\bin\\openvpn.exe"
        Start-Process $openVpnExe -ArgumentList "--config \`"$ovpnDest\`"" -NoNewWindow
        
        Write-Host "VPN connection initiated. Please wait..."
        Start-Sleep -Seconds 10
        
        # Check if connection is established
        $vpnInterface = Get-NetAdapter | Where-Object { $_.InterfaceDescription -like "*TAP-Windows*" }
        if ($vpnInterface.Status -eq "Up") {
            Write-Host "VPN connection established successfully to 10.24.1.10"
            return $true
        } else {
            Write-Host "VPN connection failed"
            return $false
        }
    } catch {
        Write-Host "Error connecting to VPN: $_"
        return $false
    }
}

# Connect to Remote Desktop
function Connect-ToWorkspace {
    param(
        [string]$ServerPath,
        [string]$Username = "${server.rdp_username}",
        [string]$Password = "${server.rdp_password}"
    )
    
    try {
        # Create credential file for RDP
        $credPath = Join-Path $PSScriptRoot "workspace.rdp"
        @"
username:s:$Username
password 51:b:$Password
"@ | Set-Content -Path $credPath

        # Connect using RDP
        Write-Host "Connecting to workspace at $ServerPath"
        mstsc $credPath /v:$ServerPath
    } catch {
        Write-Host "Failed to connect to workspace: $_"
        exit 1
    }
}

# Main execution
Write-Host "Setting up development environment..."

# Check and setup VPN
$vpnInstalled = Test-OpenVPN
if (-not $vpnInstalled) {
    Write-Host "Failed to setup OpenVPN"
    exit 1
}

# Connect to VPN
$vpnConnected = Connect-VPN
if (-not $vpnConnected) {
    Write-Host "Failed to connect to VPN"
    exit 1
}

# Connect to Remote Desktop
Connect-ToWorkspace -ServerPath "${server.workspace_path}"

Write-Host "Environment setup completed successfully"`;

    await fs.writeFile(
      path.join(workspacePath, this.config.workspaceStructure.runEnvironmentScript),
      scriptContent
    );
  }

  private async createReadme(workspacePath: string, taskId: string): Promise<void> {
    const readmeContent = await this.generateReadmeContent(taskId);
    await fs.writeFile(
      path.join(workspacePath, this.config.workspaceStructure.readmeFile),
      readmeContent
    );
  }

  private async generateTestUsers(taskId: string) {
    return {
      test_users: [
        {
          username: `test_user_${taskId}_01`,
          password: `Test@${taskId}123`,
          role: "User",
          task_scenario: "Default test scenario"
        }
      ]
    };
  }

  private async generateReadmeContent(taskId: string): Promise<string> {
    return `# Task ${taskId} Workspace

## Environment Setup
1. Ensure OpenVPN is installed
2. Run run-environment.ps1 to connect to the workspace
3. Use the provided test users in test-users.json for testing

## Directory Structure
- components-needed/: Required components for the task
- authentication-keys/: Authentication credentials
- logs/: Workspace activity logs

## Getting Started
1. Review the task requirements
2. Test the environment with provided test users
3. Submit your work through the Developer Portal

For support, contact the workspace administrator.
`;
  }
} 