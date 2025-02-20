import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { CreateTaskDto } from "../dtos/create-task.dto";
import * as TaskService from "../services/task.service";
import { TaskDto } from "../dtos/task.dto";
import { transformToDto } from "../utils/data-transformer";

const getMany = async (req: Request, res: Response): Promise<any> => {
  // note: should consinder pagination and record limiters
  const tasks = await TaskService.getMany();

  const transformedTasks = tasks.map((task) => transformToDto(TaskDto, task));
  return res.json(transformedTasks);
};

const getOne = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const task = await TaskService.getOne(+id);

  // note: need to move this to the service, using NotFoundException
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.json(transformToDto(TaskDto, task));
};

const createOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const task = await TaskService.create(req.body);

    return res.json(task);
  } catch (error) {
    next(error); // should be a caught by global exception directly
  }
};

const updateOne = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const task = TaskService.getOne(+id);

  // note: need to move this to the service, using NotFoundException
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updatedTask = TaskService.getOne(+id);
  return res.json(updatedTask);
};

const deleteOne = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const task = TaskService.getOne(+id);

  // note: need to move this to the service, using NotFoundException
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  TaskService.deleteOne(+id);

  return res.status(204).send();
};

const router = Router();

router.get("/", getMany);
router.get("/:id", getOne);
router.post("/", validateRequest(CreateTaskDto), createOne);
router.get("/:id", getOne);
router.patch("/:id", validateRequest(CreateTaskDto), updateOne);
router.delete("/:id", deleteOne);

export default router;
