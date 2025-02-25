import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://neondb_owner:npg_Y0CM8vIVoilD@ep-soft-pine-a56drgaq-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function assignPropertyViewerTask() {
  try {
    // Read task pool to get task details
    const taskPoolPath = join(process.cwd(), 'task-pool.json');
    const taskPool = JSON.parse(readFileSync(taskPoolPath, 'utf-8'));

    // Find the Property Document Viewer task
    const task = taskPool.tasks.customer_updates.trial_tasks.find(
      (t: any) => t.id === 'CU-TR3'
    );

    if (!task) {
      throw new Error('Property Document Viewer task not found in task pool');
    }

    // Get Junniel's developer ID
    const developer = await prisma.developers.findUnique({
      where: { email: 'junniel.rome@gmail.com' },
      select: { id: true }
    });

    if (!developer) {
      throw new Error('Developer not found');
    }

    // Create task in database
    const dbTask = await prisma.tasks.create({
      data: {
        title: task.title,
        description: task.description,
        priority: task.complexity,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Create task assignment
    const assignment = await prisma.task_assignments.create({
      data: {
        task_id: dbTask.id,
        developer_id: developer.id,
        status: 'assigned',
        start_date: new Date(),
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        notes: JSON.stringify({
          requirements: task.requirements,
          acceptance_criteria: task.acceptance_criteria,
          compensation: task.compensation
        })
      }
    });

    console.log('Task created:', dbTask);
    console.log('Assignment created:', assignment);

    return { task: dbTask, assignment };
  } catch (error) {
    console.error('Failed to assign task:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the assignment
assignPropertyViewerTask()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 