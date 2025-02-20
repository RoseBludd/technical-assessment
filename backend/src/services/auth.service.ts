import { AppDataSource } from "../../ormconfig";
import { LoginDto } from "../dtos/login.dto";
import { AppException } from "../middleware/error.middleware";
import { User } from "../models/user.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export const login = async (loginCreds: LoginDto) => {
  const matchUser = await userRepository.findOne({
    where: { email: loginCreds.email },
  });

  if (!matchUser) {
    throw new AppException("User Not Found", 404);
  }

  const passwordMatch = await bcrypt.compare(
    loginCreds.password,
    matchUser.password
  );

  if (!passwordMatch) {
    throw new AppException("User Not Found", 404);
  }

  const accessToken = jwt.sign(
    { id: matchUser.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h", // can be set to 1d, 1h, 1y, etc
    }
  );

  return {
    accessToken,
  };
};
