# Database Migration Changelog

## 2024-03-20: Initial Schema Setup

### Added
- UUID extension for generating unique identifiers
- `developers` table for storing developer information
  - Fields: id, name, email, created_at, updated_at
  - Unique constraint on email

- `developer_tasks` table for managing development tasks
  - Fields: id, title, description, status, priority, complexity, estimated_hours, department, category, requirements, acceptance_criteria, compensation
  - Default values for status ('available'), priority (1), complexity ('medium'), and category ('NEW_FEATURE')

- `task_attachments` table for storing task-related files
  - Fields: id, task_id, file_name, file_type, file_size, s3_key, uploaded_by, created_at, updated_at
  - Foreign key constraints to developer_tasks and developers tables
  - Cascade deletion with parent task

- `task_assignments` table for managing task assignments
  - Fields: id, task_id, developer_id, assigned_at, status
  - Foreign key constraints to developer_tasks and developers tables
  - Unique constraint on task_id and developer_id combination
  - Cascade deletion with parent task

### Indexes
- `idx_developer_tasks_status` on developer_tasks(status)
- `idx_task_attachments_task_id` on task_attachments(task_id)
- `idx_task_assignments_developer_id` on task_assignments(developer_id)

### Triggers
- Automatic `updated_at` timestamp updates for:
  - developer_tasks table
  - task_attachments table
  - developers table 

## 2024-03-20: Update Task Attachments Table

### Changed
- Restructured `task_attachments` table:
  - Removed: type, url, title fields
  - Added: file_name, file_type, file_size, s3_key, uploaded_by fields
  - Improved file storage integration with S3
  - Added reference to uploading developer

### Security
- Added proper constraints for file metadata
- Improved tracking of file uploads with developer reference

### Performance
- Maintained existing index on task_id for efficient queries
- Optimized file metadata storage with appropriate field types 