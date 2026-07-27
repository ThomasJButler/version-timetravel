import { useState } from 'react'
import { Link } from 'react-router'
import type { Version } from '@/data/versions'
import { accession, techChips, type Chip } from '@/lib/archive'
import { ConditionBadge, LiveBadge } from '@/components/ConditionBadge'
import { Plate } from '@/components/Plate'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

const CONDITION: Record<Version['status'], string> = {
  archived: 'Archived, static',
  restored: 'Restored from source, vendored',
  external: 'On loan, hosted elsewhere',
  pending: 'Not yet archived',
}

const VISIBLE_FEATURES = 4

export function ExhibitCard({ version }: { version: Version }) {
  const [expanded, setExpanded] = useState(false)
  const { ref, revealed } = useReveal<HTMLElement>()

  const openable = version.status === 'archived' || version.status === 'restored'
  const shown = expanded ? version.features : version.features.slice(0, VISIBLE_FEATURES)
  const hoverChip = version.status === 'external' ? 'Visit ↗' : 'Open ↗'

  const plate = (
    <Plate
      src={version.screenshots?.desktop}
      alt={`Version ${version.number} desktop`}
      className={cn(openable || version.status === 'external' ? 'group-hover/plate:border-phosphor' : '')}
    >
      {/* At xl the mobile shot hangs off the lower-left; below that it moves inline. */}
      <div className="absolute -bottom-7 left-6 hidden w-[132px] xl:block">
        <Plate
          src={version.screenshots?.mobile}
          alt={`Version ${version.number} mobile`}
          ratio="9/19.5"
          matClass="p-1.5"
          className="rounded-thumb shadow-[0_12px_32px_-8px_rgb(0_0_0/0.6)]"
        />
      </div>
      {(openable || version.status === 'external') && (
        <span className="absolute bottom-5 right-5 rounded-mount border border-hairline bg-surface px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 opacity-0 transition-opacity duration-140 group-hover/plate:opacity-100">
          {hoverChip}
        </span>
      )}
    </Plate>
  )

  return (
    <article
      ref={ref}
      id={version.id}
      aria-labelledby={`${version.id}-title`}
      className={cn(
        'card-lift scroll-mt-28 rounded-card border border-hairline bg-surface p-4 transition-colors duration-140 hover:border-hairline-strong md:p-8 xl:pb-15',
        // Visible by default; the reveal only adds an entrance animation. Gating visibility
        // on a transition means one stalled transition hides the entire page, and the whole
        // content of this site is cards. Decoration may fail; content may not.
        revealed && 'motion-safe:animate-reveal',
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[13px] font-medium tracking-[0.10em] text-ink-3">
          {accession(version)}
        </span>
        <div className="flex items-center gap-2">
          <ConditionBadge status={version.status} />
          {version.isLive && <LiveBadge />}
        </div>
      </div>

      <div className="mt-5">
        {openable ? (
          <Link to={`/v/${version.id}`} className="group/plate block cursor-zoom-in">
            {plate}
          </Link>
        ) : version.status === 'external' && version.externalUrl ? (
          <a href={version.externalUrl} target="_blank" rel="noopener" className="group/plate block">
            {plate}
          </a>
        ) : (
          <div className="cursor-default">{plate}</div>
        )}
      </div>

      {/*
        Explicit placement rather than source order, so the same DOM reads correctly both
        ways: stacked as title, description, wall label, changes, actions on mobile, and as
        two columns at xl with the label beside the prose.
      */}
      <div className="mt-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:gap-14">
        {/*
          display:contents on mobile flattens these two wrappers, so `order` puts the five
          blocks in the order the design asks for (title, description, wall label, changes,
          actions). At xl the wrappers become real columns. Grid row spans were the obvious
          approach and the wrong one: a tall label spanning short rows stretches them.
        */}
        <div className="contents xl:block xl:min-w-0 xl:flex-1">
        <div className="order-1 xl:order-none">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-[15px] font-medium tnum text-ink-3">
              {version.number}
            </span>
            <h2
              id={`${version.id}-title`}
              className="font-display text-2xl tracking-[-0.015em] text-ink md:text-[30px] md:leading-[1.15]"
            >
              {version.title}
            </h2>
          </div>
        </div>

        <p className="order-2 max-w-[60ch] text-base leading-[1.6] text-ink-2 xl:order-none xl:mt-3">
          {version.description}
        </p>

        <div className="order-4 xl:order-none xl:mt-5">
          <p className="label-caps">Changes</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {shown.map((feature) => (
              <li key={feature} className="flex gap-3 text-[14.5px] leading-[1.65] text-ink-2">
                <span className="mt-[0.7em] h-px w-2 shrink-0 bg-hairline-strong" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          {version.features.length > VISIBLE_FEATURES && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-4 min-h-11 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3 transition-colors duration-120 hover:text-ink md:min-h-0"
            >
              {expanded ? 'Show fewer' : `Show all ${version.features.length}`}
            </button>
          )}
        </div>
        </div>

        <div className="contents xl:block xl:w-[300px] xl:shrink-0 xl:border-l xl:border-hairline xl:pl-6">
        <div className="order-3 xl:order-none">
          <dl className="font-mono text-[12px] leading-[1.5]">
            <Row label="Date">{version.date}</Row>
            <Row label="Medium">
              <TechChips chips={techChips(version)} />
            </Row>
            {version.build && <Row label="Build">{version.build}</Row>}
            {version.pages !== undefined && <Row label="Pages">{version.pages}</Row>}
            <Row label="Condition">{CONDITION[version.status]}</Row>
          </dl>

          {/* Below xl the mobile shot lives here, at the size the design calls for. */}
          {version.screenshots?.mobile && (
            <figure className="mt-5 w-[108px] xl:hidden">
              <Plate
                src={version.screenshots.mobile}
                alt={`Version ${version.number} mobile`}
                ratio="9/19.5"
                matClass="p-1.5"
                className="rounded-thumb"
              />
              <figcaption className="mt-1.5 font-mono text-[11px] tracking-[0.06em] text-ink-3">
                Mobile · 390 px
              </figcaption>
            </figure>
          )}
        </div>

        <div className="order-5 space-y-2 xl:order-none xl:mt-6">
          <PrimaryAction version={version} />
          {version.sourceUrl && (
            <a
              href={version.sourceUrl}
              target="_blank"
              rel="noopener"
              className="flex min-h-11 items-center justify-center font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3 transition-colors duration-120 hover:text-ink"
            >
              View source ↗
            </a>
          )}
        </div>
        </div>
      </div>
    </article>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 py-1.5 xl:grid-cols-[80px_minmax(0,1fr)]">
      <dt className="font-medium uppercase tracking-[0.10em] text-ink-3">{label}</dt>
      <dd className="text-ink-2">{children}</dd>
    </div>
  )
}

/**
 * The accent's one job, earned from data: a chip that is new since the previous version in
 * the lineage gets the phosphor treatment. Dropped chips come last, struck through.
 */
function TechChips({ chips }: { chips: Chip[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {chips.map(({ label, kind }) => (
        <li
          key={`${kind}-${label}`}
          className={cn(
            'rounded-mount px-1.5 py-0.5 text-[11.5px] font-medium uppercase tracking-[0.04em]',
            kind === 'added' && 'border border-phosphor bg-phosphor-soft text-ink',
            kind === 'kept' && 'border border-hairline text-ink-2',
            kind === 'dropped' && 'text-ink-3 line-through',
          )}
        >
          {kind === 'added' && <span aria-hidden="true">+ </span>}
          {label}
          {kind === 'dropped' && <span className="sr-only"> (removed)</span>}
        </li>
      ))}
    </ul>
  )
}

function PrimaryAction({ version }: { version: Version }) {
  const cls =
    'flex min-h-11 w-full items-center justify-center rounded-mount border px-4 text-center font-mono text-[12.5px] font-medium uppercase tracking-[0.08em] transition-colors duration-120'

  if (version.status === 'external' && version.externalUrl) {
    return (
      <a
        href={version.externalUrl}
        target="_blank"
        rel="noopener"
        className={cn(cls, 'border-hairline-strong text-ink hover:border-phosphor hover:bg-surface-hover')}
      >
        Visit site ↗
      </a>
    )
  }

  if (version.status === 'pending') {
    return (
      <>
        <span aria-disabled="true" className={cn(cls, 'cursor-not-allowed border-hairline text-ink-3')}>
          Not yet archived
        </span>
        <p className="pt-1 font-mono text-[12px] leading-relaxed text-ink-3">
          Screenshots only for now. The build will be archived here once it's deployed.
        </p>
      </>
    )
  }

  return (
    <Link
      to={`/v/${version.id}`}
      className={cn(cls, 'border-hairline-strong text-ink hover:border-phosphor hover:bg-surface-hover')}
    >
      Open version
    </Link>
  )
}
