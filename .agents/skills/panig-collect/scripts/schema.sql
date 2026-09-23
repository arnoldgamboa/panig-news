PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS websites (
    type TEXT NOT NULL CHECK (type IN ('newsrooms', 'social media')),
    name TEXT NOT NULL,
    url TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    website_url TEXT NOT NULL REFERENCES websites(url),
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    author TEXT,
    body_text TEXT NOT NULL,
    published_at TEXT,
    first_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS items_website_published_idx ON items(website_url, published_at);

CREATE TABLE IF NOT EXISTS collection_runs (
    id INTEGER PRIMARY KEY,
    website_url TEXT NOT NULL REFERENCES websites(url),
    collected_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    item_count INTEGER NOT NULL DEFAULT 0,
    error TEXT
);
