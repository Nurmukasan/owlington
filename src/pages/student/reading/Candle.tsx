import type { CSSProperties } from 'react'

interface FloatingCandleProps {
  /** Position inside the nearest positioned ancestor (any CSS length). */
  x: string
  y: string
  /** Size multiplier; smaller candles also read as further away. */
  size?: number
  /** Seconds of animation offset, so candles never bob in sync. */
  delay?: number
  className?: string
}

/** A floating library candle with a flickering flame and a warm halo. Decorative. */
export function FloatingCandle({ x, y, size = 1, delay = 0, className = '' }: FloatingCandleProps) {
  return (
    <span
      className={`rd-fcandle ${className}`}
      style={{ '--rd-x': x, '--rd-y': y, '--rd-s': size, '--rd-delay': `${-delay}s` } as CSSProperties}
      aria-hidden="true"
    >
      <span className="rd-fcandle__bob">
        <span className="rd-fcandle__glow" />
        <span className="rd-fcandle__flame">
          <span className="rd-fcandle__core" />
        </span>
        <span className="rd-fcandle__wick" />
        <span className="rd-fcandle__wax">
          <span className="rd-fcandle__drip" />
        </span>
      </span>
    </span>
  )
}

/** A candle whose wax burns down with `fraction` (1 = full, 0 = spent). Decorative. */
export function BurningCandle({ fraction, lit = true, warn = false, className = '' }: { fraction: number; lit?: boolean; warn?: boolean; className?: string }) {
  const f = Math.max(0, Math.min(1, fraction))
  return (
    <span
      className={`rd-bcandle ${lit ? 'is-lit' : 'is-out'} ${warn ? 'is-warn' : ''} ${className}`}
      style={{ '--rd-wax': f } as CSSProperties}
      aria-hidden="true"
    >
      <span className="rd-bcandle__stick">
        <span className="rd-bcandle__flame" />
        <span className="rd-bcandle__smoke" />
        <span className="rd-bcandle__wax" />
      </span>
      <span className="rd-bcandle__holder" />
    </span>
  )
}
