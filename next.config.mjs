/**
 * @type {import('next').NextConfig}
 *
 * `PAGES_BASE_PATH` is set by `actions/configure-pages` in the deploy workflow,
 * so the same source builds correctly for a GitHub Pages project subpath and for
 * a custom domain at the root. Locally it is unset, meaning root.
 *
 * Note this only covers next/link, next/image and _next/* assets. Hand-written
 * root-relative paths go through `asset()` in lib/paths.js.
 */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.PAGES_BASE_PATH || '',

  // Static export has no image optimizer. Images are pre-sized and pre-encoded
  // by scripts/optimise-images.mjs at build time instead.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
