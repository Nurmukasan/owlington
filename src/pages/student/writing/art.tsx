/*
 * Hand-drawn SVG props for the Inkwell Study: wax seal, quill, lantern,
 * inkwell, paper plane, envelope and the process-diagram icons.
 * All decorative (aria-hidden) unless a title is passed.
 */
import { useId } from 'react'
import { PixelSprite } from '../../../components/PixelSprite'
import type { Sprite } from '../../../scene/sprites'

// -------------------------------------------------------------- wax seal ---

const SEAL_PATH = (() => {
  const pts: string[] = []
  const n = 28
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = 46 + Math.sin(i * 2.7) * 2.2 + Math.cos(i * 1.3) * 1.6
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`)
  }
  return `M${pts.join(' L')} Z`
})()

const OWL_SIGIL =
  'M33 42 L36 27 L44 35 Q50 32 56 35 L64 27 L67 42 Q71 60 60 69 Q50 76 40 69 Q29 60 33 42 Z'

/** A red wax seal pressed with the Owlington owl sigil. */
export function WaxSeal({ size = 64, className = '', label }: { size?: number; className?: string; label?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className={`wr-seal ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#e2525a" />
          <stop offset="0.55" stopColor="#b3262e" />
          <stop offset="1" stopColor="#7a161d" />
        </radialGradient>
      </defs>
      <path d={SEAL_PATH} fill={`url(#${id}-wax)`} />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#7a161d" strokeWidth="3" opacity="0.7" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#f08a8f" strokeWidth="1" opacity="0.35" transform="translate(1 1)" />
      <g transform="translate(1.2 1.2)" opacity="0.45">
        <path d={OWL_SIGIL} fill="#f58f95" />
      </g>
      <path d={OWL_SIGIL} fill="#86171f" />
      <circle cx="43" cy="47" r="6" fill="#c63a42" />
      <circle cx="57" cy="47" r="6" fill="#c63a42" />
      <circle cx="43" cy="47" r="2.6" fill="#6a1016" />
      <circle cx="57" cy="47" r="2.6" fill="#6a1016" />
      <path d="M47.5 54 L52.5 54 L50 59 Z" fill="#e0a13a" opacity="0.85" />
      <path d="M22 30 Q30 18 44 16" fill="none" stroke="#ffb3b6" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
    </svg>
  )
}

// ----------------------------------------------------------------- quill ---

/** A goose-feather quill. The nib tip is the bottom-left corner of the box. */
export function Quill({ width = 60, className = '' }: { width?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`wr-quill-svg ${className}`} width={width} height={(width * 220) / 80} viewBox="0 0 80 220" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-vane`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#efe3cb" />
          <stop offset="0.6" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#ffd9cf" />
        </linearGradient>
      </defs>
      <path
        d="M17 172 C6 134 24 66 74 4 C74 48 60 104 31 170 L27 160 L24 166 L22 156 Z"
        fill={`url(#${id}-vane)`}
        stroke="#c9b48c"
        strokeWidth="1.2"
      />
      <path d="M36 120 L52 104 M32 134 L49 122 M41 96 L58 80 M48 72 L64 54 M56 50 L69 32" stroke="#d6c39f" strokeWidth="1.2" />
      <path d="M45 98 L37 92 M40 116 L30 112 M52 76 L44 70" stroke="#d6c39f" strokeWidth="1.2" />
      <path d="M4 216 Q26 150 74 6" fill="none" stroke="#8a7553" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M2 218 L8 194 L15 198 Z" fill="#1b2a4a" />
      <path d="M8 194 L15 198 L18 188 L11 186 Z" fill="#c9a24a" />
    </svg>
  )
}

// --------------------------------------------------------------- lantern ---

export function Lantern({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`wr-lantern-svg ${className}`} viewBox="0 0 80 150" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glass`} cx="50%" cy="62%" r="60%">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#ffc35c" stopOpacity="0.75" />
          <stop offset="1" stopColor="#c46a1a" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id={`${id}-brass`} x1="0" x2="1">
          <stop offset="0" stopColor="#8a6424" />
          <stop offset="0.45" stopColor="#f0cf7a" />
          <stop offset="1" stopColor="#8a6424" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="10" r="7" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="3.5" />
      <path d="M22 30 L58 30 L50 17 L30 17 Z" fill={`url(#${id}-brass)`} />
      <rect x="18" y="29" width="44" height="6" rx="2" fill="#6e4d1a" />
      <rect x="20" y="35" width="40" height="80" rx="5" fill={`url(#${id}-glass)`} />
      <g className="wr-lantern-flame">
        <path d="M40 66 C46 76 50 84 46 92 C44 97 36 97 34 92 C30 84 34 76 40 66 Z" fill="#ffb627" />
        <path d="M40 76 C43 82 45 87 43 91 C42 94 38 94 37 91 C35 87 37 82 40 76 Z" fill="#fff4c9" />
      </g>
      <rect x="37" y="96" width="6" height="12" rx="1" fill="#f4ead6" />
      <path d="M20 35 V115 M60 35 V115 M40 35 V60" stroke={`url(#${id}-brass)`} strokeWidth="3.5" />
      <path d="M24 50 H56" stroke="#8a6424" strokeWidth="1.5" opacity="0.6" />
      <rect x="14" y="114" width="52" height="8" rx="2" fill={`url(#${id}-brass)`} />
      <path d="M10 122 L70 122 L64 134 L16 134 Z" fill="#6e4d1a" />
      <rect x="8" y="133" width="64" height="7" rx="2" fill={`url(#${id}-brass)`} />
      <path d="M26 40 Q24 70 27 108" stroke="#fffbe8" strokeWidth="2.5" fill="none" opacity="0.45" strokeLinecap="round" />
    </svg>
  )
}

// --------------------------------------------------------------- inkwell ---

export function Inkwell({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`wr-inkwell-svg ${className}`} viewBox="0 0 80 70" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#3b4d7a" />
          <stop offset="0.4" stopColor="#1b2a4a" />
          <stop offset="1" stopColor="#0b1226" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="64" rx="34" ry="5" fill="#000" opacity="0.35" />
      <path d="M8 34 Q8 22 22 20 L58 20 Q72 22 72 34 L72 56 Q72 64 62 64 L18 64 Q8 64 8 56 Z" fill={`url(#${id}-glass)`} />
      <path d="M12 40 L68 40 L68 56 Q68 60 62 60 L18 60 Q12 60 12 56 Z" fill="#0a1020" opacity="0.8" />
      <rect x="28" y="8" width="24" height="14" rx="3" fill="#24365e" />
      <rect x="26" y="6" width="28" height="5" rx="2" fill="#c9a24a" />
      <ellipse className="wr-inkwell-ripple" cx="40" cy="9" rx="8" ry="1.6" fill="none" stroke="#7d90c4" strokeWidth="1" />
      <path d="M15 30 Q16 24 22 24" stroke="#9fb2e0" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round" />
      <rect x="24" y="44" width="32" height="10" rx="1.5" fill="#f4ead6" opacity="0.9" />
      <path d="M28 49 H52" stroke="#b4442f" strokeWidth="1.5" />
    </svg>
  )
}

// ----------------------------------------------------------- paper plane ---

export function PaperPlane({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 40" aria-hidden="true">
      <path d="M2 20 L58 2 L26 26 Z" fill="#fbf4e4" />
      <path d="M26 26 L58 2 L34 38 Z" fill="#d9c9a6" />
      <path d="M26 26 L30 34 L34 38 Z" fill="#b6a37e" />
    </svg>
  )
}

export function FlyingLetter({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" aria-hidden="true">
      <rect x="1" y="1" width="46" height="30" rx="2" fill="#f4ead6" />
      <path d="M1 3 L24 19 L47 3" fill="none" stroke="#c9b48c" strokeWidth="2" />
      <circle cx="24" cy="19" r="4.5" fill="#b3262e" />
    </svg>
  )
}

// ------------------------------------------------------- professor's cap ---

const MORTARBOARD: Sprite = {
  rows: [
    '......kk......',
    '...kkkkkkkk...',
    'kkkkkkhkkkkkkk',
    '...kkkkkkkk.y.',
    '....kkkkkk..y.',
    '....kkkkkk..yy',
  ],
  palette: { k: '#151a2e', h: '#3b4670', y: '#e0b84f' },
}

export function ProfessorCap({ scale = 4, className = '' }: { scale?: number; className?: string }) {
  return <PixelSprite sprite={MORTARBOARD} scale={scale} className={className} />
}

// --------------------------------------------------------- process icons ---

export type ProcessIconName = 'bike' | 'mix' | 'heat' | 'spawn' | 'box' | 'dark' | 'spray' | 'harvest'

const INK = '#1b2a4a'
const BROWN = '#7a5234'
const CREAM = '#fbf4e4'
const CORAL = '#d95926'
const TEAL = '#199e70'
const BLUE = '#2a78d6'

/** Small flat illustrations for the coffee-kit process diagram. */
export function ProcessIcon({ name, size = 56 }: { name: ProcessIconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="wr-process-icon">
      {name === 'bike' && (
        <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="18" width="22" height="16" rx="2" fill={BROWN} stroke={INK} />
          <path d="M10 24 h14" stroke={CREAM} strokeWidth="2" />
          <circle cx="14" cy="46" r="8" />
          <circle cx="50" cy="46" r="8" />
          <path d="M14 46 L28 34 L40 46 L50 46 M28 34 L44 34 L50 46 M40 26 L46 26 M44 26 L44 34" />
          <path d="M33 24 l4 -6" stroke={TEAL} />
          <path d="M37 18 l3 3" stroke={TEAL} />
        </g>
      )}
      {name === 'mix' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 30 H56 Q54 52 32 54 Q10 52 8 30 Z" fill={CREAM} stroke={INK} strokeWidth="3" />
          <path d="M12 32 H52 Q50 40 46 44 H18 Q14 40 12 32 Z" fill={BROWN} />
          <path d="M16 34 l6 4 M26 33 l5 5 M38 33 l4 4 M44 35 l5 2" stroke="#e8c45a" strokeWidth="2.5" />
          <path d="M40 10 L30 36" stroke={INK} strokeWidth="4" />
          <ellipse cx="29" cy="38" rx="5" ry="3" fill={INK} />
        </g>
      )}
      {name === 'heat' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <rect x="22" y="6" width="12" height="38" rx="6" fill={CREAM} stroke={INK} strokeWidth="3" />
          <circle cx="28" cy="48" r="9" fill={CORAL} stroke={INK} strokeWidth="3" />
          <rect x="25.5" y="18" width="5" height="28" fill={CORAL} />
          <path d="M38 14 h6 M38 22 h4 M38 30 h6" stroke={INK} strokeWidth="2.5" />
          <path d="M50 56 C42 50 44 42 50 36 C52 42 58 44 56 50 C55 54 53 56 50 56 Z" fill="#ffb627" stroke={INK} strokeWidth="2" />
        </g>
      )}
      {name === 'spawn' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <rect x="16" y="16" width="32" height="40" rx="6" fill={CREAM} stroke={INK} strokeWidth="3" />
          <rect x="20" y="8" width="24" height="9" rx="2" fill={INK} />
          {[
            [24, 28],
            [32, 34],
            [40, 26],
            [26, 44],
            [38, 46],
            [33, 24],
            [28, 36],
            [42, 38],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill={TEAL} />
          ))}
        </g>
      )}
      {name === 'box' && (
        <g strokeLinecap="round" strokeLinejoin="round" stroke={INK} strokeWidth="3">
          <path d="M8 24 L32 14 L56 24 L32 34 Z" fill="#e2c08a" />
          <path d="M8 24 V48 L32 58 V34 Z" fill="#c99a5b" />
          <path d="M56 24 V48 L32 58 V34 Z" fill="#b5844a" />
          <path d="M38 44 l6 -3 l2 4 l-6 3 z" fill={TEAL} stroke="none" />
          <path d="M18 34 l6 3" stroke={CREAM} strokeWidth="2" />
        </g>
      )}
      {name === 'dark' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="6" width="56" height="52" rx="4" fill={INK} />
          <path d="M40 14 A10 10 0 1 0 50 26 A8 8 0 1 1 40 14 Z" fill="#fff1c9" />
          <rect x="10" y="38" width="16" height="14" fill="#c99a5b" />
          <rect x="28" y="38" width="16" height="14" fill="#b5844a" />
          <path d="M12 38 q4 -4 8 0 M30 38 q4 -4 8 0" stroke={CREAM} strokeWidth="2" fill="none" />
          <text x="12" y="27" fill={CREAM} fontSize="10" fontFamily="var(--font-pixel)">22°</text>
        </g>
      )}
      {name === 'spray' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 26 H34 V56 Q34 60 30 60 H22 Q18 60 18 56 Z" fill={BLUE} stroke={INK} strokeWidth="3" />
          <path d="M20 14 H34 V26 H20 Z" fill={CREAM} stroke={INK} strokeWidth="3" />
          <path d="M34 16 H40 V20 H34" fill={INK} stroke={INK} strokeWidth="2" />
          <path d="M22 26 L16 34" stroke={INK} strokeWidth="3" />
          {[
            [48, 12],
            [52, 20],
            [46, 22],
            [54, 28],
            [48, 30],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={BLUE} />
          ))}
        </g>
      )}
      {name === 'harvest' && (
        <g strokeLinecap="round" strokeLinejoin="round" stroke={INK} strokeWidth="3">
          <path d="M6 54 Q32 44 58 54 V60 H6 Z" fill="#6b4a2c" />
          <path d="M20 50 V34" />
          <path d="M8 34 Q8 20 20 20 Q32 20 32 34 Z" fill="#efe1c4" />
          <path d="M42 52 V38" />
          <path d="M32 38 Q32 26 42 26 Q52 26 52 38 Z" fill="#e8d4ae" />
          <path d="M44 12 a6 6 0 1 1 8 8" stroke={TEAL} fill="none" />
          <path d="M52 20 l1 -6 l-6 1" stroke={TEAL} fill="none" />
        </g>
      )}
    </svg>
  )
}
