/**
 * Base-path handling.
 *
 * The site has to work at two addresses: the root (custom domain, eventually)
 * and a subpath (`/captains-cabin/` on GitHub Pages today). Next.js applies
 * `basePath` to `next/link`, `next/image` and `_next/*` automatically — but NOT
 * to raw `<img src>` or to metadata icon URLs, and this site has 76 of those
 * between the image manifest and the favicon/OG set.
 *
 * So every hand-written root-relative path goes through `asset()`. One place to
 * change, nothing to keep in sync.
 *
 * `PAGES_BASE_PATH` is supplied by `actions/configure-pages` in the deploy
 * workflow, which is the same mechanism Next's official Pages template uses.
 * Unset means "serving from the root", which is the local-dev and custom-domain
 * case.
 */

/** e.g. '/captains-cabin', or '' at the root. Never has a trailing slash. */
export const BASE_PATH = (process.env.PAGES_BASE_PATH || '').replace(/\/$/, '')

/**
 * Prefix a root-relative path with the base path.
 *
 * Absolute URLs and anything already prefixed are returned untouched, so this is
 * safe to apply more than once.
 */
export function asset(path) {
  if (!path) return path
  if (/^[a-z]+:/i.test(path) || path.startsWith('//')) return path
  if (!BASE_PATH) return path
  if (path.startsWith(`${BASE_PATH}/`)) return path
  return `${BASE_PATH}${path.startsWith('/') ? '' : '/'}${path}`
}
