import { Router } from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/auth.js';
import { validatePerson } from '../middleware/validate.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM people WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load people' });
  }
});

router.post('/', validatePerson, async (req, res) => {
  try {
    const { nickname, emoji } = req.body;

    const personId = uuidv4();
    const result = await pool.query(
      'INSERT INTO people (id, user_id, nickname, emoji) VALUES ($1, $2, $3, $4) RETURNING *',
      [personId, req.user.id, nickname.trim(), emoji || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create person' });
  }
});

router.put('/:id', validatePerson, async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, emoji } = req.body;

    const result = await pool.query(
      'UPDATE people SET nickname = $1, emoji = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [nickname.trim(), emoji || null, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Person not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update person' });
  }
});

export default router;
