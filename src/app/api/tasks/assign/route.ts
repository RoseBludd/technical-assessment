import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceManagementService } from "@/services/WorkspaceManagementService";
import { WorkspaceConfig } from "@/config/workspace-management";
import path from "path";
import { promises as fs } from "fs";

// Default workspace config
const defaultConfig: WorkspaceConfig = {
  baseServerPath: process.cwd(),
  maxDevelopersPerServer: 10,
  servers: [{
    id: "dev-server-1",
    name: "Development Server 1",
    ipAddress: "vpnuser3@c:\\Users\\GENIUS\\Desktop\\User3",
    availableSlots: 10,
    status: "active"
  }],
  workspaceStructure: {
    componentsDir: "components",
    authKeysDir: "auth",
    logsDir: "logs",
    testUsersFile: "test-users.json",
    runEnvironmentScript: "run-environment.ps1",
    readmeFile: "README.md"
  }
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { taskId, notes } = await request.json();

    // Get the developer's ID first
    const developer = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM developers WHERE email = ${session.user.email}
    `;

    if (!developer?.length) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 }
      );
    }

    // Create task assignment
    const assignment = await prisma.$queryRaw<any[]>`
      INSERT INTO task_assignments (
        task_id, 
        developer_id, 
        status, 
        notes, 
        start_date, 
        due_date
      )
      VALUES (
        ${taskId},
        ${developer[0].id},
        'assigned',
        ${notes},
        NOW(),
        NOW() + INTERVAL '7 days'
      )
      RETURNING *
    `;

    // Initialize workspace management
    const workspaceService = new WorkspaceManagementService(defaultConfig);
    
    try {
      // Create workspace for the task
      const workspaceId = await workspaceService.createWorkspace(developer[0].id, taskId);
      
      // Create OpenVPN configuration
      const vpnConfigPath = path.join(process.cwd(), "vpn", "config.ovpn");
      const vpnConfig = await fs.readFile(vpnConfigPath, "utf-8");
      
      // Update the VPN config with the user credentials
      const updatedVpnConfig = vpnConfig
        .replace("{{USERNAME}}", "vpnuser3")
        .replace("{{PASSWORD}}", "Roof$7663");
      
      // Save the updated VPN config to the workspace
      const workspacePath = path.join("dev-server-1", "workspaces", workspaceId);
      await fs.writeFile(
        path.join(workspacePath, "workspace.ovpn"),
        updatedVpnConfig
      );

      // Return the assignment with workspace info
      return NextResponse.json({
        ...assignment[0],
        workspace: {
          id: workspaceId,
          path: workspacePath,
          vpnConfigPath: path.join(workspacePath, "workspace.ovpn")
        }
      });
    } catch (error) {
      console.error("Workspace setup failed:", error);
      // Still return the assignment even if workspace setup fails
      return NextResponse.json(assignment[0]);
    }
  } catch (error) {
    console.error("Failed to assign task:", error);
    return NextResponse.json(
      { error: "Failed to assign task" },
      { status: 500 }
    );
  }
}
