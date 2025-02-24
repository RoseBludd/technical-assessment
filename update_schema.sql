-- Create interest_level enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE interest_level AS ENUM ('interested', 'not_interested', 'undecided');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to developer_applications table
ALTER TABLE developer_applications
    ADD COLUMN IF NOT EXISTS meeting_notes TEXT,
    ADD COLUMN IF NOT EXISTS interest_level interest_level DEFAULT 'undecided',
    ADD COLUMN IF NOT EXISTS last_meeting_date TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS next_meeting_date TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS github_submission JSONB DEFAULT NULL;

-- Create index on github_submission
CREATE INDEX IF NOT EXISTS idx_developer_applications_github_submission ON developer_applications USING gin(github_submission);

COMMENT ON COLUMN developer_applications.github_submission IS 'Stores GitHub PR information including URL, status, and timestamps';
