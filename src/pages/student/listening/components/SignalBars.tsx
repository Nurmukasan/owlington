/** 0–5 signal bars for a best accuracy (null = no signal yet). */
export function SignalBars({ accuracy, className = '' }: { accuracy: number | null; className?: string }) {
  const bars = accuracy === null ? 0 : Math.max(1, Math.min(5, Math.ceil(accuracy * 5)))
  return (
    <span className={`ls-bars ${className}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((b) => (
        <span key={b} className={b <= bars ? 'is-on' : ''} style={{ height: `${20 + b * 16}%` }} />
      ))}
    </span>
  )
}
