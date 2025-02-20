import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestDefinition() {
  try {
    const test = await prisma.skillTestDefinition.create({
      data: {
        title: "Frontend Developer Assessment",
        description: "Technical assessment for frontend developer position",
        role: "frontend_specialist",
        questions: [
          {
            id: "q1",
            type: "multiple_choice",
            question: "What is the purpose of React's useEffect hook?",
            options: [
              "To handle side effects in functional components",
              "To create new React components",
              "To style React components",
              "To handle form submissions",
            ],
          },
          {
            id: "q2",
            type: "coding",
            question:
              "Create a React component that fetches and displays a list of users from an API endpoint.",
          },
          {
            id: "q3",
            type: "multiple_choice",
            question:
              "Which of these is NOT a valid way to prevent unnecessary re-renders in React?",
            options: [
              "Using React.memo() for functional components",
              "Using shouldComponentUpdate in class components",
              "Using the useCallback hook for event handlers",
              "Using setState in the render method",
            ],
          },
        ],
        passingScore: 70,
        timeLimit: 3600, // 1 hour
      },
    });

    console.log("Test definition created successfully:", test);
    console.log("Test ID (use this in create-test-submission.ts):", test.id);
  } catch (error) {
    console.error("Error creating test definition:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestDefinition();
