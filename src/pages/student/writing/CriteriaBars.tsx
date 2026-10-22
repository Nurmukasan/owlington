import { useState, type CSSProperties } from 'react'
import type { Criterion } from './analysis'
import { CRITERIA } from './stats'

interface CriteriaBarsProps {
  latest?: Partial<Record<Criterion, number>>
  first?: Partial<Record<Criterion, number>>
}

const MAX = 9

/**
 * The four criteria from the latest self-assessment as thin horizontal bars
 * (one ink hue, value at the tip), with the change since the first assessment.
 */
export function CriteriaBars({ latest, first }: CriteriaBarsProps) {
  const [hover, setHover] = useState<Criterion | null>(null)

  return (
    <figure className="wr-crit">
      <figcaption className="wr-chart__head">
        <span className="wr-chart__title">The four criteria · latest self-assessment</span>
      </figcaption>
      <ul className="wr-crit__list">
        {CRITERIA.map((c, i) => {
          const v = latest?.[c.id]
          const f = first?.[c.id]
          const delta = v !== undefined && f !== undefined ? v - f : null
          return (
            <li
              key={c.id}
              className={`wr-crit__row ${hover === c.id ? 'is-hover' : ''} ${v === undefined ? 'is-empty' : ''}`}
              style={{ '--wr-v': v === undefined ? 0 : v / MAX, '--wr-i': i } as CSSProperties}
              onPointerEnter={() => setHover(c.id)}
              onPointerLeave={() => setHover(null)}
            >
              <span className="wr-crit__name" title={f !== undefined && v !== undefined ? `${c.name}: ${v} (first assessment: ${f})` : c.name}>
                <abbr title={c.name}>{c.id}</abbr> <span>{c.short}</span>
              </span>
              <span className="wr-crit__track" aria-hidden="true">
                <span className="wr-crit__fill" />
                {[5, 6, 7, 8].map((t) => (
                  <span key={t} className="wr-crit__tick" style={{ left: `${(t / MAX) * 100}%` }} />
                ))}
              </span>
              <span className="wr-crit__value">
                {v === undefined ? '—' : v}
                {delta !== null && delta !== 0 && (
                  <span className={`wr-crit__delta ${delta > 0 ? 'is-up' : 'is-down'}`}>
                    {delta > 0 ? '▲' : '▼'} {Math.abs(delta)}
                    <span className="visually-hidden"> since your first assessment</span>
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="wr-crit__scale" aria-hidden="true">
        <span>0</span>
        <span>band 9</span>
      </p>
    </figure>
  )
}
