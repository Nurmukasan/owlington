import { useEffect, useRef, useState, type RefObject } from 'react'

const REDUCED = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia(REDUCED).matches

/** Live prefers-reduced-motion flag. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia(REDUCED)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * True while the element is on screen and the tab is visible — used to pause
 * looping scene animations when nobody can see them.
 */
export function useActive(ref: RefObject<Element | null>, rootMargin = '80px') {
  const [inView, setInView] = useState(true)
  const [visible, setVisible] = useState(() => (typeof document === 'undefined' ? true : !document.hidden))

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return inView && visible
}

/** Becomes true once the element's top edge scrolls well into view (for entrance animations). */
export function useRevealed(ref: RefObject<Element | null>, inset = 0.12) {
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || revealed) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0, rootMargin: `0px 0px -${Math.round(inset * 100)}% 0px` },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, inset, revealed])
  return revealed
}

/** Animates a number from its previous value to `target` (ease-out). Instant with reduced motion. */
export function useCountUp(target: number, run = true, duration = 1100) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    if (!run || reduced) return
    const start = performance.now()
    const begin = from.current
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = begin + (target - begin) * eased
      setValue(v)
      if (t < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      from.current = target
    }
  }, [target, run, duration, reduced])

  return reduced ? target : value
}
