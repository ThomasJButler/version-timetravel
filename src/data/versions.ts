/**
 * The single source of truth for the archive.
 *
 * Imported at build time, never fetched. The old build did `fetch('/data/versions.json')`
 * without the base path, which 404s in production and silently fell back to a hard-coded
 * array, so the v3.5 entry never appeared on the live site for months. A module import
 * cannot fail that way: if it is missing, the build fails, which is the right place to
 * find out.
 *
 * Authored OLDEST FIRST. Never call .reverse() on the exported array; derive an order.
 *
 * DESCRIPTIONS: v2.5's is final (written for the design). The rest are drafts, kept
 * strictly to what the archive and repo history actually show. Rewrite them in your
 * own voice before launch.
 */

export type Status = 'archived' | 'restored' | 'external' | 'pending'

export interface Version {
  /** URL segment and anchor id. */
  id: string
  /** Display label: '2.5', 'Landing Page', 'Commercial'. */
  number: string
  title: string
  /** Human date, shown in the wall label. */
  date: string
  /** Sort key and era driver. */
  iso: string
  description: string
  status: Status
  /** Orthogonal to status: v5 will be both restored and live. */
  isLive?: boolean
  /** Relative to BASE_URL. Always an explicit file, never a bare directory. */
  path?: string
  externalUrl?: string
  sourceUrl?: string
  techStack: string[]
  features: string[]
  build?: string
  pages?: number
  screenshots?: { desktop?: string; mobile?: string }
}

const CLOUDINARY = 'https://res.cloudinary.com/depqttzlt/image/upload'

export const versions: Version[] = [
  {
    id: 'v1',
    number: '1.0',
    title: 'The Beginning',
    // Corrected from versions.json's "January 2024": the README, the annotation inside the
    // v1 snapshot itself, and the portfolio repo (created 2024-03-03, first commits
    // 2024-06-30) all say August 2024.
    date: 'August 2024',
    iso: '2024-08',
    description:
      'The first portfolio. Hand-written HTML and CSS with no build step, no framework and no dependencies.',
    status: 'archived',
    path: 'archive/v1/index.html',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    build: 'None (hand-authored)',
    features: [
      'Initial portfolio launch',
      'Basic responsive design',
      'Simple navigation structure',
      'Project portfolio section',
      'Contact form implementation',
      'Social media integration',
      'Basic SEO implementation',
      'Custom 404 page',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/v1737668237/VersionTimeTravelv1desktop_fcmf21.png`,
      mobile: `${CLOUDINARY}/v1737668237/VersionTimeTravelv1mobile_xd9ypl.png`,
    },
  },
  {
    id: 'v2',
    number: '2.0',
    title: 'Matrix Theme Born',
    // Also corrected: versions.json said August 2024, the README and the v2 snapshot say September.
    date: 'September 2024',
    iso: '2024-09',
    description:
      'The Matrix identity arrives. A canvas rain effect behind a responsive grid, still with no build step.',
    status: 'archived',
    path: 'archive/v2/index.html',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
    build: 'None (hand-authored)',
    features: [
      'Introduced Matrix theme',
      'Dynamic canvas background',
      'Responsive grid layout',
      'Skill progress visualization',
      'Project showcase section',
      'Dark mode toggle functionality',
      'Enhanced SEO optimization',
      'Lazy loading for images',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/v1737668253/VersionTimeTravelv2desktop_gg9tpn.png`,
      mobile: `${CLOUDINARY}/v1737668253/VersionTimeTravelv2mobile_lcyyvb.png`,
    },
  },
  {
    id: 'v2-5',
    number: '2.5',
    title: 'Animation Upgrade',
    date: 'October 2024',
    iso: '2024-10',
    description:
      'The Matrix look stopped being a novelty and became a system. GSAP and ScrollMagic drove the whole page, and it was the first version that felt designed rather than assembled.',
    status: 'archived',
    path: 'archive/v2.5/version25.html',
    techStack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'ScrollMagic'],
    build: 'None (hand-authored)',
    features: [
      'Enhanced Matrix animation effects',
      'Vincent van Gogh-inspired infinity gallery',
      'Improved mobile responsiveness',
      'Integrated GSAP animations',
      'Added ScrollMagic effects',
      'Time Travel Version History feature',
      'Enhanced performance optimization',
      'Implemented custom error pages',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/v1737668269/VersionTimeTravelv25desktop_wrj8uu.png`,
      mobile: `${CLOUDINARY}/v1737668270/VersionTimeTravelv25mobile_ua2l41.png`,
    },
  },
  {
    id: 'landing',
    number: 'Landing Page',
    title: 'Experimental Features',
    date: 'November 2024',
    iso: '2024-11',
    description:
      'A testing ground rather than a release. Navigation concepts, an interactive CV and embedded CodePen experiments that fed into v3.',
    status: 'archived',
    path: 'archive/landing/landingpage.html',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Font Awesome'],
    build: 'None (hand-authored)',
    features: [
      'Pre-v3 experimentation',
      'Version TimeTravel addition',
      'FontAwesome elements',
      'Interactive CV feature',
      'New navigation concepts',
      'Advanced CSS buttons',
      'Improved Matrix effects',
      'Refined responsive design',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/v1737668231/landingpagedesktop_ssozki.png`,
      mobile: `${CLOUDINARY}/v1737668228/landingpagemobile_exon4w.png`,
    },
  },
  {
    id: 'commercial',
    number: 'Commercial',
    title: 'Professional Portfolio',
    date: 'December 2024',
    iso: '2024-12',
    description:
      'The employment-facing site: real work experience, documented for hiring. A separate thing from this lineage, which is where the personal projects live. Its own domain, not archivable here.',
    status: 'external',
    isLive: true,
    externalUrl: 'https://thomasjbutler.me',
    sourceUrl: 'https://github.com/ThomasJButler/Commercial-Portfolio-React',
    techStack: ['React', 'JavaScript', 'SCSS', 'Bootstrap 5', 'Vite'],
    build: 'Vite',
    features: [
      'Separate site for commercial work',
      '3+ years experience showcase',
      'Apple-inspired design',
      'Light/dark theme switching',
      'Multi-language support',
      '90+ Lighthouse score',
      'WCAG compliant',
      'SEO optimized',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/v1752552064/commercialdesktop_nn2p8t.png`,
      mobile: `${CLOUDINARY}/v1752552062/commercialmobile_nrh17c.png`,
    },
  },
  {
    id: 'v2-8',
    number: '2.8',
    title: 'Final Static Version',
    date: 'January 2025',
    iso: '2025-01',
    description:
      'The last version built without a bundler. Mostly consolidation: the same stack as v2.5, tightened.',
    status: 'archived',
    path: 'archive/v2.8/version28.html',
    techStack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'ScrollMagic'],
    build: 'None (hand-authored)',
    features: [
      'Refined Matrix theme',
      'Smoother animations',
      'Better mobile experience',
      'Performance optimizations',
      'Accessibility improvements',
      'SEO enhancements',
      'Code quality improvements',
      'Bug fixes and polish',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/v1752549398/v28desktop_f5lxp1.png`,
      mobile: `${CLOUDINARY}/v1752549394/v28mobile_g7rovj.png`,
    },
  },
  {
    id: 'v3',
    number: '3.0',
    title: 'Hybrid Architecture',
    date: 'July 2025',
    iso: '2025-07',
    description:
      'A build step at last. Vite and ES modules over the same hand-written HTML, which made the next jump to React possible.',
    status: 'archived',
    path: 'archive/v3/version30.html',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Vite', 'GSAP', 'ScrollMagic'],
    build: 'Vite',
    features: [
      'Hybrid HTML/CSS/JS with module system',
      'Vite build tools integration',
      'GSAP animations and ScrollMagic',
      '3D rotating cube showcase',
      'Enhanced Matrix rain effect',
      'Module-based CSS architecture',
      'Performance optimized loading',
      'Responsive grid layouts',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/v1754541799/v30_sesrmp.png`,
      // TODO: v3 and v3.5 currently share one asset and reuse it for mobile. Re-shoot.
      mobile: `${CLOUDINARY}/v1754541799/v30_sesrmp.png`,
    },
  },
  {
    id: 'v3-5',
    number: '3.5',
    title: 'React Migration',
    date: 'September 2025',
    iso: '2025-09',
    description:
      'A full rewrite in React and TypeScript. The first version that was an application rather than a document, and the one that stayed live longest.',
    status: 'restored',
    path: 'archive/v3.5/index.html',
    sourceUrl: 'https://github.com/ThomasJButler/thomasjbutler.github.io/tree/v3.5',
    techStack: ['React 19', 'TypeScript', 'Vite 7', 'Anime.js', 'SCSS'],
    build: 'Vite 7',
    features: [
      'Complete React 19 migration',
      'TypeScript integration',
      'Component-based architecture',
      'Modern build tools (Vite 7)',
      'Enhanced animations with Anime.js',
      'Advanced state management',
      'Optimized performance',
      'Modern development workflow',
    ],
    screenshots: {
      desktop: 'shots/v3.5-desktop.jpg',
      mobile: 'shots/v3.5-mobile.jpg',
    },
  },
  {
    id: 'v4',
    number: '4.0',
    title: 'shadcn Redesign',
    date: 'May 2026',
    iso: '2026-05',
    description:
      'The design system arrives: Tailwind v4 and shadcn on Base UI, with routed pages for projects, services and updates.',
    status: 'pending',
    sourceUrl:
      'https://github.com/ThomasJButler/thomasjbutler.github.io/tree/v4.0-ShadCNRedesign',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite 7',
      'Tailwind 4',
      'shadcn/ui',
      'Base UI',
      'Framer Motion',
      'React Router 7',
    ],
    build: 'Vite 7',
    pages: 7,
    features: [
      'Tailwind v4 with shadcn on Base UI',
      'Routed pages: home, about, projects, services, contact, updates',
      'Project detail modal',
      'Framer Motion section reveals',
      'Markdown-driven updates page',
      'Lucide icon set throughout',
    ],
  },
  {
    id: 'v5',
    number: '5.0',
    title: 'Impression',
    date: 'July 2026',
    iso: '2026-07',
    description:
      'Where the personal site stops being a playground. Same design system as v4, plus server rendering and a prerender step, but now services-oriented and AI-focused, with the projects there to back the experience up. This is the one that goes on business cards.',
    status: 'pending',
    isLive: true,
    sourceUrl:
      'https://github.com/ThomasJButler/thomasjbutler.github.io/tree/v5.2-Impression',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite 7',
      'Tailwind 4',
      'shadcn/ui',
      'Base UI',
      'Framer Motion',
      'React Router 7',
      'SSR prerender',
    ],
    build: 'Vite 7 + prerender',
    features: [
      'Server-rendered and prerendered at build time',
      'Rebrand toward AI engineering',
      'Generated sitemap, robots.txt and llms.txt',
      'Per-route Open Graph imagery',
      'Same shadcn + Base UI system as v4',
    ],
  },
]
