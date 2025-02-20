-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM (
        'in_progress',
        'completed',
        'expired',
        'graded',
        'failed',
        'passed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE developer_role AS ENUM (
        'frontend_specialist',
        'backend_specialist',
        'integration_specialist',
        'devops_engineer',
        'fullstack_developer',
        'technical_lead'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create skill_tests table
CREATE TABLE IF NOT EXISTS skill_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    role developer_role NOT NULL,
    questions JSONB DEFAULT '[]',
    passing_score INTEGER DEFAULT 70,
    time_limit INTEGER DEFAULT 3600,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create test_submissions table
CREATE TABLE IF NOT EXISTS test_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL,
    developer_id UUID NOT NULL,
    application_id UUID NOT NULL,
    answers JSONB DEFAULT '[]',
    score INTEGER,
    ai_feedback JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    status submission_status DEFAULT 'in_progress',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES skill_tests(id),
    FOREIGN KEY (developer_id) REFERENCES developers(id),
    FOREIGN KEY (application_id) REFERENCES developer_applications(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_skill_tests_role ON skill_tests(role);
CREATE INDEX IF NOT EXISTS idx_test_submissions_test ON test_submissions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_developer ON test_submissions(developer_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_application ON test_submissions(application_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_status ON test_submissions(status); 