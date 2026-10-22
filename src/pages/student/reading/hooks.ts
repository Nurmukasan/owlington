import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/** Live `prefers-reduced-motion` flag. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** True once the element has scrolled into view (stays true). */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = '0px 0px -12% 0px') {
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, inView])
  return inView
}

/** A ref + "is-in" flag for scroll-triggered entrance animations. */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null)
  const inView = useInView(ref)
  return [ref, inView] as const
}

/** Counts from 0 (or the previous value) up to `target` once `run` is true. */
export function useCountUp(target: number, run = true, duration = 1100) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    if (!run) return
    if (reduced) {
      from.current = target
      const id = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(id)
    }
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
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration, reduced])

  return value
}

/** Width of an element, kept up to date with a ResizeObserver. */
export function useElementWidth<T extends Element>(ref: RefObject<T | null>, fallback = 560) {
  const [width, setWidth] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.getBoundingClientRect().width || fallback)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, fallback])
  return width
}

/**
 * A stopwatch that only runs while `running` is true and can be reset to any
 * value (used to resume a saved draft). It holds no state, so the page that owns
 * it never re-renders on a tick: `read()` gives the exact current value, and a
 * small display component polls it (see DeskTimer).
 */
export function useClock(running: boolean) {
  const banked = useRef(0)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    startedAt.current = performance.now()
    return () => {
      if (startedAt.current !== null) banked.current += (performance.now() - startedAt.current) / 1000
      startedAt.current = null
    }
  }, [running])

  const read = useCallback(
    () => banked.current + (startedAt.current !== null ? (performance.now() - startedAt.current) / 1000 : 0),
    [],
  )

  const reset = useCallback((to = 0) => {
    banked.current = to
    if (startedAt.current !== null) startedAt.current = performance.now()
  }, [])

  return { read, reset }
}

/** A callback with a stable identity that always runs the latest render's version. */
export function useStableCallback<A extends unknown[], R>(fn: (...args: A) => R) {
  const ref = useRef(fn)
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args: A) => ref.current(...args), [])
}
