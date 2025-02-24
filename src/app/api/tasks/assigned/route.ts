import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Task } from "@/types/task";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get assigned tasks with task details using a single SQL query with proper type casting
    const assignedTasks = await prisma.$queryRaw<any[]>`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.status as task_status,
        t.created_at,
        t.updated_at,
        ta.status as assignment_status,
        ta.notes,
        ta.start_date,
        ta.due_date,
        ta.completed_at
      FROM tasks t
      INNER JOIN task_assignments ta ON t.id::text = ta.task_id
      INNER JOIN developers d ON ta.developer_id = d.id
      WHERE d.email = ${session.user.email}
      ORDER BY ta.start_date DESC
    `;

    // Transform the tasks to match the expected format
    const formattedTasks = assignedTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description || "",
      department: "development", // Default department since not in DB
      complexity: task.priority?.toLowerCase() || "medium", // Map priority to complexity
      status: task.assignment_status,
      notes: task.notes ? task.notes.split("\n").filter(Boolean) : [], // Changed delimiter
      start_date: task.start_date,
      due_date: task.due_date,
      completed_at: task.completed_at,
      created_at: task.created_at,
      updated_at: task.updated_at,
      requirements: task.notes ? task.notes.split("\n").filter(Boolean) : [], // Use notes as requirements
      deliverables: [],
      resources: [],
      estimated_hours: null,
      reward_usd:
        task.priority === "high" ? 500 : task.priority === "medium" ? 250 : 100, // Set reward based on priority
    }));

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error("Failed to fetch assigned tasks:", error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of error
  }
}
