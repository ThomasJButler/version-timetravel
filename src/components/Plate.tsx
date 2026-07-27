import { useState } from 'react'
import { ImageOffIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The load-bearing idea of the whole design: a neutral mat between the loud thing and the
 * card. The mat colour equals the page colour, so the plate reads as a hole through the
 * surface rather than a frame on top of it.
 *
 * Never take the mat below 10px and never remove it. Ten exhibits with nothing visually in
 * common only coexist because each one is recessed.
 */
export function Plate({
  src,
  alt,
  ratio = '16/10',
  matClass = 'p-2.5 md:p-4',
  className,
  children,
}: {
  src?: string
  alt: string
  ratio?: string
  matClass?: string
  className?: string
  children?: React.ReactNode
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn(
        'relative rounded-mount border border-hairline bg-mat transition-colors duration-140',
        matClass,
        className,
      )}
    >
      {src ? (
        // The wrapper reserves the space, so a slow image never reflows the column.
        <div className="relative w-full overflow-hidden rounded-shot" style={{ aspectRatio: ratio }}>
          {!loaded && <div className="absolute inset-0 animate-pulse bg-surface-hover" />}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={cn(
              'block size-full object-cover object-top transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>
      ) : (
        <div
          className="grid w-full place-items-center rounded-shot border border-dashed border-hairline-strong bg-mat"
          style={{ aspectRatio: ratio }}
        >
          <div className="text-center text-ink-3">
            <ImageOffIcon className="mx-auto size-5" aria-hidden="true" />
            <p className="mt-2 font-mono text-[11px] tracking-[0.06em]">NOT YET ARCHIVED</p>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
