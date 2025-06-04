import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Log the connection string (without password) for debugging
const connectionString = process.env.DATABASE_URL;
console.log('Attempting to connect to:', connectionString?.replace(/:[^:@]+@/, ':****@'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  keepAlive: true,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 1
});

async function testConnection() {
  let client;
  try {
    console.log('Attempting to connect...');
    client = await pool.connect();
    console.log('Successfully connected to the database!');
    
    console.log('Testing query...');
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
    
    console.log('Connection test completed successfully!');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    if (err instanceof Error) {
      console.error('Error details:', {
        message: err.message,
        code: (err as any).code,
        stack: err.stack
      });
    }
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

testConnection(); 