import { AppDataSource } from "../../ormconfig";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { UpdateTaskDto } from "../dtos/update-task.dto";
import { AppException } from "../middleware/error.middleware";
import { Task } from "../models/task.entity";
import { User } from "../models/user.entity";

const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);

export const getMany = async (): Promise<Task[]> => {
  return taskRepository.find({ relations: ["ownedBy"] });
};

export const getOne = async (id: Task["id"]) => {
  return taskRepository.findOne({ where: { id } });
};

export const create = async (payload: CreateTaskDto) => {
  if (payload.ownedById) {
    const ownerExists = await userRepository.count({
      where: { id: payload.ownedById },
    });

    if (!ownerExists) {
      throw new AppException("record not found", 404);
    }
  }

  const task = taskRepository.create(payload);
  return taskRepository.save(task);
};

export const deleteOne = async (id: Task["id"]) => {
  // soft delete
  return taskRepository.softDelete(id);
};

export const updateOne = async (id: Task["id"], payload: UpdateTaskDto) => {
  return taskRepository.update(+id, payload);
};
