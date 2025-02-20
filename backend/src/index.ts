import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { rateLimit } from './middleware/rate-limit.middleware';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimit());

// Health check endpoint
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Root API endpoint
app.get('/api', (_, res) => {
  res.json({
    message: 'Task Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: {
        register: '/api/users/register',
        login: '/api/users/login',
        profile: '/api/users/profile'
      },
      tasks: {
        list: '/api/tasks',
        create: '/api/tasks',
        getById: '/api/tasks/:id',
        update: '/api/tasks/:id',
        delete: '/api/tasks/:id'
      },
      documentation: process.env.NODE_ENV !== 'production' ? '/api-docs' : undefined
    }
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// API Documentation
if (process.env.NODE_ENV !== 'production') {
  app.get('/swagger.json', (_, res) => {
    res.json(swaggerDocument);
  });
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  }).on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);  // Exit on startup failure
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

export default app; 