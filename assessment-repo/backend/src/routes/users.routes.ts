import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../middleware/validators/userSchemas';
export { UsersController };

const router = Router();
const usersController = new UsersController();

router.post('/', validate(createUserSchema), usersController.create);
router.get('/', usersController.findAll);
router.get('/:id', usersController.findOne);
router.put('/:id', validate(updateUserSchema), usersController.update);
router.delete('/:id', usersController.delete);

export default router; 