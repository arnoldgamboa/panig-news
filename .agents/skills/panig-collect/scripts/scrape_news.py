#!/usr/bin/env python3
"""Extract dated newsroom articles linked from a registered homepage into JSON."""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
from zoneinfo import ZoneInfo

import requests
from bs4 import BeautifulSoup
from dateutil.parser import isoparse


MANILA = ZoneInfo("Asia/Manila")
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; PanigNews research)"}
SITE_PATTERNS = {
    "www.inquirer.net": re.compile(r"^/\d{5,}/[^/]+/?$"),
    "www.philstar.com": re.compile(r"^/[^/]+/\d{4}/\d{2}/\d{2}/\d+/[^/]+/?$"),
    "www.abs-cbn.com": re.compile(r"^/(?:[^/]+/)+\d{4}/\d{1,2}/\d{1,2}/[^/]+/?$"),
    "www.gmanetwork.com": re.compile(r"^/news/(?:[^/]+/)+\d+/[^/]+/story/?$"),
}


def clean_url(url):
    parsed = urlparse(url)
    path = parsed.path.rstrip("/") or "/"
    return urlunparse((parsed.scheme, parsed.netloc, path, "", "", ""))


def get(session, url):
    response = session.get(url, timeout=20)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def candidates(soup, homepage, limit):
    host = urlparse(homepage).netloc
    pattern = SITE_PATTERNS[host]
    seen = set()
    for link in soup.select("a[href]"):
        url = clean_url(urljoin(homepage, link["href"]))
        parsed = urlparse(url)
        if parsed.netloc != host or not pattern.match(parsed.path) or url in seen:
            continue
        seen.add(url)
        yield url
        if len(seen) >= limit:
            break


def jsonld_articles(soup):
    for tag in soup.select('script[type="application/ld+json"]'):
        try:
            obj = json.loads(tag.string or tag.get_text())
        except (TypeError, ValueError):
            continue
        stack = [obj]
        while stack:
            value = stack.pop()
            if isinstance(value, list):
                stack.extend(value)
            elif isinstance(value, dict):
                kinds = value.get("@type", [])
                if isinstance(kinds, str):
                    kinds = [kinds]
                if any(kind in ("NewsArticle", "Article", "LiveBlogPosting") for kind in kinds):
                    yield value
                stack.extend(value.values())


def paragraphs(node):
    if not node:
        return ""
    parts = []
    for element in node.find_all(["p", "h2", "h3"]):
        if any(name in ("headertext", "footertext") for name in element.get("class", [])):
            continue
        text = element.get_text(" ", strip=True)
        if text and text.upper() not in ("ADVERTISEMENT", "RELATED VIDEO", "READ MORE"):
            parts.append(text)
    return "\n\n".join(parts)


def article_data(soup, host):
    ld = next(jsonld_articles(soup), {})
    meta_title = soup.select_one('meta[property="og:title"]')
    title = ld.get("headline") or (meta_title.get("content") if meta_title else None)
    if not title:
        h1 = soup.find("h1")
        title = h1.get_text(" ", strip=True) if h1 else None
    published = ld.get("datePublished")
    if not published:
        tag = soup.select_one('meta[property="article:published_time"]')
        published = tag.get("content") if tag else None
    author = ld.get("author")
    if isinstance(author, list):
        author = ", ".join(str(a.get("name", "")) for a in author if isinstance(a, dict))
    elif isinstance(author, dict):
        author = author.get("name")
    else:
        author = None

    body = ""
    if host == "www.inquirer.net":
        body = paragraphs(soup.select_one("#article_content"))
    elif host == "www.philstar.com":
        body = paragraphs(soup.select_one("#sports_article_writeup"))
    elif host == "www.abs-cbn.com":
        script = soup.select_one("script#__NEXT_DATA__")
        if script:
            data = json.loads(script.string)["props"]["pageProps"]
            content = data.get("content") or {}
            title = content.get("headline") or title
            published = content.get("firstpublished") or published
            authors = content.get("authors") or []
            author = ", ".join(a.get("name", "") for a in authors if isinstance(a, dict)) or author
            bodies = []
            for row in data.get("dataStr", []):
                for column in row.get("columns", []):
                    for module in column.get("modules", []):
                        html = (module.get("article") or {}).get("body_html")
                        if html:
                            bodies.append(paragraphs(BeautifulSoup(html, "html.parser")))
            body = max(bodies, key=len, default="")
            if not body:
                body = content.get("description_text", "")
    elif host == "www.gmanetwork.com":
        raw_body = ld.get("articleBody", "")
        body = paragraphs(BeautifulSoup(raw_body, "html.parser")) if raw_body else ""
        if not body:
            body = paragraphs(soup.select_one(".story_main"))
    return title, body.strip(), published, author


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--website", required=True, choices=["https://" + host + ("/news/" if host == "www.gmanetwork.com" else "/") for host in SITE_PATTERNS])
    parser.add_argument("--date", default=datetime.now(MANILA).date().isoformat())
    parser.add_argument("--max-links", type=int, default=20,
                        help="maximum homepage article links to inspect, in page order")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        target_date = datetime.strptime(args.date, "%Y-%m-%d").date()
        host = urlparse(args.website).netloc
        session = requests.Session()
        session.headers.update(HEADERS)
        homepage = get(session, args.website)
        found = list(candidates(homepage, args.website, args.max_links))
        items = []
        errors = []
        for url in found:
            try:
                soup = get(session, url)
                title, body, published, author = article_data(soup, host)
                if not (title and body):
                    errors.append((url, "missing title or body"))
                    continue
                if len(body) < 300:
                    errors.append((url, "article body appears incomplete"))
                    continue
                item = {"url": url, "title": title.strip(), "author": author,
                        "body_text": body,
                        "metadata": {"collection_method": "newsroom_html",
                                     "homepage_collection_date": target_date.isoformat()}}
                if published:
                    when = isoparse(published)
                    if when.tzinfo is not None:
                        item["published_at"] = when.isoformat()
                items.append(item)
            except (requests.RequestException, ValueError, KeyError, TypeError) as error:
                errors.append((url, str(error)))
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
        print("Extracted {} of {} top homepage links on {}".format(len(items), len(found), args.date))
        for index, item in enumerate(items, 1):
            print("{}. {} | {}".format(index, item["title"], item["url"]))
        for url, reason in errors:
            print("Skipped {}: {}".format(url, reason), file=sys.stderr)
        return 0
    except (requests.RequestException, ValueError, KeyError, OSError) as error:
        print("Collection failed:", error, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
