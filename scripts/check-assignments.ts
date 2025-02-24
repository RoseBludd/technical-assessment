import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const developer = await prisma.developers.findUnique({
    where: { email: "junniel.rome@gmail.com" },
    select: { id: true },
  });

  if (!developer) {
    console.log("Developer not found");
    return;
  }

  const assignments = await prisma.$queryRaw`
    SELECT 
      t.id,
      t.title,
      t.description,
      t.priority,
      t.status as task_status,
      ta.status as assignment_status,
      ta.notes,
      ta.start_date,
      ta.due_date,
      ta.completed_at
    FROM tasks t
    INNER JOIN task_assignments ta ON t.id::text = ta.task_id
    WHERE ta.developer_id = ${developer.id}::uuid
    ORDER BY ta.start_date DESC
  `;

  console.log("Task Assignments:", JSON.stringify(assignments, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
