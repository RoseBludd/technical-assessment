import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const frontendQuestions = [
  {
    id: "fe_1",
    type: "multiple_choice",
    question: "What is the purpose of React's useEffect hook?",
    options: [
      "To handle side effects in functional components",
      "To create new React components",
      "To style React components",
      "To handle form submissions",
    ],
    correctAnswer: "To handle side effects in functional components",
  },
  {
    id: "fe_2",
    type: "coding",
    question: `Create a React component that fetches and displays a list of users from an API endpoint.
The component should:
- Show a loading state while fetching
- Handle errors appropriately
- Display the users in a list
- Use proper TypeScript types`,
  },
  {
    id: "fe_3",
    type: "multiple_choice",
    question:
      "Which of these is NOT a valid way to prevent unnecessary re-renders in React?",
    options: [
      "Using React.memo() for functional components",
      "Using shouldComponentUpdate in class components",
      "Using the useCallback hook for event handlers",
      "Using setState in the render method",
    ],
    correctAnswer: "Using setState in the render method",
  },
];

const backendQuestions = [
  {
    id: "be_1",
    type: "multiple_choice",
    question: "What is the purpose of database indexing?",
    options: [
      "To speed up data retrieval operations",
      "To encrypt sensitive data",
      "To compress database size",
      "To backup database contents",
    ],
    correctAnswer: "To speed up data retrieval operations",
  },
  {
    id: "be_2",
    type: "coding",
    question: `Create a Node.js/Express API endpoint that handles user authentication.
Requirements:
- Implement JWT token generation and validation
- Include proper error handling
- Use TypeScript
- Follow RESTful principles`,
  },
  {
    id: "be_3",
    type: "text",
    question:
      "Explain the concept of database normalization and when you might want to denormalize data. Provide examples.",
  },
];

const integrationQuestions = [
  {
    id: "int_1",
    type: "multiple_choice",
    question: "What is the primary purpose of an API Gateway?",
    options: [
      "To route requests to appropriate microservices",
      "To store application data",
      "To render frontend components",
      "To compile code",
    ],
    correctAnswer: "To route requests to appropriate microservices",
  },
  {
    id: "int_2",
    type: "coding",
    question: `Create a service that integrates with a third-party API and implements proper error handling and rate limiting.
Requirements:
- Implement retry logic with exponential backoff
- Handle API rate limits
- Cache responses appropriately
- Log all API interactions`,
  },
  {
    id: "int_3",
    type: "text",
    question:
      "Describe the challenges and solutions for maintaining data consistency in a distributed system.",
  },
];

async function generateTests() {
  try {
    // Create Frontend Test
    await prisma.skillTestDefinition.create({
      data: {
        title: "Frontend Developer Assessment",
        description: "Technical assessment for frontend developer position",
        role: "frontend_specialist",
        questions: frontendQuestions,
        passingScore: 70,
        timeLimit: 3600, // 1 hour
      },
    });

    // Create Backend Test
    await prisma.skillTestDefinition.create({
      data: {
        title: "Backend Developer Assessment",
        description: "Technical assessment for backend developer position",
        role: "backend_specialist",
        questions: backendQuestions,
        passingScore: 70,
        timeLimit: 3600,
      },
    });

    // Create Integration Specialist Test
    await prisma.skillTestDefinition.create({
      data: {
        title: "Integration Specialist Assessment",
        description: "Technical assessment for integration specialist position",
        role: "integration_specialist",
        questions: integrationQuestions,
        passingScore: 75,
        timeLimit: 3600,
      },
    });

    console.log("Successfully generated test questions!");
  } catch (error) {
    console.error("Error generating tests:", error);
  } finally {
    await prisma.$disconnect();
  }
}

generateTests();
