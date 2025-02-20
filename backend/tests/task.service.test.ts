import { mockRepository } from "../__mocks__/typeorm";
import {
  getOne,
  getMany,
  create,
  updateOne,
  deleteOne,
} from "../src/services/task.service";

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should return a task by id", async () => {
    const mockTask = { id: 1, title: "Task 01" };
    mockRepository.findOne.mockResolvedValue(mockTask);

    const result = await getOne(1);

    expect(result).toEqual(mockTask);
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it("should return a many tasks", async () => {
    const mockTasks = [
      { id: 1, title: "Task 01" },
      { id: 2, title: "Task 02" },
    ];
    mockRepository.find.mockResolvedValue(mockTasks);

    const result = await getMany();

    expect(result).toEqual(mockTasks);
    expect(mockRepository.find).toHaveBeenCalledTimes(1);
  });

  it("should create a task", async () => {
    const newTask = {
      title: "First Title",
      description: "adasd",
    };

    await create(newTask);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(newTask);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it("should update a task", async () => {
    const updatedTask = {
      title: "First Title",
      description: "adasd",
    };

    await updateOne(1, updatedTask);

    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(1, updatedTask);
  });

  it("should delete a task", async () => {
    await deleteOne(1);

    expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
    expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
  });
});
