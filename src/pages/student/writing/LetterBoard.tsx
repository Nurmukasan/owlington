import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { LectureProgress } from '../../../learn/progress'
import type { Lecture } from '../../../learn/types'
import { WaxSeal } from './art'
import { useRevealed, useSwipeRow } from './hooks'
import { SwipePager } from './SwipePager'

interface LetterBoardProps {
  lectures: Lecture[]
  progressFor: (id: string) => LectureProgress | undefined
  nextId?: string
}

const TILTS = [-2.5, 1.8, -1.2, 2.6, 1.4, -2.2, 2.1, -1.6]
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

/** Lectures as sealed letters pinned to a corkboard. The letter slides out as you watch. */
export function LetterBoard({ lectures, progressFor, nextId }: LetterBoardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const revealed = useRevealed(ref)
  const listRef = useRef<HTMLOListElement>(null)
  const row = useSwipeRow(listRef)
  const done = lectures.filter((l) => progressFor(l.id)?.completedAt).length

  return (
    <section className="wr-section wr-letters" aria-labelledby="wr-letters-title">
      <div className="wr-section-head">
        <p className="wr-eyebrow">Lectures · {lectures.length} letters</p>
        <h2 id="wr-letters-title">
          Letters from <em>the Professor</em>
        </h2>
        <p>
          Each lecture arrives as a sealed letter. Watch it and the letter slides out of its envelope; finish it and it earns
          the owl’s wax seal.{' '}
          <strong className="wr-letters__count">
            {done} of {lectures.length} sealed.
          </strong>
        </p>
      </div>

      <div ref={ref} className={`wr-cork ${revealed ? 'is-in' : ''}`}>
        <ol ref={listRef} className={`wr-cork__grid ${row.scrollable && !row.atEnd ? 'has-more' : ''}`}>
          {lectures.map((lecture, i) => {
            const p = progressFor(lecture.id)
            const watched = p?.watched ?? 0
            const complete = Boolean(p?.completedAt)
            const state = complete ? 'done' : watched > 0.01 ? 'open' : 'sealed'
            const pct = Math.round(watched * 100)
            const status = complete ? 'Read — sealed' : watched > 0.01 ? `${pct}% read` : 'Unopened'
            return (
              <li
                key={lecture.id}
                className={`wr-letter wr-letter--${state} ${lecture.id === nextId ? 'is-next' : ''}`}
                style={{ '--wr-tilt': `${TILTS[i % TILTS.length]}deg`, '--wr-out': complete ? 1 : watched, '--wr-i': i } as CSSProperties}
              >
                <Link
                  to={`lecture/${lecture.id}`}
                  className="wr-letter__link"
                  aria-label={`Letter ${i + 1}: ${lecture.title}. ${lecture.level}, ${lecture.minutes} minutes. ${status}.`}
                >
                  <span className="wr-letter__pin" aria-hidden="true" />
                  <span className="wr-letter__body" aria-hidden="true">
                    <span className="wr-letter__flap-back" />
                    <span className="wr-letter__paper">
                      <span className="wr-letter__salute wr-hand">My dear student,</span>
                      {lecture.chapters.slice(0, 3).map((c) => (
                        <span key={c.title} className="wr-letter__line">
                          {c.title}
                        </span>
                      ))}
                    </span>
                    <span className="wr-letter__pocket">
                      <span className="wr-letter__flap" />
                      <span className="wr-letter__num">No. {ROMAN[i] ?? i + 1}</span>
                      {/* A postage stamp whose denomination is the level: LV I, II or III. */}
                      <span className="wr-letter__stamp">
                        <span>{lecture.level === 'Foundation' ? 'I' : lecture.level === 'Intermediate' ? 'II' : 'III'}</span>
                        <small>LV</small>
                      </span>
                      <span className="wr-letter__postmark">{lecture.minutes} MIN</span>
                      <span className="wr-letter__title wr-hand">{lecture.title}</span>
                    </span>
                    {complete && <WaxSeal size={56} className="wr-letter__seal" />}
                    {lecture.id === nextId && !complete && <span className="wr-letter__ribbon">UP NEXT</span>}
                  </span>
                  <span className="wr-letter__status" aria-hidden="true">
                    <span className="wr-letter__bar">
                      <span style={{ transform: `scaleX(${complete ? 1 : watched})` }} />
                    </span>
                    {status}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
      <SwipePager row={row} noun="letter" />
    </section>
  )
}
