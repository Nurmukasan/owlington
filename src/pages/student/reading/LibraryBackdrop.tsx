import { Bookcase } from './Bookcase'
import { FloatingCandle } from './Candle'

/** The quieter library interior behind the lecture and practice pages. Decorative and fixed. */
export function LibraryBackdrop({ candles = true }: { candles?: boolean }) {
  return (
    <div className="rd-backdrop" aria-hidden="true">
      <div className="rd-backdrop__wall" />
      <div className="rd-backdrop__moon" />
      <Bookcase side="left" rows={8} />
      <Bookcase side="right" rows={8} />
      {candles && (
        <>
          <FloatingCandle x="5%" y="30%" size={0.8} delay={0.4} />
          <FloatingCandle x="93%" y="22%" size={0.95} delay={2.1} />
          <FloatingCandle x="90%" y="68%" size={0.65} delay={3.4} />
        </>
      )}
    </div>
  )
}
