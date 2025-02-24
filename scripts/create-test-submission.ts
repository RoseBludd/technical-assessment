import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createGitHubSubmission() {
  try {
    const email = "monkeystylle@gmail.com";

    // 1. Find or create developer
    let developer = await prisma.developers.findUnique({
      where: { email },
    });

    if (!developer) {
      developer = await prisma.developers.create({
        data: {
          email: email,
          name: "Joseph Bayangos",
          role: "frontend_specialist",
          paypal_email: email,
          phone: "+639214885667",
          portfolio_url: "https://josephbayangos.vercel.app/",
          years_experience: 5,
          skills: [
            "React",
            "Typescript",
            "Next.js",
            "Styled Components",
            "Tailwind",
            "Shadcn-UI",
            "Storybook",
          ],
          status: "pending",
          password_hash: "test_hash",
        },
      });
      console.log("Created new developer:", developer);
    } else {
      console.log("Found existing developer:", developer);
    }

    // 2. Create application with GitHub submission
    const application = await prisma.developer_applications.create({
      data: {
        developer_id: developer.id,
        position: "frontend_specialist",
        status: "pending",
        whatsapp_number: "+639214885667",
        github_submission: {
          url: "https://github.com/RoseBludd/technical-assessment/pull/8",
          status: "pending",
          pr_number: 8,
          submitted_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          tasks_done: 0,
          total_tasks: 4,
        },
      },
    });

    console.log("\nGitHub submission created successfully!");
    console.log("Application ID:", application.id);
    console.log("Developer ID:", developer.id);
    console.log("\nApplication details:", application);
  } catch (error) {
    console.error("Error creating GitHub submission:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createGitHubSubmission();
