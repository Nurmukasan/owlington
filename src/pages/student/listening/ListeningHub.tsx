import { useEffect, useState } from 'react'
import { SectionGateway } from '../../../learn/components/SectionGateway'
import { StreakFlame } from '../../../learn/components/ProgressWidgets'
import { sfx } from '../../../learn/sfx'
import { useProgress } from '../../../learn/useProgress'
import { HEADPHONES_ICON } from '../../../scene/sprites'
import { bandForAccuracy } from './answers'
import { Aurora } from './components/Aurora'
import { DjOwl } from './components/DjOwl'
import { Equalizer } from './components/Equalizer'
import { RadioTower } from './components/RadioTower'
import { Skyline } from './components/Skyline'
import { lectures } from './content'
import { useReducedMotion } from './hooks'
import './listening.css'
import './hub.css'

const TIPS = [
  'Read ahead! The pause before each part is for the NEXT questions, never for checking old answers.',
  'Hear “actually” or “sorry, I mean”? Hold your pencil. The answer is about to change.',
  'Thirteen or thirty? Listen for the stress: thir-TEEN, THIR-ty.',
  'Word limits are strict. If the form says “behind the ___”, writing “the library” is two words.',
  'On a map, put your finger on the starting point and walk the route with the speaker.',
  'Part 4 has no break, so read all ten questions before the lecture starts.',
  'In the real test you hear each recording once. Switch on Exam mode to practise the pressure.',
  'Spelling counts. British and American spellings are both fine, but “accomodation” loses the mark.',
]

/** Reveals text a couple of letters at a time (instantly with reduced motion). */
function useTyping(text: string, reduced: boolean) {
  const [state, setState] = useState({ text, count: 0 })
  if (state.text !== text) setState({ text, count: 0 })
  const count = reduced ? text.length : state.text === text ? state.count : 0
  useEffect(() => {
    if (reduced || count >= text.length) return
    const id = window.setTimeout(() => {
      setState((s) => ({ text: s.text, count: s.count + 2 }))
      sfx.talk('dj')
    }, 28)
    return () => window.clearTimeout(id)
  }, [reduced, count, text])
  return { text: text.slice(0, count), done: count >= text.length }
}

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
/** 7 → "seven" (small counts read better as words in DJ copy). */
const say = (n: number) => NUMBER_WORDS[n] ?? String(n)

export default function ListeningHub() {
  const progress = useProgress()
  const stats = progress.section('listening')
  const reduced = useReducedMotion()
  const { streak, today } = progress

  const lectureState = lectures.map((l) => progress.lecture('listening', l.id))

  const isNew = stats.attempts.length === 0 && lectureState.every((p) => !p)
  const bestAttempt = Object.values(stats.best).sort((a, b) => b.score / b.total - a.score / a.total)[0]

  // ------------------------------------------------------------ DJ talk
  const opener = (() => {
    if (isNew)
      return `Hoo-hoo, welcome to Owl FM! I’m your night DJ. Start with Tape 01 — ${say(lectures[0].minutes)} minutes that change how you listen.`
    if (today.met) return `Goal smashed tonight: ${today.xp} XP! The signal has never been stronger. Fancy an encore?`
    if (streak.days > 0 && !streak.activeToday)
      return `Welcome back! Your ${streak.days}-night streak is still glowing. One tape or broadcast tonight keeps it alive.`
    if (stats.accuracy !== null && stats.accuracy >= 0.7)
      return `You’re averaging ${Math.round(stats.accuracy * 100)}% on air. That’s Band ${bandForAccuracy(stats.accuracy)} territory. Keep it up!`
    return `Tonight’s signal: ${today.xp} of ${today.goal} XP. One more broadcast and you’re there.`
  })()

  const [tip, setTip] = useState(-1)
  const line = tip < 0 ? opener : TIPS[tip % TIPS.length]
  const typed = useTyping(line, reduced)
  const askDj = () => {
    sfx.owl('dj')
    setTip((t) => t + 1)
  }

  return (
    <div className="ls-world ls-hub">
      {/* ================================================================ hero */}
      <section className="ls-hero" aria-labelledby="ls-hero-title">
        <div className="ls-hero__sky" aria-hidden="true">
          <span className="ls-stars" />
          <span className="ls-stars ls-stars--twinkle" />
          <Aurora className="ls-hero__aurora" />
          <span className="ls-hero__moon" />
          <Skyline tone="far" seed={11} className="ls-hero__far" />
        </div>

        <div className="ls-hero__inner">
          <div className="ls-hero__copy">
            <p className="ls-hero__eyebrow">
              <span className="ls-live-dot" aria-hidden="true" /> LIVE · 88–108 MHz · LISTENING
            </p>
            <h1 className="ls-hero__title" id="ls-hero-title">
              <span className="ls-hero__brand" data-text="Owl FM">
                Owl FM
              </span>
              <span className="ls-hero__tagline">Tune in tonight.</span>
            </h1>
            <p className="ls-hero__lead">
              Lectures on tape and practice broadcasts read aloud by real-sounding voices — from single question types to full
              four-part tests.
            </p>
            <SectionGateway section="listening" icon={HEADPHONES_ICON} lectureNoun="tape" className="ls-gateway" />
            <ul className="ls-hero__stats" aria-label="Your listening at a glance">
              <li>
                <span className="ls-hero__stat-k">TAPES</span>
                <span className="ls-hero__stat-v">
                  {stats.lecturesCompleted}/{stats.lecturesTotal}
                </span>
              </li>
              <li>
                <span className="ls-hero__stat-k">BEST</span>
                <span className="ls-hero__stat-v">{bestAttempt ? `${bestAttempt.score}/${bestAttempt.total}` : '—'}</span>
              </li>
              <li>
                <span className="ls-hero__stat-k">STREAK</span>
                <span className="ls-hero__stat-v">
                  <StreakFlame streak={streak} scale={2} />
                </span>
              </li>
              <li>
                <span className="ls-hero__stat-k">TONIGHT</span>
                <span className="ls-hero__stat-v">
                  {today.xp}/{today.goal} XP
                </span>
              </li>
            </ul>
          </div>

          <div className="ls-scene">
            <div className="ls-scene__bubble pixel-panel">
              <p className="ls-scene__speaker">DJ HOOT · ON AIR</p>
              {/* the typewriter is visual only; screen readers get the whole line once */}
              <p className="ls-scene__text" aria-hidden="true">
                {typed.text}
                {!typed.done && <span className="ls-caret" />}
              </p>
              <p className="visually-hidden" aria-live="polite">
                {line}
              </p>
              <button type="button" className="ls-scene__next" onClick={askDj}>
                {tip < 0 ? 'Tip of the night' : 'Another tip'} <span aria-hidden="true">»</span>
              </button>
            </div>

            <div className="ls-scene__stage">
            <RadioTower className="ls-scene__tower" />

            <div className="ls-booth">
              <div className="ls-booth__sign" aria-hidden="true">
                <span>ON AIR</span>
              </div>
              <div className="ls-booth__antenna" aria-hidden="true" />
              <div className="ls-booth__window">
                <span className="ls-booth__glow" aria-hidden="true" />
                <span className="ls-booth__poster" aria-hidden="true">
                  88.1
                </span>
                <button type="button" className="ls-booth__dj" onClick={askDj} aria-label="Ask DJ Hoot for a listening tip">
                  <DjOwl talking={!typed.done} happy={today.met} scale={5} />
                </button>
                <span className="ls-booth__mic" aria-hidden="true">
                  <span />
                </span>
                <div className="ls-booth__desk" aria-hidden="true">
                  <Equalizer bars={9} seed={4} playing={!reduced} className="ls-booth__eq" />
                  <span className="ls-booth__knobs">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="ls-booth__fader">
                    <i />
                    <i />
                  </span>
                </div>
              </div>
              <div className="ls-booth__door" aria-hidden="true" />
            </div>
            <div className="ls-scene__roof" aria-hidden="true" />
            </div>
          </div>
        </div>

        <Skyline tone="near" seed={5} className="ls-hero__near" />
      </section>

      <footer className="ls-sign-off">
        <Equalizer bars={24} seed={9} playing={!reduced} className="ls-sign-off__eq" />
        <p>
          You’re listening to <strong>Owl FM</strong>, IELTS prep for night owls. Same time tomorrow?
        </p>
      </footer>
    </div>
  )
}
