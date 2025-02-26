import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { readFileSync } from "fs";
import { join } from "path";
import { Task, TaskStatus, TaskPriority, TaskComplexity, TaskCategory } from "@/types/task";
import { Prisma } from "@prisma/client";

const { Decimal } = Prisma;

type Department = "sales" | "inspection" | "production" | "quality_control" | "customer_service" | "accounting";

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
    console.log('Fetching tasks from the database');
    
    // Fetch tasks from the database - get all tasks without filtering
    const dbTasks = await prisma.tasks.findMany();
    console.log(`Found ${dbTasks.length} tasks in the database`);
    
    // Map database tasks to the Task interface
    const mappedDbTasks = dbTasks.map((task: any) => ({
      id: task.id,
      title: task.title || "",
      description: task.description || "",
      department: task.department || "",
      compensation: task.compensation !== null ? task.compensation : 0, // Handle null compensation
      priority: task.priority || "medium",
      complexity: task.complexity || "medium",
      category: task.category || "NEW_FEATURE",
      status: task.status || "available",
      estimated_time: task.estimated_time || 0,
      requirements: task.requirements || [],
      acceptance_criteria: task.acceptance_criteria || [],
      start_date: task.start_date ? new Date(task.start_date).toISOString() : new Date().toISOString(),
      due_date: task.due_date ? new Date(task.due_date).toISOString() : new Date().toISOString(),
      completed: task.completed || false,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));
    
    // Return the tasks directly, not wrapped in a tasks property
    return NextResponse.json(mappedDbTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if this is a task creation request or assignment request
    if (body.title) {
      // Validate department
      const department = body.department.toLowerCase().replace(" ", "_") as Department;
      if (!["sales", "inspection", "production", "quality_control", "customer_service", "accounting"].includes(department)) {
        return NextResponse.json(
          { error: "Invalid department. Must be one of: sales, inspection, production, quality_control, customer_service, accounting" },
          { status: 400 }
        );
      }

      try {
        // This is a task creation request
        const task = await prisma.tasks.create({
          data: {
            title: body.title,
            description: body.description || "",
            department: department,
            priority: body.priority || "medium",
            status: "available",
            compensation: new Decimal(body.compensation || 0),
            estimated_time: body.estimated_time || 0,
            requirements: body.requirements || [],
            acceptance_criteria: body.acceptance_criteria || [],
            completed: false,
            created_at: new Date(),
            updated_at: new Date(),
            start_date: null,
            due_date: null
          }
        });
        
        console.log("Task created successfully:", task);
        return NextResponse.json(task);
      } catch (dbError) {
        console.error("Database error creating task:", dbError);
        return NextResponse.json(
          { error: `Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    } else if (body.taskId && body.developerId) {
      // This is a task assignment request
      const task = await prisma.tasks.update({
        where: { id: body.taskId },
        data: { status: "assigned" }
      });

      const assignment = await prisma.task_assignments.create({
        data: {
          task_id: body.taskId,
          developer_id: body.developerId,
          status: "assigned",
          start_date: new Date(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });

      return NextResponse.json({ task, assignment });
    } else {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to process task request:", error);
    return NextResponse.json(
      { error: "Failed to process task request" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Ensure we have a task ID
    if (!body.id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Validate department if provided
    let department;
    if (body.department) {
      department = body.department.toLowerCase().replace(" ", "_") as Department;
      if (!["sales", "inspection", "production", "quality_control", "customer_service", "accounting"].includes(department)) {
        return NextResponse.json(
          { error: "Invalid department. Must be one of: sales, inspection, production, quality_control, customer_service, accounting" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date()
    };

    // Only include fields that are provided in the request
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.department !== undefined) updateData.department = department;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.complexity !== undefined) updateData.complexity = body.complexity;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.compensation !== undefined) updateData.compensation = new Decimal(body.compensation || 0);
    if (body.estimated_time !== undefined) updateData.estimated_time = body.estimated_time || 0;
    if (body.requirements !== undefined) updateData.requirements = body.requirements;
    if (body.acceptance_criteria !== undefined) updateData.acceptance_criteria = body.acceptance_criteria;
    if (body.start_date !== undefined) updateData.start_date = body.start_date ? new Date(body.start_date) : null;
    if (body.due_date !== undefined) updateData.due_date = body.due_date ? new Date(body.due_date) : null;
    if (body.completed !== undefined) updateData.completed = body.completed;

    // Update the task
    const updatedTask = await prisma.tasks.update({
      where: { id: body.id },
      data: updateData
    });
    
    console.log("Task updated successfully:", updatedTask);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { error: `Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
