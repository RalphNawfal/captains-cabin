import Action from '@/components/Action'
import HoursTable from '@/components/HoursTable'
import JsonLd from '@/components/JsonLd'
import Map from '@/components/Map'
import { PhotoPicture } from '@/components/Photo'
import { copy } from '@/lib/copy'
import { site } from '@/lib/site'
import { pageGraph } from '@/lib/schema'
import { ROUTES } from '@/lib/metadata'

export default function FindUsPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: ROUTES.findUs,
          title: copy.findUs.metaTitle,
          description: copy.meta.findUsDescription,
          trail: [
            { name: copy.nav.home, path: ROUTES.home },
            { name: copy.findUs.title, path: ROUTES.findUs },
          ],
        })}
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <h1 className="font-display text-cream text-[length:var(--text-section)] font-bold uppercase">
          {copy.findUs.title}
        </h1>
        <p className="text-muted mt-3 max-w-prose">{copy.findUs.intro}</p>

        {/* The one exterior kept anywhere on the site: on this page, being able
            to recognise the frontage is the whole job. */}
        <PhotoPicture
          name="facade-day"
          alt="The street frontage and wooden door of Captain's Cabin in Hamra"
          sizes="(min-width: 768px) 768px, 100vw"
          className="lift mt-8 h-64 w-full max-w-3xl rounded-sm object-cover"
        />

        <section className="reveal mt-12 max-w-3xl">
          <h2 className="font-display text-wall mb-3 text-sm font-bold tracking-[0.28em] uppercase">
            {copy.findUs.mapHeading}
          </h2>
          <Map />
        </section>

        <section className="mt-10">
          <h2 className="font-display text-wall mb-3 text-sm font-bold tracking-widest uppercase">
            {copy.findUs.addressHeading}
          </h2>
          <address className="space-y-1 text-lg not-italic">
            {site.address.street ? <p>{site.address.street}</p> : null}
            <p>{site.address.neighbourhood}</p>
            <p>{`${site.address.city}, ${site.address.countryName}`}</p>
          </address>

          {/* Honest placeholder rather than picking one of two conflicting
              street names off third-party listings. */}
          {!site.address.street ? (
            <p className="border-wall/40 bg-wood/50 text-muted mt-4 border-s-2 px-4 py-3 text-sm">
              {copy.findUs.addressPendingNote}
            </p>
          ) : null}

          <div className="mt-6">
            <h3 className="text-muted text-sm font-semibold">{copy.findUs.plusCodeLabel}</h3>
            <p className="font-display text-wall-bright text-xl tracking-wider">
              {site.address.plusCode} {site.address.city}
            </p>
            <p className="text-muted mt-1 text-sm">{copy.findUs.plusCodeHelp}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Action href={site.maps.directions}>{copy.common.directions}</Action>
            <Action href={`tel:${site.telephone.e164}`} variant="secondary">
              {site.telephone.display}
            </Action>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-wall mb-3 text-sm font-bold tracking-widest uppercase">
            {copy.findUs.gettingHereHeading}
          </h2>
          <ul className="text-cream/85 list-disc space-y-2 ps-5">
            {copy.findUs.gettingHere.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="border-line mt-12 border-t pt-8">
          <h2 className="font-display text-wall mb-4 text-sm font-bold tracking-widest uppercase">
            {copy.common.hoursHeading}
          </h2>
          <HoursTable />
        </section>
      </div>
    </>
  )
}
