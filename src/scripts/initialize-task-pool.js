const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('fs');
const { join } = require('path');

const prisma = new PrismaClient();

async function initializeTaskPool() {
  console.log('Checking task assignment...');
  
  try {
    // Find Junniel in the developers table
    const junniel = await prisma.developers.findFirst({
      where: {
        name: 'Junniel Rome Ardepuela'
      },
      select: {
        id: true
      }
    });

    if (!junniel) {
      console.log('Could not find developer Junniel Rome Ardepuela');
      return;
    }

    // Find the Property Document Viewer task
    const propertyViewerTask = await prisma.tasks.findFirst({
      where: {
        title: 'Property Document Viewer'
      },
      select: {
        id: true
      }
    });

    if (!propertyViewerTask) {
      console.log('Could not find Property Document Viewer task');
      return;
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.task_assignments.findFirst({
      where: {
        task_id: propertyViewerTask.id,
        developer_id: junniel.id
      }
    });

    if (existingAssignment) {
      console.log('Task is already assigned to Junniel');
      return;
    }

    // Create task assignment
    await prisma.task_assignments.create({
      data: {
        task_id: propertyViewerTask.id,
        developer_id: junniel.id,
        status: 'assigned',
        start_date: new Date(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: JSON.stringify({
          message: "Initial task assignment for Property Document Viewer component",
          assigned_at: new Date().toISOString()
        })
      }
    });

    console.log('Successfully assigned Property Document Viewer task to Junniel');

  } catch (error) {
    console.error('Error in task assignment:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeTaskPool(); 