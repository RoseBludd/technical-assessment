import { PrismaClient } from '@prisma/client';
import { WorkspaceManagementService } from '../services/WorkspaceManagementService';
import { workspaceServers } from '../config/workspace-servers';
import { logger } from '../utils/logger';
import { preparePropertyViewerComponents } from './prepare-task-components';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://neondb_owner:npg_Y0CM8vIVoilD@ep-soft-pine-a56drgaq-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

interface TaskDetails {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  acceptance_criteria: string[];
  priority: 'low' | 'medium' | 'high';
  status: string;
}

async function assignTaskToJunniel() {
  try {
    // Task details for Property Document Viewer (CU-TR3)
    const taskDetails: TaskDetails = {
      id: 'CU-TR3',
      title: 'Property Document Viewer',
      description: 'Create document viewer for property files',
      requirements: [
        'PDF viewer component',
        'Image gallery',
        'File list view',
        'Basic search',
        'Download functionality'
      ],
      acceptance_criteria: [
        'PDF viewing works',
        'Gallery functional',
        'List view working',
        'Search operational',
        'Downloads working'
      ],
      priority: 'medium',
      status: 'pending'
    };

    // Get Junniel's developer ID
    const developer = await prisma.developers.findUnique({
      where: { email: 'junniel.rome@gmail.com' },
      select: { id: true }
    });

    if (!developer) {
      throw new Error('Developer not found');
    }

    // Create task in database
    const task = await prisma.tasks.create({
      data: {
        title: taskDetails.title,
        description: taskDetails.description,
        priority: taskDetails.priority,
        status: taskDetails.status,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Create task assignment
    const assignment = await prisma.task_assignments.create({
      data: {
        task_id: task.id,
        developer_id: developer.id,
        status: 'assigned',
        start_date: new Date(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: JSON.stringify({
          requirements: taskDetails.requirements,
          acceptance_criteria: taskDetails.acceptance_criteria
        })
      }
    });

    // Initialize workspace management service
    const workspaceService = new WorkspaceManagementService(workspaceServers);

    // Create workspace for the task
    const workspaceId = await workspaceService.createWorkspace(developer.id, task.id);

    console.log(`Task ${task.id} assigned to Junniel`);
    console.log(`Workspace created: ${workspaceId}`);

    // Prepare task-specific components
    await preparePropertyViewerComponents(workspaceId);
    console.log('Task components prepared successfully');

    // Update assignment with workspace information
    await prisma.task_assignments.update({
      where: { id: assignment.id },
      data: {
        notes: JSON.stringify({
          requirements: taskDetails.requirements,
          acceptance_criteria: taskDetails.acceptance_criteria,
          workspace_created: true,
          workspace_path: `${workspaceServers.baseServerPath}\\${workspaceId}`,
          components_prepared: true
        })
      }
    });

    return {
      taskId: task.id,
      developerId: developer.id,
      workspaceId: workspaceId
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to assign task: ${error.message}`);
    } else {
      console.error('Failed to assign task: Unknown error');
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the task assignment
assignTaskToJunniel()
  .then((result) => {
    console.log('Task assignment completed successfully');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error('Task assignment failed');
    console.error(error);
    process.exit(1);
  }); 