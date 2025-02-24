import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";

// Validation schemas
const TaskAssignmentSchema = z.object({
  taskId: z.string(),
  notes: z.string(),
});

export async function GET() {
  try {
    // Read tasks from task pool JSON and sales department
    const taskPoolPath = join(process.cwd(), "task-pool.json");
    const salesPath = join(
      process.cwd(),
      "Departments",
      "sales",
      "task-pool.json"
    );

    const taskPool = JSON.parse(readFileSync(taskPoolPath, "utf-8"));
    const salesTasks = JSON.parse(readFileSync(salesPath, "utf-8"));

    // Get tasks from all departments
    const allTasks = Object.entries(taskPool.tasks || {}).flatMap(
      ([department, deptData]: [string, any]) => {
        const tasks = [];

        // Process each task type
        [
          "trial_tasks",
          "advanced_tasks",
          "full_tasks",
          "integration_tasks",
        ].forEach((taskType) => {
          if (deptData[taskType]) {
            tasks.push(
              ...deptData[taskType].map((task: any) => ({
                ...task,
                department,
                complexity: taskType.includes("trial")
                  ? "low"
                  : taskType.includes("advanced")
                  ? "medium"
                  : "high",
              }))
            );
          }
        });

        return tasks;
      }
    );

    // Add sales department tasks
    const salesDeptTasks = salesTasks.active_tasks.map((task: any) => ({
      ...task,
      department: "sales",
      complexity: task.complexity || "medium",
    }));

    return NextResponse.json([...allTasks, ...salesDeptTasks]);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, notes } = TaskAssignmentSchema.parse(body);

    // Read task pool to verify task exists
    const taskPoolPath = join(process.cwd(), "task-pool.json");
    const taskPool = JSON.parse(readFileSync(taskPoolPath, "utf-8"));

    // Find task in pool
    const task = Object.values(taskPool.tasks)
      .flatMap((dept: any) => {
        return Object.values(dept).flat();
      })
      .find((t: any) => t.id === taskId);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Create task assignment in database
    const assignment = await prisma.task_assignments.create({
      data: {
        task_id: taskId,
        developer_id: session.user.id,
        status: "assigned",
        notes,
        start_date: new Date(),
        due_date: new Date(Date.now() + task.maxTime * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to assign task:", error);
    return NextResponse.json(
      { error: "Failed to assign task" },
      { status: 500 }
    );
  }
}
