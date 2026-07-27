# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A working archive of Thomas's portfolio, version by version. Each entry can be opened and used as it shipped, inside a device frame. It documents the *portfolio*; it does not document itself, so there are no TimeTravel versions on the timeline.

React 19 + TypeScript + Vite + Tailwind v4 + shadcn (on Base UI). Deployed to GitHub Pages at `https://thomasjbutler.github.io/version-timetravel/`.

The design is **ACCESSION**. `DESIGN.md` is the written spec. The five-frame visual prototype it was built from (`design_handoff_version_timetravel_v2/`) has shipped and moved out of the repo; `DESIGN.md` is now the sole reference for measurements, plumbing, look and shipped copy.

## Commands

```bash
npm run dev            # Vite dev server on port 3000
npm run typecheck      # tsc -b, kept out of `build` so a type error can't take down the live URL
npm run build          # bundles, then writes dist/404.html and copies the viewer shim
python3 scripts/serve-pages.py   # serve dist/ the way Pages does — see below
```

**Do not verify with `vite preview`.** `appType` defaults to `'spa'`, so preview serves `index.html` for every missing path. That masks exactly the 404s worth checking and makes a broken archive look fine. `scripts/serve-pages.py` reproduces Pages properly: 404 status with the `404.html` body, URL preserved.

No test suite or linter yet.

## Architecture

### Two halves, as before, but the boundary moved

**The shell** is `src/`, bundled by Vite. Routes are `/` (`src/routes/Archive.tsx`) and `/v/:id` (`src/routes/Viewer.tsx`, lazily loaded so VT323 and the rain canvas cost the archive page nothing).

**The archive** is `public/archive/<id>/`, copied verbatim by Vite and never bundled. Snapshots keep their **original filenames** (`public/archive/v2.5/version25.html`, not `index.html`) because renaming breaks in-page self-links that resolve today. Each folder is self-contained: its own `css/` and `js/` where it needs them.

### The rules that keep it working

- **`src/data/versions.ts` is the single source of truth**, imported at build time, never fetched. The old build fetched a JSON file without the base path; it 404'd, got caught, and silently rendered a hard-coded fallback array, which is why v3.5 never appeared on the live site for months. Adding a version is one edit to this file.
- **Every URL goes through `asset()`** (`src/lib/asset.ts`). The site is served from a sub-path, so a leading slash resolves to the domain root and 404s in production only.
- **Everything countable is derived** in `src/lib/archive.ts` — counts, date range, era grouping, accession numbers, the tech-chip diff. No number is typed into copy, so shipping v6 cannot make the page lie.
- **`dist/404.html` is frame-aware.** Pages honours exactly one root 404, so a plain copy of `index.html` would boot the whole app inside an archived snapshot's iframe whenever a visitor clicks one of that snapshot's dead links. The `pagesFallback` plugin in `vite.config.ts` injects a `window.self !== window.top` guard.
- **`viewer.html` is a real static file**, not a route. It maps the legacy `?version=&id=&num=&date=` contract onto `/v/:id`. Pages cannot redirect, so deleting it would silently kill every existing bookmark.
- **Point iframes at an explicit file**, never a bare directory. Vite's dev server rewrites directory URLs to the shell, and Pages 301s directory URLs without a trailing slash.

### Design tokens

`src/styles/globals.css`. The palette is one hue family; `:root` is light, `.dark` is dark, and the app ships `<html class="dark">` with no ThemeProvider.

The green is `--phosphor`, **not** `--accent` — shadcn reserves `--accent` for hover surfaces, and letting them collide gives every shadcn component a bright green hover. A compatibility block maps shadcn's expected token names onto this palette so `shadcn add` components render correctly.

`--phosphor` means **added, or current**, and appears in exactly five places: the active rail tick, the focus ring, the LIVE dot, the plate's hover border, and the `+` on a tech chip new since the previous version. Never as body text, a fill behind text, a glow, or a gradient.

Fonts are declared as explicit `@font-face` rules rather than the Fontsource entry points, for two reasons: latin subsets only, and Archivo must be the *standard* (width + weight) file or `'wdth' 112` is inert.

### Things that will bite

- **The 16px mat around every screenshot is load-bearing**, not decoration. It is what lets ten mutually inconsistent screenshots share a page. Never take it below 10px.
- **Never key animations off `img.complete`.** Below-fold plates are lazy, so it never resolves and any promise awaiting it hangs forever.
- **Never hard-code per-child animation delays.** The old stylesheet staggered `nth-child(1..6)` only, so the seventh card onward popped in out of rhythm — live since the seventh version shipped.
- Archived snapshots are historical records. Fix them only for path or deploy breakage, never for style. Their ~16 dead links are already neutralised to `#` with a `data-archived-link` attribute recording the original target.

## Conventions

- British spelling in code and comments (`initialise`, `optimisation`).
- **No en- or em-dashes in shipped copy.** Use "to", a comma, or a full stop.
- Comments explain non-obvious decisions only. Commit `9bccd7a` deliberately stripped ~240 lines of narrating comments; do not reintroduce that style.
- `screenshots/` holds reference captures. Full-page capture does not work on this app: take viewport-sized shots and `scrollIntoView()`.
