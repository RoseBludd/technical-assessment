import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const results = await prisma.test_submissions.findMany({
      where: {
        completed_at: {
          not: null,
        },
      },
      orderBy: {
        completed_at: "desc",
      },
      take: 50,
      select: {
        id: true,
        status: true,
        score: true,
        completed_at: true,
        ai_feedback: true,
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
    });

    const formattedResults = results.map((result) => ({
      id: result.id,
      developer: {
        name: result.developer.name,
        email: result.developer.email,
        role: result.developer.role,
      },
      test: {
        title: result.skill_test.title,
      },
      score: result.score || 0,
      status: result.status,
      completed_at: result.completed_at
        ? result.completed_at.toISOString()
        : null,
      ai_feedback: result.ai_feedback
        ? JSON.parse(JSON.stringify(result.ai_feedback))
        : null,
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Error fetching test results:", error);
    return NextResponse.json(
      { error: "Failed to fetch test results" },
      { status: 500 }
    );
  }
}
