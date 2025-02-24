import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const testSubmissions = await prisma.test_submissions.findMany({
      where: {
        status: "completed",
      },
      orderBy: {
        completed_at: "desc",
      },
      include: {
        developer: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
        application: {
          select: {
            github_submission: true,
            position: true,
          },
        },
      },
    });

    const formattedResults = testSubmissions.map((submission) => {
      const aiFeedback = submission.ai_feedback
        ? JSON.parse(JSON.stringify(submission.ai_feedback))
        : null;

      return {
        id: submission.id,
        developer: {
          name: submission.developer.name,
          email: submission.developer.email,
          role: submission.developer.role,
        },
        test: {
          title: "Technical Assessment",
        },
        score: submission.score || 0,
        status: submission.status,
        completed_at: submission.completed_at?.toISOString() || "",
        ai_feedback: aiFeedback,
        github_submission: submission.application?.github_submission || null,
      };
    });

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Error fetching test results:", error);
    return NextResponse.json(
      { error: "Failed to fetch test results" },
      { status: 500 }
    );
  }
}
