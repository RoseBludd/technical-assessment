import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const application = await prisma.developer_applications.findUnique({
      where: { id: context.params.id },
      include: {
        developers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
            portfolio_url: true,
          },
        },
        test_submissions: {
          orderBy: {
            created_at: "desc",
          },
          take: 1,
          select: {
            status: true,
            score: true,
            started_at: true,
            completed_at: true,
            ai_feedback: true,
            answers: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const submission = application.test_submissions[0];

    // Calculate time spent if test is completed
    const timeSpent =
      submission?.completed_at && submission?.started_at
        ? Math.round(
            (submission.completed_at.getTime() -
              submission.started_at.getTime()) /
              1000 /
              60
          )
        : null;

    const applicantDetail = {
      id: application.id,
      name: application.developers?.name,
      email: application.developers?.email,
      role: application.developers?.role,
      status: application.status,
      submittedAt: application.created_at?.toISOString(),
      score: submission?.score,
      testResults: submission
        ? {
            status: submission.status,
            startedAt: submission.started_at?.toISOString(),
            completedAt: submission.completed_at?.toISOString(),
            details: submission.answers,
          }
        : null,
      codeReview: submission?.ai_feedback,
      timeSpent: timeSpent ? `${timeSpent} minutes` : "Not completed",
      whatsappNumber: application.whatsapp_number,
      applicationStatus: application.status,
      applicationDate: application.created_at?.toISOString(),
      github_submission: application.github_submission,
    };

    return NextResponse.json(applicantDetail);
  } catch (error) {
    console.error("Error fetching applicant details:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicant details" },
      { status: 500 }
    );
  }
}
