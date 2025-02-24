import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Setting up test data for leaderboard...");

  // Create test tasks with varying priorities
  const tasks = await Promise.all([
    prisma.tasks.create({
      data: {
        title: "High Priority Feature",
        description: "Implement critical system feature",
        priority: "high",
        status: "pending",
      },
    }),
    prisma.tasks.create({
      data: {
        title: "Medium Priority Bug Fix",
        description: "Fix reported system bug",
        priority: "medium",
        status: "pending",
      },
    }),
    prisma.tasks.create({
      data: {
        title: "Low Priority Enhancement",
        description: "Add minor UI enhancement",
        priority: "low",
        status: "pending",
      },
    }),
  ]);

  // Get specific developers
  const developers = await prisma.developers.findMany({
    where: {
      email: {
        in: [
          "junniel.rome@gmail.com",
          "kim.llante.morales@gmail.com",
          "monkeystylle@gmail.com",
        ],
      },
    },
  });

  console.log(`Found ${developers.length} developers`);

  // Create task assignments
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const assignments = [];

  for (const dev of developers) {
    // Create completed tasks
    assignments.push(
      prisma.task_assignments.create({
        data: {
          task_id: tasks[0].id,
          developer_id: dev.id,
          status: "completed",
          start_date: twoWeeksAgo,
          due_date: oneWeekAgo,
          completed_at: oneWeekAgo, // On time
          notes: "Completed on time with high quality",
        },
      })
    );

    // Create in-progress tasks
    assignments.push(
      prisma.task_assignments.create({
        data: {
          task_id: tasks[1].id,
          developer_id: dev.id,
          status: "in_progress",
          start_date: new Date(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 1 week
          notes: "Working on implementation",
        },
      })
    );

    // Create assigned but not started tasks
    assignments.push(
      prisma.task_assignments.create({
        data: {
          task_id: tasks[2].id,
          developer_id: dev.id,
          status: "assigned",
          start_date: new Date(),
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due in 2 weeks
          notes: "Task assigned, pending start",
        },
      })
    );
  }

  await Promise.all(assignments);
  console.log("Test data setup complete!");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
