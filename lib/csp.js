/**
 * Content Security Policy, shared between the `<meta>` tag the pages carry and
 * the `_headers` file generated for header-capable hosts.
 *
 * Why a meta tag at all: GitHub Pages cannot send custom headers, so `_headers`
 * is inert there. A meta CSP is the only enforceable policy on Pages.
 *
 * `'unsafe-inline'` on script-src is unavoidable and deliberate — Next embeds the
 * RSC payload as inline <script> blocks and a static export cannot mint
 * per-request nonces. The policy still blocks every *external* script origin,
 * which is the realistic injection vector, plus object/embed entirely.
 *
 * style-src needs it too: React writes inline `style` attributes (aspect-ratio on
 * every image).
 */
const DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': [
    "'self'",
    'data:',
    'https://*.googleapis.com',
    'https://*.gstatic.com',
    'https://maps.google.com',
  ],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'frame-src': ['https://maps.google.com', 'https://www.google.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'none'"],
  'upgrade-insecure-requests': [],
}

/**
 * `frame-ancestors` is ignored when delivered via <meta> — the spec only honours
 * it as a real header. It is therefore emitted in `_headers` only, and on GitHub
 * Pages the site can be framed. Low impact for a brochure site with no forms,
 * auth or cookies, but a real gap versus a header-capable host.
 */
const HEADER_ONLY = {
  'frame-ancestors': ["'self'"],
}

function serialise(directives) {
  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(' ')}` : key))
    .join('; ')
}

/** For the <meta http-equiv> tag. Omits directives meta cannot enforce. */
export const CSP_META = serialise(DIRECTIVES)

/** For `_headers` on Netlify / Cloudflare Pages. */
export const CSP_HEADER = serialise({ ...DIRECTIVES, ...HEADER_ONLY })

/**
 * The CMS shell loads Sveltia from a CDN and talks to the GitHub API, so it gets
 * its own policy rather than widening the sitewide one.
 */
export const CSP_ADMIN = serialise({
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://unpkg.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ['*', 'data:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ['https://api.github.com', 'https://github.com', 'https://unpkg.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
})
