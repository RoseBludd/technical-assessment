import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Query developers
  const developer = await prisma.developers.findUnique({
    where: {
      id: "512868af-e4c1-4f05-853f-2fae5b1a0a84",
    },
  });
  console.log("Developer:", developer);

  // Query applications
  const application = await prisma.developer_applications.findFirst({
    where: {
      developer_id: "512868af-e4c1-4f05-853f-2fae5b1a0a84",
    },
  });
  console.log("Application:", application);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
