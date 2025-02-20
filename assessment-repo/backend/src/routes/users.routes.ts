import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../middleware/validators/userSchemas';
export { UsersController };

const router = Router();
const usersController = new UsersController();

router.post('/users', validate(createUserSchema), usersController.create);
router.get('/users', usersController.findAll);
router.get('/users/:id', usersController.findOne);
router.put('/users/:id', validate(updateUserSchema), usersController.update);
router.delete('/users/:id', usersController.delete);

export default router; 