import Action from '@/components/Action'
import MenuList from '@/components/MenuList'
import JsonLd from '@/components/JsonLd'
import { PhotoPicture } from '@/components/Photo'
import { copy } from '@/lib/copy'
import { site } from '@/lib/site'
import { pageGraph } from '@/lib/schema'
import { ROUTES } from '@/lib/metadata'

export default function MenuPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: ROUTES.menu,
          title: copy.menu.metaTitle,
          description: copy.meta.menuDescription,
          withMenu: true,
          trail: [
            { name: copy.nav.home, path: ROUTES.home },
            { name: copy.menu.title, path: ROUTES.menu },
          ],
        })}
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <h1 className="font-display text-cream text-[length:var(--text-section)] font-bold uppercase">
          {copy.menu.title}
        </h1>
        <p className="text-muted mt-3 max-w-prose">{copy.menu.intro}</p>

        <PhotoPicture
          name="almaza"
          alt="A cold bottle of Almaza on the bar"
          sizes="(min-width: 768px) 768px, 100vw"
          className="mt-8 h-56 w-full rounded-sm object-cover"
        />

        <div className="mt-10">
          <MenuList />
        </div>

        <div className="border-line mt-12 border-t pt-8">
          <h2 className="font-display text-wall mb-3 text-2xl font-bold uppercase">
            {copy.common.comeIn}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Action href={`tel:${site.telephone.e164}`}>{copy.common.call}</Action>
            <Action href={site.maps.directions} variant="secondary">
              {copy.common.directions}
            </Action>
            <Action href={ROUTES.findUs} variant="quiet">
              {copy.nav.findUs}
            </Action>
          </div>
        </div>
      </div>
    </>
  )
}
