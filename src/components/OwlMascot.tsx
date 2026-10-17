import { useEffect, useRef, useState } from 'react'
import './OwlMascot.css'

const HOOTS = ['Hoo! Ready to study?', 'Whooo’s chasing Band 7?', 'Hoo-hoo! Read, listen, write!', 'Night owls study best.']

const EYES = [
  { cx: 95, cy: 118 },
  { cx: 165, cy: 118 },
]
const MAX_PUPIL_SHIFT = 8
const MAX_HEAD_TILT = 7

/**
 * The Owlington mascot. Its eyes follow the pointer, it blinks on its own and
 * hoots when you click it.
 */
export function OwlMascot({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const pupilRefs = useRef<(SVGGElement | null)[]>([])
  const [blinking, setBlinking] = useState(false)
  const [hoot, setHoot] = useState<{ text: string; id: number } | null>(null)

  // Follow the pointer with the eyes and a little head tilt.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const svg = svgRef.current
        if (!svg) return
        const box = svg.getBoundingClientRect()
        const scale = box.width / 260
        EYES.forEach((eye, i) => {
          const ex = box.left + eye.cx * scale
          const ey = box.top + eye.cy * scale
          const angle = Math.atan2(e.clientY - ey, e.clientX - ex)
          const dist = Math.min(1, Math.hypot(e.clientX - ex, e.clientY - ey) / 300)
          const dx = Math.cos(angle) * MAX_PUPIL_SHIFT * dist
          const dy = Math.sin(angle) * MAX_PUPIL_SHIFT * dist
          pupilRefs.current[i]?.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)
        })
        const rel = (e.clientX - (box.left + box.width / 2)) / window.innerWidth
        const tilt = Math.max(-1, Math.min(1, rel * 2)) * MAX_HEAD_TILT
        headRef.current?.style.setProperty('--tilt', `${tilt.toFixed(2)}deg`)
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  // Blink every few seconds, sometimes twice.
  useEffect(() => {
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          setBlinking(true)
          window.setTimeout(() => setBlinking(false), 140)
          if (Math.random() < 0.3) {
            window.setTimeout(() => setBlinking(true), 280)
            window.setTimeout(() => setBlinking(false), 400)
          }
          schedule()
        },
        2200 + Math.random() * 3200,
      )
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hoot) return
    const timer = window.setTimeout(() => setHoot(null), 1800)
    return () => window.clearTimeout(timer)
  }, [hoot])

  const onHoot = () =>
    setHoot((prev) => {
      const next = (HOOTS.indexOf(prev?.text ?? '') + 1) % HOOTS.length
      return { text: HOOTS[next], id: Date.now() }
    })

  return (
    <div className={`owl-mascot ${className}`}>
      {hoot && (
        <p key={hoot.id} className="owl-mascot__bubble" role="status">
          {hoot.text}
        </p>
      )}
      <button type="button" className="owl-mascot__button" onClick={onHoot} aria-label="Click the owl to hear it hoot">
        <svg
          ref={svgRef}
          viewBox="0 0 260 310"
          className={`owl-mascot__svg ${blinking ? 'is-blinking' : ''} ${hoot ? 'is-hooting' : ''}`}
          aria-hidden="true"
        >
          <defs>
            {EYES.map((eye, i) => (
              <clipPath key={i} id={`owl-eye-${i}`}>
                <circle cx={eye.cx} cy={eye.cy} r="27" />
              </clipPath>
            ))}
            <radialGradient id="owl-iris" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#ffe08a" />
              <stop offset="55%" stopColor="#ffb627" />
              <stop offset="100%" stopColor="#e07d00" />
            </radialGradient>
            <radialGradient id="owl-body" cx="62%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#9a6743" />
              <stop offset="100%" stopColor="#6c4329" />
            </radialGradient>
          </defs>

          {/* tail */}
          <path d="M112 270 L130 306 L148 270 Z" fill="#3f2618" />

          <g className="owl-mascot__body">
            <path
              d="M130 46 C186 46 214 84 214 134 C214 172 222 206 212 238 C200 276 168 292 130 292 C92 292 60 276 48 238 C38 206 46 172 46 134 C46 84 74 46 130 46 Z"
              fill="url(#owl-body)"
            />
            {/* wings */}
            <path d="M50 152 C28 192 32 252 76 284 C70 242 72 198 86 166 C76 152 62 148 50 152 Z" fill="#523220" />
            <path
              d="M210 152 C232 192 228 252 184 284 C190 242 188 198 174 166 C184 152 198 148 210 152 Z"
              fill="#523220"
            />
            <path
              d="M58 200 C56 226 62 248 74 264 M196 210 C198 232 194 250 186 264"
              stroke="#6b452d"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* belly */}
            <ellipse cx="130" cy="222" rx="54" ry="62" fill="#ecd0a2" />
            <g stroke="#b98b5c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M106 188 l8 7 l8 -7 M138 188 l8 7 l8 -7" />
              <path d="M92 210 l8 7 l8 -7 M122 210 l8 7 l8 -7 M152 210 l8 7 l8 -7" />
              <path d="M106 232 l8 7 l8 -7 M138 232 l8 7 l8 -7" />
              <path d="M98 254 l8 7 l8 -7 M122 256 l8 7 l8 -7 M146 254 l8 7 l8 -7" />
            </g>
            {/* feet */}
            <g fill="#e09a34">
              <rect x="98" y="282" width="8" height="16" rx="4" />
              <rect x="108" y="284" width="8" height="16" rx="4" />
              <rect x="118" y="282" width="8" height="16" rx="4" />
              <rect x="134" y="282" width="8" height="16" rx="4" />
              <rect x="144" y="284" width="8" height="16" rx="4" />
              <rect x="154" y="282" width="8" height="16" rx="4" />
            </g>
          </g>

          <g ref={headRef} className="owl-mascot__head">
            {/* ear tufts */}
            <path d="M60 96 L50 24 L108 60 Z" fill="#7f5236" />
            <path d="M200 96 L210 24 L152 60 Z" fill="#7f5236" />
            <path d="M66 82 L60 42 L94 62 Z" fill="#523220" />
            <path d="M194 82 L200 42 L166 62 Z" fill="#523220" />

            {/* brows */}
            <path
              d="M64 82 Q95 64 124 84 M136 84 Q165 64 196 82"
              stroke="#523220"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />

            {/* facial disc — the union of two circles */}
            <path
              d="M130 94.8 A42 42 0 1 0 130 141.2 A42 42 0 1 0 130 94.8 Z"
              fill="#f3e3c3"
              stroke="#5e3a24"
              strokeWidth="4"
            />

            {/* cheeks */}
            <circle cx="68" cy="152" r="10" fill="#ff8a7a" opacity="0.35" />
            <circle cx="192" cy="152" r="10" fill="#ff8a7a" opacity="0.35" />

            {EYES.map((eye, i) => (
              <g key={i}>
                <circle cx={eye.cx} cy={eye.cy} r="27" fill="url(#owl-iris)" stroke="#1e120c" strokeWidth="4" />
                <g
                  ref={(el) => {
                    pupilRefs.current[i] = el
                  }}
                  className="owl-mascot__pupil"
                >
                  <circle cx={eye.cx} cy={eye.cy} r="14" fill="#120c08" />
                  <circle cx={eye.cx - 6} cy={eye.cy - 7} r="5" fill="#fff" />
                  <circle cx={eye.cx + 6} cy={eye.cy + 6} r="2.4" fill="#fff" opacity="0.8" />
                </g>
                <g clipPath={`url(#owl-eye-${i})`}>
                  <rect
                    className="owl-mascot__lid"
                    x={eye.cx - 30}
                    y={eye.cy - 30}
                    width="60"
                    height="60"
                    fill="#7f5236"
                  />
                </g>
                {/* happy ^ eyes while hooting */}
                <path
                  className="owl-mascot__happy"
                  d={`M${eye.cx - 14} ${eye.cy + 6} Q${eye.cx} ${eye.cy - 14} ${eye.cx + 14} ${eye.cy + 6}`}
                  stroke="#1e120c"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ))}

            {/* beak */}
            <path d="M130 132 L144 148 L130 174 L116 148 Z" fill="#f08a24" />
            <path d="M130 132 L144 148 L130 154 Z" fill="#ffad55" />
            <path className="owl-mascot__mouth" d="M120 152 L140 152 L130 160 Z" fill="#7a2f0a" />
          </g>
        </svg>
      </button>
    </div>
  )
}
