import { useEffect, useRef } from 'react'
import { useActive, useReducedMotion } from '../hooks'
import type { Broadcast } from '../speech'

const BARS = 44
const CELL = 4 // LED cell height incl. 1px gap

/** Voice energy sits in the low-mid band: a soft bell across the bars. */
const envelope = Array.from({ length: BARS }, (_, i) => {
  const u = i / (BARS - 1)
  return 0.18 + 0.82 * Math.exp(-((u - 0.36) ** 2) / 0.07)
})

/**
 * The broadcast visualiser: a mirrored LED spectrum plus an oscilloscope
 * trace, drawn on a canvas. While a voice speaks it reacts to word-boundary
 * pulses from the engine; during reading time it breathes slowly; on standby
 * it hums a faint carrier. The loop stops off-screen, in hidden tabs and under
 * reduced motion (then it redraws a still frame whenever the broadcast changes).
 */
export function Waveform({ bc, className = '' }: { bc: Broadcast; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const active = useActive(ref)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w = 1
    let h = 1
    const heights = new Float32Array(BARS)
    const targets = new Float32Array(BARS)
    let smooth = 0
    let retarget = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number, still = false) => {
      const snap = bc.getSnapshot()
      const playing = snap.phase === 'playing'
      const reading = snap.phase === 'reading'
      const level = still ? (playing ? 0.62 : 0) : bc.level(now)
      smooth += (level - smooth) * (level > smooth ? 0.5 : 0.12)
      if (still) smooth = level

      // New random spectrum shape on a rhythm (or immediately for a still frame).
      if (still || now > retarget) {
        retarget = now + 70 + Math.random() * 60
        for (let i = 0; i < BARS; i++) targets[i] = envelope[i] * (0.35 + 0.65 * Math.random())
      }

      for (let i = 0; i < BARS; i++) {
        let target: number
        if (playing) target = targets[i] * smooth
        else if (reading) target = 0.07 + 0.06 * (0.5 + 0.5 * Math.sin(now / 520 - i * 0.32))
        else target = 0.025 + 0.02 * (0.5 + 0.5 * Math.sin(now / 900 + i * 0.7))
        heights[i] = still ? target : heights[i] + (target - heights[i]) * (target > heights[i] ? 0.55 : 0.16)
      }

      ctx.clearRect(0, 0, w, h)
      const mid = Math.round(h * 0.56)
      const pad = 14
      const slot = (w - pad * 2) / BARS
      const bw = Math.max(2, Math.floor(slot) - 2)
      const maxCells = Math.floor((mid - 14) / CELL)

      for (let i = 0; i < BARS; i++) {
        const x = Math.round(pad + i * slot)
        const cells = Math.max(1, Math.round(heights[i] * maxCells))
        for (let k = 0; k < cells; k++) {
          const t = k / maxCells
          ctx.fillStyle = t > 0.78 ? '#ff6fcf' : t > 0.52 ? '#7ff7ff' : '#6fe3cf'
          ctx.globalAlpha = 0.95
          ctx.fillRect(x, mid - (k + 1) * CELL, bw, CELL - 1)
          // reflection
          if (k < cells * 0.6) {
            ctx.globalAlpha = 0.22 * (1 - k / (cells * 0.6))
            ctx.fillRect(x, mid + 3 + k * CELL, bw, CELL - 1)
          }
        }
      }
      ctx.globalAlpha = 1

      // Oscilloscope trace riding over the spectrum.
      const amp = 2 + smooth * h * 0.26 + (reading ? 5 : 0)
      ctx.beginPath()
      for (let x = 0; x <= w; x += 3) {
        const u = x / w
        const edge = Math.sin(Math.PI * u)
        const y =
          mid -
          h * 0.18 +
          edge * amp * (Math.sin(u * 26 + now / 140) * 0.62 + Math.sin(u * 61 - now / 90) * 0.38 * (playing ? 1 : 0.3))
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(214, 255, 247, 0.55)'
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'
      ctx.stroke()

      // Baseline
      ctx.fillStyle = 'rgba(111, 227, 207, 0.35)'
      ctx.fillRect(pad, mid, w - pad * 2, 1)
    }

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now(), reduced || !active)
    })
    ro.observe(canvas)

    if (reduced || !active) {
      draw(performance.now(), true)
      const unsubscribe = bc.subscribe(() => draw(performance.now(), true))
      return () => {
        unsubscribe()
        ro.disconnect()
      }
    }

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < 24) return // ~40 fps
      last = now
      draw(now)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [bc, active, reduced])

  return <canvas ref={ref} className={`ls-wave ${className}`} aria-hidden="true" />
}
