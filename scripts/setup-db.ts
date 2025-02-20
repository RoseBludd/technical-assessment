import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    // Create enum types
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE submission_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE developer_role AS ENUM ('frontend', 'backend', 'fullstack', 'devops', 'mobile');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create skill_tests table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS skill_tests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        role developer_role NOT NULL,
        questions JSONB NOT NULL,
        passing_score INTEGER NOT NULL,
        time_limit INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create test_submissions table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS test_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        test_id UUID NOT NULL REFERENCES skill_tests(id),
        developer_id UUID NOT NULL,
        application_id UUID NOT NULL,
        answers JSONB,
        score INTEGER,
        ai_feedback TEXT,
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        status submission_status NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_test_submissions_test_id ON test_submissions(test_id);
    `;
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_test_submissions_developer_id ON test_submissions(developer_id);
    `;
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_test_submissions_application_id ON test_submissions(application_id);
    `;

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
