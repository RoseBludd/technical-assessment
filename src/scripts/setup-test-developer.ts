const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger').logger;

const prisma = new PrismaClient();

async function setupTestDeveloper() {
  try {
    // Create test developer
    const developer = await prisma.developers.create({
      data: {
        email: 'junniel.rome@gmail.com',
        paypal_email: 'junniel.rome@gmail.com', // Using same email for testing
        name: 'Junniel Rome',
        role: 'fullstack_developer',
        status: 'active',
        password_hash: '$2b$10$K7L9wqj9kE6B5X5.5Z5Z5O5X5X5X5X5X5X5X5X5X5X5X5X5X5X5', // Example hash
        skills: [], // Empty JSON array
        preferred_technologies: [], // Empty JSON array
        timezone: 'Asia/Manila',
        preferred_timezone: 'PHT',
        english_proficiency: 'fluent',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    logger.info('Test developer created successfully');
    logger.info(JSON.stringify(developer, null, 2));

    return developer;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to create test developer: ${error.message}`);
      logger.error(error.stack || 'No stack trace available');
    } else {
      logger.error('Failed to create test developer: Unknown error');
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the setup
setupTestDeveloper()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  }); 