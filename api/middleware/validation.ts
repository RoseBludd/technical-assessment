import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validation Schemas
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum([
    "NEW_FEATURE",
    "BUG_FIX",
    "INTEGRATION",
    "AUTOMATION",
    "OPTIMIZATION",
  ]),
  complexity: z.enum(["low", "medium", "high"]),
  compensation: z.number().positive(),
  description: z.string(),
  requirements: z.array(z.string()),
  acceptance_criteria: z.array(z.string()),
  parent_task: z.string().optional(),
  subtasks: z.array(z.string()).optional(),
  department: z.string(),
});

const AssignmentSchema = z.object({
  taskId: z.string(),
  candidateId: z.string(),
  status: z.enum([
    "assigned",
    "in_progress",
    "completed",
    "failed",
    "cancelled",
  ]),
  startDate: z.date(),
  dueDate: z.date(),
  completedDate: z.date().optional(),
  evaluation: z
    .object({
      speed: z.number().min(0).max(5),
      accuracy: z.number().min(0).max(5),
      communication: z.number().min(0).max(5),
      problem_solving: z.number().min(0).max(5),
      code_quality: z.number().min(0).max(5),
      independence: z.number().min(0).max(5),
      alignment: z.number().min(0).max(5),
      efficiency: z.number().min(0).max(5),
      initiative: z.number().min(0).max(5),
      collaboration: z.number().min(0).max(5),
      comments: z.string(),
      overall_score: z.number().min(0).max(5),
    })
    .optional(),
  payment: z
    .object({
      status: z.enum(["pending", "processing", "completed", "failed"]),
      amount: z.number().positive(),
      processedDate: z.date().optional(),
      transactionId: z.string().optional(),
    })
    .optional(),
});

const ProgressSchema = z.object({
  status: z.enum(["in_progress", "completed", "failed"]),
  completedDate: z.date().optional(),
  notes: z.string().optional(),
});

// Middleware Functions
export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    TaskSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Invalid task data",
        details: error.errors,
      });
    } else {
      res.status(500).json({ error: "Validation error" });
    }
  }
};

export const validateAssignment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { taskId, candidateId } = req.body;
  if (!taskId || !candidateId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
};

export const validateProgress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  if (!status || !["in_progress", "completed", "failed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  next();
};
