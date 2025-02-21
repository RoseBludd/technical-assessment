import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

export class UsersController {
  // Create a new user
  async create(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          // Exclude password from response
        },
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  }

  // Get all users
  async findAll(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          // Exclude password
        },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  }

  // Get user by ID
  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          // Exclude password
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  }

  // Update user
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, name, password } = req.body;

      // Prepare update data
      const updateData: any = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          // Exclude password
        },
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  }

  // Delete user
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id: Number(id) },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  }
} 