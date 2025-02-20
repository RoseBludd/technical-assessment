import { Pool } from 'pg';
import { Task, TaskStatus } from '../types/database';
import pool from '../config/database';

export class TaskService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async assignTasksToUser(userId: number, taskIds: number[]): Promise<Task[]> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Verify user exists
      const userResult = await client.query(
        'SELECT id FROM users WHERE id = $1',
        [userId]
      );
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      // Update tasks in transaction
      const updatedTasks: Task[] = [];
      for (const taskId of taskIds) {
        const result = await client.query(
          `UPDATE tasks 
           SET assigned_to = $1, 
               status = CASE 
                 WHEN status = 'TODO' THEN 'IN_PROGRESS'::text 
                 ELSE status 
               END,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $2
           RETURNING *`,
          [userId, taskId]
        );
        
        if (result.rows[0]) {
          updatedTasks.push(result.rows[0]);
        }
      }

      await client.query('COMMIT');
      return updatedTasks;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async bulkCreateTasks(tasks: Omit<Task, 'id' | 'created_at' | 'updated_at'>[]): Promise<Task[]> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const createdTasks: Task[] = [];
      for (const task of tasks) {
        const result = await client.query(
          `INSERT INTO tasks (
            title, description, status, due_date, created_by, assigned_to
           ) VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            task.title,
            task.description,
            task.status || TaskStatus.TODO,
            task.due_date,
            task.created_by,
            task.assigned_to
          ]
        );
        createdTasks.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return createdTasks;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async reassignUserTasks(fromUserId: number, toUserId: number): Promise<Task[]> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Verify both users exist
      const usersResult = await client.query(
        'SELECT id FROM users WHERE id IN ($1, $2)',
        [fromUserId, toUserId]
      );
      if (usersResult.rows.length !== 2) {
        throw new Error('One or both users not found');
      }

      // Reassign tasks
      const result = await client.query(
        `UPDATE tasks 
         SET assigned_to = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE assigned_to = $2
         RETURNING *`,
        [toUserId, fromUserId]
      );

      await client.query('COMMIT');
      return result.rows;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
} 