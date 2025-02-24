import mongoose, { Schema, Document } from "mongoose";
import { Task, TaskAssignment, IntegrationStatus } from "../models/Task";

// Schemas
const TaskSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  complexity: { type: String, required: true },
  compensation: { type: Number, required: true },
  description: { type: String, required: true },
  requirements: [String],
  acceptance_criteria: [String],
  parent_task: String,
  subtasks: [String],
  department: { type: String, required: true },
});

const TaskAssignmentSchema = new Schema({
  taskId: { type: String, required: true },
  candidateId: { type: String, required: true },
  status: { type: String, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  completedDate: Date,
  evaluation: {
    speed: Number,
    accuracy: Number,
    communication: Number,
    problem_solving: Number,
    code_quality: Number,
    independence: Number,
    alignment: Number,
    efficiency: Number,
    initiative: Number,
    collaboration: Number,
    comments: String,
    overall_score: Number,
  },
  payment: {
    status: String,
    amount: Number,
    processedDate: Date,
    transactionId: String,
  },
});

const IntegrationStatusSchema = new Schema({
  departmentId: { type: String, required: true },
  integrationId: { type: String, required: true },
  status: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
  details: {
    connected: Boolean,
    syncStatus: String,
    lastSync: Date,
    errors: [String],
  },
});

// Models
const TaskModel = mongoose.model<Task & Document>("Task", TaskSchema);
const TaskAssignmentModel = mongoose.model<TaskAssignment & Document>(
  "TaskAssignment",
  TaskAssignmentSchema
);
const IntegrationStatusModel = mongoose.model<IntegrationStatus & Document>(
  "IntegrationStatus",
  IntegrationStatusSchema
);

export class DatabaseService {
  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      const mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/dev-portal";
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("Failed to connect to database");
    }
  }

  // Task Methods
  public async createTask(task: Task): Promise<Task> {
    try {
      const newTask = new TaskModel(task);
      return await newTask.save();
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  public async getTask(taskId: string): Promise<Task | null> {
    try {
      return await TaskModel.findOne({ id: taskId });
    } catch (error) {
      throw new Error(`Failed to fetch task: ${error.message}`);
    }
  }

  public async updateTask(
    taskId: string,
    updates: Partial<Task>
  ): Promise<Task | null> {
    try {
      return await TaskModel.findOneAndUpdate({ id: taskId }, updates, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  // Assignment Methods
  public async createAssignment(
    assignment: Partial<TaskAssignment>
  ): Promise<TaskAssignment> {
    try {
      const newAssignment = new TaskAssignmentModel(assignment);
      return await newAssignment.save();
    } catch (error) {
      throw new Error(`Failed to create assignment: ${error.message}`);
    }
  }

  public async getAssignment(
    assignmentId: string
  ): Promise<TaskAssignment | null> {
    try {
      return await TaskAssignmentModel.findById(assignmentId);
    } catch (error) {
      throw new Error(`Failed to fetch assignment: ${error.message}`);
    }
  }

  public async updateAssignment(
    assignmentId: string,
    updates: Partial<TaskAssignment>
  ): Promise<TaskAssignment | null> {
    try {
      return await TaskAssignmentModel.findByIdAndUpdate(
        assignmentId,
        updates,
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to update assignment: ${error.message}`);
    }
  }

  public async deleteAssignment(assignmentId: string): Promise<void> {
    try {
      await TaskAssignmentModel.findByIdAndDelete(assignmentId);
    } catch (error) {
      throw new Error(`Failed to delete assignment: ${error.message}`);
    }
  }

  // Integration Methods
  public async getIntegrationStatus(
    departmentId: string
  ): Promise<IntegrationStatus | null> {
    try {
      return await IntegrationStatusModel.findOne({ departmentId });
    } catch (error) {
      throw new Error(`Failed to fetch integration status: ${error.message}`);
    }
  }

  public async updateIntegrationStatus(
    integrationId: string,
    updates: Partial<IntegrationStatus>
  ): Promise<IntegrationStatus | null> {
    try {
      return await IntegrationStatusModel.findOneAndUpdate(
        { integrationId },
        { ...updates, lastUpdated: new Date() },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to update integration status: ${error.message}`);
    }
  }

  // Candidate Progress Methods
  public async getCandidateProgress(candidateId: string): Promise<any> {
    try {
      const assignments = await TaskAssignmentModel.find({ candidateId });
      return {
        completedTasks: assignments.filter((a) => a.status === "completed"),
        evaluations: assignments.map((a) => a.evaluation).filter(Boolean),
      };
    } catch (error) {
      throw new Error(`Failed to fetch candidate progress: ${error.message}`);
    }
  }
}
