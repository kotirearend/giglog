import { Router } from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/summary', async (req, res) => {
  try {
    const totalGigsResult = await pool.query('SELECT COUNT(*) as count FROM gigs WHERE user_id = $1', [req.user.id]);
    const totalGigs = parseInt(totalGigsResult.rows[0].count);

    const thisYearResult = await pool.query(
      'SELECT COUNT(*) as count FROM gigs WHERE user_id = $1 AND EXTRACT(YEAR FROM gig_date) = EXTRACT(YEAR FROM NOW())',
      [req.user.id]
    );
    const gigsThisYear = parseInt(thisYearResult.rows[0].count);

    const topVenuesResult = await pool.query(
      `SELECT venue_name_snapshot, COUNT(*) as count FROM gigs WHERE user_id = $1 AND venue_name_snapshot IS NOT NULL
       GROUP BY venue_name_snapshot ORDER BY count DESC LIMIT 10`,
      [req.user.id]
    );

    const topArtistsResult = await pool.query(
      `SELECT artist_text, COUNT(*) as count FROM gigs WHERE user_id = $1
       GROUP BY artist_text ORDER BY count DESC LIMIT 10`,
      [req.user.id]
    );

    res.json({
      total_gigs: totalGigs,
      gigs_this_year: gigsThisYear,
      top_venues: topVenuesResult.rows,
      top_artists: topArtistsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pints', async (req, res) => {
  try {
    const result = await pool.query('SELECT purchases FROM gigs WHERE user_id = $1 AND purchases IS NOT NULL', [req.user.id]);
    
    let prices = [];
    result.rows.forEach(row => {
      let purchases = row.purchases;
      // pg may return JSONB as a string — parse it
      if (typeof purchases === 'string') {
        try { purchases = JSON.parse(purchases); } catch { purchases = []; }
      }
      if (purchases && Array.isArray(purchases)) {
        purchases.forEach(purchase => {
          if (purchase.amount) {
            prices.push(parseFloat(purchase.amount));
          }
        });
      }
    });

    let avg = 0, max = 0, trend = null;
    if (prices.length > 0) {
      avg = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
      max = Math.max(...prices);
    }

    res.json({ avg: parseFloat(avg), max, trend, total_drinks: prices.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
