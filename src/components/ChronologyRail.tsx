import { railLabel, shortDate, useActiveVersion } from '@/hooks/useActiveVersion'
import { eraGroups } from '@/lib/archive'
import { cn } from '@/lib/utils'

/**
 * The full chronology, shown at xl and inside the mobile Sheet.
 *
 * Era headers are labels, not controls. A three-way filter over ten items is a control
 * nobody needs, and it would introduce an empty state that has to be designed.
 */
export function ChronologyRail({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  const active = useActiveVersion()

  return (
    <nav aria-label="Version chronology" className={className}>
      <p className="label-caps">Chronology</p>
      <div className="mt-4 space-y-6">
        {eraGroups().map((group) => (
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
                      onClick={onNavigate}
                      aria-current={isActive ? 'true' : undefined}
                      className="group flex h-11 items-center gap-3 font-mono text-[15px] md:h-8"
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
                          isActive
                            ? 'font-medium text-ink'
                            : 'text-ink-3 group-hover:text-ink-2',
                        )}
                      >
                        {railLabel(v.number)}
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
