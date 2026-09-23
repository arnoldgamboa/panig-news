#!/usr/bin/env python3
"""Export a Manila day's collected items and save one daily topic per item."""

import argparse
import json
import sqlite3
import sys
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[4]
DB_PATH = ROOT / "data" / "panig.sqlite3"
SCHEMA_PATH = Path(__file__).with_name("schema.sql")
MANILA = ZoneInfo("Asia/Manila")


def connect():
    if not DB_PATH.is_file():
        raise ValueError("Panig database is missing: {}".format(DB_PATH))
    db = sqlite3.connect(str(DB_PATH))
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


def day_bounds(day_text):
    day = date.fromisoformat(day_text)
    if day.isoformat() != day_text:
        raise ValueError("Date must be YYYY-MM-DD")
    start = datetime.combine(day, time.min, MANILA).astimezone(timezone.utc)
    end = datetime.combine(day + timedelta(days=1), time.min, MANILA).astimezone(timezone.utc)
    return tuple(value.isoformat(timespec="milliseconds").replace("+00:00", "Z")
                 for value in (start, end))


def day_items(db, day_text):
    start, end = day_bounds(day_text)
    return [dict(row) for row in db.execute(
        "SELECT id, website_url, url, title, body_text, published_at, first_seen_at "
        "FROM items WHERE first_seen_at >= ? AND first_seen_at < ? "
        "ORDER BY first_seen_at, id", (start, end)
    )]


def export_items(db, args):
    items = day_items(db, args.date)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Exported {} items for {} to {}".format(len(items), args.date, args.output))


def validated_categories(payload, expected_ids):
    if not isinstance(payload, dict) or not isinstance(payload.get("categories"), list):
        raise ValueError("Input must be an object with a categories array")
    categories = []
    seen_names = set()
    seen_ids = set()
    for position, category in enumerate(payload["categories"], 1):
        if not isinstance(category, dict):
            raise ValueError("Category {} must be an object".format(position))
        name = category.get("name")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Category {} needs a name".format(position))
        name = name.strip()
        if name.casefold() in seen_names:
            raise ValueError("Duplicate category name: {}".format(name))
        seen_names.add(name.casefold())
        description = category.get("description")
        if description is not None and not isinstance(description, str):
            raise ValueError("Description for {} must be text".format(name))
        ids = category.get("item_ids")
        if not isinstance(ids, list) or not ids:
            raise ValueError("Category {} needs at least one item ID".format(name))
        for item_id in ids:
            if isinstance(item_id, bool) or not isinstance(item_id, int):
                raise ValueError("Category {} has a noninteger item ID".format(name))
            if item_id in seen_ids:
                raise ValueError("Item {} is assigned more than once".format(item_id))
            seen_ids.add(item_id)
        categories.append((name, description.strip() or None if description else None, ids))
    missing = expected_ids - seen_ids
    extra = seen_ids - expected_ids
    if missing or extra:
        raise ValueError("Assignments do not match the day's items ({} missing, {} unknown)".format(
            len(missing), len(extra)))
    return categories


def save_categories(db, args):
    expected_ids = {item["id"] for item in day_items(db, args.date)}
    payload = json.loads(args.file.read_text(encoding="utf-8"))
    categories = validated_categories(payload, expected_ids)
    db.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    with db:
        db.execute(
            "DELETE FROM item_categories WHERE category_id IN "
            "(SELECT id FROM categories WHERE collection_date = ?)", (args.date,)
        )
        db.execute("DELETE FROM categories WHERE collection_date = ?", (args.date,))
        for name, description, ids in categories:
            cursor = db.execute(
                "INSERT INTO categories(collection_date, name, description) VALUES (?, ?, ?)",
                (args.date, name, description)
            )
            db.executemany(
                "INSERT INTO item_categories(item_id, category_id) VALUES (?, ?)",
                ((item_id, cursor.lastrowid) for item_id in ids)
            )
    print("Saved {} categories for {} items on {}".format(
        len(categories), len(expected_ids), args.date))


def show_categories(db, args):
    day_bounds(args.date)
    rows = db.execute(
        "SELECT c.id, c.name, c.description, ic.item_id "
        "FROM categories AS c LEFT JOIN item_categories AS ic ON ic.category_id = c.id "
        "WHERE c.collection_date = ? ORDER BY c.name, ic.item_id", (args.date,)
    )
    categories = {}
    for row in rows:
        category = categories.setdefault(row["id"], {
            "name": row["name"], "description": row["description"], "item_ids": []
        })
        if row["item_id"] is not None:
            category["item_ids"].append(row["item_id"])
    print(json.dumps({"date": args.date, "categories": list(categories.values())},
                     ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    exported = commands.add_parser("export", help="write the day's collected items to JSON")
    exported.add_argument("--date", required=True)
    exported.add_argument("--output", required=True, type=Path)
    saved = commands.add_parser("save", help="validate and save daily categories")
    saved.add_argument("--date", required=True)
    saved.add_argument("--file", required=True, type=Path)
    shown = commands.add_parser("show", help="print saved daily categories")
    shown.add_argument("--date", required=True)
    args = parser.parse_args()
    try:
        with connect() as db:
            {"export": export_items, "save": save_categories, "show": show_categories}[
                args.command](db, args)
    except (ValueError, OSError, sqlite3.Error, json.JSONDecodeError) as error:
        print("Error:", error, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
