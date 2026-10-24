import { useEffect, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { sfx } from '../sfx'
import type { Lecture, SectionId } from '../types'
import { useProgress } from '../useProgress'
import './LectureRail.css'

interface LectureRailProps {
  section: SectionId
  lectures: Lecture[]
  currentId: string
  /** What the section calls its lectures list, e.g. "The Lecture Stacks". */
  title: string
  /** Label for one lecture's number, e.g. (i) => `Vol. ${roman(i + 1)}`. */
  label: (index: number) => string
  className?: string
}

/**
 * Every lecture of the section beside the one being watched: a sticky column on
 * wide screens, a swipeable strip on narrow ones. Themed per section with --rail-*.
 */
export function LectureRail({ section, lectures, currentId, title, label, className = '' }: LectureRailProps) {
  const progress = useProgress()
  const listRef = useRef<HTMLOListElement>(null)

  // Keep the current lecture in view inside the rail (not the page).
  useEffect(() => {
    const list = listRef.current
    const item = list?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!list || !item) return
    const horizontal = list.scrollWidth > list.clientWidth + 4
    if (horizontal) list.scrollLeft = item.offsetLeft - list.offsetLeft - 16
    else list.scrollTop = item.offsetTop - list.offsetTop - list.clientHeight / 3
  }, [currentId])

  const done = lectures.filter((l) => progress.lecture(section, l.id)?.completedAt).length

  return (
    <nav className={`lecture-rail ${className}`} aria-label={`${title}: all lectures`}>
      <header className="lecture-rail__head">
        <p className="lecture-rail__title">{title}</p>
        <p className="lecture-rail__count">
          {done}/{lectures.length} watched
        </p>
        <span className="lecture-rail__meter" aria-hidden="true">
          <span style={{ width: `${(done / Math.max(1, lectures.length)) * 100}%` }} />
        </span>
      </header>
      <ol ref={listRef} className="lecture-rail__list">
        {lectures.map((l, i) => {
          const p = progress.lecture(section, l.id)
          const watched = p?.watched ?? 0
          const finished = Boolean(p?.completedAt)
          const current = l.id === currentId
          const status = finished ? 'Watched' : watched > 0 ? `${Math.round(watched * 100)}% watched` : `${l.minutes} min`
          return (
            <li key={l.id} style={{ '--rail-i': i } as CSSProperties}>
              <Link
                to={`/student/${section}/lecture/${l.id}`}
                className={`lecture-rail__item ${current ? 'is-current' : ''} ${finished ? 'is-done' : ''}`}
                aria-current={current ? 'page' : undefined}
                onClick={() => !current && sfx.page()}
              >
                <span className="lecture-rail__num" aria-hidden="true">
                  {finished ? '✓' : i + 1}
                </span>
                <span className="lecture-rail__text">
                  <span className="lecture-rail__label">{label(i)}</span>
                  <span className="lecture-rail__name">{l.title}</span>
                  <span className="lecture-rail__status">
                    {current ? 'Now watching' : status}
                    {!finished && watched > 0 && (
                      <span className="lecture-rail__bar" aria-hidden="true">
                        <span style={{ width: `${watched * 100}%` }} />
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
