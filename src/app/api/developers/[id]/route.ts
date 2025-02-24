import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Developer } from "@/types/developer";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const developer = await prisma.developers.findUnique({
      where: { id: params.id },
      include: {
        task_assignments: {
          include: {
            tasks: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 10,
        },
      },
    });

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const completedTasks = developer.task_assignments.filter(
      (a) => a.status === "completed"
    ).length;
    const activeTasks = developer.task_assignments.filter((a) =>
      ["assigned", "in_progress"].includes(a.status)
    ).length;

    // Calculate total earnings
    const totalEarned = developer.task_assignments
      .filter((a) => a.status === "completed")
      .reduce((sum, a) => {
        const priority = a.tasks?.priority || "medium";
        const amount =
          priority === "high" ? 500 : priority === "medium" ? 250 : 100;
        return sum + amount;
      }, 0);

    // Calculate average score
    const completedAssignments = developer.task_assignments.filter(
      (a) => a.status === "completed"
    );
    let averageScore = 0;

    if (completedAssignments.length > 0) {
      const scores = completedAssignments.map((a) => {
        // Complexity score (0-5)
        const complexityScore =
          a.tasks?.priority === "high"
            ? 5
            : a.tasks?.priority === "medium"
            ? 3.5
            : 2;

        // Timeliness score (0-5)
        let timelinessScore = 3; // Default for tasks without dates
        if (a.completed_at && a.due_date) {
          const daysBeforeDeadline = Math.ceil(
            (new Date(a.due_date).getTime() -
              new Date(a.completed_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          timelinessScore =
            daysBeforeDeadline >= 2
              ? 5 // Completed 2+ days early
              : daysBeforeDeadline >= 1
              ? 4 // Completed 1 day early
              : daysBeforeDeadline >= 0
              ? 3 // Completed on time
              : daysBeforeDeadline >= -1
              ? 2 // Completed 1 day late
              : 1; // Completed more than 1 day late
        }

        return complexityScore * 0.6 + timelinessScore * 0.4;
      });

      averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    const response: Developer = {
      ...developer,
      tasksCompleted: completedTasks,
      activeTasks: activeTasks,
      totalEarned: totalEarned,
      averageScore: parseFloat(averageScore.toFixed(1)),
      skills: developer.skills || [],
      preferred_technologies: developer.preferred_technologies || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching developer:", error);
    return NextResponse.json(
      { error: "Failed to fetch developer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow users to update their own profile or admins to update any profile
    if (session.user.id !== params.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedDeveloper = await prisma.developers.update({
      where: { id: params.id },
      data: {
        name: data.name,
        paypal_email: data.paypal_email,
        phone: data.phone,
        github_url: data.github_url,
        portfolio_url: data.portfolio_url,
        resume_url: data.resume_url,
        years_experience: data.years_experience,
        skills: data.skills,
        preferred_technologies: data.preferred_technologies,
        hourly_rate: data.hourly_rate,
        availability_hours: data.availability_hours,
        timezone: data.timezone,
        english_proficiency: data.english_proficiency,
        education: data.education,
        profile_picture_url: data.profile_picture_url,
      },
      include: {
        task_assignments: {
          include: {
            tasks: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 10,
        },
      },
    });

    return NextResponse.json(updatedDeveloper);
  } catch (error) {
    console.error("Error updating developer:", error);
    return NextResponse.json(
      { error: "Failed to update developer" },
      { status: 500 }
    );
  }
}
