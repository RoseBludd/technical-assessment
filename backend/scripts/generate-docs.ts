import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Task Management API',
    description: 'A RESTful API for managing tasks and users',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  basePath: '/api',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  definitions: {
    User: {
      id: 1,
      username: 'johndoe',
      email: 'john@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    Task: {
      id: 1,
      title: 'Complete project',
      description: 'Finish the backend implementation',
      status: 'TODO',
      due_date: '2024-02-01T00:00:00Z',
      created_by: 1,
      assigned_to: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    Error: {
      error: 'Error message here',
    },
  },
};

const outputFile = './src/swagger.json';
const endpointsFiles = ['./src/routes/*.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc); 