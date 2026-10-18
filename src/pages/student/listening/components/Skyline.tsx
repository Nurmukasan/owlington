import { useMemo } from 'react'

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

interface Building {
  x: number
  w: number
  h: number
  windows: { x: number; y: number; lit: 'a' | 't' | 'v'; blink: boolean }[]
  cap?: 'antenna' | 'tank' | 'step'
}

const W = 1600
const H = 260

/** A pixel city skyline with lit windows, drawn once as SVG. `tone` picks the near (dark) or far (hazy) layer. */
export function Skyline({ seed = 7, tone = 'near', className = '' }: { seed?: number; tone?: 'near' | 'far'; className?: string }) {
  const buildings = useMemo(() => {
    const rnd = seeded(seed)
    const out: Building[] = []
    let x = -10
    while (x < W) {
      const w = 56 + Math.round(rnd() * 90)
      const h = (tone === 'far' ? 90 : 60) + Math.round(rnd() * (tone === 'far' ? 150 : 120))
      const windows: Building['windows'] = []
      for (let wy = H - h + 16; wy < H - 12; wy += 16) {
        for (let wx = x + 10; wx < x + w - 12; wx += 14) {
          const r = rnd()
          if (r < (tone === 'far' ? 0.16 : 0.24)) windows.push({ x: wx, y: wy, lit: r < 0.035 ? 't' : r < 0.06 ? 'v' : 'a', blink: rnd() < 0.08 })
        }
      }
      const c = rnd()
      out.push({ x, w, h, windows, cap: c < 0.18 ? 'antenna' : c < 0.3 ? 'tank' : c < 0.45 ? 'step' : undefined })
      x += w + (rnd() < 0.3 ? 8 : 0)
    }
    return out
  }, [seed, tone])

  return (
    <svg
      className={`ls-skyline ls-skyline--${tone} ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {buildings.map((b, i) => (
        <g key={i}>
          <rect className="ls-skyline__body" x={b.x} y={H - b.h} width={b.w} height={b.h} />
          <rect className="ls-skyline__rim" x={b.x} y={H - b.h} width={b.w} height={3} />
          {b.cap === 'antenna' && (
            <>
              <rect className="ls-skyline__body" x={b.x + b.w / 2 - 2} y={H - b.h - 34} width={4} height={34} />
              <rect className="ls-skyline__light" x={b.x + b.w / 2 - 3} y={H - b.h - 40} width={6} height={6} />
            </>
          )}
          {b.cap === 'tank' && (
            <>
              <rect className="ls-skyline__body" x={b.x + 12} y={H - b.h - 30} width={30} height={22} />
              <rect className="ls-skyline__body" x={b.x + 16} y={H - b.h - 10} width={4} height={10} />
              <rect className="ls-skyline__body" x={b.x + 34} y={H - b.h - 10} width={4} height={10} />
              <rect className="ls-skyline__body" x={b.x + 10} y={H - b.h - 36} width={34} height={6} />
            </>
          )}
          {b.cap === 'step' && <rect className="ls-skyline__body" x={b.x + 12} y={H - b.h - 18} width={b.w - 24} height={18} />}
          {b.windows.map((w, j) => (
            <rect
              key={j}
              className={`ls-skyline__win ls-skyline__win--${w.lit} ${w.blink ? 'is-blink' : ''}`}
              x={w.x}
              y={w.y}
              width={6}
              height={7}
              style={w.blink ? { animationDelay: `${(j % 7) * 1.3}s` } : undefined}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
