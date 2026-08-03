import { site } from './site.js'

const DAY_KEYS = [0, 1, 2, 3, 4, 5, 6]

/** schema.org day names, indexed to match JS getDay(). */
export const SCHEMA_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/**
 * Read wall-clock time in the bar's own timezone, wherever the visitor is.
 * Someone checking from Dubai or Paris should see Beirut's answer, not theirs.
 */
export function beirutNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type) => parts.find((p) => p.type === type)?.value
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

  return {
    day: weekdayMap[get('weekday')],
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

/**
 * Is the bar open right now?
 *
 * Handles sessions that cross midnight: at 01:30 on a Tuesday the bar is open
 * because of *Monday's* 18:00–03:00 session, not Tuesday's.
 */
export function isOpenAt({ day, minutes }) {
  const today = site.hours.weekly[day]
  if (today) {
    const opens = toMinutes(today.opens)
    const closes = toMinutes(today.closes)
    const crossesMidnight = closes <= opens
    if (crossesMidnight ? minutes >= opens : minutes >= opens && minutes < closes) {
      return true
    }
  }

  // Still inside yesterday's after-midnight tail?
  const yesterday = site.hours.weekly[(day + 6) % 7]
  if (yesterday) {
    const opens = toMinutes(yesterday.opens)
    const closes = toMinutes(yesterday.closes)
    if (closes <= opens && minutes < closes) return true
  }

  return false
}

/** The next opening time, as `{ day, opens }`, for "opens at …" copy. */
export function nextOpening({ day, minutes }) {
  for (let offset = 0; offset < 8; offset += 1) {
    const d = (day + offset) % 7
    const slot = site.hours.weekly[d]
    if (!slot) continue
    if (offset === 0 && minutes >= toMinutes(slot.opens)) continue
    return { day: d, opens: slot.opens, isToday: offset === 0 }
  }
  return null
}

/** Format "18:00" as "6 PM" / "6:30 PM". */
export function formatTime(hhmm, locale = 'en') {
  const [h, m] = hhmm.split(':').map(Number)
  const date = new Date(Date.UTC(2000, 0, 1, h, m))
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-LB' : 'en-GB', {
    hour: 'numeric',
    minute: m === 0 ? undefined : '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date)
}

/**
 * Collapse the weekly table into runs of identical hours, so seven identical
 * rows render as one "Every day" line instead of a wall of repetition.
 */
export function groupedHours() {
  const groups = []
  for (const day of DAY_KEYS) {
    const slot = site.hours.weekly[day]
    const key = slot ? `${slot.opens}-${slot.closes}` : 'closed'
    const last = groups[groups.length - 1]
    if (last && last.key === key) {
      last.days.push(day)
    } else {
      groups.push({ key, slot, days: [day] })
    }
  }
  return groups
}

/** schema.org openingHoursSpecification, collapsed the same way. */
export function openingHoursSpecification() {
  return groupedHours()
    .filter((g) => g.slot)
    .map((g) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: g.days.map((d) => SCHEMA_DAYS[d]),
      opens: g.slot.opens,
      closes: g.slot.closes,
    }))
}
