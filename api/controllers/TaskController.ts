import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { AssessmentService } from "../services/AssessmentService";
import { PaymentService } from "../services/PaymentService";

export class TaskController {
  private taskService: TaskService;
  private assessmentService: AssessmentService;
  private paymentService: PaymentService;

  constructor() {
    this.taskService = new TaskService();
    this.assessmentService = new AssessmentService();
    this.paymentService = new PaymentService();
  }

  // Task Pool Methods
  public getTaskPool = async (req: Request, res: Response) => {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task pool" });
    }
  };

  public getDepartmentTasks = async (req: Request, res: Response) => {
    try {
      const { department } = req.params;
      const tasks = await this.taskService.getTasksByDepartment(department);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch department tasks" });
    }
  };

  public getTaskDetails = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await this.taskService.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task details" });
    }
  };

  // Assignment Methods
  public assignTask = async (req: Request, res: Response) => {
    try {
      const { taskId, candidateId } = req.body;
      const assignment = await this.taskService.assignTask(taskId, candidateId);
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to assign task" });
    }
  };

  public updateAssignment = async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const updates = req.body;
      const updated = await this.taskService.updateAssignment(
        assignmentId,
        updates
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update assignment" });
    }
  };

  public removeAssignment = async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      await this.taskService.removeAssignment(assignmentId);
      res.json({ message: "Assignment removed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove assignment" });
    }
  };

  // Progress Methods
  public updateProgress = async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const progress = req.body;
      const updated = await this.assessmentService.updateProgress(
        assignmentId,
        progress
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  };

  public getProgress = async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const progress = await this.assessmentService.getProgress(assignmentId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  };

  public getCandidateProgress = async (req: Request, res: Response) => {
    try {
      const { candidateId } = req.params;
      const progress = await this.assessmentService.getCandidateProgress(
        candidateId
      );
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch candidate progress" });
    }
  };

  // Evaluation Methods
  public submitEvaluation = async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const evaluation = req.body;
      const result = await this.assessmentService.submitEvaluation(
        assignmentId,
        evaluation
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit evaluation" });
    }
  };

  public getEvaluation = async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const evaluation = await this.assessmentService.getEvaluation(
        assignmentId
      );
      res.json(evaluation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch evaluation" });
    }
  };

  // Payment Methods
  public processPayment = async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const payment = await this.paymentService.processPayment(assignmentId);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to process payment" });
    }
  };

  public getPaymentStatus = async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const status = await this.paymentService.getPaymentStatus(assignmentId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment status" });
    }
  };

  // Integration Methods
  public getIntegrationStatus = async (req: Request, res: Response) => {
    try {
      const { departmentId } = req.params;
      const status = await this.taskService.getIntegrationStatus(departmentId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch integration status" });
    }
  };

  public updateIntegrationStatus = async (req: Request, res: Response) => {
    try {
      const { integrationId } = req.params;
      const updates = req.body;
      const status = await this.taskService.updateIntegrationStatus(
        integrationId,
        updates
      );
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to update integration status" });
    }
  };
}
