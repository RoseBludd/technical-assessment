import { PrismaClient } from "@prisma/client";
import { Anthropic } from "@anthropic-ai/sdk";

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
}

interface AIFeedback {
  questionScores: Array<{
    questionId: string;
    score: number;
    feedback: string;
  }>;
  overallFeedback: string;
  finalScore: number;
  recommendedAction: "proceed" | "reject";
}

const mockAnswers = {
  fe_1: "To handle side effects in functional components",
  fe_2: `
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://api.example.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} ({user.email})
        </li>
      ))}
    </ul>
  );
}`,
  fe_3: "Using setState in the render method",
};

async function getAnthropicApiKey(): Promise<string> {
  return "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";
}

async function testAIGrading() {
  const prisma = new PrismaClient();

  try {
    console.log("🔐 Fetching Anthropic API key from AWS Secrets Manager...");
    const apiKey = await getAnthropicApiKey();

    const anthropic = new Anthropic({
      apiKey,
    });

    console.log("🤖 Testing AI Grading System");
    console.log("===========================");

    // 1. Get a test
    console.log("\n📋 Fetching Frontend Test...");
    const test = await prisma.skillTestDefinition.findFirst({
      where: {
        role: "frontend_specialist",
      },
    });

    if (!test || !test.questions) {
      throw new Error("Frontend test not found or has no questions");
    }
    console.log("✅ Test found:", test.title);

    // 2. Prepare grading prompt
    console.log("\n📝 Preparing grading prompt...");
    const questions = test.questions as unknown as Question[];
    const prompt = `You are an expert technical interviewer tasked with grading a coding assessment. Please evaluate the following answers and provide detailed feedback for each question. Consider correctness, code quality, and problem-solving approach where applicable.

Test Questions and Answers:
${questions
  .map(
    (q, index) => `
Question ${index + 1}: ${q.question}
Type: ${q.type}
Candidate's Answer: ${
      mockAnswers[q.id as keyof typeof mockAnswers] || "No answer provided"
    }
`
  )
  .join("\n")}

IMPORTANT: You must respond with ONLY a valid JSON object in the following format, with no additional text or explanation. Use a scoring scale of 0-5 where:
0 = No understanding/completely incorrect
1 = Basic understanding with major issues
2 = Fair understanding with significant gaps
3 = Good understanding with minor issues
4 = Very good understanding with minimal issues
5 = Excellent understanding/perfect answer

{
  "questionScores": [
    {
      "questionId": "string",
      "score": number (0-5),
      "feedback": "string"
    }
  ],
  "overallFeedback": "string",
  "finalScore": number (0-5),
  "recommendedAction": "proceed" | "reject"
}

Do not include any text before or after the JSON object. The response must be parseable by JSON.parse().`;

    // 3. Get AI Feedback
    console.log("\n🤖 Getting AI Feedback...");
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

    let feedbackText = "";
    if (response.content[0].type === "text") {
      feedbackText = response.content[0].text;
    }

    const feedback = JSON.parse(feedbackText) as AIFeedback;
    console.log("\n✨ AI Feedback Received:");
    console.log("=======================");
    console.log("Final Score:", feedback.finalScore);
    console.log("\nOverall Feedback:", feedback.overallFeedback);
    console.log("\nQuestion Scores:");
    feedback.questionScores.forEach((score, index) => {
      console.log(`\nQuestion ${index + 1}:`);
      console.log(`Score: ${score.score}`);
      console.log(`Feedback: ${score.feedback}`);
    });
    console.log("\nRecommended Action:", feedback.recommendedAction);
  } catch (error) {
    console.error("\n❌ Error during AI grading test:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testAIGrading().catch(console.error);
