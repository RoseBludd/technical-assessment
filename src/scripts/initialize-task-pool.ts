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

interface TaskData {
  id: string;
  title: string;
  category: string;
  complexity: 'low' | 'medium' | 'high';
  compensation: number;
  description: string;
  requirements: string[];
  acceptance_criteria: string[];
  parent_task?: string;
}

async function initializeTaskPool() {
  try {
    // Read task pool
    const taskPoolPath = join(process.cwd(), 'task-pool.json');
    const taskPool = JSON.parse(readFileSync(taskPoolPath, 'utf-8'));
    
    console.log('Initializing task pool...');
    let totalTasks = 0;

    // Process each department
    for (const [department, deptData] of Object.entries(taskPool.tasks)) {
      console.log(`\nProcessing ${department} department tasks...`);
      
      // Process each task type (trial, advanced, full, integration)
      const taskTypes = ['trial_tasks', 'advanced_tasks', 'full_tasks', 'integration_tasks'];
      
      for (const taskType of taskTypes) {
        if (!(deptData as any)[taskType]) continue;
        
        const tasks = (deptData as any)[taskType] as TaskData[];
        console.log(`\nProcessing ${taskType}:`);
        
        for (const task of tasks) {
          try {
            // Check if task already exists
            const existingTask = await prisma.tasks.findFirst({
              where: { title: task.title }
            });

            if (!existingTask) {
              // Create new task
              const dbTask = await prisma.tasks.create({
                data: {
                  title: task.title,
                  description: task.description + `\n\nRequirements:\n${task.requirements.join('\n')}\n\nAcceptance Criteria:\n${task.acceptance_criteria.join('\n')}`,
                  priority: task.complexity,
                  status: 'pending',
                  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                  created_at: new Date(),
                  updated_at: new Date()
                }
              });
              console.log(`✓ Created task: ${task.title} (${task.id})`);
              totalTasks++;
            } else {
              console.log(`• Task already exists: ${task.title} (${task.id})`);
            }
          } catch (error) {
            console.error(`✗ Failed to create task ${task.title}:`, error);
          }
        }
      }
    }

    console.log(`\nTask pool initialization complete. Created ${totalTasks} new tasks.`);

    // Now let's assign the Property Document Viewer task to Junniel
    const developer = await prisma.developers.findUnique({
      where: { email: 'junniel.rome@gmail.com' },
      select: { id: true }
    });

    if (!developer) {
      throw new Error('Developer Junniel not found');
    }

    const propertyViewerTask = await prisma.tasks.findFirst({
      where: { title: 'Property Document Viewer' }
    });

    if (!propertyViewerTask) {
      throw new Error('Property Document Viewer task not found in database');
    }

    // Create task assignment
    const assignment = await prisma.task_assignments.create({
      data: {
        task_id: propertyViewerTask.id,
        developer_id: developer.id,
        status: 'assigned',
        start_date: new Date(),
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        notes: JSON.stringify({
          message: "Initial task assignment for Property Document Viewer component",
          assigned_at: new Date().toISOString()
        })
      }
    });

    console.log('\nAssigned Property Document Viewer task to Junniel:');
    console.log('Assignment:', assignment);

  } catch (error) {
    console.error('Failed to initialize task pool:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the initialization
initializeTaskPool()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 