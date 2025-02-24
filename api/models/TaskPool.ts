import { Task } from "./Task";
import { readFileSync } from "fs";
import { join } from "path";

export class TaskPool {
  private tasks: Map<string, Task>;
  private tasksByDepartment: Map<string, Task[]>;

  constructor() {
    this.tasks = new Map();
    this.tasksByDepartment = new Map();
    this.loadTaskPool();
  }

  private loadTaskPool(): void {
    try {
      const taskPoolPath = join(process.cwd(), "task-pool.json");
      const taskPoolData = JSON.parse(readFileSync(taskPoolPath, "utf-8"));

      // Process each department's tasks
      Object.entries(taskPoolData.departments).forEach(
        ([department, departmentData]: [string, any]) => {
          const departmentTasks: Task[] = [];

          // Process trial tasks
          if (departmentData.trial_tasks) {
            departmentData.trial_tasks.forEach((task: any) => {
              const taskObj = this.createTaskObject(task, department);
              this.tasks.set(taskObj.id, taskObj);
              departmentTasks.push(taskObj);
            });
          }

          // Process advanced tasks
          if (departmentData.advanced_tasks) {
            departmentData.advanced_tasks.forEach((task: any) => {
              const taskObj = this.createTaskObject(task, department);
              this.tasks.set(taskObj.id, taskObj);
              departmentTasks.push(taskObj);
            });
          }

          // Process full tasks
          if (departmentData.full_tasks) {
            departmentData.full_tasks.forEach((task: any) => {
              const taskObj = this.createTaskObject(task, department);
              this.tasks.set(taskObj.id, taskObj);
              departmentTasks.push(taskObj);
            });
          }

          // Process integration tasks
          if (departmentData.integration_tasks) {
            departmentData.integration_tasks.forEach((task: any) => {
              const taskObj = this.createTaskObject(task, department);
              this.tasks.set(taskObj.id, taskObj);
              departmentTasks.push(taskObj);
            });
          }

          this.tasksByDepartment.set(department, departmentTasks);
        }
      );
    } catch (error) {
      console.error("Failed to load task pool:", error);
      throw new Error("Failed to initialize task pool");
    }
  }

  private createTaskObject(taskData: any, department: string): Task {
    return {
      id: taskData.id,
      title: taskData.title,
      category: taskData.category,
      complexity: taskData.complexity,
      compensation: taskData.compensation,
      description: taskData.description,
      requirements: taskData.requirements,
      acceptance_criteria: taskData.acceptance_criteria,
      parent_task: taskData.parent_task,
      subtasks: taskData.subtasks,
      department,
    };
  }

  public async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  public async getTasksByDepartment(department: string): Promise<Task[]> {
    const tasks = this.tasksByDepartment.get(department);
    if (!tasks) {
      throw new Error(`Department not found: ${department}`);
    }
    return tasks;
  }

  public async getTaskById(taskId: string): Promise<Task | null> {
    return this.tasks.get(taskId) || null;
  }

  public async updateTaskStatus(taskId: string, status: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    // Update task status logic here
    // This would typically involve persisting the status change
  }

  public async getAvailableTasks(
    department: string,
    complexity: string
  ): Promise<Task[]> {
    const tasks = this.tasksByDepartment.get(department);
    if (!tasks) {
      throw new Error(`Department not found: ${department}`);
    }
    return tasks.filter((task) => task.complexity === complexity);
  }

  public async getDependentTasks(taskId: string): Promise<Task[]> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const dependentTasks: Task[] = [];
    if (task.subtasks) {
      for (const subtaskId of task.subtasks) {
        const subtask = this.tasks.get(subtaskId);
        if (subtask) {
          dependentTasks.push(subtask);
        }
      }
    }
    return dependentTasks;
  }

  public async getParentTask(taskId: string): Promise<Task | null> {
    const task = this.tasks.get(taskId);
    if (!task || !task.parent_task) {
      return null;
    }
    return this.tasks.get(task.parent_task) || null;
  }
}
