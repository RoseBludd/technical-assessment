import { Anthropic } from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { config } from "dotenv";
import { z } from "zod";
import simpleGit, { CleanOptions } from "simple-git";
import { TestResults, AIReview } from "./types";
import {
  runFrontendTests,
  runBackendTests,
  runIntegrationTests,
  runInfrastructureTests,
  runQATests,
} from "./test-runners";

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

interface TestResults {
  score: number;
  details: Record<string, any>;
  errors?: string[];
}

// Verify candidate's application
async function verifyCandidate(
  email: string,
  role: string
): Promise<{ applicationId: string; candidateId: string } | null> {
  const application = await prisma.developer_applications.findFirst({
    where: {
      developer: {
        email: email,
      },
      position: role,
      status: "pending",
    },
    select: {
      id: true,
      developer_id: true,
    },
  });

  return application
    ? { applicationId: application.id, candidateId: application.developer_id }
    : null;
}

async function runRoleSpecificTests(
  role: string,
  cloneUrl: string,
  branch: string
): Promise<TestResults> {
  const testDir = `./temp/${Date.now()}`;
  const git = simpleGit();

  try {
    await git.clone(cloneUrl, testDir, ["--branch", branch, "--single-branch"]);

    // Role-specific test execution
    switch (role) {
      case "frontend_specialist":
        return await runFrontendTests(testDir);
      case "backend_specialist":
        return await runBackendTests(testDir);
      case "integration_specialist":
        return await runIntegrationTests(testDir);
      case "devops_engineer":
        return await runInfrastructureTests(testDir);
      case "qa_engineer":
        return await runQATests(testDir);
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  } finally {
    // Cleanup
    await git.clean(CleanOptions.FORCE);
  }
}

async function getAIReview(submissionUrl: string, role: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1500,
    temperature: 0.5,
    messages: [
      {
        role: "user",
        content: `Review this code submission for ${role} role. Consider:
1. Code quality
2. Best practices
3. Error handling
4. Documentation
5. Architecture decisions

Submission URL: ${submissionUrl}

Format response as JSON with:
{
  "overall_score": number (0-100),
  "categories": {
    "code_quality": number (0-100),
    "best_practices": number (0-100),
    "error_handling": number (0-100),
    "documentation": number (0-100),
    "architecture": number (0-100)
  },
  "feedback": {
    "strengths": string[],
    "improvements": string[],
    "critical_issues": string[]
  }
}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return JSON.parse(content.text);
}

function calculateScore(testResults: TestResults, aiReview: any): number {
  const weights = {
    automated_tests: 0.4,
    ai_review: 0.6,
  };

  return Math.round(
    testResults.score * weights.automated_tests +
      aiReview.overall_score * weights.ai_review
  );
}

function extractEmailFromPRBody(body: string): string | null {
  const emailMatch = body.match(/Application Email:\s*\[?([^\]\s]+@[^\]\s]+)/i);
  return emailMatch ? emailMatch[1] : null;
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
    const submission = await prisma.submission.create({
      data: {
        candidateId: candidate.candidateId,
        candidateEmail: email,
        applicationId: candidate.applicationId,
        role: role,
        submissionUrl: payload.pull_request.html_url,
        status: "processing",
        prNumber: payload.pull_request.number,
        repositoryName: payload.repository.name,
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
    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: finalScore >= 70 ? "passed" : "failed",
        testResults: testResults,
        aiFeedback: aiReview,
        score: finalScore,
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
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(submissions);
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

app.get("/api/admin/submissions/:id", async (req: Request, res: Response) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Grading service running on port ${PORT}`);
});
