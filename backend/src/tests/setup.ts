import dotenv from 'dotenv';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { stopCleanupInterval } from '../middleware/rate-limit.middleware';

// Load test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '1h';

// Database configuration for tests
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'taskdb_test';
process.env.DB_USER = 'developer';
process.env.DB_PASSWORD = 'localdev';

// Initialize environment variables
dotenv.config();

// Create database pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Function to run migrations
async function runMigrations() {
  const client = await pool.connect();
  
  try {
    // Drop existing tables if they exist
    await client.query(`
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS migrations CASCADE;
    `);

    // Read and execute the migration file
    const migrationPath = path.join(__dirname, '../database/migrations/001_initial_schema.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Run migration
    await client.query(migrationSql);
    console.log('Test database migrations completed successfully');
  } catch (error) {
    console.error('Error running test migrations:', error);
    throw error;
  } finally {
    client.release();
  }
}

