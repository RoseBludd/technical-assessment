import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

export async function GET() {
  try {
    const developers = await prisma.$queryRaw`
      WITH TaskMetrics AS (
        SELECT 
          d.id,
          d.name,
          d.email,
          d.role,
          COUNT(CASE WHEN ta.status = 'completed' THEN 1 END) as completed_tasks,
          COUNT(CASE WHEN ta.status IN ('assigned', 'in_progress') THEN 1 END) as active_tasks,
          COALESCE(SUM(
            CASE 
              WHEN ta.status = 'completed' AND t.priority = 'high' THEN 500
              WHEN ta.status = 'completed' AND t.priority = 'medium' THEN 250
              WHEN ta.status = 'completed' AND t.priority = 'low' THEN 100
              ELSE 0
            END
          ), 0) as total_earned,
          COALESCE(AVG(
            CASE WHEN ta.status = 'completed' THEN
              (
                CASE 
                  WHEN t.priority = 'high' THEN 5
                  WHEN t.priority = 'medium' THEN 3
                  ELSE 1
                END +
                CASE 
                  WHEN ta.completed_at <= ta.due_date THEN 5
                  WHEN ta.completed_at <= ta.due_date + INTERVAL '1 day' THEN 4
                  WHEN ta.completed_at <= ta.due_date + INTERVAL '2 days' THEN 3
                  WHEN ta.completed_at <= ta.due_date + INTERVAL '3 days' THEN 2
                  ELSE 1
                END
              ) / 2.0
            END
          ), 0) as avg_score
        FROM developers d
        LEFT JOIN task_assignments ta ON d.id = ta.developer_id
        LEFT JOIN tasks t ON ta.task_id = t.id
        GROUP BY d.id, d.name, d.email, d.role
      )
      SELECT 
        id,
        COALESCE(name, 'Unknown') as name,
        email,
        role,
        completed_tasks,
        active_tasks,
        total_earned,
        ROUND(COALESCE(avg_score, 0)::numeric, 1) as average_score,
        CASE
          WHEN completed_tasks >= 5 AND avg_score >= 4.5 THEN 'Expert'
          WHEN completed_tasks >= 3 AND avg_score >= 4.0 THEN 'Advanced'
          WHEN completed_tasks >= 1 AND avg_score >= 3.5 THEN 'Intermediate'
          ELSE 'Beginner'
        END as skill_level
      FROM TaskMetrics
      ORDER BY completed_tasks DESC, avg_score DESC;
    `;

    return NextResponse.json(developers);
  } catch (error) {
    console.error("Error fetching developer stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch developer statistics" },
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
