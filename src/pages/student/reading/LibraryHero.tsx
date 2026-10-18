import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { formatClock } from '../../../learn/useTimer'
import { PixelSprite } from '../../../components/PixelSprite'
import { sfx } from '../../../learn/sfx'
import type { ProgressView, SectionStats } from '../../../learn/useProgress'
import { BOOK_ICON, FLAME_ICON, STAR_ICON, TROPHY_ICON } from '../../../scene/sprites'
import { Bookcase } from './Bookcase'
import { FloatingCandle } from './Candle'
import { DustMotes } from './DustMotes'
import { LibrarianOwl } from './LibrarianOwl'
import { HUB_PATH, LIBRARIAN_TIPS, accuracyOf, bookStyle, lectureIndex, pct, roman, type NextStep } from './library'
import { useCountUp, useReducedMotion } from './hooks'

interface LibraryHeroProps {
  firstName: string
  stats: SectionStats
  progress: ProgressView
  step: NextStep | undefined
}

export function LibraryHero({ firstName, stats, progress, step }: LibraryHeroProps) {
  const reduced = useReducedMotion()
  const bestAttempt = Object.values(stats.best).sort((a, b) => accuracyOf(b) - accuracyOf(a))[0]
  const xp = useCountUp(stats.xp)
  const isNew = stats.lecturesCompleted === 0 && stats.attempts.length === 0 && stats.lectureFraction === 0

  const resume = step?.kind === 'practice' && step.reason === 'resume' ? step : undefined
  const greeting = resume
    ? `Welcome back, ${firstName}. You left a bookmark in “${resume.practice.title}”. Shall we finish it?`
    : isNew
      ? `Hoo! Welcome to the library, ${firstName}. Start with Volume I — I saved you the seat by the window.`
      : step?.kind === 'lecture'
        ? `Welcome back, ${firstName}. Your bookmark is waiting in Volume ${roman(lectureIndex(step.lecture.id) + 1)}.`
        : `Welcome back, ${firstName}. Every book is read — the card catalogue awaits!`

  const [line, setLine] = useState(greeting)
  const [talking, setTalking] = useState(!reduced)
  const [look, setLook] = useState<-1 | 0 | 1>(-1)
  const [bubbleOpen, setBubbleOpen] = useState(true)
  const [wiggle, setWiggle] = useState(0)
  const [firstTip] = useState(() => Math.floor(Math.random() * LIBRARIAN_TIPS.length))
  const tipIndex = useRef(firstTip)

  // The owl talks for a moment after each new line, then glances around now and then.
  useEffect(() => {
    const id = window.setTimeout(() => setTalking(false), Math.min(2600, 400 + line.length * 28))
    return () => window.clearTimeout(id)
  }, [line])

  useEffect(() => {
    if (reduced) return
    const looks: (-1 | 0 | 1)[] = [-1, 0, -1, 1, 0]
    let i = 0
    const id = window.setInterval(() => {
      i = (i + 1) % looks.length
      setLook(looks[i])
    }, 3400)
    return () => window.clearInterval(id)
  }, [reduced])

  const nextTip = () => {
    tipIndex.current = (tipIndex.current + 1) % LIBRARIAN_TIPS.length
    setLine(LIBRARIAN_TIPS[tipIndex.current])
    setBubbleOpen(true)
    if (!reduced) setTalking(true)
  }

  const askOwl = () => {
    sfx.hoot()
    nextTip()
  }

  const shakeBook = () => {
    sfx.page()
    setWiggle((w) => w + 1)
    nextTip()
  }

  const stepStyle = step?.kind === 'lecture' ? bookStyle(lectureIndex(step.lecture.id)) : bookStyle(5)

  return (
    <section className="rd-hero" aria-labelledby="rd-hero-title">
      <div className="rd-hero__scene" aria-hidden="true">
        <div className="rd-hero__wall" />
        <div className="rd-hero__wainscot" />
        <div className="rd-hero__floor" />
        <Bookcase side="left" rows={7} />
      </div>

      {/* The window, its moonbeam and the owl on the sill share one coordinate frame. */}
      <div className="rd-beam" aria-hidden="true">
        <div className="rd-beam__soft">
          <div className="rd-beam__light" />
        </div>
        <DustMotes className="rd-beam__dust" />
        <div className="rd-beam__pool" />
      </div>

      <div className="rd-bookcase-wrap">
        <Bookcase side="right" rows={7} />
        <button
          type="button"
          key={wiggle}
          className={`rd-restless ${wiggle ? 'is-poked' : ''}`}
          onClick={shakeBook}
          aria-label="A restless book on the shelf. Pull it out for a reading tip."
          title="This one keeps wiggling…"
        >
          <span className="rd-restless__spine" />
        </button>
      </div>

      <div className="rd-win">
        <div className="rd-win__frame" aria-hidden="true">
          <div className="rd-win__sky">
            <span className="rd-win__stars" />
            <span className="rd-win__moon" />
            <span className="rd-win__cloud" />
            <span className="rd-win__shooting" />
          </div>
          <span className="rd-win__glass" />
          <span className="rd-win__mullions" />
          <span className="rd-win__rose" />
        </div>
        <div className="rd-win__sill" aria-hidden="true" />
        <button type="button" className="rd-win__owl" onClick={askOwl} aria-label="Ask the librarian owl for a reading tip">
          <LibrarianOwl talking={talking} look={look} scale={4} className="rd-win__owl-sprite" />
        </button>
        {bubbleOpen && (
          <div className="rd-bubble" role="status">
            <p className="rd-bubble__who">THE LIBRARIAN</p>
            <p className="rd-bubble__text" key={line}>
              {line}
            </p>
            <div className="rd-bubble__actions">
              <button type="button" className="rd-bubble__btn" onClick={askOwl}>
                Another tip &gt;
              </button>
              <button type="button" className="rd-bubble__close" onClick={() => setBubbleOpen(false)} aria-label="Close the librarian’s note">
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <FloatingCandle x="47%" y="24%" size={1} delay={0} className="rd-fcandle--a" />
      <FloatingCandle x="56%" y="14%" size={0.7} delay={1.7} className="rd-fcandle--b" />
      <FloatingCandle x="88%" y="16%" size={0.85} delay={3.1} className="rd-fcandle--c" />
      <FloatingCandle x="40%" y="62%" size={0.6} delay={2.3} className="rd-fcandle--d" />
      <FloatingCandle x="95%" y="58%" size={1.15} delay={0.8} className="rd-fcandle--e" />

      <div className="rd-hero__content">
        <p className="rd-eyebrow rd-hero__eyebrow">
          <PixelSprite sprite={BOOK_ICON} scale={2} /> READING · OPEN ALL NIGHT
        </p>
        <h1 id="rd-hero-title" className="rd-hero__title">
          <span className="rd-hero__title-line">The</span>{' '}
          <em className="rd-hero__title-line rd-foil">Moonlit</em>{' '}
          <span className="rd-hero__title-line">Library</span>
        </h1>
        <p className="rd-hero__tagline">
          Lectures, practice tests and a librarian who never sleeps. Learn to skim, scan and see straight through every
          “Not Given” — one candlelit page at a time.
        </p>

        <dl className="rd-plaques">
          <div className="rd-plaque" style={{ '--rd-i': 0 } as CSSProperties}>
            <dt>
              <PixelSprite sprite={BOOK_ICON} scale={2} /> Books read
            </dt>
            <dd>
              {stats.lecturesCompleted}
              <small>/{stats.lecturesTotal}</small>
            </dd>
          </div>
          <div className="rd-plaque" style={{ '--rd-i': 1 } as CSSProperties}>
            <dt>
              <PixelSprite sprite={TROPHY_ICON} scale={2} /> Best score
            </dt>
            <dd>{bestAttempt ? pct(accuracyOf(bestAttempt)) : '—'}</dd>
          </div>
          <div className="rd-plaque" style={{ '--rd-i': 2 } as CSSProperties}>
            <dt>
              <PixelSprite sprite={{ ...STAR_ICON, palette: { o: '#ffcf5c' } }} scale={2} /> Reading XP
            </dt>
            <dd>{Math.round(xp)}</dd>
          </div>
          <div className="rd-plaque" style={{ '--rd-i': 3 } as CSSProperties}>
            <dt>
              <PixelSprite sprite={FLAME_ICON} scale={2} /> Streak
            </dt>
            <dd>
              {progress.streak.days}
              <small> {progress.streak.days === 1 ? 'night' : 'nights'}</small>
            </dd>
          </div>
        </dl>

        {step && (
          <div className="rd-continue">
            <Link
              to={step.kind === 'lecture' ? `${HUB_PATH}/lecture/${step.lecture.id}` : `${HUB_PATH}/practice/${step.practice.id}`}
              className="rd-bookmark"
              style={{ '--rd-cloth': stepStyle.cloth, '--rd-edge': stepStyle.edge, '--rd-foil': stepStyle.foil } as CSSProperties}
            >
              <span className="rd-bookmark__spine" aria-hidden="true">
                {step.kind === 'lecture' ? roman(lectureIndex(step.lecture.id) + 1) : '✦'}
              </span>
              <span className="rd-bookmark__body">
                <span className="rd-bookmark__eyebrow">
                  {step.kind === 'lecture'
                    ? step.started
                      ? 'PICK UP WHERE YOU LEFT OFF'
                      : isNew
                        ? 'YOUR FIRST BOOK'
                        : 'NEXT ON THE SHELF'
                    : step.reason === 'resume'
                      ? 'FINISH WHAT YOU STARTED'
                      : step.reason === 'new'
                        ? 'NEXT IN THE CATALOGUE'
                        : 'BEAT YOUR BEST'}
                </span>
                <span className="rd-bookmark__title">{step.kind === 'lecture' ? step.lecture.title : step.practice.title}</span>
                <span className="rd-bookmark__meta">
                  {step.kind === 'lecture'
                    ? `${step.lecture.level} · ${step.lecture.minutes} min · ${step.started ? `${pct(step.watched)} read` : `${step.lecture.chapters.length} chapters`}`
                    : step.reason === 'resume'
                      ? `${step.draft.answered} of ${step.practice.questionCount} answered · ${
                          step.draft.elapsed < step.practice.minutes * 60
                            ? `${formatClock(step.practice.minutes * 60 - step.draft.elapsed)} left on the candle`
                            : 'in overtime'
                        }`
                      : step.reason === 'improve' && step.best
                        ? `Best so far ${step.best.score}/${step.best.total} · ${step.practice.minutes} min`
                        : `${step.practice.level} · ${step.practice.minutes} min · ${step.practice.questionCount} questions`}
                </span>
                {step.kind === 'lecture' && step.started && (
                  <span className="rd-bookmark__bar" aria-hidden="true">
                    <span style={{ width: pct(step.watched) }} />
                  </span>
                )}
                {step.kind === 'practice' && step.reason === 'resume' && (
                  <span className="rd-bookmark__bar" aria-hidden="true">
                    <span style={{ width: pct(step.draft.answered / Math.max(1, step.practice.questionCount)) }} />
                  </span>
                )}
              </span>
              <span className="rd-bookmark__go" aria-hidden="true">
                {step.kind === 'lecture' ? (step.started ? 'Continue' : 'Open') : step.reason === 'resume' ? 'Resume' : 'Borrow'}{' '}
                <span>→</span>
              </span>
            </Link>
            <a className="rd-continue__alt" href="#rd-catalogue">
              or browse the practice tests ↓
            </a>
          </div>
        )}
      </div>

      <a className="rd-hero__scroll" href="#rd-stacks" aria-label="Scroll to the lecture stacks">
        <span aria-hidden="true">▾</span>
      </a>
    </section>
  )
}
