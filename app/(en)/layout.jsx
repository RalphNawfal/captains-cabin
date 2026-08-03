import '../globals.css'
import { display, body } from '@/lib/fonts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyActions from '@/components/StickyActions'
import { CSP_META } from '@/lib/csp'

export const viewport = {
  themeColor: '#0d0906',
  colorScheme: 'dark',
}

/**
 * Structured data is emitted per page as a single linked `@graph` (see
 * lib/schema.js), not here — each page needs its own WebPage node, and one
 * graph per page beats a sitewide block plus per-page fragments.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* GitHub Pages cannot send headers, so the enforceable part of the
            policy travels in the document. `_headers` still carries the full
            set (including frame-ancestors) for header-capable hosts. */}
        <meta httpEquiv="Content-Security-Policy" content={CSP_META} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-dvh antialiased">
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* Phones only — call and directions reachable from any scroll position. */}
        <StickyActions />
      </body>
    </html>
  )
}
