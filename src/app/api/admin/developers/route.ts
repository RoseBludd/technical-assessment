import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const developers = await prisma.developers.findMany({
      where: {
        OR: [
          { status: "active" },
          {
            developer_applications: {
              some: {
                OR: [
                  { status: "active" },
                  { created_at: { gte: thirtyDaysAgo } },
                ],
              },
            },
          },
          {
            test_submissions: {
              some: {
                created_at: { gte: thirtyDaysAgo },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        developer_applications: {
          orderBy: { created_at: "desc" },
          take: 1,
          select: {
            status: true,
            position: true,
          },
        },
        test_submissions: {
          orderBy: { created_at: "desc" },
          take: 1,
          select: {
            status: true,
          },
        },
      },
    });

    // Format developer data with more details
    const formattedDevelopers = developers.map((dev) => ({
      id: dev.id,
      name: dev.name,
      email: dev.email,
      role: dev.role,
      status: dev.developer_applications[0]?.status || dev.status,
      position: dev.developer_applications[0]?.position || dev.role,
      lastActivity:
        dev.test_submissions[0]?.created_at ||
        dev.developer_applications[0]?.created_at,
    }));

    return NextResponse.json(formattedDevelopers);
  } catch (error) {
    console.error("Failed to fetch developers:", error);
    return NextResponse.json(
      { error: "Failed to fetch developers" },
      { status: 500 }
    );
  }
}
