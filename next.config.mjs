/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  // Static export has no image optimizer. Images are pre-sized and pre-encoded
  // by scripts/optimise-images.mjs at build time instead — see README.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
