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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
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
