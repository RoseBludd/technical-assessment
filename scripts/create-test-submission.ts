import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestSubmission() {
  try {
    const timestamp = Date.now();
    // 1. Create a test developer
    const developer = await prisma.developers.create({
      data: {
        email: `test${timestamp}@example.com`,
        name: "Test Developer",
        role: "frontend_specialist",
        paypal_email: `test${timestamp}@example.com`,
        phone: "1234567890",
        portfolio_url: "https://example.com",
        years_experience: 5,
        skills: ["React", "TypeScript", "Next.js"],
        status: "pending",
        password_hash: "test_hash",
      },
    });

    // 2. Create an application
    const application = await prisma.developer_applications.create({
      data: {
        developer_id: developer.id,
        position: "frontend_specialist",
        status: "pending",
        whatsapp_number: "1234567890",
      },
    });

    // 3. Create a test submission
    const submission = await prisma.test_submissions.create({
      data: {
        test_id: "feabf349-3cbc-4657-8004-2bb8ffe45467", // The actual test ID we just created
        developer_id: developer.id,
        application_id: application.id,
        answers: {
          q1: "Test answer 1",
          q2: "Test answer 2",
          q3: "Test answer 3",
        },
        score: 85,
        ai_feedback: {
          overallFeedback: "Strong performance in frontend concepts",
          questionScores: [
            {
              questionId: "q1",
              score: 90,
              feedback: "Excellent understanding of React hooks",
            },
            {
              questionId: "q2",
              score: 85,
              feedback: "Good implementation of the user list component",
            },
            {
              questionId: "q3",
              score: 80,
              feedback: "Solid knowledge of React optimization techniques",
            },
          ],
          finalScore: 85,
          recommendedAction: "proceed",
        },
        status: "completed",
        started_at: new Date(),
        completed_at: new Date(),
      },
    });

    console.log("Test submission created successfully:", submission);
  } catch (error) {
    console.error("Error creating test submission:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSubmission();
