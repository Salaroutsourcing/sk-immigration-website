-- SK Immigration — lead storage
-- Apply with: npx wrangler d1 execute sk-immigration-leads --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL,
  type        TEXT NOT NULL,
  name        TEXT,
  email       TEXT,
  phone       TEXT,
  meta        TEXT,
  payload     TEXT NOT NULL,
  ip_hash     TEXT,
  user_agent  TEXT,
  status      TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_type       ON leads (type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_rate       ON leads (ip_hash, created_at);
