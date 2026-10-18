import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Attempt } from '../../../learn/progress'
import { formatClock } from '../../../learn/useTimer'
import { practiceSets } from './content'
import { HUB_PATH, accuracyOf, shortDate } from './library'
import { useElementWidth, useInView } from './hooks'

const HEIGHT = 230
const M = { top: 22, right: 54, bottom: 30, left: 42 }
const TICKS = [0, 0.25, 0.5, 0.75, 1]
const TARGET = 0.75 // ≈ 30/40, roughly Band 7 on the Academic test
const MAX_POINTS = 12

const titleOf = (id: string) => practiceSets.find((p) => p.id === id)?.title ?? id

/**
 * Accuracy per practice attempt, oldest → newest (one series, so no legend: the
 * heading names it). Crosshair + tooltip on hover, arrow keys on focus, and a
 * table view with every value.
 */
export function AccuracyChart({ attempts }: { attempts: Attempt[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const width = useElementWidth(wrapRef, 520)
  const inView = useInView(wrapRef)
  const [active, setActive] = useState<number | null>(null)
  const [table, setTable] = useState(false)
  const uid = useId()

  const data = attempts.slice(-MAX_POINTS)
  const n = data.length
  const plotW = Math.max(60, width - M.left - M.right)
  const plotH = HEIGHT - M.top - M.bottom
  const x = (i: number) => M.left + (n <= 1 ? plotW / 2 : (i * plotW) / (n - 1))
  const y = (v: number) => M.top + (1 - v) * plotH
  const values = data.map(accuracyOf)
  const points = values.map((v, i) => [x(i), y(v)] as const)
  const line = points.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ')
  const area = n > 1 ? `${line} L${points[n - 1][0].toFixed(1)},${y(0)} L${points[0][0].toFixed(1)},${y(0)} Z` : ''
  const bestIndex = values.length ? values.indexOf(Math.max(...values)) : -1
  const lastIndex = n - 1

  const onPointer = (e: PointerEvent<SVGSVGElement>) => {
    if (!n) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    let nearest = 0
    for (let i = 1; i < n; i++) if (Math.abs(x(i) - px) < Math.abs(x(nearest) - px)) nearest = i
    setActive(nearest)
  }

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!n) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const from = active ?? (e.key === 'ArrowRight' ? -1 : n)
      setActive(Math.max(0, Math.min(n - 1, from + (e.key === 'ArrowRight' ? 1 : -1))))
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      setActive(e.key === 'Home' ? 0 : n - 1)
    } else if (e.key === 'Escape') {
      setActive(null)
    }
  }

  const activeAttempt = active !== null ? data[active] : null
  const tipLeft = active !== null ? Math.min(Math.max(x(active), 90), width - 90) : 0
  const tipTop = active !== null ? y(values[active]) : 0
  const describe = (a: Attempt) =>
    `${Math.round(accuracyOf(a) * 100)}% — ${a.score} of ${a.total} on ${titleOf(a.practiceId)}, ${shortDate(a.at)}`

  return (
    <figure className="rd-chart">
      <div className="rd-chart__head">
        <figcaption className="rd-chart__title" id={`${uid}-title`}>
          Accuracy, attempt by attempt
        </figcaption>
        {n > 0 && (
          <button type="button" className="rd-chart__toggle" onClick={() => setTable((t) => !t)} aria-pressed={table}>
            {table ? 'Show chart' : 'Show as table'}
          </button>
        )}
      </div>

      {table && n > 0 && (
        <div className="rd-chart__tablewrap">
          <table className="rd-chart__table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Test</th>
                <th scope="col">Score</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((a, i) => (
                <tr key={a.at}>
                  <td>{attempts.length - n + i + 1}</td>
                  <td>{shortDate(a.at)}</td>
                  <td>{titleOf(a.practiceId)}</td>
                  <td>
                    {a.score}/{a.total}
                  </td>
                  <td>{Math.round(accuracyOf(a) * 100)}%</td>
                  <td>{formatClock(a.durationSec)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div ref={wrapRef} hidden={table && n > 0} className={`rd-chart__plot ${inView ? 'is-in' : ''} ${n === 0 ? 'is-empty' : ''}`}>
          <svg
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            className="rd-chart__svg"
            role={n ? 'group' : 'img'}
            tabIndex={n ? 0 : undefined}
            aria-labelledby={`${uid}-title`}
            aria-describedby={`${uid}-desc`}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
          >
            {TICKS.map((t) => (
              <g key={t}>
                <line className="rd-chart__grid" x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} />
                <text className="rd-chart__tick" x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end">
                  {Math.round(t * 100)}%
                </text>
              </g>
            ))}
            <line className="rd-chart__target" x1={M.left} x2={M.left + plotW} y1={y(TARGET)} y2={y(TARGET)} />
            <text className="rd-chart__target-label" x={M.left + plotW + 6} y={y(TARGET)} dy="0.32em">
              Band 7
            </text>

            {n === 0 && (
              <path
                className="rd-chart__ghost"
                d={`M${M.left + 6},${y(0.38)} C${M.left + plotW * 0.3},${y(0.42)} ${M.left + plotW * 0.45},${y(0.62)} ${M.left + plotW * 0.7},${y(0.66)} S${M.left + plotW - 6},${y(0.8)} ${M.left + plotW - 6},${y(0.82)}`}
              />
            )}

            {n > 1 && <path className="rd-chart__area" d={area} />}
            {n > 1 && <path className="rd-chart__line" d={line} pathLength={1} />}

            {active !== null && (
              <line className="rd-chart__crosshair" x1={x(active)} x2={x(active)} y1={M.top} y2={M.top + plotH} />
            )}

            {points.map(([px, py], i) => (
              <circle
                key={data[i].at}
                className={`rd-chart__dot ${i === active ? 'is-active' : ''}`}
                cx={px}
                cy={py}
                r={i === active ? 6 : 4.5}
                style={{ animationDelay: `${300 + (i / Math.max(1, n - 1)) * 900}ms` }}
              />
            ))}

            {n > 0 && (
              <text className="rd-chart__label rd-chart__label--end" x={points[lastIndex][0] + 10} y={points[lastIndex][1]} dy="0.32em">
                {Math.round(values[lastIndex] * 100)}%
              </text>
            )}
            {n > 2 && bestIndex !== lastIndex && (
              <text className="rd-chart__label" x={points[bestIndex][0]} y={points[bestIndex][1] - 12} textAnchor="middle">
                best {Math.round(values[bestIndex] * 100)}%
              </text>
            )}

            {data.map((a, i) =>
              n <= 8 || i % 2 === lastIndex % 2 ? (
                <text key={a.at} className="rd-chart__xtick" x={x(i)} y={HEIGHT - 8} textAnchor="middle">
                  #{attempts.length - n + i + 1}
                </text>
              ) : null,
            )}
          </svg>

          {activeAttempt && active !== null && (
            <div className="rd-chart__tip" style={{ left: tipLeft, top: tipTop }} aria-hidden="true">
              <strong>{Math.round(values[active] * 100)}%</strong>
              <span>
                {activeAttempt.score}/{activeAttempt.total} · {titleOf(activeAttempt.practiceId)}
              </span>
              <span>
                {shortDate(activeAttempt.at)} · {formatClock(activeAttempt.durationSec)}
              </span>
            </div>
          )}

          {n === 0 && (
            <div className="rd-chart__empty">
              <p>Your first test will draw the first point on this page.</p>
              <Link to={`${HUB_PATH}/practice/${practiceSets[0]?.id}`} className="rd-btn rd-btn--ink rd-btn--small">
                Borrow {practiceSets[0]?.title} →
              </Link>
            </div>
          )}

          <p id={`${uid}-desc`} className="visually-hidden">
            {n
              ? `Line chart of your last ${n} attempts. Latest ${Math.round(values[lastIndex] * 100)}%, best ${Math.round(
                  values[bestIndex] * 100,
                )}%. Use the left and right arrow keys to read each attempt, or switch to the table view.`
              : 'No attempts yet.'}
          </p>
          <p className="visually-hidden" aria-live="polite">
            {activeAttempt ? describe(activeAttempt) : ''}
          </p>
      </div>
    </figure>
  )
}
