import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PixelSprite } from '../../components/PixelSprite'
import { TEST_ICON, type Sprite } from '../../scene/sprites'
import { CATALOG } from '../catalog'
import { sfx } from '../sfx'
import type { SectionId } from '../types'
import { useProgress } from '../useProgress'
import './SectionGateway.css'

interface SectionGatewayProps {
  section: SectionId
  /** Section icon for the Lectures door. */
  icon: Sprite
  /** What the section calls its lectures, e.g. "books", "tapes", "letters". */
  lectureNoun?: string
  className?: string
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * The two doors on every section home: Lectures and Practice. A summary of where
 * the student is sits on each door; detailed progress lives in the profile.
 * Themed per section through --gw-* custom properties.
 */
export function SectionGateway({ section, icon, lectureNoun = 'lecture', className = '' }: SectionGatewayProps) {
  const progress = useProgress()
  const stats = progress.section(section)
  const { lectures, practiceSets } = CATALOG[section]
  const full = practiceSets.filter((p) => p.format === 'full').length
  const focused = practiceSets.length - full
  const next = stats.nextLecture
  const nextWatched = next ? (progress.lecture(section, next.id)?.watched ?? 0) : 0
  const bests = Object.values(stats.best)
  const avg = bests.length ? bests.reduce((s, a) => s + a.score / a.total, 0) / bests.length : null

  const lectureLine = !next
    ? `All ${plural(lectures.length, lectureNoun)} watched — revisit any time.`
    : nextWatched > 0
      ? `Continue “${next.title}” · ${Math.round(nextWatched * 100)}% watched`
      : stats.lecturesCompleted
        ? `Next up: “${next.title}”`
        : `Start with “${next.title}”`

  const practiceLine = stats.practiceAttempted
    ? `${stats.practiceAttempted} of ${practiceSets.length} tried${avg !== null ? ` · ${Math.round(avg * 100)}% average best` : ''}`
    : 'No tests tried yet — your first score starts the record.'

  return (
    <nav className={`gateway ${className}`} aria-label={`${section} lectures and practice`}>
      <Link to={`/student/${section}/lectures`} className="gateway__door" onClick={() => sfx.click()} style={{ '--gw-i': 0 } as CSSProperties}>
        <span className="gateway__icon" aria-hidden="true">
          <PixelSprite sprite={icon} scale={3} />
        </span>
        <span className="gateway__body">
          <span className="gateway__kicker">LECTURES</span>
          <span className="gateway__title">{plural(lectures.length, 'video lesson')}</span>
          <span className="gateway__meter" aria-hidden="true">
            <span style={{ width: `${(stats.lecturesCompleted / Math.max(1, stats.lecturesTotal)) * 100}%` }} />
          </span>
          <span className="gateway__line">
            {stats.lecturesCompleted}/{stats.lecturesTotal} watched · {lectureLine}
          </span>
        </span>
        <span className="gateway__go" aria-hidden="true">
          →
        </span>
      </Link>

      <Link to={`/student/${section}/practice`} className="gateway__door" onClick={() => sfx.click()} style={{ '--gw-i': 1 } as CSSProperties}>
        <span className="gateway__icon" aria-hidden="true">
          <PixelSprite sprite={TEST_ICON} scale={4} />
        </span>
        <span className="gateway__body">
          <span className="gateway__kicker">PRACTICE</span>
          <span className="gateway__title">{plural(practiceSets.length, 'test')}</span>
          <span className="gateway__tags">
            <span>{plural(full, 'full test')}</span>
            <span>{focused} by question type</span>
          </span>
          <span className="gateway__line">{practiceLine}</span>
        </span>
        <span className="gateway__go" aria-hidden="true">
          →
        </span>
      </Link>

      <Link to="/student/profile" className="gateway__profile">
        Your scores, streak and full progress live in your profile →
      </Link>
    </nav>
  )
}
