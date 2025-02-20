import { Pool } from 'pg';
import { User } from '../types/database';
import pool from '../config/database';

// Import argon2 with type declaration
import argon2 from 'argon2';

export class UserModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async create(username: string, email: string, password: string): Promise<Omit<User, 'password'>> {
    const hashedPassword = await argon2.hash(password);
    
    const { rows } = await this.pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at, updated_at`,
      [username, email, hashedPassword]
    );

    return rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return rows[0] || null;
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const { rows } = await this.pool.query(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    return rows[0] || null;
  }

  async update(id: number, data: Partial<User>): Promise<Omit<User, 'password'> | null> {
    const allowedUpdates = ['username', 'email'];
    const updates = Object.entries(data)
      .filter(([key]) => allowedUpdates.includes(key))
      .map(([key, value]) => ({ key, value }));

    if (updates.length === 0) return null;

    const setClause = updates
      .map((update, index) => `${update.key} = $${index + 2}`)
      .join(', ');
    const values = updates.map(update => update.value);

    const { rows } = await this.pool.query(
      `UPDATE users 
       SET ${setClause}
       WHERE id = $1
       RETURNING id, username, email, created_at, updated_at`,
      [id, ...values]
    );

    return rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    try {
      return await argon2.verify(user.password, password);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }
} 