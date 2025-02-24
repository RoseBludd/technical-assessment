import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { readFileSync } from "fs";
import { join } from "path";

interface QueryResult {
  count: number;
}

export async function GET(request: Request) {
  try {
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Read task pool to count total tasks
    const taskPoolPath = join(process.cwd(), "task-pool.json");
    const taskPool = JSON.parse(readFileSync(taskPoolPath, "utf-8"));

    // Count all tasks from different categories
    const taskPoolCount = Object.values(taskPool.tasks || {}).reduce(
      (acc: number, dept: any) => {
        const trialTasks = dept.trial_tasks?.length || 0;
        const advancedTasks = dept.advanced_tasks?.length || 0;
        const fullTasks = dept.full_tasks?.length || 0;
        const integrationTasks = dept.integration_tasks?.length || 0;
        return acc + trialTasks + advancedTasks + fullTasks + integrationTasks;
      },
      0
    );

    // Fetch dashboard statistics
    const [testTasks, activeDevelopers, pendingCount, completedCount] =
      await Promise.all([
        // Test tasks count
        prisma.test_tasks.count(),

        // Active developers from applications
        prisma.$queryRaw<QueryResult[]>`
          SELECT COUNT(DISTINCT da.developer_id) as count
          FROM developer_applications da
          JOIN developers d ON d.id = da.developer_id
          WHERE da.status = 'active'
          OR EXISTS (
            SELECT 1 FROM test_submissions ts
            WHERE ts.developer_id = da.developer_id
            AND ts.created_at >= ${thirtyDaysAgo}
          )
          OR EXISTS (
            SELECT 1 FROM task_assignments ta
            WHERE ta.developer_id = da.developer_id
            AND ta.start_date >= ${thirtyDaysAgo}
          )
        `,

        // Count pending assignments
        prisma.$queryRaw<QueryResult[]>`
          SELECT 
            (SELECT COUNT(*) FROM test_submissions WHERE status = 'pending') +
            (SELECT COUNT(*) FROM task_assignments WHERE status = 'assigned' AND completed_at IS NULL)
          AS count
        `,

        // Count completed tasks
        prisma.$queryRaw<QueryResult[]>`
          SELECT 
            (SELECT COUNT(*) FROM test_submissions WHERE status = 'completed') +
            (SELECT COUNT(*) FROM task_assignments WHERE status = 'completed' OR completed_at IS NOT NULL)
          AS count
        `,
      ]);

    console.log("Task Pool Count:", taskPoolCount); // Debug log

    return NextResponse.json({
      totalTasks: testTasks + taskPoolCount,
      activeDevelopers: Number(activeDevelopers[0]?.count || 0),
      pendingAssignments: Number(pendingCount[0]?.count || 0),
      completedTasks: Number(completedCount[0]?.count || 0),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
