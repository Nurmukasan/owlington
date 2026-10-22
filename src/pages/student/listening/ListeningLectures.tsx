import { useEffect, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { XP_RULES } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import { useProgress } from '../../../learn/useProgress'
import { Aurora } from './components/Aurora'
import { Cassette } from './components/Cassette'
import { Equalizer } from './components/Equalizer'
import { lectures } from './content'
import { useReducedMotion, useSeen } from './hooks'
import './listening.css'
import './hub.css'
import './lecture.css'

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const say = (n: number) => NUMBER_WORDS[n] ?? String(n)
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Owl FM's lectures: the tape rack. */
export default function ListeningLectures() {
  const progress = useProgress()
  const stats = progress.section('listening')
  const reduced = useReducedMotion()
  const lectureState = lectures.map((l) => progress.lecture('listening', l.id))
  const nextLecture = stats.nextLecture
  const [rackRef, rackSeen] = useSeen<HTMLElement>()
  const shelf = useRef<HTMLOListElement>(null)

  // On phones the rack is a sideways shelf: start it at the tape that's up next.
  const nextId = nextLecture?.id
  useEffect(() => {
    const el = shelf.current
    const tape = el?.querySelector<HTMLElement>('.ls-rack__tape.is-next')?.closest<HTMLElement>('li')
    if (!el || !tape || el.scrollWidth <= el.clientWidth + 4) return
    el.scrollLeft = tape.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || '0')
  }, [nextId])

  return (
    <div className="ls-world ls-hub ls-studio ls-tapes-page">
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
          <span aria-current="page">Lectures</span>
        </nav>

        <section ref={rackRef} className={`ls-section ls-tapes ${rackSeen ? 'is-seen' : ''}`} aria-labelledby="ls-tapes-title">
          <header className="ls-section__head">
            <p className="ls-kicker">THE TAPE RACK</p>
            <h1 id="ls-tapes-title" className="ls-h2">
              Lectures on tape
            </h1>
            <p className="ls-section__lead">
              {stats.lecturesCompleted === 0
                ? `${capital(say(lectures.length))} tapes, from prediction tricks to Part 4 lectures. Pop one in: the reels wind on as you watch, and finished tapes get stamped.`
                : `${stats.lecturesCompleted} of ${stats.lecturesTotal} tapes recorded. Every finished tape is worth +${XP_RULES.lectureComplete} XP.`}
            </p>
          </header>
          <ol className="ls-rack" ref={shelf}>
            {lectures.map((l, i) => {
              const p = lectureState[i]
              const watched = p?.watched ?? 0
              const done = Boolean(p?.completedAt)
              const status = done ? 'Recorded' : watched > 0 ? `${Math.round(watched * 100)}% wound` : 'Not played yet'
              return (
                <li key={l.id} className="ls-rack__slot" style={{ '--i': i } as CSSProperties}>
                  <Link
                    to={`/student/listening/lecture/${l.id}`}
                    className={`ls-rack__tape ${nextLecture?.id === l.id ? 'is-next' : ''}`}
                    onClick={() => sfx.click()}
                    aria-label={`Tape ${i + 1}: ${l.title}. ${l.minutes} minutes, ${l.level}. ${status}.`}
                  >
                    <Cassette index={i} title={l.title} minutes={l.minutes} level={l.level} watched={watched} completed={done} />
                  </Link>
                  <p className="ls-rack__caption" aria-hidden="true">
                    <span>{l.chapters.length} tracks</span>
                    <span className={done ? 'is-done' : watched > 0 ? 'is-started' : ''}>{status}</span>
                  </p>
                </li>
              )
            })}
          </ol>
          <p className="ls-rack__swipe" aria-hidden="true">
            <span className="ls-crumbs__back" /> SWIPE THE SHELF · {lectures.length} TAPES <span className="ls-icon-fwd" />
          </p>
        </section>
      </div>

      <footer className="ls-sign-off">
        <Equalizer bars={24} seed={9} playing={!reduced} className="ls-sign-off__eq" />
        <p>
          Ready to test your ears? <Link to="/student/listening/practice">Tune in to a practice broadcast →</Link>
        </p>
      </footer>
    </div>
  )
}
