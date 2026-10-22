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
  const playerRef = useRef<LecturePlayerHandle>(null)
  const [chapter, setChapter] = useState(-1)
  const [justSealed, setJustSealed] = useState(false)
  const practice = practiceSets.find((p) => p.id === PRACTICE_FOR[lecture.id]) ?? practiceSets[0]
  const nextUnread = next ?? lectures.find((l) => !progress.lecture('writing', l.id)?.completedAt && l.id !== lecture.id)

  const seek = (i: number) => {
    sfx.page()
    playerRef.current?.seekToChapter(i)
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
          <div className="wr-lec__headcopy">
            <p className="wr-eyebrow">Lecture · {lecture.level}</p>
            <h1 className="wr-lec__title wr-display">{lecture.title}</h1>
            <p className="wr-lec__summary">{lecture.summary}</p>
            <ul className="wr-lec__chips" aria-label="Lecture details">
              <li className="wr-chip">{lecture.level}</li>
              <li className="wr-chip">{lecture.minutes} min video</li>
              <li className="wr-chip">{lecture.chapters.length} chapters</li>
              <li className="wr-chip">+{XP_RULES.lectureComplete} XP</li>
            </ul>
          </div>
          <div className="wr-lec__vial" title={`${Math.round(watched * 100)}% of this letter read`}>
            <div
              className="wr-vial"
              role="progressbar"
              aria-label="Progress through this lecture"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(watched * 100)}
              style={{ '--wr-v': complete ? 1 : watched } as CSSProperties}
            >
              <span className="wr-vial__neck" />
              <span className="wr-vial__glass">
                <span className="wr-vial__ink" />
              </span>
            </div>
            <div>
              <p className="wr-lec__pct">{complete ? 'Sealed' : `${Math.round(watched * 100)}%`}</p>
              <p className="wr-lec__pct-label">{complete ? 'letter complete' : watched > 0 ? 'read so far' : 'not started'}</p>
            </div>
            {complete && <WaxSeal size={58} className="wr-lec__headseal" label="Completed: sealed with the owl seal" />}
          </div>
        </header>

        <div className="wr-lec__desk">
          <div className="wr-lec__sheet">
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

          <aside className="wr-margin" aria-label="Chapters">
            <p className="wr-margin__head wr-hand">Margin notes</p>
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
                    Next letter: <em>{nextUnread.title}</em>
                  </>
                ) : (
                  <>Every letter read — bravo!</>
                )}
              </h2>
              <p>
                {nextUnread
                  ? 'The professor has already sealed the next one. Or put tonight’s lesson straight into practice while it is fresh.'
                  : 'You have read the whole correspondence. Now let the assignments prove it.'}
              </p>
              <div className="wr-nextup__actions">
                {nextUnread && (
                  <Link to={`/student/writing/lecture/${nextUnread.id}`} className="wr-btn">
                    Open the next letter <span className="wr-btn__arrow" aria-hidden="true">→</span>
                  </Link>
                )}
                <Link to={`/student/writing/practice/${practice.id}`} className="wr-btn wr-btn--ghost">
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
              <span className="wr-pager__dir">← Letter No. {ROMAN[index - 1]}</span>
              <span className="wr-pager__title wr-hand">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/student/writing/lecture/${next.id}`} className="wr-pager wr-pager--next">
              <span className="wr-pager__dir">Letter No. {ROMAN[index + 1]} →</span>
              <span className="wr-pager__title wr-hand">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
