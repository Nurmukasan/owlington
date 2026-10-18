import { useEffect, useRef } from 'react'
import { prefersReducedMotion, useActive } from '../hooks'

interface Ribbon {
  rgb: [number, number, number]
  /** Vertical position of the bright lower edge, 0..1 of the canvas height. */
  y: number
  amp: number
  /** Curtain height, 0..1. */
  h: number
  speed: number
  freq: number
  alpha: number
  phase: number
}

const RIBBONS: Ribbon[] = [
  { rgb: [96, 240, 200], y: 0.5, amp: 0.1, h: 0.42, speed: 1, freq: 1.3, alpha: 0.5, phase: 0 },
  { rgb: [150, 120, 255], y: 0.36, amp: 0.08, h: 0.34, speed: 0.75, freq: 0.9, alpha: 0.42, phase: 2.1 },
  { rgb: [255, 96, 205], y: 0.6, amp: 0.07, h: 0.2, speed: 1.3, freq: 1.8, alpha: 0.26, phase: 4.2 },
  { rgb: [120, 247, 255], y: 0.28, amp: 0.06, h: 0.2, speed: 0.6, freq: 2.4, alpha: 0.22, phase: 1.3 },
]

/** A vertical gradient strip per ribbon: transparent at the top, bright at the lower edge. */
function makeStrip([r, g, b]: Ribbon['rgb']) {
  const c = document.createElement('canvas')
  c.width = 1
  c.height = 128
  const ctx = c.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 0, 128)
  grad.addColorStop(0, `rgba(${r},${g},${b},0)`)
  grad.addColorStop(0.55, `rgba(${r},${g},${b},0.35)`)
  grad.addColorStop(0.88, `rgba(${r},${g},${b},0.95)`)
  grad.addColorStop(0.94, `rgba(${Math.min(255, r + 90)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},1)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1, 128)
  return c
}

/**
 * Slowly waving aurora curtains on a tiny canvas (¼ resolution, so the
 * browser's upscaling softens it for free). Pauses off-screen and in hidden
 * tabs; draws one still frame under reduced motion.
 */
export function Aurora({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const active = useActive(ref)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const strips = RIBBONS.map((r) => makeStrip(r.rgb))
    const SCALE = 0.25
    let w = 1
    let h = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = Math.max(8, Math.round(rect.width * SCALE))
      h = Math.max(8, Math.round(rect.height * SCALE))
      canvas.width = w
      canvas.height = h
    }

    const draw = (time: number) => {
      const t = time / 1000
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      RIBBONS.forEach((rb, i) => {
        const strip = strips[i]
        for (let x = 0; x < w; x++) {
          const u = x / w
          const edge = Math.min(1, u * 5, (1 - u) * 3.5)
          const wave =
            Math.sin(u * rb.freq * Math.PI * 2 + t * 0.11 * rb.speed + rb.phase) +
            0.45 * Math.sin(u * 6.3 - t * 0.17 * rb.speed + rb.phase * 1.7)
          const base = (rb.y + rb.amp * wave) * h
          const len = rb.h * h * (0.55 + 0.45 * Math.sin(u * 4.7 + t * 0.09 * rb.speed + rb.phase))
          const shimmer = 0.55 + 0.45 * Math.sin(u * 23 + t * 0.6 * rb.speed + rb.phase)
          ctx.globalAlpha = Math.max(0, rb.alpha * shimmer * edge)
          ctx.drawImage(strip, x, base - len, 1, len)
        }
      })
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    ro.observe(canvas)

    if (prefersReducedMotion() || !active) {
      draw(9000)
      return () => ro.disconnect()
    }

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < 33) return // ~30 fps is plenty for a slow sky
      last = now
      draw(now)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [active])

  return <canvas ref={ref} className={`ls-aurora ${className}`} aria-hidden="true" />
}
