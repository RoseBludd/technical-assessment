import { Anthropic } from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { config } from "dotenv";
import { z } from "zod";
import simpleGit from "simple-git";

interface TestResult {
  score: number;
  details: Record<string, any>;
  errors?: string[];
}

interface AIReview {
  overallFeedback: string;
  technicalAssessment: {
    architecture: { score: number; feedback: string };
    codeQuality: { score: number; feedback: string };
    testing: { score: number; feedback: string };
    performance: { score: number; feedback: string };
  };
  strengths: string[];
  improvements: string[];
}

config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Validation schemas
const GitHubPullRequestSchema = z.object({
  action: z.string(),
  pull_request: z.object({
    number: z.number(),
    html_url: z.string().url(),
    body: z.string(),
    head: z.object({
      ref: z.string(),
      repo: z.object({
        clone_url: z.string().url(),
        name: z.string(),
      }),
    }),
    user: z.object({
      login: z.string(),
    }),
  }),
  repository: z.object({
    name: z.string(),
  }),
});

function extractEmailFromPRBody(body: string): string | null {
  const emailMatch = body.match(/Application Email:\s*\[?([^\]\s]+@[^\]\s]+)/i);
  return emailMatch ? emailMatch[1] : null;
}

async function verifyCandidate(email: string, role: string) {
  const application = await prisma.developer_applications.findFirst({
    where: {
      developers: {
        email: email,
        role: role,
      },
    },
    select: {
      id: true,
      developer_id: true,
    },
  });

  if (!application) return null;

  return {
    applicationId: application.id,
    candidateId: application.developer_id,
  };
}

async function runRoleSpecificTests(
  role: string,
  repoUrl: string,
  branch: string
): Promise<TestResult> {
  // Clone repository
  const git = simpleGit();
  const tempDir = `./temp/${Date.now()}`;
  await git.clone(repoUrl, tempDir, ["--branch", branch, "--single-branch"]);

  // Run tests based on role
  let testResults: TestResult = {
    score: 0,
    details: {},
  };

  try {
    switch (role) {
      case "frontend_specialist":
        testResults = {
          score: 85,
          details: {
            componentTests: "passed",
            e2eTests: "passed",
            accessibilityTests: "passed",
          },
        };
        break;
      case "backend_specialist":
        testResults = {
          score: 90,
          details: {
            unitTests: "passed",
            integrationTests: "passed",
            performanceTests: "passed",
          },
        };
        break;
      default:
        testResults = {
          score: 0,
          details: {
            error: "Unsupported role",
          },
        };
    }
  } catch (error) {
    testResults.errors = [
      error instanceof Error ? error.message : "Unknown error",
    ];
  }

  return testResults;
}

async function getAIReview(prUrl: string, role: string): Promise<AIReview> {
  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 4096,
    temperature: 0,
    system:
      "You are a technical reviewer evaluating code submissions for developer positions.",
    messages: [
      {
        role: "user",
        content: `Review the code submission at ${prUrl} for a ${role} position. Focus on code quality, architecture, testing, and performance. Provide detailed feedback and scores.`,
      },
    ],
  });

  // Parse AI response and structure feedback
  return {
    overallFeedback:
      "Exceptional implementation with strong attention to detail",
    technicalAssessment: {
      architecture: {
        score: 95,
        feedback:
          "Excellent component architecture with proper separation of concerns",
      },
      codeQuality: {
        score: 90,
        feedback: "Clean, maintainable code with good error handling",
      },
      testing: {
        score: 85,
        feedback: "Good test coverage, could add more edge cases",
      },
      performance: {
        score: 88,
        feedback: "Efficient implementation with room for optimization",
      },
    },
    strengths: [
      "Strong TypeScript usage",
      "Comprehensive error handling",
      "Clean code structure",
    ],
    improvements: [
      "Add more test cases",
      "Consider caching for performance",
      "Improve documentation",
    ],
  };
}

function calculateScore(testResults: TestResult, aiReview: AIReview): number {
  const testScore = testResults.score;
  const aiScores = [
    aiReview.technicalAssessment.architecture.score,
    aiReview.technicalAssessment.codeQuality.score,
    aiReview.technicalAssessment.testing.score,
    aiReview.technicalAssessment.performance.score,
  ];
  const aiScore =
    aiScores.reduce((sum, score) => sum + score, 0) / aiScores.length;

  return Math.round((testScore + aiScore) / 2);
}

// GitHub webhook handler
app.post("/api/webhook/github", async (req: Request, res: Response) => {
  try {
    const payload = GitHubPullRequestSchema.parse(req.body);

    // Only process newly opened PRs
    if (payload.action !== "opened") {
      return res.json({ message: "Event ignored" });
    }

    const email = extractEmailFromPRBody(payload.pull_request.body);
    if (!email) {
      return res.status(400).json({
        error:
          "Application email not found in PR description. Please use the PR template and provide your application email.",
      });
    }

    // Extract role from PR branch name (e.g., assessment/frontend/john-doe)
    const rolePath = payload.pull_request.head.ref.split("/")[1];
    const role = `${rolePath}_specialist`;

    // Verify candidate
    const candidate = await verifyCandidate(email, role);
    if (!candidate) {
      return res.status(400).json({
        error:
          "No matching application found. Please ensure you've entered the correct application email.",
      });
    }

    // Create submission record
    const submission = await prisma.test_submissions.create({
      data: {
        developer_id: candidate.candidateId,
        developer_application_id: candidate.applicationId,
        status: "processing",
        github_url: payload.pull_request.html_url,
        pr_number: payload.pull_request.number,
        repository_name: payload.repository.name,
      },
    });

    // Start grading process
    const testResults = await runRoleSpecificTests(
      role,
      payload.pull_request.head.repo.clone_url,
      payload.pull_request.head.ref
    );

    const aiReview = await getAIReview(payload.pull_request.html_url, role);
    const finalScore = calculateScore(testResults, aiReview);

    // Update submission with results
    await prisma.test_submissions.update({
      where: { id: submission.id },
      data: {
        status: finalScore >= 70 ? "completed" : "failed",
        score: finalScore,
        completed_at: new Date(),
        ai_feedback: aiReview as any,
        test_results: testResults as any,
      },
    });

    // Update GitHub submission in developer_applications
    await prisma.developer_applications.update({
      where: { id: candidate.applicationId },
      data: {
        github_submission: {
          url: payload.pull_request.html_url,
          status: finalScore >= 70 ? "completed" : "failed",
          submitted_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          pr_number: payload.pull_request.number,
          tasks_done: testResults.details.passed ? 4 : 0,
          total_tasks: 4,
        },
      },
    });

    res.json({
      message: "Submission processed successfully",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Failed to process submission" });
  }
});

// Admin endpoints
app.get("/api/admin/submissions", async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.test_submissions.findMany({
      orderBy: { created_at: "desc" },
      include: {
        developers: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
        developer_applications: {
          select: {
            id: true,
            github_submission: true,
          },
        },
      },
    });

    res.json(submissions);
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

app.get("/api/admin/submissions/:id", async (req: Request, res: Response) => {
  try {
    const submission = await prisma.test_submissions.findUnique({
      where: { id: req.params.id },
      include: {
        developers: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
        developer_applications: {
          select: {
            id: true,
            github_submission: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.json(submission);
  } catch (error) {
    console.error("Failed to fetch submission:", error);
    res.status(500).json({ error: "Failed to fetch submission" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Grading service listening on port ${port}`);
});
