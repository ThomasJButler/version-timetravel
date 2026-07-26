# DESIGN.md — Version TimeTravel v2

The redesign brief. Hand this to a session along with the screenshots in `screenshots/` and it should be buildable without further design input.

Companion to `CLAUDE.md`, which describes the repository as it exists **today**. This document describes what replaces it. Where the two disagree, this one wins — `CLAUDE.md` gets rewritten at the end of the rebuild.

---

## 1. How to use this document

Attach the reference screenshots when you start. They are the *before*:

| File | What it shows |
|---|---|
| `screenshots/desktop-hero.png` | current landing view, 1440×900 |
| `screenshots/desktop-timeline.png` | current timeline, showing the wasted left half |
| `screenshots/mobile-hero.png` | current mobile landing, iPhone 13 |
| `screenshots/mobile-timeline.png` | current mobile card |

Read them for what is being fixed, not for what to preserve:

- Every version card sits on the **right** of a centre spine; on a 1440px viewport roughly half the screen is empty black. This is the single biggest layout failure.
- Body copy is set in **VT323**, a pixel font, at low contrast. Charming for a version numeral, unreadable for a paragraph.
- The neon-green chrome and the neon-green screenshots **fight each other** — you cannot tell where the site ends and the exhibit begins.
- Only **7 cards** render, and one of them (v3.5) is missing entirely. See §3.2 for why.

Build the loading plate (§11) first and look at it before building anything else. If it isn't genuinely good, the restraint traded away everywhere else reads as loss rather than intent.

---

## 2. What this project is

An archive of one person's portfolio, version by version, from hand-written HTML in January 2024 to a React + shadcn site today. Each entry can be **opened and used as it shipped**, inside a device frame.

It documents the *portfolio*. It does not document itself — there are no TimeTravel versions on the timeline.

Ten entries today, growing by two or three a year. Tone: a fun personal project that should work well. Not trying to win awards.

Deployed to GitHub Pages at `https://thomasjbutler.github.io/version-timetravel/`. That URL does not change.

---

## 3. Non-negotiable plumbing

Do these before any visual work. Each one exists because the current build gets it wrong.

### 3.1 One URL helper, and no root-absolute literals

```ts
export const asset = (p: string) =>
  `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;
```

Every `iframe src`, `img src`, fetch and internal link goes through it. Add a lint rule banning string literals matching `^/(data|archive|images|css|js)/`. The site is served from a sub-path; a leading slash resolves to the domain root and 404s in production only.

### 3.2 Data is imported, never fetched

`src/data/versions.ts` is the single source of truth, typed, imported at build time.

The current code does `fetch('/data/versions.json')`, which 404s under the base path, gets caught, and silently renders a hard-coded `getFallbackData()` array instead. It looks like success. It is why v3.5 has been missing from the live site for months. Importing a module deletes that entire failure class — there is no network call to fail.

```ts
type Status = 'archived' | 'restored' | 'external' | 'pending';

interface Version {
  id: string;              // 'v2.5' — also the URL segment and the anchor
  number: string;          // '2.5' | 'Landing Page' | 'Commercial'
  title: string;           // 'Animation Upgrade'
  date: string;            // 'October 2024' — display
  iso: string;             // '2024-10'  — sort key, drives era grouping
  description: string;     // one or two sentences, human voice
  status: Status;
  isLive?: boolean;        // modifier, orthogonal to status
  path?: string;           // 'archive/v2.5/version25.html' | 'archive/v4/index.html'
  externalUrl?: string;    // external only
  sourceUrl?: string;      // GitHub, optional
  techStack: string[];
  features: string[];
  build?: string;          // 'None (hand-authored)' | 'Vite 7'
  pages?: number;
  screenshots?: { desktop?: string; mobile?: string };
}
```

Authored **oldest first**. The UI never calls `.reverse()` on shared state — derive a display order, don't mutate.

`status` is explicit. Do not infer it from the presence of `isLive` / `isExternal` / `path`, which is what the current code does and why the Commercial entry needs its own duplicated 60-line render branch.

### 3.3 Routing

`BrowserRouter basename={import.meta.env.BASE_URL}`. Two routes:

- `/` — the archive
- `/v/:id?w=1440|834|390` — the viewer, deep-linkable so the portfolio's projects section can link to a specific exhibit at a specific width

Two shims are required, both non-obvious:

**`dist/404.html` must be frame-aware.** GitHub Pages honours exactly one `404.html`, at the artefact root — nested archives can never have their own. A plain copy of `index.html` therefore means every dead link inside an archived snapshot (there are ~18) renders *the entire TimeTravel app inside its own iframe*. Write it as:

```js
if (window.self !== window.top) {
  // render a static "archived page not found" card, stop
} else {
  // boot the SPA
}
```

**`viewer.html` stays as a real static file.** The current public contract is `viewer.html?version=<file>&id=&num=&date=`. Pages cannot redirect, so without a real file at that path every existing bookmark dies silently. Keep it as a shim that maps the old query params onto `/v/:id`.

### 3.4 Stack notes that have moved recently

- **shadcn CLI 4.15** — Base UI is now the default primitive, not Radix. Choose the base explicitly at init. `baseColor` and `style` in `components.json` are **permanent**, so hand-write that file before the first `shadcn add`. shadcn is now a runtime dependency that pulls PostCSS back in; run `npx shadcn eject` once the last component is added.
- **Tailwind 4.3** — `npm i tailwindcss @tailwindcss/vite`, `@import "tailwindcss"`, no config file. **Delete `postcss.config.js`, `postcss` and `autoprefixer`** — v4 handles prefixing itself. Only the CSS entry containing `@import "tailwindcss"` gets processed, so route all CSS through one globals file.
- **React Router v8** is ESM-only, has no `react-router-dom`, and requires Node ≥ 22.22. Bump `.github/workflows/deploy.yml` from Node 18.
- Keep `"build": "vite build"` with a separate `"typecheck": "tsc -b"`. The Vite React-TS template's `tsc -b && vite build` means a stray type error takes down a live URL.
- Ship `<html class="dark">` hard-coded and **no ThemeProvider**. Light tokens are specified below, but the toggle is deferred — it avoids a class of first-paint theme-flash bug for zero user-visible loss.

---

## 4. Art direction — ACCESSION

**The shell stops pretending to be a Matrix terminal and becomes the institution that keeps one.**

Ten exhibits with nothing visually in common — 2024 neon-on-black, a teal-lime gradient banner, a 2026 shadcn neutral — have to sit on one page without fighting. Every solution starts with the shell getting out of the way.

The device that makes it work: **a 16px neutral mat around every screenshot**. A recess, the colour of the page, between the loud thing and the card. It is the load-bearing idea of the whole design. Never remove it; never take it below 10px.

The data already has the anatomy of a museum wall label — a date, a title, a list of materials (`techStack`), a condition (`status`), a location (`path`). The design just tells the truth about that.

Matrix green survives, rationed to one job. See §6.

---

## 5. Colour

One hue family (~150) so the shell never reads as pure black. Declare as custom properties, expose through `@theme inline`. **No raw hex in any component.**

### Dark — default, `:root`

| Token | Value | Role | Contrast on bg |
|---|---|---|---|
| `--bg` | `#0E100E` | page | — |
| `--surface` | `#141714` | card, header, viewer bar | — |
| `--surface-hover` | `#1A1E1A` | hover / raised | — |
| `--mat` | `#0E100E` | plate recess — equals the page, so it reads as a hole through the card | — |
| `--hairline` | `#262B26` | default 1px border | — |
| `--hairline-strong` | `#39413A` | hover / pressed border | — |
| `--ink` | `#D6DBD6` | titles, body | 14.6:1 |
| `--ink-2` | `#9AA39B` | descriptions, label values | 7.4:1 |
| `--ink-3` | `#7C857D` | mono keys, accession numbers | 4.9:1 |
| `--accent` | `#00FF00` | *added or current* — see §6 | 14.0:1 |
| `--accent-soft` | `rgb(0 255 0 / .10)` | fill for new-in-this-version chips | — |
| `--warn` | `#E0A82E` | PENDING badge, viewer failure | 9.5:1 |

Card lift in dark is not a shadow: `inset 0 1px 0 rgb(255 255 255 / .03)` plus the hairline.

### Light — `.light`

| Token | Value | Contrast |
|---|---|---|
| `--bg` | `#ECEEEA` | cool plaster, deliberately not cream |
| `--surface` | `#F6F7F4` | |
| `--surface-hover` | `#FFFFFF` | |
| `--mat` | `#E4E7E2` | |
| `--hairline` | `#D2D7D1` | |
| `--hairline-strong` | `#B4BCB5` | |
| `--ink` | `#171A16` | 15.9:1 |
| `--ink-2` | `#4E554F` | 6.5:1 |
| `--ink-3` | `#646B65` | 4.5:1 |
| `--accent` | `#1F6B33` | 5.8:1 |
| `--accent-soft` | `rgb(31 107 51 / .10)` | |
| `--warn` | `#8A5A00` | 5.2:1 |

Card lift in light: `0 1px 2px rgb(20 24 20 / .06), 0 8px 24px -12px rgb(20 24 20 / .12)`.

`#00FF00` is **1.37:1** on the light wall. It must not exist as a literal anywhere outside the dark block.

### Radii

`6px` cards and viewer frame · `4px` plate mount, buttons, chips · `2px` the screenshot itself · `8px` the mobile thumb. One shadow recipe per theme. No other elevations.

---

## 6. The accent rule

`--accent` means **added, or current**. Nothing else. It appears in exactly five places:

1. the active chronology-rail tick
2. the `:focus-visible` ring
3. the LIVE dot
4. the plate's mount border on hover
5. the `+` glyph and border on a tech chip that is new since the previous version

Never as body text. Never as a fill behind text. Never as a glow. Never as a gradient.

Delete every `--matrix-glow` and `text-shadow` rule from the old system rather than porting and softening them.

The chip diff is computed, not authored: compare each entry's `techStack` against the previous version's. New items get a leading `+`, an accent border and `--accent-soft` fill. Dropped items render last, struck through, in `--ink-3`, no border. Everything else is a plain hairline chip. Zero copywriting.

---

## 7. Typography

Three families, self-hosted via Fontsource, latin subset, woff2, `font-display: swap`. **No Font Awesome** — `lucide-react` only. (The current `index.html` and `viewer.html` both pull Font Awesome from cdnjs; that goes.)

- **Archivo Variable** — display only: hero statement and exhibit titles. Always `font-variation-settings: 'wdth' 112; font-weight: 600`. Preload.
- **Instrument Sans Variable** — body and UI prose. Humanist, quiet at 14–17px, and not Inter. Preload.
- **IBM Plex Mono** 400 + 500 — the utility voice: accession numbers, label keys and values, dates, viewport widths, buttons, chips. Two static weights; there is no widely available variable build, so don't specify 600.
- **VT323** — lazy-loaded, used on exactly one surface: the viewer loading plate (§11).

### Scale — 8px rhythm, 4px sub-grid

| Role | Family | Size / line | Tracking | Colour |
|---|---|---|---|---|
| Hero eyebrow | Plex Mono 500 | 12 / 16, uppercase | +0.14em | ink-3 |
| Hero statement | Archivo 600 | `clamp(2.5rem, 1.6rem + 3vw, 4rem)` / 1.05 | −0.02em | ink |
| Hero sub | Instrument 400 | 17 / 1.6, max 58ch | — | ink-2 |
| Section label | Plex Mono 500 | 11 / 14, uppercase | +0.16em | ink-3 |
| Accession no. | Plex Mono 500 | 13 | +0.10em | ink-3 |
| Exhibit number | Plex Mono 500 | 15, tabular-nums | — | ink-3 |
| Exhibit title | Archivo 600 | 30 / 1.15 (24 / 1.2 below 768) | −0.015em | ink |
| Description | Instrument 400 | 16 / 1.6, max 60ch | — | ink-2 |
| Label key | Plex Mono 500 | 12 / 1.5, uppercase | +0.10em | ink-3 |
| Label value | Plex Mono 400 | 12 / 1.5 | — | ink-2 |
| Changes item | Instrument 400 | 14.5 / 1.65 | — | ink-2 |
| Tech chip | Plex Mono 500 | 11.5, uppercase | +0.04em | ink-2 |
| Button | Plex Mono 500 | 12.5, uppercase | +0.08em | ink |
| Caption | Plex Mono 400 | 11 | +0.06em | ink-3 |

Two hard rules, both fixing current failures:

- Anything that is a **sentence** is Instrument Sans. Anything that is an **identifier, number, key, path or label** is Plex Mono. Body copy is never set in a pixel font.
- Nothing falls below 4.5:1, including 11px captions.

All numerals in the rail, dates and widths use `font-variant-numeric: tabular-nums`.

---

## 8. Layout

Breakpoints: `480 / 768 / 1024 / 1280 / 1560`.

### ≥1280

Container `max-width: 1560px`, inline padding `56px`, `grid-template-columns: 216px minmax(0, 1fr)`, `column-gap: 72px`.

**Left column — the chronology rail.** `position: sticky; top: 88px; max-height: calc(100vh - 120px)`, its own `ScrollArea`, a 1px hairline running full height. Header `CHRONOLOGY`, then era groups with a `Separator` between them:

```
2024 · STATIC
2024–25 · TOOLED
2025+ · REACT
```

Era membership is derived from `iso` + `build`, never hand-assigned. Era headers are **labels, not controls** — there is no filter, because a three-way filter over ten items is a control nobody needs.

A row is 32px: `[12px hairline stub] [2.5] [Oct 24]`, and is a real `<a href="#v2-5">`.

**Right column** — exhibit cards stacked, `gap: 64px`. Nothing alternates sides. Nothing floats. No centre spine. This is the fix for the wasted half-viewport in `screenshots/desktop-timeline.png`.

### 1024–1279

Rail becomes a sticky 44px horizontal chip strip beneath the header — `ScrollArea`, `scroll-snap-type: x proximity`, same active state, era headers become inline dividers. Content single column, `max-width: 900px`, padding 40px.

### <768

Padding 20px, header 52px, chip strip 44px, plus a `Sheet` "Jump to version" holding the full grouped rail. Cards single column, padding 16px, `gap: 40px`.

### Header — all breakpoints

52–56px, sticky, `background: color-mix(in oklab, var(--bg) 85%, transparent)`, `backdrop-filter: blur(12px)`, 1px bottom hairline. Left: a 6px accent square plus `VERSION TIMETRAVEL` in Plex Mono 13 / +0.14em. Right: `Live site ↗`.

> The current header's "Live Portfolio" link and the timeline CTA both point at `https://thomasjbutler.github.io/ThomasJButler/`, which **404s** — that repo has Pages disabled. The live portfolio is `https://thomasjbutler.github.io/`. Fix both.

### Hero — `min-height: 72vh`, not 100vh

- **Eyebrow**: `ARCHIVE / {firstYear} — {lastYear}` — computed.
- **Statement**: *"{n} versions of one portfolio. Every one still runs."* — `n` computed; if any entry is `pending`, the second sentence becomes *"Most of them still run."*
- **Sub**: *"A working archive of thomasjbutler.me — hand-written HTML in January 2024 through React and shadcn today. Open any version and use it as it shipped."*
- **The contact sheet** — the thesis object, and the one thing that makes the page make sense at a glance. A single row of thumbnails, 108×68, 8px gaps, 1px hairline each, year in Plex Mono 10 beneath. Full colour, never tinted: at 108px the neon reads as texture, and you can watch the work get louder and then calm down. Each thumb links to its exhibit; `Tooltip` gives version and date. Horizontal `scroll-snap` below 768.
  - **Kill switch:** render it only if `entriesWithDesktopShot / total >= 0.7`. Below that, render nothing there but the stat line. A strip that is 30% empty reads as unfinished rather than honest.
- Below it, a hairline and one computed line: `{n} versions · {months} months · 1 person`.
- **No stat tiles. No gradient. No rain.**

Every count on the page is derived from the data. No number is ever typed into copy — shipping v6 must not be able to make the page lie.

---

## 9. The exhibit card

Shell, identical in all four states:

```
background: var(--surface);
border: 1px solid var(--hairline);
border-radius: 6px;
padding: 32px;
```

plus the theme's lift recipe. Hover raises the border to `--hairline-strong` over 140ms. Root element is `<article id="{id}" aria-labelledby="{id}-title">`.

**1 · Header strip** — 28px, baseline-aligned. Left: accession number in Plex Mono 500 13 ink-3, `TJB.2024.03`, derived as `TJB.{year}.{ordinal}`. Right: the condition badge, plus an optional `LIVE` badge.

**2 · The plate** — 20px below. A mount: `position: relative; padding: 16px; background: var(--mat); border: 1px solid var(--hairline); border-radius: 4px`. Inside it the desktop screenshot: `aspect-ratio: 16/10; object-fit: cover; object-position: top; border-radius: 2px; loading="lazy"`, with explicit `width`/`height`.

The mobile shot hangs off the lower-left: `position: absolute; bottom: -28px; left: 24px; width: 132px`, `aspect-ratio: 9/19.5`, its own 6px mat, 1px hairline, `border-radius: 8px`, `box-shadow: 0 12px 32px -8px rgb(0 0 0 / .6)`. The card takes `padding-bottom: 60px` to absorb the overhang. Below 1024 it becomes a static inline element at 108px, captioned `Mobile · 390 px`.

Plate hover (all states except external): `cursor: zoom-in`, mount border → accent, a mono `OPEN ↗` fading in bottom-right. The whole plate is one link to `/v/{id}`.

**3 · Label row** — 28px below, `grid-template-columns: minmax(0, 1fr) 300px; gap: 56px`.

*Left:* number and title inline (`2.5` in Plex Mono ink-3, then the title in Archivo 600 30px ink), 12px gap, `description` at 16/1.6 ink-2 max 60ch, 20px gap, then `CHANGES` as a section label and `features` as a two-column list, each prefixed by an 8px hairline dash — not a bullet, not a chevron. Four shown, with a `Collapsible` ghost button reading `Show all {features.length}`.

*Right:* the wall label — 1px left hairline, 24px padding-left, a `<dl>` in Plex Mono 12 with 24px rows:

```
DATE       October 2024
MEDIUM     HTML · CSS · JavaScript · GSAP · ScrollMagic
BUILD      None (hand-authored)
PAGES      6
CONDITION  Archived, static
```

`MEDIUM` renders `techStack` with the computed `+` diff from §6. Then 24px, then the actions stacked full-width: primary (transparent, 1px `--hairline-strong`, ink, 38px, radius 4; hover → accent border + `--surface-hover`) and a ghost `VIEW SOURCE ↗` in ink-3 when `sourceUrl` exists.

**Mobile order:** header strip → plate (mat 10px) → number + title → description → wall label full width with a 72px key column → mobile thumb + caption → changes, single column, 4 shown → actions as 44px full-width buttons.

### 9.1 The four states

| | **Frozen snapshot** | **Vendored SPA** | **External site** | **Archive pending** |
|---|---|---|---|---|
| `status` | `archived` | `restored` | `external` | `pending` |
| Badge | `ARCHIVED` — hairline, ink-3 | `RESTORED` — hairline, ink-2 | `ON LOAN ↗` — hairline, ink-2 | `PENDING` — 1px `--warn`, warn text |
| Applies to | v1, v2, v2.5, Landing, v2.8, v3 | v3.5, v4, v5 once vendored | Commercial → thomasjbutler.me | v4, v5 at launch |
| Plate | screenshot → `/v/{id}` | screenshot → `/v/{id}` | screenshot → `externalUrl`, `target="_blank" rel="noopener"`; hover chip reads `VISIT ↗`; no zoom cursor | screenshot with **no link**, `cursor: default`, no hover treatment |
| `CONDITION` | `Archived, static` | `Restored from source, vendored` | `On loan — hosted elsewhere` | `Not yet archived` |
| Primary action | `OPEN VERSION` | `OPEN VERSION` | `VISIT SITE ↗` | disabled `NOT YET ARCHIVED`, `aria-disabled="true"`, with a 12px mono note: *"Screenshots only for now. The build will be archived here once it's deployed."* |
| Rail tick | solid | solid | solid | **dotted** 12px stub |

`LIVE` is a modifier badge that can sit beside any state — v5 will be restored *and* live.

`RESTORED` must stay honest: a vendored build is not the original deploy. Never label a vendored SPA `ARCHIVED`, and never put an iframe around someone else's live site. The moment either happens the taxonomy is decoration and the design loses its justification.

---

## 10. The viewer — `/v/:id?w=`

Full-bleed, `overflow: hidden` on the shell.

> Remove `html { height: 100% }` from the global stylesheet while you're here. Combined with `body { overflow-y: auto }` it is what currently breaks full-page screenshot capture (§14).

**Top bar, 52px**, `--surface`, 1px bottom hairline, Plex Mono throughout.

- Left: ghost `← ARCHIVE`, returning to `/#{id}` so scroll position is restored. `Separator`, then accession number and title at 13px.
- Centre: `ToggleGroup`, three 32px items labelled with **real widths** — `1440` / `834` / `390` — a lucide glyph plus the mono number. Reflected in the URL as `?w=`.
- Right: `◀ ▶` stepping to previous/next version (skipping `external` and `pending`), then Reload, Fullscreen, `Open raw ↗`. Icon-only buttons get `Tooltip` + `aria-label`.

**Stage** — `--bg` carrying a **static** 3%-opacity glyph-column texture, a pre-rendered SVG data-URI as `background-repeat`, not a running canvas. Device frame centred, `height: calc(100dvh - 52px - 64px)`, width = selected viewport, 1px hairline, radius 6px, `box-shadow: 0 24px 64px -24px rgb(0 0 0 / .7)`.

When the chosen width exceeds the stage, scale it — `transform: scale(stageW / targetW); transform-origin: top center` — and caption it `1440 px · shown at 78%`. Never clip silently, never squash. The current viewer does both.

**Caption under the frame**, centred, 11px mono ink-3, two lines:

```
2.5 · October 2024 · HTML · CSS · JavaScript · GSAP · ScrollMagic
Original build, unmodified · may reference assets that no longer exist
```

The second line does real work. Twelve `src/images/Vincent/*.png` references in the oldest snapshots point at a directory that no longer exists, and roughly eighteen in-page links go to pages that were never in this repo. One honest caption turns a faithful archive into a feature instead of a bug report.

**Keyboard:** `1`/`2`/`3` widths · `←`/`→` previous/next version · `R` reload · `F` fullscreen · `Esc` back to the exhibit you came from. Every state change announced through one `aria-live="polite"` region.

The iframe carries `title="Portfolio version 2.5, October 2024"`, `loading="eager"`, and — for vendored SPAs — `sandbox="allow-scripts allow-same-origin allow-forms"`.

Point the iframe at an **explicit file**, never a bare directory. Vite's dev server rewrites directory URLs to the shell (so you'd see TimeTravel inside its own frame in `npm run dev` only), and Pages 301-redirects directory URLs without a trailing slash.

Keep the existing `frame.src = frame.src` reload idiom. It resets to the original URL because `src` reflects the content attribute; `contentWindow.location.reload()` does not.

---

## 11. The Matrix rain

**Deleted from the archive page entirely.** No ambient canvas, no hero canvas, nothing behind the cards. `src/js/matrix.js` is not mounted on `/`.

This is the biggest departure from the current site and it is deliberate: ten loud screenshots cannot compete with animated wallpaper, and full-bleed rain is the tell of the 2024 build.

**Kept, live and animated, in exactly one place:** the viewer's loading plate. The ported canvas mounts over the frame area on `--bg` — 14px glyphs, ~40ms frame interval, `globalAlpha 0.85` — with `BOOTING v2.5 …` in VT323 48px centred over it. It cross-fades out in 240ms on iframe `load`, or after a 6s timeout, whichever comes first. `useEffect` cleanup must `cancelAnimationFrame` and null the context — the current implementation has no teardown at all.

This is the only loud, animated, nostalgic moment in the product, and it earns its place by being the door between eras rather than decoration.

A third, silent appearance: the static pre-rendered glyph texture on the viewer stage (§10). Image, not canvas.

Under `prefers-reduced-motion: reduce` the loading canvas paints one frame and stops.

---

## 12. Motion

Budget: nothing over 300ms, nothing on scroll except a one-shot reveal, no parallax, no scroll-jacking, no animation library. CSS transitions plus two `IntersectionObserver`s.

- **Load** — header, hero statement, hero sub fade and rise 8px, 260ms `cubic-bezier(.16,1,.3,1)`, 40ms stagger. Three items only. Contact-sheet thumbs fade in at 24ms stagger, opacity only.
- **Scroll reveal** — each card `opacity 0→1, translateY 12px→0`, 300ms, `threshold: 0.15`, fires once then unobserves. **Key off intersection, never `img.complete`** — below-fold plates are lazy, so `complete` never resolves and any promise awaiting it hangs forever. This is a verified trap in this repo.
- **Rail tracking** — a second observer, `rootMargin: '-45% 0px -50% 0px'`. The active row's stub grows 12→20px and turns accent over 180ms; its number goes ink/500; the row scrolls into the rail with `block: 'nearest'`. This is the only thing that moves as you scroll.
- **Hover** — card border 140ms, plate mount border 140ms, buttons 120ms. No lift, no scale, no glow.
- **Viewer** — frame width animates 220ms `cubic-bezier(.16,1,.3,1)`; loading plate cross-fades 240ms.
- **LIVE dot** — static. No pulse.
- **`prefers-reduced-motion: reduce`** — one global block plus a `useReducedMotion()` guard on the canvas: transforms off, opacity fades clamped to 120ms, `scroll-behavior: auto` so hash jumps are instant.

Never hard-code per-child animation delays. The current stylesheet staggers `nth-child(1)` through `(6)` only, so the seventh card onward pops in out of rhythm — a bug that has been live since the seventh version shipped.

---

## 13. Empty, loading and failure states

**Image loading** — `Skeleton` in `--surface-hover`, sized by `AspectRatio` (16/10 desktop, 9/19.5 mobile, 16/10 thumbs) so nothing reflows. Serve AVIF + WebP with `srcset` at 1× and 2×, with explicit `width`/`height`.

**No screenshot yet** — inside the mat, in place of the image: a `--mat` tile with a 1px **dashed** hairline, centred `NOT YET ARCHIVED` in 11px mono ink-3 over a 20px lucide `image-off`. Same aspect ratio as a real plate so the column rhythm holds. No spinner, no "coming soon".

**Viewer failed to load** — if the iframe 404s or refuses framing (6s timeout with no `load`), replace the frame with a `--surface` panel: a mono error block `✗ could not load archive/v4/index.html`, one Instrument Sans sentence — *"This version is preserved as screenshots. The build isn't archived here yet."* — the desktop and mobile stills inline on mats, and buttons `← Archive` and `Source ↗`. Warn-coloured border, not red.

Build this on day one. v4 and v5 will both pass through it, and at least one vendored SPA will refuse to frame.

**External** — `/v/{id}` for an `external` entry never renders an iframe. It shows the desktop still at full size, the label `External site — not archivable`, and a primary `Open thomasjbutler.me ↗`.

**Data failure** — does not exist as a state, by construction (§3.2). If the versions module is missing the build fails, which is the correct place to find out.

---

## 14. Accessibility

- **Contrast floor 4.5:1** for all text including 11px captions. The tokens clear it in both themes. `#00FF00` is tokenised out of light mode, not overridden inline.
- **Focus:** `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }` on every interactive element — plate link, rail row, contact-sheet thumb, button, `Collapsible` trigger. Never removed, never animated. Use `outline`, not `box-shadow`, so it survives forced-colors mode.
- **Semantics:** one `<h1>` (the hero statement). Each card is an `<article>` with its title as `<h2>`. The rail is `<nav aria-label="Version chronology">` with `aria-current="true"` on the active row. The wall label is a `<dl>`.
- **Badges are never colour-only.** Every condition badge carries its word; the LIVE dot always sits beside the text "LIVE"; `PENDING` reads as text, not just amber.
- **Keyboard:** tab order follows visual order; the rail is tabbable; `Sheet` and dialogs trap and restore focus; `Esc` closes.
- **Announcements:** one `aria-live="polite"` region per screen. The viewer announces `"Width 390 pixels"`, `"Loaded version 2.5"`, `"Could not load version 4"`.
- **Tap targets ≥ 44×44** below 768.
- `lang="en"`, and a skip link to `#main` as the first tabbable element (the current site has this — keep it).

---

## 15. shadcn components

`Button` (default / outline / ghost / sm, restyled to mono uppercase 12.5px, radius 4) · `Badge` (outline; four conditions plus the LIVE modifier) · `Card` (shell only — header, plate and label are custom composition) · `Separator` · `Collapsible` · `ToggleGroup` (viewer widths) · `ScrollArea` (rail, chip strip) · `Sheet` (mobile chronology) · `AspectRatio` · `Skeleton` · `Tooltip`.

Explicitly **out of scope**: `Command` + `Dialog` for a ⌘K palette. The rail and contact sheet navigate ten entries fine; it earns its way in at fifteen.

---

## 16. How this maps onto the repository

**Dies:** `src/main.js`, `src/js/{matrix,timeline,viewer}.js` (matrix is ported, not kept), `src/styles/*`, the bodies of `index.html` and `viewer.html`, `postcss.config.js`, `public/data/versions.json`, the `copy-version-files` plugin in `vite.config.js`, the root `version1.html` / `version2.html`, and the four dead files `src/versions/v{1,2}/{style.css,script.js}`.

**Born:** `src/data/versions.ts`, `src/lib/asset.ts`, `src/components/` (rail, exhibit card, plate, wall label, viewer), `src/styles/globals.css` (the single Tailwind entry), `components.json`, a frame-aware `404.html`, and a `viewer.html` legacy shim.

**Moves, unchanged:** every archived snapshot into `public/archive/<id>/`, **keeping its original filename** — `public/archive/v2.5/version25.html`, not `index.html`. Renaming breaks nineteen in-page self-links that resolve correctly today. `css/global.css` is used by `version28.html` alone and moves with it. `src/versions/v1|v2/index.html` are not duplicates of the root files but self-contained rewrites with inlined CSS/JS — they are canonical for v1 and v2.

**One-time rewrite pass** on fourteen root-absolute references the retired plugin was fixing at build time: `version1.html:7,106` · `version2.html:7,107` · `version25.html:7,124` · `version28.html:7,8,347,255,269,283` · `version30.html:124,613`.

**Before creating `public/archive/`:** anchor `.gitignore`. `dist/` is unanchored and matches at any depth, so a vendored build would be silently, invisibly never committed. Change it to `/dist/` and add `!public/archive/**`.

### 16.1 Archiving a React version — tested recipe

A built React app is just static files, so v3.5 / v4 / v5 become fully interactive mini-sites in the iframe exactly like `version28.html`. This was spiked end to end against `v4.0-ShadCNRedesign`; the steps below are what actually worked, not what was assumed.

1. Clone the pinned ref into a scratch directory — never build in the archive folder.
2. **Router patch** — swap the app's `BrowserRouter` for `MemoryRouter` with `initialEntries={['/']}` and no basename, so the archive cannot write to the parent's URL or session history. Both were verified: parent URL unchanged and **zero** history entries added while navigating inside the frame. **See the caveat below — this step is not finished.**
3. Drop `index.html` and `blog.html` from `build.rollupOptions.input`. They are `<meta http-equiv="refresh">` shells pointing at `/react.html`, Vite never rewrites `http-equiv`, and leaving them in means the archive silently redirects to the current live site.
4. Build with `base: '/version-timetravel/archive/<id>/'`, then rename `dist/react.html` → `index.html`.
5. Delete `sw.js`, `manifest.json` and any nested `404.html` from the output, **and strip the `<link rel="manifest">` and `<link rel="icon">` tags** that reference them — otherwise the archive 404s on load.
6. Copy the **contents** of `dist` into `public/archive/<id>/`, with an `ARCHIVE.txt` recording ref, SHA and build date.
7. Gate before committing — note the exclusion, without which the gate flags its own correct output:

   ```sh
   grep -rnE '(src|href)="/[^"]*|http-equiv="refresh"|location\.replace\(.[/]' public/archive/<id>/ \
     | grep -v '="/version-timetravel/archive/<id>/'
   ```

Measured on v4: **1.1 MB, 36 files, 7s build**. Vendoring all three is roughly 3 MB against a repo that is currently 222 KB, so size is a non-issue.

**Open caveat — the router patch needs more work.** With `MemoryRouter`, clicking an internal nav link updates the active route (the nav highlights correctly) but the destination page rendered inconsistently in the spike — sometimes a section stuck at `opacity: 0`, sometimes no `<section>` in `<main>` at all. The same build with the original `BrowserRouter` renders those routes correctly (2 sections, one visible on arrival, both after a scroll). So this is caused by the patch or its interaction with the app, **not** by iframing, the base path, or the archive layout. The prime suspect is `Layout.tsx:23`, which keys an `AnimatePresence` child on `location.pathname`, combined with `MotionSection`'s `whileInView` + `viewport={{ once: true, margin: '-50px' }}`. Resolve this before vendoring anything; do not ship an archive whose secondary pages are blank. If it proves stubborn, the fallback is to keep `BrowserRouter` and accept that the visitor's Back button walks the archive's internal routes before leaving the viewer.

---

## 17. Definition of done

- [ ] Adding a version is **one edit** to `src/data/versions.ts`. Nothing else. Verify by adding a fake entry and confirming it appears in the rail, the contact sheet, the counts, the card list and the viewer's prev/next chain.
- [ ] No root-absolute URL literal survives anywhere in `src/`.
- [ ] Zero console errors on load, in dev and in the built output.
- [ ] `/version-timetravel/v/v3.5?w=390` restores version and width after a hard refresh; a legacy `viewer.html?version=version30.html` URL still lands correctly.
- [ ] Validate the archive with a **plain static server** (`python3 -m http.server` from `dist/`), never `vite preview` — `appType: 'spa'` makes preview serve `index.html` for every missing path, which masks exactly the 404s you are checking for.
- [ ] Every card looks right in all four states, including with no screenshot at all.
- [ ] Keyboard-only: reach and open every version, change widths, and get back, without a mouse.
- [ ] `prefers-reduced-motion` kills all transforms and stops the canvas.
- [ ] Fresh 1440×900 and 390×844 captures for the portfolio's projects section. Viewport-sized shots plus `scrollIntoView` — full-page capture repeats the first viewport on this page, and awaiting `img.complete` never resolves on lazy plates.

---

## 18. Content still needed

1. **Desktop and mobile screenshots for v4 and v5.** Everything else has one.
2. **Re-shoot the rest at fixed 1440×900 / 390×844.** A neutral 16px mat makes mismatched crops obvious. The current data is already wrong: `v3` and `v3.5` point at the same Cloudinary asset, and for both entries the desktop and mobile URLs are identical — four figures rendering one image.
3. **A one-or-two-sentence `description` per version.** The existing `features[]` arrays are brochure phrasing and cannot carry the label row alone.
4. **`status`, `iso`, `build` and `pages` backfilled** for every entry.
5. A decision on the screenshots themselves: all of them live on one free Cloudinary account with no local copy. That is the single biggest rot risk in this repository.
