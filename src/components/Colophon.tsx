import { versionCount } from '@/lib/archive'

/**
 * Why the archive exists, and why it had to be rebuilt.
 *
 * Deliberately not a version card. This site documents the portfolio, so making TimeTravel
 * an exhibit in its own archive would put two different subjects in one count and undermine
 * the condition taxonomy. A colophon says the same thing without that cost.
 *
 * Drafted from Thomas's own words. Edit freely, but keep it first-person: it is the only
 * place on the page that speaks.
 */
export function Colophon() {
  return (
    <section
      aria-labelledby="colophon-title"
      className="mx-auto mt-24 max-w-[900px] border-t border-hairline pt-8 xl:max-w-none"
    >
      <h2 id="colophon-title" className="label-caps">
        About this archive
      </h2>

      <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-14">
        <p className="max-w-[60ch] text-base leading-[1.7] text-ink-2">
          I built this mainly to show myself a visual timeline of the site over time. It is a
          personal website and a passion project, and you do not get this from git. It also
          tracks my own full-stack progress as I go further into machine learning, databases,
          cloud and iOS, and it lets me keep experimenting with new stacks and testing what
          local AI models can do, using the site as a canvas.
        </p>

        <p className="max-w-[60ch] text-base leading-[1.7] text-ink-2">
          TimeTravel itself was rebuilt in 2026. The portfolio had moved to React and shadcn
          while this archive was still hand-written HTML, and a static timeline could not show
          what the site had become. Without that upgrade, archiving any future iteration was
          impossible, so the tool had to catch up with the thing it documents.
        </p>
      </div>

      <p className="mt-8 font-mono text-[12px] tracking-[0.10em] tnum text-ink-3">
        {versionCount} versions kept running · Liverpool, UK
      </p>
    </section>
  )
}
