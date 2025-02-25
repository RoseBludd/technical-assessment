-- Drop existing task_attachments table
DROP TABLE IF EXISTS task_attachments;

-- Recreate task_attachments table with new structure
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES developer_tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    s3_key VARCHAR(512) NOT NULL,
    uploaded_by UUID REFERENCES developers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recreate index
CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);

-- Recreate trigger
CREATE TRIGGER update_task_attachments_updated_at
    BEFORE UPDATE ON task_attachments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 