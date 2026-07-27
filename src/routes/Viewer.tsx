import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandIcon,
  ExternalLinkIcon,
  MonitorIcon,
  RotateCwIcon,
  SmartphoneIcon,
  TabletIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import '@/styles/pixel.css'
import { MatrixRain } from '@/components/MatrixRain'
import { Plate } from '@/components/Plate'
import { accession, byId, neighbours } from '@/lib/archive'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/utils'

const WIDTHS = [
  { w: 1440, label: '1440', Icon: MonitorIcon },
  { w: 834, label: '834', Icon: TabletIcon },
  { w: 390, label: '390', Icon: SmartphoneIcon },
] as const

const TOP_BAR = 52
const CAPTION_SPACE = 64
const LOAD_TIMEOUT_MS = 6000

type Phase = 'loading' | 'loaded' | 'failed'

export function Viewer() {
  const { id = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const version = byId(id)

  const requested = Number(params.get('w'))
  const width = WIDTHS.some((v) => v.w === requested) ? requested : 1440

  const [phase, setPhase] = useState<Phase>('loading')
  const [scale, setScale] = useState(1)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  const { previous, next } = neighbours(id)
  const external = version?.status === 'external'
  const src = version?.path ? asset(version.path) : undefined

  const setWidth = useCallback(
    (w: number) => {
      const nextParams = new URLSearchParams(params)
      nextParams.set('w', String(w))
      setParams(nextParams, { replace: true })
    },
    [params, setParams],
  )

  // Scale down rather than clip when the chosen width exceeds the stage. The old viewer
  // clipped silently and squashed on small screens.
  useLayoutEffect(() => {
    const measure = () => {
      const available = stageRef.current?.clientWidth ?? width
      setScale(Math.min(1, available / width))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [width])

  useEffect(() => {
    if (!src) return
    setPhase('loading')
    const timer = window.setTimeout(
      () => setPhase((p) => (p === 'loading' ? 'failed' : p)),
      LOAD_TIMEOUT_MS,
    )
    return () => window.clearTimeout(timer)
  }, [src])

  const reload = useCallback(() => {
    const frame = frameRef.current
    // iframe.src reflects the content attribute, so this resets to the original URL.
    // contentWindow.location.reload() would re-run wherever the visitor navigated to.
    if (frame) frame.src = frame.src
    setPhase('loading')
  }, [])

  const fullscreen = useCallback(() => {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      switch (e.key) {
        case '1':
          setWidth(1440)
          break
        case '2':
          setWidth(834)
          break
        case '3':
          setWidth(390)
          break
        case 'ArrowLeft':
          if (previous) navigate(`/v/${previous.id}?w=${width}`)
          break
        case 'ArrowRight':
          if (next) navigate(`/v/${next.id}?w=${width}`)
          break
        case 'r':
        case 'R':
          reload()
          break
        case 'f':
        case 'F':
          fullscreen()
          break
        case 'Escape':
          if (!document.fullscreenElement) navigate(`/#${id}`)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [previous, next, width, id, navigate, reload, fullscreen, setWidth])

  if (!version) {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas px-6 text-center">
        <div>
          <p className="label-caps">VERSION NOT FOUND</p>
          <p className="mt-2 text-ink-2">
            No entry with the id <code className="font-mono text-ink">{id}</code>.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block border border-hairline-strong px-4 py-2 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink hover:border-phosphor hover:bg-surface-hover"
          >
            Back to archive
          </Link>
        </div>
      </main>
    )
  }

  const announce =
    phase === 'failed'
      ? `Could not load version ${version.number}`
      : phase === 'loaded'
        ? `Loaded version ${version.number}`
        : `Loading version ${version.number}`

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <div aria-live="polite" className="sr-only">
        {announce}. Width {width} pixels.
      </div>

      <header
        className="flex shrink-0 items-center gap-3 border-b border-hairline bg-surface px-3 font-mono text-[13px]"
        style={{ height: TOP_BAR }}
      >
        <Link
          to={`/#${version.id}`}
          className="flex items-center gap-2 px-2 py-1.5 uppercase tracking-[0.08em] text-ink-2 hover:text-ink"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
          Archive
        </Link>
        <span className="h-4 w-px bg-hairline" aria-hidden="true" />
        <span className="tracking-[0.10em] text-ink-3">{accession(version)}</span>
        <span className="truncate text-ink-2">{version.title}</span>

        <div className="mx-auto flex items-center gap-1">
          {WIDTHS.map(({ w, label, Icon }) => (
            <button
              key={w}
              type="button"
              onClick={() => setWidth(w)}
              aria-pressed={w === width}
              aria-label={`Width ${label} pixels`}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-[4px] px-2.5 text-[12px] tnum transition-colors duration-120',
                w === width
                  ? 'bg-surface-hover text-ink'
                  : 'text-ink-3 hover:text-ink-2',
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <nav className="flex items-center gap-1" aria-label="Version stepping">
          <StepLink to={previous && `/v/${previous.id}?w=${width}`} label="Previous version">
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
          </StepLink>
          <StepLink to={next && `/v/${next.id}?w=${width}`} label="Next version">
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </StepLink>
          <IconButton onClick={reload} label="Reload version">
            <RotateCwIcon className="size-3.5" aria-hidden="true" />
          </IconButton>
          <IconButton onClick={fullscreen} label="Fullscreen">
            <ExpandIcon className="size-3.5" aria-hidden="true" />
          </IconButton>
          {src && (
            <a
              href={src}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink"
            >
              Open raw
              <ExternalLinkIcon className="size-3" aria-hidden="true" />
            </a>
          )}
        </nav>
      </header>

      <div
        ref={stageRef}
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6"
        style={{ backgroundImage: GLYPH_TEXTURE, backgroundRepeat: 'repeat' }}
      >
        {external ? (
          <ExternalPanel version={version} />
        ) : phase === 'failed' ? (
          <FailurePanel version={version} />
        ) : (
          <div
            className="relative overflow-hidden rounded-card border border-hairline bg-black shadow-[0_24px_64px_-24px_rgb(0_0_0/0.7)] transition-[width] duration-220 ease-out-expo"
            style={{
              width: width * scale,
              height: `calc(100dvh - ${TOP_BAR + CAPTION_SPACE}px)`,
            }}
          >
            <iframe
              ref={frameRef}
              src={src}
              title={`Portfolio version ${version.number}, ${version.date}`}
              loading="eager"
              onLoad={() => setPhase('loaded')}
              sandbox={
                version.status === 'restored'
                  ? 'allow-scripts allow-same-origin allow-forms'
                  : undefined
              }
              className="origin-top-left border-0 bg-white"
              style={{
                width,
                height: `calc((100dvh - ${TOP_BAR + CAPTION_SPACE}px) / ${scale})`,
                transform: `scale(${scale})`,
              }}
            />

            {phase === 'loading' && (
              <div className="absolute inset-0 grid place-items-center bg-canvas transition-opacity duration-240">
                <MatrixRain className="absolute inset-0 size-full" />
                <p
                  className="relative select-none text-phosphor"
                  style={{ font: "48px var(--font-pixel)" }}
                >
                  BOOTING v{version.number} …
                </p>
              </div>
            )}
          </div>
        )}

        {!external && phase !== 'failed' && (
          <figcaption className="mt-4 text-center font-mono text-[11px] tracking-[0.06em] text-ink-3">
            <div>
              {version.number} · {version.date} · {version.techStack.join(' · ')}
            </div>
            <div>Original build, unmodified · may reference assets that no longer exist</div>
            {scale < 1 && (
              <div className="mt-1 tnum">
                {width} px · shown at {Math.round(scale * 100)}%
              </div>
            )}
          </figcaption>
        )}
      </div>
    </div>
  )
}

/** A 3% glyph-column wash. Static image, not a running canvas. */
const GLYPH_TEXTURE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="120"><g fill="#00ff00" fill-opacity="0.03" font-family="monospace" font-size="12">
    <text x="4" y="14">0</text><text x="4" y="46">1</text><text x="4" y="86">0</text>
    <text x="30" y="28">1</text><text x="30" y="66">0</text><text x="30" y="108">1</text>
  </g></svg>`,
)}")`

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center rounded-[4px] text-ink-3 transition-colors duration-120 hover:bg-surface-hover hover:text-ink"
    >
      {children}
    </button>
  )
}

function StepLink({
  to,
  label,
  children,
}: {
  to: string | undefined
  label: string
  children: React.ReactNode
}) {
  if (!to) {
    return (
      <span
        aria-disabled="true"
        aria-label={`${label} (unavailable)`}
        className="grid size-8 place-items-center rounded-[4px] text-hairline-strong"
      >
        {children}
      </span>
    )
  }
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center rounded-[4px] text-ink-3 transition-colors duration-120 hover:bg-surface-hover hover:text-ink"
    >
      {children}
    </Link>
  )
}

function FailurePanel({ version }: { version: ReturnType<typeof byId> }) {
  if (!version) return null
  return (
    <div className="w-full max-w-2xl rounded-card border border-warn bg-surface p-8">
      <p className="flex items-center gap-2 font-mono text-[13px] text-warn">
        <TriangleAlertIcon className="size-4" aria-hidden="true" />
        <span>✗ could not load {version.path ?? `version ${version.number}`}</span>
      </p>
      <p className="mt-3 text-ink-2">
        This version is preserved as screenshots. The build isn't archived here yet.
      </p>
      <div className="mt-6 grid grid-cols-[1fr_132px] gap-4">
        <Plate src={version.screenshots?.desktop} alt={`Version ${version.number} desktop`} />
        <Plate
          src={version.screenshots?.mobile}
          alt={`Version ${version.number} mobile`}
          ratio="9/19.5"
          matClass="p-1.5"
        />
      </div>
      <div className="mt-6 flex gap-3 font-mono text-[12.5px] uppercase tracking-[0.08em]">
        <Link
          to="/"
          className="border border-hairline-strong px-4 py-2 text-ink hover:border-phosphor hover:bg-surface-hover"
        >
          ← Archive
        </Link>
        {version.sourceUrl && (
          <a
            href={version.sourceUrl}
            target="_blank"
            rel="noopener"
            className="px-4 py-2 text-ink-3 hover:text-ink"
          >
            Source ↗
          </a>
        )}
      </div>
    </div>
  )
}

function ExternalPanel({ version }: { version: ReturnType<typeof byId> }) {
  if (!version) return null
  return (
    <div className="w-full max-w-3xl text-center">
      <Plate src={version.screenshots?.desktop} alt={`${version.number} desktop`} />
      <p className="mt-6 label-caps">External site, not archivable</p>
      {version.externalUrl && (
        <a
          href={version.externalUrl}
          target="_blank"
          rel="noopener"
          className="mt-4 inline-block border border-hairline-strong px-5 py-2.5 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink hover:border-phosphor hover:bg-surface-hover"
        >
          Open {version.externalUrl.replace(/^https?:\/\//, '')} ↗
        </a>
      )}
    </div>
  )
}
