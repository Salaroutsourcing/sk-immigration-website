-- Phase 1: SK Immigration Studio CMS tables
CREATE TABLE IF NOT EXISTS studio_entries (
  id TEXT PRIMARY KEY,
  collection TEXT NOT NULL CHECK (collection IN ('news', 'blog', 'web-stories')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  data_json TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  github_path TEXT,
  github_sha TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT,
  UNIQUE (collection, slug)
);

CREATE INDEX IF NOT EXISTS idx_studio_entries_collection ON studio_entries(collection, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_studio_entries_status ON studio_entries(status, updated_at DESC);

CREATE TABLE IF NOT EXISTS studio_media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  public_path TEXT NOT NULL,
  github_sha TEXT,
  alt TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_studio_media_created ON studio_media(created_at DESC);

CREATE TABLE IF NOT EXISTS studio_keywords (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL UNIQUE,
  intent TEXT,
  cluster TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS studio_activity (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  collection TEXT,
  entry_id TEXT,
  actor TEXT,
  detail TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_studio_activity_created ON studio_activity(created_at DESC);
