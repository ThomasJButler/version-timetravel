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
  /**
   * Withheld from the site: not on the wall, not in the rail, not in any derived count,
   * and its own URL reports not found. The entry and its vendored build stay in the repo,
   * so restoring it is this one line.
   */
  hidden?: boolean
}

const CLOUDINARY = 'https://res.cloudinary.com/depqttzlt/image/upload'

export const versions: Version[] = [
  {
    id: 'v1',
    number: '1.0',
    title: 'The Beginning',
    // June 2024, from the portfolio repo itself: commit 0ef2adb on 2024-06-06 is tagged
    // "v1.0.1", with "v1.1 - Website" the same day. versions.json said January 2024 and the
    // README said August; the repo has no commits at all in August or September 2024.
    date: 'June 2024',
    iso: '2024-06',
    description:
      'Where it starts. Hand-written HTML and CSS, no framework, no build step, nothing to install. Everything after this is a reaction to it.',
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
      desktop: `${CLOUDINARY}/f_auto,q_auto,w_1200,c_limit/v1785171417/pmdukz9xfns834saol72.jpg`,
      mobile: `${CLOUDINARY}/f_auto,q_auto,w_500,c_limit/v1785171417/gyfjcxdhxr3zhhikjivm.jpg`,
    },
  },
  {
    id: 'v2',
    number: '2.0',
    title: 'Matrix Theme Born',
    // Inferred, not evidenced: there is no v2 tag, and the repo has zero commits in August
    // or September 2024. July (15 commits) is the only activity between v1 in June and the
    // October cluster, so July is the closest defensible date.
    date: 'July 2024',
    iso: '2024-07',
    description:
      'The Matrix theme arrives and never really leaves. A canvas rain effect behind a responsive grid, still with nothing to compile.',
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
      desktop: `${CLOUDINARY}/f_auto,q_auto,w_1200,c_limit/v1785171417/dtils9awlojguxpnsqmp.jpg`,
      mobile: `${CLOUDINARY}/f_auto,q_auto,w_500,c_limit/v1785171417/hppclc0wmztk6awopfrt.jpg`,
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
    techStack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'ScrollMagic', 'Font Awesome'],
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
      desktop: `${CLOUDINARY}/f_auto,q_auto,w_1200,c_limit/v1785171418/ucgoschpmnujpl4r49yf.jpg`,
      mobile: `${CLOUDINARY}/f_auto,q_auto,w_500,c_limit/v1785171418/xzemselnalmyxo6hbrrh.jpg`,
    },
  },
  {
    id: 'landing',
    number: 'Landing Page',
    title: 'Experimental Features',
    date: 'November 2024',
    iso: '2024-11',
    description:
      'A sandbox rather than a release. Navigation ideas, an interactive CV and a few embedded CodePen experiments, most of which fed straight into v3.',
    status: 'archived',
    path: 'archive/landing/landingpage.html',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Font Awesome', 'Canvas API'],
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
    // The only entry still on Cloudinary apart from Commercial, and for a specific reason:
    // this page is built around an embedded CodePen carousel. The pen will not render for a
    // capture (CodePen answers 403 to a headless request), so shooting the archive produces
    // a grey box with a broken-file icon and tells a reader nothing. A real visitor most
    // likely does see the pen. The hosted capture shows the page as it was meant to look.
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
      'The employment-facing site: real work experience, documented for hiring. A separate thing from this lineage, which is where the personal projects live. Its own domain, so it cannot be archived here.',
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
      'The last one built without a bundler. Same stack as v2.5, tightened until there was nothing obvious left to fix.',
    status: 'archived',
    path: 'archive/v2.8/version28.html',
    techStack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'ScrollMagic', 'Font Awesome'],
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
      desktop: `${CLOUDINARY}/f_auto,q_auto,w_1200,c_limit/v1785171418/tdj4bfidase8bieam7oz.jpg`,
      mobile: `${CLOUDINARY}/f_auto,q_auto,w_500,c_limit/v1785171418/jemigbruyzavncrpizxb.jpg`,
    },
  },
  {
    id: 'v3',
    number: '3.0',
    title: 'React Migration',
    date: 'August 2025',
    iso: '2025-08',
    description:
      'Where React actually landed. The tag says so: v3.0-React-Migration. React 19, TypeScript, Vite and Anime.js arrive at once, with GSAP and ScrollMagic carried over from the static years. What opens here is a flattened snapshot rather than that build, because a snapshot is all that was kept.',
    status: 'archived',
    path: 'archive/v3/version30.html',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite 7',
      'React Router 7',
      'Anime.js',
      'GSAP',
      'ScrollMagic',
      'Font Awesome',
    ],
    build: 'Vite 7',
    features: [
      'React 19 with React Router 7',
      'TypeScript across the codebase',
      'Vite 7 build pipeline',
      'Anime.js added alongside GSAP and ScrollMagic',
      'Component-based architecture',
      'Vitest test suite',
      '3D rotating cube showcase',
      'Enhanced Matrix rain effect',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/f_auto,q_auto,w_1200,c_limit/v1785171418/t1kx3yys8exndwmwjfnb.jpg`,
      mobile: `${CLOUDINARY}/f_auto,q_auto,w_500,c_limit/v1785171418/xkcy88fucdyrfszaa46e.jpg`,
    },
  },
  {
    id: 'v3-5',
    number: '3.5',
    title: 'Content and Polish',
    date: 'October 2025',
    iso: '2025-10',
    description:
      'Not the migration, the settling in. A markdown blog, a dev timeline, services pages, and a long run of typography, routing and UX passes. It stayed live longer than anything else in this archive.',
    status: 'restored',
    path: 'archive/v3.5/index.html',
    sourceUrl: 'https://github.com/ThomasJButler/thomasjbutler.github.io/tree/v3.5',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite 7',
      'React Router 7',
      'Anime.js',
      'GSAP',
      'ScrollMagic',
      'Font Awesome',
      'react-markdown',
    ],
    build: 'Vite 7',
    features: [
      'Markdown-driven blog',
      'Vertical dev timeline',
      'Services and project pages',
      'Full React routing',
      'Custom domain and deployment',
      'Typography and styling passes',
      'UX streamlining',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/f_auto,q_auto,w_1200,c_limit/v1785171419/wgpat5eyoshhyzbpb4dk.jpg`,
      mobile: `${CLOUDINARY}/f_auto,q_auto,w_500,c_limit/v1785171419/sexbyexfhqvtte4aijpm.jpg`,
    },
  },
  {
    id: 'v4',
    number: '4.0',
    title: 'shadcn Redesign',
    // The branch opened in May, but the commit archived here is 2026-07-13, the same day
    // v5.0-Operator was tagged. v4 and v5 really were days apart.
    date: 'July 2026',
    iso: '2026-07',
    description:
      'The design system arrives. Tailwind and shadcn on Base UI replace the hand-rolled CSS and the animation libraries that had been there since 2024.',
    status: 'restored',
    path: 'archive/v4/index.html',
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
    screenshots: {
      desktop: `${CLOUDINARY}/f_auto,q_auto,w_1200,c_limit/v1785171419/otg2xr92ggogoqx5qys5.jpg`,
      mobile: `${CLOUDINARY}/f_auto,q_auto,w_500,c_limit/v1785171419/bunp0ea8rcnhvubeqefl.jpg`,
    },
  },
  {
    /**
     * Hidden while Tom is job hunting. This is the shop-window version, and its plate,
     * its description and the build it opens all lead with an offer he is not currently
     * making. Employers are the readers now. The Local and Private AI positioning comes
     * back in late 2026 or 2027, and this entry comes back with it.
     */
    hidden: true,
    id: 'v5',
    number: '5.0',
    title: 'Impression',
    date: 'July 2026',
    iso: '2026-07',
    description:
      'Not a portfolio any more, a shop window. Private, local AI for businesses, sold on its own terms: "AI you own, not AI you rent". Same design system as v4, now prerendered so crawlers and language models read real HTML, with published prices and the projects there to back the work up.',
    status: 'restored',
    path: 'archive/v5/index.html',
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
      'Prerendered at build time, so crawlers and LLMs get real HTML',
      'Local and private AI services with published pricing',
      'Cursor-reactive Matrix rain, performance bounded',
      'Light circuit and dark neon terminal themes',
      'Command palette and keyboard navigation',
      'Generated sitemap, robots.txt and llms.txt',
    ],
    screenshots: {
      desktop: `${CLOUDINARY}/f_auto,q_auto,w_1200,c_limit/v1785171420/ydrw2idbd8wlu3yfypl5.jpg`,
      mobile: `${CLOUDINARY}/f_auto,q_auto,w_500,c_limit/v1785171420/ekl2pisllezg2fatppz5.jpg`,
    },
  },
  {
    id: 'v5-5',
    number: '5.5',
    title: 'Refit',
    date: 'August 2026',
    iso: '2026-08',
    description:
      'The current site. A personal portfolio pointed at one reader: someone deciding whether to interview me. The hero is a greeting, About opens by asking why the site exists at all, and the projects page separates what was built to learn from what was built because I wanted it to exist. Still prerendered, so crawlers and language models get real HTML rather than an empty div.',
    status: 'restored',
    path: 'archive/v5.5/index.html',
    isLive: true,
    sourceUrl: 'https://github.com/ThomasJButler/thomasjbutler.github.io',
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
      'A Portfolio tag on the projects filter, separating what was built to learn from what was built to exist',
      'CRT vignette and scanlines gated behind the effects toggle, so they stop dimming the text',
      'A circular wipe between themes, from the toggle, via the View Transitions API',
      'Still prerendered, so crawlers and language models get real HTML',
      'Leeds, Yorkshire on every surface that names a place',
    ],
    screenshots: {
      desktop: 'shots/v5-5-desktop.jpg',
      mobile: 'shots/v5-5-mobile.jpg',
    },
  },
]
