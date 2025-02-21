import express from 'express';
import routes from './routes/index';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../docs/swagger';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Assessment Portal API',
        status: 'Server is running',
        documentation: '/api-docs'
    });
});


// Routes
app.use('/api', routes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;