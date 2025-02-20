import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUser, validateLogin } from '../middleware/validation.middleware';
import { auth } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', validateUser, userController.register);
router.post('/login', validateLogin, userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.patch('/profile', auth, validateUser, userController.updateProfile);
router.delete('/profile', auth, userController.deleteAccount);

export default router; 