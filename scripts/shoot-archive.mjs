/**
 * Capture vendored archives at the sizes the plate expects.
 *
 *   python3 scripts/serve-pages.py &          # must be running
 *   npm run shots:archive                     # all of them
 *   npm run shots:archive -- v2.5 v3          # or just these
 *
 * Writes public/shots/<id>-desktop.jpg (2000px wide) and <id>-mobile.jpg (470px wide).
 *
 * Replaces an earlier shell version that drove headless Chrome with
 * --virtual-time-budget to avoid a dependency. That clock could not settle a lazily-loaded
 * hero: v4 came out blank at every budget and had to be shot by hand. Playwright is already
 * a devDependency for shoot-site.mjs, so the dependency argument no longer applies, and real
 * waits are worth more than the saving.
 *
 * Shooting the archive rather than cropping a supplied capture is deliberate: supplied
 * full-page shots start at arbitrary offsets, so a fixed crop slices them mid-sentence.
 * This frames every version identically, which is what makes the contact sheet read as one
 * strip rather than ten different croppings.
 */
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Landing is missing on purpose. It is built around an embedded CodePen carousel that will
// not render for a capture, so its card keeps the hosted image that shows the page as it was
// meant to look. Pass it explicitly if that ever changes.
const ALL = ['v1', 'v2', 'v2.5', 'v2.8', 'v3', 'v3.5', 'v4', 'v5']
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ALL

const BASE = process.env.BASE ?? 'http://127.0.0.1:4500/version-timetravel/'
const OUT = new URL('../public/shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const TMP = mkdtempSync(join(tmpdir(), 'shots-'))

const browser = await chromium.launch({ channel: 'chrome' })

// Shot at 2x for sharpness then resampled down: the desktop plate renders around 1000px
// wide and the mobile thumb around 132px, so the full frame would put megabytes in the repo.
const SIZES = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, target: 2000 },
  { name: 'mobile', viewport: { width: 390, height: 845 }, target: 470 },
]


const ARCHIVES = new URL('../public/archive/', import.meta.url).pathname

/**
 * Snapshots keep their original filenames, so only some archives have an index.html.
 * Assuming index.html silently 404s for the rest, the SPA fallback boots, and you photograph
 * the archive photographing itself. Ask the directory instead of guessing.
 */
function entryFile(id) {
  const html = readdirSync(join(ARCHIVES, id)).filter((f) => f.endsWith('.html'))
  if (!html.length) throw new Error(`no html in public/archive/${id}`)
  return html.includes('index.html') ? 'index.html' : html[0]
}

for (const id of ids) {
  const entry = entryFile(id)
  for (const { name, viewport, target } of SIZES) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
    const page = await ctx.newPage()
    await page.goto(`${BASE}archive/${id}/${entry}`, { waitUntil: 'load' }).catch(() => {})

    // If the fallback booted anyway, fail loudly: a wrong capture looks entirely plausible.
    // Match the hero copy, not the wordmark. Several of these versions advertised TimeTravel
    // themselves, so "VERSION TIMETRAVEL" appears in the archives too.
    if (await page.locator('h1:has-text("versions of one portfolio")').count()) {
      throw new Error(`${id}: got the TimeTravel shell, not the archive (entry: ${entry})`)
    }

    // Some archives are single static files, others lazy-load a route chunk and animate in.
    await page
      .waitForFunction(() => (document.body.innerText ?? '').trim().length > 120, { timeout: 15000 })
      .catch(() => {})
    await page.waitForTimeout(3500)


    const png = join(TMP, `${id}-${name}.png`)
    await page.screenshot({ path: png })
    execFileSync('sips', ['--resampleWidth', String(target), png, '--out', `${png}.r.png`], { stdio: 'ignore' })
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', `${png}.r.png`,
      '--out', join(OUT, `${id}-${name}.jpg`)], { stdio: 'ignore' })
    await ctx.close()
  }
  console.log(`  ${id}`)
}

await browser.close()
rmSync(TMP, { recursive: true, force: true })
console.log(`${ids.length} archive(s) -> public/shots/`)
