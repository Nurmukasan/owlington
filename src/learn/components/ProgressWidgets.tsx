import type { CSSProperties, ReactNode } from 'react'
import { PixelSprite } from '../../components/PixelSprite'
import {
  BOOK_ICON,
  FLAME_ICON,
  HEADPHONES_ICON,
  OWL_HEAD,
  PENCIL_ICON,
  STAR_ICON,
  TROPHY_ICON,
  type Sprite,
} from '../../scene/sprites'
import type { AchievementIcon, LevelInfo, StreakInfo } from '../progress'

// ------------------------------------------------------------------ ring ---

interface ProgressRingProps {
  /** 0..1 */
  value: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  /** Break the ring into blocky segments for a pixel look. */
  segments?: number
  label: string
  children?: ReactNode
  className?: string
}

/** An animated circular progress ring with content in the middle. */
export function ProgressRing({
  value,
  size = 88,
  stroke = 8,
  color = 'var(--amber)',
  track = 'rgb(255 255 255 / 0.12)',
  segments,
  label,
  children,
  className = '',
}: ProgressRingProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  const dash = segments ? `${c / segments - 3} 3` : undefined

  return (
    <div
      className={`progress-ring ${className}`}
      style={{ width: size, height: size } as CSSProperties}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} strokeDasharray={dash} />
        <circle
          className="progress-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - v)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {segments && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--progress-ring-gap, #0b0d2a)"
            strokeWidth={stroke + 2}
            strokeDasharray={`3 ${c / segments - 3}`}
            strokeDashoffset={-(c / segments - 3)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </svg>
      <div className="progress-ring__content">{children}</div>
    </div>
  )
}

// --------------------------------------------------------------- xp bar ---

/** Level badge + title + XP bar towards the next level. */
export function XpBar({ level, xp, className = '' }: { level: LevelInfo; xp: number; className?: string }) {
  return (
    <div className={`xp-bar ${className}`}>
      <span className="xp-bar__level" aria-hidden="true">
        LV {level.level}
      </span>
      <div className="xp-bar__body">
        <p className="xp-bar__title">
          {level.title}
          <span>
            {xp - level.floor} / {level.next - level.floor} XP
          </span>
        </p>
        <div
          className="xp-bar__track"
          role="progressbar"
          aria-label={`Level ${level.level}, ${level.title}: ${xp - level.floor} of ${level.next - level.floor} XP to ${level.nextTitle}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(level.progress * 100)}
        >
          <div className="xp-bar__fill" style={{ width: `${level.progress * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

// --------------------------------------------------------------- streak ---

/** Pixel flame with the streak count; dim until the student studies today. */
export function StreakFlame({ streak, scale = 3, className = '' }: { streak: StreakInfo; scale?: number; className?: string }) {
  const label = streak.days
    ? `${streak.days}-day streak${streak.activeToday ? '' : ' — study today to keep it'}`
    : 'No streak yet — study today to start one'
  return (
    <span className={`streak-flame ${streak.activeToday ? 'is-lit' : ''} ${className}`} title={label}>
      <PixelSprite sprite={FLAME_ICON} scale={scale} className="streak-flame__icon" />
      <span className="streak-flame__count">{streak.days}</span>
      <span className="visually-hidden">{label}</span>
    </span>
  )
}

// ---------------------------------------------------------- achievements ---

const ACHIEVEMENT_SPRITES: Record<AchievementIcon, Sprite> = {
  star: { ...STAR_ICON, palette: { o: '#ffcf5c' } },
  flame: FLAME_ICON,
  trophy: TROPHY_ICON,
  book: BOOK_ICON,
  headphones: HEADPHONES_ICON,
  pencil: PENCIL_ICON,
  owl: OWL_HEAD,
}

export function AchievementBadge({
  icon,
  unlocked,
  scale = 3,
  className = '',
}: {
  icon: AchievementIcon
  unlocked: boolean
  scale?: number
  className?: string
}) {
  return (
    <span className={`achievement-badge ${unlocked ? 'is-unlocked' : 'is-locked'} ${className}`} aria-hidden="true">
      <PixelSprite sprite={ACHIEVEMENT_SPRITES[icon]} scale={scale} />
    </span>
  )
}
