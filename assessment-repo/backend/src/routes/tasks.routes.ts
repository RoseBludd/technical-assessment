import express from 'express';
import { TasksController } from '../controllers/tasks.controller';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../middleware/validators/taskSchemas';

const router = express.Router();
const tasksController = new TasksController();


router.post('/tasks', validate(createTaskSchema), tasksController.create);
router.get('/tasks', tasksController.getAll);
router.get('/tasks/:id', tasksController.getOne);
router.put('/tasks/:id', validate(updateTaskSchema), tasksController.update);
router.delete('/tasks/:id', tasksController.delete);


export default router; 