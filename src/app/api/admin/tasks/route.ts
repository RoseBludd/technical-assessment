import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { readFileSync } from "fs";
import { join } from "path";
import { Task } from "@/types/task";

type TaskStatus =
  | "available"
  | "assigned"
  | "in_progress"
  | "completed"
  | "blocked";

interface TaskAssignment {
  task_id: string;
  status: TaskStatus;
}

interface RawTask {
  id: string;
  title: string;
  description: string;
  department: string;
  complexity: "low" | "medium" | "high";
  category:
    | "NEW_FEATURE"
    | "BUG_FIX"
    | "INTEGRATION"
    | "AUTOMATION"
    | "OPTIMIZATION";
  requirements: string[];
  acceptance_criteria: string[];
  compensation: number;
  estimatedTime?: string;
}

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

    let allTasks: Task[] = [];

    // Read main task pool
    try {
      const taskPool = JSON.parse(readFileSync(taskPoolPath, "utf-8"));
      const poolTasks = Object.entries(taskPool.tasks || {}).flatMap(
        ([department, deptData]: [string, any]) => {
          const tasks: Task[] = [];
          [
            "trial_tasks",
            "advanced_tasks",
            "full_tasks",
            "integration_tasks",
          ].forEach((taskType) => {
            if (deptData[taskType]) {
              tasks.push(
                ...deptData[taskType].map((task: RawTask) => ({
                  ...task,
                  department,
                  complexity: taskType.includes("trial")
                    ? "low"
                    : taskType.includes("advanced")
                    ? "medium"
                    : "high",
                  status: "available" as TaskStatus,
                }))
              );
            }
          });
          return tasks;
        }
      );
      allTasks = [...allTasks, ...poolTasks];
    } catch (error) {
      console.error("Error reading task pool:", error);
    }

    // Read sales tasks
    try {
      const salesTasks = JSON.parse(readFileSync(salesPath, "utf-8"));
      const salesDeptTasks = salesTasks.active_tasks.map((task: RawTask) => ({
        ...task,
        department: "sales",
        complexity: task.complexity || "medium",
        status: "available" as TaskStatus,
      }));
      allTasks = [...allTasks, ...salesDeptTasks];
    } catch (error) {
      console.error("Error reading sales tasks:", error);
    }

    // Get assignments from database if available
    try {
      const assignments = await prisma.task_assignments.findMany({
        where: {
          status: {
            in: ["assigned", "in_progress"],
          },
        },
        select: {
          task_id: true,
          status: true,
        },
      });

      // Update task status based on assignments
      allTasks = allTasks.map((task) => {
        const assignment = assignments.find((a) => a.task_id === task.id);
        return {
          ...task,
          status: (assignment?.status || task.status) as TaskStatus,
        };
      });
    } catch (error) {
      console.error("Error fetching assignments:", error);
      // Continue without assignments if database is not available
    }

    return NextResponse.json(allTasks);
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
    const { taskId, developerId } = await request.json();

    // Create task assignment
    const assignment = await prisma.task_assignments.create({
      data: {
        task_id: taskId,
        developer_id: developerId,
        status: "assigned",
        start_date: new Date(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Failed to assign task:", error);
    return NextResponse.json(
      { error: "Failed to assign task" },
      { status: 500 }
    );
  }
}
