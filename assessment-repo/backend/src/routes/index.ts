import express from 'express';
import usersRouter from './users.routes';
import tasksRouter from './tasks.routes';
import authRoutes from './auth.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', tasksRouter);
router.use('/users', usersRouter);

export default router;