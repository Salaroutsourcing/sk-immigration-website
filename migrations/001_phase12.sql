-- Phase 1+2 migration for existing sk-immigration-leads database
-- Run individual CREATE TABLE IF NOT EXISTS commands if needed.
-- Do NOT re-run ALTER for updated_at if the column already exists.

CREATE TABLE IF NOT EXISTS lead_notes (
  id         TEXT PRIMARY KEY,
  lead_id    TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes (lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status, created_at DESC);

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
