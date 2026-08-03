import menu from '@/content/menu.json'
import { copy } from '@/lib/copy'

function formatPrice(price, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price)
}

/**
 * Renders whatever is in content/menu.json, and degrades rather than lies.
 *
 * A bar menu that nobody updates is the normal end state, so: missing prices
 * render as "ask at the bar" instead of a blank or a zero, empty sections are
 * dropped, and a stale file still leaves a usable page.
 */
export default function MenuList() {
  const sections = (menu.sections ?? []).filter((s) => s.items?.length > 0)

  if (sections.length === 0) return <p className="text-muted">{copy.menu.pricesPending}</p>

  const showPrices = menu.pricesConfirmed

  // Capped so a name and its price never end up at opposite ends of a 1150px
  // row on a wide screen.
  return (
    <div className="max-w-2xl space-y-12">
      {!showPrices ? (
        <p className="border-wall/40 bg-wood/50 text-muted border-s-2 px-4 py-3 text-sm">
          {copy.menu.pricesPending}
        </p>
      ) : null}

      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`section-${section.id}`}>
          <h2
            id={`section-${section.id}`}
            className="font-display text-wall border-line mb-4 border-b pb-2 text-2xl font-bold tracking-wide uppercase"
          >
            {section.name}
          </h2>

          {section.note ? <p className="text-muted mb-4 text-sm">{section.note}</p> : null}

          <ul className="divide-line/60 divide-y">
            {section.items.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-4 py-3">
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.description ? (
                    <span className="text-muted block text-sm">{item.description}</span>
                  ) : null}
                </div>
                <span className="text-muted shrink-0 tabular-nums">
                  {showPrices && item.price != null
                    ? formatPrice(item.price, menu.currency)
                    : copy.menu.askAtBar}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-muted text-sm">
        {showPrices ? `${menu.currencyNote}. ` : ''}
        {copy.menu.priceNote}
      </p>
    </div>
  )
}
