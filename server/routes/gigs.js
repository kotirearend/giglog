import { Router } from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/auth.js';
import { validateGig } from '../middleware/validate.js';
import { v4 as uuidv4 } from 'uuid';
import { deriveGigDate } from '../utils/nightDate.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const { year, artist, venue_id, search } = req.query;
    let query = 'SELECT * FROM gigs WHERE user_id = $1';
    const params = [req.user.id];

    if (year) {
      const yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
        return res.status(400).json({ error: 'Invalid year' });
      }
      query += ` AND EXTRACT(YEAR FROM gig_date) = $${params.length + 1}`;
      params.push(yearNum);
    }

    if (artist) {
      query += ` AND artist_text ILIKE $${params.length + 1}`;
      params.push(`%${artist}%`);
    }

    if (venue_id) {
      query += ` AND venue_id = $${params.length + 1}`;
      params.push(venue_id);
    }

    if (search) {
      const searchParam = params.length + 1;
      query += ` AND (artist_text ILIKE $${searchParam} OR venue_name_snapshot ILIKE $${searchParam})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY gig_date DESC';

    const result = await pool.query(query, params);
    res.json({ gigs: result.rows });
  } catch (err) {
    console.error('Gigs route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', validateGig, async (req, res) => {
  try {
    const { gig_date, gig_time, venue_id, venue_name_snapshot, venue_city_snapshot, lat, lng, artist_text, mood_tags, people_ids, people, spend_total, purchases, rating, notes } = req.body;

    const gigId = uuidv4();
    const derivedDate = gig_date || deriveGigDate(new Date().toISOString());

    const result = await pool.query(
      `INSERT INTO gigs (
        id, user_id, gig_date, gig_time, venue_id, venue_name_snapshot, venue_city_snapshot,
        lat, lng, artist_text, mood_tags, people_ids, people, spend_total, purchases, rating, notes, sync_state
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        gigId, req.user.id, derivedDate, gig_time || null, venue_id || null, venue_name_snapshot,
        venue_city_snapshot || null, lat || null, lng || null, artist_text, mood_tags || null,
        people_ids || null, people || null, spend_total || null,
        purchases ? JSON.stringify(purchases) : null,
        rating || null, notes || null, 'local'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Gigs route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gigs WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gig not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Gigs route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ['gig_date', 'gig_time', 'venue_id', 'venue_name_snapshot', 'venue_city_snapshot', 'lat', 'lng', 'artist_text', 'mood_tags', 'people_ids', 'people', 'spend_total', 'purchases', 'rating', 'notes'];
    
    const updates = {};
    allowedFields.forEach(field => {
      if (field in req.body) {
        // JSONB columns need explicit JSON.stringify — pg serialises
        // JS arrays as PostgreSQL array literals, not JSON strings
        if (field === 'purchases' && req.body[field] != null) {
          updates[field] = JSON.stringify(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setClauses = [];
    const values = [id, req.user.id];
    let paramIndex = 3;

    Object.keys(updates).forEach(field => {
      setClauses.push(`${field} = $${paramIndex}`);
      values.push(updates[field]);
      paramIndex++;
    });

    setClauses.push('updated_at = NOW()');
    const query = `UPDATE gigs SET ${setClauses.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Gigs route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM gigs WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Gig not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Gigs route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
