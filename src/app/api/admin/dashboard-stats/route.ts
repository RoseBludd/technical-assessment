import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get total applicants
    const totalApplicants = await prisma.developers.count();

    // Get recent submissions (last 7 days)
    const recentSubmissions = await prisma.test_submissions.count({
      where: {
        created_at: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get pending reviews
    const pendingReviews = await prisma.test_submissions.count({
      where: {
        status: "pending",
      },
    });

    // Calculate average score
    const scores = await prisma.test_submissions.findMany({
      where: {
        score: {
          not: null,
        },
      },
      select: {
        score: true,
      },
    });

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((acc, curr) => acc + (curr.score || 0), 0) /
              scores.length
          )
        : 0;

    // Get role breakdown
    const roleBreakdown = await prisma.developers.groupBy({
      by: ["role"],
      _count: true,
    });

    // Get recent activity
    const recentActivity = await prisma.test_submissions.findMany({
      take: 10,
      orderBy: {
        created_at: "desc",
      },
      include: {
        developer: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    const formattedActivity = recentActivity.map((activity) => ({
      id: activity.id,
      type: activity.status === "pending" ? "submission" : "review",
      applicantName: activity.developer.name,
      role: activity.developer.role,
      timestamp: activity.created_at.toISOString(),
    }));

    return NextResponse.json({
      totalApplicants,
      recentSubmissions,
      pendingReviews,
      averageScore,
      roleBreakdown: Object.fromEntries(
        roleBreakdown.map((item) => [item.role, item._count])
      ),
      recentActivity: formattedActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
