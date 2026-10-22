import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { ProcessIcon } from './art'
import type { Figure, LineFigure, ProcessFigure } from './prompts'

/**
 * Categorical slots validated on the paper surface (#fbf4e4): all three pass
 * lightness, chroma, all-pairs CVD separation, the normal-vision floor and
 * 3:1 contrast. Identity is also carried by marker shape and direct labels.
 */
const SERIES_COLORS = ['#2a78d6', '#d95926', '#199e70']
type Shape = 'circle' | 'square' | 'diamond'
const SHAPES: Shape[] = ['circle', 'square', 'diamond']

function Marker({ shape, x, y, r, color }: { shape: Shape; x: number; y: number; r: number; color: string }) {
  if (shape === 'square') return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={1} fill={color} className="wr-fig__marker" />
  if (shape === 'diamond')
    return <path d={`M${x} ${y - r * 1.3} L${x + r * 1.3} ${y} L${x} ${y + r * 1.3} L${x - r * 1.3} ${y} Z`} fill={color} className="wr-fig__marker" />
  return <circle cx={x} cy={y} r={r} fill={color} className="wr-fig__marker" />
}

function LegendKey({ shape, color }: { shape: Shape; color: string }) {
  return (
    <svg width="28" height="14" viewBox="0 0 28 14" aria-hidden="true">
      <line x1="1" x2="27" y1="7" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Marker shape={shape} x={14} y={7} r={3.6} color={color} />
    </svg>
  )
}

export function FigureView({ figure, large = false }: { figure: Figure; large?: boolean }) {
  return figure.kind === 'line' ? <LineChart figure={figure} large={large} /> : <ProcessDiagram figure={figure} large={large} />
}

// ----------------------------------------------------------------- line ---

function LineChart({ figure, large }: { figure: LineFigure; large: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(large ? 760 : 360)
  const [active, setActive] = useState<number | null>(null)
  const [table, setTable] = useState(false)
  const id = useId()

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(260, Math.round(entry.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [table])

  const height = Math.round(Math.min(large ? 420 : 300, Math.max(220, width * 0.62)))
  const labelW = width < 400 ? 54 : 70
  const M = { top: 16, right: labelW + 8, bottom: 30, left: 38 }
  const plotW = width - M.left - M.right
  const plotH = height - M.top - M.bottom
  const n = figure.xs.length
  const x = (i: number) => M.left + (i / (n - 1)) * plotW
  const y = (v: number) => M.top + (1 - v / figure.yMax) * plotH
  const ticks: number[] = []
  for (let t = 0; t <= figure.yMax + 1e-9; t += figure.yStep) ticks.push(Math.round(t * 10) / 10)

  // Direct labels at the right end, nudged apart so they never overlap.
  const ends = figure.series
    .map((s, i) => ({ i, y: y(s.values[n - 1]) }))
    .sort((a, b) => a.y - b.y)
  for (let k = 1; k < ends.length; k++) ends[k].y = Math.max(ends[k].y, ends[k - 1].y + 15)
  const endY = new Map(ends.map((e) => [e.i, e.y]))

  const pick = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - r.left
    setActive(Math.max(0, Math.min(n - 1, Math.round((px / r.width) * (n - 1)))))
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive((a) => Math.max(0, Math.min(n - 1, (a ?? (e.key === 'ArrowRight' ? -1 : n)) + (e.key === 'ArrowRight' ? 1 : -1))))
    } else if (e.key === 'Escape') setActive(null)
  }

  const fmt = (v: number) => v.toFixed(1)

  return (
    <figure className={`wr-fig ${large ? 'wr-fig--large' : ''}`}>
      <figcaption className="wr-fig__caption">
        <span className="wr-fig__title">{figure.title}</span>
        <span className="wr-fig__unit">{figure.yLabel}</span>
      </figcaption>
      <ul className="wr-fig__legend" aria-label="Legend">
        {figure.series.map((s, i) => (
          <li key={s.id}>
            <LegendKey shape={SHAPES[i]} color={SERIES_COLORS[i]} />
            {s.label}
          </li>
        ))}
      </ul>

      {table ? (
        <table className="wr-fig__table">
          <caption className="visually-hidden">
            {figure.title}, in {figure.unit}
          </caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              {figure.series.map((s) => (
                <th key={s.id} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {figure.xs.map((xv, i) => (
              <tr key={xv}>
                <th scope="row">{xv}</th>
                {figure.series.map((s) => (
                  <td key={s.id}>{fmt(s.values[i])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div ref={wrapRef} className="wr-fig__plot">
          <p id={`${id}-desc`} className="visually-hidden">
            Line graph of {figure.unit} for {figure.series.map((s) => s.label).join(', ')} from {figure.xs[0]} to {figure.xs[n - 1]}. Use
            the arrow keys to read the values for each year, or open the table view.
          </p>
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="wr-fig__svg"
            role="group"
            tabIndex={0}
            aria-label={figure.title}
            aria-describedby={`${id}-desc`}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} className={t === 0 ? 'wr-fig__base' : 'wr-fig__grid'} />
                <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="wr-fig__tick">
                  {t.toFixed(1)}
                </text>
              </g>
            ))}
            {figure.xs.map((xv, i) => (
              <text key={xv} x={x(i)} y={height - 10} textAnchor="middle" className="wr-fig__tick">
                {xv}
              </text>
            ))}

            {active !== null && <line x1={x(active)} x2={x(active)} y1={M.top} y2={M.top + plotH} className="wr-fig__cross" />}

            {figure.series.map((s, si) => (
              <g key={s.id}>
                <path
                  d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')}
                  fill="none"
                  stroke={SERIES_COLORS[si]}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {s.values.map((v, i) => (
                  <Marker key={i} shape={SHAPES[si]} x={x(i)} y={y(v)} r={active === i ? 5 : 4} color={SERIES_COLORS[si]} />
                ))}
                <line
                  x1={x(n - 1) + 6}
                  x2={x(n - 1) + 12}
                  y1={y(s.values[n - 1])}
                  y2={endY.get(si)}
                  stroke="#8a7a60"
                  strokeWidth={1}
                />
                <text x={x(n - 1) + 14} y={endY.get(si)} dy="0.32em" className="wr-fig__end">
                  {s.label.replace('Aged ', '')}
                </text>
              </g>
            ))}

            <rect
              x={M.left - 10}
              y={M.top}
              width={plotW + 20}
              height={plotH}
              fill="transparent"
              onPointerMove={pick}
              onPointerDown={pick}
              onPointerLeave={() => setActive(null)}
            />
          </svg>
          {active !== null && (
            <div
              className="wr-fig__tip"
              style={{ left: Math.min(width - 160, Math.max(0, x(active) + (active > n / 2 ? -170 : 12))), top: M.top + 4 }}
              aria-hidden="true"
            >
              <span className="wr-fig__tip-year">{figure.xs[active]}</span>
              {figure.series.map((s, si) => (
                <span key={s.id} className="wr-fig__tip-row">
                  <span className="wr-fig__tip-key" style={{ background: SERIES_COLORS[si] }} />
                  <strong>{fmt(s.values[active])}</strong> {s.label}
                </span>
              ))}
            </div>
          )}
          <p className="visually-hidden" aria-live="polite">
            {active !== null
              ? `${figure.xs[active]}: ${figure.series.map((s) => `${s.label} ${fmt(s.values[active])}`).join(', ')} ${figure.unit}.`
              : ''}
          </p>
        </div>
      )}
      <button type="button" className="wr-fig__toggle" aria-pressed={table} onClick={() => setTable((t) => !t)}>
        {table ? 'Show the graph' : 'Show the data as a table'}
      </button>
    </figure>
  )
}

// -------------------------------------------------------------- process ---

function ProcessDiagram({ figure, large }: { figure: ProcessFigure; large: boolean }) {
  const zoneOf = (i: number) => figure.zones.find(([, a, b]) => i >= a && i <= b)?.[0]
  const items: ReactNode[] = []
  figure.stages.forEach((stage, i) => {
    const zone = zoneOf(i)
    const zoneStart = figure.zones.find(([, a]) => a === i)
    items.push(
      <li key={stage.title} className={`wr-proc__stage ${zone === figure.zones[1]?.[0] ? 'is-home' : ''}`} style={{ '--wr-i': i } as CSSProperties}>
        {zoneStart && <span className="wr-proc__zone">{zoneStart[0]}</span>}
        <span className="wr-proc__num" aria-hidden="true">
          {i + 1}
        </span>
        <ProcessIcon name={stage.icon} size={large ? 64 : 46} />
        <span className="wr-proc__title">{stage.title}</span>
        <span className="wr-proc__detail">{stage.detail}</span>
        {i < figure.stages.length - 1 && <span className="wr-proc__arrow" aria-hidden="true" />}
      </li>,
    )
  })
  return (
    <figure className={`wr-fig wr-proc ${large ? 'wr-fig--large' : ''}`}>
      <figcaption className="wr-fig__caption">
        <span className="wr-fig__title">{figure.title}</span>
        <span className="wr-fig__unit">{figure.stages.length} stages</span>
      </figcaption>
      <ol className="wr-proc__list">{items}</ol>
    </figure>
  )
}
