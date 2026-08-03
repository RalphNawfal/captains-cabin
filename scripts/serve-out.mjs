/**
 * Serves ./out the way a flat static host does, so the export can be verified
 * exactly as it will be deployed — trailing slashes, 404.html and all.
 *
 * Usage: npm run serve  →  http://localhost:4321
 */

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.join(process.cwd(), 'out')
const PORT = Number(process.env.PORT ?? 4321)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

async function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const candidates = decoded.endsWith('/')
    ? [path.join(ROOT, decoded, 'index.html')]
    : [path.join(ROOT, decoded), path.join(ROOT, `${decoded}.html`), path.join(ROOT, decoded, 'index.html')]

  for (const candidate of candidates) {
    // Never serve outside out/.
    if (!path.resolve(candidate).startsWith(ROOT)) continue
    try {
      const info = await stat(candidate)
      if (info.isFile()) return candidate
    } catch {
      // try the next candidate
    }
  }
  return null
}

createServer(async (req, res) => {
  const file = await resolve(req.url ?? '/')

  if (!file) {
    const notFound = path.join(ROOT, '404.html')
    try {
      res.writeHead(404, { 'content-type': TYPES['.html'] })
      res.end(await readFile(notFound))
    } catch {
      res.writeHead(404, { 'content-type': TYPES['.txt'] })
      res.end('404')
    }
    return
  }

  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
  res.end(await readFile(file))
}).listen(PORT, () => {
  console.log(`Serving ./out on http://localhost:${PORT}`)
})
