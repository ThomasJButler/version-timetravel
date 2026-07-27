import { useState } from 'react'
import { Link } from 'react-router'
import type { Version } from '@/data/versions'
import { accession, techChips, type Chip } from '@/lib/archive'
import { ConditionBadge, LiveBadge } from '@/components/ConditionBadge'
import { Plate } from '@/components/Plate'
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
  const openable = version.status === 'archived' || version.status === 'restored'
  const shown = expanded ? version.features : version.features.slice(0, VISIBLE_FEATURES)

  const plate = (
    <Plate
      src={version.screenshots?.desktop}
      alt={`Version ${version.number} desktop`}
      className={cn(
        'group-hover/plate:border-phosphor',
        !openable && version.status === 'pending' && 'group-hover/plate:border-hairline',
      )}
    >
      {/* The mobile shot hangs off the lower-left; the card absorbs it with padding-bottom. */}
      <div className="absolute -bottom-7 left-6 hidden w-[132px] lg:block">
        <Plate
          src={version.screenshots?.mobile}
          alt={`Version ${version.number} mobile`}
          ratio="9/19.5"
          mat={6}
          className="rounded-thumb shadow-[0_12px_32px_-8px_rgb(0_0_0/0.6)]"
        />
      </div>
      {openable && (
        <span className="absolute bottom-6 right-6 rounded-mount border border-hairline bg-surface px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 opacity-0 transition-opacity duration-140 group-hover/plate:opacity-100">
          Open ↗
        </span>
      )}
      {version.status === 'external' && (
        <span className="absolute bottom-6 right-6 rounded-mount border border-hairline bg-surface px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 opacity-0 transition-opacity duration-140 group-hover/plate:opacity-100">
          Visit ↗
        </span>
      )}
    </Plate>
  )

  return (
    <article
      id={version.id}
      aria-labelledby={`${version.id}-title`}
      className="card-lift scroll-mt-28 rounded-card border border-hairline bg-surface p-8 pb-15 transition-colors duration-140 hover:border-hairline-strong"
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
          <a
            href={version.externalUrl}
            target="_blank"
            rel="noopener"
            className="group/plate block"
          >
            {plate}
          </a>
        ) : (
          <div className="cursor-default">{plate}</div>
        )}
      </div>

      <div className="mt-7 grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
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

          <p className="mt-3 max-w-[60ch] text-base leading-[1.6] text-ink-2">
            {version.description}
          </p>

          <p className="label-caps mt-5">Changes</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {shown.map((feature) => (
              <li
                key={feature}
                className="flex gap-3 text-[14.5px] leading-[1.65] text-ink-2"
              >
                <span
                  className="mt-[0.7em] h-px w-2 shrink-0 bg-hairline-strong"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>

          {version.features.length > VISIBLE_FEATURES && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3 transition-colors duration-120 hover:text-ink"
            >
              {expanded ? 'Show fewer' : `Show all ${version.features.length}`}
            </button>
          )}
        </div>

        <div className="border-hairline lg:border-l lg:pl-6">
          <dl className="font-mono text-[12px] leading-[1.5]">
            <Row label="Date">{version.date}</Row>
            <Row label="Medium">
              <TechChips chips={techChips(version)} />
            </Row>
            {version.build && <Row label="Build">{version.build}</Row>}
            {version.pages !== undefined && <Row label="Pages">{version.pages}</Row>}
            <Row label="Condition">{CONDITION[version.status]}</Row>
          </dl>

          <div className="mt-6 space-y-2">
            <PrimaryAction version={version} />
            {version.sourceUrl && (
              <a
                href={version.sourceUrl}
                target="_blank"
                rel="noopener"
                className="block py-2 text-center font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3 transition-colors duration-120 hover:text-ink"
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
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 py-1.5 lg:grid-cols-[80px_minmax(0,1fr)]">
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
    'block w-full rounded-mount border px-4 py-2.5 text-center font-mono text-[12.5px] font-medium uppercase tracking-[0.08em] transition-colors duration-120'

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
        <span
          aria-disabled="true"
          className={cn(cls, 'cursor-not-allowed border-hairline text-ink-3')}
        >
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
