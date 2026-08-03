/**
 * Generates the favicon set and the social-share image.
 *
 * The mark is a ship's wheel — the one hanging on the back wall in the hero
 * photograph, and the obvious reading of the name. It is drawn as pure vector
 * shapes with no text, so rasterising never depends on a font being installed
 * and it stays legible at 16px.
 *
 * The Open Graph image matters more than usual here: this bar gets shared on
 * WhatsApp, which renders a large preview card. Without an og:image that card
 * is a grey box.
 *
 *   node scripts/generate-brand-assets.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const PUBLIC = path.join(process.cwd(), 'public')
const SRC = path.join(process.cwd(), 'assets', 'images', 'hero-interior.jpg')

const INK = '#0d0906'
const WALL = '#d8a63c'

/** Ship's wheel: hub, rim, eight spokes, eight handles. */
function wheelSvg(size, { bg = INK, fg = WALL, padding = 0.12 } = {}) {
  const c = size / 2
  const r = size * (0.5 - padding)
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i
    const x1 = c + Math.cos(a) * r * 0.18
    const y1 = c + Math.sin(a) * r * 0.18
    const x2 = c + Math.cos(a) * r * 1.18
    const y2 = c + Math.sin(a) * r * 1.18
    return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${fg}" stroke-width="${(size * 0.075).toFixed(2)}" stroke-linecap="round"/>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${bg}"/>
  ${spokes}
  <circle cx="${c}" cy="${c}" r="${r.toFixed(2)}" fill="none" stroke="${fg}" stroke-width="${(size * 0.1).toFixed(2)}"/>
  <circle cx="${c}" cy="${c}" r="${(r * 0.26).toFixed(2)}" fill="${fg}"/>
</svg>`
}

await mkdir(PUBLIC, { recursive: true })

// Scalable favicon — the one modern browsers prefer.
await writeFile(path.join(PUBLIC, 'favicon.svg'), wheelSvg(64), 'utf8')

// Raster fallbacks. 32px is the tab icon; 180 is iOS home screen.
for (const [file, size] of [
  ['favicon-32.png', 32],
  ['favicon-96.png', 96],
  ['apple-touch-icon.png', 180],
  ['icon-512.png', 512],
]) {
  await sharp(Buffer.from(wheelSvg(size)))
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, file))
  console.log(`[brand] ${file}`)
}

// Open Graph / WhatsApp card: 1200x630 from the hero, darkened at the foot so
// the platform's own title text stays readable over it.
if (existsSync(SRC)) {
  const W = 1200
  const H = 630
  const scrim = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${INK}" stop-opacity="0.15"/>
        <stop offset="70%" stop-color="${INK}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="${INK}" stop-opacity="0.85"/>
      </linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
    </svg>`
  )

  await sharp(SRC)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .composite([{ input: scrim, blend: 'over' }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(PUBLIC, 'og.jpg'))
  console.log('[brand] og.jpg 1200x630')
} else {
  console.warn(`[brand] ${SRC} missing — skipped og.jpg`)
}

console.log('[brand] done')
