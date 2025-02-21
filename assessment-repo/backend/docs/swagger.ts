import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API',
    version: '1.0.0',
    description: 'REST API documentation',
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./docs/controllers/*.yml'], // Path to the API routes
};

export const swaggerSpec = swaggerJSDoc(options);