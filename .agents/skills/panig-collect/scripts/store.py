#!/usr/bin/env python3
"""Small SQLite store for Panig source collection; accepts JSON collected elsewhere."""

import argparse
import json
import sqlite3
import sys
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[4]
DEFAULT_DB = ROOT / "data" / "panig.sqlite3"
SCHEMA = Path(__file__).with_name("schema.sql")
WEBSITES = Path(__file__).resolve().parents[1] / "assets" / "websites.json"


def web_url(value):
    if not isinstance(value, str):
        raise ValueError("Expected an absolute http(s) URL")
    value = value.strip()
    parsed = urlparse(value)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("Expected an absolute http(s) URL")
    return value


def connect(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(str(path))
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    db.executescript(SCHEMA.read_text(encoding="utf-8"))
    return db


def registered_website(db, url):
    row = db.execute("SELECT url FROM websites WHERE url = ?", (url,)).fetchone()
    if row is None:
        raise ValueError("Website URL is not registered: " + url)
    return row["url"]


def sync_websites(db, _args):
    with open(WEBSITES, encoding="utf-8") as file:
        websites = json.load(file)
    if not isinstance(websites, list):
        raise ValueError("websites.json must contain an array")
    prepared = []
    seen = set()
    for index, website in enumerate(websites, 1):
        if not isinstance(website, dict):
            raise ValueError("Website {} must be an object".format(index))
        kind = website.get("type")
        name = website.get("name")
        url = web_url(website.get("url"))
        if kind not in ("newsrooms", "social media"):
            raise ValueError("Website {} has an invalid type".format(index))
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Website {} needs a name".format(index))
        if url in seen:
            raise ValueError("Duplicate website URL: " + url)
        seen.add(url)
        prepared.append((kind, name.strip(), url))
    with db:
        db.executemany(
            "INSERT INTO websites(type, name, url) VALUES (?, ?, ?) "
            "ON CONFLICT(url) DO UPDATE SET type=excluded.type, name=excluded.name",
            prepared,
        )
    print("Synchronized {} websites".format(len(prepared)))


def import_items(db, args):
    url = web_url(args.website)
    website_url = registered_website(db, url)
    with open(args.file, encoding="utf-8") as file:
        payload = json.load(file)
    if not isinstance(payload, list):
        raise ValueError("Import file must contain a JSON array of items")
    prepared = []
    for index, item in enumerate(payload, 1):
        if not isinstance(item, dict):
            raise ValueError("Item {} must be an object".format(index))
        item_url = web_url(item.get("url", ""))
        body = item.get("body_text", "")
        if not isinstance(body, str) or not body.strip():
            raise ValueError("Item {} needs nonempty body_text".format(index))
        metadata = item.get("metadata", {})
        if not isinstance(metadata, dict):
            raise ValueError("Item {} metadata must be an object".format(index))
        existing = db.execute("SELECT website_url FROM items WHERE url = ?", (item_url,)).fetchone()
        if existing is not None and existing["website_url"] != website_url:
            raise ValueError("Item {} URL already belongs to another website".format(index))
        prepared.append((website_url, item_url, item.get("title"), item.get("author"), body.strip(),
                         item.get("published_at"), json.dumps(metadata, ensure_ascii=False)))
    with db:
        for record in prepared:
            db.execute(
                "INSERT INTO items(website_url, url, title, author, body_text, published_at, metadata_json) "
                "VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(url) DO UPDATE SET "
                "last_seen_at=strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), "
                "title=excluded.title, author=excluded.author, body_text=excluded.body_text, "
                "published_at=excluded.published_at, metadata_json=excluded.metadata_json",
                record,
            )
        db.execute(
            "INSERT INTO collection_runs(website_url, status, item_count) VALUES (?, 'success', ?)",
            (website_url, len(prepared)),
        )
    print("Imported {} items from {}".format(len(prepared), url))


def record_failure(db, args):
    website_url = registered_website(db, web_url(args.website))
    with db:
        db.execute(
            "INSERT INTO collection_runs(website_url, status, error) VALUES (?, 'failed', ?)",
            (website_url, args.error.strip()),
        )
    print("Recorded failure for", args.website)


def list_websites(db, _args):
    for row in db.execute("SELECT type, name, url FROM websites ORDER BY type, name"):
        print("{}\t{}\t{}".format(row["type"], row["name"], row["url"]))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("init")
    commands.add_parser("sync-websites")
    imported = commands.add_parser("import")
    imported.add_argument("--website", required=True)
    imported.add_argument("--file", type=Path, required=True)
    failed = commands.add_parser("failure")
    failed.add_argument("--website", required=True)
    failed.add_argument("--error", required=True)
    commands.add_parser("list-websites")
    args = parser.parse_args()
    try:
        with connect(args.db) as db:
            {"init": lambda db, args: print("Ready:", args.db),
             "sync-websites": sync_websites,
             "import": import_items,
             "failure": record_failure,
             "list-websites": list_websites}[args.command](db, args)
    except (ValueError, OSError, sqlite3.Error, json.JSONDecodeError) as error:
        print("Error:", error, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
