import Action from '@/components/Action'
import JsonLd from '@/components/JsonLd'
import Faq from '@/components/Faq'
import { PhotoPicture } from '@/components/Photo'
import { Container, Section, Heading, Prose, Split, TWO_COL } from '@/components/Layout'
import { copy } from '@/lib/copy'
import { site } from '@/lib/site'
import { pageGraph } from '@/lib/schema'
import { ROUTES } from '@/lib/metadata'

/**
 * Birthdays, private events, barbecues and catering.
 *
 * Every route to a booking ends at the phone: capacity, minimum spend and food
 * prices are unconfirmed, so the page states what the bar does and nothing
 * about terms. No party photographs — those mean identifiable faces.
 */
export default function EventsPage() {
  const call = `tel:${site.telephone.e164}`

  return (
    <>
      <JsonLd
        data={pageGraph({
          path: ROUTES.events,
          title: copy.events.metaTitle,
          description: copy.meta.eventsDescription,
          trail: [
            { name: copy.nav.home, path: ROUTES.home },
            { name: copy.nav.events, path: ROUTES.events },
          ],
          faq: copy.events.faq,
        })}
      />

      <Container className="py-14 sm:py-20">
        <h1 className="font-display text-cream text-[length:var(--text-section)] font-bold uppercase">
          {copy.events.title}
        </h1>
        <p className="text-wall-bright mt-4 max-w-prose text-lg">{copy.events.lede}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Action href={call}>{copy.events.bookCall}</Action>
          <Action href={site.maps.directions} variant="secondary">
            {copy.common.directions}
          </Action>
        </div>
      </Container>

      {copy.events.sections.map((section, i) => (
        <Section key={section.heading} tone={i % 2 === 0 ? 'panel' : 'ruled'}>
          <Split
            flip={i % 2 === 1}
            media={
              <PhotoPicture
                name={section.photo.name}
                alt={section.photo.alt}
                sizes="(min-width: 640px) 45vw, 100vw"
                className="drift lift h-72 w-full rounded-sm object-cover sm:h-80"
              />
            }
          >
            <div className="reveal">
              <Heading>{section.heading}</Heading>
              <Prose>
                <p className="text-cream/85 text-lg">{section.body}</p>
              </Prose>
            </div>
          </Split>
        </Section>
      ))}

      <Section tone="wall">
        <div className={TWO_COL}>
          <div className="reveal">
            <Heading tone="bright">{copy.events.gamesHeading}</Heading>
            <Prose>
              <p className="text-cream/85 text-lg">{copy.events.gamesBody}</p>
            </Prose>
          </div>
          <ul className="divide-line/60 border-line/60 reveal divide-y border-y sm:self-end">
            {copy.events.games.map((game) => (
              <li key={game} className="font-display text-cream py-3 text-lg font-semibold uppercase">
                {game}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="reveal">
          <Heading>{copy.events.bookHeading}</Heading>
          <Prose>
            <p className="text-cream/85 text-lg">{copy.events.bookBody}</p>
          </Prose>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Action href={call}>{copy.events.bookCall}</Action>
            <a href={call} className="tap-inline text-wall-bright font-semibold">
              {site.telephone.display}
            </a>
          </div>
        </div>
      </Section>

      <Section tone="ruled">
        <div className="reveal">
          <Heading>{copy.events.faqHeading}</Heading>
        </div>
        <Faq items={copy.events.faq} />
      </Section>
    </>
  )
}
