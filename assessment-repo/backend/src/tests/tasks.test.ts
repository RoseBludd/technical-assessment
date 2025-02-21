import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Tasks Endpoints', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    // Clean up before each test
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and get auth token
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User'
      }
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'TODO',
          userId: testUser.id
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Test Task');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'TODO',
          userId: testUser.id
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await prisma.task.create({
        data: {
          title: 'Task 1',
          description: 'Description 1',
          status: 'TODO',
          userId: testUser.id
        }
      });
      
      await prisma.task.create({
        data: {
          title: 'Task 2',
          description: 'Description 2',
          status: 'IN_PROGRESS',
          userId: testUser.id
        }
      });
    });

    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .get('/api/tasks');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let testTask: any;

    beforeEach(async () => {
      testTask = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          status: 'TODO',
          userId: testUser.id
        }
      });
    });

    it('should get a task by id', async () => {
      const res = await request(app)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Test Task');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .get(`/api/tasks/${testTask.id}`);

      expect(res.status).toBe(401);
    });
  });

  afterEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });
}); 