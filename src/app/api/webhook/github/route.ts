import { NextResponse } from "next/server";
import {
  PrismaClient,
  developer_role,
  SkillTestSubmissionStatus,
} from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

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

function extractEmailFromPRBody(body: string): string | undefined {
  const emailMatch = body.match(/Application Email:\s*\[?([^\]\s]+@[^\]\s]+)/i);
  return emailMatch ? emailMatch[1] : undefined;
}

interface CandidateInfo {
  applicationId: string;
  candidateId: string;
}

async function verifyCandidate(
  email: string,
  role: developer_role
): Promise<CandidateInfo | undefined> {
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

  if (!application || !application.developer_id) return undefined;

  return {
    applicationId: application.id,
    candidateId: application.developer_id,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = GitHubPullRequestSchema.parse(body);

    // Only process newly opened PRs
    if (payload.action !== "opened") {
      return NextResponse.json({ message: "Event ignored" });
    }

    const email = extractEmailFromPRBody(payload.pull_request.body);
    if (!email) {
      return NextResponse.json(
        {
          error:
            "Application email not found in PR description. Please use the PR template and provide your application email.",
        },
        { status: 400 }
      );
    }

    // Extract role from PR branch name (e.g., assessment/frontend/john-doe)
    const rolePath = payload.pull_request.head.ref.split("/")[1];
    const role = `${rolePath}_specialist` as developer_role;

    // Verify candidate
    const candidate = await verifyCandidate(email, role);
    if (!candidate) {
      return NextResponse.json(
        {
          error:
            "No matching application found. Please ensure you've entered the correct application email.",
        },
        { status: 400 }
      );
    }

    // Get the appropriate test for the role
    const test = await prisma.skillTestDefinition.findFirst({
      where: {
        role: role,
      },
      select: {
        id: true,
      },
    });

    if (!test) {
      return NextResponse.json(
        {
          error: `No test found for role: ${role}. Please contact support.`,
        },
        { status: 400 }
      );
    }

    // Create submission record
    const submission = await prisma.test_submissions.create({
      data: {
        developer_id: candidate.candidateId,
        application_id: candidate.applicationId,
        test_id: test.id,
        status: SkillTestSubmissionStatus.pending,
        answers: [],
      },
    });

    // Update GitHub submission in developer_applications
    await prisma.developer_applications.update({
      where: { id: candidate.applicationId },
      data: {
        github_submission: {
          url: payload.pull_request.html_url,
          status: "pending",
          submitted_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          pr_number: payload.pull_request.number,
          tasks_done: 0,
          total_tasks: 4,
        },
      },
    });

    return NextResponse.json({
      message: "Submission processed successfully",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
