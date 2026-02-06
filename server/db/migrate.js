import pool from './pool.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, 'migrations');

async function runMigrations() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      const result = await pool.query('SELECT * FROM _migrations WHERE name = $1', [file]);
      
      if (result.rows.length === 0) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`Running migration: ${file}`);
        await pool.query(sql);
        await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        console.log(`Completed: ${file}`);
      } else {
        console.log(`Skipped (already run): ${file}`);
      }
    }

    console.log('All migrations completed successfully');
    await pool.end();
  } catch (err) {
    console.error('Migration error:', err);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
