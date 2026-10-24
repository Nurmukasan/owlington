import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { PixelSprite } from '../../../components/PixelSprite'
import { SectionGateway } from '../../../learn/components/SectionGateway'
import { sfx } from '../../../learn/sfx'
import type { ProgressView, SectionStats } from '../../../learn/useProgress'
import { BOOK_ICON, FLAME_ICON, STAR_ICON, TROPHY_ICON } from '../../../scene/sprites'
import { Bookcase } from './Bookcase'
import { FloatingCandle } from './Candle'
import { DustMotes } from './DustMotes'
import { LibrarianOwl } from './LibrarianOwl'
import { LIBRARIAN_TIPS, accuracyOf, lectureIndex, pct, roman, type NextStep } from './library'
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

  // Owl babble while the librarian speaks.
  useEffect(() => {
    if (!talking) return
    const id = window.setInterval(() => sfx.talk('librarian'), 70)
    return () => window.clearInterval(id)
  }, [talking])

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
    sfx.owl('librarian')
    nextTip()
  }

  const shakeBook = () => {
    sfx.page()
    setWiggle((w) => w + 1)
    nextTip()
  }

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

      {/* Candles a and d hang off the window's coordinates (see hub.css), so they never drift into the text. */}
      <FloatingCandle x="calc(var(--rd-win-left) - 92px)" y="calc(var(--rd-win-top) + 36px)" size={1} delay={0} className="rd-fcandle--a" />
      <FloatingCandle x="56%" y="14%" size={0.7} delay={1.7} className="rd-fcandle--b" />
      <FloatingCandle x="88%" y="16%" size={0.85} delay={3.1} className="rd-fcandle--c" />
      <FloatingCandle
        x="calc(var(--rd-win-left) - 100px)"
        y="calc(var(--rd-win-top) + var(--rd-win-h) + 34px)"
        size={0.6}
        delay={2.3}
        className="rd-fcandle--d"
      />
      <FloatingCandle x="95%" y="58%" size={1.15} delay={0.8} className="rd-fcandle--e" />

      <div className="rd-hero__content">
        <div className="rd-hero__masthead">
          <p className="rd-eyebrow rd-hero__eyebrow">
            <PixelSprite sprite={BOOK_ICON} scale={2} /> READING · OPEN ALL NIGHT
          </p>
          <h1 id="rd-hero-title" className="rd-hero__title">
            <span className="rd-hero__title-line">The</span>{' '}
            <em className="rd-hero__title-line rd-foil">Moonlit</em>{' '}
            <span className="rd-hero__title-line">Library</span>
          </h1>
        </div>
        <p className="rd-hero__tagline">
          Lectures and practice tests, from single question types to full 60-minute papers — and a librarian who never
          sleeps. Learn to skim, scan and see straight through every “Not Given”.
        </p>

        <SectionGateway section="reading" icon={BOOK_ICON} lectureNoun="book" className="rd-gateway" />

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
      </div>
    </section>
  )
}
