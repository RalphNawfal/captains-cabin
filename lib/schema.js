import { site, SITE_URL } from './site.js'
import { openingHoursSpecification } from './hours.js'
import menu from '@/content/menu.json'

/**
 * Structured data, emitted as a single linked `@graph` per page.
 *
 * One graph with stable `@id`s beats five loose blocks: the business, the site,
 * the page and the breadcrumb all reference each other explicitly, so a parser
 * — Google's or an LLM's — resolves "who is this page about" in one hop instead
 * of inferring it.
 *
 * Nothing in here is asserted unless it is known. Grep UNCONFIRMED in
 * lib/site.js for what is still missing; those fields are omitted rather than
 * guessed, because a wrong `streetAddress` is a conflicting NAP signal against
 * the Google Business Profile and worse than no address at all.
 */

const ID = {
  bar: `${SITE_URL}/#bar`,
  website: `${SITE_URL}/#website`,
  logo: `${SITE_URL}/#logo`,
  menu: `${SITE_URL}/menu/#menu`,
  page: (path) => `${SITE_URL}${path}#webpage`,
  breadcrumb: (path) => `${SITE_URL}${path}#breadcrumb`,
}

function menuHasContent() {
  return menu.sections?.some((s) => s.items?.length > 0)
}

/** The business. Referenced by every page rather than repeated. */
function barNode() {
  const { address, geo, telephone, reviews } = site

  const postalAddress = {
    '@type': 'PostalAddress',
    addressLocality: address.city,
    addressRegion: address.neighbourhood,
    addressCountry: address.country,
  }
  if (address.street) postalAddress.streetAddress = address.street

  const node = {
    '@type': 'BarOrPub',
    '@id': ID.bar,
    name: site.name,
    alternateName: site.alternateNames,
    description: site.description,
    url: SITE_URL,
    telephone: telephone.e164,
    priceRange: site.priceRange,
    foundingDate: site.foundingDate,
    address: postalAddress,
    geo: { '@type': 'GeoCoordinates', latitude: geo.latitude, longitude: geo.longitude },
    hasMap: site.maps.place,
    image: { '@id': ID.logo },
    logo: { '@id': ID.logo },
    openingHoursSpecification: openingHoursSpecification(),
    // Google listing only. The Instagram account is deliberately not linked
    // anywhere on this site — one post, 45 followers, and pointing search
    // engines at it makes the bar look dormant. See lib/site.js.
    sameAs: [site.maps.place].filter(Boolean),
    amenityFeature: site.features.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    areaServed: [
      { '@type': 'Place', name: 'Hamra, Beirut' },
      { '@type': 'Place', name: 'Ras Beirut' },
      { '@type': 'City', name: 'Beirut' },
    ],
    isAccessibleForFree: true,
    publicAccess: true,
  }

  // Only claim a rating we actually read off the live listing.
  if (reviews?.ratingValue && reviews?.reviewCount) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviews.ratingValue,
      reviewCount: reviews.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Only advertise a menu once it says something. An empty Menu is a warning.
  if (menuHasContent()) node.hasMenu = { '@id': ID.menu }

  return node
}

function imageNode() {
  return {
    '@type': 'ImageObject',
    '@id': ID.logo,
    url: `${SITE_URL}/og.jpg`,
    contentUrl: `${SITE_URL}/og.jpg`,
    width: 1200,
    height: 630,
    caption: "Inside Captain's Cabin — the wood-panelled room, signed walls and low warm light",
  }
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: SITE_URL,
    name: site.name,
    alternateName: site.alternateNames,
    inLanguage: 'en',
    publisher: { '@id': ID.bar },
  }
}

function webPageNode({ path, title, description, breadcrumb }) {
  const node = {
    '@type': 'WebPage',
    '@id': ID.page(path),
    url: `${SITE_URL}${path}`,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.bar },
    primaryImageOfPage: { '@id': ID.logo },
  }
  if (breadcrumb) node.breadcrumb = { '@id': ID.breadcrumb(path) }
  return node
}

function breadcrumbNode(path, trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(path),
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

/** Menu / MenuSection / MenuItem. */
function menuNode() {
  if (!menuHasContent()) return null

  return {
    '@type': 'Menu',
    '@id': ID.menu,
    name: 'Menu',
    inLanguage: 'en',
    hasMenuSection: menu.sections.map((section) => ({
      '@type': 'MenuSection',
      name: section.name,
      hasMenuItem: section.items.map((item) => {
        const menuItem = { '@type': 'MenuItem', name: item.name }
        if (item.description) menuItem.description = item.description
        // Omit offers entirely until prices are real — a price of 0 is a lie.
        if (item.price != null && menu.pricesConfirmed) {
          menuItem.offers = {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: menu.currency,
          }
        }
        return menuItem
      }),
    })),
  }
}

function faqNode(items) {
  if (!items?.length) return null
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

/**
 * Build the whole page graph.
 *
 * @param {object} o
 * @param {string} o.path       canonical path, e.g. '/menu/'
 * @param {string} o.title
 * @param {string} o.description
 * @param {Array}  [o.trail]    breadcrumb trail
 * @param {Array}  [o.faq]      FAQ items to attach
 * @param {boolean}[o.withMenu] include the Menu node
 */
export function pageGraph({ path, title, description, trail, faq, withMenu = false }) {
  const nodes = [
    barNode(),
    imageNode(),
    websiteNode(),
    webPageNode({ path, title, description, breadcrumb: Boolean(trail) }),
  ]

  if (trail) nodes.push(breadcrumbNode(path, trail))
  if (withMenu) nodes.push(menuNode())
  if (faq) nodes.push(faqNode(faq))

  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  }
}
