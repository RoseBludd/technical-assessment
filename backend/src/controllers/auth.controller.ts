import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { LoginDto } from "../dtos/login.dto";
import * as AuthService from "../services/auth.service";

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result = await AuthService.login(req.body);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const router = Router();

router.post("/login", validateRequest(LoginDto), login);

export default router;
