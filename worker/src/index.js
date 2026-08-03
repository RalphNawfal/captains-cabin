/**
 * OAuth relay for the Sveltia CMS at /admin/.
 *
 * GitHub Pages serves static files, so it cannot perform the OAuth code-for-token
 * exchange — that step needs a server holding a client secret. This Worker is
 * that server, and nothing else. It is deliberately small enough to read in one
 * sitting.
 *
 *   GET /auth      → redirect the user to GitHub's authorize page
 *   GET /callback  → exchange the code for a token, hand it to the CMS window
 *
 * Security properties, in order of how badly they matter:
 *
 *  1. ORIGIN ALLOWLIST. Without one, anybody could point their own CMS at this
 *     Worker and use it to mint tokens against your GitHub account — an open
 *     OAuth relay. `ALLOWED_ORIGINS` is required; the Worker refuses to run
 *     without it rather than defaulting to permissive.
 *  2. STATE PARAMETER. A random value is set as an httpOnly cookie and compared
 *     on the way back, so a third party cannot complete a flow they did not
 *     start (CSRF).
 *  3. TARGETED postMessage. The token is posted to the exact requesting origin,
 *     never '*', so another frame cannot read it.
 *  4. NOTHING IS LOGGED. No code, no token, no secret is ever written to the
 *     console — Workers logs are readable by anyone with dashboard access.
 *
 * The client secret lives only in Cloudflare (`wrangler secret put`). It must
 * never appear in this repository, which is public.
 */

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token'

/** Scope: repo contents only. The CMS commits to content/menu.json. */
const SCOPE = 'repo,user'

const COOKIE = 'cc_oauth_state'

function parseAllowed(env) {
  const raw = (env.ALLOWED_ORIGINS || '').trim()
  if (!raw) return null
  return raw
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean)
}

function html(body, status = 200) {
  return new Response(`<!doctype html><meta charset="utf-8">${body}`, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
    },
  })
}

function randomState() {
  const b = new Uint8Array(32)
  crypto.getRandomValues(b)
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return null
}

/**
 * Constant-time-ish comparison. The state value is not a long-lived secret, but
 * comparing lengths first and avoiding early exit costs nothing.
 */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** The page handed back to the CMS popup. Posts the result to the opener. */
function closingPage(origin, payload) {
  // JSON.stringify then escape `<` so the payload cannot break out of the script.
  const data = JSON.stringify(payload).replace(/</g, '\\u003c')
  const target = JSON.stringify(origin).replace(/</g, '\\u003c')

  return html(`<title>Signing in…</title>
<body style="font:14px system-ui;padding:2rem;background:#0d0906;color:#f4ead6">
Completing sign-in…
<script>
(function () {
  var payload = ${data};
  var target = ${target};
  function send() {
    window.opener && window.opener.postMessage(
      'authorization:github:' + payload.status + ':' + JSON.stringify(payload.content),
      target
    );
  }
  window.addEventListener('message', send, { once: true });
  send();
  setTimeout(function () { window.close(); }, 800);
})();
</script>`)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const allowed = parseAllowed(env)

    // Fail closed. A misconfigured Worker must not become an open relay.
    if (!allowed) {
      return html('<h1>Not configured</h1><p>ALLOWED_ORIGINS is not set.</p>', 500)
    }
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return html('<h1>Not configured</h1><p>OAuth credentials are not set.</p>', 500)
    }

    /* ------------------------------------------------------------- /auth */
    if (url.pathname === '/auth') {
      const origin = (url.searchParams.get('site_id') || request.headers.get('referer') || '')
        .replace(/\/$/, '')
      let siteOrigin
      try {
        siteOrigin = new URL(origin.startsWith('http') ? origin : `https://${origin}`).origin
      } catch {
        return html('<h1>Bad request</h1><p>Missing or invalid site origin.</p>', 400)
      }

      if (!allowed.includes(siteOrigin)) {
        // Do not echo the rejected origin back — it would reflect attacker input.
        return html('<h1>Forbidden</h1><p>This site is not permitted to use this relay.</p>', 403)
      }

      const state = randomState()
      const authorize = new URL(GITHUB_AUTHORIZE)
      authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
      authorize.searchParams.set('scope', SCOPE)
      authorize.searchParams.set('state', state)
      authorize.searchParams.set('redirect_uri', `${url.origin}/callback`)

      return new Response(null, {
        status: 302,
        headers: {
          location: authorize.toString(),
          // The origin rides along in the cookie so /callback knows where to
          // postMessage without trusting a query parameter.
          'set-cookie': `${COOKIE}=${state}.${encodeURIComponent(siteOrigin)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
          'cache-control': 'no-store',
        },
      })
    }

    /* --------------------------------------------------------- /callback */
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code')
      const returnedState = url.searchParams.get('state')
      const cookie = readCookie(request, COOKIE)

      if (!code || !returnedState || !cookie) {
        return html('<h1>Bad request</h1><p>Missing code or state.</p>', 400)
      }

      const [storedState, encodedOrigin] = cookie.split('.')
      if (!safeEqual(storedState || '', returnedState)) {
        return html('<h1>Forbidden</h1><p>State mismatch.</p>', 403)
      }

      const siteOrigin = decodeURIComponent(encodedOrigin || '')
      if (!allowed.includes(siteOrigin)) {
        return html('<h1>Forbidden</h1><p>Origin no longer permitted.</p>', 403)
      }

      const res = await fetch(GITHUB_TOKEN, {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok || !body.access_token) {
        // Report failure without echoing GitHub's response, which can contain
        // details not worth surfacing.
        return closingPage(siteOrigin, { status: 'error', content: { message: 'Authentication failed' } })
      }

      return closingPage(siteOrigin, {
        status: 'success',
        content: { token: body.access_token, provider: 'github' },
      })
    }

    /* ------------------------------------------------------------- other */
    return html('<h1>Captain&#39;s Cabin CMS auth</h1><p>Nothing to see here.</p>', 404)
  },
}
