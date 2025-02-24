import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const updateApplicationSchema = z.object({
  meetingNotes: z.string().optional(),
  interestLevel: z
    .enum(["interested", "not_interested", "undecided"])
    .optional(),
  lastMeetingDate: z.string().datetime().optional(),
  nextMeetingDate: z.string().datetime().optional(),
  status: z.enum(["pending", "reviewing", "accepted", "rejected"]).optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateApplicationSchema.parse(body);

    const application = await prisma.developer_applications.update({
      where: {
        id: params.id,
      },
      data: {
        meeting_notes: validatedData.meetingNotes,
        interest_level: validatedData.interestLevel,
        last_meeting_date: validatedData.lastMeetingDate
          ? new Date(validatedData.lastMeetingDate)
          : undefined,
        next_meeting_date: validatedData.nextMeetingDate
          ? new Date(validatedData.nextMeetingDate)
          : undefined,
        status: validatedData.status,
        updated_at: new Date(),
      },
      include: {
        developers: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Application update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update application. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.developer_applications.findUnique({
      where: {
        id: params.id,
      },
      include: {
        developers: true,
        test_submissions: {
          include: {
            skill_test: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          error: "Application not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Application fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch application. Please try again later.",
      },
      { status: 500 }
    );
  }
}
