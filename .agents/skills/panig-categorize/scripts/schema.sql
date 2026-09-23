CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    collection_date TEXT NOT NULL,
    name TEXT NOT NULL COLLATE NOCASE,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    UNIQUE(collection_date, name)
);

CREATE TABLE IF NOT EXISTS item_categories (
    item_id INTEGER PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    assigned_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS item_categories_category_idx ON item_categories(category_id);
