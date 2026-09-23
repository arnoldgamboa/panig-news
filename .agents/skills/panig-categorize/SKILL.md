---
name: panig-categorize
description: Group Panig.News items first saved on a Philippine calendar day into broad subject categories and assign every item to exactly one category in SQLite. Use after source collection, not for scraping, scoring, or publishing.
---

# Panig daily categories

Run from the PanigNews repository root. This skill uses the existing `data/panig.sqlite3` database. Its helper and schema are inside this skill's `scripts/` directory. Keep the database in the persistent project checkout.

## Select the day's items

Choose the Philippine calendar date (`YYYY-MM-DD`) to categorize. “Added for the day” means `items.first_seen_at` falls between midnight and the next midnight in `Asia/Manila`. Publication date does not control selection. Export all matching items:

```bash
python3 .agents/skills/panig-categorize/scripts/categories.py export \
  --date YYYY-MM-DD \
  --output data/staging/YYYY-MM-DD/categorization-items.json
```

Read every exported item's title and full `body_text`, including Facebook posts with no title. The export is the complete input set for that day; do not add items from other dates or collect more source material.

## Create and assign broad categories

Group the day's items into a small set of broad subjects. Prefer umbrella categories that collect several related stories, even when the stories cover different events or developments. Category labels may be reused on later dates.

Use concise labels such as “West Philippine Sea,” “Transportation and infrastructure,” “Sara Duterte impeachment,” “Rodrigo Duterte ICC case,” “Weather,” “Sports,” or “Entertainment.” Do not repeat article headlines or include event-level detail in a category name. For example:

- Army deployment, maritime confrontations, and diplomatic responses concerning Philippine waters belong under “West Philippine Sea.”
- Rail disruptions, subway construction, fuel-driven fare issues, and similar mobility stories may belong under “Transportation and infrastructure.” Use a label such as “Transportation crisis” only when the assigned items actually describe a crisis.
- Separate reports about testimony, voting rules, and public reactions in the same impeachment proceeding belong under one impeachment category.

Choose categories after reviewing the full set so related items can be consolidated. Prefer fewer categories with meaningful membership over many narrow categories. For a collection containing dozens of varied items, roughly 6–12 categories is usually appropriate, but the contents determine the final count. Use a one-item category only when placing the item in any broader category would be misleading. Each item still gets **one** best-fit category based on its main subject.

Write one JSON object with a `categories` array. Each category has a short `name`, an optional `description`, and the IDs of its items:

```json
{
  "categories": [
    {
      "name": "Broad subject category",
      "description": "Optional short scope note",
      "item_ids": [1, 2]
    }
  ]
}
```

Save this file under `data/staging/YYYY-MM-DD/`, then import it:

```bash
python3 .agents/skills/panig-categorize/scripts/categories.py save \
  --date YYYY-MM-DD \
  --file data/staging/YYYY-MM-DD/categories.json
```

The helper requires every item first saved on that date to appear exactly once and rejects unknown IDs, duplicate assignments, duplicate category names, and empty categories. A successful save writes to `categories` and `item_categories` in one transaction. Repeating `save` for the same date replaces that date's prior topics and assignments after the new file passes validation.

To read the saved result later:

```bash
python3 .agents/skills/panig-categorize/scripts/categories.py show --date YYYY-MM-DD
```

Report the date, number of items, number of categories, and any failure. Do not edit collected item text, scrape websites, score stories, or publish anything.
