import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

export interface ChartPoint {
  /** 0..1 */
  accuracy: number
  score: string
  title: string
  date: string
}

interface AccuracyChartProps {
  points: ChartPoint[]
  goal?: number
  seen?: boolean
}

const H = 196
const PAD = { top: 16, right: 52, bottom: 30, left: 44 }

/**
 * Accuracy per broadcast as a single-series line (oscilloscope styled, but
 * built to the data-viz rules: 2px line, ≥8px ringed markers, hairline
 * grid, crosshair + tooltip on hover and keyboard, and a table view).
 */
export function AccuracyChart({ points, goal = 0.7, seen = true }: AccuracyChartProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(560)
  const [active, setActive] = useState<number | null>(null)
  const titleId = useId()

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const plotW = width - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const n = points.length
  const x = (i: number) => (n <= 1 ? PAD.left + plotW / 2 : PAD.left + (i / (n - 1)) * plotW)
  const y = (v: number) => PAD.top + (1 - v) * plotH

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.accuracy).toFixed(1)}`).join(' ')
  const area = n > 1 ? `${line} L${x(n - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z` : ''
  const last = points[n - 1]

  const nearest = (clientX: number) => {
    const rect = wrap.current?.getBoundingClientRect()
    if (!rect || !n) return null
    const px = clientX - rect.left
    let best = 0
    for (let i = 1; i < n; i++) if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i
    return best
  }

  const onPointer = (e: PointerEvent) => setActive(nearest(e.clientX))
  const onKey = (e: KeyboardEvent) => {
    if (!n) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const step = e.key === 'ArrowRight' ? 1 : -1
      setActive((a) => Math.max(0, Math.min(n - 1, (a ?? n - 1) + (a === null ? 0 : step))))
    } else if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(n - 1)
    else if (e.key === 'Escape') setActive(null)
  }

  const tip = active !== null ? points[active] : null
  const tipLeft = active !== null ? Math.max(70, Math.min(width - 70, x(active))) : 0

  return (
    <div className={`ls-chart ${seen ? 'is-seen' : ''}`}>
      <p className="ls-chart__title" id={titleId}>
        Accuracy per broadcast{n > 1 ? `, last ${n}` : ''}
      </p>
      <div
        ref={wrap}
        className="ls-chart__plot"
        tabIndex={n ? 0 : -1}
        role="group"
        aria-labelledby={titleId}
        aria-describedby={n ? `${titleId}-hint` : undefined}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={() => setActive(null)}
        onFocus={() => n && setActive((a) => a ?? n - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKey}
      >
        <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} aria-hidden="true">
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="ls-chart__grid" />
              <text x={PAD.left - 10} y={y(t) + 4} className="ls-chart__tick" textAnchor="end">
                {t * 100}%
              </text>
            </g>
          ))}
          <line x1={PAD.left} x2={width - PAD.right} y1={y(goal)} y2={y(goal)} className="ls-chart__goal" />
          <text x={width - PAD.right + 8} y={y(goal) + 4} className="ls-chart__goal-label">
            {Math.round(goal * 100)}% goal
          </text>

          {n === 0 && (
            <>
              <path d={`M${PAD.left} ${y(0)} H${width - PAD.right}`} className="ls-chart__flat" />
              <text x={PAD.left + plotW / 2} y={y(0.32)} className="ls-chart__empty" textAnchor="middle">
                NO SIGNAL YET
              </text>
            </>
          )}

          {n > 1 && <path d={area} className="ls-chart__area" />}
          {n > 1 && <path d={line} className="ls-chart__line" pathLength={1} />}

          {active !== null && (
            <line x1={x(active)} x2={x(active)} y1={PAD.top - 4} y2={y(0)} className="ls-chart__cross" />
          )}

          {points.map((p, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(p.accuracy)}
              r={i === active ? 6 : 4}
              className={`ls-chart__dot ${i === n - 1 ? 'is-last' : ''}`}
              style={{ animationDelay: `${300 + (i / Math.max(1, n - 1)) * 900}ms` }}
            />
          ))}

          {last && (
            <text x={x(n - 1) + 10} y={y(last.accuracy) + (last.accuracy > goal - 0.08 && last.accuracy < goal + 0.08 ? -10 : 4)} className="ls-chart__end">
              {Math.round(last.accuracy * 100)}%
            </text>
          )}

          {n > 0 && (
            <>
              <text x={x(0)} y={H - 8} className="ls-chart__tick" textAnchor={n > 1 ? 'start' : 'middle'}>
                {points[0].date}
              </text>
              {n > 1 && (
                <text x={x(n - 1)} y={H - 8} className="ls-chart__tick" textAnchor="end">
                  {last.date}
                </text>
              )}
            </>
          )}
        </svg>

        {tip && (
          <div className="ls-chart__tip" style={{ left: tipLeft }}>
            <strong>{Math.round(tip.accuracy * 100)}%</strong>
            <span>
              {tip.score} · {tip.date}
            </span>
            <span>{tip.title}</span>
          </div>
        )}
        {n > 0 && (
          <p id={`${titleId}-hint`} className="visually-hidden">
            Use the left and right arrow keys to read each broadcast.
          </p>
        )}
        <p className="visually-hidden" aria-live="polite">
          {tip ? `${tip.title}, ${tip.date}: ${tip.score}, ${Math.round(tip.accuracy * 100)}%` : ''}
        </p>
      </div>

      {n > 0 && (
        <details className="ls-chart__table">
          <summary>Show as a table</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Broadcast</th>
                <th scope="col">Score</th>
                <th scope="col">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={i}>
                  <td>{p.date}</td>
                  <td>{p.title}</td>
                  <td>{p.score}</td>
                  <td>{Math.round(p.accuracy * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  )
}
