import Link from 'next/link'

const STYLES = {
  primary:
    'tap rounded-sm bg-wall px-5 py-3 font-display text-base font-semibold tracking-wide text-ink uppercase transition-colors hover:bg-wall-bright',
  secondary:
    'tap rounded-sm border border-line px-5 py-3 font-display text-base font-semibold tracking-wide text-cream uppercase transition-colors hover:border-wall hover:text-wall-bright',
  quiet: 'tap text-wall-bright underline underline-offset-4 hover:text-wall',
}

/**
 * One control for both internal links and external/tel: links, so tap-target
 * sizing and focus styles can never drift apart between the two.
 */
export default function Action({ href, variant = 'primary', children, ...rest }) {
  const className = STYLES[variant]
  const isInternal = href.startsWith('/') && !href.startsWith('//')

  if (isInternal) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    )
  }

  const isExternalHttp = href.startsWith('http')

  return (
    <a
      href={href}
      className={className}
      {...(isExternalHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
