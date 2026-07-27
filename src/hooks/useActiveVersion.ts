import { useEffect, useState } from 'react'
import { lineage } from '@/lib/archive'

/**
 * Which exhibit the reader is currently on.
 *
 * The middle band of the viewport is what counts, which stops the highlight flickering
 * between neighbours as a card boundary crosses the edge of the screen. Shared by the rail
 * and the chip strip so the two can never disagree.
 */
export function useActiveVersion(): string | null {
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** '2024-10' -> 'Oct 24' */
export function shortDate(iso: string) {
  const [year, month] = iso.split('-')
  return `${MONTHS[Number(month) - 1]} ${year.slice(2)}`
}

/** The rail has no room for 'Landing Page'. */
export const railLabel = (number: string) => (number === 'Landing Page' ? 'LP' : number)
