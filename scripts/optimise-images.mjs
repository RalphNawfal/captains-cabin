/**
 * Build-time image pipeline.
 *
 * `output: "export"` disables the next/image optimizer, so nothing resizes or
 * re-encodes images for us. This script does it once at build time instead:
 * drop a source image in assets/images/, get sized AVIF + WebP + JPEG fallbacks
 * in public/img/, plus a manifest with real dimensions so every <img> can carry
 * width/height and avoid layout shift.
 *
 * Sources stay out of public/ deliberately — we ship the derivatives, not the
 * 6MB originals.
 */

import { mkdir, readdir, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const SRC_DIR = path.join(process.cwd(), 'assets', 'images')
const OUT_DIR = path.join(process.cwd(), 'public', 'img')
const MANIFEST = path.join(process.cwd(), 'lib', 'image-manifest.json')

/** Widths chosen for phone-first delivery; 1600 covers desktop hero only. */
const WIDTHS = [400, 800, 1200, 1600]
const FORMATS = [
  { ext: 'avif', options: { quality: 50 } },
  { ext: 'webp', options: { quality: 72 } },
]

async function main() {
  if (!existsSync(SRC_DIR)) {
    await mkdir(SRC_DIR, { recursive: true })
    await writeManifest({})
    console.log('[images] assets/images/ is empty — nothing to optimise.')
    return
  }

  const entries = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f))

  if (entries.length === 0) {
    await writeManifest({})
    console.log('[images] No source images found in assets/images/.')
    return
  }

  // Imported lazily so a build with no images doesn't pay sharp's startup cost.
  const { default: sharp } = await import('sharp')

  await mkdir(OUT_DIR, { recursive: true })
  const manifest = {}

  for (const file of entries) {
    const srcPath = path.join(SRC_DIR, file)
    const slug = path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const image = sharp(srcPath, { failOn: 'none' })
    const meta = await image.metadata()
    const maxWidth = meta.width ?? WIDTHS[WIDTHS.length - 1]
    const widths = WIDTHS.filter((w) => w <= maxWidth)
    if (widths.length === 0) widths.push(maxWidth)

    const sources = {}

    for (const { ext, options } of FORMATS) {
      sources[ext] = []
      for (const width of widths) {
        const outName = `${slug}-${width}.${ext}`
        const outPath = path.join(OUT_DIR, outName)

        // Skip work if the derivative is already newer than its source.
        if (existsSync(outPath)) {
          const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(outPath)])
          if (outStat.mtimeMs >= srcStat.mtimeMs) {
            sources[ext].push({ width, src: `/img/${outName}` })
            continue
          }
        }

        await sharp(srcPath, { failOn: 'none' })
          .resize({ width, withoutEnlargement: true })
          [ext](options)
          .toFile(outPath)

        sources[ext].push({ width, src: `/img/${outName}` })
      }
    }

    manifest[slug] = {
      width: meta.width ?? null,
      height: meta.height ?? null,
      aspectRatio: meta.width && meta.height ? +(meta.width / meta.height).toFixed(4) : null,
      sources,
    }

    console.log(`[images] ${file} → ${widths.length * FORMATS.length} derivatives`)
  }

  await writeManifest(manifest)
  console.log(`[images] Wrote manifest for ${Object.keys(manifest).length} image(s).`)
}

async function writeManifest(manifest) {
  await mkdir(path.dirname(MANIFEST), { recursive: true })
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
}

main().catch((error) => {
  console.error('[images] Failed:', error)
  process.exit(1)
})
