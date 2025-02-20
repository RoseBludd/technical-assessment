import { AppDataSource } from "../../ormconfig";
import { Task } from "../models/task.entity";

const taskRepo = AppDataSource.getRepository(Task);

async function TaskSeed() {
  //note: data reset
  await taskRepo.delete({});
}

export default TaskSeed;
