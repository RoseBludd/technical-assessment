-- CreateEnum
CREATE TYPE "interest_level" AS ENUM ('interested', 'not_interested', 'undecided');

-- AlterTable
ALTER TABLE "developer_applications" 
ADD COLUMN IF NOT EXISTS "meeting_notes" TEXT,
ADD COLUMN IF NOT EXISTS "interest_level" "interest_level" DEFAULT 'undecided',
ADD COLUMN IF NOT EXISTS "last_meeting_date" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "next_meeting_date" TIMESTAMPTZ; 