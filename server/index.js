import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import gigsRoutes from './routes/gigs.js';
import venuesRoutes from './routes/venues.js';
import peopleRoutes from './routes/people.js';
import photosRoutes from './routes/photos.js';
import statsRoutes from './routes/stats.js';
import syncRoutes from './routes/sync.js';
import { runMigrations } from './db/migrate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://giglog.koti.work';

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many requests from this IP, please try again later.'
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});

// Mount routes with /api prefix (direct access)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/gigs', generalLimiter, gigsRoutes);
app.use('/api/venues', generalLimiter, venuesRoutes);
app.use('/api/people', generalLimiter, peopleRoutes);
app.use('/api/photos', generalLimiter, photosRoutes);
app.use('/api/stats', generalLimiter, statsRoutes);
app.use('/api/sync', generalLimiter, syncRoutes);

// Also mount without /api prefix (DO App Platform strips it via ingress)
app.use('/auth', authLimiter, authRoutes);
app.use('/gigs', generalLimiter, gigsRoutes);
app.use('/venues', generalLimiter, venuesRoutes);
app.use('/people', generalLimiter, peopleRoutes);
app.use('/photos', generalLimiter, photosRoutes);
app.use('/stats', generalLimiter, statsRoutes);
app.use('/sync', generalLimiter, syncRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Run migrations then start server (don't crash if migrations fail)
runMigrations()
  .then(() => {
    console.log('Migrations complete');
  })
  .catch((err) => {
    console.error('Migration warning (server will start anyway):', err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`GigLog Express API running on port ${PORT}`);
    });
  });
