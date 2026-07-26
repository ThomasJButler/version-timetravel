/**
 * The only way to build a URL into this site.
 *
 * The site is served from /version-timetravel/, so a leading slash resolves to the domain
 * root and 404s in production while working perfectly in dev. Every iframe src, img src and
 * internal href goes through here. Never write a root-absolute literal.
 */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
