// Database connection setup
// This file initializes and exports the PostgreSQL connection pool
// The pool manages multiple database connections efficiently

// server/db.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('✅ Connected to Neon PostgreSQL');
  }
});

export default pool;