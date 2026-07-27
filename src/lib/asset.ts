/**
 * The only way to build a URL into this site.
 *
 * The site is served from /version-timetravel/, so a leading slash resolves to the domain
 * root and 404s in production while working perfectly in dev. Every iframe src, img src and
 * internal href goes through here. Never write a root-absolute literal.
 */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/**
 * Screenshots come from two places while the older versions wait to be re-shot: newly
 * captured ones live in public/shots, older ones are still on Cloudinary. Absolute URLs pass
 * through, everything else is treated as repo-relative.
 */
export const media = (src: string) => (/^https?:\/\//.test(src) ? src : asset(src))
