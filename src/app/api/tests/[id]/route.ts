import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const test = await prisma.skill_tests.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Parse the questions from JSON
    const questions = JSON.parse(test.questions.toString());

    return NextResponse.json({
      id: test.id,
      title: test.title,
      description: test.description,
      questions,
      timeLimit: test.time_limit,
    });
  } catch (error) {
    console.error("Error fetching test:", error);
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 }
    );
  }
}
