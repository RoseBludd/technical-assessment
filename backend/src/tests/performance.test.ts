import autocannon, { Instance, Result } from 'autocannon';
import { Server } from 'http';
import app from '../index';
import { Pool } from 'pg';
import pool from '../config/database';

interface AuthResponse {
  token: string;
}

describe('Performance Tests', () => {
  let server: Server;
  let authToken: string;

  beforeAll(async () => {
    // Start server
    server = app.listen(3002);

    // Create test user and get token
    const response = await fetch('http://localhost:3002/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'perftest',
        email: 'perftest@example.com',
        password: 'password123'
      })
    });

    const data = await response.json() as AuthResponse;
    authToken = data.token;
  });

  afterAll(async () => {
    server.close();
    await pool.end();
  });

  it('should handle high load on GET /tasks endpoint', (done) => {
    const instance: Instance = autocannon({
      url: 'http://localhost:3002/api/tasks',
      connections: 10,
      pipelining: 1,
      duration: 10,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }, (err, result) => {
      if (err) throw err;
      // Assertions for performance metrics
      expect(result.errors).toBe(0);
      expect(result.timeouts).toBe(0);
      expect(result.latency.p99).toBeLessThan(1000); // 99th percentile latency < 1s
      expect(result.requests.average).toBeGreaterThan(50); // Average > 50 req/sec
      done();
    });

    autocannon.track(instance);
  });

  it('should handle concurrent task creation', (done) => {
    const instance: Instance = autocannon({
      url: 'http://localhost:3002/api/tasks',
      connections: 5,
      pipelining: 1,
      duration: 10,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        title: 'Performance Test Task',
        description: 'Testing concurrent task creation',
        status: 'TODO'
      })
    }, (err, result) => {
      if (err) throw err;
      expect(result.errors).toBe(0);
      expect(result.timeouts).toBe(0);
      expect(result.latency.p99).toBeLessThan(500); // 99th percentile latency < 500ms
      expect(result.requests.average).toBeGreaterThan(20); // Average > 20 req/sec
      done();
    });

    autocannon.track(instance);
  });
}); 