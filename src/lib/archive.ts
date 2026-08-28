import { versions as allVersions, type Version } from '@/data/versions'

/**
 * Everything on the page is derived from the data. No count, date range or ordinal is ever
 * typed into copy, so shipping v6 cannot make the page lie.
 *
 * `hidden` is filtered out here, once, rather than at each call site. Every count, ordinal,
 * rail group, neighbour and lookup below reads from `versions`, so a withheld entry leaves
 * no trace: no gap in the accession numbers, no dead step in the viewer's paging, and no
 * URL that still resolves. Unhiding is the same one line in reverse.
 */
const versions = allVersions.filter((v) => !v.hidden)

/** Commercial is a separate site, not a step in this portfolio's lineage. */
export const isLineage = (v: Version) => v.status !== 'external'

export const byDate = [...versions].sort((a, b) => a.iso.localeCompare(b.iso))
export const lineage = byDate.filter(isLineage)

/** Newest first for display; the source array is never mutated. */
export const displayOrder = [...byDate].reverse()

export const versionCount = lineage.length

export const firstYear = byDate[0]?.iso.slice(0, 4) ?? ''
export const lastYear = byDate[byDate.length - 1]?.iso.slice(0, 4) ?? ''

export function monthsSpanned(): number {
  const first = byDate[0]
  const last = byDate[byDate.length - 1]
  if (!first || !last) return 0
  const [fy, fm] = first.iso.split('-').map(Number)
  const [ly, lm] = last.iso.split('-').map(Number)
  return (ly - fy) * 12 + (lm - fm)
}

export const hasPending = versions.some((v) => v.status === 'pending')

/** 'Every one still runs.' is only true when nothing is pending. */
export const runClaim = hasPending ? 'Most of them still run.' : 'Every one still runs.'

/**
 * TJB.{year}.{ordinal} — ordinal is the entry's chronological position within the archive,
 * counting everything accessioned that year, Commercial included.
 */
export function accession(v: Version): string {
  const year = v.iso.slice(0, 4)
  const sameYear = byDate.filter((e) => e.iso.startsWith(year))
  const ordinal = sameYear.findIndex((e) => e.id === v.id) + 1
  return `TJB.${year}.${String(ordinal).padStart(2, '0')}`
}

export type Era = 'STATIC' | 'TOOLED' | 'REACT'

/** Derived from iso + build, never hand-assigned. */
export function eraOf(v: Version): Era {
  if (v.techStack.some((t) => t.startsWith('React'))) return 'REACT'
  if (v.build && v.build !== 'None (hand-authored)') return 'TOOLED'
  return 'STATIC'
}

export interface EraGroup {
  era: Era
  label: string
  entries: Version[]
}

/** Rail groups, oldest first, labelled with the actual year range of their members. */
export function eraGroups(): EraGroup[] {
  const order: Era[] = ['STATIC', 'TOOLED', 'REACT']
  return order
    .map((era) => {
      const entries = lineage.filter((v) => eraOf(v) === era)
      if (!entries.length) return null
      const years = entries.map((e) => e.iso.slice(0, 4))
      const from = years[0]
      const to = years[years.length - 1]
      const span = from === to ? from : `${from}-${to.slice(2)}`
      return { era, label: `${span} · ${era}`, entries }
    })
    .filter((g): g is EraGroup => g !== null)
}

export type ChipKind = 'added' | 'kept' | 'dropped'
export interface Chip {
  label: string
  kind: ChipKind
}

/**
 * Never shown as dropped.
 *
 * The static entries list languages and the React ones list frameworks, so a naive diff
 * announced "HTML removed, CSS removed, JavaScript removed" the moment React arrived. None
 * of the three ever left a web page. Listing them differently is a change of description,
 * not a change of stack, and the accent must only ever mark real movement.
 */
const FOUNDATIONAL = new Set(['HTML', 'CSS', 'JavaScript'])

/**
 * The accent means "added, or current". Chips are diffed against the previous entry in the
 * lineage, so the green earns its place from data rather than copywriting.
 */
export function techChips(v: Version): Chip[] {
  const i = lineage.findIndex((e) => e.id === v.id)
  const previous = i > 0 ? lineage[i - 1] : undefined

  // External entries sit outside the lineage, so there is nothing honest to diff against.
  if (!previous || !isLineage(v)) {
    return v.techStack.map((label) => ({ label, kind: 'kept' as const }))
  }

  const before = new Set(previous.techStack)
  const now = new Set(v.techStack)

  return [
    ...v.techStack.map((label) => ({
      label,
      kind: before.has(label) ? ('kept' as const) : ('added' as const),
    })),
    ...previous.techStack
      .filter((label) => !now.has(label) && !FOUNDATIONAL.has(label))
      .map((label) => ({ label, kind: 'dropped' as const })),
  ]
}

export const byId = (id: string) => versions.find((v) => v.id === id)

/** Viewer stepping skips anything that cannot be opened in the frame. */
export const openable = displayOrder.filter(
  (v) => v.status === 'archived' || v.status === 'restored',
)

export function neighbours(id: string) {
  const i = openable.findIndex((v) => v.id === id)
  if (i === -1) return { previous: undefined, next: undefined }
  return { previous: openable[i - 1], next: openable[i + 1] }
}

export const shotCoverage =
  versions.filter((v) => v.screenshots?.desktop).length / (versions.length || 1)

/** A contact sheet that is 30% empty reads as unfinished rather than honest. */
export const showContactSheet = shotCoverage >= 0.7
