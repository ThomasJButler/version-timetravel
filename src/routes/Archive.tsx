import { ChronologyChips } from '@/components/ChronologyChips'
import { ChronologyRail } from '@/components/ChronologyRail'
import { Colophon } from '@/components/Colophon'
import { ExhibitCard } from '@/components/ExhibitCard'
import {
  byDate,
  displayOrder,
  firstYear,
  lastYear,
  monthsSpanned,
  runClaim,
  showContactSheet,
  versionCount,
} from '@/lib/archive'
import { media } from '@/lib/asset'

export function Archive() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-mount focus:border focus:border-hairline-strong focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:text-ink"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-hairline bg-[color-mix(in_oklab,var(--canvas)_85%,transparent)] backdrop-blur-[12px] motion-safe:animate-rise">
        <div className="mx-auto flex h-14 max-w-[1560px] items-center justify-between px-5 md:px-10 xl:px-14">
          <span className="flex items-center gap-2.5">
            <span className="size-1.5 bg-phosphor" aria-hidden="true" />
            <span className="font-mono text-[13px] font-medium tracking-[0.14em] text-ink">
              VERSION TIMETRAVEL
            </span>
          </span>
          <a
            href="https://thomasjbutler.github.io/"
            target="_blank"
            rel="noopener"
            className="font-mono text-[12px] text-ink-2 transition-colors duration-120 hover:text-ink"
          >
            Live site ↗
          </a>
        </div>
      </header>

      {/* Below xl the rail collapses to this strip, which carries the mobile Sheet too. */}
      <ChronologyChips className="sticky top-14 z-30 px-2 md:px-8 xl:hidden" />

      <main id="main">
        <section className="mx-auto min-h-[72vh] max-w-[1560px] px-5 pt-12 md:px-10 md:pt-18 xl:px-14">
          <p
            className="font-mono text-[12px] font-medium uppercase leading-4 tracking-[0.14em] text-ink-3 motion-safe:animate-rise"
            style={{ animationDelay: '40ms' }}
          >
            Archive / {firstYear} to {lastYear}
          </p>

          <h1
            className="mt-5 max-w-[1100px] font-display text-[clamp(2.5rem,1.6rem+3vw,4rem)] leading-[1.05] tracking-[-0.02em] text-ink motion-safe:animate-rise"
            style={{ animationDelay: '80ms' }}
          >
            {versionCount} versions of one portfolio. {runClaim}
          </h1>

          <p
            className="mt-6 max-w-[58ch] text-[17px] leading-[1.6] text-ink-2 motion-safe:animate-rise"
            style={{ animationDelay: '120ms' }}
          >
            A working archive of thomasjbutler.me, hand-written HTML in {byDate[0]?.date} through
            React and shadcn today. Open any version and use it as it shipped.
          </p>

          {showContactSheet && <ContactSheet />}

          <div className="mt-11 border-t border-hairline pt-5">
            <p className="font-mono text-[13px] font-medium tracking-[0.10em] tnum text-ink-3">
              {versionCount} versions · {monthsSpanned()} months · 1 person
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1560px] px-5 pb-32 pt-16 md:px-10 xl:px-14">
          <div className="grid xl:grid-cols-[216px_minmax(0,1fr)] xl:gap-18">
            <ChronologyRail className="sticky top-22 hidden max-h-[calc(100vh-120px)] self-start overflow-y-auto border-r border-hairline pr-4 xl:block" />
            <div className="mx-auto grid w-full max-w-[900px] gap-10 md:gap-16 xl:max-w-none">
              {displayOrder.map((version) => (
                <ExhibitCard key={version.id} version={version} />
              ))}
              <Colophon />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

/**
 * The thesis object: at 108px the neon reads as texture, so you can watch the work get
 * louder and then calm down. Full colour, never tinted.
 *
 * The design calls for a Tooltip here. It uses the native title attribute instead: Base UI's
 * Tooltip costs 57kB raw for a hover label the browser already provides, which is a poor
 * trade on a page whose whole argument is restraint.
 */
function ContactSheet() {
  return (
    <ul className="mt-10 flex snap-x snap-proximity gap-2 overflow-x-auto pb-2">
      {byDate.map((v, i) => (
        <li key={v.id} className="shrink-0 snap-start">
          <a
            href={`#${v.id}`}
            title={`${v.number} · ${v.date}`}
            className="block motion-safe:animate-fade"
            style={{ animationDelay: `${160 + i * 24}ms` }}
          >
            <span className="block h-[68px] w-[108px] overflow-hidden rounded-shot border border-hairline bg-mat">
              {v.screenshots?.desktop ? (
                <img
                  src={media(v.screenshots.desktop)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover object-top"
                />
              ) : (
                <span className="grid size-full place-items-center border border-dashed border-hairline-strong font-mono text-[9px] leading-tight text-ink-3">
                  NOT YET
                  <br />
                  ARCHIVED
                </span>
              )}
            </span>
            <span className="mt-1.5 block text-center font-mono text-[10px] tnum text-ink-3">
              {v.iso.slice(0, 4)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
