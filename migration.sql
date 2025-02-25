-- CreateEnum
CREATE TYPE "SkillTestSubmissionStatus" AS ENUM ('pending', 'in_progress', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "SkillTestDeveloperRole" AS ENUM ('frontend_specialist', 'backend_specialist', 'integration_specialist', 'devops_engineer', 'fullstack_developer', 'technical_lead');

-- CreateEnum
CREATE TYPE "call_outcome" AS ENUM ('successful', 'no-answer', 'voicemail', 'wrong-number', 'busy', 'rejected');

-- CreateEnum
CREATE TYPE "call_status" AS ENUM ('pending', 'in-progress', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "candidate_status" AS ENUM ('NEW', 'REVIEWING', 'CONTACTED', 'INTERVIEWING', 'HIRED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "department" AS ENUM ('sales', 'inspection', 'production', 'quality_control', 'customer_service', 'accounting');

-- CreateEnum
CREATE TYPE "developer_role" AS ENUM ('frontend_specialist', 'backend_specialist', 'integration_specialist', 'devops_engineer', 'fullstack_developer', 'technical_lead');

-- CreateEnum
CREATE TYPE "developer_status" AS ENUM ('pending', 'active', 'inactive', 'rejected');

-- CreateEnum
CREATE TYPE "interview_status" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "pipeline_phase" AS ENUM ('cold', 'warm', 'hot');

-- CreateEnum
CREATE TYPE "pipeline_status" AS ENUM ('pre_sale', 'inspection_set', 'presented', 'closed', 'marketing', 'overwatch');

-- CreateEnum
CREATE TYPE "production_status" AS ENUM ('not_started', 'waiting_adjustment', 'in_production', 'completed');

-- CreateEnum
CREATE TYPE "project_phase" AS ENUM ('pre-sale', 'inspection', 'presented', 'closed', 'marketing', 'overwatch');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('pending', 'active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "project_type" AS ENUM ('inspection', 'repair', 'replacement', 'maintenance', 'emergency');

-- CreateEnum
CREATE TYPE "sync_operation" AS ENUM ('pending', 'in_progress', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "task_priority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "task_type" AS ENUM ('task', 'note');

-- CreateEnum
CREATE TYPE "timeline_event_type" AS ENUM ('STATUS_CHANGE', 'NOTE_ADDED', 'INTERVIEW', 'TEST_TASK', 'CONTACT');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'manager', 'agent', 'sales_agent', 'sales_manager', 'sales_lead', 'field_rep', 'field_inspector', 'field_supervisor', 'claims_adjuster', 'claims_processor', 'claims_manager', 'legal_counsel', 'legal_assistant', 'estimator', 'estimate_reviewer', 'project_manager', 'project_coordinator', 'solution_architect', 'tech_lead', 'marketing_tech', 'hardware_tech', 'developer', 'tech_support');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'inactive', 'pending');

-- CreateEnum
CREATE TYPE "interest_level" AS ENUM ('interested', 'not_interested', 'undecided');

-- CreateTable
CREATE TABLE "skill_test_definitions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "role" "SkillTestDeveloperRole" NOT NULL,
    "questions" JSONB NOT NULL,
    "passing_score" INTEGER NOT NULL,
    "time_limit" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_test_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "developer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ai_feedback" JSONB DEFAULT '{}',
    "answers" JSONB NOT NULL DEFAULT '[]',
    "application_id" UUID NOT NULL,
    "completed_at" TIMESTAMPTZ(6),
    "score" INTEGER,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "test_id" UUID NOT NULL,
    "status" "SkillTestSubmissionStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "test_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "available_positions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "role" "developer_role" NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "responsibilities" TEXT[],
    "tech_stack" TEXT[],
    "benefits" TEXT[],
    "required_experience_years" INTEGER,
    "salary_range_min" DECIMAL(10,2),
    "salary_range_max" DECIMAL(10,2),
    "is_active" BOOLEAN DEFAULT true,
    "priority" INTEGER DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "available_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "call_id" UUID,
    "event_type" VARCHAR(50) NOT NULL,
    "event_data" JSONB NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_lists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "source" VARCHAR(100),
    "total_contacts" INTEGER,
    "remaining_contacts" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "call_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "date" DATE NOT NULL,
    "total_calls" INTEGER DEFAULT 0,
    "total_duration" INTEGER DEFAULT 0,
    "successful_calls" INTEGER DEFAULT 0,
    "average_duration" INTEGER DEFAULT 0,
    "quality_score_sum" INTEGER DEFAULT 0,
    "quality_score_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_queue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "lead_id" UUID,
    "priority" INTEGER DEFAULT 1,
    "status" VARCHAR(50) NOT NULL DEFAULT 'queued',
    "from_number" VARCHAR(20) NOT NULL,
    "to_number" VARCHAR(20) NOT NULL,
    "attempts" INTEGER DEFAULT 0,
    "max_attempts" INTEGER DEFAULT 3,
    "next_attempt" TIMESTAMPTZ(6),
    "last_attempt" TIMESTAMPTZ(6),
    "notes" TEXT,
    "active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calls" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "lead_id" UUID,
    "direction" VARCHAR(20) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'queued',
    "outcome" VARCHAR(50),
    "from_number" VARCHAR(20) NOT NULL,
    "to_number" VARCHAR(20) NOT NULL,
    "duration" INTEGER,
    "recording_url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "paypal_email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "position" VARCHAR(100) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'NEW',
    "applied_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "resume_url" TEXT NOT NULL,
    "last_contact" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "skills" TEXT[],
    "experience" INTEGER NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "lead_id" UUID,
    "type" VARCHAR(50) NOT NULL,
    "direction" VARCHAR(20) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "duration" INTEGER,
    "notes" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "company_name" VARCHAR(255),
    "type" VARCHAR(50) DEFAULT 'residential',
    "source" VARCHAR(100),
    "status" VARCHAR(50) DEFAULT 'active',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damage_assessments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID,
    "inspector_id" UUID,
    "inspection_date" TIMESTAMPTZ(6),
    "damage_type" VARCHAR(100),
    "severity" VARCHAR(50),
    "metadata" JSONB DEFAULT '{}',
    "notes" TEXT,
    "photos_count" INTEGER DEFAULT 0,
    "status" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "damage_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "developer_id" UUID,
    "position" VARCHAR(255) NOT NULL,
    "cover_letter" TEXT,
    "status" VARCHAR(50) DEFAULT 'pending',
    "expected_salary" DECIMAL(10,2),
    "availability_start_date" DATE,
    "reviewer_id" UUID,
    "review_notes" TEXT,
    "reviewed_at" TIMESTAMPTZ(6),
    "technical_assessment_score" INTEGER,
    "communication_assessment_score" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "start_date" VARCHAR(255),
    "will_do_test_task" BOOLEAN NOT NULL DEFAULT false,
    "test_submitted_at" TIMESTAMPTZ(6),
    "whatsapp_number" VARCHAR(20),
    "meeting_notes" TEXT,
    "interest_level" "interest_level" DEFAULT 'undecided',
    "last_meeting_date" TIMESTAMPTZ(6),
    "next_meeting_date" TIMESTAMPTZ(6),
    "github_submission" JSONB,

    CONSTRAINT "developer_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cognito_id" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "paypal_email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "profile_picture_url" VARCHAR(255),
    "role" "developer_role" NOT NULL,
    "status" "developer_status" DEFAULT 'pending',
    "phone" VARCHAR(20),
    "github_url" VARCHAR(255),
    "portfolio_url" VARCHAR(255),
    "resume_url" VARCHAR(255),
    "years_experience" INTEGER,
    "skills" JSONB DEFAULT '[]',
    "preferred_technologies" JSONB DEFAULT '[]',
    "hourly_rate" DECIMAL(10,2),
    "availability_hours" INTEGER,
    "timezone" VARCHAR(50),
    "english_proficiency" VARCHAR(20),
    "education" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "preferred_timezone" VARCHAR(50) DEFAULT 'PHT',
    "password_hash" VARCHAR(255) NOT NULL,

    CONSTRAINT "developers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "property_id" UUID,
    "lead_id" UUID,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "s3_key" VARCHAR(1024) NOT NULL,
    "s3_bucket" VARCHAR(255) NOT NULL,
    "content_type" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "metadata" JSONB,
    "uploaded_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "thumbnail_url" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "original_filename" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" UUID,
    "customer_id" UUID,
    "property_id" UUID,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6),
    "status" VARCHAR(50) DEFAULT 'scheduled',
    "location" VARCHAR(255),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_conversion_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flow_import_id" UUID,
    "step_number" INTEGER,
    "source_step" JSONB,
    "converted_step" JSONB,
    "ai_analysis" JSONB,
    "success" BOOLEAN,
    "error_details" TEXT,
    "processing_time" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_conversion_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_executions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flow_id" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "result" JSONB,
    "error" JSONB,
    "executed_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_imports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flow_id" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "blueprint_name" VARCHAR(255) NOT NULL,
    "blueprint_data" JSONB NOT NULL,
    "converted_flow" JSONB NOT NULL,
    "ai_suggestions" JSONB,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "error_details" JSONB,
    "imported_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_mappings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_module" VARCHAR(255) NOT NULL,
    "target_module" VARCHAR(255) NOT NULL,
    "mapping_rules" JSONB NOT NULL,
    "confidence_score" DOUBLE PRECISION,
    "last_used_at" TIMESTAMPTZ(6),
    "success_count" INTEGER DEFAULT 0,
    "failure_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_claims" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "project_id" UUID NOT NULL,
    "claim_number" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "adjuster_name" VARCHAR(255),
    "adjuster_phone" VARCHAR(50),
    "adjuster_email" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insurance_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "property_id" UUID,
    "lead_id" UUID,
    "user_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "subtype" VARCHAR(50),
    "status" VARCHAR(50) NOT NULL,
    "content" TEXT,
    "metadata" JSONB,
    "duration" INTEGER,
    "sentiment" VARCHAR(50),
    "score" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "candidate_id" UUID,
    "scheduled_at" TIMESTAMPTZ(6) NOT NULL,
    "interviewer" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'SCHEDULED',
    "feedback" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "notes" TEXT,
    "monday_item_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_lists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "uploaded_by" UUID,
    "uploaded_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "total_leads" INTEGER DEFAULT 0,
    "converted_leads" INTEGER DEFAULT 0,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "property_id" UUID,
    "assigned_to" UUID,
    "source" VARCHAR(100),
    "status" VARCHAR(50) NOT NULL,
    "priority" VARCHAR(20) DEFAULT 'medium',
    "storm_info" VARCHAR(50),
    "damage_type" VARCHAR(100),
    "estimated_value" DECIMAL(10,2),
    "probability" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_contacted_at" TIMESTAMPTZ(6),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "list_id" UUID,
    "assigned_to" UUID,
    "status" VARCHAR(50) DEFAULT 'active',
    "contacts_called" INTEGER DEFAULT 0,
    "successful_contacts" INTEGER DEFAULT 0,
    "last_called_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "list_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID,
    "type" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,
    "original_path" TEXT,
    "content_type" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',
    "created_by" UUID,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_analysis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL,
    "media_type" VARCHAR(50) NOT NULL,
    "transcript" TEXT,
    "analysis" JSONB NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "recording_start_time" TIMESTAMPTZ(6),
    "sequence_number" INTEGER,
    "recording_id" UUID,
    "created_by" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "title" VARCHAR(100) NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "period" VARCHAR(20) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "executed_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monday_user_sync_log" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "monday_id" VARCHAR(50) NOT NULL,
    "operation" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "monday_user_sync_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" VARCHAR(50) NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "sent_at" TIMESTAMPTZ(6),
    "error_details" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "project_id" UUID NOT NULL,
    "claim_id" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipeline_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pipeline_id" UUID,
    "changed_by" UUID,
    "previous_status" "pipeline_status",
    "new_status" "pipeline_status",
    "previous_phase" "pipeline_phase",
    "new_phase" "pipeline_phase",
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pipeline_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL,
    "presentation_date" TIMESTAMPTZ(6) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID,
    "user_id" UUID,
    "department" "department" NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID,
    "sender_id" UUID,
    "department" "department" NOT NULL,
    "message_type" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "priority" VARCHAR(20) DEFAULT 'normal',
    "read_by" JSONB DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID,
    "lead_id" UUID,
    "role" VARCHAR(50) NOT NULL,
    "user_id" UUID NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_updates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID,
    "user_id" UUID,
    "department" "department" NOT NULL,
    "update_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "department_change" "department",
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "property_id" UUID NOT NULL,
    "estimated_value" DECIMAL(12,2),
    "status" "project_status" DEFAULT 'pending',
    "phase" "project_phase" DEFAULT 'pre-sale',
    "production_status" "production_status" DEFAULT 'not_started',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "sync_status" VARCHAR(50) DEFAULT 'pending',
    "last_sync_at" TIMESTAMPTZ(6),
    "sync_error" TEXT,
    "sync_direction" VARCHAR(50),
    "sync_version" INTEGER DEFAULT 0,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID,
    "street" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zip" VARCHAR(10) NOT NULL,
    "type" VARCHAR(50),
    "square_footage" INTEGER,
    "year_built" INTEGER,
    "roof_type" VARCHAR(100),
    "last_inspection" TIMESTAMPTZ(6),
    "status" VARCHAR(50) DEFAULT 'active',
    "notes" TEXT,
    "damage_info" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renommy_lists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "storm_id" UUID,
    "imported_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "imported_by" UUID,
    "total_properties" INTEGER DEFAULT 0,
    "status" VARCHAR(50) DEFAULT 'active',
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "renommy_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renommy_properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "list_id" UUID,
    "renommy_id" VARCHAR(255),
    "address" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zip" VARCHAR(10) NOT NULL,
    "lat" DECIMAL(10,8),
    "lng" DECIMAL(11,8),
    "property_type" VARCHAR(50),
    "square_footage" INTEGER,
    "year_built" INTEGER,
    "owner_name" VARCHAR(255),
    "owner_phone" VARCHAR(20),
    "owner_email" VARCHAR(255),
    "secondary_contact_name" VARCHAR(255),
    "secondary_contact_phone" VARCHAR(20),
    "secondary_contact_email" VARCHAR(255),
    "last_contact_date" TIMESTAMPTZ(6),
    "status" VARCHAR(50) DEFAULT 'new',
    "assigned_to" UUID,
    "converted_to_lead" BOOLEAN DEFAULT false,
    "converted_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "renommy_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "route_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "stop_order" INTEGER NOT NULL,
    "estimated_arrival" TIMESTAMPTZ(6),
    "actual_arrival" TIMESTAMPTZ(6),
    "estimated_duration" INTEGER,
    "actual_duration" INTEGER,
    "status" VARCHAR(50) DEFAULT 'pending',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "route_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "assigned_to" UUID NOT NULL,
    "start_location" JSONB NOT NULL,
    "end_location" JSONB,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6),
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "total_distance" DECIMAL(10,2),
    "total_duration" INTEGER,
    "optimization_type" VARCHAR(50) DEFAULT 'distance',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_scripts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "category" VARCHAR(100),
    "version" INTEGER DEFAULT 1,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "sales_scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_team_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "team_id" UUID,
    "user_id" UUID NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'active',
    "start_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "manager_id" UUID NOT NULL,
    "region" VARCHAR(100),
    "goals" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storm_affected_properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "storm_id" UUID,
    "property_id" UUID,
    "damage_level" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storm_affected_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255),
    "type" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "severity" VARCHAR(50),
    "affected_area_center_lat" DECIMAL(10,8),
    "affected_area_center_lng" DECIMAL(11,8),
    "affected_area_radius" DECIMAL(10,2),
    "estimated_properties_affected" INTEGER,
    "notes" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_field_mapping" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "entity_type" VARCHAR(50) NOT NULL,
    "monday_field" VARCHAR(255) NOT NULL,
    "system_field" VARCHAR(255) NOT NULL,
    "transform_function" TEXT,
    "bidirectional" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_field_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_mapping" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "entity_type" VARCHAR(50) NOT NULL,
    "system_id" UUID NOT NULL,
    "monday_id" VARCHAR(50) NOT NULL,
    "monday_board_id" VARCHAR(50),
    "monday_group_id" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_queue" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "operation" VARCHAR(50) NOT NULL,
    "source" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'pending',
    "priority" INTEGER DEFAULT 0,
    "retry_count" INTEGER DEFAULT 0,
    "error_message" TEXT,
    "payload" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "locked_at" TIMESTAMPTZ(6),
    "locked_by" VARCHAR(255),

    CONSTRAINT "sync_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" UUID,
    "assigned_to" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMPTZ(6),
    "priority" VARCHAR(20) DEFAULT 'medium',
    "status" VARCHAR(50) DEFAULT 'pending',
    "completed" BOOLEAN DEFAULT false,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "candidate_id" UUID,
    "assigned" BOOLEAN DEFAULT false,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "score" DECIMAL(5,2),
    "feedback" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "candidate_id" UUID,
    "type" VARCHAR(50) NOT NULL,
    "date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "details" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "achievement_type" VARCHAR(100) NOT NULL,
    "achievement_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "awarded_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "date" DATE NOT NULL,
    "calls_made" INTEGER DEFAULT 0,
    "calls_connected" INTEGER DEFAULT 0,
    "total_talk_time" INTEGER DEFAULT 0,
    "successful_outcomes" INTEGER DEFAULT 0,
    "tasks_created" INTEGER DEFAULT 0,
    "tasks_completed" INTEGER DEFAULT 0,
    "leads_converted" INTEGER DEFAULT 0,
    "average_call_rating" DECIMAL(3,2),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "profile_picture_url" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "session_id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "device_id" VARCHAR(255) NOT NULL,
    "device_name" TEXT,
    "device_type" TEXT,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "token_expires_at" TIMESTAMPTZ(6) NOT NULL,
    "refresh_token_expires_at" TIMESTAMPTZ(6) NOT NULL,
    "last_active_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "user_sync_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "operation" "sync_operation" NOT NULL,
    "direction" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_sync_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "user_role" NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "cognito_id" VARCHAR(255),
    "monday_id" VARCHAR(50),
    "monday_account_id" VARCHAR(50),
    "monday_title" VARCHAR(255),
    "monday_team" VARCHAR(100),
    "monday_last_sync" TIMESTAMPTZ(6),
    "default_password_changed" BOOLEAN DEFAULT false,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_assignments" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "developer_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "notes" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "task_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_attachments" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "start_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "notes" TEXT[],

    CONSTRAINT "developer_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "test_submissions_test_id_idx" ON "test_submissions"("test_id");

-- CreateIndex
CREATE INDEX "test_submissions_developer_id_idx" ON "test_submissions"("developer_id");

-- CreateIndex
CREATE INDEX "test_submissions_application_id_idx" ON "test_submissions"("application_id");

-- CreateIndex
CREATE INDEX "idx_positions_active" ON "available_positions"("is_active");

-- CreateIndex
CREATE INDEX "idx_positions_role" ON "available_positions"("role");

-- CreateIndex
CREATE INDEX "idx_lists_source" ON "call_lists"("source");

-- CreateIndex
CREATE INDEX "idx_call_metrics_user_date" ON "call_metrics"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "call_metrics_user_id_date_key" ON "call_metrics"("user_id", "date");

-- CreateIndex
CREATE INDEX "idx_call_queue_status" ON "call_queue"("status");

-- CreateIndex
CREATE INDEX "idx_calls_customer_id" ON "calls"("customer_id");

-- CreateIndex
CREATE INDEX "idx_calls_lead_id" ON "calls"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");

-- CreateIndex
CREATE INDEX "idx_candidates_position" ON "candidates"("position");

-- CreateIndex
CREATE INDEX "idx_candidates_skills" ON "candidates" USING GIN ("skills");

-- CreateIndex
CREATE INDEX "idx_candidates_status" ON "candidates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "idx_damage_assessments_inspector" ON "damage_assessments"("inspector_id");

-- CreateIndex
CREATE INDEX "idx_damage_assessments_property" ON "damage_assessments"("property_id");

-- CreateIndex
CREATE INDEX "idx_damage_assessments_status" ON "damage_assessments"("status");

-- CreateIndex
CREATE INDEX "idx_applications_developer" ON "developer_applications"("developer_id");

-- CreateIndex
CREATE INDEX "idx_applications_status" ON "developer_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "developers_cognito_id_key" ON "developers"("cognito_id");

-- CreateIndex
CREATE UNIQUE INDEX "developers_email_key" ON "developers"("email");

-- CreateIndex
CREATE INDEX "idx_developers_cognito" ON "developers"("cognito_id");

-- CreateIndex
CREATE INDEX "idx_developers_role" ON "developers"("role");

-- CreateIndex
CREATE INDEX "idx_developers_status" ON "developers"("status");

-- CreateIndex
CREATE INDEX "idx_documents_content_type" ON "documents"("content_type");

-- CreateIndex
CREATE INDEX "idx_documents_created_at" ON "documents"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_documents_property" ON "documents"("property_id");

-- CreateIndex
CREATE INDEX "idx_documents_property_id" ON "documents"("property_id");

-- CreateIndex
CREATE INDEX "idx_documents_type" ON "documents"("type");

-- CreateIndex
CREATE INDEX "idx_documents_uploaded_by" ON "documents"("uploaded_by");

-- CreateIndex
CREATE INDEX "idx_events_lead_id" ON "events"("lead_id");

-- CreateIndex
CREATE INDEX "idx_conversion_logs_import" ON "flow_conversion_logs"("flow_import_id");

-- CreateIndex
CREATE INDEX "idx_flow_executions_executed_at" ON "flow_executions"("executed_at");

-- CreateIndex
CREATE INDEX "idx_flow_executions_flow_id" ON "flow_executions"("flow_id");

-- CreateIndex
CREATE INDEX "idx_flow_executions_status" ON "flow_executions"("status");

-- CreateIndex
CREATE INDEX "idx_flow_executions_user_email" ON "flow_executions"("user_email");

-- CreateIndex
CREATE INDEX "idx_flow_imports_flow_id" ON "flow_imports"("flow_id");

-- CreateIndex
CREATE INDEX "idx_flow_imports_status" ON "flow_imports"("status");

-- CreateIndex
CREATE INDEX "idx_flow_imports_user_email" ON "flow_imports"("user_email");

-- CreateIndex
CREATE INDEX "idx_flow_mappings_source" ON "flow_mappings"("source_module");

-- CreateIndex
CREATE INDEX "idx_flow_mappings_target" ON "flow_mappings"("target_module");

-- CreateIndex
CREATE INDEX "idx_insurance_claims_project_id" ON "insurance_claims"("project_id");

-- CreateIndex
CREATE INDEX "idx_interactions_created_at" ON "interactions"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_interactions_customer" ON "interactions"("customer_id");

-- CreateIndex
CREATE INDEX "idx_interactions_lead_id" ON "interactions"("lead_id");

-- CreateIndex
CREATE INDEX "idx_interactions_type" ON "interactions"("type");

-- CreateIndex
CREATE INDEX "idx_interactions_user" ON "interactions"("user_id");

-- CreateIndex
CREATE INDEX "idx_interactions_user_id" ON "interactions"("user_id");

-- CreateIndex
CREATE INDEX "idx_jobs_customer_id" ON "jobs"("customer_id");

-- CreateIndex
CREATE INDEX "idx_jobs_monday_item_id" ON "jobs"("monday_item_id");

-- CreateIndex
CREATE INDEX "idx_leads_assigned_to" ON "leads"("assigned_to");

-- CreateIndex
CREATE INDEX "idx_leads_status" ON "leads"("status");

-- CreateIndex
CREATE INDEX "idx_assignments_user" ON "list_assignments"("assigned_to");

-- CreateIndex
CREATE INDEX "idx_media_project" ON "media"("project_id");

-- CreateIndex
CREATE INDEX "idx_media_type" ON "media"("type");

-- CreateIndex
CREATE INDEX "idx_media_analysis_property" ON "media_analysis"("property_id");

-- CreateIndex
CREATE INDEX "idx_media_analysis_recording" ON "media_analysis"("recording_id");

-- CreateIndex
CREATE INDEX "idx_media_analysis_timestamp" ON "media_analysis"("timestamp");

-- CreateIndex
CREATE INDEX "idx_media_analysis_type" ON "media_analysis"("media_type");

-- CreateIndex
CREATE UNIQUE INDEX "migrations_name_key" ON "migrations"("name");

-- CreateIndex
CREATE INDEX "idx_monday_user_sync_log_monday_id" ON "monday_user_sync_log"("monday_id");

-- CreateIndex
CREATE INDEX "idx_monday_user_sync_log_user" ON "monday_user_sync_log"("user_id");

-- CreateIndex
CREATE INDEX "idx_notifications_created_at" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "idx_notifications_recipient" ON "notifications"("recipient");

-- CreateIndex
CREATE INDEX "idx_notifications_status" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "idx_notifications_type" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "idx_payments_claim_id" ON "payments"("claim_id");

-- CreateIndex
CREATE INDEX "idx_payments_project_id" ON "payments"("project_id");

-- CreateIndex
CREATE INDEX "idx_presentations_date" ON "presentations"("presentation_date");

-- CreateIndex
CREATE INDEX "idx_presentations_property" ON "presentations"("property_id");

-- CreateIndex
CREATE INDEX "idx_presentations_status" ON "presentations"("status");

-- CreateIndex
CREATE INDEX "idx_project_assignments_project" ON "project_assignments"("project_id");

-- CreateIndex
CREATE INDEX "idx_project_assignments_user" ON "project_assignments"("user_id");

-- CreateIndex
CREATE INDEX "idx_project_messages_project" ON "project_messages"("project_id");

-- CreateIndex
CREATE INDEX "idx_project_updates_project" ON "project_updates"("project_id");

-- CreateIndex
CREATE INDEX "idx_projects_property_id" ON "projects"("property_id");

-- CreateIndex
CREATE INDEX "idx_renommy_lists_status" ON "renommy_lists"("status");

-- CreateIndex
CREATE INDEX "idx_renommy_lists_storm" ON "renommy_lists"("storm_id");

-- CreateIndex
CREATE INDEX "idx_renommy_properties_converted" ON "renommy_properties"("converted_to_lead");

-- CreateIndex
CREATE INDEX "idx_renommy_properties_list" ON "renommy_properties"("list_id");

-- CreateIndex
CREATE INDEX "idx_renommy_properties_status" ON "renommy_properties"("status");

-- CreateIndex
CREATE INDEX "idx_route_tasks_route" ON "route_tasks"("route_id");

-- CreateIndex
CREATE INDEX "idx_route_tasks_status" ON "route_tasks"("status");

-- CreateIndex
CREATE INDEX "idx_route_tasks_task" ON "route_tasks"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "route_tasks_route_id_stop_order_key" ON "route_tasks"("route_id", "stop_order");

-- CreateIndex
CREATE UNIQUE INDEX "route_tasks_route_id_task_id_key" ON "route_tasks"("route_id", "task_id");

-- CreateIndex
CREATE INDEX "idx_routes_assigned_to" ON "routes"("assigned_to");

-- CreateIndex
CREATE INDEX "idx_routes_start_time" ON "routes"("start_time");

-- CreateIndex
CREATE INDEX "idx_routes_status" ON "routes"("status");

-- CreateIndex
CREATE INDEX "idx_scripts_category" ON "sales_scripts"("category");

-- CreateIndex
CREATE INDEX "idx_sales_team_members_team" ON "sales_team_members"("team_id");

-- CreateIndex
CREATE INDEX "idx_sales_team_members_user" ON "sales_team_members"("user_id");

-- CreateIndex
CREATE INDEX "idx_sales_teams_manager" ON "sales_teams"("manager_id");

-- CreateIndex
CREATE INDEX "idx_storm_affected_properties_property" ON "storm_affected_properties"("property_id");

-- CreateIndex
CREATE INDEX "idx_storm_affected_properties_storm" ON "storm_affected_properties"("storm_id");

-- CreateIndex
CREATE UNIQUE INDEX "storm_affected_properties_storm_id_property_id_key" ON "storm_affected_properties"("storm_id", "property_id");

-- CreateIndex
CREATE INDEX "idx_storms_date" ON "storms"("date");

-- CreateIndex
CREATE INDEX "idx_storms_type" ON "storms"("type");

-- CreateIndex
CREATE UNIQUE INDEX "sync_field_mapping_entity_type_monday_field_key" ON "sync_field_mapping"("entity_type", "monday_field");

-- CreateIndex
CREATE INDEX "idx_sync_mapping_monday" ON "sync_mapping"("entity_type", "monday_id");

-- CreateIndex
CREATE INDEX "idx_sync_mapping_system" ON "sync_mapping"("entity_type", "system_id");

-- CreateIndex
CREATE UNIQUE INDEX "sync_mapping_entity_type_monday_id_key" ON "sync_mapping"("entity_type", "monday_id");

-- CreateIndex
CREATE UNIQUE INDEX "sync_mapping_entity_type_system_id_key" ON "sync_mapping"("entity_type", "system_id");

-- CreateIndex
CREATE INDEX "idx_sync_queue_entity" ON "sync_queue"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_sync_queue_priority" ON "sync_queue"("priority", "created_at");

-- CreateIndex
CREATE INDEX "idx_sync_queue_status" ON "sync_queue"("status");

-- CreateIndex
CREATE INDEX "idx_tasks_lead_id" ON "tasks"("lead_id");

-- CreateIndex
CREATE INDEX "idx_team_members_project_id" ON "team_members"("project_id");

-- CreateIndex
CREATE INDEX "idx_team_members_user_id" ON "team_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_project_id_user_id_key" ON "team_members"("project_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_user_metrics_date" ON "user_metrics"("date");

-- CreateIndex
CREATE INDEX "idx_user_metrics_user_date" ON "user_metrics"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_metrics_user_id_date_key" ON "user_metrics"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE INDEX "idx_user_sessions_device" ON "user_sessions"("user_id", "device_id");

-- CreateIndex
CREATE INDEX "idx_user_sessions_user_id" ON "user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_sync_history_status" ON "user_sync_history"("status");

-- CreateIndex
CREATE INDEX "idx_user_sync_history_user_id" ON "user_sync_history"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_cognito_id" ON "users"("cognito_id");

-- CreateIndex
CREATE INDEX "idx_users_department" ON "users"("department");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_monday_id" ON "users"("monday_id");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- CreateIndex
CREATE INDEX "task_assignments_developer_id_idx" ON "task_assignments"("developer_id");

-- CreateIndex
CREATE INDEX "task_assignments_task_id_idx" ON "task_assignments"("task_id");

-- AddForeignKey
ALTER TABLE "test_submissions" ADD CONSTRAINT "test_submissions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "developer_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_submissions" ADD CONSTRAINT "test_submissions_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "developers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_submissions" ADD CONSTRAINT "test_submissions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "skill_test_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_events" ADD CONSTRAINT "call_events_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "call_queue" ADD CONSTRAINT "call_queue_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "call_queue" ADD CONSTRAINT "call_queue_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "developer_applications" ADD CONSTRAINT "developer_applications_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "developers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "flow_conversion_logs" ADD CONSTRAINT "flow_conversion_logs_flow_import_id_fkey" FOREIGN KEY ("flow_import_id") REFERENCES "flow_imports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "list_assignments" ADD CONSTRAINT "list_assignments_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "call_lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "insurance_claims"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "renommy_lists" ADD CONSTRAINT "renommy_lists_storm_id_fkey" FOREIGN KEY ("storm_id") REFERENCES "storms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "renommy_properties" ADD CONSTRAINT "renommy_properties_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "renommy_lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "route_tasks" ADD CONSTRAINT "route_tasks_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_team_members" ADD CONSTRAINT "sales_team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "sales_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_tasks" ADD CONSTRAINT "test_tasks_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "developers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "developer_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_attachments" ADD CONSTRAINT "task_attachments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "developer_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

