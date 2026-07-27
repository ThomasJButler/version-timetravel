import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const GLYPHS = 'アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロ0123456789'
const FONT_SIZE = 14
const FRAME_MS = 40

/**
 * The only animated, nostalgic moment left in the product.
 *
 * The rain is deleted from the archive page entirely: ten loud screenshots cannot compete
 * with animated wallpaper, and full-bleed rain is the tell of the 2024 build. It survives
 * here, over the viewer's loading plate, where it reads as the door between eras.
 *
 * The old src/js/matrix.js used '0101010101' and had no teardown at all. This one uses the
 * katakana of the design reference and cancels its frame on unmount.
 */
export function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let last = 0
    let drops: number[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const columns = Math.ceil(width / FONT_SIZE)
      const rows = height / FONT_SIZE
      // Seed across the full height, not just above it. Seeding only negative meant the
      // plate showed a nearly empty screen for the first second, which is most of the time
      // it is on screen.
      drops = Array.from({ length: columns }, () =>
        Math.floor(Math.random() * rows * 1.4 - rows * 0.4),
      )
      ctx.fillStyle = '#0E100E'
      ctx.fillRect(0, 0, width, height)
    }

    const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

    const paint = () => {
      const { width, height } = canvas.getBoundingClientRect()

      // Trail: a translucent wash rather than a clear, so columns fade behind their head.
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(14, 16, 14, 0.09)'
      ctx.fillRect(0, 0, width, height)

      ctx.font = `${FONT_SIZE}px ${getComputedStyle(canvas).getPropertyValue('--font-mono') || 'monospace'}`
      ctx.globalAlpha = 0.85
      ctx.textBaseline = 'top'

      drops.forEach((y, i) => {
        const x = i * FONT_SIZE
        const py = y * FONT_SIZE

        ctx.fillStyle = 'rgba(0, 255, 0, 0.85)'
        ctx.fillText(glyph(), x, py)

        // A dimmer glyph just behind the head gives the column depth cheaply.
        ctx.fillStyle = 'rgba(0, 255, 0, 0.28)'
        ctx.fillText(glyph(), x, py - FONT_SIZE)

        drops[i] = py > height && Math.random() > 0.975 ? 0 : y + 1
      })
    }

    const tick = (now: number) => {
      if (now - last >= FRAME_MS) {
        paint()
        last = now
      }
      frame = requestAnimationFrame(tick)
    }

    resize()

    if (reduced) {
      paint() // one frame, then stop
      return
    }

    frame = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
