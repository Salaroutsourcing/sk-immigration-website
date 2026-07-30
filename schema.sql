-- SK Immigration — D1 schema (Phase 1 CRM + Phase 2 CMS)
-- Fresh install: npx wrangler d1 execute sk-immigration-leads --remote --file=./schema.sql
-- Existing DB: also run migrations/001_phase12.sql

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL,
  updated_at  TEXT,
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
CREATE INDEX IF NOT EXISTS idx_leads_status     ON leads (status, created_at DESC);

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  ip_hash      TEXT PRIMARY KEY,
  fails        INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT
);

CREATE TABLE IF NOT EXISTS lead_notes (
  id         TEXT PRIMARY KEY,
  lead_id    TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes (lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS blog_posts (
  id         TEXT PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  excerpt    TEXT,
  category   TEXT,
  tags       TEXT,
  author     TEXT,
  date       TEXT,
  featured   INTEGER NOT NULL DEFAULT 0,
  published  INTEGER NOT NULL DEFAULT 1,
  content    TEXT,
  url        TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blog_date ON blog_posts (date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts (published, date DESC);

CREATE TABLE IF NOT EXISTS jobs (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  company      TEXT,
  country      TEXT,
  city         TEXT,
  type         TEXT,
  category     TEXT,
  salary       TEXT,
  language     TEXT,
  featured     INTEGER NOT NULL DEFAULT 0,
  published    INTEGER NOT NULL DEFAULT 1,
  description  TEXT,
  requirements TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs (published, featured DESC, updated_at DESC);
