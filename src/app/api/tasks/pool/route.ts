import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { Task } from "@/types/task";

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
    console.log("Loading tasks from:", taskPoolPath);

    // Read main task pool
    try {
      const taskPool = JSON.parse(readFileSync(taskPoolPath, "utf-8"));
      console.log("Task pool departments:", Object.keys(taskPool.tasks || {}));

      // Process each department's tasks
      Object.entries(taskPool.tasks || {}).forEach(
        ([department, deptData]: [string, any]) => {
          console.log(`Processing ${department} department tasks`);

          // Process trial tasks
          if (deptData.trial_tasks) {
            const trialTasks = deptData.trial_tasks.map((task: any) => ({
              ...task,
              department,
              complexity: "low",
              status: "available",
              estimated_time: 3,
            }));
            allTasks.push(...trialTasks);
            console.log(
              `Added ${trialTasks.length} trial tasks from ${department}`
            );
          }

          // Process advanced tasks
          if (deptData.advanced_tasks) {
            const advancedTasks = deptData.advanced_tasks.map((task: any) => ({
              ...task,
              department,
              complexity: "medium",
              status: "available",
              estimated_time: 5,
            }));
            allTasks.push(...advancedTasks);
            console.log(
              `Added ${advancedTasks.length} advanced tasks from ${department}`
            );
          }

          // Process full tasks
          if (deptData.full_tasks) {
            const fullTasks = deptData.full_tasks.map((task: any) => ({
              ...task,
              department,
              complexity: "high",
              status: "available",
              estimated_time: 10,
            }));
            allTasks.push(...fullTasks);
            console.log(
              `Added ${fullTasks.length} full tasks from ${department}`
            );
          }

          // Process integration tasks
          if (deptData.integration_tasks) {
            const integrationTasks = deptData.integration_tasks.map(
              (task: any) => ({
                ...task,
                department,
                complexity: task.complexity || "medium",
                status: "available",
                estimated_time:
                  task.complexity === "high"
                    ? 10
                    : task.complexity === "medium"
                    ? 5
                    : 3,
              })
            );
            allTasks.push(...integrationTasks);
            console.log(
              `Added ${integrationTasks.length} integration tasks from ${department}`
            );
          }
        }
      );

      console.log(`Total tasks from main pool: ${allTasks.length}`);
    } catch (error) {
      console.error("Error reading task pool:", error);
    }

    // Read sales tasks
    try {
      const salesTasks = JSON.parse(readFileSync(salesPath, "utf-8"));
      const salesDeptTasks = salesTasks.active_tasks
        .filter((task: any) => !task.assigned_to) // Only include unassigned tasks
        .map((task: any) => ({
          id: task.task_id,
          title: task.title,
          description: task.description,
          department: "sales",
          complexity:
            task.priority?.toLowerCase() === "high"
              ? "high"
              : task.priority?.toLowerCase() === "medium"
              ? "medium"
              : "low",
          status: "available",
          requirements: task.requirements,
          acceptance_criteria: task.acceptance_criteria,
          compensation:
            task.priority?.toLowerCase() === "high"
              ? 500
              : task.priority?.toLowerCase() === "medium"
              ? 250
              : 100,
          estimated_time: Math.ceil(task.estimated_hours / 8), // Convert hours to days
        }));
      allTasks.push(...salesDeptTasks);
      console.log(`Added ${salesDeptTasks.length} sales tasks`);
    } catch (error) {
      console.error("Error reading sales tasks:", error);
    }

    console.log(`Total tasks available: ${allTasks.length}`);
    return NextResponse.json(allTasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of error
  }
}
