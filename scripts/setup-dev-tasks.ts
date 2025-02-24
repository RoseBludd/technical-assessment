import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const developmentTasks = [
  {
    title: "Implement Developer Dashboard",
    description:
      "Create a comprehensive dashboard for developers to view and manage their tasks",
    priority: "high",
    status: "pending",
    requirements: [
      "Task list view with filtering",
      "Task status management",
      "Progress tracking",
      "Time logging integration",
      "Performance metrics display",
    ].join("\n"),
  },
  {
    title: "Build Task Assignment System",
    description:
      "Develop a system for automatic and manual task assignments to developers",
    priority: "high",
    status: "pending",
    requirements: [
      "Developer skill matching",
      "Workload balancing",
      "Priority-based assignment",
      "Assignment notifications",
      "Task acceptance workflow",
    ].join("\n"),
  },
  {
    title: "Create Code Review Pipeline",
    description:
      "Implement an automated code review system with manual review integration",
    priority: "medium",
    status: "pending",
    requirements: [
      "Automated code analysis",
      "Review assignment workflow",
      "Comment threading",
      "Change request tracking",
      "Review metrics",
    ].join("\n"),
  },
];

async function main() {
  console.log("Setting up development tasks...");

  // Get developer ID for Junniel
  const developer = await prisma.developers.findUnique({
    where: { email: "junniel.rome@gmail.com" },
    select: { id: true },
  });

  if (!developer) {
    console.log("Developer not found");
    return;
  }

  // Create tasks and assignments
  for (const task of developmentTasks) {
    const createdTask = await prisma.tasks.create({
      data: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Create task assignment
    await prisma.task_assignments.create({
      data: {
        task_id: createdTask.id,
        developer_id: developer.id,
        status: "assigned",
        start_date: new Date(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: task.requirements,
      },
    });

    console.log(`Created task: ${task.title}`);
  }

  console.log("Development tasks setup complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
