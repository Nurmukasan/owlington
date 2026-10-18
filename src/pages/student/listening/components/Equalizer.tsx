import { useMemo, type CSSProperties } from 'react'

/** Deterministic pseudo-random numbers, so bars keep their character between renders. */
function seeded(seed: number) {
  let s = seed * 9301 + 49297
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

interface EqualizerProps {
  bars?: number
  playing?: boolean
  seed?: number
  className?: string
}

/** A little LED equalizer. Bars bounce with CSS (transform only); they rest low when not playing. */
export function Equalizer({ bars = 10, playing = true, seed = 3, className = '' }: EqualizerProps) {
  const specs = useMemo(() => {
    const rnd = seeded(seed)
    return Array.from({ length: bars }, (_, i) => {
      const middle = 1 - Math.abs(i / Math.max(1, bars - 1) - 0.45) * 0.9
      return {
        d: 380 + rnd() * 520,
        delay: -rnd() * 1400,
        lo: 0.12 + rnd() * 0.18,
        hi: Math.min(1, 0.45 + middle * 0.45 + rnd() * 0.15),
        rest: 0.12 + rnd() * 0.16,
      }
    })
  }, [bars, seed])

  return (
    <span className={`ls-eq ${playing ? 'is-playing' : ''} ${className}`} aria-hidden="true">
      {specs.map((s, i) => (
        <span
          key={i}
          className="ls-eq__bar"
          style={
            {
              '--ls-eq-d': `${s.d}ms`,
              '--ls-eq-delay': `${s.delay}ms`,
              '--ls-eq-lo': s.lo,
              '--ls-eq-hi': s.hi,
              '--ls-eq-rest': s.rest,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}
