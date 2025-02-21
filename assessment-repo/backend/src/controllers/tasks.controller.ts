import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export class TasksController {
  async create(req: Request, res: Response) {
    try {
      const { title, description, status, dueDate, userId } = req.body;

      const task = await prisma.task.create({
        data: {
          title,
          description,
          status,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          userId
        },
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error creating task' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
      });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const task = await prisma.task.findFirst({
        where: { id : parseInt(id) },
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching task' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, status, dueDate } = req.body;

      const task = await prisma.task.findFirst({
        where: { id: parseInt(id) },
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          status,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
      });

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Error updating task' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const task = await prisma.task.findFirst({
        where: { id: parseInt(id)  },
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await prisma.task.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting task' });
    }
  }
}