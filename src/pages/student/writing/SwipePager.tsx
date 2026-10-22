import type { useSwipeRow } from './hooks'

/**
 * "3 / 8" with pager dots under a swipeable row. Only shown while the row scrolls
 * (phones); purely a pointer convenience, since every card is already a link in the
 * keyboard order.
 */
export function SwipePager({ row, noun }: { row: ReturnType<typeof useSwipeRow>; noun: string }) {
  if (!row.scrollable || row.count < 2) return null
  return (
    <div className="wr-swipe" aria-hidden="true">
      <span className="wr-swipe__count">
        {row.index + 1} / {row.count}
      </span>
      <span className="wr-swipe__dots">
        {Array.from({ length: row.count }, (_, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            className={`wr-swipe__dot ${i === row.index ? 'is-on' : ''}`}
            onClick={() => row.go(i)}
            title={`Show ${noun} ${i + 1}`}
          />
        ))}
      </span>
      <span className={`wr-swipe__hint ${row.index === 0 ? '' : 'is-gone'}`}>swipe for more →</span>
    </div>
  )
}
