import Action from '@/components/Action'
import { copy } from '@/lib/copy'
import { site } from '@/lib/site'

/**
 * Persistent call/directions bar, phones only.
 *
 * The premise of the whole site is someone standing outside on Hamra Street
 * deciding whether to walk in. They should never have to scroll — or even think —
 * to find the phone number or the map. This guarantees it at every scroll
 * position and every viewport height, which a hero-only CTA cannot.
 *
 * `position: fixed` with `env(safe-area-inset-bottom)` so it clears the home
 * indicator on notched iPhones. Hidden from `sm` up, where the header CTAs are
 * always in view anyway.
 */
export default function StickyActions() {
  return (
    <div className="sticky-actions sm:hidden" role="group" aria-label={copy.common.quickActions}>
      <Action href={`tel:${site.telephone.e164}`} className="flex-1">
        {copy.common.callShort}
      </Action>
      <Action href={site.maps.directions} variant="secondary" className="flex-1">
        {copy.common.directionsShort}
      </Action>
    </div>
  )
}
