import { useCallback, useEffect, useRef, useState } from 'react'

/** A stopwatch that only counts while `running` is true. */
export function useStopwatch(running: boolean) {
  const [elapsed, setElapsed] = useState(0)
  const banked = useRef(0)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    startedAt.current = performance.now()
    const id = window.setInterval(() => {
      if (startedAt.current !== null) setElapsed(banked.current + (performance.now() - startedAt.current) / 1000)
    }, 250)
    return () => {
      if (startedAt.current !== null) banked.current += (performance.now() - startedAt.current) / 1000
      startedAt.current = null
      window.clearInterval(id)
    }
  }, [running])

  const reset = useCallback(() => {
    banked.current = 0
    if (startedAt.current !== null) startedAt.current = performance.now()
    setElapsed(0)
  }, [])

  return { elapsed, reset }
}

/** 75 → "1:15", 3725 → "1:02:05". */
export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}
