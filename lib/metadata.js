// Explicit .js extension: this module is also imported by the plain-Node build
// scripts in scripts/, which do not have a bundler's resolution rules.
import { SITE_URL, site } from './site.js'
import { asset } from './paths.js'

/** Canonical route table. */
export const ROUTES = {
  home: '/',
  menu: '/menu/',
  story: '/story/',
  findUs: '/find-us/',
}

/**
 * Icons and the share card are declared here rather than via app/icon.png and
 * app/opengraph-image.jpg — those are metadata routes, and Next 16's metadata
 * route loader breaks on this project's path (see README). Plain files in
 * public/ referenced explicitly do the same job with no build risk.
 *
 * The OG image matters more than usual: this bar gets shared on WhatsApp, which
 * renders a large preview card.
 */
const ICONS = {
  icon: [
    { url: asset('/favicon.svg'), type: 'image/svg+xml' },
    { url: asset('/favicon-32.png'), sizes: '32x32', type: 'image/png' },
    { url: asset('/favicon-96.png'), sizes: '96x96', type: 'image/png' },
  ],
  apple: [{ url: asset('/apple-touch-icon.png'), sizes: '180x180' }],
}

/**
 * Deliberately NOT run through asset().
 *
 * Next resolves openGraph/twitter image URLs by concatenating them onto
 * `metadataBase`, and metadataBase is SITE_URL which already carries the base
 * path. Prefixing here as well produces `/captains-cabin/captains-cabin/og.jpg`.
 *
 * Icons and `manifest` are different — Next emits those literally, so they DO
 * need asset(). Verified in both builds; see scripts/verify-build.mjs.
 */
const OG_IMAGE = {
  url: '/og.jpg',
  width: 1200,
  height: 630,
  alt: "Inside Captain's Cabin — the wood-panelled room, signed walls and low warm light",
}

export function pageMetadata({ route, title, description }) {
  const path = ROUTES[route]

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: site.name,
    icons: ICONS,
    manifest: asset('/manifest.webmanifest'),
    authors: [{ name: 'Tramano Creative', url: 'https://tramanocreative.com' }],
    creator: 'Tramano Creative',
    publisher: site.name,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_LB',
      url: path,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}
