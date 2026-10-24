import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { ProcessIcon } from './art'
import { PlanMap } from '../listening/practice/PlanMap'
import type { BarFigure, Figure, LineFigure, MapFigure, PieFigure, ProcessFigure, SingleFigure, TableFigure } from './prompts'

/**
 * Categorical slots validated on the paper surface (#fbf4e4): all three pass
 * lightness, chroma, all-pairs CVD separation, the normal-vision floor and
 * 3:1 contrast. Identity is also carried by marker shape and direct labels.
 */
const SERIES_COLORS = ['#2a78d6', '#d95926', '#199e70']
/**
 * Pie slices need up to five slots: the three above plus violet and ochre,
 * validated together on the paper surface. Ochre sits just under 3:1, so pie
 * slices always carry direct labels and a table view.
 */
const SLICE_COLORS = [...SERIES_COLORS, '#8a5cc7', '#b8860b']
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
  if (figure.kind === 'multi')
    return (
      <div className="wr-figs">
        {figure.parts.map((part) => (
          <Single key={part.title} figure={part} large={large} />
        ))}
      </div>
    )
  return <Single figure={figure} large={large} />
}

function Single({ figure, large }: { figure: SingleFigure; large: boolean }) {
  switch (figure.kind) {
    case 'line':
      return <LineChart figure={figure} large={large} />
    case 'process':
      return <ProcessDiagram figure={figure} large={large} />
    case 'bar':
      return <BarChart figure={figure} large={large} />
    case 'pie':
      return <PieCharts figure={figure} large={large} />
    case 'table':
      return <DataTable figure={figure} large={large} />
    case 'map':
      return <MapPanels figure={figure} large={large} />
  }
}

/** Width of the element a chart lives in, kept up to date. */
function useWidth(fallback: number, deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(260, Math.round(entry.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return [ref, width] as const
}

const num = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1))

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

/** Where stage `i` sits in a snaking grid of `cols` columns, and which way its arrow points. */
function snake(i: number, count: number, cols: number) {
  const row = Math.floor(i / cols)
  const pos = i % cols
  const forward = row % 2 === 0
  const col = forward ? pos + 1 : cols - pos
  const last = i === count - 1
  const dir = last ? 'none' : pos === cols - 1 ? 'down' : forward ? 'right' : 'left'
  return { col, row: row + 1, dir }
}

function ProcessDiagram({ figure, large }: { figure: ProcessFigure; large: boolean }) {
  const zoneOf = (i: number) => figure.zones.find(([, a, b]) => i >= a && i <= b)?.[0]
  const count = figure.stages.length
  const items: ReactNode[] = []
  figure.stages.forEach((stage, i) => {
    const zone = zoneOf(i)
    const zoneStart = figure.zones.find(([, a]) => a === i)
    // Two layouts snake the same way: 2 columns in the sidebar, 4 in the enlarged view.
    const two = snake(i, count, 2)
    const four = snake(i, count, 4)
    items.push(
      <li
        key={stage.title}
        className={`wr-proc__stage ${zone === figure.zones[1]?.[0] ? 'is-home' : ''}`}
        style={{ '--wr-i': i, '--wr-c2': two.col, '--wr-r2': two.row, '--wr-c4': four.col, '--wr-r4': four.row } as CSSProperties}
      >
        {zoneStart && <span className="wr-proc__zone">{zoneStart[0]}</span>}
        <span className="wr-proc__num" aria-hidden="true">
          {i + 1}
        </span>
        {stage.icon && <ProcessIcon name={stage.icon} size={large ? 64 : 46} />}
        <span className="wr-proc__title">{stage.title}</span>
        <span className="wr-proc__detail">{stage.detail}</span>
        {i < count - 1 && <span className="wr-proc__arrow" data-d2={two.dir} data-d4={four.dir} aria-hidden="true" />}
      </li>,
    )
  })
  return (
    <figure className={`wr-fig wr-proc ${large ? 'wr-fig--large' : ''}`}>
      <figcaption className="wr-fig__caption">
        <span className="wr-fig__title">{figure.title}</span>
        <span className="wr-fig__unit">{count} stages · follow the numbers</span>
      </figcaption>
      <ol className="wr-proc__list">{items}</ol>
    </figure>
  )
}

// ------------------------------------------------------------------ bar ---

function BarChart({ figure, large }: { figure: BarFigure; large: boolean }) {
  const [table, setTable] = useState(false)
  const [ref, width] = useWidth(large ? 760 : 360, [table])
  const [active, setActive] = useState<number | null>(null)
  const id = useId()
  const height = Math.round(Math.min(large ? 420 : 300, Math.max(220, width * 0.62)))
  const M = { top: 16, right: 10, bottom: 34, left: 42 }
  const plotW = width - M.left - M.right
  const plotH = height - M.top - M.bottom
  const groups = figure.categories.length
  const per = figure.series.length
  const groupW = plotW / groups
  const barW = Math.max(6, Math.min(34, (groupW - 14) / per - 2))
  const y = (v: number) => M.top + (1 - v / figure.yMax) * plotH
  const ticks: number[] = []
  for (let t = 0; t <= figure.yMax + 1e-9; t += figure.yStep) ticks.push(Math.round(t * 10) / 10)
  const small = width < 420

  return (
    <figure className={`wr-fig ${large ? 'wr-fig--large' : ''}`}>
      <figcaption className="wr-fig__caption">
        <span className="wr-fig__title">{figure.title}</span>
        <span className="wr-fig__unit">{figure.yLabel}</span>
      </figcaption>
      {per > 1 && (
        <ul className="wr-fig__legend" aria-label="Legend">
          {figure.series.map((s, i) => (
            <li key={s.id}>
              <span className="wr-fig__swatch" style={{ background: SERIES_COLORS[i] }} aria-hidden="true" />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      {table ? (
        <SeriesTable title={figure.title} unit={figure.unit} head="" xs={figure.categories} series={figure.series} />
      ) : (
        <div ref={ref} className="wr-fig__plot">
          <p id={`${id}-desc`} className="visually-hidden">
            Bar chart of {figure.unit} for {figure.categories.join(', ')}. Hover a bar or open the table view for exact values.
          </p>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="wr-fig__svg" role="img" aria-label={figure.title} aria-describedby={`${id}-desc`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} className={t === 0 ? 'wr-fig__base' : 'wr-fig__grid'} />
                <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="wr-fig__tick">
                  {num(t)}
                </text>
              </g>
            ))}
            {figure.categories.map((c, ci) => {
              const gx = M.left + ci * groupW + (groupW - per * (barW + 2)) / 2
              return (
                <g key={c} onPointerEnter={() => setActive(ci)} onPointerLeave={() => setActive(null)}>
                  <rect x={M.left + ci * groupW} y={M.top} width={groupW} height={plotH} fill="transparent" />
                  {figure.series.map((s, si) => {
                    const v = s.values[ci]
                    const top = y(v)
                    const h = Math.max(0, M.top + plotH - top)
                    const r = Math.min(4, barW / 2, h)
                    const x0 = gx + si * (barW + 2)
                    return (
                      <path
                        key={s.id}
                        d={`M${x0} ${top + h} V${top + r} Q${x0} ${top} ${x0 + r} ${top} H${x0 + barW - r} Q${x0 + barW} ${top} ${x0 + barW} ${top + r} V${top + h} Z`}
                        fill={SERIES_COLORS[si]}
                        opacity={active === null || active === ci ? 1 : 0.55}
                      />
                    )
                  })}
                  <text x={M.left + ci * groupW + groupW / 2} y={height - 12} textAnchor="middle" className="wr-fig__tick">
                    {small && c.length > 9 ? `${c.slice(0, 8)}…` : c}
                  </text>
                </g>
              )
            })}
          </svg>
          {active !== null && (
            <div
              className="wr-fig__tip"
              style={{ left: Math.min(width - 170, Math.max(0, M.left + active * groupW + (active > groups / 2 ? -150 : groupW))), top: M.top + 4 }}
              aria-hidden="true"
            >
              <span className="wr-fig__tip-year">{figure.categories[active]}</span>
              {figure.series.map((s, si) => (
                <span key={s.id} className="wr-fig__tip-row">
                  <span className="wr-fig__tip-key" style={{ background: SERIES_COLORS[si] }} />
                  <strong>{num(s.values[active])}</strong> {per > 1 ? s.label : figure.unit}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      <button type="button" className="wr-fig__toggle" aria-pressed={table} onClick={() => setTable((t) => !t)}>
        {table ? 'Show the chart' : 'Show the data as a table'}
      </button>
    </figure>
  )
}

function SeriesTable({ title, unit, head, xs, series }: { title: string; unit: string; head: string; xs: string[]; series: { id: string; label: string; values: number[] }[] }) {
  return (
    <table className="wr-fig__table">
      <caption className="visually-hidden">
        {title}, in {unit}
      </caption>
      <thead>
        <tr>
          <th scope="col">{head}</th>
          {series.map((s) => (
            <th key={s.id} scope="col">
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {xs.map((xv, i) => (
          <tr key={xv}>
            <th scope="row">{xv}</th>
            {series.map((s) => (
              <td key={s.id}>{num(s.values[i])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ------------------------------------------------------------------ pie ---

function PieCharts({ figure, large }: { figure: PieFigure; large: boolean }) {
  const [table, setTable] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const size = large ? 230 : 170
  const R = size / 2 - 4
  return (
    <figure className={`wr-fig wr-pie ${large ? 'wr-fig--large' : ''}`}>
      <figcaption className="wr-fig__caption">
        <span className="wr-fig__title">{figure.title}</span>
        <span className="wr-fig__unit">per cent</span>
      </figcaption>
      <ul className="wr-fig__legend" aria-label="Legend">
        {figure.slices.map((label, i) => (
          <li key={label} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)}>
            <span className="wr-fig__swatch" style={{ background: SLICE_COLORS[i] }} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
      {table ? (
        <SeriesTable
          title={figure.title}
          unit="per cent"
          head=""
          xs={figure.slices}
          series={figure.pies.map((p, i) => ({ id: String(i), label: p.label, values: p.values }))}
        />
      ) : (
        <div className="wr-pie__row">
          {figure.pies.map((pie) => {
            const total = pie.values.reduce((a, b) => a + b, 0) || 1
            let angle = -Math.PI / 2
            return (
              <div key={pie.label} className="wr-pie__one">
                <svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  role="img"
                  aria-label={`${pie.label}: ${figure.slices.map((s, i) => `${s} ${num(pie.values[i])}%`).join(', ')}`}
                >
                  {pie.values.map((v, i) => {
                    const a0 = angle
                    const a1 = angle + (v / total) * Math.PI * 2
                    angle = a1
                    const c = size / 2
                    const large1 = a1 - a0 > Math.PI ? 1 : 0
                    const p0 = [c + R * Math.cos(a0), c + R * Math.sin(a0)]
                    const p1 = [c + R * Math.cos(a1), c + R * Math.sin(a1)]
                    const mid = (a0 + a1) / 2
                    const lx = c + R * 0.64 * Math.cos(mid)
                    const ly = c + R * 0.64 * Math.sin(mid)
                    return (
                      <g key={i} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)}>
                        <path
                          d={`M${c} ${c} L${p0[0]} ${p0[1]} A${R} ${R} 0 ${large1} 1 ${p1[0]} ${p1[1]} Z`}
                          fill={SLICE_COLORS[i]}
                          stroke="#fbf4e4"
                          strokeWidth={2}
                          opacity={active === null || active === i ? 1 : 0.5}
                        />
                        {v >= 6 && (
                          <text x={lx} y={ly} dy="0.32em" textAnchor="middle" className="wr-pie__value">
                            {num(v)}%
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>
                <p className="wr-pie__label">{pie.label}</p>
                <p className="wr-pie__small">
                  {pie.values.some((v) => v < 6) &&
                    figure.slices
                      .map((s, i) => [s, pie.values[i]] as const)
                      .filter(([, v]) => v < 6)
                      .map(([s, v]) => `${s} ${num(v)}%`)
                      .join(' · ')}
                </p>
              </div>
            )
          })}
        </div>
      )}
      <button type="button" className="wr-fig__toggle" aria-pressed={table} onClick={() => setTable((t) => !t)}>
        {table ? 'Show the charts' : 'Show the data as a table'}
      </button>
    </figure>
  )
}

// ---------------------------------------------------------------- table ---

function DataTable({ figure, large }: { figure: TableFigure; large: boolean }) {
  return (
    <figure className={`wr-fig ${large ? 'wr-fig--large' : ''}`}>
      <figcaption className="wr-fig__caption">
        <span className="wr-fig__title">{figure.title}</span>
        <span className="wr-fig__unit">{figure.unit}</span>
      </figcaption>
      <div className="wr-fig__scroll">
        <table className="wr-fig__table wr-fig__table--data">
          <thead>
            <tr>
              {figure.columns.map((c, i) => (
                <th key={c || i} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {figure.rows.map((row) => (
              <tr key={String(row[0])}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i}>{typeof cell === 'number' ? num(cell) : cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

// ------------------------------------------------------------------ map ---

function MapPanels({ figure, large }: { figure: MapFigure; large: boolean }) {
  return (
    <figure className={`wr-fig wr-maps ${large ? 'wr-fig--large' : ''}`}>
      <figcaption className="wr-fig__caption">
        <span className="wr-fig__title">{figure.title}</span>
        <span className="wr-fig__unit">{figure.panels.map((p) => p.label).join(' · ')}</span>
      </figcaption>
      <div className="wr-maps__row">
        {figure.panels.map((p) => (
          <div key={p.label} className="wr-maps__one">
            <p className="wr-maps__label">{p.label}</p>
            <PlanMap spec={p.spec} />
          </div>
        ))}
      </div>
    </figure>
  )
}
