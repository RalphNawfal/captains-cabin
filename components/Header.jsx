import Link from 'next/link'
import { copy } from '@/lib/copy'
import { ROUTES } from '@/lib/metadata'
import { site } from '@/lib/site'

/**
 * No hamburger, no client JS. Three links fit on a phone if you let them wrap.
 * A menu that needs JavaScript to open is a menu that fails on a bad connection.
 */
export default function Header() {
  const links = [
    { href: ROUTES.menu, label: copy.nav.menu },
    { href: ROUTES.story, label: copy.nav.story },
    { href: ROUTES.findUs, label: copy.nav.findUs },
  ]

  return (
    <header className="border-line/70 border-b">
      <a
        href="#main"
        className="bg-wall text-ink sr-only px-4 py-2 focus:not-sr-only focus:absolute focus:z-50"
      >
        {copy.nav.skipToContent}
      </a>

      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-5 py-3 sm:px-8 lg:px-12"
      >
        <Link
          href={ROUTES.home}
          className="font-display text-wall-bright tap-inline me-auto text-lg font-bold tracking-wide uppercase"
        >
          {copy.home.title}
        </Link>

        <ul className="flex flex-wrap items-center gap-x-5 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="tap-inline hover:text-wall-bright transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tap-to-call sits in the header on every page — most visitors are
          standing outside deciding whether to walk in. */}
      <div className="border-line/70 bg-wood/60 border-t">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
          <a href={`tel:${site.telephone.e164}`} className="tap-inline text-wall-bright text-sm font-semibold">
            {site.telephone.display}
          </a>
        </div>
      </div>
    </header>
  )
}
