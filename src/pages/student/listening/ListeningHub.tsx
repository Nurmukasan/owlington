import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { StreakFlame, XpBar } from '../../../learn/components/ProgressWidgets'
import { ScrollLink } from '../../../learn/components/ScrollLink'
import { XP_RULES } from '../../../learn/progress'
import { scrollToId } from '../../../learn/scroll'
import { sfx } from '../../../learn/sfx'
import { useProgress } from '../../../learn/useProgress'
import { bandForAccuracy } from './answers'
import { AccuracyChart, type ChartPoint } from './components/AccuracyChart'
import { Aurora } from './components/Aurora'
import { Cassette } from './components/Cassette'
import { DjOwl } from './components/DjOwl'
import { Equalizer } from './components/Equalizer'
import { RadioTower } from './components/RadioTower'
import { SignalBars } from './components/SignalBars'
import { Skyline } from './components/Skyline'
import { Tuner } from './components/Tuner'
import { VuMeter } from './components/VuMeter'
import { lectures, practiceSets } from './content'
import { useReducedMotion, useSeen } from './hooks'
import { formatFreq, stationFor } from './stations'
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
    const id = window.setTimeout(() => setState((s) => ({ text: s.text, count: s.count + 2 })), 28)
    return () => window.clearTimeout(id)
  }, [reduced, count, text])
  return { text: text.slice(0, count), done: count >= text.length }
}

/** "21:45"-style slots for tonight's programme, starting at the next quarter hour. */
function slots(count: number) {
  const d = new Date()
  d.setMinutes(Math.ceil((d.getMinutes() + 1) / 15) * 15, 0, 0)
  return Array.from({ length: count }, (_, i) => {
    const t = new Date(d.getTime() + i * 15 * 60000)
    return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`
  })
}

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
/** 7 → "seven" (small counts read better as words in DJ copy). */
const say = (n: number) => NUMBER_WORDS[n] ?? String(n)
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const shortDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

export default function ListeningHub() {
  const progress = useProgress()
  const stats = progress.section('listening')
  const reduced = useReducedMotion()
  const { streak, today, level, xp } = progress

  // Links like /student/listening#ls-dial arrive from other pages: scroll to the section once it has rendered.
  // (The router's location, not window.location: under hash routing the section id sits after the route.)
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const t = window.setTimeout(() => scrollToId(decodeURIComponent(hash.slice(1))), 150)
    return () => window.clearTimeout(t)
  }, [hash])

  const lectureState = lectures.map((l) => progress.lecture('listening', l.id))
  const nextLecture = stats.nextLecture
  const nextLectureIndex = nextLecture ? lectures.findIndex((l) => l.id === nextLecture.id) : -1
  const nextLectureWatched = nextLecture ? (lectureState[nextLectureIndex]?.watched ?? 0) : 0

  const accuracyOf = (id: string) => {
    const b = stats.best[id]
    return b && b.total ? b.score / b.total : null
  }
  const unattempted = practiceSets.find((p) => !stats.best[p.id])
  const weakest = [...practiceSets].sort((a, b) => (accuracyOf(a.id) ?? 0) - (accuracyOf(b.id) ?? 0))[0]
  const nextPractice = unattempted ?? weakest
  const nextPracticeIndex = practiceSets.findIndex((p) => p.id === nextPractice.id)
  const nextStation = stationFor(nextPractice.id, nextPracticeIndex)

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
    sfx.hoot()
    setTip((t) => t + 1)
  }

  // ------------------------------------------------------------ data
  const chartPoints: ChartPoint[] = [...stats.attempts]
    .slice(0, 12)
    .reverse()
    .map((a) => ({
      accuracy: a.total ? a.score / a.total : 0,
      score: `${a.score}/${a.total}`,
      title: practiceSets.find((p) => p.id === a.practiceId)?.title ?? 'Practice',
      date: shortDate(a.at),
    }))

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
  const [consoleRef, consoleSeen] = useSeen<HTMLElement>()
  const times = slots(3)

  const consoleCopy =
    stats.accuracy === null
      ? 'No broadcasts yet, so the needle is resting. Your first practice score will bring the meter to life.'
      : stats.accuracy >= 0.7
        ? `Strong signal! Your last ${Math.min(10, stats.attempts.length)} broadcasts average ${Math.round(stats.accuracy * 100)}%, roughly Band ${bandForAccuracy(stats.accuracy)} on the full test.`
        : `Averaging ${Math.round(stats.accuracy * 100)}%. Review the traps from your last broadcast, then tune in again — the 70% line is closer than it looks.`

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
              Lectures on tape, live practice broadcasts read by real-sounding voices, and a signal meter that grows stronger every night
              you study.
            </p>
            <div className="ls-hero__cta">
              {nextLecture ? (
                <Link to={`lecture/${nextLecture.id}`} className="ls-btn ls-btn--teal ls-btn--big" onClick={() => sfx.click()}>
                  <span className="ls-icon-play" aria-hidden="true" />
                  {nextLectureWatched > 0 ? `Resume Tape ${String(nextLectureIndex + 1).padStart(2, '0')}` : `Play Tape ${String(nextLectureIndex + 1).padStart(2, '0')}`}
                </Link>
              ) : (
                <Link to={`practice/${nextPractice.id}`} className="ls-btn ls-btn--teal ls-btn--big" onClick={() => sfx.click()}>
                  <span className="ls-icon-play" aria-hidden="true" /> Tune in to {formatFreq(nextStation.freq)}
                </Link>
              )}
              <ScrollLink to="ls-dial" className="ls-btn ls-btn--ghost ls-btn--big" onClick={() => sfx.click()}>
                Practice broadcasts
              </ScrollLink>
            </div>
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

      {/* ============================================================ programme */}
      <section className="ls-section ls-programme" aria-labelledby="ls-programme-title">
        <div className="ls-programme__card">
          <div className="ls-programme__head">
            <p className="ls-kicker">
              <span className="ls-live-dot" aria-hidden="true" /> TONIGHT’S PROGRAMME
            </p>
            <h2 id="ls-programme-title" className="ls-h2 ls-h2--small">
              {isNew ? 'Your first night on air' : 'Pick up where you left off'}
            </h2>
          </div>
          <ol className="ls-schedule">
            <li style={{ '--i': 0 } as CSSProperties}>
              <span className="ls-schedule__time">{times[0]}</span>
              {nextLecture ? (
                <Link to={`lecture/${nextLecture.id}`} className="ls-schedule__show">
                  <span className="ls-schedule__kind">TAPE {String(nextLectureIndex + 1).padStart(2, '0')}</span>
                  <span className="ls-schedule__name">{nextLecture.title}</span>
                  <span className="ls-schedule__note">
                    {nextLectureWatched > 0 ? `Resume · ${Math.round(nextLectureWatched * 100)}% wound` : `${nextLecture.minutes} min · ${nextLecture.level}`}
                  </span>
                  <span className="ls-schedule__go" aria-hidden="true">
                    ▶
                  </span>
                </Link>
              ) : (
                <Link to={`lecture/${lectures[0].id}`} className="ls-schedule__show">
                  <span className="ls-schedule__kind">ALL TAPES</span>
                  <span className="ls-schedule__name">Every tape recorded — replay a favourite</span>
                  <span className="ls-schedule__note">Golden Ears earned</span>
                  <span className="ls-schedule__go" aria-hidden="true">
                    ▶
                  </span>
                </Link>
              )}
            </li>
            <li style={{ '--i': 1 } as CSSProperties}>
              <span className="ls-schedule__time">{times[1]}</span>
              <Link to={`practice/${nextPractice.id}`} className="ls-schedule__show">
                <span className="ls-schedule__kind">{formatFreq(nextStation.freq)} FM</span>
                <span className="ls-schedule__name">{nextPractice.title}</span>
                <span className="ls-schedule__note">
                  {unattempted ? `${nextPractice.questionCount} questions · first broadcast` : `Boost your weakest signal · best ${stats.best[nextPractice.id]?.score}/${stats.best[nextPractice.id]?.total}`}
                </span>
                <span className="ls-schedule__go" aria-hidden="true">
                  ▶
                </span>
              </Link>
            </li>
            <li style={{ '--i': 2 } as CSSProperties}>
              <span className="ls-schedule__time">{times[2]}</span>
              <ScrollLink to="ls-signal" className="ls-schedule__show" onClick={() => sfx.click()}>
                <span className="ls-schedule__kind">SIGNAL CHECK</span>
                <span className="ls-schedule__name">{today.met ? 'Tonight’s goal reached' : `${today.goal - today.xp} XP to tonight’s goal`}</span>
                <span className="ls-schedule__meter" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, (today.xp / today.goal) * 100)}%` }} />
                </span>
                <span className="ls-schedule__go" aria-hidden="true">
                  ↓
                </span>
              </ScrollLink>
            </li>
          </ol>
        </div>
      </section>

      {/* ============================================================ tape rack */}
      <section ref={rackRef} className={`ls-section ls-tapes ${rackSeen ? 'is-seen' : ''}`} aria-labelledby="ls-tapes-title">
        <header className="ls-section__head">
          <p className="ls-kicker">SIDE A · THE TAPE RACK</p>
          <h2 id="ls-tapes-title" className="ls-h2">
            Lectures on tape
          </h2>
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
                  to={`lecture/${l.id}`}
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

      {/* ============================================================== dial */}
      <section className="ls-section ls-dial" id="ls-dial" aria-labelledby="ls-dial-title">
        <header className="ls-section__head">
          <p className="ls-kicker">SIDE B · THE DIAL</p>
          <h2 id="ls-dial-title" className="ls-h2">
            Practice broadcasts
          </h2>
          <p className="ls-section__lead">
            {capital(say(practiceSets.length))} stations, one for each part of the test. Turn the dial, tune in, and the voices read the
            recording live, with real reading time before each block of questions.
          </p>
        </header>
        <Tuner sets={practiceSets} best={stats.best} attempts={stats.attempts} initial={nextPractice.id} />
      </section>

      {/* ============================================================ console */}
      <section ref={consoleRef} className={`ls-section ls-signal ${consoleSeen ? 'is-seen' : ''}`} id="ls-signal" aria-labelledby="ls-signal-title">
        <header className="ls-section__head">
          <p className="ls-kicker">MASTER CONTROL</p>
          <h2 id="ls-signal-title" className="ls-h2">
            Signal strength
          </h2>
          <p className="ls-section__lead">{consoleCopy}</p>
        </header>

        <div className="ls-rackmount">
          <div className="ls-mod ls-mod--vu" style={{ '--i': 0 } as CSSProperties}>
            <h3 className="ls-mod__title">AVERAGE ACCURACY</h3>
            <VuMeter
              value={stats.accuracy}
              label={stats.accuracy === null ? 'No practice scores yet' : `Average accuracy ${Math.round(stats.accuracy * 100)}% over the last ${Math.min(10, stats.attempts.length)} broadcasts`}
            />
            <p className="ls-mod__hero">
              {stats.accuracy === null ? '—' : `${Math.round(stats.accuracy * 100)}%`}
              <small>{stats.accuracy === null ? 'waiting for your first broadcast' : `last ${Math.min(10, stats.attempts.length)} broadcasts`}</small>
            </p>
          </div>

          <div className="ls-mod ls-mod--tapes" style={{ '--i': 1 } as CSSProperties}>
            <h3 className="ls-mod__title">TAPES RECORDED</h3>
            <p className="ls-counter" aria-label={`${stats.lecturesCompleted} of ${stats.lecturesTotal} lectures completed`}>
              <span className="ls-counter__wheel">{String(stats.lecturesCompleted).padStart(2, '0')}</span>
              <span className="ls-counter__sep">/</span>
              <span className="ls-counter__wheel is-dim">{String(stats.lecturesTotal).padStart(2, '0')}</span>
            </p>
            <ul className="ls-leds" aria-hidden="true">
              {lectures.map((l, i) => (
                <li key={l.id} className={lectureState[i]?.completedAt ? 'is-on' : (lectureState[i]?.watched ?? 0) > 0 ? 'is-half' : ''} />
              ))}
            </ul>
            <p className="ls-mod__note">{Math.round(stats.lectureFraction * 100)}% of all tape wound</p>
          </div>

          <div className="ls-mod ls-mod--xp" style={{ '--i': 2 } as CSSProperties}>
            <h3 className="ls-mod__title">LISTENING XP</h3>
            <p className="ls-seg" aria-label={`${stats.xp} listening XP`}>
              <span className="ls-seg__ghost" aria-hidden="true">
                8888
              </span>
              <span className="ls-seg__value" aria-hidden="true">
                {String(stats.xp).padStart(4, ' ')}
              </span>
            </p>
            <XpBar level={level} xp={xp} className="ls-xp" />
          </div>

          <div className="ls-mod ls-mod--night" style={{ '--i': 3 } as CSSProperties}>
            <h3 className="ls-mod__title">TONIGHT</h3>
            <div className="ls-night">
              <StreakFlame streak={streak} scale={4} className="ls-night__flame" />
              <p className="ls-night__copy">
                <strong>{streak.days ? `${streak.days}-night streak` : 'No streak yet'}</strong>
                <span>{streak.activeToday ? 'Lit for tonight' : streak.days ? 'Study tonight to keep it' : 'Study tonight to light it'}</span>
                {streak.best > 1 && <span>Best: {streak.best} nights</span>}
              </p>
            </div>
            <div
              className="ls-goal"
              role="progressbar"
              aria-label="Tonight’s XP goal"
              aria-valuemin={0}
              aria-valuemax={today.goal}
              aria-valuenow={Math.min(today.xp, today.goal)}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={(i + 1) / 10 <= today.xp / today.goal + 0.0001 ? 'is-on' : ''} />
              ))}
            </div>
            <p className="ls-mod__note">
              {today.xp}/{today.goal} XP {today.met ? '· goal met ✓' : 'tonight'}
            </p>
          </div>

          <div className="ls-mod ls-mod--scope" style={{ '--i': 4 } as CSSProperties}>
            <h3 className="ls-mod__title">SIGNAL HISTORY</h3>
            <div className="ls-scope">
              <AccuracyChart points={chartPoints} seen={consoleSeen} />
            </div>
            {chartPoints.length < 2 && (
              <p className="ls-mod__note">
                {chartPoints.length ? 'One point on the scope. Your next broadcast draws the first line.' : 'Every broadcast you finish adds a point here, so you can watch your signal climb.'}
              </p>
            )}
          </div>

          <div className="ls-mod ls-mod--bests" style={{ '--i': 5 } as CSSProperties}>
            <h3 className="ls-mod__title">STATION BESTS</h3>
            <ul className="ls-bests">
              {practiceSets.map((p, i) => {
                const st = stationFor(p.id, i)
                const b = stats.best[p.id]
                const acc = accuracyOf(p.id)
                return (
                  <li key={p.id}>
                    <Link to={`practice/${p.id}`} className="ls-bests__row">
                      <span className="ls-bests__freq">{formatFreq(st.freq)}</span>
                      <span className="ls-bests__name">
                        {st.part}
                        <small>{p.title.replace(/^Part \d · /, '')}</small>
                      </span>
                      <SignalBars accuracy={acc} />
                      <span className="ls-bests__score">{b ? `${b.score}/${b.total}` : '—'}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
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
