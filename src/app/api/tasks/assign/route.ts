import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { taskId, notes } = await request.json();

    // Get the developer's ID first
    const developer = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM developers WHERE email = ${session.user.email}
    `;

    if (!developer?.length) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 }
      );
    }

    // Create task assignment
    const assignment = await prisma.$queryRaw<any[]>`
      INSERT INTO task_assignments (
        task_id, 
        developer_id, 
        status, 
        notes, 
        start_date, 
        due_date
      )
      VALUES (
        ${taskId},
        ${developer[0].id},
        'assigned',
        ${notes},
        NOW(),
        NOW() + INTERVAL '7 days'
      )
      RETURNING *
    `;

    return NextResponse.json(assignment[0]);
  } catch (error) {
    console.error("Failed to assign task:", error);
    return NextResponse.json(
      { error: "Failed to assign task" },
      { status: 500 }
    );
  }
}
