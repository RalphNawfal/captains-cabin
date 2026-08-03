import manifest from '@/lib/image-manifest.json'
import { asset } from '@/lib/paths'

/**
 * Static-export image element.
 *
 * `output: "export"` turns off the next/image optimizer, so the work happens at
 * build time in scripts/optimise-images.mjs. This just consumes the manifest:
 * AVIF first, WebP fallback, real intrinsic width/height so nothing shifts, and
 * lazy + async-decode everywhere except the LCP image.
 *
 * Unknown name → renders nothing rather than a broken image, so a photo removed
 * from assets/ can never leave a hole in the page.
 */
export default function Photo({ name, alt, sizes = '100vw', priority = false, className = '' }) {
  const entry = manifest[name]
  if (!entry) return null

  // Manifest paths are stored root-relative; asset() adds the base path so the
  // same manifest works at / and at /captains-cabin/.
  const srcset = (format) =>
    entry.sources[format].map((s) => `${asset(s.src)} ${s.width}w`).join(', ')

  const fallback = asset(entry.sources.webp.at(-1)?.src)

  return (
    <img
      src={fallback}
      srcSet={srcset('webp')}
      sizes={sizes}
      width={entry.width}
      height={entry.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      style={{ aspectRatio: entry.aspectRatio }}
    />
  )
}

/**
 * Picture variant, used where AVIF's smaller payload is worth the extra markup —
 * i.e. the large images. AVIF runs roughly 30–40% under WebP on these scans.
 */
export function PhotoPicture({ name, alt, sizes = '100vw', priority = false, className = '' }) {
  const entry = manifest[name]
  if (!entry) return null

  const srcset = (format) =>
    entry.sources[format].map((s) => `${asset(s.src)} ${s.width}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={asset(entry.sources.webp.at(-1)?.src)}
        width={entry.width}
        height={entry.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
        style={{ aspectRatio: entry.aspectRatio }}
      />
    </picture>
  )
}
