CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  source VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname VARCHAR(255) NOT NULL,
  emoji VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gig_date DATE NOT NULL,
  gig_time TIME,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  venue_name_snapshot VARCHAR(255),
  venue_city_snapshot VARCHAR(255),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  artist_text TEXT NOT NULL,
  mood_tags TEXT[],
  people_ids UUID[],
  spend_total DECIMAL(10, 2),
  purchases JSONB,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  sync_state VARCHAR(50) DEFAULT 'local',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uploaded_url VARCHAR(2048),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gigs_user_id ON gigs(user_id);
CREATE INDEX idx_gigs_gig_date ON gigs(gig_date DESC);
CREATE INDEX idx_gigs_updated_at ON gigs(updated_at);
CREATE INDEX idx_venues_user_id ON venues(user_id);
CREATE INDEX idx_people_user_id ON people(user_id);
