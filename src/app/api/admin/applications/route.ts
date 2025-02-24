import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GithubSubmission {
  url: string;
  status: "pending" | "passed" | "failed";
  submitted_at: string;
  last_updated: string;
  pr_number: number;
  tasks_done: number;
  total_tasks: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    // Build the where clause for the query
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (role && role !== "all") {
      where.position = role;
    }

    if (search) {
      where.OR = [
        {
          developers: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          developers: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const applications = await prisma.$transaction(async (tx) => {
      return await tx.developer_applications.findMany({
        where,
        include: {
          developers: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
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
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });
    });

    if (!applications) {
      return new NextResponse(JSON.stringify({ data: [] }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const formattedApplications = applications.map((app) => {
      // Parse GitHub submission data if it exists
      const githubData = app.github_submission
        ? {
            submissionUrl: (app.github_submission as GithubSubmission).url,
            status:
              (app.github_submission as GithubSubmission).status || "pending",
            submittedAt: (app.github_submission as GithubSubmission)
              .submitted_at,
            lastUpdated: (app.github_submission as GithubSubmission)
              .last_updated,
            prNumber: (app.github_submission as GithubSubmission).pr_number,
            tasksDone:
              (app.github_submission as GithubSubmission).tasks_done || 0,
            totalTasks:
              (app.github_submission as GithubSubmission).total_tasks || 4,
          }
        : null;

      return {
        id: app.id,
        name: app.developers?.name || "",
        email: app.developers?.email || "",
        role: app.position,
        status: app.status || "pending",
        submittedAt: app.created_at
          ? app.created_at.toISOString()
          : new Date().toISOString(),
        score: app.test_submissions?.[0]?.score || null,
        meetingNotes: app.meeting_notes || null,
        interestLevel: app.interest_level || "undecided",
        lastMeetingDate: app.last_meeting_date?.toISOString() || null,
        nextMeetingDate: app.next_meeting_date?.toISOString() || null,
        whatsappNumber: app.whatsapp_number || null,
        github_submission: githubData,
      };
    });

    return new NextResponse(JSON.stringify({ data: formattedApplications }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch applications" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
