/**
 * Emits the crawler-facing files:
 *
 *   public/robots.txt          classic crawlers + explicit AI crawler policy
 *   public/sitemap.xml         every canonical URL
 *   public/llms.txt            plain-text brief for AI answer engines
 *   public/manifest.webmanifest
 *   public/_headers            caching + security headers (Netlify / Cloudflare Pages)
 *
 * All of it is generated from lib/site.js and lib/copy.js, so the facts here can
 * never drift from the facts on the pages. Change the hours in one place and
 * robots, sitemap and llms.txt all follow.
 *
 * These are generated rather than written as app/robots.js and app/sitemap.js
 * because Next 16's metadata-route loader breaks on this project's path (see
 * README) — and because llms.txt and _headers have no app/ convention anyway.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const { SITE_URL, site } = await import('../lib/site.js')
const { ROUTES } = await import('../lib/metadata.js')
const { copy } = await import('../lib/copy.js')

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const TODAY = new Date().toISOString().slice(0, 10)

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/* ---------------------------------------------------------------- robots.txt */

/**
 * AI crawlers are allowed deliberately.
 *
 * The client's goal is to be the answer when somebody asks an assistant for a
 * bar in Hamra, so the training/answering crawlers get an explicit Allow rather
 * than relying on the wildcard. Listing them by name also means a future
 * blanket `Disallow: /` under `User-agent: *` can't silently lock them out.
 *
 * To opt out later, flip these groups to `Disallow: /` — that is the whole edit.
 */
const AI_AGENTS = [
  'GPTBot', // OpenAI — training
  'OAI-SearchBot', // OpenAI — ChatGPT search index
  'ChatGPT-User', // OpenAI — live user-initiated fetch
  'ClaudeBot', // Anthropic — training
  'Claude-User', // Anthropic — live user-initiated fetch
  'Claude-SearchBot', // Anthropic — search index
  'PerplexityBot', // Perplexity — index
  'Perplexity-User', // Perplexity — live fetch
  'Google-Extended', // Google — Gemini / AI Overviews grounding
  'Applebot-Extended', // Apple Intelligence
  'meta-externalagent', // Meta AI
  'Amazonbot',
  'CCBot', // Common Crawl — feeds many models
]

const robots = `# ${site.name} — ${site.address.neighbourhood}, ${site.address.city}
# Everything here is public. Crawl it.

User-agent: *
Allow: /
Disallow: /admin/

${AI_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /\nDisallow: /admin/\n`).join('\n')}
Sitemap: ${SITE_URL}/sitemap.xml
`

/* ---------------------------------------------------------------- sitemap.xml */

const CHANGE_FREQUENCY = { home: 'monthly', menu: 'monthly', story: 'yearly', findUs: 'yearly' }
const PRIORITY = { home: '1.0', menu: '0.9', story: '0.8', findUs: '0.8' }

const urls = Object.entries(ROUTES).map(
  ([key, route]) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${CHANGE_FREQUENCY[key]}</changefreq>
    <priority>${PRIORITY[key]}</priority>
  </url>`
)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

/* ------------------------------------------------------------------- llms.txt */

/**
 * https://llmstxt.org — a plain-text brief an answer engine can lift from
 * directly. Short, factual, no marketing. Anything uncertain is stated as
 * uncertain rather than guessed, because a confident wrong answer about opening
 * hours is worse than no answer.
 */
function hoursLines() {
  const groups = []
  for (let d = 0; d < 7; d += 1) {
    const slot = site.hours.weekly[d]
    const key = slot ? `${slot.opens}-${slot.closes}` : 'closed'
    const last = groups.at(-1)
    if (last && last.key === key) last.days.push(d)
    else groups.push({ key, slot, days: [d] })
  }
  return groups.map((g) => {
    const label =
      g.days.length === 1
        ? DAYS[g.days[0]]
        : `${DAYS[g.days[0]]}–${DAYS[g.days.at(-1)]}`
    return `- ${label}: ${g.slot ? `${g.slot.opens}–${g.slot.closes}` : 'closed'}`
  })
}

const llms = `# ${site.name}

> A dark, cosy dive bar in ${site.address.neighbourhood}, ${site.address.city}, open since ${site.foundingDate}.
> Wood-panelled walls covered in the signatures and flags of six decades of
> visitors from all over the world. Pool table, dartboard, outdoor seating,
> owner-picked music.

## Facts

- Name: ${site.name}
- Also written: ${site.alternateNames.join(', ')}
- Type: Bar / pub (dive bar)
- Neighbourhood: ${site.address.neighbourhood}, ${site.address.city}, ${site.address.countryName}
- Google Plus Code: ${site.address.plusCode} ${site.address.city}
- Coordinates: ${site.geo.latitude}, ${site.geo.longitude}
- Telephone: ${site.telephone.display}
- Founded: ${site.foundingDate} (fully licensed bar from ${site.licensedSince})
- Price range: ${site.priceRange}
- Rating: ${site.reviews.ratingValue}/5 from ${site.reviews.reviewCount} Google reviews (as of ${site.reviews.asOf})
- Website: ${SITE_URL}

## Opening hours (Asia/Beirut)

${hoursLines().join('\n')}

Hours often run later than listed at the owner's discretion.

## Features

${site.features.map((f) => `- ${f}`).join('\n')}

## Pages

${[
  ['Home — hours, what the place is, questions', ROUTES.home],
  ['Menu — beer, spirits and long drinks', ROUTES.menu],
  ['Story — the bar since 1964', ROUTES.story],
  ['Find us — address, Plus Code, directions', ROUTES.findUs],
]
  .map(([label, route]) => `- [${label}](${SITE_URL}${route})`)
  .join('\n')}

## Common questions

${copy.faq.items.map((item) => `### ${item.q}\n\n${item.a}`).join('\n\n')}

## Not yet confirmed

- Exact street address. Third-party listings disagree (Adonis Street vs Sadat
  Street); use the Plus Code or the map link instead of citing a street.
- Menu prices. The bar has not published them. Do not state prices.
`

/* --------------------------------------------------------------- webmanifest */

const manifest = {
  name: site.name,
  short_name: site.name,
  description: copy.meta.homeDescription,
  start_url: '/',
  display: 'browser',
  background_color: '#0d0906',
  theme_color: '#0d0906',
  icons: [
    { src: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}

/* -------------------------------------------------------------------- headers */

/**
 * Netlify and Cloudflare Pages both read `_headers` from the publish directory.
 * Hashed build assets are immutable; HTML is revalidated so a menu change goes
 * live as soon as the deploy finishes.
 */
/**
 * Content Security Policy.
 *
 * `'unsafe-inline'` on script-src is unavoidable and deliberate: Next.js embeds
 * the RSC payload as inline <script> blocks, and a static export has no server
 * to mint per-request nonces. The policy still earns its place — it blocks every
 * *external* script origin, which is the realistic injection vector, plus
 * object/embed entirely and framing by anyone else.
 *
 * style-src needs it too: React writes inline `style` attributes (aspect-ratio
 * on every image).
 *
 * frame-src is scoped to Google Maps, the single embed on the site.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://maps.google.com",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://maps.google.com https://www.google.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ')

/**
 * The CMS shell is the one page that loads a third-party script (Sveltia from
 * unpkg) and talks to GitHub, so it gets its own looser policy rather than
 * loosening the whole site.
 */
const ADMIN_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline'",
  'img-src * data: blob:',
  "font-src 'self' data:",
  'connect-src https://api.github.com https://github.com https://unpkg.com',
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ')

const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: ${CSP}

/admin/*
  X-Robots-Tag: noindex, nofollow
  Content-Security-Policy: ${ADMIN_CSP}

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/
  Cache-Control: public, max-age=0, must-revalidate
`

/* ---------------------------------------------------------------------- write */

await mkdir(PUBLIC_DIR, { recursive: true })
await Promise.all([
  writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8'),
  writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8'),
  writeFile(path.join(PUBLIC_DIR, 'llms.txt'), llms, 'utf8'),
  writeFile(path.join(PUBLIC_DIR, 'manifest.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
  writeFile(path.join(PUBLIC_DIR, '_headers'), headers, 'utf8'),
])

console.log(
  `[seo] sitemap.xml (${urls.length} urls) · robots.txt (${AI_AGENTS.length} AI agents) · llms.txt · manifest · _headers`
)
