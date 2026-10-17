import { useId, useMemo } from 'react'
import { mulberry32 } from '../../scene/random'

/** Twinkling pixel stars plus the occasional shooting star. */
export function StarField({ count = 110, seed = 3 }: { count?: number; seed?: number }) {
  const stars = useMemo(() => {
    const rng = mulberry32(seed)
    return Array.from({ length: count }, () => ({
      x: rng() * 100,
      y: rng() * 100,
      size: rng() < 0.15 ? 3 : 2,
      delay: rng() * 6,
      duration: 2 + rng() * 4,
      twinkle: rng() < 0.55,
      sparkle: rng() < 0.05,
    }))
  }, [count, seed])

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={`star ${s.twinkle ? 'star--twinkle' : ''} ${s.sparkle ? 'star--sparkle' : ''}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      <span className="shooting-star" />
      <span className="shooting-star shooting-star--late" />
    </div>
  )
}

/** A strip of stepped pixel pines, drawn in 8px blocks. */
export function PixelForest({ seed = 11 }: { seed?: number }) {
  const layers = useMemo(() => {
    const rng = mulberry32(seed)
    const width = 260
    const height = 20
    const layer = (minH: number, maxH: number, gap: number) => {
      let d = ''
      let x = Math.floor(rng() * gap)
      while (x < width + 6) {
        const h = Math.round(minH + rng() * (maxH - minH))
        const top = height - 1 - h
        for (let r = 0; r < h; r++) {
          const half = r === h - 1 ? 0 : Math.floor(r / 3) + (r % 3)
          d += `M${x - half} ${top + r}h${half * 2 + 1}v1h${-(half * 2 + 1)}z`
        }
        x += gap + Math.floor(rng() * gap)
      }
      return d + `M0 ${height - 1}h${width}v1h${-width}z`
    }
    return { back: layer(8, 17, 5), front: layer(4, 10, 4) }
  }, [seed])

  return (
    <svg className="pixel-forest" viewBox="0 0 260 20" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d={layers.back} fill="#1c1a4c" shapeRendering="crispEdges" />
      <path d={layers.front} fill="var(--night-1)" shapeRendering="crispEdges" />
    </svg>
  )
}

/** A three-step dithered transition from one colour (top) to another (bottom). */
export function DitherEdge({ from, to }: { from: string; to: string }) {
  const id = `dither-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg className="dither-edge" width="100%" height="24" aria-hidden="true">
      <defs>
        <pattern id={id} width="32" height="24" patternUnits="userSpaceOnUse">
          <rect width="32" height="24" fill={from} />
          <rect x="8" y="0" width="8" height="8" fill={to} />
          <rect x="0" y="8" width="8" height="8" fill={to} />
          <rect x="16" y="8" width="8" height="8" fill={to} />
          <rect x="8" y="16" width="24" height="8" fill={to} />
        </pattern>
      </defs>
      <rect width="100%" height="24" fill={`url(#${id})`} shapeRendering="crispEdges" />
    </svg>
  )
}
