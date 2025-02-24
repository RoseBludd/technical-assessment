import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["in_progress", "completed", "blocked"] as const),
});

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);

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

    // Update task assignment status
    const assignment = await prisma.$queryRaw<any[]>`
      UPDATE task_assignments 
      SET 
        status = ${status},
        completed_at = CASE WHEN ${status} = 'completed' THEN NOW() ELSE NULL END
      WHERE 
        task_id = ${params.taskId} 
        AND developer_id = ${developer[0].id}
      RETURNING *
    `;

    if (!assignment?.length) {
      return NextResponse.json(
        { error: "Task assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assignment[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    console.error("Failed to update task status:", error);
    return NextResponse.json(
      { error: "Failed to update task status" },
      { status: 500 }
    );
  }
}
