import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GithubSubmission {
  url: string;
  status: string;
  pr_number: number;
}

export async function GET() {
  try {
    // Get all applications that have a developer
    const applications = await prisma.developer_applications.findMany({
      where: {
        developer_id: {
          not: null,
        },
      },
      include: {
        developers: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    const formattedResults = applications
      .filter((app) => app.developers !== null)
      .map((application) => {
        const githubData =
          application.github_submission as unknown as GithubSubmission;

        return {
          id: application.id,
          developer: {
            name: application.developers?.name || "Unknown",
            email: application.developers?.email || "",
            role:
              application.position || application.developers?.role || "unknown",
          },
          test: {
            title: "Technical Assessment",
          },
          status: application.status || "pending",
          completed_at: application.updated_at?.toISOString() || "",
          github_submission: application.github_submission
            ? {
                url: githubData?.url || "",
                status: githubData?.status || "pending",
                pr_number: githubData?.pr_number,
                submitted_at: application.created_at?.toISOString(),
                last_updated: application.updated_at?.toISOString(),
              }
            : null,
        };
      });

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
