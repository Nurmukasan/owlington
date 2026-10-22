import { useState, type CSSProperties } from 'react'
import { dayKey } from '../../../learn/progress'

const WEEKS = 12
const DAY_NAMES = ['Mon', '', 'Wed', '', 'Fri', '', '']

/** 0 = no activity … 4 = a big night. */
const levelFor = (xp: number | undefined) => (xp === undefined ? 0 : xp < 20 ? 1 : xp < 50 ? 2 : xp < 100 ? 3 : 4)

/** The last twelve weeks of study, one square per day, brighter for more XP. */
export function ActivityHeatmap({ dailyXp }: { dailyXp: Record<string, number> }) {
  // Read once per visit; the grid doesn't need to roll over at midnight.
  const [today] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const monday = (today.getDay() + 6) % 7
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - monday - (WEEKS - 1) * 7)
  const todayKey = dayKey(today)

  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const key = dayKey(date)
    const future = date > today
    const xp = dailyXp[key]
    return { key, date, future, xp, level: levelFor(xp) }
  })
  const past = cells.filter((c) => !c.future)
  const activeDays = past.filter((c) => c.xp !== undefined).length
  const total = past.reduce((s, c) => s + (c.xp ?? 0), 0)

  return (
    <figure className="pf-heat">
      <div className="pf-heat__grid-wrap">
        <ol className="pf-heat__days" aria-hidden="true">
          {DAY_NAMES.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ol>
        <ol
          className="pf-heat__grid"
          role="img"
          aria-label={`Active on ${activeDays} of the last ${past.length} days, ${total} XP in total.`}
          style={{ '--weeks': WEEKS } as CSSProperties}
        >
          {cells.map((c) => (
            <li
              key={c.key}
              className={`pf-heat__cell is-l${c.level} ${c.future ? 'is-future' : ''} ${c.key === todayKey ? 'is-today' : ''}`}
              title={
                c.future
                  ? undefined
                  : `${c.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${c.xp === undefined ? 'no study' : `${c.xp} XP`}`
              }
            />
          ))}
        </ol>
      </div>
      <figcaption className="pf-heat__foot">
        <span>
          <strong>{activeDays}</strong> active {activeDays === 1 ? 'night' : 'nights'} in {WEEKS} weeks · <strong>{total}</strong> XP
        </span>
        <span className="pf-heat__legend" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <i key={l} className={`pf-heat__cell is-l${l}`} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  )
}
