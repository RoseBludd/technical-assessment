import { Request, Response } from 'express';
import { TaskModel } from '../models/task.model';
import { TaskStatus } from '../types/database';

export class TaskController {
  private taskModel: TaskModel;

  constructor() {
    this.taskModel = new TaskModel();
  }

  createTask = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const task = await this.taskModel.create({
        ...req.body,
        created_by: req.user.id,
        status: req.body.status || TaskStatus.TODO
      });

      res.status(201).json({ task });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getTask = async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

      const task = await this.taskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ task });
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getTasks = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const filters = {
        status: req.query.status as TaskStatus | undefined,
        created_by: req.query.created_by ? parseInt(req.query.created_by as string) : undefined,
        assigned_to: req.query.assigned_to ? parseInt(req.query.assigned_to as string) : undefined
      };

      const tasks = await this.taskModel.findAll(filters);
      res.json({ tasks });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  updateTask = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

      const task = await this.taskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (task.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this task' });
      }

      const updatedTask = await this.taskModel.update(taskId, req.body);
      if (!updatedTask) {
        return res.status(400).json({ error: 'No valid updates provided' });
      }

      res.json({ task: updatedTask });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

      const task = await this.taskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (task.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this task' });
      }

      const deleted = await this.taskModel.delete(taskId);
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 