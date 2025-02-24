import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.tasks.findMany({
    where: {
      status: "pending",
    },
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      status: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 10,
  });

  console.log("Available Tasks:", JSON.stringify(tasks, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
