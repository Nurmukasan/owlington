import { useEffect, useRef, useState, type RefObject } from 'react'
import { isMuted } from '../../../learn/sfx'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** True while the element is on screen and the tab is visible — use it to pause animation loops. */
export function useActive(ref: RefObject<Element | null>, rootMargin = '80px') {
  const [onScreen, setOnScreen] = useState(true)
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return onScreen && visible
}

/** Adds `is-seen` once an element scrolls into view (for staged entrance animations). */
export function useSeen<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen] as const
}

/** Counts from 0 up to `target` once `start` is true. */
export function useCountUp(target: number, start = true, ms = 1100) {
  const [value, setValue] = useState(0)
  const [reduced] = useState(prefersReducedMotion)
  useEffect(() => {
    if (!start || reduced) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      setValue(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start, ms, reduced])
  return reduced ? target : value
}

// ---------------------------------------------------------------- audio ---

let audioCtx: AudioContext | null = null

/** A short burst of radio static, synthesised (tuning the dial). Respects the HUD mute toggle. */
export function crackle(duration = 0.24) {
  if (isMuted()) return
  const Ctor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return
  audioCtx ??= new Ctor()
  const ctx = audioCtx
  if (ctx.state === 'suspended') void ctx.resume()
  const length = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    const pop = Math.random() < 0.012 ? 1 : 0.32
    data[i] = (Math.random() * 2 - 1) * pop * Math.pow(1 - i / length, 1.4)
  }
  const src = ctx.createBufferSource()
  src.buffer = buffer
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 2200
  band.Q.value = 0.6
  const gain = ctx.createGain()
  gain.gain.value = 0.06
  src.connect(band).connect(gain).connect(ctx.destination)
  src.start()
}
