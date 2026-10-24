import { useMemo, type CSSProperties } from 'react'
import type { Attempt } from '../../../../learn/progress'
import { sfx } from '../../../../learn/sfx'
import type { PracticeInfo } from '../../../../learn/types'
import { formatClock } from '../../../../learn/useTimer'
import { DjOwl } from '../components/DjOwl'
import { SignalBars } from '../components/SignalBars'
import { questionsOf, type PracticeSet } from '../practice-data'
import { accentName, accentOf, estimateSeconds, type Cast, type VoiceStatus } from '../speech'
import { DIAL_MAX, DIAL_MIN, formatFreq, type Station } from '../stations'
import type { Draft } from './draft'
import { prefersReducedMotion } from '../hooks'
import { RATES, readingSeconds, speakerColor, spokenLines, type AudioSource, type Mode } from './script'

/** DJ Hoot's advice for each broadcast (strategy only, never answers). */
const TIPS: Record<string, string> = {
  'part1-enrolment':
    'Names and numbers get spelt out tonight. Write each letter as you hear it, and listen past the first number: callers love to correct themselves.',
  'part2-park': 'For the map, find the main gate first and walk the route with your finger. “Opposite” means across the path, facing it.',
  'part3-podcast': 'Three voices on air. Track who says what, and remember: the plan they settle on beats the first idea they mention.',
  'part4-soundscapes': 'No break in Part 4. Read all ten gaps now, then listen for signposts like “turning now to” to keep your place.',
}

interface BriefingProps {
  info: PracticeInfo
  set: PracticeSet
  station: Station
  mode: Mode
  onMode: (mode: Mode) => void
  audio: AudioSource
  onAudio: (audio: AudioSource) => void
  rate: number
  onRate: (rate: number) => void
  voices: SpeechSynthesisVoice[]
  voiceStatus: VoiceStatus
  cast: Cast
  history: Attempt[]
  best?: Attempt
  /** A broadcast left half-way on this device, if any. */
  draft: Draft | null
  onStart: () => void
  onResume: () => void
}

const shortDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
const pct = (a: Attempt) => (a.total ? Math.round((a.score / a.total) * 100) : 0)

export function Briefing(props: BriefingProps) {
  const { info, set, station, mode, audio, rate, voices, voiceStatus, cast, history, best, draft } = props
  const title = info.title.replace(/^Part \d · /, '')
  const freq = formatFreq(station.freq)
  const cast0 = set.speakers.filter((s) => s.id !== 'ann')
  const audioSeconds = useMemo(() => estimateSeconds(spokenLines(set)), [set])
  const reading = readingSeconds(set)
  const blocks = set.script.filter((i) => 'wait' in i).length
  const limit = set.groups.find((g) => g.limit)?.limit
  const voicesReady = voiceStatus === 'ready'
  const accents = [...new Set(voices.map((v) => accentName(accentOf(v))))]
  const recorded = Boolean(set.audio)
  const transcript = audio === 'transcript' || (!recorded && !voicesReady)
  const needle = ((station.freq - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)) * 100
  const total = questionsOf(set).length
  const draftAnswered = draft ? Object.values(draft.answers).filter((v) => v.trim()).length : 0
  const settings = `${mode === 'exam' ? 'Exam mode' : 'Practice mode'} · ${rate}× · ${transcript ? 'transcript' : recorded ? 'recording' : 'voices'}`

  const toSetup = () => {
    sfx.click()
    const panel = document.getElementById('ls-setup')
    panel?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    panel?.querySelector<HTMLInputElement>('input:checked')?.focus({ preventScroll: true })
  }

  return (
    <div className="ls-brief">
      <header className="ls-brief__hero">
        <div className="ls-brief__copy">
          <p className="ls-kicker">
            <span className="ls-live-dot" aria-hidden="true" /> {freq} FM · {station.part} · {station.callsign.toUpperCase()}
          </p>
          <h1 className="ls-brief__title">{title}</h1>
          <p className="ls-brief__summary">{info.summary}</p>
          <ul className="ls-brief__chips" aria-label="About this broadcast">
            <li className="ls-chip ls-chip--teal">{info.level}</li>
            <li className="ls-chip">~{info.minutes} min</li>
            <li className="ls-chip">{info.questionCount} questions</li>
            {info.kinds.map((k) => (
              <li key={k} className="ls-chip">
                {k}
              </li>
            ))}
          </ul>

          {/* the main action, above the fold: start (or resume) with the current settings */}
          <div className={`ls-brief__go ${draft ? 'has-draft' : ''}`}>
            {draft ? (
              <>
                <button type="button" className="ls-golive ls-golive--hero ls-golive--resume" onClick={props.onResume}>
                  <span className="ls-golive__lamp" aria-hidden="true" />
                  <span className="ls-golive__text">Resume</span>
                  <span className="ls-golive__sub">
                    {draftAnswered}/{total} answered · {formatClock(draft.elapsed)} on air · {mode === 'exam' ? 'exam' : 'practice'}
                  </span>
                </button>
                <div className="ls-brief__go-meta">
                  <p>
                    <strong>Your broadcast is waiting.</strong> Your answers are saved, and the recording picks up from the line you reached.
                  </p>
                  <button type="button" className="ls-linkbtn" onClick={props.onStart}>
                    Start over instead
                  </button>
                </div>
              </>
            ) : (
              <>
                <button type="button" className="ls-golive ls-golive--hero" onClick={props.onStart}>
                  <span className="ls-golive__lamp" aria-hidden="true" />
                  <span className="ls-golive__text">Go live</span>
                  <span className="ls-golive__sub">{freq} FM · {settings}</span>
                </button>
                <div className="ls-brief__go-meta">
                  <p>{history.length ? `Broadcast ${history.length + 1} on this station. Beat ${best?.score}/${best?.total}.` : 'Your first broadcast on this station.'}</p>
                  <button type="button" className="ls-linkbtn" onClick={toSetup}>
                    Change mode or speed <span className="ls-linkbtn__arrow" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="ls-faceplate" aria-hidden="true">
          <div className="ls-faceplate__screen">
            <span className="ls-faceplate__label">TUNED TO</span>
            <span className="ls-faceplate__freq">
              <span className="ls-faceplate__ghost">888.8</span>
              <span className="ls-faceplate__value">{freq.padStart(5, ' ')}</span>
            </span>
            <span className="ls-faceplate__unit">MHz FM</span>
          </div>
          <div className="ls-faceplate__band">
            <span className="ls-faceplate__needle" style={{ left: `${4 + needle * 0.92}%` } as CSSProperties} />
          </div>
          <div className="ls-faceplate__signal">
            <SignalBars accuracy={best ? best.score / best.total : null} className="ls-bars--big" />
            <span>{best ? `BEST ${best.score}/${best.total}` : 'NO SIGNAL YET'}</span>
          </div>
        </div>
      </header>

      <div className="ls-brief__grid">
        {/* ---------------------------------------------------------- show */}
        <section className="ls-panel ls-brief__show" aria-labelledby="ls-show-title">
          <h2 className="ls-panel__title" id="ls-show-title">
            Tonight’s broadcast
          </h2>
          <blockquote className="ls-brief__context">
            <p>{set.context}</p>
          </blockquote>

          <h3 className="ls-panel__sub">On air</h3>
          <ul className="ls-brief__cast">
            {cast0.map((sp) => {
              const v = voices.find((x) => x.voiceURI === cast[sp.id]?.voiceURI)
              return (
                <li key={sp.id}>
                  <span className="ls-brief__avatar" style={{ '--ls-c': speakerColor(set, sp.id) } as CSSProperties} aria-hidden="true">
                    {sp.name.replace('Dr ', '').charAt(0)}
                  </span>
                  <span className="ls-brief__who">
                    <strong>{sp.name}</strong>
                    <small>{sp.role}</small>
                  </span>
                  <span className="ls-brief__voice">
                    {transcript ? 'Transcript' : recorded ? `${accentName(sp.accents[0] ?? 'other')} voice` : v ? `${accentName(accentOf(v))} voice` : '—'}
                  </span>
                </li>
              )
            })}
          </ul>

          <h3 className="ls-panel__sub">What to expect</h3>
          <ul className="ls-brief__expect">
            <li>
              <span className="ls-brief__icon ls-brief__icon--wave" aria-hidden="true" />
              <span>
                <strong>About {Math.max(1, Math.round(audioSeconds / 60))} minutes of recording</strong>, {spokenLines(set).length} lines across{' '}
                {set.speakers.length} {set.speakers.length === 1 ? 'voice' : 'voices'}, announcer included.
              </span>
            </li>
            <li>
              <span className="ls-brief__icon ls-brief__icon--clock" aria-hidden="true" />
              <span>
                <strong>{formatClock(reading)} of silent reading time</strong> in {blocks} {blocks === 1 ? 'block' : 'blocks'}, just like test
                day. Use it to read ahead.
              </span>
            </li>
            <li>
              <span className="ls-brief__icon ls-brief__icon--sheet" aria-hidden="true" />
              <span>
                <strong>{info.questionCount} questions</strong>: {info.kinds.join(', ').toLowerCase()}. Answers come in order.
              </span>
            </li>
            {limit && (
              <li>
                <span className="ls-brief__icon ls-brief__icon--pen" aria-hidden="true" />
                <span>
                  Write <strong>{limit.text}</strong>. Spelling counts; capitals don’t.
                </span>
              </li>
            )}
          </ul>
        </section>

        {/* --------------------------------------------------------- setup */}
        <section className="ls-panel ls-brief__setup" id="ls-setup" aria-labelledby="ls-setup-title">
          <h2 className="ls-panel__title" id="ls-setup-title">
            How will you listen?
          </h2>
          <div className="ls-modes" role="radiogroup" aria-label="Listening mode">
            {(
              [
                ['exam', 'Exam mode', 'Test-day rules', ['Plays once, start to finish', 'No pausing, no replays', 'No captions']],
                ['practice', 'Practice mode', 'Learn the tricks', ['Pause, rewind, replay any line', 'Skip reading time', 'Live captions and word-limit hints']],
              ] as const
            ).map(([id, name, tag, bullets]) => (
              <label key={id} className={`ls-mode ls-mode--${id} ${mode === id ? 'is-on' : ''}`}>
                <input
                  type="radio"
                  name="ls-mode"
                  value={id}
                  checked={mode === id}
                  onChange={() => {
                    sfx.click()
                    props.onMode(id)
                  }}
                />
                <span className="ls-mode__icon" aria-hidden="true" />
                <span className="ls-mode__head">
                  <span className="ls-mode__name">{name}</span>
                  <span className="ls-mode__tag">{tag}</span>
                </span>
                <ul className="ls-mode__list">
                  {bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </label>
            ))}
          </div>

          <div className="ls-brief__row">
            <span className="ls-desk__label" id="ls-brief-audio">
              AUDIO
            </span>
            <div className="ls-segbtns" role="group" aria-labelledby="ls-brief-audio">
              <button
                type="button"
                className={!transcript ? 'is-on' : ''}
                aria-pressed={!transcript}
                disabled={!recorded && !voicesReady}
                onClick={() => {
                  sfx.click()
                  props.onAudio('voices')
                }}
              >
                {recorded ? 'Recording' : 'Voices'}
              </button>
              <button
                type="button"
                className={transcript ? 'is-on' : ''}
                aria-pressed={transcript}
                onClick={() => {
                  sfx.click()
                  props.onAudio('transcript')
                }}
              >
                Transcript
              </button>
            </div>
          </div>
          <p className={`ls-brief__voices ${recorded || voicesReady ? '' : 'is-warn'}`} aria-live="polite">
            {recorded
              ? 'A studio recording with real voices and accents, as in the exam. Prefer to read? Switch to the transcript at any time before you start.'
              : voiceStatus === 'loading'
              ? 'Looking for speech voices on this device…'
              : voicesReady
                ? `${voices.length} English ${voices.length === 1 ? 'voice' : 'voices'} found (${accents.slice(0, 4).join(', ')}). Each speaker gets their own voice, so you hear different accents, as in the real test.`
                : 'This browser has no English speech voices, so the broadcast runs in transcript mode: every line appears word by word at speaking pace. The questions, timing and marking are exactly the same.'}
          </p>

          <div className="ls-brief__row">
            <span className="ls-desk__label" id="ls-brief-speed">
              SPEED
            </span>
            <div className="ls-segbtns" role="group" aria-labelledby="ls-brief-speed">
              {RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={r === rate ? 'is-on' : ''}
                  aria-pressed={r === rate}
                  onClick={() => {
                    sfx.click()
                    props.onRate(r)
                  }}
                >
                  {r}×
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="ls-golive" onClick={draft ? props.onResume : props.onStart}>
            <span className="ls-golive__lamp" aria-hidden="true" />
            <span className="ls-golive__text">{draft ? 'Resume' : 'Go live'}</span>
            <span className="ls-golive__sub">{draft ? `${draftAnswered}/${total} answered · ${freq} FM` : `${freq} FM · ${settings}`}</span>
          </button>
          <p className="ls-brief__fine">The clock starts when you go live. Nothing is scored until you submit your answers.</p>
        </section>

        {/* ----------------------------------------------------------- log */}
        <aside className="ls-panel ls-brief__log" aria-labelledby="ls-log-title">
          <h2 className="ls-panel__title" id="ls-log-title">
            Station log
          </h2>
          {history.length ? (
            <>
              <p className="ls-brief__best">
                <span className="ls-brief__best-k">Best</span>
                <span className="ls-brief__best-v">
                  {best?.score}/{best?.total}
                </span>
                <span className="ls-brief__best-n">
                  {history.length} {history.length === 1 ? 'broadcast' : 'broadcasts'}
                </span>
              </p>
              <table className="ls-log">
                <caption className="visually-hidden">Your broadcasts on this station, newest first</caption>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Score</th>
                    <th scope="col">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 6).map((a, i) => (
                    <tr key={a.at + i} className={a === best ? 'is-best' : ''}>
                      <td>{shortDate(a.at)}</td>
                      <td>
                        {a.score}/{a.total}
                      </td>
                      <td>
                        <span className="ls-log__meter" aria-hidden="true">
                          <span style={{ width: `${pct(a)}%` }} />
                          <i />
                        </span>
                        <span className="ls-log__pct">{pct(a)}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="ls-brief__fine">The mark on each bar is the 70% line, where the celebrations start.</p>
            </>
          ) : (
            <div className="ls-brief__empty">
              <SignalBars accuracy={null} className="ls-bars--big" />
              <p>
                <strong>No broadcasts logged yet.</strong> Your first score lands here, and every retry shows how much stronger your signal is
                getting.
              </p>
            </div>
          )}

          <div className="ls-brief__dj">
            <span className="ls-brief__dj-owl" aria-hidden="true">
              <DjOwl scale={4} />
            </span>
            <p className="ls-brief__tip">
              <span className="ls-brief__tip-k">DJ HOOT’S TIP</span>
              {TIPS[set.id] ?? 'Use every second of reading time to look ahead at the next questions.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
