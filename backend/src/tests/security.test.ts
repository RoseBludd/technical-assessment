import request from 'supertest';
import app from '../index';
import pool from '../config/database';

describe('Security Tests', () => {
  let validToken: string;
  let userId: number;

  beforeAll(async () => {
    // Create a test user
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'securitytest',
        email: 'security@test.com',
        password: 'Password123!'
      });

    validToken = res.body.token;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Authentication Security', () => {
    it('should reject invalid JWT tokens', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.status).toBe(401);
    });

    it('should reject expired tokens', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJ1c2VySWQiOjEsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.' +
        'C69yqZHkex0WRalP6PqR6ZyLRAyJHKwVpP-aFhGtW5s';

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
    });

    it('should require authentication for protected routes', async () => {
      const routes = [
        { path: '/api/tasks', method: 'get' as const },
        { path: '/api/tasks', method: 'post' as const },
        { path: '/api/users/profile', method: 'get' as const }
      ];

      for (const route of routes) {
        const res = await request(app)[route.method](route.path);
        expect(res.status).toBe(401);
      }
    });
  });

  describe('Authorization Security', () => {
    let taskId: number;

    beforeAll(async () => {
      // Create a task for testing
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Security Test Task',
          description: 'Test task for security testing'
        });

      taskId = res.body.task.id;
    });

    it('should prevent unauthorized task updates', async () => {
      // Create another user
      const otherUser = await request(app)
        .post('/api/users/register')
        .send({
          username: 'otheruser',
          email: 'other@test.com',
          password: 'Password123!'
        });

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${otherUser.body.token}`)
        .send({
          title: 'Unauthorized Update'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('Input Validation Security', () => {
    it('should prevent SQL injection in task queries', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ 
          status: "TODO' OR '1'='1"  // SQL injection attempt
        });

      expect(res.status).toBe(400);
    });

    it('should sanitize user input in task creation', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: '<script>alert("xss")</script>',
          description: 'Test description'
        });

      expect(res.status).toBe(201);
      expect(res.body.task.title).not.toContain('<script>');
    });

    it('should validate password strength on registration', async () => {
      const weakPasswords = ['123456', 'password', 'abc', ''];
      
      for (const password of weakPasswords) {
        const res = await request(app)
          .post('/api/users/register')
          .send({
            username: 'testuser',
            email: 'test@example.com',
            password
          });

        expect(res.status).toBe(400);
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = Array(150).fill(null);  // More than default limit
      const responses = await Promise.all(
        requests.map(() => 
          request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${validToken}`)
        )
      );

      const tooManyRequests = responses.filter(res => res.status === 429);
      expect(tooManyRequests.length).toBeGreaterThan(0);
    });
  });
}); 