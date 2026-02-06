import { Router } from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM venues WHERE user_id = $1';
    const params = [req.user.id];

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR city ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, city, lat, lng, source } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const venueId = uuidv4();
    const result = await pool.query(
      'INSERT INTO venues (id, user_id, name, city, lat, lng, source) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [venueId, req.user.id, name, city || null, lat || null, lng || null, source || 'manual']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
