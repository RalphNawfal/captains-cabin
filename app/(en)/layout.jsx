import '../globals.css'
import { display, body } from '@/lib/fonts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
      <body className="min-h-dvh antialiased">
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
