import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get developer info including GitHub URL and application status using raw SQL
    const developerData = await prisma.$queryRaw<any[]>`
      SELECT 
        d.github_url,
        da.github_submission,
        da.updated_at
      FROM developers d
      LEFT JOIN developer_applications da ON d.id = da.developer_id
      WHERE d.email = ${session.user.email}
      ORDER BY da.created_at DESC
      LIMIT 1
    `;

    if (!developerData?.length) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 }
      );
    }

    const developer = developerData[0];
    const githubSubmission = developer.github_submission as {
      url?: string;
      last_updated?: string;
    } | null;

    return NextResponse.json({
      isConnected: Boolean(developer.github_url || githubSubmission?.url),
      url: developer.github_url || githubSubmission?.url,
      lastActivity:
        githubSubmission?.last_updated ||
        developer.updated_at?.toISOString() ||
        null,
    });
  } catch (error) {
    console.error("Failed to fetch GitHub status:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub status" },
      { status: 500 }
    );
  }
}
