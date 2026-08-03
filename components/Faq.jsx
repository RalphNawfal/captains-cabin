import { copy } from '@/lib/copy'

/**
 * Native `<details>` accordions — no JavaScript, keyboard accessible for free,
 * and announced correctly by screen readers without a single ARIA attribute.
 *
 * Two things this deliberately does NOT do:
 *
 *  - It does not hide the answers from crawlers. `<details>` content stays in
 *    the DOM whether open or closed, which is what keeps the FAQPage schema
 *    valid — Google requires the answer text to be present on the page.
 *  - It does not use a JS accordion library. There is nothing here a library
 *    would add except weight.
 *
 * The first item is open by default so the pattern is obvious at a glance.
 */
export default function Faq() {
  return (
    <dl className="divide-line/60 max-w-[70ch] divide-y">
      {copy.faq.items.map((item, i) => (
        <div key={item.q} className="reveal">
          <details className="faq group" name="faq" open={i === 0}>
            <summary className="faq-summary">
              <dt className="font-display text-cream pe-6 text-lg font-semibold">{item.q}</dt>
              <span aria-hidden="true" className="faq-marker" />
            </summary>
            <dd className="text-muted pb-5 pe-6">{item.a}</dd>
          </details>
        </div>
      ))}
    </dl>
  )
}
