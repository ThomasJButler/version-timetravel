/**
 * Capture the archive itself: design references and portfolio assets.
 *
 *   python3 scripts/serve-pages.py &      # must be running
 *   npm run shots
 *
 * Writes screenshots/after/. The four in screenshots/before/ are the old build, kept so the
 * pair reads as before and after.
 *
 * This one does use Playwright, unlike shoot-archive.sh, which deliberately does not.
 * Chrome's --virtual-time-budget already proved unable to settle a lazily-loaded hero, and
 * these shots need real-time waits, element crops and a delayed response to hold the
 * viewer's loading plate open. Playwright is a devDependency with browser download skipped
 * in CI: it drives the system Chrome via channel, so nothing extra is fetched.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://127.0.0.1:4500/version-timetravel/'
const OUT = new URL('../screenshots/after/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }

const browser = await chromium.launch({ channel: 'chrome' })
const shot = (n) => `${OUT}${n}.png`
const done = []

/** Cards animate in and plates are lazy, so give the page a beat before every capture. */
async function open(viewport, path = '', route) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  if (route) await ctx.route('**/archive/**', route)
  const page = await ctx.newPage()
  await page.goto(BASE + path, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  return { ctx, page }
}

async function atCard(page, id) {
  await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ block: 'center', behavior: 'instant' }), id)
  await page.waitForTimeout(1500)
}

async function capture(name, page, locator) {
  await (locator ? page.locator(locator) : page).screenshot({ path: shot(name) })
  done.push(name)
}

// ── Archive page ────────────────────────────────────────────────────────────────
{
  const { ctx, page } = await open(DESKTOP)
  await capture('01-archive-hero', page)

  await atCard(page, 'v2-5')
  await capture('02-rail-and-card', page)
  await capture('03-card-archived', page, '#v2-5')

  await atCard(page, 'v5')
  await capture('04-card-restored', page, '#v5')

  await atCard(page, 'commercial')
  await capture('05-card-external', page, '#commercial')

  await page.evaluate(() => document.getElementById('colophon-title')?.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.waitForTimeout(1200)
  await capture('09-colophon', page, 'section[aria-labelledby="colophon-title"]')

  // No full-page shot, deliberately. The archive is ~13,100px tall, which is past what
  // Chrome will capture in one frame, and Playwright's stitching repeats the header and
  // hero instead of scrolling. Growing the viewport to the full height fails the same way,
  // at 0.5x too. The contact sheet is the better overview asset anyway: it is the one
  // object that shows the whole arc at once.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
  await capture('10-contact-sheet', page, 'main > section:first-of-type > ul')
  await ctx.close()
}

// ── Viewer ──────────────────────────────────────────────────────────────────────
{
  // Hold the archive back so the rain and BOOTING plate stay on screen to be photographed.
  const { ctx, page } = await open(DESKTOP, 'v/v2-5', async (route) => {
    await new Promise((r) => setTimeout(r, 6000))
    await route.continue()
  })
  await capture('06-viewer-loading', page)
  await ctx.close()
}

for (const [name, path] of [['07-viewer-loaded', 'v/v5'], ['08-viewer-390', 'v/v5?w=390']]) {
  const { ctx, page } = await open(DESKTOP, path)
  await page.waitForTimeout(4000)
  await capture(name, page)
  await ctx.close()
}

// ── Mobile ──────────────────────────────────────────────────────────────────────
{
  const { ctx, page } = await open(MOBILE)
  await capture('11-mobile-hero', page)

  await atCard(page, 'v3')
  await capture('12-mobile-card', page)

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.locator('[aria-label="Jump to version"]').click()
  await page.waitForTimeout(1000)
  await capture('13-mobile-sheet', page)
  await ctx.close()
}

await browser.close()
console.log(`${done.length} shots -> screenshots/after/`)
console.log(done.join('\n'))
