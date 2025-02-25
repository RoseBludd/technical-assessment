import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    // Get task and its assignment
    const assignment = await prisma.task_assignments.findFirst({
      where: { 
        task_id: params.taskId 
      },
      include: {
        task: true,
        developer: true
      }
    });

    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Task assignment not found' }, { status: 404 });
    }

    // Get workspace path from assignment notes
    const notes = JSON.parse(assignment.notes || '{}');
    const workspacePath = notes.workspace_path;

    if (!workspacePath) {
      return NextResponse.json({ success: false, error: 'Workspace not found' }, { status: 404 });
    }

    // Run the workspace connection script
    const scriptPath = path.join(workspacePath, 'run-environment.ps1');
    await execAsync(`powershell.exe -File "${scriptPath}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to connect to workspace:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
} 