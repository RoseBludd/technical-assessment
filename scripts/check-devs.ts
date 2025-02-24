import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const developers = await prisma.developers.findMany({
    where: {
      email: {
        in: [
          "kim.llante.morales@gmail.com",
          "monkeystylle@gmail.com",
          "junniel.rome@gmail.com",
        ],
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log(JSON.stringify(developers, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
