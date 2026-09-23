# Panig.News frontend

Astro version of the Panig.News landing page prototype. The briefings in `src/data/briefings.js` are illustrative sample content, not live reporting.

## Run locally

```sh
cd frontend
npm install
npm run dev
```

Astro prints the local URL, usually `http://localhost:4321/`.

## Build

```sh
npm run build
npm run preview
```

The static site is generated in `dist/`.

## Structure

- `src/pages/index.astro`: landing page and date views
- `src/components/`: story cluster, take card, and signal markup
- `src/data/briefings.js`: sample briefings
- `src/scripts/briefing.js`: date, lane, topic, and drawer controls
- `src/styles/panig.css`: existing visual design
