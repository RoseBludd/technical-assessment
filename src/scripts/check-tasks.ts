import { PrismaClient } from '@prisma/client';

interface Developer {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface TaskAssignment {
  assignment_id: string;
  task_id: string;
  assignment_status: string;
  start_date: Date;
  due_date: Date;
  task_title: string;
  task_description: string;
  task_priority: string;
  task_status: string;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://neondb_owner:npg_Y0CM8vIVoilD@ep-soft-pine-a56drgaq-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function checkTasks() {
  try {
    // Get Junniel's info using raw query
    const developers = await prisma.$queryRaw<Developer[]>`
      SELECT id, email, name, role, status
      FROM developers
      WHERE email = 'junniel.rome@gmail.com'
    `;
    const developer = developers[0];
    console.log('\nDeveloper Info:', developer);

    if (!developer) {
      console.log('Developer not found');
      return;
    }

    // Get all tasks
    const tasks = await prisma.$queryRaw<Task[]>`
      SELECT id, title, description, priority, status, created_at, updated_at
      FROM tasks
    `;
    console.log('\nAll Tasks:', tasks);

    // Get task assignments for Junniel
    const assignments = await prisma.$queryRaw<TaskAssignment[]>`
      SELECT 
        ta.id as assignment_id,
        ta.task_id,
        ta.status as assignment_status,
        ta.start_date,
        ta.due_date,
        t.title as task_title,
        t.description as task_description,
        t.priority as task_priority,
        t.status as task_status
      FROM task_assignments ta
      JOIN tasks t ON t.id = ta.task_id::uuid
      WHERE ta.developer_id = ${developer.id}::uuid
    `;
    console.log('\nJunniel\'s Task Assignments:', assignments);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the check
checkTasks()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 