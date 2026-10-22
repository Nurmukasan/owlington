import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { formatBand, formatDate } from './stats'

export interface BandPoint {
  at: string
  band: number
  title: string
  score: number
  total: number
}

const HEIGHT = 200
const M = { top: 26, right: 40, bottom: 30, left: 34 }

/**
 * Self-assessed band estimates over time: one ink line on parchment, the latest
 * essay emphasised in coral, a crosshair tooltip (pointer and keyboard) and a
 * table view twin.
 */
export function BandChart({ points }: { points: BandPoint[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(520)
  const [active, setActive] = useState<number | null>(null)
  const [table, setTable] = useState(false)
  const id = useId()

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(260, Math.round(entry.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = points.length
  const min = Math.min(4, ...points.map((p) => Math.floor(p.band)))
  const max = 9
  const plotW = width - M.left - M.right
  const plotH = HEIGHT - M.top - M.bottom
  const x = (i: number) => M.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const y = (b: number) => M.top + (1 - (b - min) / (max - min)) * plotH
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.band).toFixed(1)}`).join(' ')
  const area = n > 1 ? `${line} L${x(n - 1).toFixed(1)} ${y(min)} L${x(0).toFixed(1)} ${y(min)} Z` : ''
  const last = n - 1
  const bestIndex = points.reduce((bi, p, i) => (p.band > points[bi].band ? i : bi), 0)

  const pick = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - r.left
    let nearest = 0
    let dist = Infinity
    points.forEach((_, i) => {
      const d = Math.abs(x(i) - M.left - px)
      if (d < dist) {
        dist = d
        nearest = i
      }
    })
    setActive(nearest)
  }

  const onKey = (e: KeyboardEvent) => {
    if (!n) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive((a) => {
        const cur = a ?? last
        return Math.max(0, Math.min(last, cur + (e.key === 'ArrowRight' ? 1 : -1)))
      })
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(last)
    } else if (e.key === 'Escape') {
      setActive(null)
    }
  }

  const a = active !== null ? points[active] : null
  const summary = n
    ? `${n} self-assessed ${n === 1 ? 'essay' : 'essays'}. First band ${formatBand(points[0].band)}, latest ${formatBand(
        points[last].band,
      )}, best ${formatBand(points[bestIndex].band)}.`
    : 'No essays yet.'

  return (
    <figure className="wr-chart">
      <figcaption className="wr-chart__head">
        <span className="wr-chart__title">Band estimate per essay</span>
        <button type="button" className="wr-chart__toggle" aria-pressed={table} onClick={() => setTable((t) => !t)}>
          {table ? 'View as chart' : 'View as table'}
        </button>
      </figcaption>

      {table ? (
        <div className="wr-chart__table-wrap">
          <table className="wr-chart__table">
            <caption className="visually-hidden">Self-assessed band estimate for each sealed essay</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Assignment</th>
                <th scope="col">Band</th>
                <th scope="col">Checklist</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={p.at}>
                  <td>{i + 1}</td>
                  <td>{formatDate(p.at)}</td>
                  <td>{p.title}</td>
                  <td>{formatBand(p.band)}</td>
                  <td>
                    {p.score}/{p.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={wrapRef} className="wr-chart__plot">
          <p id={`${id}-sum`} className="visually-hidden">
            {summary} Use the left and right arrow keys to read each essay.
          </p>
          <svg
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            className="wr-chart__svg"
            role="group"
            tabIndex={0}
            aria-label="Band estimate per essay"
            aria-describedby={`${id}-sum`}
            onKeyDown={onKey}
            onFocus={() => setActive((v) => v ?? last)}
            onBlur={() => setActive(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} className="wr-chart__grid" />
                <text x={M.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="wr-chart__tick">
                  {t}
                </text>
              </g>
            ))}
            <line x1={M.left} x2={width - M.right} y1={y(min)} y2={y(min)} className="wr-chart__base" />

            {area && <path d={area} className="wr-chart__area" />}
            {n > 1 && <path d={line} className="wr-chart__line" pathLength={1} />}

            {a && active !== null && (
              <line x1={x(active)} x2={x(active)} y1={M.top - 8} y2={y(min)} className="wr-chart__cross" />
            )}

            {points.map((p, i) => (
              <circle
                key={p.at}
                cx={x(i)}
                cy={y(p.band)}
                r={i === last ? 6.5 : active === i ? 6 : 4.5}
                className={`wr-chart__dot ${i === last ? 'is-latest' : ''} ${active === i ? 'is-active' : ''}`}
                style={{ animationDelay: `${300 + i * 90}ms` }}
              />
            ))}

            {n > 0 && (
              <text x={x(last)} y={y(points[last].band) - 14} textAnchor="middle" className="wr-chart__label">
                {formatBand(points[last].band)}
              </text>
            )}
            {n > 2 && bestIndex !== last && (
              <text x={x(bestIndex)} y={y(points[bestIndex].band) - 12} textAnchor="middle" className="wr-chart__label wr-chart__label--soft">
                best {formatBand(points[bestIndex].band)}
              </text>
            )}

            {n > 0 && (
              <>
                <text x={x(0)} y={HEIGHT - 8} textAnchor={n > 1 ? 'start' : 'middle'} className="wr-chart__tick">
                  {formatDate(points[0].at)}
                </text>
                {n > 1 && (
                  <text x={x(last)} y={HEIGHT - 8} textAnchor="end" className="wr-chart__tick">
                    {formatDate(points[last].at)}
                  </text>
                )}
              </>
            )}

            <rect
              x={M.left - 12}
              y={M.top - 12}
              width={plotW + 24}
              height={plotH + 12}
              fill="transparent"
              onPointerMove={pick}
              onPointerDown={pick}
              onPointerLeave={() => setActive(null)}
            />
          </svg>

          {a && active !== null && (
            <div
              className="wr-chart__tip"
              style={{
                left: Math.min(width - 190, Math.max(0, x(active) - 95)),
                top: Math.max(0, y(a.band) - 96),
              }}
              aria-hidden="true"
            >
              <strong>Band {formatBand(a.band)}</strong>
              <span>{a.title}</span>
              <span>
                {formatDate(a.at)} · checklist {a.score}/{a.total}
              </span>
            </div>
          )}
          <p className="visually-hidden" aria-live="polite">
            {a ? `Essay ${(active ?? 0) + 1}: band ${formatBand(a.band)}, ${a.title}, ${formatDate(a.at)}, checklist ${a.score} of ${a.total}.` : ''}
          </p>
        </div>
      )}
    </figure>
  )
}
