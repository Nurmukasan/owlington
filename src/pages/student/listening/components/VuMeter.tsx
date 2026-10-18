import { useEffect, useState } from 'react'

const PIVOT = { x: 120, y: 146 }
const SWEEP = 52 // degrees either side of vertical
const angleFor = (v: number) => -SWEEP + Math.max(0, Math.min(1, v)) * SWEEP * 2

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return { x: PIVOT.x + r * Math.sin(a), y: PIVOT.y - r * Math.cos(a) }
}

function arc(r: number, from: number, to: number) {
  const a = polar(r, angleFor(from))
  const b = polar(r, angleFor(to))
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)} A${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
}

interface VuMeterProps {
  /** 0..1, or null when there is no data yet. */
  value: number | null
  goal?: number
  label: string
}

/** An analogue VU meter: the needle swings (with a little overshoot) to the average accuracy. */
export function VuMeter({ value, goal = 0.7, label }: VuMeterProps) {
  const [shown, setShown] = useState<number | null>(null)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value))
    return () => cancelAnimationFrame(id)
  }, [value])

  const ticks = Array.from({ length: 11 }, (_, i) => i / 10)
  const needle = angleFor(shown ?? 0)

  return (
    <figure className={`ls-vu ${value === null ? 'is-idle' : ''}`}>
      <svg viewBox="0 0 240 158" className="ls-vu__svg" role="img" aria-label={label}>
        <defs>
          <radialGradient id="ls-vu-face" cx="50%" cy="85%" r="85%">
            <stop offset="0" stopColor="#fff6dc" />
            <stop offset="0.6" stopColor="#f6dfa6" />
            <stop offset="1" stopColor="#d9b571" />
          </radialGradient>
        </defs>
        <rect x={4} y={4} width={232} height={150} rx={10} className="ls-vu__face" fill="url(#ls-vu-face)" />
        <path d={arc(88, 0, 1)} className="ls-vu__scale" />
        <path d={arc(82, goal, 1)} className="ls-vu__goal" />
        {ticks.map((t) => {
          const major = t === 0 || t === 0.5 || t === 1 || Math.abs(t - goal) < 0.001
          const a = polar(88, angleFor(t))
          const b = polar(major ? 99 : 94, angleFor(t))
          return <line key={t} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={major ? 'ls-vu__tick is-major' : 'ls-vu__tick'} />
        })}
        {[0, 0.5, goal, 1].map((t) => {
          const p = polar(109, angleFor(t))
          return (
            <text key={t} x={p.x} y={p.y + 3} className="ls-vu__num" textAnchor="middle">
              {Math.round(t * 100)}
            </text>
          )
        })}
        <text x={polar(70, angleFor((goal + 1) / 2)).x} y={polar(70, angleFor((goal + 1) / 2)).y + 3} className="ls-vu__goal-label" textAnchor="middle">
          GOAL
        </text>
        <text x={PIVOT.x} y={124} className="ls-vu__brand" textAnchor="middle">
          VU · ACCURACY %
        </text>
        <g className="ls-vu__needle" style={{ transform: `rotate(${needle}deg)` }}>
          <g className="ls-vu__wobble">
            <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={PIVOT.y - 104} />
          </g>
        </g>
        <rect x={84} y={136} width={72} height={18} rx={4} className="ls-vu__cap" />
        <circle cx={PIVOT.x} cy={PIVOT.y} r={7} className="ls-vu__pivot" />
      </svg>
    </figure>
  )
}
