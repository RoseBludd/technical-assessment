import { Task, TaskAssignment, IntegrationStatus } from "../models/Task";
import { TaskPool } from "../models/TaskPool";
import { DatabaseService } from "./DatabaseService";

export class TaskService {
  private db: DatabaseService;
  private taskPool: TaskPool;

  constructor() {
    this.db = new DatabaseService();
    this.taskPool = new TaskPool();
  }

  // Task Pool Methods
  public async getAllTasks(): Promise<Task[]> {
    try {
      return await this.taskPool.getAllTasks();
    } catch (error) {
      throw new Error("Failed to fetch tasks");
    }
  }

  public async getTasksByDepartment(department: string): Promise<Task[]> {
    try {
      return await this.taskPool.getTasksByDepartment(department);
    } catch (error) {
      throw new Error(`Failed to fetch tasks for department: ${department}`);
    }
  }

  public async getTaskById(taskId: string): Promise<Task | null> {
    try {
      return await this.taskPool.getTaskById(taskId);
    } catch (error) {
      throw new Error(`Failed to fetch task: ${taskId}`);
    }
  }

  // Assignment Methods
  public async assignTask(
    taskId: string,
    candidateId: string
  ): Promise<TaskAssignment> {
    try {
      // Validate task availability
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      // Check candidate eligibility
      const isEligible = await this.validateCandidateEligibility(
        candidateId,
        task
      );
      if (!isEligible) {
        throw new Error("Candidate not eligible for this task");
      }

      // Create assignment
      const assignment = await this.db.createAssignment({
        taskId,
        candidateId,
        status: "assigned",
        startDate: new Date(),
        dueDate: this.calculateDueDate(task.complexity),
      });

      // Update task pool status
      await this.taskPool.updateTaskStatus(taskId, "assigned");

      return assignment;
    } catch (error) {
      throw new Error(`Failed to assign task: ${error.message}`);
    }
  }

  public async updateAssignment(
    assignmentId: string,
    updates: Partial<TaskAssignment>
  ): Promise<TaskAssignment> {
    try {
      return await this.db.updateAssignment(assignmentId, updates);
    } catch (error) {
      throw new Error(`Failed to update assignment: ${error.message}`);
    }
  }

  public async removeAssignment(assignmentId: string): Promise<void> {
    try {
      const assignment = await this.db.getAssignment(assignmentId);
      if (!assignment) {
        throw new Error("Assignment not found");
      }

      await this.db.deleteAssignment(assignmentId);
      await this.taskPool.updateTaskStatus(assignment.taskId, "available");
    } catch (error) {
      throw new Error(`Failed to remove assignment: ${error.message}`);
    }
  }

  // Integration Methods
  public async getIntegrationStatus(
    departmentId: string
  ): Promise<IntegrationStatus> {
    try {
      return await this.db.getIntegrationStatus(departmentId);
    } catch (error) {
      throw new Error(`Failed to fetch integration status: ${error.message}`);
    }
  }

  public async updateIntegrationStatus(
    integrationId: string,
    updates: Partial<IntegrationStatus>
  ): Promise<IntegrationStatus> {
    try {
      return await this.db.updateIntegrationStatus(integrationId, updates);
    } catch (error) {
      throw new Error(`Failed to update integration status: ${error.message}`);
    }
  }

  // Helper Methods
  private async validateCandidateEligibility(
    candidateId: string,
    task: Task
  ): Promise<boolean> {
    try {
      const candidateProgress = await this.db.getCandidateProgress(candidateId);
      const candidateLevel = this.calculateCandidateLevel(candidateProgress);

      // Check if candidate meets task requirements
      return this.meetsTaskRequirements(candidateLevel, task);
    } catch (error) {
      throw new Error(
        `Failed to validate candidate eligibility: ${error.message}`
      );
    }
  }

  private calculateDueDate(complexity: string): Date {
    const dueDate = new Date();
    switch (complexity) {
      case "low":
        dueDate.setDate(dueDate.getDate() + 3);
        break;
      case "medium":
        dueDate.setDate(dueDate.getDate() + 5);
        break;
      case "high":
        dueDate.setDate(dueDate.getDate() + 10);
        break;
      default:
        dueDate.setDate(dueDate.getDate() + 5);
    }
    return dueDate;
  }

  private calculateCandidateLevel(progress: any): string {
    // Implementation based on completed tasks and evaluations
    const { completedTasks, evaluations } = progress;

    if (completedTasks.length >= 10 && this.hasHighEvaluations(evaluations)) {
      return "advanced";
    } else if (completedTasks.length >= 5) {
      return "intermediate";
    }
    return "beginner";
  }

  private meetsTaskRequirements(candidateLevel: string, task: Task): boolean {
    // Implementation based on task complexity and candidate level
    switch (task.complexity) {
      case "high":
        return candidateLevel === "advanced";
      case "medium":
        return ["advanced", "intermediate"].includes(candidateLevel);
      case "low":
        return true;
      default:
        return false;
    }
  }

  private hasHighEvaluations(evaluations: any[]): boolean {
    if (!evaluations.length) return false;

    const averageScore =
      evaluations.reduce((sum, eval) => sum + (eval.score || 0), 0) /
      evaluations.length;

    return averageScore >= 4.0; // Threshold for high evaluations
  }
}
