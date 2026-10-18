import { useEffect, useRef } from 'react'

interface Mote {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  phase: number
  speed: number
  warm: boolean
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * Pixel dust drifting through a moonbeam. Drawn on a canvas that is clipped to
 * the beam by CSS; the loop pauses when the canvas is off-screen or the tab is
 * hidden, and draws a single still frame under reduced motion.
 */
export function DustMotes({ className = '', density = 1 }: { className?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let motes: Mote[] = []
    let raf = 0
    let visible = true
    let last = performance.now()

    const seed = () => {
      const count = Math.min(120, Math.round(((width * height) / 5200) * density))
      motes = Array.from({ length: count }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        size: Math.random() < 0.18 ? 3 : Math.random() < 0.55 ? 2 : 1,
        vx: rand(-4, 4),
        vy: rand(-3, 5),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.4, 1.3),
        warm: Math.random() < 0.3,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      draw(0, performance.now())
    }

    const draw = (dt: number, now: number) => {
      ctx.clearRect(0, 0, width, height)
      const t = now / 1000
      for (const m of motes) {
        m.x += (m.vx + Math.sin(t * 0.35 * m.speed + m.phase) * 5) * dt
        m.y += (m.vy + Math.cos(t * 0.27 * m.speed + m.phase) * 3) * dt
        if (m.x < -4) m.x = width + 4
        if (m.x > width + 4) m.x = -4
        if (m.y < -4) m.y = height + 4
        if (m.y > height + 4) m.y = -4
        // Brighter towards the window (top-right), like a real shaft of light.
        const nearWindow = 0.45 + 0.55 * Math.min(1, (m.x / width) * 0.6 + (1 - m.y / height) * 0.6)
        const twinkle = 0.55 + 0.45 * Math.sin(t * 1.6 * m.speed + m.phase)
        const alpha = Math.max(0, Math.min(1, nearWindow * twinkle))
        ctx.fillStyle = m.warm ? `rgba(255, 226, 160, ${alpha})` : `rgba(226, 236, 255, ${alpha})`
        ctx.fillRect(Math.round(m.x), Math.round(m.y), m.size, m.size)
        if (m.size === 3) {
          ctx.fillStyle = m.warm ? `rgba(255, 226, 160, ${alpha * 0.25})` : `rgba(226, 236, 255, ${alpha * 0.25})`
          ctx.fillRect(Math.round(m.x) - 2, Math.round(m.y) + 1, 7, 1)
          ctx.fillRect(Math.round(m.x) + 1, Math.round(m.y) - 2, 1, 7)
        }
      }
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      draw(dt, now)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (reduced || raf || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting)
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density])

  return <canvas ref={canvasRef} className={`rd-dust ${className}`} aria-hidden="true" />
}
