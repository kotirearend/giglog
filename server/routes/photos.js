import { Router } from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/auth.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { gig_id } = req.body;

    if (!gig_id) {
      return res.status(400).json({ error: 'gig_id is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'photo file is required' });
    }

    const photoId = uuidv4();
    
    const result = await pool.query(
      'INSERT INTO photos (id, gig_id, user_id, uploaded_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [photoId, gig_id, req.user.id, `/photos/${photoId}`]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM photos WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
