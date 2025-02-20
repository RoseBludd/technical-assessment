const { Pool } = require('pg');
const path = require('path');

async function waitForDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  while (true) {
    try {
      console.log('Waiting for database...');
      await pool.query('SELECT 1');
      console.log('Database is ready!');
      await pool.end();
      break;
    } catch (error) {
      console.log('Database not ready, retrying in 1 second...', error.message);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function runMigrations() {
  try {
    console.log('Running migrations...');
    // Import and run migrations
    const migrationsPath = path.resolve(__dirname, '../dist/database/migrations/index.js');
    const migrationsModule = require(migrationsPath);
    
    // Get the migration function
    const migrationFn = migrationsModule.default || migrationsModule;
    
    if (typeof migrationFn !== 'function') {
      throw new Error('Migration module does not export a function');
    }
    
    await migrationFn();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

async function startApp() {
  try {
    console.log('Starting application...');
    // Just require the app, it will start automatically
    require('../dist/index');
  } catch (error) {
    console.error('Application start failed:', error);
    throw error;
  }
}

async function start() {
  try {
    await waitForDatabase();
    await runMigrations();
    await startApp();
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
}

start(); 