import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema } from '../middleware/validators/authSchemas';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const authController = new AuthController();

router.post('/login', validate(loginSchema), authController.login);

export default router; 