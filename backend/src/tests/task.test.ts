import request from 'supertest';
import app from '../index';
import pool from '../config/database';
import { TaskStatus } from '../types/database';

describe('Task Endpoints', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    // Clear tables
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');

    // Create a test user
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'taskuser',
        email: 'taskuser@example.com',
        password: 'password123'
      });

    authToken = res.body.token;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.TODO
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('task');
      expect(res.body.task.title).toBe('Test Task');
      expect(res.body.task.created_by).toBe(userId);
    });

    it('should not create task without authentication', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('tasks');
      expect(Array.isArray(res.body.tasks)).toBe(true);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .query({ status: TaskStatus.TODO })
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks.every((task: any) => task.status === TaskStatus.TODO)).toBe(true);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    let taskId: number;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task to Update',
          description: 'Description to Update'
        });

      taskId = res.body.task.id;
    });

    it('should update a task', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          status: TaskStatus.IN_PROGRESS
        });

      expect(res.status).toBe(200);
      expect(res.body.task.title).toBe('Updated Task');
      expect(res.body.task.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should not update task created by another user', async () => {
      // Create another user
      const anotherUser = await request(app)
        .post('/api/users/register')
        .send({
          username: 'another',
          email: 'another@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherUser.body.token}`)
        .send({
          title: 'Unauthorized Update'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: number;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task to Delete',
          description: 'Description to Delete'
        });

      taskId = res.body.task.id;
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(204);

      // Verify task is deleted
      const getRes = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });
  });
}); 