import { useEffect, useState } from 'react'
import { eraGroups, lineage } from '@/lib/archive'
import { cn } from '@/lib/utils'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** '2024-10' -> 'Oct 24' */
function shortDate(iso: string) {
  const [year, month] = iso.split('-')
  return `${MONTHS[Number(month) - 1]} ${year.slice(2)}`
}

/**
 * The only thing that moves as you scroll. A card is "active" once it occupies the middle
 * band of the viewport, which stops the highlight flickering between neighbours.
 */
function useActiveVersion(): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    for (const v of lineage) {
      const el = document.getElementById(v.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return active
}

export function ChronologyRail({ className }: { className?: string }) {
  const active = useActiveVersion()
  const groups = eraGroups()

  return (
    <nav aria-label="Version chronology" className={className}>
      <p className="label-caps">Chronology</p>
      <div className="mt-4 space-y-6">
        {groups.map((group) => (
          <div key={group.era}>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-3/70">
              {group.label}
            </p>
            <ul className="mt-2">
              {group.entries.map((v) => {
                const isActive = active === v.id
                return (
                  <li key={v.id}>
                    <a
                      href={`#${v.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className="group flex h-8 items-center gap-3 font-mono text-[15px]"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-px shrink-0 transition-all duration-180 ease-out',
                          isActive ? 'w-5 bg-phosphor' : 'w-3 bg-hairline-strong',
                          v.status === 'pending' &&
                            !isActive &&
                            'border-t border-dashed border-hairline-strong bg-transparent',
                        )}
                      />
                      <span
                        className={cn(
                          'tnum transition-colors duration-180',
                          isActive ? 'font-medium text-ink' : 'text-ink-3 group-hover:text-ink-2',
                        )}
                      >
                        {v.number === 'Landing Page' ? 'LP' : v.number}
                      </span>
                      <span className="ml-auto text-[12px] tnum text-ink-3">
                        {shortDate(v.iso)}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
