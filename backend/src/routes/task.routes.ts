import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validateTask } from '../middleware/validation.middleware';
import { auth } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();

// All routes are protected
router.post('/', auth, validateTask, taskController.createTask);
router.get('/', auth, taskController.getTasks);
router.get('/:id', auth, taskController.getTask);
router.patch('/:id', auth, validateTask, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

export default router; 