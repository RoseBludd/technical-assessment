import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addNoteSchema = z.object({
  content: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { content } = addNoteSchema.parse(body);

    // Get the developer's ID first
    const developer = await prisma.developers.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 }
      );
    }

    // Get current assignment to check existing notes
    const currentAssignment = await prisma.$queryRaw`
      SELECT notes 
      FROM task_assignments 
      WHERE task_id = ${params.taskId} 
      AND developer_id = ${developer.id}
    `;

    if (!currentAssignment) {
      return NextResponse.json(
        { error: "Task assignment not found" },
        { status: 404 }
      );
    }

    // Update task assignment with new note
    const assignment = await prisma.$executeRaw`
      UPDATE task_assignments 
      SET notes = CASE 
        WHEN notes IS NULL THEN ${content + "\n---\n"}
        ELSE notes || ${"\n" + content + "\n---\n"}
      END
      WHERE task_id = ${params.taskId} 
      AND developer_id = ${developer.id}
      RETURNING *
    `;

    return NextResponse.json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid note content" },
        { status: 400 }
      );
    }

    console.error("Failed to add note:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
