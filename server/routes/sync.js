import { Router } from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticate);

router.post('/push', async (req, res) => {
  try {
    const { gigs, venues, people } = req.body;

    if (gigs) {
      for (const gig of gigs) {
        const gigId = gig.id || uuidv4();
        const existing = await pool.query('SELECT updated_at FROM gigs WHERE id = $1 AND user_id = $2', [gigId, req.user.id]);

        if (existing.rows.length > 0) {
          if (new Date(gig.updated_at) > new Date(existing.rows[0].updated_at)) {
            await pool.query(
              `UPDATE gigs SET artist_text = $1, venue_name_snapshot = $2, notes = $3, updated_at = NOW() 
               WHERE id = $4 AND user_id = $5`,
              [gig.artist_text, gig.venue_name_snapshot, gig.notes, gigId, req.user.id]
            );
          }
        } else {
          await pool.query(
            `INSERT INTO gigs (id, user_id, gig_date, artist_text, venue_name_snapshot, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [gigId, req.user.id, gig.gig_date, gig.artist_text, gig.venue_name_snapshot]
          );
        }
      }
    }

    if (venues) {
      for (const venue of venues) {
        const venueId = venue.id || uuidv4();
        const existing = await pool.query('SELECT updated_at FROM venues WHERE id = $1 AND user_id = $2', [venueId, req.user.id]);

        if (existing.rows.length > 0) {
          if (new Date(venue.updated_at) > new Date(existing.rows[0].updated_at)) {
            await pool.query(
              `UPDATE venues SET name = $1, city = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4`,
              [venue.name, venue.city, venueId, req.user.id]
            );
          }
        } else {
          await pool.query(
            `INSERT INTO venues (id, user_id, name, city, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, NOW(), NOW())`,
            [venueId, req.user.id, venue.name, venue.city || null]
          );
        }
      }
    }

    if (people) {
      for (const person of people) {
        const personId = person.id || uuidv4();
        const existing = await pool.query('SELECT id FROM people WHERE id = $1 AND user_id = $2', [personId, req.user.id]);

        if (!existing.rows.length) {
          await pool.query(
            `INSERT INTO people (id, user_id, nickname, emoji, created_at) 
             VALUES ($1, $2, $3, $4, NOW())`,
            [personId, req.user.id, person.nickname, person.emoji || null]
          );
        }
      }
    }

    res.json({ message: 'Sync completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pull', async (req, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : new Date(0);

    const gigs = await pool.query(
      'SELECT * FROM gigs WHERE user_id = $1 AND updated_at > $2 ORDER BY updated_at DESC',
      [req.user.id, sinceDate]
    );

    const venues = await pool.query(
      'SELECT * FROM venues WHERE user_id = $1 AND updated_at > $2 ORDER BY updated_at DESC',
      [req.user.id, sinceDate]
    );

    const people = await pool.query(
      'SELECT * FROM people WHERE user_id = $1 AND created_at > $2 ORDER BY created_at DESC',
      [req.user.id, sinceDate]
    );

    res.json({ gigs: gigs.rows, venues: venues.rows, people: people.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
