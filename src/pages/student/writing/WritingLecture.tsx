import { useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LecturePlayer, type LecturePlayerHandle } from '../../../learn/components/LecturePlayer'
import { TalkingOwl } from '../../../learn/components/TalkingOwl'
import { findLecture } from '../../../learn/catalog'
import { XP_RULES } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import { useProgress } from '../../../learn/useProgress'
import { WaxSeal } from './art'
import { lectures, practiceSets } from './content'
import { prefersReducedMotion } from './hooks'
import './world.css'
import './lecture.css'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

/** The assignment that puts each letter into practice. */
const PRACTICE_FOR: Record<string, string> = {
  'essay-types': 't2-cooking-school',
  'thesis-paragraphs': 't2-cooking-school',
  'coherence-cohesion': 't2-language-abroad',
  'lexical-resource': 't2-outdoor-play',
  'grammar-range': 't2-language-abroad',
  'task1-overview': 't1-volunteering',
  'trends-comparisons': 't1-volunteering',
  'gt-letters': 'gt-festival-letter',
}

export default function WritingLecture() {
  const { lectureId } = useParams()
  const lecture = findLecture('writing', lectureId)
  if (!lecture) return <Navigate to="/student/writing" replace />
  return <LectureDesk key={lecture.id} lectureId={lecture.id} />
}

function LectureDesk({ lectureId }: { lectureId: string }) {
  const progress = useProgress()
  const index = lectures.findIndex((l) => l.id === lectureId)
  const lecture = lectures[index]
  const prev = lectures[index - 1]
  const next = lectures[index + 1]
  const saved = progress.lecture('writing', lecture.id)
  const watched = saved?.watched ?? 0
  const complete = Boolean(saved?.completedAt)
  const pct = complete ? 100 : Math.round(watched * 100)
  const playerRef = useRef<LecturePlayerHandle>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(-1)
  const [justSealed, setJustSealed] = useState(false)
  const practice = practiceSets.find((p) => p.id === PRACTICE_FOR[lecture.id]) ?? practiceSets[0]

  // The first unread letter after this one, wrapping round to the start of the board.
  const isRead = (id: string) => Boolean(progress.lecture('writing', id)?.completedAt)
  const after = [...lectures.slice(index + 1), ...lectures.slice(0, index)]
  const nextUnread = after.find((l) => !isRead(l.id))
  const nextIsAdjacent = nextUnread !== undefined && nextUnread.id === next?.id

  const seek = (i: number) => {
    sfx.page()
    playerRef.current?.seekToChapter(i)
    // On phones the notes sit below the player: bring the letter back into view.
    const sheet = sheetRef.current
    if (!sheet) return
    const r = sheet.getBoundingClientRect()
    const top = Number.parseFloat(getComputedStyle(sheet).scrollMarginTop) || 0
    if (r.top < top || r.bottom > window.innerHeight) {
      sheet.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }
  }

  return (
    <div className="wr-world wr-lec">
      <div className="wr-lec__inner">
        <nav className="wr-lec__crumbs" aria-label="Breadcrumb">
          <Link to="/student/writing" className="wr-backlink">
            <span aria-hidden="true">←</span> The Inkwell Study
          </Link>
          <span className="wr-lec__count">
            Letter No. {ROMAN[index]} <span aria-hidden="true">of</span>
            <span className="visually-hidden">of</span> {ROMAN[lectures.length - 1]}
          </span>
        </nav>

        <header className="wr-lec__head">
          <div className="wr-lec__meta">
            <p className="wr-eyebrow">Lecture</p>
            <ul className="wr-lec__chips" aria-label="Lecture details">
              <li className="wr-chip">{lecture.level}</li>
              <li className="wr-chip">{lecture.minutes} min video</li>
              <li className="wr-chip">{lecture.chapters.length} chapters</li>
              <li className="wr-chip wr-chip--xp">+{XP_RULES.lectureComplete} XP</li>
            </ul>
          </div>
          <h1 className="wr-lec__title wr-display">{lecture.title}</h1>
        </header>

        <div className="wr-lec__desk">
          <div ref={sheetRef} className="wr-lec__sheet">
            <span className="wr-lec__clip wr-lec__clip--l" aria-hidden="true" />
            <span className="wr-lec__clip wr-lec__clip--r" aria-hidden="true" />
            <LecturePlayer
              ref={playerRef}
              section="writing"
              lecture={lecture}
              className="wr-lp"
              onChapterChange={setChapter}
              onComplete={() => setJustSealed(true)}
            />
          </div>

          <aside className="wr-margin" aria-label="Your progress and the chapters">
            <div className="wr-margin__progress">
              <div
                className="wr-vial"
                role="progressbar"
                aria-label="Progress through this lecture"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                style={{ '--wr-v': complete ? 1 : watched } as CSSProperties}
              >
                <span className="wr-vial__neck" />
                <span className="wr-vial__glass">
                  <span className="wr-vial__ink" />
                </span>
              </div>
              <div>
                <p className="wr-lec__pct">{complete ? 'Sealed' : `${pct}%`}</p>
                <p className="wr-lec__pct-label">{complete ? 'letter complete' : watched > 0 ? 'read so far' : 'not opened yet'}</p>
              </div>
              {complete && <WaxSeal size={52} className="wr-lec__headseal" label="Completed: sealed with the owl seal" />}
            </div>

            <h2 className="wr-margin__head wr-hand">Margin notes</h2>
            <ol className="wr-margin__list">
              {lecture.chapters.map((c, i) => {
                const state = chapter === i ? 'is-now' : complete || chapter > i ? 'is-done' : ''
                return (
                  <li key={c.title} className={state}>
                    <button
                      type="button"
                      className="wr-margin__item"
                      onClick={() => seek(i)}
                      aria-current={chapter === i ? 'step' : undefined}
                      aria-label={`Chapter ${i + 1}: ${c.title}. ${c.points.length} points.${chapter === i ? ' Now playing.' : ''}`}
                    >
                      <span className="wr-margin__num" aria-hidden="true">
                        {state === 'is-done' ? '✓' : i + 1}
                      </span>
                      <span className="wr-margin__title wr-hand">{c.title}</span>
                      <span className="wr-margin__meta">{c.points.length} points</span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="wr-margin__brief">
              <h2 className="wr-margin__brief-title">In brief</h2>
              <p>{lecture.summary}</p>
            </div>
            <p className="wr-margin__tip">
              Tip: press <kbd>Space</kbd> to play or pause, <kbd>←</kbd> <kbd>→</kbd> to step through points.
            </p>
          </aside>
        </div>

        {(complete || justSealed) && (
          <section className={`wr-nextup ${justSealed ? 'is-fresh' : ''}`} aria-labelledby="wr-nextup-title">
            <div className="wr-nextup__envelope" aria-hidden="true">
              <span className="wr-nextup__flap" />
              <WaxSeal size={70} className="wr-nextup__seal" />
            </div>
            <div className="wr-nextup__copy">
              <p className="wr-eyebrow">{justSealed ? `Letter sealed · +${XP_RULES.lectureComplete} XP` : 'Letter sealed'}</p>
              <h2 id="wr-nextup-title" className="wr-display">
                {nextUnread ? (
                  <>
                    {nextIsAdjacent ? 'Next letter' : 'Next unread letter'}: <em>{nextUnread.title}</em>
                  </>
                ) : (
                  <>Every letter read — bravo!</>
                )}
              </h2>
              <p>
                {nextUnread
                  ? nextIsAdjacent
                    ? 'The professor has already sealed it for you. Or put tonight’s lesson straight into practice while it is fresh.'
                    : `Letter No. ${ROMAN[lectures.indexOf(nextUnread)]} is still unopened on the corkboard. Or put tonight’s lesson straight into practice.`
                  : 'You have read the whole correspondence. Now let the assignments prove it — or revisit any letter on the corkboard.'}
              </p>
              <div className="wr-nextup__actions">
                {nextUnread && (
                  <Link to={`/student/writing/lecture/${nextUnread.id}`} className="wr-btn">
                    Open {nextIsAdjacent ? 'the next letter' : `letter No. ${ROMAN[lectures.indexOf(nextUnread)]}`}{' '}
                    <span className="wr-btn__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                )}
                <Link to={`/student/writing/practice/${practice.id}`} className={`wr-btn ${nextUnread ? 'wr-btn--ghost' : ''}`}>
                  Practise: {practice.title}
                </Link>
              </div>
            </div>
            <div className="wr-nextup__owl" aria-hidden="true">
              <TalkingOwl happy scale={4} />
            </div>
          </section>
        )}

        <details className="wr-transcript">
          <summary>Read the whole letter as text</summary>
          <div className="wr-transcript__body">
            {lecture.chapters.map((c, i) => (
              <section key={c.title}>
                <h2>
                  {i + 1}. {c.title}
                </h2>
                <ul>
                  {c.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>

        <nav className="wr-lec__pager" aria-label="Other letters">
          {prev ? (
            <Link to={`/student/writing/lecture/${prev.id}`} className="wr-pager wr-pager--prev">
              <span className="wr-pager__dir">
                ← Letter No. {ROMAN[index - 1]}
                {isRead(prev.id) ? ' · read' : ''}
              </span>
              <span className="wr-pager__title wr-hand">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/student/writing/lecture/${next.id}`} className="wr-pager wr-pager--next">
              <span className="wr-pager__dir">
                Letter No. {ROMAN[index + 1]}
                {isRead(next.id) ? ' · read' : ''} →
              </span>
              <span className="wr-pager__title wr-hand">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
