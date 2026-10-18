import { useMemo } from 'react'

/** Deterministic little shelf of silhouetted books for the background bookcases. */
function shelfBooks(seed: number, count: number) {
  let s = seed
  const next = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const tones = ['#3b1a20', '#2f1a2a', '#3a2418', '#25202f', '#41201c', '#2b2420']
  return Array.from({ length: count }, (_, i) => ({
    h: 62 + Math.round(next() * 34),
    w: 9 + Math.round(next() * 9),
    tone: tones[Math.floor(next() * tones.length)],
    lean: next() < 0.08 && i > 0 ? -8 : 0,
  }))
}

/** A silhouetted bookcase full of deterministic books. Decorative. */
export function Bookcase({ side, rows = 6 }: { side: 'left' | 'right'; rows?: number }) {
  const shelves = useMemo(
    () => Array.from({ length: rows }, (_, r) => shelfBooks(side === 'left' ? 11 + r * 7 : 97 + r * 13, 16)),
    [side, rows],
  )
  return (
    <div className={`rd-bookcase rd-bookcase--${side}`} aria-hidden="true">
      {shelves.map((books, r) => (
        <div key={r} className="rd-bookcase__shelf">
          {books.map((b, i) => (
            <span
              key={i}
              className="rd-bookcase__book"
              style={{ height: `${b.h}%`, width: b.w, backgroundColor: b.tone, transform: b.lean ? `rotate(${b.lean}deg)` : undefined }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
