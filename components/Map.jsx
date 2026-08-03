import { site } from '@/lib/site'
import { copy } from '@/lib/copy'

/**
 * Live Google map.
 *
 * This is the one third-party embed on the site, and it is a considered
 * exception rather than a slip: on the Find us page an interactive, pannable map
 * is the actual product, and a static image cannot do the job.
 *
 * Cost control:
 *  - `loading="lazy"` so the iframe is not fetched until it is near the
 *    viewport. Nothing on first paint pays for it.
 *  - It lives only on /find-us/, never on the home page.
 *  - The keyless `output=embed` form is used, so there is no API key to leak,
 *    no key to expire after handover, and no billing account to hand over.
 *
 * Privacy: Google sets cookies inside this iframe once it loads. That is why it
 * is lazy and why it is on one page only. If the client ever wants a cookie
 * banner avoided entirely, replace this with a static map image linking out.
 */
export default function Map() {
  const { latitude, longitude } = site.geo
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&hl=en&output=embed`

  return (
    <figure className="border-line overflow-hidden rounded-sm border">
      <iframe
        src={src}
        title={copy.findUs.mapTitle}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block h-[320px] w-full border-0 sm:h-[420px]"
      />
      <figcaption className="border-line text-muted border-t px-4 py-3 text-sm">
        {copy.findUs.mapCaption}{' '}
        <a
          href={site.maps.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="text-wall-bright link-underline"
        >
          {copy.common.directions}
        </a>
      </figcaption>
    </figure>
  )
}
