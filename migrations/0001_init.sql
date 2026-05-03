-- Cloudflare D1 schema for VisitPetrovac
-- Apply with: wrangler d1 migrations apply visitpetrovac-db --remote

CREATE TABLE IF NOT EXISTS contact_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id TEXT NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('reveal', 'phone', 'whatsapp', 'email', 'website')),
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_logs_listing ON contact_logs (listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_logs_created ON contact_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS tour_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id TEXT NOT NULL,
  listing_title TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  tour_date TEXT NOT NULL,
  persons INTEGER NOT NULL,
  language TEXT DEFAULT 'sr',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'cancelled')),
  ip_hash TEXT,
  received_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON tour_inquiries (status, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_listing ON tour_inquiries (listing_id, received_at DESC);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  language TEXT DEFAULT 'sr',
  confirmed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
