import { Router } from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticate);

const MAX_BATCH_SIZE = 100;

router.post('/push', async (req, res) => {
  const client = await pool.connect();
  try {
    const { gigs, venues, people } = req.body;

    // Batch size limits
    if (gigs && gigs.length > MAX_BATCH_SIZE) {
      return res.status(400).json({ error: `Too many gigs in batch (max ${MAX_BATCH_SIZE})` });
    }
    if (venues && venues.length > MAX_BATCH_SIZE) {
      return res.status(400).json({ error: `Too many venues in batch (max ${MAX_BATCH_SIZE})` });
    }
    if (people && people.length > MAX_BATCH_SIZE) {
      return res.status(400).json({ error: `Too many people in batch (max ${MAX_BATCH_SIZE})` });
    }

    await client.query('BEGIN');

    if (gigs) {
      for (const gig of gigs) {
        const gigId = gig.id || uuidv4();
        const existing = await client.query('SELECT updated_at FROM gigs WHERE id = $1 AND user_id = $2', [gigId, req.user.id]);

        if (existing.rows.length > 0) {
          // Validate timestamp — reject future dates
          const clientUpdated = new Date(gig.updated_at);
          if (isNaN(clientUpdated.getTime())) continue;
          const now = new Date();
          if (clientUpdated > new Date(now.getTime() + 60000)) continue; // 1 min tolerance

          if (clientUpdated > new Date(existing.rows[0].updated_at)) {
            await client.query(
              `UPDATE gigs SET artist_text = $1, venue_name_snapshot = $2, notes = $3,
               mood_tags = $4, purchases = $5, rating = $6, people = $7,
               spend_total = $8, venue_id = $9, venue_city_snapshot = $10,
               gig_time = $11, gig_date = $12, updated_at = NOW()
               WHERE id = $13 AND user_id = $14`,
              [
                gig.artist_text, gig.venue_name_snapshot, gig.notes,
                gig.mood_tags || null,
                gig.purchases ? JSON.stringify(gig.purchases) : null,
                gig.rating || null, gig.people || null,
                gig.spend_total || null, gig.venue_id || null,
                gig.venue_city_snapshot || null, gig.gig_time || null,
                gig.gig_date,
                gigId, req.user.id
              ]
            );
          }
        } else {
          await client.query(
            `INSERT INTO gigs (id, user_id, gig_date, artist_text, venue_name_snapshot,
             mood_tags, purchases, rating, people, spend_total, venue_id,
             venue_city_snapshot, gig_time, notes, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())`,
            [
              gigId, req.user.id, gig.gig_date, gig.artist_text, gig.venue_name_snapshot,
              gig.mood_tags || null,
              gig.purchases ? JSON.stringify(gig.purchases) : null,
              gig.rating || null, gig.people || null,
              gig.spend_total || null, gig.venue_id || null,
              gig.venue_city_snapshot || null, gig.gig_time || null,
              gig.notes || null
            ]
          );
        }
      }
    }

    if (venues) {
      for (const venue of venues) {
        const venueId = venue.id || uuidv4();
        const existing = await client.query('SELECT updated_at FROM venues WHERE id = $1 AND user_id = $2', [venueId, req.user.id]);

        if (existing.rows.length > 0) {
          const clientUpdated = new Date(venue.updated_at);
          if (isNaN(clientUpdated.getTime())) continue;
          if (clientUpdated > new Date(existing.rows[0].updated_at)) {
            await client.query(
              `UPDATE venues SET name = $1, city = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4`,
              [venue.name, venue.city, venueId, req.user.id]
            );
          }
        } else {
          await client.query(
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
        const existing = await client.query('SELECT id FROM people WHERE id = $1 AND user_id = $2', [personId, req.user.id]);

        if (!existing.rows.length) {
          const nickname = (person.nickname || '').trim().slice(0, 100);
          if (!nickname) continue;
          await client.query(
            `INSERT INTO people (id, user_id, nickname, emoji, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [personId, req.user.id, nickname, person.emoji || null]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Sync completed' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Sync push error:', err);
    res.status(500).json({ error: 'Sync failed' });
  } finally {
    client.release();
  }
});

router.get('/pull', async (req, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : new Date(0);

    // Validate the since date
    if (isNaN(sinceDate.getTime())) {
      return res.status(400).json({ error: 'Invalid since parameter' });
    }

    const gigs = await pool.query(
      'SELECT * FROM gigs WHERE user_id = $1 AND updated_at > $2 ORDER BY updated_at DESC LIMIT 1000',
      [req.user.id, sinceDate]
    );

    const venues = await pool.query(
      'SELECT * FROM venues WHERE user_id = $1 AND updated_at > $2 ORDER BY updated_at DESC LIMIT 500',
      [req.user.id, sinceDate]
    );

    const people = await pool.query(
      'SELECT * FROM people WHERE user_id = $1 AND created_at > $2 ORDER BY created_at DESC LIMIT 500',
      [req.user.id, sinceDate]
    );

    res.json({ gigs: gigs.rows, venues: venues.rows, people: people.rows });
  } catch (err) {
    console.error('Sync pull error:', err);
    res.status(500).json({ error: 'Sync pull failed' });
  }
});

export default router;
