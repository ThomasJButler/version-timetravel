import { useEffect, useRef, useState } from 'react'

/** Nothing stays hidden longer than this, whatever the observer does. */
const FAILSAFE_MS = 1200

/**
 * One-shot scroll reveal that cannot swallow the page.
 *
 * The whole content of this site is cards. A reveal that starts at opacity 0 and depends on
 * an observer firing is one missed callback away from a blank archive, so this hides an
 * element only when it is confident it can unhide it:
 *
 *  - anything already on screen at mount is revealed immediately, no transition,
 *  - anything below the fold is observed,
 *  - and a timer reveals it regardless if the observer has not fired by then. Layout shifts
 *    from lazy images loading above a card can move it out of view between mount and the
 *    observer's first callback, which is exactly how it fails.
 *
 * Keyed off intersection, never off `img.complete`: below-fold plates are lazy, so
 * `complete` never resolves and anything awaiting it hangs forever.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already visible: show it now rather than animating something the reader is looking at.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          obs.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)

    const failsafe = window.setTimeout(() => setRevealed(true), FAILSAFE_MS)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  return { ref, revealed }
}
