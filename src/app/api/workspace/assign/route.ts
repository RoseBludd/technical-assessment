import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { WorkspaceManager } from '@/lib/workspace-manager';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get available workspace
    const workspaceManager = WorkspaceManager.getInstance();
    const workspace = await workspaceManager.getAvailableWorkspace();

    if (!workspace) {
      return NextResponse.json({ error: 'No workspaces available' }, { status: 503 });
    }

    // Get connection details
    const details = await workspaceManager.getConnectionDetails(workspace.username);

    return NextResponse.json({
      username: workspace.username,
      ...details
    });
  } catch (error) {
    console.error('Failed to assign workspace:', error);
    return NextResponse.json(
      { error: 'Failed to assign workspace' },
      { status: 500 }
    );
  }
} 