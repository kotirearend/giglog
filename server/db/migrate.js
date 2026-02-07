import pool from './pool.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, 'migrations');

export async function runMigrations() {
  try {
    // Log connection info for debugging
    const whoami = await pool.query('SELECT current_user, current_database()');
    console.log('Connected as:', whoami.rows[0].current_user, 'to database:', whoami.rows[0].current_database);

    // Try to grant schema permissions (will succeed if we're a superuser, silently fail otherwise)
    try {
      await pool.query('GRANT ALL ON SCHEMA public TO current_user');
    } catch (e) {
      console.log('Grant attempt:', e.message);
    }

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
  } catch (err) {
    console.error('Migration error:', err);
    throw err;
  }
}

// Allow running directly: node db/migrate.js
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  runMigrations().then(() => {
    pool.end();
    process.exit(0);
  }).catch(() => {
    pool.end();
    process.exit(1);
  });
}
