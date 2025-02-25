import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, test_submissions } from "@prisma/client";

interface TaskAssignment {
  status: string;
  completed_at: Date | null;
  due_date: Date | null;
  tasks: {
    priority: string;
  } | null;
}

interface Developer {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string | null;
  task_assignments: TaskAssignment[];
}

type TestSubmissionWithRelations = test_submissions & {
  developer_applications: {
    developers: {
      name: string | null;
      email: string | null;
      role: string | null;
    } | null;
  } | null;
};

export async function GET() {
  try {
    const testResults = await prisma.test_submissions.findMany({
      where: {
        status: "completed"
      },
      orderBy: {
        completed_at: "desc"
      },
      include: {
        developer_applications: {
          include: {
            developers: {
              select: {
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });

    const formattedResults = testResults.map((submission: TestSubmissionWithRelations) => ({
      score: submission.score,
      startedAt: submission.started_at,
      completedAt: submission.completed_at,
      name: submission.developer_applications?.developers?.name || 'Unknown',
      email: submission.developer_applications?.developers?.email,
      role: submission.developer_applications?.developers?.role
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

function determineSkillLevel(
  averageScore: number,
  completedTasks: number,
  activeTasks: number
): string {
  // Consider both completed and active tasks for experience level
  const totalTaskExperience = completedTasks + activeTasks * 0.5;

  // Expert: High score, significant experience, and proven track record
  if (averageScore >= 4.5 && completedTasks >= 8) return "Expert";

  // Advanced: Good score and solid experience
  if (averageScore >= 4.0 && completedTasks >= 5) return "Advanced";

  // Intermediate: Decent score or moderate experience
  if ((averageScore >= 3.5 && completedTasks >= 2) || totalTaskExperience >= 4)
    return "Intermediate";

  // Beginner: Everyone else
  return "Beginner";
}
