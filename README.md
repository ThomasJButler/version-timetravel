# Version TimeTravel

> A working archive of thomasjbutler.github.io, version by version. Every version can be opened and used as it shipped.

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Live:** https://thomasjbutler.github.io/version-timetravel/

## What this is

Nine versions of one personal portfolio, from hand-written HTML in June 2024 to a prerendered React and shadcn build in July 2026. Each one is kept as it shipped and opens inside a device frame, so you can click around a two-year-old site rather than look at a picture of it.

Git already stores the history. What it does not give you is a visual timeline: a way to see the thing as a visitor saw it, on the day it was live. That is what this is for. It doubles as a place to experiment, which is why the rebuild happened at all.

It documents the portfolio, not itself, so there are no TimeTravel versions on the timeline.

## Commands

```bash
npm run dev            # Vite dev server on port 3000
npm run typecheck      # tsc -b
npm run build          # bundles, writes dist/404.html, copies the viewer shim

python3 scripts/serve-pages.py   # serve dist/ the way GitHub Pages does
```

**Verify with `scripts/serve-pages.py`, not `vite preview`.** Vite's `appType` defaults to `'spa'`, so preview serves `index.html` for every missing path. That hides exactly the 404s worth finding and makes a broken archive look fine. The Python server reproduces Pages properly: a 404 status with the `404.html` body, URL preserved.

There is no test suite or linter yet.

### Screenshots

```bash
npm run shots:archive              # capture every archived version into public/shots/
npm run shots:archive -- v2.5 v3   # or just these
npm run shots                      # capture this site into screenshots/after/
```

Both need `serve-pages.py` running. They drive the system Chrome through Playwright, so nothing extra is downloaded.

## Architecture

Two halves, and the boundary matters.

**The shell** is `src/`, bundled by Vite. Two routes: `/` (`src/routes/Archive.tsx`) and `/v/:id` (`src/routes/Viewer.tsx`, lazily loaded so the VT323 font and the rain canvas cost the archive page nothing).

**The archive** is `public/archive/<id>/`, copied verbatim and never bundled. Snapshots keep their original filenames (`public/archive/v2.5/version25.html`, not `index.html`) because renaming breaks in-page self-links that still resolve. Each folder is self-contained.

A few rules hold the whole thing together:

- **`src/data/versions.ts` is the single source of truth**, imported at build time, never fetched. Adding a version is one edit to this file. An earlier build fetched a JSON file without the base path, it 404'd, the error was caught, and a hard-coded fallback array rendered instead, which is why v3.5 was missing from the live site for months.
- **Every URL goes through `asset()`** (`src/lib/asset.ts`). The site is served from a sub-path, so a leading slash resolves to the domain root and 404s in production only.
- **Everything countable is derived** in `src/lib/archive.ts`: counts, date range, era grouping, accession numbers, the tech-chip diff. No number is typed into copy, so shipping v6 cannot make the page contradict itself.
- **`dist/404.html` is frame-aware.** Pages honours exactly one root 404, so a plain copy of `index.html` would boot the whole app inside an archived snapshot's iframe whenever a visitor clicked one of that snapshot's dead links.
- **`viewer.html` is a real static file**, not a route. It maps the legacy `?version=&id=&num=&date=` contract onto `/v/:id`. Pages cannot redirect, so deleting it would silently break every existing bookmark.

`CLAUDE.md` covers the rest, including the things that have already bitten. `DESIGN.md` is the written design spec.

## Design

The design is **ACCESSION**: an archive that presents each version as a catalogued exhibit rather than a card in a feed. A 16px neutral mat around every screenshot is what lets ten mutually inconsistent designs share one page without fighting. A sticky chronology rail replaces the centre spine that used to eat half the viewport.

The green is `--phosphor` and means one thing: added, or current. It appears in five places and never as body text, a fill behind text, a glow or a gradient.

## The versions

| # | Version | Date | What changed |
|---|---------|------|--------------|
| 1 | 1.0 The Beginning | June 2024 | Hand-written HTML, CSS and JavaScript. The Matrix rain arrives. |
| 2 | 2.0 Matrix Theme Born | July 2024 | The cyberpunk look proper. Canvas effects. |
| 3 | 2.5 Animation Upgrade | October 2024 | GSAP and ScrollMagic. Font Awesome. |
| 4 | Landing Page | November 2024 | A testing ground. Interactive CV prototype on an embedded CodePen. |
| 5 | 2.8 Final Static Version | January 2025 | The static era at its most refined, just before the rewrite. |
| 6 | 3.0 React Migration | August 2025 | React 19, TypeScript and Vite. The animation libraries come along. |
| 7 | 3.5 Content and Polish | October 2025 | react-markdown and a vertical timeline. Content over chrome. |
| 8 | 4.0 shadcn Redesign | July 2026 | Tailwind v4, shadcn on Base UI, Framer Motion. GSAP and ScrollMagic dropped. |
| 9 | 5.0 Impression | July 2026 | Prerendered so crawlers and language models get real HTML. Services, pricing, and the projects to back them. |

**Commercial Portfolio** (December 2024) sits alongside the timeline rather than in it. It is a separate employment-facing site on its own domain, thomasjbutler.me, so it cannot be archived here and is linked instead.

v2.0's date is inferred, not evidenced. There is no tag for it and the portfolio repo has no commits at all in August or September 2024, so July is the only activity between v1 in June and the October cluster.

## Adding a version

1. Vendor the built site into `public/archive/<id>/`, keeping its own filenames.
2. Add one entry to `src/data/versions.ts`.
3. `npm run shots:archive -- <id>` for the plates.

Everything else, the counts, the rail, the era it belongs to, its accession number and its tech diff against the previous version, is computed.

## Conventions

British spelling. No en-dashes or em-dashes in shipped copy. Comments explain non-obvious decisions only.

Archived snapshots are historical records: they get fixed for path or deploy breakage, never for style. Their dead links are neutralised to `#` with a `data-archived-link` attribute recording the original target.

---

**Thomas J Butler** | [Portfolio](https://thomasjbutler.github.io) | [Commercial](https://thomasjbutler.me) | [LinkedIn](https://www.linkedin.com/in/thomasbutleruk/) | [GitHub](https://github.com/ThomasJButler)

Inspired by The Matrix (1999). Built in Liverpool, UK.
