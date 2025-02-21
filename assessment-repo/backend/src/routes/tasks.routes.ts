import express from 'express';
import { TasksController } from '../controllers/tasks.controller';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../middleware/validators/taskSchemas';
import { authenticateToken } from '../middleware/auth';


const router = express.Router();
const tasksController = new TasksController();

// Protect all task routes with authentication
router.use(authenticateToken);

router.post('/', validate(createTaskSchema), tasksController.create);
router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getOne);
router.put('/:id', validate(updateTaskSchema), tasksController.update);
router.delete('/:id', tasksController.delete);


export default router; 