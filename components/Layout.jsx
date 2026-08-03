/**
 * One alignment grid for the whole site.
 *
 * Every section — hero included — uses `Container`, so text, headings and
 * photographs all share the same left edge at every breakpoint. Gutters scale
 * with the viewport rather than jumping at breakpoints, which is what keeps it
 * feeling lined up rather than merely responsive.
 *
 * Prose is separately constrained by `Prose` to a comfortable measure, so a wide
 * container never produces 140-character lines.
 */

export function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>
  )
}

/** A standard vertical rhythm block. `tone` picks the background treatment. */
export function Section({ children, tone = 'plain', className = '', ...rest }) {
  const tones = {
    plain: '',
    wall: 'wall-texture border-line/70 border-y',
    panel: 'wood-panel border-line/70 border-y',
    ruled: 'border-line/70 border-t',
  }

  return (
    <section className={`${tones[tone]} ${className}`} {...rest}>
      <Container className="py-14 sm:py-20">{children}</Container>
    </section>
  )
}

/** Section heading with its optional eyebrow, always on the same left edge. */
export function Heading({ eyebrow, children, id, tone = 'wall', as: Tag = 'h2' }) {
  const colour = tone === 'bright' ? 'text-wall-bright' : 'text-wall'

  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="font-display text-muted mb-2 text-xs font-semibold tracking-[0.28em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Tag
        id={id}
        className={`font-display ${colour} text-[length:var(--text-section)] font-bold uppercase`}
      >
        {children}
      </Tag>
    </div>
  )
}

/** Constrains running text to a readable measure. */
export function Prose({ children, className = '' }) {
  return <div className={`max-w-[62ch] space-y-4 ${className}`}>{children}</div>
}

/**
 * The single two-column gap used everywhere on the site.
 *
 * This exists so every two-column grid puts its right-hand column at exactly the
 * same x. With three different gaps in play the right columns landed at 732,
 * 736 and 740px on a 1440 viewport — individually invisible, collectively the
 * reason a page reads as "not quite lined up".
 */
export const TWO_COL = 'grid gap-8 sm:grid-cols-2 sm:gap-10 lg:gap-14'

/**
 * Text and photograph side by side, sharing the container's left edge.
 * `flip` puts the photograph first on desktop while keeping source order — and
 * therefore reading order and focus order — text-first.
 */
export function Split({ children, media, flip = false, className = '' }) {
  return (
    <div className={`${TWO_COL} items-center ${className}`}>
      <div className={flip ? 'sm:order-2' : ''}>{children}</div>
      <div className={flip ? 'sm:order-1' : ''}>{media}</div>
    </div>
  )
}
