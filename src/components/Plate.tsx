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
  mat = 16,
  className,
  children,
}: {
  src?: string
  alt: string
  ratio?: string
  mat?: number
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'relative rounded-mount border border-hairline bg-mat transition-colors duration-140',
        className,
      )}
      style={{ padding: mat }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block w-full rounded-shot object-cover object-top"
          style={{ aspectRatio: ratio }}
        />
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
