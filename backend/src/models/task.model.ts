import { Pool } from 'pg';
import { Task, TaskStatus } from '../types/database';
import pool from '../config/database';

export class TaskModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { rows } = await this.pool.query(
      `INSERT INTO tasks (title, description, status, due_date, created_by, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6)
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

    return rows[0];
  }

  async findById(id: number): Promise<Task | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );

    return rows[0] || null;
  }

  async findAll(filters: {
    status?: TaskStatus;
    created_by?: number;
    assigned_to?: number;
  } = {}): Promise<Task[]> {
    let query = 'SELECT * FROM tasks';
    const values: any[] = [];
    const conditions: string[] = [];

    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    if (filters.created_by) {
      values.push(filters.created_by);
      conditions.push(`created_by = $${values.length}`);
    }

    if (filters.assigned_to) {
      values.push(filters.assigned_to);
      conditions.push(`assigned_to = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const { rows } = await this.pool.query(query, values);
    return rows;
  }

  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    const allowedUpdates = ['title', 'description', 'status', 'due_date', 'assigned_to'];
    const updates = Object.entries(data)
      .filter(([key]) => allowedUpdates.includes(key))
      .map(([key, value]) => ({ key, value }));

    if (updates.length === 0) return null;

    const setClause = updates
      .map((update, index) => `${update.key} = $${index + 2}`)
      .join(', ');
    const values = updates.map(update => update.value);

    const { rows } = await this.pool.query(
      `UPDATE tasks 
       SET ${setClause}
       WHERE id = $1
       RETURNING *`,
      [id, ...values]
    );

    return rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM tasks WHERE id = $1',
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }
} 