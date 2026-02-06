export function validateGig(req, res, next) {
  const { artist_text, venue_name_snapshot } = req.body;
  
  if (!artist_text || typeof artist_text !== 'string' || artist_text.trim() === '') {
    return res.status(400).json({ error: 'artist_text is required and must be non-empty' });
  }
  
  if (!venue_name_snapshot || typeof venue_name_snapshot !== 'string' || venue_name_snapshot.trim() === '') {
    return res.status(400).json({ error: 'venue_name_snapshot is required and must be non-empty' });
  }
  
  next();
}

export function validateAuth(req, res, next) {
  const { email, password } = req.body;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  next();
}
