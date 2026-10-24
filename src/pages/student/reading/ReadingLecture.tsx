import { useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LectureRail } from '../../../learn/components/LectureRail'
import { useUser } from '../../../auth/auth-context'
import { findLecture, findPractice } from '../../../learn/catalog'
import { LecturePlayer, type LecturePlayerHandle } from '../../../learn/components/LecturePlayer'
import { XP_RULES } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import type { Lecture } from '../../../learn/types'
import { useProgress } from '../../../learn/useProgress'
import { LECTURE_PRACTICE, lectures } from './content'
import { LibrarianOwl } from './LibrarianOwl'
import { LibraryBackdrop } from './LibraryBackdrop'
import { HUB_PATH, SECTION, bookStyle, lectureIndex, pct, roman, shortDate } from './library'
import './reading.css'
import './lecture.css'

/** A lecture, framed like a painting in the Moonlit Library. */
export default function ReadingLecture() {
  const { lectureId } = useParams()
  const lecture = findLecture(SECTION, lectureId)
  if (!lecture) return <Navigate to={HUB_PATH} replace />
  return <LectureRoom key={lecture.id} lecture={lecture} />
}

/*
 * The notes player gives title/end cards 4s and each point 5–14s by its length, and
 * reports `watched` as the furthest point reached on that timeline. Mirror it so the
 * chapter ticks agree with the player's own progress bar.
 */
const pointSeconds = (text: string) => Math.min(14, Math.max(5, 3 + text.trim().split(/\s+/).length * 0.33))
const CARD_SECONDS = 4

/** Where each chapter starts (as a "page", i.e. slide number) and where it ends on the player's timeline. */
function chapterMarks(lecture: Lecture) {
  const total = 2 * CARD_SECONDS + lecture.chapters.reduce((n, c) => n + c.points.reduce((m, p) => m + pointSeconds(p), 0), 0)
  let slide = 1
  let time = CARD_SECONDS
  return lecture.chapters.map((c) => {
    const page = slide + 1
    slide += c.points.length
    time += c.points.reduce((m, p) => m + pointSeconds(p), 0)
    return { page, end: time / total }
  })
}

function LectureRoom({ lecture }: { lecture: Lecture }) {
  const user = useUser()
  const progress = useProgress()
  const playerRef = useRef<LecturePlayerHandle>(null)
  /** Furthest chapter unlocked so far — later chapters open as they're watched. */
  const [reach, setReach] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(-1)
  /** The furthest chapter opened during this visit (a chapter you have moved past counts as read). */
  const [furthest, setFurthest] = useState(-1)
  const [justCompleted, setJustCompleted] = useState(false)

  const index = lectureIndex(lecture.id)
  const style = bookStyle(index)
  const prev = lectures[index - 1]
  const next = lectures[index + 1]
  const saved = progress.lecture(SECTION, lecture.id)
  const watched = saved?.watched ?? 0
  const done = Boolean(saved?.completedAt)
  const marks = chapterMarks(lecture)
  const practice = findPractice(SECTION, LECTURE_PRACTICE[lecture.id])
  const nextUnread = lectures.find((l, i) => i > index && !progress.lecture(SECTION, l.id)?.completedAt) ?? lectures.find((l) => !progress.lecture(SECTION, l.id)?.completedAt && l.id !== lecture.id)
  const atEnd = chapter >= lecture.chapters.length
  const showNextUp = justCompleted || done

  const seek = (i: number) => {
    sfx.page()
    playerRef.current?.seekToChapter(i)
    const rect = stageRef.current?.getBoundingClientRect()
    if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
      stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="rd-world rd-lecture" style={{ '--rd-cloth': style.cloth, '--rd-edge': style.edge, '--rd-foil': style.foil } as CSSProperties}>
      <LibraryBackdrop />

      <div className="rd-lecture__wrap">
        <nav className="rd-crumbs" aria-label="Breadcrumb">
          <Link to={HUB_PATH} className="rd-crumbs__back">
            <span aria-hidden="true">←</span> The Moonlit Library
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={`${HUB_PATH}/lectures`}>Lecture Stacks</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Volume {roman(index + 1)}</span>
        </nav>

        <div className="lecture-layout">
          <LectureRail
            section="reading"
            lectures={lectures}
            currentId={lecture.id}
            title="The Lecture Stacks"
            label={(i) => `Volume ${roman(i + 1)}`}
            className="rd-rail"
          />
          <div className="lecture-layout__main">

        <header className="rd-lecture__head">
          <span className="rd-lecture__spine" aria-hidden="true">
            {roman(index + 1)}
          </span>
          <div>
            <p className="rd-eyebrow">
              VOLUME {roman(index + 1)} OF {roman(lectures.length)} · {lecture.level.toUpperCase()} · {lecture.minutes} MIN
            </p>
            <h1 className="rd-lecture__title">{lecture.title}</h1>
            <p className="rd-lecture__summary rd-lecture__summary--head">{lecture.summary}</p>
          </div>
        </header>

        <div className="rd-lecture__grid">
          <div className="rd-lecture__stage" ref={stageRef}>
            <div className="rd-frame">
              <span className="rd-frame__lamp" aria-hidden="true" />
              <span className="rd-frame__corner rd-frame__corner--tl" aria-hidden="true" />
              <span className="rd-frame__corner rd-frame__corner--tr" aria-hidden="true" />
              <span className="rd-frame__corner rd-frame__corner--bl" aria-hidden="true" />
              <span className="rd-frame__corner rd-frame__corner--br" aria-hidden="true" />
              <div className="rd-frame__inner">
                <LecturePlayer
                  ref={playerRef}
                  section={SECTION}
                  lecture={lecture}
                  className="rd-player"
                  onChapterChange={(i) => {
                    setChapter(i)
                    setFurthest((f) => Math.max(f, i))
                  }}
                  onComplete={() => setJustCompleted(true)}
                  onReachChange={setReach}
                />
              </div>
            </div>
            <p className="rd-frame__plaque">
              <span>
                Vol. {roman(index + 1)} — {lecture.title}
              </span>
            </p>
            {/* On short laptop screens the summary moves here, so the player sits higher. */}
            <p className="rd-lecture__summary rd-lecture__summary--below">{lecture.summary}</p>

            {showNextUp && (
              <section className={`rd-nextup ${justCompleted ? 'is-fresh' : ''}`} aria-live="polite" aria-labelledby="rd-nextup-title">
                <LibrarianOwl happy={justCompleted || atEnd} scale={4} className="rd-nextup__owl" />
                <div className="rd-nextup__body">
                  <p className="rd-nextup__eyebrow">
                    {justCompleted
                      ? `BOOK CLOSED · +${XP_RULES.lectureComplete} XP`
                      : `READ ON ${saved?.completedAt ? shortDate(saved.completedAt).toUpperCase() : ''}`}
                  </p>
                  <h2 className="rd-nextup__title" id="rd-nextup-title">
                    {justCompleted ? `Splendid reading, ${user.name.split(' ')[0] || 'friend'}!` : 'This volume has its gold star.'}
                  </h2>
                  <p className="rd-nextup__text">
                    {nextUnread
                      ? `Next on the shelf: Volume ${roman(lectureIndex(nextUnread.id) + 1)}, ${nextUnread.title}.`
                      : 'Every volume in the stacks is read. Time to put it all to work in the card catalogue.'}
                    {practice && ` Or test this skill straight away with “${practice.title}”.`}
                  </p>
                  <div className="rd-nextup__actions">
                    {nextUnread ? (
                      <Link to={`${HUB_PATH}/lecture/${nextUnread.id}`} className="rd-btn rd-btn--gold">
                        Open Volume {roman(lectureIndex(nextUnread.id) + 1)} <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      <Link to={`${HUB_PATH}/practice`} className="rd-btn rd-btn--gold">
                        To the card catalogue <span aria-hidden="true">→</span>
                      </Link>
                    )}
                    {practice && (
                      <Link to={`${HUB_PATH}/practice/${practice.id}`} className="rd-btn rd-btn--ghost">
                        Practise: {practice.title}
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          <aside className="rd-toc" aria-labelledby="rd-toc-title">
            <div className="rd-toc__page">
              <p className="rd-toc__eyebrow">VOL. {roman(index + 1)}</p>
              <h2 className="rd-toc__title" id="rd-toc-title">
                Contents
              </h2>
              <ol className="rd-toc__list">
                {lecture.chapters.map((c, i) => {
                  const isCurrent = chapter === i
                  const isRead = done || furthest > i || watched >= marks[i].end - 0.001
                  const isLocked = !done && i > reach
                  return (
                    <li
                      key={c.title}
                      className={`rd-toc__row ${isCurrent ? 'is-current' : ''} ${isRead ? 'is-read' : ''} ${isLocked ? 'is-locked' : ''}`}
                    >
                      <button
                        type="button"
                        className="rd-toc__item"
                        onClick={() => seek(i)}
                        aria-current={isCurrent ? 'step' : undefined}
                        aria-disabled={isLocked || undefined}
                        aria-label={`Chapter ${i + 1}: ${c.title}${isRead ? ' (read)' : ''}${isLocked ? ' (locked until you reach it)' : '. Jump to this chapter.'}`}
                      >
                        <span className="rd-toc__num" aria-hidden="true">
                          {roman(i + 1)}.
                        </span>
                        <span className="rd-toc__name" aria-hidden="true">
                          {c.title}
                        </span>
                        <span className="rd-toc__leader" aria-hidden="true" />
                        <span className="rd-toc__pg" aria-hidden="true">
                          {isRead ? '✓' : isLocked ? '🔒' : `p. ${marks[i].page}`}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
              <p className="rd-toc__hint">Chapters unlock as you read. You can always turn back.</p>

              <div className="rd-toc__progress">
                <div className="rd-toc__progress-head">
                  <span>Your bookmark</span>
                  <b>{done ? 'Finished' : watched > 0 ? `${pct(watched)} read` : 'Not started'}</b>
                </div>
                <div
                  className="rd-toc__bar"
                  role="progressbar"
                  aria-label="Lecture progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(watched * 100)}
                >
                  <span style={{ width: pct(watched) }} />
                </div>
                <p className="rd-toc__facts">
                  <span>{lecture.level}</span>
                  <span>{lecture.minutes}-minute video</span>
                  <span>{lecture.chapters.length} chapters</span>
                </p>
              </div>
            </div>

            {practice && (
              <Link to={`${HUB_PATH}/practice/${practice.id}`} className="rd-toc__practice">
                <span className="rd-toc__practice-eyebrow">PRACTISE THIS SKILL</span>
                <span className="rd-toc__practice-title">{practice.title}</span>
                <span className="rd-toc__practice-meta">
                  {practice.minutes} min · {practice.questionCount} questions · {practice.kinds.slice(0, 2).join(', ')}
                </span>
                <span className="rd-toc__practice-go" aria-hidden="true">
                  Borrow →
                </span>
              </Link>
            )}
          </aside>
        </div>

        <nav className="rd-volnav" aria-label="Other volumes">
          {prev ? (
            <Link
              to={`${HUB_PATH}/lecture/${prev.id}`}
              className="rd-volnav__link rd-volnav__link--prev"
              style={{ '--rd-cloth': bookStyle(index - 1).cloth, '--rd-foil': bookStyle(index - 1).foil } as CSSProperties}
            >
              <span className="rd-volnav__spine" aria-hidden="true">
                {roman(index)}
              </span>
              <span>
                <small>← Previous volume</small>
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`${HUB_PATH}/lecture/${next.id}`}
              className="rd-volnav__link rd-volnav__link--next"
              style={{ '--rd-cloth': bookStyle(index + 1).cloth, '--rd-foil': bookStyle(index + 1).foil } as CSSProperties}
            >
              <span>
                <small>Next volume →</small>
                {next.title}
              </span>
              <span className="rd-volnav__spine" aria-hidden="true">
                {roman(index + 2)}
              </span>
            </Link>
          ) : (
            <Link to={`${HUB_PATH}/practice`} className="rd-volnav__link rd-volnav__link--next">
              <span>
                <small>End of the stacks →</small>
                Practice tests
              </span>
            </Link>
          )}
        </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
