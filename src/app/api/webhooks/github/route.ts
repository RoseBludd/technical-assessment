import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// Verify GitHub webhook signature
function verifyGitHubWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(
    "sha256=" + hmac.update(payload).digest("hex"),
    "utf8"
  );
  const checksum = Buffer.from(signature, "utf8");
  return crypto.timingSafeEqual(digest, checksum);
}

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const event = request.headers.get("x-github-event");

    // Verify webhook signature
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret || !signature) {
      return NextResponse.json(
        { error: "Missing webhook secret or signature" },
        { status: 401 }
      );
    }

    if (!verifyGitHubWebhook(payload, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(payload);

    // Handle pull request events
    if (event === "pull_request") {
      const {
        action,
        pull_request: { number: prNumber, body: prBody },
      } = data;

      // Only process when PR is opened or synchronized (new commits pushed)
      if (action !== "opened" && action !== "synchronize") {
        return NextResponse.json({ message: "Event ignored" }, { status: 200 });
      }

      // Extract email and application ID from PR body
      const emailMatch = prBody?.match(/Application Email:\s*([^\s\n]+)/i);
      const applicationIdMatch = prBody?.match(/Application ID:\s*([^\s\n]+)/i);

      const email = emailMatch?.[1];
      const applicationId = applicationIdMatch?.[1];

      if (!email && !applicationId) {
        return NextResponse.json(
          { message: "PR body missing required application information" },
          { status: 200 }
        );
      }

      // Find matching application(s)
      const whereClause: any = {
        OR: [],
      };

      if (email) {
        whereClause.OR.push({
          developers: {
            email: email,
          },
        });
      }

      if (applicationId) {
        whereClause.OR.push({
          id: applicationId,
        });
      }

      const applications = await prisma.developer_applications.findMany({
        where: whereClause,
        include: {
          developers: true,
        },
      });

      if (applications.length === 0) {
        return NextResponse.json(
          { message: "No matching application found" },
          { status: 200 }
        );
      }

      // Update GitHub submission info for each matching application
      const updatePromises = applications.map((application) =>
        prisma.developer_applications.update({
          where: { id: application.id },
          data: {
            github_submission: {
              pr_number: prNumber,
              status: "pending",
              submitted_at: new Date().toISOString(),
              last_updated: new Date().toISOString(),
            },
          },
        })
      );

      // Trigger grading for each matching application
      const gradingPromises = applications.map(async (application) => {
        const response = await fetch(
          new URL("/api/admin/grade-submission", request.url).toString(),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              applicationId: application.id,
              prNumber,
            }),
          }
        );

        if (!response.ok) {
          console.error(
            `Failed to grade submission for application ${application.id}:`,
            await response.text()
          );
          return null;
        }

        return response.json();
      });

      // Wait for all updates and grading to complete
      await Promise.all([...updatePromises, ...gradingPromises]);

      return NextResponse.json({
        message: "Submissions processed successfully",
        applications: applications.map((app) => ({
          id: app.id,
          email: app.developers?.email,
        })),
      });
    }

    return NextResponse.json({ message: "Event processed" }, { status: 200 });
  } catch (error) {
    console.error("Error processing GitHub webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
