/**
 * Post-build gate. Runs against ./out and exits non-zero on any defect, so a bad
 * build fails in CI instead of deploying.
 *
 * Checks three things a static site can silently lose:
 *   - metadata and structured data (canonical, OG, icons, one h1, alt text)
 *   - every referenced asset actually exists on disk at the path referenced,
 *     which is what catches a base-path regression
 *   - no secret-shaped value in the shipped output
 *
 *   node scripts/verify-build.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'out')

const BASE = (process.env.PAGES_BASE_PATH || '').replace(/\/$/, '')

const failures = []
const fail = (msg) => failures.push(msg)

if (!fs.existsSync(OUT)) {
  console.error('out/ does not exist — run the build first')
  process.exit(1)
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

const files = walk(OUT)
const htmlFiles = files.filter((f) => f.endsWith('.html'))
const PAGES = ['index.html', 'menu/index.html', 'story/index.html', 'find-us/index.html']

/* ------------------------------------------------------- crawler-facing files */

console.log('crawler files')
for (const f of [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'manifest.webmanifest',
  '_headers',
  'og.jpg',
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
]) {
  const exists = fs.existsSync(path.join(OUT, f))
  if (!exists) fail(`missing out/${f}`)
  console.log(`  ${exists ? 'ok  ' : 'FAIL'} ${f}`)
}

/* ------------------------------------------------------------------ per page */

console.log('\npages')
for (const rel of PAGES) {
  const file = path.join(OUT, rel)
  if (!fs.existsSync(file)) {
    fail(`missing page ${rel}`)
    continue
  }
  const html = fs.readFileSync(file, 'utf8')
  const bad = []

  if (!/<title>/.test(html)) bad.push('title')
  if (!/name="description"/.test(html)) bad.push('description')
  if (!/rel="canonical"/.test(html)) bad.push('canonical')
  if (!/og:image/.test(html)) bad.push('og:image')
  if (!/name="twitter:card"/.test(html)) bad.push('twitter')
  if ((html.match(/rel="icon"/g) ?? []).length < 2) bad.push('icons')
  if (!/<html lang="en"/.test(html)) bad.push('lang')
  if (!/application\/ld\+json/.test(html)) bad.push('json-ld')
  if ((html.match(/<h1/g) ?? []).length !== 1) bad.push('exactly-one-h1')
  if (!/http-equiv="Content-Security-Policy"/i.test(html)) bad.push('csp-meta')

  // Images must carry alt and intrinsic dimensions.
  const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0])
  if (imgs.some((t) => !/\salt=/.test(t))) bad.push('img-without-alt')
  if (imgs.some((t) => !/width=/.test(t) || !/height=/.test(t))) bad.push('img-without-dimensions')

  // JSON-LD must parse and must not contain raw angle brackets.
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    if (/[<>]/.test(m[1])) bad.push('json-ld-unescaped')
    try {
      JSON.parse(m[1])
    } catch {
      bad.push('json-ld-invalid')
    }
  }

  bad.forEach((b) => fail(`${rel}: ${b}`))
  console.log(`  ${bad.length ? 'FAIL' : 'ok  '} ${rel}${bad.length ? ' — ' + bad.join(', ') : ''}`)
}

/* ------------------------------------------- every referenced asset must exist */

console.log('\nasset references')
let checked = 0
const missing = new Set()
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  const refs = [
    ...[...html.matchAll(/(?:src|href)="(\/[^"]*?\.(?:avif|webp|jpg|png|svg|css|js|webmanifest))"/g)].map(
      (m) => m[1]
    ),
    ...[...html.matchAll(/srcSet="([^"]+)"/gi)].flatMap((m) =>
      m[1].split(',').map((s) => s.trim().split(/\s+/)[0])
    ),
  ]
  for (const ref of refs) {
    if (!ref.startsWith('/')) continue
    checked += 1
    // A reference must sit under the base path when one is set.
    if (BASE && !ref.startsWith(`${BASE}/`)) {
      missing.add(`${ref} (missing base path ${BASE})`)
      continue
    }
    const onDisk = path.join(OUT, ref.slice(BASE.length))
    if (!fs.existsSync(onDisk)) missing.add(ref)
  }
}
console.log(`  ${missing.size ? 'FAIL' : 'ok  '} ${checked} references checked, ${missing.size} broken`)
for (const m of [...missing].slice(0, 15)) {
  fail(`asset not found: ${m}`)
  console.log(`       ${m}`)
}

/* ------------------------------------------------- absolute URLs are well-formed
 *
 * Added after a real bug: og:image came out as
 * `…/captains-cabin/captains-cabin/og.jpg` because Next concatenates OG image
 * paths onto metadataBase (which already carries the base path) while emitting
 * icons literally. The on-disk check above could not see it, since it only
 * inspects root-relative references.
 */

console.log('\nabsolute URLs')
const urlProblems = []
for (const rel of PAGES) {
  const file = path.join(OUT, rel)
  if (!fs.existsSync(file)) continue
  const html = fs.readFileSync(file, 'utf8')

  const absolute = [
    ...[...html.matchAll(/<link rel="canonical"[^>]*href="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<meta property="og:(?:url|image)"[^>]*content="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<meta name="twitter:image"[^>]*content="([^"]+)"/g)].map((m) => m[1]),
  ]

  for (const url of absolute) {
    if (!/^https?:\/\//.test(url)) {
      urlProblems.push(`${rel}: not absolute — ${url}`)
      continue
    }
    const { pathname } = new URL(url)
    const segments = pathname.split('/').filter(Boolean)
    // A repeated adjacent segment is the signature of double-prefixing.
    for (let i = 1; i < segments.length; i += 1) {
      if (segments[i] === segments[i - 1]) {
        urlProblems.push(`${rel}: duplicated path segment — ${url}`)
        break
      }
    }
    if (BASE && !pathname.startsWith(BASE)) {
      urlProblems.push(`${rel}: missing base path — ${url}`)
    }
  }
}
urlProblems.forEach((p) => fail(p))
console.log(`  ${urlProblems.length ? 'FAIL' : 'ok  '} ${urlProblems.length} malformed absolute URLs`)
urlProblems.slice(0, 8).forEach((p) => console.log(`       ${p}`))

/* ------------------------------------------------------------------- secrets */

console.log('\nsecrets')
const SECRET = [
  /(?:api[_-]?key|apikey|secret|password|access[_-]?token|auth[_-]?token|client[_-]?secret)\s*[:=]\s*["'][A-Za-z0-9_\-./+]{16,}["']/gi,
  /AKIA[0-9A-Z]{16}/g,
  /ghp_[A-Za-z0-9]{36}/g,
  /gho_[A-Za-z0-9]{36}/g,
  /sk-[A-Za-z0-9]{20,}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./g,
]
let secretCount = 0
for (const f of files) {
  if (!/\.(html|js|json|txt|xml|webmanifest|yml)$/.test(f) && path.basename(f) !== '_headers') continue
  const c = fs.readFileSync(f, 'utf8')
  for (const re of SECRET) {
    for (const m of c.matchAll(re)) {
      secretCount += 1
      fail(`secret-shaped value in ${path.relative(OUT, f)}: ${m[0].slice(0, 40)}`)
    }
  }
}
console.log(`  ${secretCount ? 'FAIL' : 'ok  '} ${secretCount} secret-shaped values`)

/* -------------------------------------------------------------------- result */

console.log('\nresult')
if (failures.length === 0) {
  console.log(`  passed${BASE ? ` (base path ${BASE})` : ' (served from root)'}`)
} else {
  failures.forEach((f) => console.log(`  FAIL ${f}`))
}
process.exit(failures.length ? 1 : 0)
