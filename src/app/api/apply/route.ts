import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  portfolioUrl: z.string().url().optional().nullable(),
  position: z.enum(
    [
      "frontend_specialist",
      "backend_specialist",
      "integration_specialist",
      "devops_engineer",
      "fullstack_developer",
      "technical_lead",
    ],
    {
      required_error: "Position is required",
      invalid_type_error: "Invalid position selected",
    }
  ),
  experience: z.string().min(1, "Experience is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = applicationSchema.parse(body);

    // Create developer first
    const developer = await prisma.developers.create({
      data: {
        email: validatedData.email,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        role: validatedData.position,
        paypal_email: validatedData.email,
        phone: validatedData.whatsapp,
        portfolio_url: validatedData.portfolioUrl || null,
        years_experience: parseInt(validatedData.experience.split("-")[0]),
        skills: validatedData.skills,
        status: "pending",
        password_hash: "temporary",
      },
    });

    // Create the application
    const application = await prisma.developer_applications.create({
      data: {
        developer_id: developer.id,
        position: validatedData.position,
        status: "pending",
        whatsapp_number: validatedData.whatsapp,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          developerId: developer.id,
          applicationId: application.id,
          message:
            "Thank you for your application! You will be redirected to the technical assessment shortly.",
          testUrl: `/test/${application.id}`,
        },
      },
      { status: 201 }
    );
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

    console.error("Application submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit application. Please try again later.",
      },
      { status: 500 }
    );
  }
}
