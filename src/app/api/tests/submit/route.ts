import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Anthropic } from "@anthropic-ai/sdk";

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface SubmissionBody {
  testId: string;
  answers: Record<string, string>;
}

async function gradeTest(test: any, answers: Record<string, string>) {
  const prompt = `You are an expert technical interviewer tasked with grading a coding assessment. Please evaluate the following answers and provide detailed feedback for each question. Consider correctness, code quality, and problem-solving approach where applicable.

Test Questions and Answers:
${test.questions
  .map(
    (q: any, index: number) => `
Question ${index + 1}: ${q.question}
Type: ${q.type}
Candidate's Answer: ${answers[q.id] || "No answer provided"}
`
  )
  .join("\n")}

Please provide:
1. A score for each question (0-100)
2. Specific feedback for each answer
3. Overall assessment and recommendations
4. Final score (0-100)

Format your response as a JSON object with the following structure:
{
  "questionScores": [
    {
      "questionId": "string",
      "score": number,
      "feedback": "string"
    }
  ],
  "overallFeedback": "string",
  "finalScore": number,
  "recommendedAction": "proceed" | "reject"
}`;

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1500,
    temperature: 0.5,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  try {
    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Failed to grade test");
  }
}

export async function POST(request: Request) {
  try {
    const body: SubmissionBody = await request.json();
    const { testId, answers } = body;

    // Fetch the test
    const test = await prisma.skill_tests.findUnique({
      where: {
        id: testId,
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Grade the test using AI
    const grading = await gradeTest(test, answers);

    // Update the submission status
    await prisma.test_submissions.update({
      where: {
        id: testId,
      },
      data: {
        status: grading.finalScore >= test.passing_score ? "passed" : "failed",
        score: grading.finalScore,
        completed_at: new Date(),
        ai_feedback: grading,
      },
    });

    // Send email notification about the results
    // TODO: Implement email notification

    return NextResponse.json({
      success: true,
      data: {
        score: grading.finalScore,
        feedback: grading.overallFeedback,
        passed: grading.finalScore >= test.passing_score,
      },
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    return NextResponse.json(
      { error: "Failed to submit test" },
      { status: 500 }
    );
  }
}
