import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// DigitalOcean managed databases use self-signed certificates
// This ensures the connection works with sslmode=require
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;
