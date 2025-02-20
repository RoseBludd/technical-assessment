import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Technical Assessment",
      version: "1.0.0",
      description: "Test Api",
    },
  },
  apis: ["./src/controllers/*.ts", "./**/*.ts"], // Adjust paths to your routes
};

const swaggerSpec = swaggerJSDoc(options);

export default (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
