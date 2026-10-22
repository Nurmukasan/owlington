import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findLecture, findPractice } from '../../../learn/catalog'
import { LecturePlayer, type LecturePlayerHandle } from '../../../learn/components/LecturePlayer'
import { XP_RULES } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import type { Lecture } from '../../../learn/types'
import { useProgress } from '../../../learn/useProgress'
import { formatClock } from '../../../learn/useTimer'
import { Aurora } from './components/Aurora'
import { Cassette } from './components/Cassette'
import { DjOwl } from './components/DjOwl'
import { Equalizer } from './components/Equalizer'
import { lectures } from './content'
import { LECTURE_PRACTICE, formatFreq, stationFor, tapeShell } from './stations'
import './listening.css'
import './lecture.css'

/** Mirrors the notes player's pacing so the tracklist can show each chapter's length and what's been heard. */
function chapterTimes(lecture: Lecture) {
  const words = (s: string) => s.trim().split(/\s+/).length
  const pointSec = (p: string) => Math.min(14, Math.max(5, 3 + words(p) * 0.33))
  const lengths = lecture.chapters.map((ch) => ch.points.reduce((s, p) => s + pointSec(p), 0))
  const total = 4 + lengths.reduce((a, b) => a + b, 0) + 4
  let t = 4
  const ends = lengths.map((len) => (t += len))
  return { lengths, ends, total }
}

const tapeNo = (i: number) => String(i + 1).padStart(2, '0')

export default function ListeningLecture() {
  const lecture = findLecture('listening', useParams().lectureId)
  if (!lecture) return <Navigate to="/student/listening" replace />
  return <Studio key={lecture.id} lecture={lecture} />
}

function Studio({ lecture }: { lecture: Lecture }) {
  const progress = useProgress()
  const saved = progress.lecture('listening', lecture.id)
  const player = useRef<LecturePlayerHandle>(null)
  const screen = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(-1)
  const [justDone, setJustDone] = useState(false)

  const index = lectures.findIndex((l) => l.id === lecture.id)
  const prev = lectures[index - 1]
  const next = lectures[index + 1]
  const shell = tapeShell(index)
  const watched = saved?.watched ?? 0
  const completed = Boolean(saved?.completedAt) || justDone
  const times = useMemo(() => chapterTimes(lecture), [lecture])
  const sideA = Math.ceil(lecture.chapters.length / 2)
  const points = lecture.chapters.reduce((s, c) => s + c.points.length, 0)

  const practiceId = LECTURE_PRACTICE[lecture.id]
  const practice = practiceId ? findPractice('listening', practiceId) : undefined
  const practiceStation = practice ? stationFor(practice.id) : undefined
  const remaining = lectures.filter((l) => l.id !== lecture.id && !progress.lecture('listening', l.id)?.completedAt)
  const nextUp = next && !progress.lecture('listening', next.id)?.completedAt ? next : (remaining[0] ?? next)
  const nextUpIndex = nextUp ? lectures.findIndex((l) => l.id === nextUp.id) : -1

  const seek = (i: number) => {
    sfx.click()
    player.current?.seekToChapter(i)
    const rect = screen.current?.getBoundingClientRect()
    if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) screen.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const track = (i: number) => {
    const ch = lecture.chapters[i]
    const heard = watched * times.total >= times.ends[i] - 0.5 || completed
    const current = chapter === i
    const label = `${i < sideA ? 'A' : 'B'}${i < sideA ? i + 1 : i - sideA + 1}`
    return (
      <li key={ch.title}>
        <button
          type="button"
          className={`ls-track ${current ? 'is-current' : ''} ${heard ? 'is-heard' : ''}`}
          onClick={() => seek(i)}
          aria-current={current ? 'true' : undefined}
          aria-label={`Play chapter ${i + 1}: ${ch.title}${heard ? ', heard' : ''}`}
        >
          <span className="ls-track__no">{label}</span>
          <span className="ls-track__body">
            <span className="ls-track__title">{ch.title}</span>
            <span className="ls-track__meta">
              {ch.points.length} points · {formatClock(times.lengths[i])}
            </span>
          </span>
          <span className="ls-track__state" aria-hidden="true">
            {current ? <Equalizer bars={4} seed={i + 2} playing={false} className="ls-track__eq" /> : heard ? '✓' : '○'}
          </span>
        </button>
      </li>
    )
  }

  return (
    <div className="ls-world ls-studio" style={{ '--ls-tape': shell.shell, '--ls-tape-shade': shell.shade } as CSSProperties}>
      <div className="ls-studio__sky" aria-hidden="true">
        <span className="ls-stars" />
        <Aurora className="ls-studio__aurora" />
      </div>

      <div className="ls-studio__inner">
        <nav className="ls-crumbs" aria-label="Breadcrumb">
          <Link to="/student/listening">
            <span className="ls-crumbs__back" aria-hidden="true" />
            Owl FM
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Tape {tapeNo(index)}</span>
        </nav>

        <header className="ls-studio__head">
          <div className="ls-studio__titles">
            <p className="ls-kicker">
              TAPE {tapeNo(index)} / {tapeNo(lectures.length - 1)} · LECTURE
            </p>
            <h1 className="ls-studio__title">{lecture.title}</h1>
            <p className="ls-studio__summary">{lecture.summary}</p>
            <ul className="ls-studio__chips" aria-label="About this lecture">
              <li className="ls-chip ls-chip--teal">{lecture.level}</li>
              <li className="ls-chip">{lecture.minutes} min video</li>
              <li className="ls-chip">{lecture.chapters.length} tracks</li>
              <li className="ls-chip">{points} key points</li>
            </ul>
          </div>
          <div className="ls-studio__deck">
            <Cassette index={index} title={lecture.title} minutes={lecture.minutes} level={lecture.level} watched={watched} completed={completed} />
            <div
              className="ls-studio__wound"
              role="progressbar"
              aria-label="Lecture progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((completed ? 1 : watched) * 100)}
            >
              <span style={{ width: `${(completed ? 1 : watched) * 100}%` }} />
            </div>
            <p className="ls-studio__wound-label">
              {completed ? `Recorded · +${XP_RULES.lectureComplete} XP earned` : watched > 0 ? `${Math.round(watched * 100)}% wound · resume where you stopped` : `Not played yet · +${XP_RULES.lectureComplete} XP when it’s done`}
            </p>
          </div>
        </header>

        <div className="ls-studio__grid">
          <section className="ls-monitor" aria-label="Lecture player">
            <div className="ls-monitor__top" aria-hidden="true">
              <span className="ls-monitor__brand">OWL FM</span>
              <span className="ls-monitor__model">STUDIO MONITOR · CH {tapeNo(index)}</span>
              <span className="ls-minivu">
                <i />
              </span>
              <span className="ls-minivu ls-minivu--r">
                <i />
              </span>
              <span className="ls-monitor__onair">ON AIR</span>
            </div>
            <div className="ls-monitor__bezel" ref={screen}>
              <LecturePlayer
                ref={player}
                section="listening"
                lecture={lecture}
                className="ls-player"
                onChapterChange={setChapter}
                onComplete={() => setJustDone(true)}
              />
            </div>
            <div className="ls-monitor__base" aria-hidden="true">
              <span className="ls-monitor__grille" />
              <span className="ls-monitor__led" />
              <span className="ls-monitor__grille" />
            </div>
          </section>

          <aside className="ls-jcard" aria-labelledby="ls-tracklist">
            <div className="ls-jcard__spine" aria-hidden="true">
              <span>OWL FM · TAPE {tapeNo(index)}</span>
            </div>
            <div className="ls-jcard__body">
              <h2 className="ls-jcard__title" id="ls-tracklist">
                Tracklist
              </h2>
              <p className="ls-jcard__hint">Pick a track to jump straight to it.</p>
              <h3 className="ls-jcard__side">SIDE A</h3>
              <ol className="ls-tracks">{lecture.chapters.slice(0, sideA).map((_, i) => track(i))}</ol>
              {lecture.chapters.length > sideA && (
                <>
                  <h3 className="ls-jcard__side">SIDE B</h3>
                  <ol className="ls-tracks">{lecture.chapters.slice(sideA).map((_, i) => track(i + sideA))}</ol>
                </>
              )}
              <p className="ls-jcard__status" aria-live="polite">
                {chapter < 0 ? 'Title card' : chapter >= lecture.chapters.length ? 'End of tape' : `Now playing: ${lecture.chapters[chapter].title}`}
              </p>
            </div>
          </aside>
        </div>

        {completed && (
          <section className={`ls-nextup ${justDone ? 'is-fresh' : ''}`} aria-labelledby="ls-nextup-title">
            <div className="ls-nextup__owl" aria-hidden="true">
              <DjOwl happy scale={5} />
            </div>
            <div className="ls-nextup__copy">
              <p className="ls-kicker">{justDone ? `TAPE RECORDED · +${XP_RULES.lectureComplete} XP` : 'TAPE RECORDED'}</p>
              {nextUp && nextUp.id !== lecture.id && remaining.length > 0 ? (
                <>
                  <h2 className="ls-h2 ls-h2--small" id="ls-nextup-title">
                    Next tape: {nextUp.title}
                  </h2>
                  <p>
                    {justDone ? 'Hoo-ray, that one’s in the rack! ' : ''}
                    {nextUp.summary}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="ls-h2 ls-h2--small" id="ls-nextup-title">
                    Every tape recorded. Golden ears!
                  </h2>
                  <p>You’ve heard the whole course. Now prove it on air: a practice broadcast is the best way to lock it in.</p>
                </>
              )}
              <div className="ls-nextup__actions">
                {nextUp && nextUp.id !== lecture.id && remaining.length > 0 && (
                  <Link to={`/student/listening/lecture/${nextUp.id}`} className="ls-btn ls-btn--teal ls-btn--big" onClick={() => sfx.click()}>
                    <span className="ls-icon-play" aria-hidden="true" /> Load Tape {tapeNo(nextUpIndex)}
                  </Link>
                )}
                {practice && practiceStation && (
                  <Link to={`/student/listening/practice/${practice.id}`} className="ls-btn ls-btn--ghost ls-btn--big" onClick={() => sfx.click()}>
                    Practise it on {formatFreq(practiceStation.freq)} FM
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <nav className="ls-tapenav" aria-label="Other tapes">
          {prev ? (
            <Link to={`/student/listening/lecture/${prev.id}`} className="ls-tapenav__link ls-tapenav__link--prev" onClick={() => sfx.page()}>
              <span className="ls-tapenav__tape">
                <Cassette
                  index={index - 1}
                  title={prev.title}
                  minutes={prev.minutes}
                  level={prev.level}
                  watched={progress.lecture('listening', prev.id)?.watched ?? 0}
                  completed={Boolean(progress.lecture('listening', prev.id)?.completedAt)}
                />
              </span>
              <span className="ls-tapenav__text">
                <span className="ls-tapenav__dir">
                  <span className="ls-crumbs__back" aria-hidden="true" />
                  PREVIOUS · TAPE {tapeNo(index - 1)}
                </span>
                <span className="ls-tapenav__name">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/student/listening/lecture/${next.id}`} className="ls-tapenav__link ls-tapenav__link--next" onClick={() => sfx.page()}>
              <span className="ls-tapenav__text">
                <span className="ls-tapenav__dir">
                  NEXT · TAPE {tapeNo(index + 1)}
                  <span className="ls-icon-fwd" aria-hidden="true" />
                </span>
                <span className="ls-tapenav__name">{next.title}</span>
              </span>
              <span className="ls-tapenav__tape">
                <Cassette
                  index={index + 1}
                  title={next.title}
                  minutes={next.minutes}
                  level={next.level}
                  watched={progress.lecture('listening', next.id)?.watched ?? 0}
                  completed={Boolean(progress.lecture('listening', next.id)?.completedAt)}
                />
              </span>
            </Link>
          ) : (
            <Link to="/student/listening#ls-dial" className="ls-tapenav__link ls-tapenav__link--next">
              <span className="ls-tapenav__text">
                <span className="ls-tapenav__dir">
                  END OF THE RACK
                  <span className="ls-icon-fwd" aria-hidden="true" />
                </span>
                <span className="ls-tapenav__name">Tune in to a practice broadcast</span>
              </span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
