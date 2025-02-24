import { Router } from "express";
import {
  validateTask,
  validateAssignment,
  validateProgress,
} from "../middleware/validation";
import { isAuthenticated, hasRole } from "../middleware/auth";
import { TaskController } from "../controllers/TaskController";
import express, { Request, Response } from "express";
import { AssessmentService } from "../services/AssessmentService";
import { PaymentService } from "../services/PaymentService";

const router = Router();
const taskController = new TaskController();
const assessmentService = new AssessmentService();
const paymentService = new PaymentService();

// Task Pool Routes
router.get("/pool", isAuthenticated, taskController.getTaskPool);
router.get(
  "/pool/:department",
  isAuthenticated,
  taskController.getDepartmentTasks
);
router.get(
  "/pool/task/:taskId",
  isAuthenticated,
  taskController.getTaskDetails
);

// Task Assignment Routes
router.post(
  "/assign",
  isAuthenticated,
  hasRole(["admin", "manager"]),
  validateAssignment,
  taskController.assignTask
);
router.put(
  "/assignment/:assignmentId",
  isAuthenticated,
  hasRole(["admin", "manager"]),
  validateAssignment,
  taskController.updateAssignment
);
router.delete(
  "/assignment/:assignmentId",
  isAuthenticated,
  hasRole(["admin", "manager"]),
  taskController.removeAssignment
);

// Progress Tracking Routes
router.post(
  "/progress",
  isAuthenticated,
  validateProgress,
  taskController.updateProgress
);
router.get(
  "/progress/:assignmentId",
  isAuthenticated,
  taskController.getProgress
);
router.get(
  "/progress/candidate/:candidateId",
  isAuthenticated,
  taskController.getCandidateProgress
);

// Evaluation Routes
router.post(
  "/evaluate/:assignmentId",
  isAuthenticated,
  hasRole(["admin", "manager"]),
  taskController.submitEvaluation
);
router.get(
  "/evaluation/:assignmentId",
  isAuthenticated,
  taskController.getEvaluation
);

// Payment Processing Routes
router.post(
  "/payment/process/:assignmentId",
  isAuthenticated,
  hasRole(["admin", "finance"]),
  taskController.processPayment
);
router.get(
  "/payment/status/:assignmentId",
  isAuthenticated,
  taskController.getPaymentStatus
);

// Integration Status Routes
router.get(
  "/integration/status/:departmentId",
  isAuthenticated,
  taskController.getIntegrationStatus
);
router.post(
  "/integration/update/:integrationId",
  isAuthenticated,
  hasRole(["admin", "manager"]),
  taskController.updateIntegrationStatus
);

// Get task progress
router.get("/:assignmentId/progress", async (req: Request, res: Response) => {
  try {
    const progress = await assessmentService.getProgress(
      req.params.assignmentId
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to get progress" });
  }
});

// Update task progress
router.post(
  "/:assignmentId/progress",
  validateProgress,
  async (req: Request, res: Response) => {
    try {
      const progress = await assessmentService.updateProgress(
        req.params.assignmentId,
        req.body
      );
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  }
);

// Submit task evaluation
router.post(
  "/:assignmentId/evaluation",
  async (req: Request, res: Response) => {
    try {
      const evaluation = await assessmentService.submitEvaluation(
        req.params.assignmentId,
        req.body
      );
      res.json(evaluation);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit evaluation" });
    }
  }
);

// Process payment for completed task
router.post("/:assignmentId/payment", async (req: Request, res: Response) => {
  try {
    const payment = await paymentService.processPayment(
      req.params.assignmentId
    );
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Failed to process payment" });
  }
});

export default router;
