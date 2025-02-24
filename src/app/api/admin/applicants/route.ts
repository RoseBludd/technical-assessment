import { NextResponse } from "next/server";
import {
  PrismaClient,
  SkillTestSubmissionStatus,
  Prisma,
  developer_role,
} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const role = searchParams.get("role");

    const where: Prisma.developersWhereInput = {};

    // Add status filter
    if (status && status !== "all") {
      where.test_submissions = {
        some: {
          status: status as SkillTestSubmissionStatus,
        },
      };
    }

    // Add role filter
    if (role && role !== "all") {
      where.role = role as developer_role;
    }

    const developers = await prisma.developers.findMany({
      where,
      include: {
        test_submissions: {
          orderBy: {
            created_at: "desc",
          },
          take: 1,
          select: {
            status: true,
            score: true,
            created_at: true,
          },
        },
        developer_applications: {
          orderBy: {
            created_at: "desc",
          },
          take: 1,
          select: {
            id: true,
            meeting_notes: true,
            interest_level: true,
            last_meeting_date: true,
            next_meeting_date: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedApplicants = developers.map((dev) => ({
      id: dev.id,
      name: dev.name,
      email: dev.email,
      role: dev.role,
      status: dev.test_submissions[0]?.status || "pending",
      submittedAt: (dev.created_at || new Date()).toISOString(),
      score: dev.test_submissions[0]?.score || null,
      meetingNotes: dev.developer_applications[0]?.meeting_notes || null,
      interestLevel:
        dev.developer_applications[0]?.interest_level || "undecided",
      lastMeetingDate: dev.developer_applications[0]?.last_meeting_date
        ? dev.developer_applications[0].last_meeting_date.toISOString()
        : null,
      nextMeetingDate: dev.developer_applications[0]?.next_meeting_date
        ? dev.developer_applications[0].next_meeting_date.toISOString()
        : null,
    }));

    return NextResponse.json(formattedApplicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}

// Add PUT endpoint to update meeting notes and interest level
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      applicationId,
      meetingNotes,
      interestLevel,
      lastMeetingDate,
      nextMeetingDate,
    } = body;

    const application = await prisma.developer_applications.update({
      where: {
        id: applicationId,
      },
      data: {
        meeting_notes: meetingNotes,
        interest_level: interestLevel,
        last_meeting_date: lastMeetingDate
          ? new Date(lastMeetingDate)
          : undefined,
        next_meeting_date: nextMeetingDate
          ? new Date(nextMeetingDate)
          : undefined,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating applicant:", error);
    return NextResponse.json(
      { error: "Failed to update applicant" },
      { status: 500 }
    );
  }
}
