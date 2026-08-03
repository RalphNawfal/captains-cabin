'use client'

import { useEffect, useState } from 'react'
import { beirutNow, isOpenAt, nextOpening, formatTime } from '@/lib/hours'
import { site } from '@/lib/site'
import { copy } from '@/lib/copy'

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * The one piece of client JS on the site.
 *
 * The HTML is baked at build time, so "open now" cannot be prerendered — it would
 * be frozen at whatever the build clock said. Instead the server renders the
 * static hours line, and this swaps in the live status after mount. Space is
 * reserved either way, so there is no layout shift.
 */
export default function OpenStatus({ fallback }) {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    function compute() {
      const now = beirutNow()
      if (isOpenAt(now)) {
        const today = site.hours.weekly[now.day]
        setStatus({
          open: true,
          label: copy.common.openNow,
          detail: today ? copy.common.untilClose(formatTime(today.closes)) : null,
        })
        return
      }
      const next = nextOpening(now)
      setStatus({
        open: false,
        label: copy.common.closedNow,
        detail: next
          ? next.isToday
            ? copy.common.opensAt(formatTime(next.opens))
            : copy.common.opensDayAt(WEEKDAY[next.day], formatTime(next.opens))
          : null,
      })
    }

    compute()
    // Re-check on the minute so a page left open doesn't go stale.
    const id = setInterval(compute, 60_000)
    return () => clearInterval(id)
  }, [])

  if (!status) {
    return (
      <p className="text-muted min-h-6 text-sm" suppressHydrationWarning>
        {fallback}
      </p>
    )
  }

  return (
    <p className="flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <span
        aria-hidden="true"
        className={`inline-block size-2 rounded-full ${status.open ? 'bg-wall-bright' : 'bg-muted/60'}`}
      />
      <strong className={status.open ? 'text-wall-bright font-semibold' : 'text-muted font-semibold'}>
        {status.label}
      </strong>
      {status.detail ? <span className="text-muted">{status.detail}</span> : null}
    </p>
  )
}
