import { AppDataSource } from "../../ormconfig";
import { User } from "../models/user.entity";

const userRepository = AppDataSource.getRepository(User);

export const getMany = async (): Promise<User[]> => {
  return userRepository.find();
};

export const getOne = async (id: User["id"]) => {
  return userRepository.findOne({
    where: { id },
  });
};
