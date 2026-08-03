import { groupedHours, formatTime } from '@/lib/hours'
import { site } from '@/lib/site'
import { copy } from '@/lib/copy'

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dayRange(days) {
  if (days.length === 7) return copy.common.everyDay
  if (days.length === 1) return DAY_SHORT[days[0]]
  return `${DAY_SHORT[days[0]]} – ${DAY_SHORT[days[days.length - 1]]}`
}

export default function HoursTable() {
  const groups = groupedHours()

  return (
    <div>
      <dl className="space-y-1">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-wrap items-baseline justify-between gap-x-6">
            <dt className="text-muted">{dayRange(group.days)}</dt>
            <dd className="tabular-nums">
              {group.slot
                ? `${formatTime(group.slot.opens)} – ${formatTime(group.slot.closes)}`
                : copy.common.closedLabel}
            </dd>
          </div>
        ))}
      </dl>

      {/* The hours are confirmed, but they're also a floor rather than a rule —
          Andre extends the night when it's going. Say so instead of being
          pedantically wrong at 3:30am. */}
      {site.hours.extendsAtWill ? (
        <p className="text-muted mt-4 text-sm">{copy.common.hoursMayExtend}</p>
      ) : null}
    </div>
  )
}
