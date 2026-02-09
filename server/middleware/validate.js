export function validateGig(req, res, next) {
  const { artist_text, venue_name_snapshot } = req.body;

  if (!artist_text || typeof artist_text !== 'string' || artist_text.trim() === '') {
    return res.status(400).json({ error: 'artist_text is required and must be non-empty' });
  }
  if (artist_text.length > 500) {
    return res.status(400).json({ error: 'artist_text must be 500 characters or less' });
  }

  if (!venue_name_snapshot || typeof venue_name_snapshot !== 'string' || venue_name_snapshot.trim() === '') {
    return res.status(400).json({ error: 'venue_name_snapshot is required and must be non-empty' });
  }
  if (venue_name_snapshot.length > 500) {
    return res.status(400).json({ error: 'venue_name_snapshot must be 500 characters or less' });
  }

  // Validate optional numeric fields
  const { rating, lat, lng, spend_total } = req.body;
  if (rating !== undefined && rating !== null) {
    const r = Number(rating);
    if (isNaN(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
  }
  if (lat !== undefined && lat !== null) {
    const l = Number(lat);
    if (isNaN(l) || l < -90 || l > 90) {
      return res.status(400).json({ error: 'Invalid latitude' });
    }
  }
  if (lng !== undefined && lng !== null) {
    const l = Number(lng);
    if (isNaN(l) || l < -180 || l > 180) {
      return res.status(400).json({ error: 'Invalid longitude' });
    }
  }
  if (spend_total !== undefined && spend_total !== null) {
    const s = Number(spend_total);
    if (isNaN(s) || s < 0 || s > 100000) {
      return res.status(400).json({ error: 'Invalid spend_total' });
    }
  }

  // Validate optional text fields length
  if (req.body.notes && req.body.notes.length > 5000) {
    return res.status(400).json({ error: 'Notes must be 5000 characters or less' });
  }

  // Validate purchases array structure and size
  if (req.body.purchases) {
    const p = req.body.purchases;
    if (!Array.isArray(p)) {
      return res.status(400).json({ error: 'purchases must be an array' });
    }
    if (p.length > 50) {
      return res.status(400).json({ error: 'Too many purchase items (max 50)' });
    }
    const jsonSize = JSON.stringify(p).length;
    if (jsonSize > 50000) {
      return res.status(400).json({ error: 'purchases data too large' });
    }
  }

  next();
}

export function validateAuth(req, res, next) {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (email.length > 254) {
    return res.status(400).json({ error: 'Email too long' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (password.length > 128) {
    return res.status(400).json({ error: 'Password too long' });
  }

  next();
}

export function validatePerson(req, res, next) {
  const { nickname, emoji } = req.body;

  if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
    return res.status(400).json({ error: 'nickname is required' });
  }
  if (nickname.length > 100) {
    return res.status(400).json({ error: 'nickname must be 100 characters or less' });
  }
  if (emoji && emoji.length > 10) {
    return res.status(400).json({ error: 'emoji must be 10 characters or less' });
  }

  next();
}

export function validateProfile(req, res, next) {
  const { email, display_name } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (email.length > 254) {
    return res.status(400).json({ error: 'Email too long' });
  }
  if (display_name && display_name.length > 100) {
    return res.status(400).json({ error: 'Display name must be 100 characters or less' });
  }

  next();
}
