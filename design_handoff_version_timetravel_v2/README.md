# Handoff: Version TimeTravel v2 — ACCESSION

## Overview

A redesign of **Portfolio Version TimeTravel** (`https://thomasjbutler.github.io/version-timetravel/`), an archive of one person's portfolio, version by version, from hand-written HTML in early 2024 to a React + shadcn site today. Each entry can be opened and used as it shipped, inside a device frame.

The redesign is called **ACCESSION**. Its thesis: *the shell stops pretending to be a Matrix terminal and becomes the institution that keeps one.* Ten exhibits with nothing visually in common have to sit on one page without fighting, so the shell gets out of the way and the exhibits do the talking.

This bundle contains the visual design. The authoritative written spec is the project's own **`DESIGN.md`**, which covers plumbing, routing, data shape and repository mapping. Where this README and `DESIGN.md` disagree on measurements, `DESIGN.md` wins; where they disagree on shipped copy, this README wins (see Open Questions).

## About the Design Files

`Version TimeTravel v2 ACCESSION.dc.html` is a **design reference created in HTML**. It is a prototype showing intended look and behaviour, not production code to copy directly.

The task is to **recreate this design in the target codebase** using its established patterns: React 19 + Vite + Tailwind 4 + shadcn, per `DESIGN.md` §3.4. Do not port the prototype's markup. It uses inline styles and a single flat document to show five screens side by side; the real build is a routed SPA with components.

Open the file in a browser to view it. `support.js` must sit alongside it.

## Fidelity

**High-fidelity.** Colours, typography, spacing, radii and states are final and specified exactly. Recreate them precisely using the codebase's libraries. Every hex, size and letter-spacing value in this document is intentional and contrast-checked.

The one exception is imagery, see **Assets**.

## Screens / Views

The prototype presents five frames, labelled A to E. Frames A to C are regions of the single archive route `/`; frames D and E are the viewer route `/v/:id`.

### A — Archive landing (hero)

**Purpose.** Establish what the archive is in one screen, and give an at-a-glance sense of the whole ten-version arc.

**Layout.** Sticky header 56px, then hero with `padding: 72px 56px 0`, `min-height: 72vh` (not 100vh). Single column, left-aligned, container `max-width: 1560px`.

**Components.**

- **Header.** 56px, sticky, `background: color-mix(in oklab, var(--bg) 85%, transparent)`, `backdrop-filter: blur(12px)`, 1px bottom hairline `#262B26`. Left: a 6px accent square `#00FF00` then `VERSION TIMETRAVEL` in IBM Plex Mono 500, 13px, `letter-spacing: 0.14em`, colour `#D6DBD6`. Right: `Live site ↗` in Plex Mono 12px, `#9AA39B`.
- **Eyebrow.** Plex Mono 500, 12px / 16px, uppercase, `letter-spacing: 0.14em`, `#7C857D`. Copy: `ARCHIVE / 2024 to 2026`. **Computed** from the first and last entry years, never typed.
- **Statement (h1).** Archivo 600, `clamp(2.5rem, 1.6rem + 3vw, 4rem)` (64px at 1440), `line-height: 1.05`, `letter-spacing: -0.02em`, `#D6DBD6`, `font-variation-settings: 'wdth' 112`. Copy: `10 versions of one portfolio. Most of them still run.` The count is computed; the second sentence is `Every one still runs.` unless any entry has `status: 'pending'`, in which case it becomes `Most of them still run.`
- **Sub.** Instrument Sans 400, 17px / 1.6, `max-width: 58ch`, `#9AA39B`. Copy: `A working archive of thomasjbutler.me, hand-written HTML in January 2024 through React and shadcn today. Open any version and use it as it shipped.`
- **Contact sheet.** The thesis object. A single row of ten thumbnails, each 108×68, `gap: 8px`, `border: 1px solid #262B26`, `border-radius: 2px`. Year beneath each in Plex Mono 10px `#7C857D`, centred. Each thumb is a link to its exhibit anchor; a `Tooltip` gives version and date. Full colour, never tinted: at 108px the neon reads as texture and you can watch the work get louder and then calm down. Horizontal `scroll-snap` below 768px.
  - **Kill switch.** Render the sheet only if `entriesWithDesktopShot / total >= 0.7`. Below that, render nothing there but the stat line. A strip that is 30% empty reads as unfinished rather than honest.
- **Stat line.** A hairline `#262B26` with `margin: 44px 0 20px`, then Plex Mono 500, 13px, `letter-spacing: 0.10em`, `#7C857D`, `font-variant-numeric: tabular-nums`. Copy: `10 versions · 30 months · 1 person`. All three numbers computed.
- **No stat tiles. No gradient. No Matrix rain.** See Interactions.

### B — Chronology rail + exhibit card

**Purpose.** Navigate ten entries, and read one exhibit in full.

**Layout.** At ≥1280: `grid-template-columns: 216px minmax(0, 1fr)`, `column-gap: 72px`, container `max-width: 1560px`, inline padding 56px.

**Left column, the chronology rail.** `position: sticky; top: 88px; max-height: calc(100vh - 120px)`, its own `ScrollArea`, a 1px hairline running full height. Header `CHRONOLOGY` in Plex Mono 500, 11px / 14px, uppercase, `letter-spacing: 0.16em`, `#7C857D`. Then era groups with a `Separator` between them:

```
2024 · STATIC
2024-25 · TOOLED
2025+ · REACT
```

Era membership is derived from `iso` + `build`, never hand-assigned. Era headers are **labels, not controls**: there is no filter, because a three-way filter over ten items is a control nobody needs.

A row is 32px and is a real `<a href="#v2-5">`: `[12px hairline stub] [2.5] [Oct 24]`. Number in Plex Mono 500, 15px, `tabular-nums`, `#7C857D`. The active row's stub grows 12→20px and turns `#00FF00`; its number goes `#D6DBD6` at weight 500. `aria-current="true"` on the active row. `pending` entries get a **dotted** 12px stub.

**Right column.** Exhibit cards stacked, `gap: 64px`. Nothing alternates sides, nothing floats, no centre spine. This is the fix for the old build's wasted half-viewport.

**The exhibit card.** Root is `<article id="{id}" aria-labelledby="{id}-title">`.

```
background: #141714;          /* --surface */
border: 1px solid #262B26;    /* --hairline */
border-radius: 6px;
padding: 32px;
padding-bottom: 60px;         /* absorbs the mobile-thumb overhang */
box-shadow: inset 0 1px 0 rgb(255 255 255 / .03);
```

Hover raises the border to `#39413A` over 140ms.

1. **Header strip**, 28px, baseline-aligned. Left: accession number in Plex Mono 500, 13px, `letter-spacing: 0.10em`, `#7C857D`, format `TJB.2024.03`, derived as `TJB.{year}.{ordinal}`. Right: the condition badge, plus an optional `LIVE` badge.

2. **The plate**, 20px below. This is the load-bearing idea of the whole design: a 16px neutral mat between the loud thing and the card.

```
position: relative;
padding: 16px;
background: #0E100E;          /* --mat, equals --bg so it reads as a hole */
border: 1px solid #262B26;
border-radius: 4px;
```

   Inside it the desktop screenshot: `aspect-ratio: 16/10; object-fit: cover; object-position: top; border-radius: 2px; loading="lazy"`, with explicit `width`/`height`. **Never take the mat below 10px and never remove it.**

   The mobile shot hangs off the lower-left: `position: absolute; bottom: -28px; left: 24px; width: 132px`, `aspect-ratio: 9/19.5`, its own 6px mat, 1px hairline `#262B26`, `border-radius: 8px`, `box-shadow: 0 12px 32px -8px rgb(0 0 0 / .6)`. Below 1024 it becomes a static inline element at 108px, captioned `Mobile · 390 px`.

   Plate hover (all states except `external` and `pending`): `cursor: zoom-in`, mount border → `#00FF00`, and a Plex Mono `OPEN ↗` fading in bottom-right. The whole plate is one link to `/v/{id}`.

3. **Label row**, 28px below: `grid-template-columns: minmax(0, 1fr) 300px; gap: 56px`.

   *Left:* number and title inline (`2.5` in Plex Mono `#7C857D`, then the title in Archivo 600, 30px / 1.15, `letter-spacing: -0.015em`, `#D6DBD6`), 12px gap, `description` in Instrument Sans 16px / 1.6 `#9AA39B` `max-width: 60ch`, 20px gap, then `CHANGES` as a section label and `features` as a two-column list. Each item is Instrument Sans 14.5px / 1.65 `#9AA39B`, prefixed by an 8px hairline dash. Not a bullet, not a chevron. Four shown, with a `Collapsible` ghost button reading `Show all {features.length}`.

   *Right:* the wall label. 1px left hairline, `padding-left: 24px`, a `<dl>` in Plex Mono 12px with 24px rows. Keys uppercase 500 `letter-spacing: 0.10em` `#7C857D`; values 400 `#9AA39B`.

```
DATE       October 2024
MEDIUM     HTML · CSS · JavaScript · GSAP · ScrollMagic
BUILD      None (hand-authored)
PAGES      6
CONDITION  Archived, static
```

   `MEDIUM` renders `techStack` with a **computed** diff against the previous version: new items get a leading `+`, a `#00FF00` border and `rgb(0 255 0 / .10)` fill; dropped items render last, struck through, `#7C857D`, no border; everything else is a plain hairline chip. Chips are Plex Mono 500, 11.5px, uppercase, `letter-spacing: 0.04em`, radius 4px. Zero copywriting.

   Then 24px, then actions stacked full-width: primary is transparent with `1px solid #39413A`, `#D6DBD6`, 38px tall, radius 4, Plex Mono 500 12.5px uppercase `letter-spacing: 0.08em`; hover → `#00FF00` border and `#1A1E1A` fill. Plus a ghost `VIEW SOURCE ↗` in `#7C857D` when `sourceUrl` exists.

**Mobile order (<768):** header strip → plate (mat 10px) → number + title → description → wall label full width with a 72px key column → mobile thumb + caption → changes, single column, 4 shown → actions as 44px full-width buttons.

### C — The four condition states

**Purpose.** One card shell tells four different truths. Only the badge, the plate's behaviour, the `CONDITION` line and the primary action change.

| | **Frozen snapshot** | **Vendored SPA** | **External site** | **Archive pending** |
|---|---|---|---|---|
| `status` | `archived` | `restored` | `external` | `pending` |
| Badge | `ARCHIVED`, hairline, `#7C857D` | `RESTORED`, hairline, `#9AA39B` | `ON LOAN ↗`, hairline, `#9AA39B` | `PENDING`, 1px `#E0A82E`, warn text |
| Applies to | v1, v2, v2.5, Landing, v2.8, v3 | v3.5, v4, v5 once vendored | Commercial → thomasjbutler.me | v4, v5 at launch |
| Plate | screenshot → `/v/{id}` | screenshot → `/v/{id}` | screenshot → `externalUrl`, `target="_blank" rel="noopener"`, hover chip reads `VISIT ↗`, no zoom cursor | screenshot with **no link**, `cursor: default`, no hover treatment |
| `CONDITION` | `Archived, static` | `Restored from source, vendored` | `On loan, hosted elsewhere` | `Not yet archived` |
| Primary action | `OPEN VERSION` | `OPEN VERSION` | `VISIT SITE ↗` | disabled `NOT YET ARCHIVED`, `aria-disabled="true"`, plus a 12px mono note: *"Screenshots only for now. The build will be archived here once it's deployed."* |
| Rail tick | solid | solid | solid | **dotted** 12px stub |

`LIVE` is a modifier badge that can sit beside any state; v5 will be `restored` **and** live. The LIVE dot is `#00FF00`, 6px, and always sits beside the literal text `LIVE`.

**`RESTORED` must stay honest.** A vendored build is not the original deploy. Never label a vendored SPA `ARCHIVED`, and never put an iframe around someone else's live site. The moment either happens the taxonomy is decoration and the design loses its justification.

### D — Viewer, loading plate

**Purpose.** The door between eras, and the one place the Matrix rain survives.

**Layout.** Full-bleed, `overflow: hidden` on the shell. Top bar 52px, then the stage.

**Top bar.** `background: #141714`, 1px bottom hairline, Plex Mono throughout.
- Left: ghost `← ARCHIVE` returning to `/#{id}` so scroll position is restored. `Separator`, then accession number and title at 13px.
- Centre: `ToggleGroup`, three 32px items labelled with **real widths**, `1440` / `834` / `390`, each a lucide glyph plus the mono number. Reflected in the URL as `?w=`.
- Right: `◀ ▶` stepping to previous/next version (skipping `external` and `pending`), then Reload, Fullscreen, `Open raw ↗`. Icon-only buttons need `Tooltip` + `aria-label`.

**Stage.** `background: #0E100E` carrying a **static** 3%-opacity glyph-column texture, a pre-rendered SVG data-URI as `background-repeat`. Not a running canvas. Device frame centred, `height: calc(100dvh - 52px - 64px)`, width = selected viewport, 1px hairline `#262B26`, radius 6px, `box-shadow: 0 24px 64px -24px rgb(0 0 0 / .7)`.

**The loading plate.** The ported rain canvas mounts over the frame area on `#0E100E`: 14px glyphs, ~40ms frame interval, `globalAlpha 0.85`. Over it, `BOOTING v2.5 …` in **VT323 48px**, `#00FF00`, centred. Cross-fades out in 240ms on iframe `load`, or after a 6s timeout, whichever comes first. `useEffect` cleanup **must** `cancelAnimationFrame` and null the context; the old implementation had no teardown at all. Under `prefers-reduced-motion: reduce` it paints one frame and stops.

**Caption under the frame**, centred, Plex Mono 11px `#7C857D`, two lines:

```
2.5 · October 2024 · 97% · CSS · JavaScript · GSAP · ScrollMagic
Original build, unmodified · may reference assets that no longer exist
```

The second line does real work. Roughly twelve `src/images/Vincent/*.png` references in the oldest snapshots point at a directory that no longer exists, and about eighteen in-page links go to pages that were never in this repo. One honest caption turns a faithful archive into a feature instead of a bug report.

When the chosen width exceeds the stage, scale it: `transform: scale(stageW / targetW); transform-origin: top center`, and caption it `1440 px · shown at 78%`. **Never clip silently, never squash.** The old viewer did both.

### E — Viewer, loaded + failure

Same chrome, rain gone, iframe live. The iframe carries `title="Portfolio version 2.5, October 2024"`, `loading="eager"`, and for vendored SPAs `sandbox="allow-scripts allow-same-origin allow-forms"`.

**Failure state.** If the iframe 404s or refuses framing (6s timeout with no `load`), replace the frame with a `#141714` panel, `#E0A82E` border, not red: a mono error block `✗ could not load archive/v4/index.html`, one Instrument Sans sentence *"This version is preserved as screenshots. The build isn't archived here yet."*, the desktop and mobile stills inline on mats, and buttons `← Archive` and `Source ↗`. **Build this on day one:** v4 and v5 will both pass through it, and at least one vendored SPA will refuse to frame.

**External.** `/v/{id}` for an `external` entry never renders an iframe. It shows the desktop still at full size, the label `External site, not archivable`, and a primary `Open thomasjbutler.me ↗`.

## Interactions & Behavior

**The accent rule.** `#00FF00` means **added, or current**. Nothing else. It appears in exactly five places: the active rail tick, the `:focus-visible` ring, the LIVE dot, the plate's mount border on hover, and the `+` glyph/border on a tech chip that is new since the previous version. Never as body text, never as a fill behind text, never as a glow, never as a gradient. Delete every `--matrix-glow` and `text-shadow` rule from the old system rather than porting and softening them.

**Motion budget.** Nothing over 300ms, nothing on scroll except a one-shot reveal, no parallax, no scroll-jacking, no animation library. CSS transitions plus two `IntersectionObserver`s.

- **Load.** Header, hero statement, hero sub fade and rise 8px, 260ms `cubic-bezier(.16,1,.3,1)`, 40ms stagger. Three items only. Contact-sheet thumbs fade in at 24ms stagger, opacity only.
- **Scroll reveal.** Each card `opacity 0→1, translateY 12px→0`, 300ms, `threshold: 0.15`, fires once then unobserves. **Key off intersection, never `img.complete`.** Below-fold plates are lazy, so `complete` never resolves and any promise awaiting it hangs forever. This is a verified trap in this repository.
- **Rail tracking.** A second observer, `rootMargin: '-45% 0px -50% 0px'`. Stub grows and turns accent over 180ms; the row scrolls into the rail with `block: 'nearest'`. This is the only thing that moves as you scroll.
- **Hover.** Card border 140ms, plate mount border 140ms, buttons 120ms. No lift, no scale, no glow.
- **Viewer.** Frame width animates 220ms `cubic-bezier(.16,1,.3,1)`; loading plate cross-fades 240ms.
- **LIVE dot.** Static. No pulse.
- **Never hard-code per-child animation delays.** The old stylesheet staggered `nth-child(1)` to `(6)` only, so the seventh card onward popped in out of rhythm, a bug live since the seventh version shipped.
- **`prefers-reduced-motion: reduce`.** One global block plus a `useReducedMotion()` guard on the canvas: transforms off, opacity fades clamped to 120ms, `scroll-behavior: auto` so hash jumps are instant.

**The Matrix rain is deleted from the archive page entirely.** No ambient canvas, no hero canvas, nothing behind the cards. `src/js/matrix.js` is not mounted on `/`. This is the biggest departure from the current site and it is deliberate: ten loud screenshots cannot compete with animated wallpaper, and full-bleed rain is the tell of the 2024 build. It survives in exactly one place, the viewer's loading plate, where it earns its keep as the door between eras.

**Keyboard.** Viewer: `1`/`2`/`3` widths, `←`/`→` previous/next version, `R` reload, `F` fullscreen, `Esc` back to the exhibit you came from. Tab order follows visual order; the rail is tabbable; `Sheet` and dialogs trap and restore focus.

**Responsive.** Breakpoints `480 / 768 / 1024 / 1280 / 1560`.
- **1024 to 1279:** rail becomes a sticky 44px horizontal chip strip beneath the header, `ScrollArea`, `scroll-snap-type: x proximity`, same active state, era headers become inline dividers. Content single column, `max-width: 900px`, padding 40px.
- **<768:** padding 20px, header 52px, chip strip 44px, plus a `Sheet` "Jump to version" holding the full grouped rail. Cards single column, padding 16px, `gap: 40px`. Tap targets ≥ 44×44.

**Loading and empty states.**
- **Image loading.** `Skeleton` in `#1A1E1A`, sized by `AspectRatio` (16/10 desktop, 9/19.5 mobile, 16/10 thumbs) so nothing reflows. Serve AVIF + WebP with `srcset` at 1× and 2×, explicit `width`/`height`.
- **No screenshot yet.** Inside the mat, in place of the image: a `#0E100E` tile with a 1px **dashed** `#39413A` hairline, centred `NOT YET ARCHIVED` in Plex Mono 11px `#7C857D` over a 20px lucide `image-off`. Same aspect ratio as a real plate so the column rhythm holds. No spinner, no "coming soon".
- **Data failure does not exist as a state, by construction.** `src/data/versions.ts` is imported at build time, not fetched. If the module is missing the build fails, which is the correct place to find out.

## State Management

Per `DESIGN.md` §3.2, data is a typed module import, never a fetch.

```ts
type Status = 'archived' | 'restored' | 'external' | 'pending';

interface Version {
  id: string;              // 'v2.5' — also the URL segment and the anchor
  number: string;          // '2.5' | 'Landing Page' | 'Commercial'
  title: string;           // 'Animation Upgrade'
  date: string;            // 'October 2024' — display
  iso: string;             // '2024-10' — sort key, drives era grouping
  description: string;     // one or two sentences, human voice
  status: Status;
  isLive?: boolean;        // modifier, orthogonal to status
  path?: string;           // 'archive/v2.5/version25.html'
  externalUrl?: string;    // external only
  sourceUrl?: string;      // GitHub, optional
  techStack: string[];
  features: string[];
  build?: string;          // 'None (hand-authored)' | 'Vite 7'
  pages?: number;
  screenshots?: { desktop?: string; mobile?: string };
}
```

Authored **oldest first**. The UI never calls `.reverse()` on shared state; derive a display order, do not mutate. `status` is explicit and never inferred from the presence of `isLive` / `path`, which is what the old code did and why the Commercial entry needed its own duplicated 60-line render branch.

**Component state:** active rail id (from the scroll observer), `Collapsible` open state per card, viewer width (URL-synced via `?w=`), iframe load/error/timeout status.

**Every count on the page is derived from the data.** No number is ever typed into copy. Shipping v6 must not be able to make the page lie.

**Routing.** `BrowserRouter basename={import.meta.env.BASE_URL}`, two routes: `/` the archive, `/v/:id?w=1440|834|390` the viewer, deep-linkable so the portfolio's projects section can link to a specific exhibit at a specific width. Two non-obvious shims are required, both documented in `DESIGN.md` §3.3: a **frame-aware `dist/404.html`** (a plain copy of `index.html` makes every dead link inside an archived snapshot render the entire app inside its own iframe), and **`viewer.html` kept as a real static file** mapping the old `?version=&id=&num=&date=` contract onto `/v/:id`, because Pages cannot redirect and every existing bookmark would otherwise die silently.

## Design Tokens

One hue family (~150) so the shell never reads as pure black. Declare as custom properties, expose through `@theme inline`. **No raw hex in any component.**

### Dark, default, `:root`

| Token | Value | Role | Contrast on bg |
|---|---|---|---|
| `--bg` | `#0E100E` | page | — |
| `--surface` | `#141714` | card, header, viewer bar | — |
| `--surface-hover` | `#1A1E1A` | hover / raised | — |
| `--mat` | `#0E100E` | plate recess, equals the page so it reads as a hole | — |
| `--hairline` | `#262B26` | default 1px border | — |
| `--hairline-strong` | `#39413A` | hover / pressed border | — |
| `--ink` | `#D6DBD6` | titles, body | 14.6:1 |
| `--ink-2` | `#9AA39B` | descriptions, label values | 7.4:1 |
| `--ink-3` | `#7C857D` | mono keys, accession numbers | 4.9:1 |
| `--accent` | `#00FF00` | added or current | 14.0:1 |
| `--accent-soft` | `rgb(0 255 0 / .10)` | fill for new-in-this-version chips | — |
| `--warn` | `#E0A82E` | PENDING badge, viewer failure | 9.5:1 |

Card lift in dark is not a shadow: `inset 0 1px 0 rgb(255 255 255 / .03)` plus the hairline.

### Light, `.light`

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

`#00FF00` is **1.37:1** on the light wall. It must not exist as a literal anywhere outside the dark block. Ship `<html class="dark">` hard-coded with **no ThemeProvider**: light tokens are specified, but the toggle is deferred to avoid a class of first-paint theme-flash bug for zero user-visible loss.

### Radii

`6px` cards and viewer frame · `4px` plate mount, buttons, chips · `2px` the screenshot itself · `8px` the mobile thumb. One shadow recipe per theme. No other elevations.

### Spacing

8px rhythm with a 4px sub-grid. Key values in use: card padding 32px, card `padding-bottom` 60px, card gap 64px, plate mat 16px (10px mobile), label row gap 56px, wall-label `padding-left` 24px and row height 24px, rail column 216px, grid `column-gap` 72px, container inline padding 56px.

### Typography

Three families, self-hosted via Fontsource, latin subset, woff2, `font-display: swap`. **No Font Awesome**, `lucide-react` only. The old `index.html` and `viewer.html` both pull Font Awesome from cdnjs; that goes.

- **Archivo Variable** — display only: hero statement and exhibit titles. Always `font-variation-settings: 'wdth' 112; font-weight: 600`. Preload. Load the variable axes (`wdth,wght@62..125,400..700`) or `'wdth'` is inert.
- **Instrument Sans Variable** — body and UI prose. Humanist, quiet at 14 to 17px, and not Inter. Preload.
- **IBM Plex Mono** 400 + 500 — the utility voice: accession numbers, label keys and values, dates, viewport widths, buttons, chips. Two static weights; there is no widely available variable build, so do not specify 600.
- **VT323** — lazy-loaded, used on exactly one surface: the viewer loading plate.

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

Two hard rules, both fixing failures in the current build:

- Anything that is a **sentence** is Instrument Sans. Anything that is an **identifier, number, key, path or label** is Plex Mono. **Body copy is never set in a pixel font.** The old site set paragraphs in VT323 at low contrast.
- Nothing falls below 4.5:1, including 11px captions.

All numerals in the rail, dates and widths use `font-variant-numeric: tabular-nums`.

## Accessibility

- **Contrast floor 4.5:1** for all text including 11px captions. The tokens clear it in both themes. `#00FF00` is tokenised out of light mode, not overridden inline.
- **Focus.** `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }` on every interactive element: plate link, rail row, contact-sheet thumb, button, `Collapsible` trigger. Never removed, never animated. Use `outline`, not `box-shadow`, so it survives forced-colors mode.
- **Semantics.** One `<h1>`, the hero statement. Each card is an `<article>` with its title as `<h2>`. The rail is `<nav aria-label="Version chronology">`. The wall label is a `<dl>`.
- **Badges are never colour-only.** Every condition badge carries its word; the LIVE dot always sits beside the text `LIVE`; `PENDING` reads as text, not just amber.
- **Announcements.** One `aria-live="polite"` region per screen. The viewer announces `"Width 390 pixels"`, `"Loaded version 2.5"`, `"Could not load version 4"`.
- `lang="en"`, and a skip link to `#main` as the first tabbable element. The current site has this; keep it.

## shadcn components

`Button` (default / outline / ghost / sm, restyled to mono uppercase 12.5px, radius 4) · `Badge` (outline; four conditions plus the LIVE modifier) · `Card` (shell only, header/plate/label are custom composition) · `Separator` · `Collapsible` · `ToggleGroup` (viewer widths) · `ScrollArea` (rail, chip strip) · `Sheet` (mobile chronology) · `AspectRatio` · `Skeleton` · `Tooltip`.

Explicitly **out of scope:** `Command` + `Dialog` for a ⌘K palette. The rail and contact sheet navigate ten entries fine; it earns its way in at fifteen.

## Assets

**No production imagery is included, and none of the plates in the prototype are real.** This is deliberate and it is the one thing blocking a faithful build.

- Every plate, mobile thumb and empty contact-sheet cell in the prototype uses the specified **`NOT YET ARCHIVED`** treatment: `--mat` tile, 1px dashed `--hairline-strong`, lucide `image-off`, Plex Mono 11px label, correct aspect ratio.
- Eight contact-sheet cells use **abstract era swatches** (a VT323 version numeral on near-black for the 2024 to 2025 neon era, the teal-lime gradient for the Landing Page, a neutral Plex Mono cell for v3.5, a light cell for Commercial). These stand in for real thumbnails and show the intended arc: the work gets louder, then calms down. **Replace all eight with real captures.** They are not screenshots and must not ship as if they were.
- Icons are inline SVG in the prototype, drawn to match lucide. Use `lucide-react` in the build.

**Content still needed, from `DESIGN.md` §18:**

1. Desktop and mobile screenshots for v4 and v5. Everything else has one.
2. Re-shoot the rest at fixed 1440×900 / 390×844. A neutral 16px mat makes mismatched crops obvious. The current data is already wrong: `v3` and `v3.5` point at the same Cloudinary asset, and for both entries the desktop and mobile URLs are identical, so four figures render one image.
3. A one-or-two-sentence `description` per version. The existing `features[]` arrays are brochure phrasing and cannot carry the label row alone.
4. `status`, `iso`, `build` and `pages` backfilled for every entry.
5. A decision on hosting: all screenshots live on one free Cloudinary account with no local copy. That is the single biggest rot risk in the repository.

**Capture note.** Full-page capture does not work on the current `index.html`: `html { height: 100% }` alongside `body { overflow-y: auto }` makes Playwright's `fullPage` stitching repeat the first viewport. Remove that rule during the rebuild. Take viewport-sized shots and `scrollIntoView()`, and do not await `img.complete` on lazy images.

## Open Questions

1. **Dash policy conflict.** `DESIGN.md` §8 and §14 specify copy containing en-dashes (`ARCHIVE / {firstYear} — {lastYear}`, `2024–25 · TOOLED`, `External site — not archivable`). The project's house style forbids em- and en-dashes in all shipped copy. The prototype follows the house style: `ARCHIVE / 2024 to 2026`, `2024-25 · TOOLED`, `External site, not archivable`. **Recommend correcting `DESIGN.md` so a later session does not reintroduce them.**
2. **First-version date.** `DESIGN.md` says hand-written HTML in **January 2024**; the repository README's version history lists **v1.0 (Aug 2024)**. The prototype follows `DESIGN.md` and derives `30 months` from it. That number is only right if the January date is. Settle this before shipping, because the hero computes from it.
3. **Version count.** The prototype shows ten entries per `DESIGN.md`; the README lists seven plus Commercial. Ten is assumed correct (it includes v4 and v5 as `pending`).

## Definition of done

From `DESIGN.md` §17, reproduced because these are the acceptance criteria:

- [ ] Adding a version is **one edit** to `src/data/versions.ts`. Verify by adding a fake entry and confirming it appears in the rail, the contact sheet, the counts, the card list and the viewer's prev/next chain.
- [ ] No root-absolute URL literal survives anywhere in `src/`. Everything goes through the `asset()` helper; add a lint rule banning `^/(data|archive|images|css|js)/`.
- [ ] Zero console errors on load, in dev and in the built output.
- [ ] `/version-timetravel/v/v3.5?w=390` restores version and width after a hard refresh; a legacy `viewer.html?version=version30.html` URL still lands correctly.
- [ ] Validate with a **plain static server** (`python3 -m http.server` from `dist/`), never `vite preview`. `appType: 'spa'` makes preview serve `index.html` for every missing path, masking exactly the 404s you are checking for.
- [ ] Every card looks right in all four states, including with no screenshot at all.
- [ ] Keyboard-only: reach and open every version, change widths, and get back, without a mouse.
- [ ] `prefers-reduced-motion` kills all transforms and stops the canvas.

## Files

| File | What it is |
|---|---|
| `Version TimeTravel v2 ACCESSION.dc.html` | The design reference. Five frames, A to E. Open in a browser. |
| `support.js` | Runtime the design file needs in order to render. Not part of the deliverable. |
| `README.md` | This document. |

The project's own **`DESIGN.md`** and **`CLAUDE.md`** are the companion specs and are not duplicated here. `DESIGN.md` §3 (plumbing), §16 (repository mapping) and §17 (done criteria) are required reading before writing code, and are not fully restated in this README.
