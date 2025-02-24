import { PrismaClient, SkillTestDeveloperRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating skill tests and assignments...");

  // Create skill test definitions
  const tests = await Promise.all([
    prisma.skillTestDefinition.create({
      data: {
        title: "Frontend Development Test - React Components",
        description:
          "Create a reusable React component library with TypeScript",
        role: "frontend_specialist" as SkillTestDeveloperRole,
        questions: {
          tasks: [
            {
              title: "Component Library",
              description: "Create reusable UI components",
              points: 40,
            },
            {
              title: "TypeScript Integration",
              description: "Implement proper typing",
              points: 30,
            },
            {
              title: "Documentation",
              description: "Document component usage",
              points: 30,
            },
          ],
        },
        passingScore: 70,
        timeLimit: 480, // 8 hours
      },
    }),
    prisma.skillTestDefinition.create({
      data: {
        title: "Backend Integration Test - API Development",
        description: "Develop a RESTful API with Node.js and Express",
        role: "backend_specialist" as SkillTestDeveloperRole,
        questions: {
          tasks: [
            {
              title: "API Design",
              description: "Design RESTful endpoints",
              points: 30,
            },
            {
              title: "Database Integration",
              description: "Implement database operations",
              points: 40,
            },
            {
              title: "Error Handling",
              description: "Implement proper error handling",
              points: 30,
            },
          ],
        },
        passingScore: 70,
        timeLimit: 600, // 10 hours
      },
    }),
    prisma.skillTestDefinition.create({
      data: {
        title: "Full Stack Test - User Authentication",
        description: "Implement user authentication system with JWT",
        role: "fullstack_developer" as SkillTestDeveloperRole,
        questions: {
          tasks: [
            {
              title: "Frontend Implementation",
              description: "Create login/register UI",
              points: 30,
            },
            {
              title: "Backend Authentication",
              description: "Implement JWT authentication",
              points: 40,
            },
            {
              title: "Security Measures",
              description: "Implement security best practices",
              points: 30,
            },
          ],
        },
        passingScore: 75,
        timeLimit: 720, // 12 hours
      },
    }),
  ]);

  console.log("Created skill tests:", tests);

  // Get or create developer applications
  const developers = [
    {
      email: "kim.llante.morales@gmail.com",
      role: "frontend_specialist" as SkillTestDeveloperRole,
    },
    {
      email: "monkeystylle@gmail.com",
      role: "backend_specialist" as SkillTestDeveloperRole,
    },
    {
      email: "junniel.rome@gmail.com",
      role: "fullstack_developer" as SkillTestDeveloperRole,
    },
  ];

  const applications = await Promise.all(
    developers.map(async (dev) => {
      const developer = await prisma.developers.findUnique({
        where: { email: dev.email },
      });

      if (!developer) {
        throw new Error(`Developer ${dev.email} not found`);
      }

      let application = await prisma.developer_applications.findFirst({
        where: { developer_id: developer.id },
      });

      if (!application) {
        application = await prisma.developer_applications.create({
          data: {
            developer_id: developer.id,
            position: dev.role,
            status: "active",
            will_do_test_task: true,
          },
        });
      }

      return { developer, application };
    })
  );

  console.log("Developer applications:", applications);

  // Create test submissions
  const submissions = await Promise.all(
    applications.map(async ({ developer, application }, index) => {
      return prisma.test_submissions.create({
        data: {
          developer_id: developer.id,
          application_id: application.id,
          test_id: tests[index].id,
          status: "in_progress",
          answers: [],
          ai_feedback: {},
        },
      });
    })
  );

  console.log("Created test submissions:", submissions);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
