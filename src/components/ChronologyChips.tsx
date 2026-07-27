import { useEffect, useRef, useState } from 'react'
import { ListIcon } from 'lucide-react'
import { ChronologyRail } from '@/components/ChronologyRail'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { railLabel, useActiveVersion } from '@/hooks/useActiveVersion'
import { eraGroups, lineage } from '@/lib/archive'
import { cn } from '@/lib/utils'

/**
 * Below xl the rail collapses to a horizontal strip. Same information, same active state,
 * era headers demoted to inline dividers. Below md it is joined by a Sheet holding the
 * full grouped rail, because ten chips in a scroller is fine for stepping and poor for
 * finding.
 */
export function ChronologyChips({ className }: { className?: string }) {
  const active = useActiveVersion()
  const [open, setOpen] = useState(false)
  const stripRef = useRef<HTMLUListElement>(null)

  // Keep the active chip in view as the page scrolls, without moving the page itself.
  useEffect(() => {
    if (!active) return
    const chip = stripRef.current?.querySelector(`[data-chip="${active}"]`)
    chip?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active])

  const eraStartIds = new Set(eraGroups().map((g) => g.entries[0]?.id))

  return (
    <div
      className={cn(
        'flex h-11 items-center gap-2 border-b border-hairline bg-[color-mix(in_oklab,var(--canvas)_85%,transparent)] backdrop-blur-[12px]',
        className,
      )}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Jump to version"
          className="grid size-11 shrink-0 place-items-center text-ink-3 hover:text-ink md:hidden"
        >
          <ListIcon className="size-4" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] overflow-y-auto bg-surface p-5">
          <SheetTitle className="label-caps">Jump to version</SheetTitle>
          <ChronologyRail className="mt-4" onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <ul
        ref={stripRef}
        aria-label="Version chronology"
        className="flex snap-x snap-proximity items-center gap-1 overflow-x-auto"
      >
        {lineage.map((v) => {
          const isActive = active === v.id
          return (
            <li key={v.id} className="flex shrink-0 items-center gap-1 snap-start">
              {eraStartIds.has(v.id) && v.id !== lineage[0]?.id && (
                <span className="mx-1 h-4 w-px bg-hairline" aria-hidden="true" />
              )}
              <a
                href={`#${v.id}`}
                data-chip={v.id}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex h-8 items-center rounded-mount px-2.5 font-mono text-[13px] tnum transition-colors duration-180',
                  isActive
                    ? 'bg-surface-hover font-medium text-ink'
                    : 'text-ink-3 hover:text-ink-2',
                  v.status === 'pending' && !isActive && 'text-ink-3/70',
                )}
              >
                {railLabel(v.number)}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
