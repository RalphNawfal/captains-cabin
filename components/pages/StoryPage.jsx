import Action from '@/components/Action'
import JsonLd from '@/components/JsonLd'
import { PhotoPicture } from '@/components/Photo'
import { copy } from '@/lib/copy'
import { site } from '@/lib/site'
import { pageGraph } from '@/lib/schema'
import { ROUTES } from '@/lib/metadata'

/**
 * One photograph per story section, in order. The third slot lines up with the
 * "Andre" section — the portrait is the whole reason that section works.
 */
const SECTION_PHOTOS = [
  {
    name: 'room-yellow',
    alt: 'The room at Captain’s Cabin — yellow walls written over in pen, a ship’s wheel and framed pictures',
  },
  {
    name: 'back-bar',
    alt: 'Bottles crowding the shelves behind the bar under warm light',
  },
  {
    name: 'andre',
    alt: 'Andre, the longtime owner of Captain’s Cabin, standing behind the bar in front of the bottle shelves',
  },
  {
    name: 'walls-flags',
    alt: 'Flags left by visitors hanging above a wall of handwritten names and notes',
  },
  { name: 'pool', alt: 'The pool table at the back of the room' },
]

export default function StoryPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: ROUTES.story,
          title: copy.story.metaTitle,
          description: copy.meta.storyDescription,
          trail: [
            { name: copy.nav.home, path: ROUTES.home },
            { name: copy.story.title, path: ROUTES.story },
          ],
        })}
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <h1 className="font-display text-cream text-[length:var(--text-section)] font-bold uppercase">
          {copy.story.title}
        </h1>
        <p className="text-wall-bright mt-4 max-w-prose text-lg">{copy.story.lede}</p>

        <div className="mt-12 space-y-14">
          {copy.story.sections.map((section, i) => {
            const photo = SECTION_PHOTOS[i]
            return (
              <section key={section.heading} className="reveal">
                <h2 className="font-display text-wall text-2xl font-bold uppercase">
                  {section.heading}
                </h2>
                <p className="text-cream/85 mt-3 max-w-prose">{section.body}</p>
                {photo ? (
                  <div className="mt-6 max-w-3xl overflow-hidden rounded-sm">
                    <PhotoPicture
                      name={photo.name}
                      alt={photo.alt}
                      sizes="(min-width: 768px) 720px, 100vw"
                      className="drift h-72 w-full object-cover"
                    />
                  </div>
                ) : null}
              </section>
            )
          })}
        </div>

        {/* The story ends on an invitation, not a full stop. */}
        <section className="border-line mt-14 border-t pt-10">
          <h2 className="font-display text-wall mb-3 text-2xl font-bold uppercase">
            {copy.common.comeIn}
          </h2>
          <p className="text-muted mb-6 max-w-[58ch]">{copy.home.inviteBody}</p>
          <div className="flex flex-wrap gap-3">
            <Action href={site.maps.directions}>{copy.common.directions}</Action>
            <Action href={`tel:${site.telephone.e164}`} variant="secondary">
              {copy.common.call}
            </Action>
            <Action href={ROUTES.menu} variant="secondary">
              {copy.common.viewMenu}
            </Action>
          </div>
        </section>

        <section className="border-line mt-14 border-t pt-8">
          <h2 className="font-display text-wall mb-4 text-sm font-bold tracking-widest uppercase">
            {copy.story.factsHeading}
          </h2>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {copy.story.facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">{fact.label}</dt>
                <dd className="tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  )
}
