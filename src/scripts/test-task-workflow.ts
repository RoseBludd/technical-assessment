const { TaskWorkflowService } = require('../services/TaskWorkflowService');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient();

async function testTaskWorkflow() {
  try {
    // 1. Create test task
    const task = await prisma.tasks.create({
      data: {
        title: 'Property Document Viewer',
        description: `Create a document viewer component for property files with the following features:
- PDF viewing capability with page navigation
- Image gallery for property photos
- File list view with search functionality
- Download capability for all file types
- Loading states and error handling
- Responsive design for all screen sizes

The component should integrate with the existing property management system and follow the established design patterns.`,
        priority: 'medium',
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // 2. Get test developer (Junniel)
    const developer = await prisma.developers.findFirst({
      where: {
        email: 'junniel.rome@gmail.com'
      }
    });

    if (!developer) {
      throw new Error('Test developer not found');
    }

    // 3. Create admin notes
    const adminNotes = `This component is critical for the property inspection workflow.
Key integration points:
- Use the FileService from lib/services for file operations
- Integrate with the PropertyContext for state management
- Follow the existing error boundary pattern
- Use the shared LoadingState component

Reference existing components:
- app/components/shared/file-upload
- app/components/property/gallery
- app/components/shared/pdf-viewer`;

    // 4. Initialize TaskWorkflowService
    const workflowService = new TaskWorkflowService();

    // 5. Run the task assignment
    logger.info('Starting task workflow test...');
    const result = await workflowService.handleTaskAssignment(
      task.id,
      developer.id,
      adminNotes
    );

    logger.info('Task workflow completed successfully');
    logger.info(JSON.stringify(result, null, 2));

    // 6. Verify workspace creation
    if (result.workspaceId) {
      logger.info(`Workspace created: ${result.workspaceId}`);
      
      // Log task assignment details
      const assignment = await prisma.task_assignments.findFirst({
        where: {
          task_id: task.id,
          developer_id: developer.id
        }
      });

      if (assignment) {
        logger.info(`Task assignment details: ${JSON.stringify(JSON.parse(assignment.notes || '{}'), null, 2)}`);
      }
    }

  } catch (error) {
    logger.info(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testTaskWorkflow()
  .then(() => {
    logger.info('Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.info(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }); 