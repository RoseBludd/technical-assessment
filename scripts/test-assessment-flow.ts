import { PrismaClient, SkillTestSubmissionStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface Question {
  id: string;
  type: "multiple_choice" | "coding" | "text";
  question: string;
  options?: string[];
}

interface TestAnswers {
  [questionId: string]: string;
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
    const mockAnswers: TestAnswers = questions.reduce((acc, q) => {
      acc[q.id] =
        q.type === "multiple_choice" && q.options
          ? q.options[0]
          : "Test answer";
      return acc;
    }, {} as TestAnswers);

    await prisma.test_submissions.update({
      where: { id: submission.id },
      data: {
        answers: mockAnswers,
        status: "completed" as SkillTestSubmissionStatus,
        completed_at: new Date(),
        score: 85,
        ai_feedback: {
          overallFeedback: "Good attempt",
          questionScores: questions.map((q) => ({
            questionId: q.id,
            score: 85,
            feedback: "Good answer",
          })),
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
