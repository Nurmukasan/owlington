import { useEffect, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Attempt } from '../../../learn/progress'
import { SECTION_META, SECTION_ORDER, formatBand, formatWhen, titleOf } from '../../../learn/results/results'
import type { SectionId } from '../../../learn/types'

const MAX_POINTS = 30
const PAD = { top: 18, right: 44, bottom: 34, left: 36 }
const HEIGHT = 260
const SURFACE = '#0d0f30'

/** Tracks an element's width; a callback ref, so it follows the plot when it remounts. */
function useWidth<T extends HTMLElement>() {
  const [el, setEl] = useState<T | null>(null)
  const [width, setWidth] = useState(640)
  useEffect(() => {
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [el])
  return [setEl, width] as const
}

/**
 * Estimated band after every test, one line per section. The x axis is the order the
 * tests were taken in (so a busy evening doesn't squash into one spot); hover or use
 * the arrow keys to read each test.
 */
export function BandChart({ attempts }: { attempts: Attempt[] }) {
  const [wrapRef, width] = useWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const [asTable, setAsTable] = useState(false)

  const points = attempts
    .filter((a) => typeof a.band === 'number')
    .sort((a, b) => (a.at < b.at ? -1 : 1))
    .slice(-MAX_POINTS)

  if (points.length < 2) {
    return (
      <p className="pf-chart-empty">
        Take {points.length ? 'one more test' : 'two tests'} in any section and your band line starts drawing itself here.
      </p>
    )
  }

  const bands = points.map((p) => p.band as number)
  const lo = Math.max(0, Math.min(4, Math.floor(Math.min(...bands))))
  const hi = 9
  const innerW = Math.max(120, width - PAD.left - PAD.right)
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW)
  const y = (band: number) => PAD.top + (1 - (band - lo) / (hi - lo)) * innerH
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)

  const present = SECTION_ORDER.filter((s) => points.some((p) => p.section === s))
  const series = present.map((s) => ({
    section: s,
    pts: points.map((p, i) => ({ p, i })).filter(({ p }) => p.section === s),
  }))

  // Label each line's last point, latest first; a label that would collide with one
  // already placed is left to the tooltip and the table.
  const endLabels: { section: SectionId; x: number; y: number; text: string }[] = []
  for (const { section, pts } of [...series].sort((a, b) => b.pts[b.pts.length - 1].i - a.pts[a.pts.length - 1].i)) {
    const last = pts[pts.length - 1]
    const label = { section, x: x(last.i), y: y(last.p.band as number), text: formatBand(last.p.band) }
    if (endLabels.every((o) => Math.abs(o.y - label.y) > 14 || Math.abs(o.x - label.x) > 36)) endLabels.push(label)
  }

  /** Each section's most recent band at or before column i. */
  const latestAt = (section: SectionId, i: number) => {
    for (let k = i; k >= 0; k--) if (points[k].section === section) return points[k]
    return undefined
  }

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const i = Math.round(((px - PAD.left) / innerW) * (points.length - 1))
    setActive(Math.max(0, Math.min(points.length - 1, i)))
  }

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const step = e.key === 'ArrowLeft' ? -1 : 1
    setActive((i) => Math.max(0, Math.min(points.length - 1, (i ?? points.length - 1) + (i === null ? 0 : step))))
  }

  const cur = active !== null ? points[active] : null
  const tipLeft = active !== null ? Math.min(Math.max(x(active), 110), width - 110) : 0

  return (
    <div className="pf-chart">
      <div className="pf-chart__top">
        <ul className="pf-legend" aria-label="Sections">
          {present.map((s) => (
            <li key={s}>
              <span className="pf-legend__key" style={{ background: SECTION_META[s].chart }} aria-hidden="true" />
              {SECTION_META[s].name}
            </li>
          ))}
        </ul>
        <button type="button" className="pf-linkbtn" aria-pressed={asTable} onClick={() => setAsTable((v) => !v)}>
          {asTable ? 'Show chart' : 'Show as table'}
        </button>
      </div>

      {asTable ? (
        <div className="pf-table-wrap">
          <table className="pf-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Section</th>
                <th scope="col">Test</th>
                <th scope="col">Band</th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((p) => (
                <tr key={`${p.section}${p.at}`}>
                  <td>{formatWhen(p.at, false)}</td>
                  <td>{SECTION_META[p.section].name}</td>
                  <td>{titleOf(p)}</td>
                  <td>{formatBand(p.band)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pf-chart__plot" ref={wrapRef}>
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={`Estimated band over your last ${points.length} tests. Use the arrow keys to read each test.`}
            tabIndex={0}
            onPointerMove={onMove}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={PAD.left + innerW} y1={y(t)} y2={y(t)} className="pf-grid" />
                <text x={PAD.left - 10} y={y(t)} className="pf-axis" textAnchor="end" dominantBaseline="middle">
                  {t}
                </text>
              </g>
            ))}
            <text x={PAD.left} y={HEIGHT - 8} className="pf-axis">
              {formatWhen(points[0].at, false)}
            </text>
            <text x={PAD.left + innerW} y={HEIGHT - 8} className="pf-axis" textAnchor="end">
              {formatWhen(points[points.length - 1].at, false)}
            </text>

            {active !== null && <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + innerH} className="pf-crosshair" />}

            {series.map(({ section, pts }) => (
              <g key={section}>
                {pts.length > 1 && (
                  <polyline
                    points={pts.map(({ p, i }) => `${x(i)},${y(p.band as number)}`).join(' ')}
                    fill="none"
                    stroke={SECTION_META[section].chart}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
                {pts.map(({ p, i }) => (
                  <circle
                    key={i}
                    cx={x(i)}
                    cy={y(p.band as number)}
                    r={active === i ? 6 : 4}
                    fill={SECTION_META[section].chart}
                    stroke={SURFACE}
                    strokeWidth={2}
                  />
                ))}
              </g>
            ))}
            {endLabels.map((l) => (
              <text key={l.section} x={l.x + 9} y={l.y} className="pf-endlabel" dominantBaseline="middle">
                {l.text}
              </text>
            ))}
          </svg>

          {cur && active !== null && (
            <div className="pf-tip" style={{ left: tipLeft }} role="status">
              <p className="pf-tip__when">{formatWhen(cur.at)}</p>
              <p className="pf-tip__main">
                <span className="pf-tip__key" style={{ background: SECTION_META[cur.section].chart }} aria-hidden="true" />
                <strong>{formatBand(cur.band)}</strong> {SECTION_META[cur.section].name}
              </p>
              <p className="pf-tip__title">{titleOf(cur)}</p>
              {present
                .filter((s) => s !== cur.section)
                .map((s) => {
                  const prev = latestAt(s, active)
                  return (
                    <p key={s} className="pf-tip__other">
                      <span className="pf-tip__key" style={{ background: SECTION_META[s].chart }} aria-hidden="true" />
                      <strong>{prev ? formatBand(prev.band) : '—'}</strong> {SECTION_META[s].name} {prev ? 'so far' : 'not yet'}
                    </p>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
