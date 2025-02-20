import express from 'express';
import routes from './routes/index';
import cors from 'cors';
import helmet from 'helmet';

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

export default app;