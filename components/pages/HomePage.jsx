import Link from 'next/link'
import Action from '@/components/Action'
import OpenStatus from '@/components/OpenStatus'
import HoursTable from '@/components/HoursTable'
import JsonLd from '@/components/JsonLd'
import { PhotoPicture } from '@/components/Photo'
import Faq from '@/components/Faq'
import { Container, Section, Heading, Prose, Split, TWO_COL } from '@/components/Layout'
import { copy } from '@/lib/copy'
import { ROUTES } from '@/lib/metadata'
import { site } from '@/lib/site'
import { formatTime } from '@/lib/hours'
import { pageGraph } from '@/lib/schema'

/**
 * Ordered to tell it rather than list it:
 *
 *   the room → who has been in it → what is in it → outside → the music
 *   → the invitation → the questions people actually ask → menu, story, hours
 *
 * Everything sits on the one grid from components/Layout.jsx, so the hero, every
 * heading and every photograph share a left edge at all widths.
 *
 * Interiors only — the exterior photographs are used on /find-us/ where
 * recognising the building is the job.
 */
export default function HomePage() {
  const [pool, darts, walls, flags, outside] = copy.home.features
  const sampleDay = site.hours.weekly[5] ?? Object.values(site.hours.weekly)[0]
  // En dash to match HoursTable. This string is visible until OpenStatus hydrates.
  const hoursFallback = sampleDay
    ? `${formatTime(sampleDay.opens)} – ${formatTime(sampleDay.closes)}`
    : ''

  return (
    <>
      <JsonLd
        data={pageGraph({
          path: ROUTES.home,
          title: copy.meta.homeTitle,
          description: copy.meta.homeDescription,
          faq: copy.faq.items,
        })}
      />

      {/* Hero — the room. LCP element, the only eager image on the page. */}
      <section className="relative overflow-clip">
        <div className="absolute inset-0">
          <PhotoPicture
            name="hero-interior"
            alt="The main room at Captain's Cabin: wood-paneled walls covered in customers' signatures, a ship's wheel above the bar, wooden stools and low amber lighting"
            sizes="100vw"
            priority
            className="arrive-slow size-full object-cover"
          />
          <div
            aria-hidden="true"
            className="from-ink via-ink/80 to-ink/40 absolute inset-0 bg-gradient-to-t"
          />
        </div>

        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <p className="font-display text-wall arrive mb-4 text-sm font-semibold tracking-[0.3em] uppercase">
              {copy.home.established}
            </p>
            <h1 className="font-display text-cream arrive arrive-delay-1 text-[length:var(--text-hero)] font-bold uppercase">
              {copy.home.title}
            </h1>
            <p className="text-wall-bright font-display arrive arrive-delay-2 mt-3 text-xl font-medium sm:text-2xl">
              {copy.home.tagline}
            </p>

            <div className="arrive arrive-delay-3 mt-6">
              <OpenStatus fallback={hoursFallback} />
            </div>

            <p className="text-cream/90 arrive arrive-delay-3 mt-6 max-w-[58ch]">
              {copy.home.intro}
            </p>

            <div className="arrive arrive-delay-3 mt-8 flex flex-wrap gap-3">
              <Action href={`tel:${site.telephone.e164}`}>{copy.common.callShort}</Action>
              <Action href={site.maps.directions} variant="secondary">
                {copy.common.directions}
              </Action>
              <Action href={ROUTES.menu} variant="secondary">
                {copy.common.viewMenu}
              </Action>
            </div>

            <p className="text-muted arrive arrive-delay-3 mt-6 text-sm">
              {copy.home.ratingLine(site.reviews.ratingValue, site.reviews.reviewCount)}
            </p>
          </div>
        </Container>
      </section>

      {/* 1 — What the room is actually like. */}
      <Section tone="panel">
        <Split
          media={
            <PhotoPicture
              name="room-yellow"
              alt="A corner of Captain's Cabin — yellow walls written over in pen, a ship's wheel, framed pictures and a worn leather bench"
              sizes="(min-width: 640px) 45vw, 100vw"
              className="drift lift h-72 w-full rounded-sm object-cover sm:h-80"
            />
          }
        >
          <div className="reveal">
            <Heading>{copy.home.roomHeading}</Heading>
            <Prose>
              <p className="text-cream/85 text-lg">{copy.home.roomBody}</p>
            </Prose>
          </div>
        </Split>
      </Section>

      {/* 2 — Who has been in it. */}
      <Section tone="wall">
        <div className="reveal">
          <Heading tone="bright">{copy.home.worldHeading}</Heading>
          <Prose>
            <p className="text-cream/90 text-lg">{copy.home.worldBody}</p>
            <p className="text-cream/75">{copy.home.worldSecond}</p>
          </Prose>
        </div>

        <div className={`${TWO_COL} mt-10`}>
          <PhotoPicture
            name="walls-flags"
            alt="Flags from many countries hanging above a shelf crowded with notes, business cards and mementoes left by visitors"
            sizes="(min-width: 640px) 45vw, 100vw"
            className="warm lift h-72 w-full rounded-sm object-cover"
          />
          <PhotoPicture
            name="walls-notes"
            alt="A wall of the bar covered end to end in handwritten names, dates and messages from decades of customers"
            sizes="(min-width: 640px) 45vw, 100vw"
            className="warm lift h-72 w-full rounded-sm object-cover"
          />
        </div>
      </Section>

      {/* 3 — What is in it. */}
      <Section>
        <div className="reveal">
          <Heading>{copy.home.featuresHeading}</Heading>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              feature: pool,
              photo: {
                name: 'pool',
                alt: 'The pool table at the back of Captain’s Cabin, lit from above in a dark room',
              },
            },
            {
              feature: darts,
              photo: {
                name: 'darts',
                alt: 'A heavily used dartboard mounted on a wooden wall covered in scrawled signatures',
              },
            },
            {
              feature: walls,
              photo: {
                name: 'graffiti-joker',
                alt: 'A grinning face drawn in pen on the bar’s yellow wall, surrounded by messages in English and Arabic',
              },
            },
          ].map(({ feature, photo }) => (
            <div key={feature.title} className="reveal">
              <PhotoPicture
                name={photo.name}
                alt={photo.alt}
                sizes="(min-width: 640px) 30vw, 100vw"
                className="lift mb-4 h-52 w-full rounded-sm object-cover"
              />
              <h3 className="font-display text-cream text-lg font-semibold uppercase">
                {feature.title}
              </h3>
              <p className="text-muted mt-1">{feature.body}</p>
            </div>
          ))}
        </div>

        <div className="border-line reveal mt-10 border-s-2 ps-4">
          <h3 className="font-display text-cream text-lg font-semibold uppercase">{flags.title}</h3>
          <p className="text-muted mt-1 max-w-[62ch]">{flags.body}</p>
        </div>
      </Section>

      {/* 4 — Outside. */}
      <Section tone="ruled">
        <Split
          flip
          media={
            <PhotoPicture
              name="outdoor"
              alt="The outdoor seating area at Captain's Cabin at night — tables and chairs under leafy trees strung with lights"
              sizes="(min-width: 640px) 45vw, 100vw"
              className="drift lift h-72 w-full rounded-sm object-cover sm:h-80"
            />
          }
        >
          <div className="reveal">
            <Heading>{outside.title}</Heading>
            <Prose>
              <p className="text-cream/85 text-lg">{outside.body}</p>
            </Prose>
          </div>
        </Split>
      </Section>

      {/* 5 — The music. */}
      <Section tone="wall">
        <div className="reveal">
          <Heading tone="bright">{copy.home.musicHeading}</Heading>
          <Prose>
            <p className="text-cream/90 text-lg">{copy.home.musicBody}</p>
          </Prose>
        </div>
      </Section>

      {/* 6 — The invitation. */}
      <section className="border-line/70 relative overflow-clip border-b">
        <div className="absolute inset-0">
          <PhotoPicture
            name="walls-notes"
            alt=""
            sizes="100vw"
            className="size-full object-cover opacity-20"
          />
          <div
            aria-hidden="true"
            className="from-ink via-ink/90 to-ink/70 absolute inset-0 bg-gradient-to-b"
          />
        </div>
        <Container className="relative py-20 sm:py-24">
          <div className="reveal max-w-2xl">
            <p className="font-display text-wall mb-2 text-xs font-semibold tracking-[0.28em] uppercase">
              {copy.home.inviteEyebrow}
            </p>
            <h2 className="font-display text-cream mb-5 text-[length:var(--text-section)] font-bold uppercase">
              {copy.home.inviteHeading}
            </h2>
            <p className="text-cream/85 max-w-[62ch] text-lg">{copy.home.inviteBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Action href={site.maps.directions}>{copy.home.inviteAction}</Action>
              <Action href={`tel:${site.telephone.e164}`} variant="secondary">
                {copy.common.callShort}
              </Action>
            </div>
          </div>
        </Container>
      </section>

      {/* 7 — What people actually search for, answered as answers. */}
      <Section>
        <div className="reveal">
          <Heading>{copy.faq.heading}</Heading>
        </div>
        <Faq />
      </Section>

      {/* 8 — Menu + story. */}
      <Section tone="ruled">
        <div className={TWO_COL}>
          <div className="reveal">
            <PhotoPicture
              name="almaza"
              alt="A cold bottle of Almaza, the Lebanese lager, standing on the bar"
              sizes="(min-width: 640px) 45vw, 100vw"
              className="lift mb-4 h-52 w-full rounded-sm object-cover"
            />
            <h2 className="font-display text-wall mb-2 text-2xl font-bold uppercase">
              {copy.home.menuTeaserHeading}
            </h2>
            <p className="text-muted">{copy.home.menuTeaserBody}</p>
            <p className="mt-3">
              <Link
                href={ROUTES.menu}
                className="tap-inline link-underline text-wall-bright"
              >
                {copy.common.viewMenu}
              </Link>
            </p>
          </div>

          <div className="reveal">
            <PhotoPicture
              name="back-bar"
              alt="The back bar at Captain's Cabin, shelves crowded with bottles and souvenirs under warm light"
              sizes="(min-width: 640px) 45vw, 100vw"
              className="lift mb-4 h-52 w-full rounded-sm object-cover"
            />
            <h2 className="font-display text-wall mb-2 text-2xl font-bold uppercase">
              {copy.home.storyTeaserHeading}
            </h2>
            <p className="text-muted">{copy.home.storyTeaserBody}</p>
            <p className="mt-3">
              <Link
                href={ROUTES.story}
                className="tap-inline link-underline text-wall-bright"
              >
                {copy.common.readStory}
              </Link>
            </p>
          </div>
        </div>
      </Section>

      {/* 9 — Practical. */}
      <Section tone="ruled">
        <div className={TWO_COL}>
          <div>
            <h2 className="font-display text-wall mb-4 text-2xl font-bold uppercase">
              {copy.common.hoursHeading}
            </h2>
            <HoursTable />
          </div>
          <div>
            <h2 className="font-display text-wall mb-4 text-2xl font-bold uppercase">
              {copy.home.findHeading}
            </h2>
            <p className="text-muted">{copy.home.findBody}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Action href={site.maps.directions} variant="secondary">
                {copy.common.directions}
              </Action>
              <Action href={ROUTES.findUs} variant="quiet">
                {copy.nav.findUs}
              </Action>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
