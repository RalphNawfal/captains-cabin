/**
 * Single source of truth for NAP (name, address, phone), hours and identity.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⚠  CLIENT-BLOCKED VALUES
 *  Anything marked `UNCONFIRMED` below was inferred from third-party sources and
 *  MUST be replaced with values given directly by the client before launch.
 *  Grep for "UNCONFIRMED" to find every one of them.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Absolute origin + base path. Everything canonical derives from this: canonical
 * links, og:url, the sitemap, and llms.txt.
 *
 * Set `SITE_URL` in the environment to override. The deploy workflow sets it to
 * the GitHub Pages URL; point it at the real domain once that is registered in
 * the client's name, and drop `PAGES_BASE_PATH` at the same time.
 *
 * No trailing slash — route paths already start with one.
 */
export const SITE_URL = (
  process.env.SITE_URL || 'https://ralphnawfal.github.io/captains-cabin'
).replace(/\/$/, '')

export const site = {
  name: "Captain's Cabin",

  /** Transliterated forms people actually search for. Feeds schema `alternateName`. */
  alternateNames: ['Captains Cabin', "Captain's Cabin Hamra", "Captain's Cabin Beirut"],

  /** One-sentence description used in schema. Keep factual. */
  description:
    'A dark, cosy dive bar in Hamra, Beirut, open since 1964. Wood-panelled walls carrying the signatures and flags of six decades of visitors, with a pool table, a dartboard and outdoor seating.',

  foundingDate: '1964',
  /** Converted from a fish shop in 1964; fully licensed bar from 1972. */
  licensedSince: '1972',

  telephone: {
    /** E.164, for tel: links and schema. */
    e164: '+9611740516',
    /** How locals write it. */
    local: '01 740 516',
    display: '+961 1 740 516',
  },

  /**
   * WhatsApp — UNCONFIRMED. The landline above is very likely not on WhatsApp.
   * Ask the client for the mobile number they actually answer.
   * Leave as null to hide every WhatsApp affordance sitewide.
   */
  whatsapp: null,

  address: {
    /**
     * Adonis Street, on two independent signals:
     *   - Time Out Beirut's editorial listing says "Adonis Street, Hamra".
     *   - Google's own map places the pin on the street it labels Adonis, just
     *     west of where it meets Sadat.
     *
     * The blogs saying "Sadat Street" are describing the cross street you turn
     * from, which is why the sources appeared to disagree.
     *
     * Note the Google Business Profile itself carries NO street address — only
     * the plus code VFWG+QR2 — so publishing this creates no conflicting NAP
     * signal against the listing. It can only help.
     *
     * Still worth one sentence of confirmation from Andre before launch.
     */
    street: 'Adonis Street',
    neighbourhood: 'Hamra',
    city: 'Beirut',
    country: 'LB',
    countryName: 'Lebanon',
    /** Verified from the Google Business Profile. */
    plusCode: 'VFWG+QR2',
  },

  /** Verified from the Google Business Profile listing. */
  geo: {
    latitude: 33.8968849,
    longitude: 35.4770244,
  },

  /**
   * CONFIRMED by the client, 2026-08-03. Supersedes Time Out's "5pm–3am", which
   * was wrong, and Google's listing, which only gave an opening time.
   *
   * Sunday closes at 00:30; every other night at 03:00. Both cross midnight,
   * which lib/hours.js handles — at 01:00 on a Tuesday the bar is open because
   * of *Monday's* session, not Tuesday's.
   *
   * Set a day to null if the bar ever starts closing one.
   */
  hours: {
    confirmed: true,
    /**
     * Multiple sources note Andre extends the night at his own discretion. The
     * table above is what we publish; this flag surfaces the caveat alongside it
     * so the site is never caught out being pedantically wrong at 3:30am.
     */
    extendsAtWill: true,
    // 0 = Sunday … 6 = Saturday
    weekly: {
      0: { opens: '18:00', closes: '00:30' },
      1: { opens: '18:00', closes: '03:00' },
      2: { opens: '18:00', closes: '03:00' },
      3: { opens: '18:00', closes: '03:00' },
      4: { opens: '18:00', closes: '03:00' },
      5: { opens: '18:00', closes: '03:00' },
      6: { opens: '18:00', closes: '03:00' },
    },
  },

  /** Asia/Beirut. Used by the open/closed indicator so it reads bar-local time. */
  timeZone: 'Asia/Beirut',

  /** Matches the `$$` tier shown on the Google and Instagram listings. */
  priceRange: '$$',

  /**
   * Recorded for handover, deliberately NOT linked from the site or emitted in
   * schema `sameAs`: the account has one post and 45 followers, so sending
   * visitors or crawlers there makes an active bar look dormant.
   *
   * If the client starts posting, add it back to `sameAs` in lib/schema.js and
   * to the footer.
   */
  social: {
    instagram: 'https://www.instagram.com/captains_cabin1964/',
    instagramHandle: '@captains_cabin1964',
    linked: false,
  },

  /**
   * Deep links to the verified Google listing.
   * CID 4332004372205772418 (0x3c1e5f064ac39e82) was read off the live listing.
   */
  maps: {
    cid: '4332004372205772418',
    place: 'https://www.google.com/maps?cid=4332004372205772418',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=33.8968849,35.4770244',
    /**
     * Send customers here to leave a review — this feeds the map pack, which is
     * where "best bar in Hamra" is actually won.
     * UNCONFIRMED — the writereview endpoint needs the Place ID (ChIJ…), not the
     * CID. Grab it from the Google Business Profile dashboard once claimed.
     */
    review: null,
  },

  /** Verified 2026-08-03 from the Google Business Profile. Refresh periodically. */
  reviews: {
    ratingValue: 4.6,
    reviewCount: 225,
    asOf: '2026-08-03',
  },

  /** Feeds schema `amenityFeature`. Keep in step with copy.home.features. */
  features: [
    'Pool table',
    'Darts',
    'Signed walls',
    'Visitors’ flags',
    'Outdoor seating',
    'Owner-picked music',
  ],
}

