import { useId, type CSSProperties } from 'react'
import type { Level } from '../../../../learn/types'
import { tapeShell } from '../stations'

interface CassetteProps {
  /** Position in the course; picks the shell colour and the tape number. */
  index: number
  title: string
  minutes: number
  level: Level
  /** 0..1 — how much tape has wound onto the right reel. */
  watched: number
  completed: boolean
  className?: string
}

const R_FULL = 31
const R_HUB = 10.5
const LEFT = { x: 112, y: 78 }
const RIGHT = { x: 188, y: 78 }

/** Pack radius when a share of the tape is on this reel (the tape's area is conserved). */
const packRadius = (share: number) => Math.sqrt(R_HUB * R_HUB + (R_FULL * R_FULL - R_HUB * R_HUB) * Math.max(0, Math.min(1, share)))

function Hub({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="ls-cassette__hub">
      <circle cx={cx} cy={cy} r={8.6} className="ls-cassette__hub-ring" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect key={a} x={cx - 1.3} y={cy - 7.6} width={2.6} height={3.6} className="ls-cassette__tooth" transform={`rotate(${a} ${cx} ${cy})`} />
      ))}
    </g>
  )
}

/** An SVG cassette whose reels show lecture progress: the left pack empties as the right one fills. */
/* The reels spin from CSS: on hover / focus in the rack, and while the lecture player is playing. */
export function Cassette({ index, title, minutes, level, watched, completed, className = '' }: CassetteProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const shell = tapeShell(index)
  const f = completed ? 1 : watched
  const rLeft = packRadius(1 - f)
  const rRight = packRadius(f)
  const number = String(index + 1).padStart(2, '0')

  return (
    <span
      className={`ls-cassette ${completed ? 'is-recorded' : ''} ${className}`}
      style={{ '--ls-shell': shell.shell, '--ls-shade': shell.shade, '--ls-paper': shell.label } as CSSProperties}
    >
      <svg className="ls-cassette__svg" viewBox="0 0 300 190" aria-hidden="true">
        <defs>
          <clipPath id={`${uid}-win`}>
            <rect x={72} y={57} width={156} height={42} rx={9} />
          </clipPath>
          <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x={2} y={2} width={296} height={186} rx={13} className="ls-cassette__shell" />
        <rect x={2} y={2} width={296} height={186} rx={13} fill={`url(#${uid}-gloss)`} />
        <rect x={7} y={7} width={286} height={176} rx={10} className="ls-cassette__bevel" />

        {[
          [15, 15],
          [285, 15],
          [15, 175],
          [285, 175],
          [150, 176],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`} className="ls-cassette__screw">
            <circle cx={x} cy={y} r={5} />
            <path d={`M${x - 3} ${y}h6M${x} ${y - 3}v6`} />
          </g>
        ))}

        <rect x={16} y={12} width={268} height={122} rx={6} className="ls-cassette__paper" />
        <rect x={16} y={52} width={268} height={52} className="ls-cassette__band" />
        {[30, 40].map((y) => (
          <line key={y} x1={24} x2={276} y1={y + 6} y2={y + 6} className="ls-cassette__rule" />
        ))}

        <rect x={72} y={57} width={156} height={42} rx={9} className="ls-cassette__window" />
        <g clipPath={`url(#${uid}-win)`}>
          <circle cx={LEFT.x} cy={LEFT.y} r={rLeft} className="ls-cassette__pack" />
          <circle cx={RIGHT.x} cy={RIGHT.y} r={rRight} className="ls-cassette__pack" />
          <circle cx={LEFT.x} cy={LEFT.y} r={rLeft - 1.5} className="ls-cassette__pack-sheen" />
          <circle cx={RIGHT.x} cy={RIGHT.y} r={rRight - 1.5} className="ls-cassette__pack-sheen" />
          <Hub cx={LEFT.x} cy={LEFT.y} />
          <Hub cx={RIGHT.x} cy={RIGHT.y} />
          <rect x={136} y={70} width={28} height={16} rx={2} className="ls-cassette__peek" />
        </g>
        <rect x={72} y={57} width={156} height={42} rx={9} className="ls-cassette__window-rim" />

        <path d="M58 188 L74 146 L226 146 L242 188 Z" className="ls-cassette__foot" />
        <circle cx={104} cy={168} r={6} className="ls-cassette__hole" />
        <circle cx={196} cy={168} r={6} className="ls-cassette__hole" />
        <rect x={136} y={160} width={28} height={14} rx={2} className="ls-cassette__hole" />
      </svg>

      <span className="ls-cassette__title">{title}</span>
      <span className="ls-cassette__side" aria-hidden="true">
        A
      </span>
      <span className="ls-cassette__len" aria-hidden="true">
        {minutes}
        <small>MIN</small>
      </span>
      <span className="ls-cassette__meta" aria-hidden="true">
        <span>TAPE {number}</span>
        <span>{level.toUpperCase()}</span>
      </span>
      {completed && (
        <span className="ls-cassette__stamp" aria-hidden="true">
          ✓ RECORDED
        </span>
      )}
    </span>
  )
}
