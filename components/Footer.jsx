import { copy } from '@/lib/copy'
import { site } from '@/lib/site'
import { ROUTES } from '@/lib/metadata'
import Link from 'next/link'
import HoursTable from './HoursTable'

/**
 * Three columns on desktop, stacked on mobile, on the same grid as the rest of
 * the site: hours, where to find us, and the pages.
 *
 * The only outbound links are to the Google Business Profile. Instagram was
 * removed deliberately — the account has one post and 45 followers, so sending
 * people there from a finished site made the bar look less active than it is.
 * The Google listing is where the 225 reviews live and where we want traffic to
 * land, because that listing is what wins the map pack.
 */
export default function Footer() {
  const year = 2026

  const pages = [
    { href: ROUTES.menu, label: copy.nav.menu },
    { href: ROUTES.story, label: copy.nav.story },
    { href: ROUTES.events, label: copy.nav.events },
    { href: ROUTES.findUs, label: copy.nav.findUs },
  ]

  return (
    <footer className="border-line/70 mt-20 border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 sm:gap-10 sm:px-8 lg:grid-cols-3 lg:gap-14 lg:px-12">
        <section>
          <h2 className="font-display text-wall mb-4 text-xs font-bold tracking-[0.28em] uppercase">
            {copy.common.hoursHeading}
          </h2>
          <HoursTable />
        </section>

        <section>
          <h2 className="font-display text-wall mb-4 text-xs font-bold tracking-[0.28em] uppercase">
            {copy.footer.findHeading}
          </h2>

          <address className="text-muted space-y-1 not-italic">
            <p>{`${site.address.neighbourhood}, ${site.address.city}`}</p>
            <p className="text-cream/80 font-display tracking-wider">
              {site.address.plusCode} {site.address.city}
            </p>
          </address>

          <p className="mt-3">
            <a
              href={`tel:${site.telephone.e164}`}
              dir="ltr"
              className="tap-inline text-wall-bright font-semibold tabular-nums"
            >
              {site.telephone.display}
            </a>
          </p>

          <ul className="mt-1 space-y-1 text-sm">
            <li>
              <a
                href={site.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-inline link-underline hover:text-wall-bright"
              >
                {copy.common.directions}
              </a>
            </li>
            <li>
              <a
                href={site.maps.place}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-inline link-underline hover:text-wall-bright"
              >
                {copy.footer.googleListing}
              </a>
            </li>
            {/* Review link feeds the map pack. Rendered only once the real Place
                ID is in lib/site.js — see UNCONFIRMED there. */}
            {site.maps.review ? (
              <li>
                <a
                  href={site.maps.review}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-inline link-underline hover:text-wall-bright"
                >
                  {copy.footer.leaveReview}
                </a>
              </li>
            ) : null}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-wall mb-4 text-xs font-bold tracking-[0.28em] uppercase">
            {copy.footer.pagesHeading}
          </h2>
          <ul className="space-y-1 text-sm">
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="tap-inline link-underline hover:text-wall-bright">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-muted mt-4 max-w-[34ch] text-sm">
            {copy.home.ratingLine(site.reviews.ratingValue, site.reviews.reviewCount)}
          </p>
        </section>
      </div>

      <div className="border-line/70 border-t">
        <div className="text-muted mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>{copy.footer.rights(year)}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {/* Photos are visitor uploads from the Google listing — see
                assets/photo-provenance.json. Credit stays until rights are cleared. */}
            <p>{copy.footer.photoCredit}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
