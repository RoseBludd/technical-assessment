import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Users Endpoints', () => {
  let authToken: string;

  beforeEach(async () => {
    // Clean up before each test
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    // Create initial user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User'
      }
    });

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('email', 'newuser@example.com');
      expect(res.body).toHaveProperty('name', 'New User');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should fail with duplicate email', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'test@example.com',  // Using existing email
          password: 'password123',
          name: 'Duplicate User'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });
});