import type { Status } from '@/data/versions'
import { cn } from '@/lib/utils'

const BADGE: Record<Status, { label: string; className: string }> = {
  archived: { label: 'ARCHIVED', className: 'border-hairline text-ink-3' },
  restored: { label: 'RESTORED', className: 'border-hairline text-ink-2' },
  external: { label: 'ON LOAN ↗', className: 'border-hairline text-ink-2' },
  pending: { label: 'PENDING', className: 'border-warn text-warn' },
}

const base =
  'inline-flex items-center rounded-mount border px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.10em]'

/** Never colour-only: every badge carries its word, so PENDING reads without the amber. */
export function ConditionBadge({ status }: { status: Status }) {
  const { label, className } = BADGE[status]
  return <span className={cn(base, className)}>{label}</span>
}

/** A modifier, not a state. v5 will be both restored and live. */
export function LiveBadge() {
  return (
    <span className={cn(base, 'gap-1.5 border-hairline text-ink-2')}>
      <span className="size-1.5 rounded-full bg-phosphor" aria-hidden="true" />
      LIVE
    </span>
  )
}
