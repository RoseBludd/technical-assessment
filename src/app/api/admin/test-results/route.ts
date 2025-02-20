import { NextResponse } from "next/server";
import { PrismaClient, SkillTestSubmissionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const results = await prisma.test_submissions.findMany({
      where: {
        status: {
          in: [
            SkillTestSubmissionStatus.completed,
            SkillTestSubmissionStatus.failed,
          ],
        },
      },
      include: {
        developer: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
        skill_test: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        completed_at: "desc",
      },
      take: 50, // Limit to most recent 50 submissions
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching test results:", error);
    return NextResponse.json(
      { error: "Failed to fetch test results" },
      { status: 500 }
    );
  }
}
