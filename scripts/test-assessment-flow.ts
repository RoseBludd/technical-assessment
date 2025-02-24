import { PrismaClient, SkillTestSubmissionStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface Question {
  id: string;
  type: "multiple_choice" | "coding" | "text";
  question: string;
  options?: string[];
}

interface ProjectSubmission {
  githubUrl: string;
  prUrl: string;
  timeSpent: string;
  implementation: {
    component: string;
    api: string;
    tests: string;
  };
}

interface TestAnswers {
  [key: string]: string | ProjectSubmission;
}

async function testAssessmentFlow() {
  console.log("🔍 Starting Assessment Flow Test");
  console.log("================================");

  try {
    // 1. Verify SkillTestDefinitions exist
    console.log("\n📋 Checking Skill Test Definitions...");
    const tests = await prisma.skillTestDefinition.findMany();

    if (tests.length === 0) {
      throw new Error(
        "No skill tests found in database. Please run generate-tests.ts first."
      );
    }

    console.log(`✅ Found ${tests.length} test definitions:`);
    tests.forEach((test) => {
      console.log(`   - ${test.title} (${test.role})`);
      const questions = JSON.parse(JSON.stringify(test.questions));
      console.log(`     Questions: ${questions.length}`);
    });

    // 2. Test Developer Creation
    console.log("\n👤 Testing Developer Creation...");
    const testEmail = `test${Date.now()}@example.com`;
    const testDeveloper = await prisma.developers.create({
      data: {
        email: testEmail,
        name: "Test Developer",
        role: "frontend_specialist",
        paypal_email: testEmail,
        phone: "1234567890",
        portfolio_url: "https://example.com",
        years_experience: 5,
        skills: ["React", "TypeScript"],
        status: "pending",
        password_hash: "test_hash",
      },
    });
    console.log("✅ Test developer created successfully");

    // 3. Test Application Creation
    console.log("\n📝 Testing Application Creation...");
    const application = await prisma.developer_applications.create({
      data: {
        developer_id: testDeveloper.id,
        position: "frontend_specialist",
        status: "pending",
        whatsapp_number: "1234567890",
      },
    });
    console.log("✅ Test application created successfully");

    // 4. Create Test Submission
    console.log("\n📋 Testing Submission Creation...");
    const frontendTest = tests.find((t) => t.role === "frontend_specialist");
    if (!frontendTest) throw new Error("Frontend test not found");

    const submission = await prisma.test_submissions.create({
      data: {
        test_id: frontendTest.id,
        developer_id: testDeveloper.id,
        application_id: application.id,
        status: "in_progress",
        answers: {},
        started_at: new Date(),
      },
    });
    console.log("✅ Test submission created successfully");

    // 5. Test Submission Update
    console.log("\n✍️ Testing Submission Update...");
    const questions = JSON.parse(
      JSON.stringify(frontendTest.questions)
    ) as Question[];
    const mockAnswers: TestAnswers = {
      project: {
        githubUrl: "https://github.com/candidate/metrics-dashboard",
        prUrl: "https://github.com/restoremasters/dev-assessment/pull/42",
        timeSpent: "3.5 hours",
        implementation: {
          component: `/* Component implementation */`,
          api: `/* API implementation */`,
          tests: `/* Tests implementation */`,
        },
      },
    };

    await prisma.test_submissions.update({
      where: { id: submission.id },
      data: {
        answers: mockAnswers,
        status: "completed" as SkillTestSubmissionStatus,
        completed_at: new Date(),
        score: 92,
        ai_feedback: {
          overallFeedback:
            "Exceptional implementation of the metrics dashboard with strong attention to production readiness",
          technicalAssessment: {
            architecture: {
              score: 95,
              feedback:
                "Excellent component architecture with proper separation of concerns. Good use of TypeScript, error boundaries, and real-time updates. API implementation shows strong understanding of backend concepts.",
            },
            codeQuality: {
              score: 94,
              feedback:
                "Clean, maintainable code with proper TypeScript types. Good error handling and loading states. Effective use of React hooks and modern patterns.",
            },
            testing: {
              score: 90,
              feedback:
                "Comprehensive test coverage with proper mocking and error scenarios. Could add more edge cases and integration tests.",
            },
            performance: {
              score: 88,
              feedback:
                "Good use of caching and rate limiting. Consider implementing virtualization for large datasets and optimizing re-renders further.",
            },
          },
          strengths: [
            "Production-ready implementation with error boundaries",
            "Real-time updates with proper cleanup",
            "Strong TypeScript usage throughout",
            "Comprehensive error handling",
            "Clean and maintainable code structure",
            "Good test coverage",
          ],
          improvements: [
            "Consider implementing data virtualization for large datasets",
            "Add end-to-end tests with Cypress",
            "Implement client-side caching with SWR or React Query",
            "Add performance monitoring",
            "Consider implementing WebSocket for real-time updates",
          ],
          productionReadiness: {
            security: 95,
            reliability: 92,
            maintainability: 94,
            scalability: 88,
          },
        },
      },
    });
    console.log("✅ Test submission updated successfully");

    // 6. Clean up test data
    console.log("\n🧹 Cleaning up test data...");
    await prisma.test_submissions.delete({ where: { id: submission.id } });
    await prisma.developer_applications.delete({
      where: { id: application.id },
    });
    await prisma.developers.delete({ where: { id: testDeveloper.id } });
    console.log("✅ Test data cleaned up successfully");

    console.log("\n✨ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Error during testing:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testAssessmentFlow().catch(console.error);
