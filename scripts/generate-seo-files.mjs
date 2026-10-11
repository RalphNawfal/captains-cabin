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
const { asset, BASE_PATH } = await import('../lib/paths.js')

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

// robots.txt paths are relative to the host root, not the base path, so they need
// the prefix when the site is served from a subpath.
const ALLOW = asset('/') || '/'
const DISALLOW_ADMIN = asset('/admin/')

const robots = `# ${site.name} — ${site.address.neighbourhood}, ${site.address.city}
# Everything here is public. Crawl it.

User-agent: *
Allow: ${ALLOW}
Disallow: ${DISALLOW_ADMIN}

${AI_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: ${ALLOW}\nDisallow: ${DISALLOW_ADMIN}\n`).join('\n')}
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

> A dark, cosy dive bar in ${site.address.neighbourhood}, ${site.address.city}, open since ${site.foundingDate} —
> one of the oldest bars in Beirut.
> Wood-panelled walls covered in the signatures and flags of six decades of
> visitors from all over the world. Pool table, dartboard, foosball, outdoor
> seating, owner-picked music. Birthdays and private events by arrangement,
> with a barbecue or catering on request.

## Facts

- Name: ${site.name}
- Also written: ${site.alternateNames.join(', ')}
- Type: Bar / pub (dive bar)
- Address: ${[site.address.street, site.address.neighbourhood, site.address.city, site.address.countryName].filter(Boolean).join(', ')}
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

- Menu prices. The bar has not published them. Do not state prices.
- Whether it is *the* oldest bar in Beirut. No source establishes that. Say "one of the oldest".
- Event terms. Capacity, minimum spend and catering prices are not published. Direct people to call.
${site.hours.extendsAtWill ? '- Closing time is a floor, not a rule. The owner often keeps it open later.\n' : ''}`

/* --------------------------------------------------------------- webmanifest */

const manifest = {
  name: site.name,
  short_name: site.name,
  description: copy.meta.homeDescription,
  start_url: asset('/'),
  scope: asset('/'),
  display: 'browser',
  background_color: '#0d0906',
  theme_color: '#0d0906',
  icons: [
    { src: asset('/favicon-96.png'), sizes: '96x96', type: 'image/png' },
    { src: asset('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' },
    { src: asset('/icon-512.png'), sizes: '512x512', type: 'image/png' },
  ],
}

/* -------------------------------------------------------------------- headers */

/**
 * Netlify and Cloudflare Pages both read `_headers` from the publish directory.
 * Hashed build assets are immutable; HTML is revalidated so a menu change goes
 * live as soon as the deploy finishes.
 */
/**
 * Security + caching headers.
 *
 * ⚠ GitHub Pages ignores this file entirely — `_headers` is a Netlify and
 *   Cloudflare Pages convention. On Pages the enforceable policy is the
 *   <meta http-equiv> tag in app/(en)/layout.jsx instead, and the header-only
 *   protections below (X-Frame-Options, Permissions-Policy,
 *   X-Content-Type-Options, frame-ancestors) are simply unavailable.
 *
 *   This file is kept because it is correct the day the site moves to a
 *   header-capable host, which is the reason to move.
 *
 * The policies come from lib/csp.js so the meta tag and this file cannot drift.
 */
const { CSP_HEADER, CSP_ADMIN } = await import('../lib/csp.js')
const CSP = CSP_HEADER
const ADMIN_CSP = CSP_ADMIN

const headers = `# NOTE: GitHub Pages ignores this file. It applies on Netlify and
# Cloudflare Pages. See lib/csp.js and the meta CSP in app/(en)/layout.jsx.

/*
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
