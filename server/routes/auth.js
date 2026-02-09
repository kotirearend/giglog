import { Router } from 'express';
import pool from '../db/pool.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { validateAuth } from '../middleware/validate.js';
import authenticate from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/register', validateAuth, async (req, res) => {
  try {
    const { email, password, display_name } = req.body;

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    const result = await pool.query(
      'INSERT INTO users (id, email, password_hash, display_name) VALUES ($1, $2, $3, $4) RETURNING id, email, display_name',
      [userId, email, passwordHash, display_name || null]
    );

    const user = result.rows[0];
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, access_token: accessToken, refresh_token: refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', validateAuth, async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT id, email, password_hash, display_name FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user.id, email: user.email, display_name: user.display_name },
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ error: 'refresh_token required' });
    }

    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ access_token: accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { display_name, email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check email uniqueness if it changed
    if (email !== req.user.email) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, req.user.id]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const result = await pool.query(
      'UPDATE users SET email = $1, display_name = $2 WHERE id = $3 RETURNING id, email, display_name',
      [email.trim(), display_name ? display_name.trim() : null, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
