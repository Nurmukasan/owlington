import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { profileResultPath } from '../../../../learn/results/results'
import { ProgressRing } from '../../../../learn/components/ProgressWidgets'
import { ScrollLink } from '../../../../learn/components/ScrollLink'
import { floatText, pixelConfetti } from '../../../../learn/fx'
import type { Attempt } from '../../../../learn/progress'
import { sfx } from '../../../../learn/sfx'
import type { Lecture, PracticeInfo } from '../../../../learn/types'
import { scrollToId } from '../../../../learn/scroll'
import { formatClock } from '../../../../learn/useTimer'
import { bandForAccuracy, bandText, type Marked, type Verdict } from '../answers'
import { DjOwl } from '../components/DjOwl'
import { useCountUp, useReducedMotion } from '../hooks'
import { isPause, questionsOf, type PracticeSet, type Question, type SpokenLine } from '../practice-data'
import { playClipOnce, speakOnce, type Cast } from '../speech'
import { formatFreq, stationFor, type Station } from '../stations'
import { ParkMap } from './ParkMap'
import { PlanMap } from './PlanMap'
import { evidenceIndex, optionText, piecesOf, questionLabel, speakerColor, type Answers, type Mode } from './script'

export interface Result {
  marks: Marked[]
  score: number
  total: number
  attempt: Attempt
  prevBest?: Attempt
  durationSec: number
  mode: Mode
  transcript: boolean
}

interface ReportProps {
  info: PracticeInfo
  set: PracticeSet
  station: Station
  result: Result
  answers: Answers
  voices: SpeechSynthesisVoice[]
  cast: Cast
  rate: number
  next?: PracticeInfo
  nextIndex: number
  lecture?: Lecture
  onRetry: () => void
}

const VERDICT: Record<Verdict, string> = {
  correct: 'Correct',
  wrong: 'Not quite',
  blank: 'Left blank',
  limit: 'Over the word limit',
  spelling: 'Spelling slip',
  plural: 'Singular / plural slip',
  misheard: 'Misheard?',
}

/** The lesson behind each kind of near miss. */
const HINT: Partial<Record<Verdict, string>> = {
  spelling: 'So close! You heard the right word, but on test day a misspelt answer scores nothing. Check it letter by letter.',
  plural: 'Right word, wrong form. Check whether the gap needs one thing or several: words like “a” or “some” before the gap give it away.',
  misheard: 'That is a different word that sounds close to the answer. Replay the line below and listen for the first sound.',
  limit: 'The answer may be in there, but anything over the word limit scores nothing. Copy only the words the gap needs.',
}

const CONFETTI = ['#6fe3cf', '#7ff7ff', '#9b84ff', '#ff6fcf', '#ffcf5c', '#ffffff']

/**
 * Jumps to a review card or transcript line and makes it glow. In-page jumps never touch
 * the URL hash (under hash routing that is the route), so :target can't do the glow.
 */
function jumpTo(id: string) {
  scrollToId(id, 'center')
  const el = document.getElementById(id)
  if (!el) return
  el.classList.remove('is-flash')
  void el.offsetWidth // restart the animation on a second click
  el.classList.add('is-flash')
  window.setTimeout(() => el.classList.remove('is-flash'), 1600)
}

function tierOf(accuracy: number) {
  if (accuracy >= 0.9) return { name: 'Crystal clear', line: 'Hoo-hoo! Barely a word slipped past you. That’s the ear of a Band 8 listener.' }
  if (accuracy >= 0.7) return { name: 'Strong signal', line: 'Lovely listening! You caught the traps that catch most candidates. Look at the few you missed and this station is yours.' }
  if (accuracy >= 0.5) return { name: 'Getting clearer', line: 'Good signal, a bit of static. Every mistake below has a reason, and once you see the trick you won’t fall for it twice.' }
  return { name: 'Static on the line', line: 'Rough night on the airwaves, and that’s fine: this is where the learning happens. Read the review, then tune in again.' }
}

export function Report({ info, set, station, result, answers, voices, cast, rate, next, nextIndex, lecture, onRetry }: ReportProps) {
  const reduced = useReducedMotion()
  const scoreRef = useRef<HTMLDivElement>(null)
  const { score, total, attempt, prevBest, durationSec, marks } = result
  const accuracy = total ? score / total : 0
  const percent = Math.round(accuracy * 100)
  const shownPercent = Math.round(useCountUp(percent, true, 1300))
  const shownScore = Math.round(useCountUp(score, true, 1100))
  const [ring, setRing] = useState(reduced ? accuracy : 0)
  const [done, setDone] = useState(reduced)
  const tier = tierOf(accuracy)
  const prevAccuracy = prevBest && prevBest.total ? prevBest.score / prevBest.total : null
  const newBest = prevAccuracy === null || accuracy > prevAccuracy
  const celebrate = accuracy >= 0.7
  const band = bandForAccuracy(accuracy)
  const questions = questionsOf(set)
  const wrong = marks.filter((m) => !m.correct).length
  const [filter, setFilter] = useState<'all' | 'missed'>('all')
  const [traps, setTraps] = useState(true)
  const [speaking, setSpeaking] = useState<number | null>(null)
  const stopRef = useRef<() => void>(() => {})
  const mapGroup = set.groups.find((g) => g.type === 'map')

  // The reveal: lamps tally up, then the verdict lands (all triggered by the student's submit).
  useEffect(() => {
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms))
    later(() => setRing(accuracy), 120)
    marks.forEach((m, i) => {
      if (m.correct) later(() => sfx.click(), 420 + i * 110)
    })
    const end = 420 + marks.length * 110 + 220
    later(() => {
      setDone(true)
      if (celebrate) {
        sfx.complete()
        pixelConfetti(scoreRef.current ?? undefined, { colors: CONFETTI, count: 64 })
        floatText(newBest ? 'New station best!' : tier.name, scoreRef.current ?? undefined, '#b8fff2')
      } else sfx.page()
    }, end)
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [accuracy, celebrate, marks, newBest, tier.name])

  useEffect(() => () => stopRef.current(), [])

  const hear = (n: number, line: SpokenLine) => {
    stopRef.current()
    if (speaking === n) {
      setSpeaking(null)
      return
    }
    sfx.click()
    setSpeaking(n)
    const done = () => setSpeaking((s) => (s === n ? null : s))
    const at = set.script.indexOf(line)
    const clip = set.audio?.clips[at]
    stopRef.current = set.audio && clip ? playClipOnce(set.audio, clip, rate, done) : speakOnce(line, cast[line.s], voices, rate, done)
  }

  const reviewed = questions.filter((q) => filter === 'all' || !marks.find((m) => m.n === q.n)?.correct)
  const nextStation = next ? stationFor(next.id, nextIndex) : undefined
  const reveal = mapGroup
    ? Object.fromEntries(mapGroup.questions.map((q) => [q.answer, q.kind === 'letter' ? q.label : '']))
    : undefined
  const misses: [number, string, string][] = mapGroup
    ? mapGroup.questions.flatMap((q) => {
        const m = marks.find((x) => x.n === q.n)
        return m && m.given && !m.correct ? [[q.n, m.given, q.answer] as [number, string, string]] : []
      })
    : []

  return (
    <div className="ls-report">
      {/* ======================================================== scoreboard */}
      <section className={`ls-board ${celebrate ? 'is-win' : ''} ${done ? 'is-done' : ''}`} aria-labelledby="ls-board-title">
        <div className="ls-board__screen">
          <div className="ls-board__score" ref={scoreRef}>
            <ProgressRing
              value={ring}
              size={208}
              stroke={14}
              color="var(--ls-teal)"
              track="rgb(111 227 207 / 0.14)"
              label={`Accuracy ${percent}%`}
              className="ls-board__ring"
            >
              <span className="ls-board__pct">
                {shownPercent}
                <small>%</small>
              </span>
              <span className="ls-board__frac">
                {shownScore} of {total} correct
              </span>
            </ProgressRing>
          </div>

          <div className="ls-board__copy">
            <p className="ls-kicker">
              {formatFreq(station.freq)} FM · {station.part} · {result.mode === 'exam' ? 'EXAM MODE' : 'PRACTICE MODE'}
            </p>
            <h1 className="ls-board__title" id="ls-board-title">
              <span className="ls-board__verdict">{done ? tier.name : 'Tuning in…'}</span>
              {newBest && done && <span className="ls-board__best">{prevBest ? 'New best' : 'First score'}</span>}
            </h1>
            <div className="ls-board__dj">
              <span className="ls-board__owl" aria-hidden="true">
                <DjOwl happy={celebrate && done} talking={!done} scale={4} />
              </span>
              <p className="ls-board__line">{done ? tier.line : 'Hold on, the scores are coming in over the airwaves…'}</p>
            </div>

            <ol className="ls-lamps" aria-label="Question results">
              {marks.map((m, i) => (
                <li key={m.n} className={m.correct ? 'is-ok' : 'is-bad'} style={{ '--i': i } as CSSProperties}>
                  <ScrollLink
                    to={`ls-review-${m.n}`}
                    aria-label={`Question ${m.n}: ${VERDICT[m.verdict]}`}
                    onClick={(e) => {
                      e.preventDefault()
                      sfx.click()
                      // a correct answer is hidden while "Missed" is on: show them all first
                      if (m.correct && filter === 'missed') setFilter('all')
                      window.requestAnimationFrame(() => jumpTo(`ls-review-${m.n}`))
                    }}
                  >
                    {m.n}
                  </ScrollLink>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <dl className="ls-board__stats">
          <div>
            <dt>Score</dt>
            <dd>
              {score}/{total}
            </dd>
          </div>
          <div>
            <dt>{attempt.repeat ? 'XP · retake' : 'XP earned'}</dt>
            <dd className="ls-board__xp">{attempt.repeat ? '0' : `+${attempt.xp}`}</dd>
          </div>
          <div>
            <dt>Band estimate</dt>
            <dd>{bandText(band)}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{formatClock(durationSec)}</dd>
          </div>
          <div>
            <dt>Previous best</dt>
            <dd>{prevBest ? `${prevBest.score}/${prevBest.total}` : '—'}</dd>
          </div>
        </dl>
        <p className="ls-board__fine">
          The band is a rough guide: it assumes you kept this accuracy across all 40 questions of a full test.
          {attempt.repeat && ' This was a retake: XP is earned on the first attempt only.'}
        </p>

        <div className="ls-board__actions">
          <ScrollLink to="ls-review" className="ls-btn ls-btn--teal ls-btn--big" onClick={() => sfx.click()}>
            Review {wrong ? `${wrong} to learn from` : 'answers'} <span className="ls-icon-down" aria-hidden="true" />
          </ScrollLink>
          <button type="button" className="ls-btn ls-btn--ghost ls-btn--big" onClick={onRetry}>
            <span className="ls-icon-replay" aria-hidden="true" /> Tune in again
          </button>
          {next && nextStation && (
            <Link to={`/student/listening/practice/${next.id}`} className="ls-btn ls-btn--ghost ls-btn--big" onClick={() => sfx.click()}>
              Next: {formatFreq(nextStation.freq)} FM <span aria-hidden="true">»</span>
            </Link>
          )}
        </div>
      </section>

      {/* ============================================================ review */}
      <section className="ls-review" id="ls-review" aria-labelledby="ls-review-title">
        <header className="ls-review__head">
          <div>
            <p className="ls-kicker">THE REPLAY</p>
            <h2 className="ls-h2 ls-h2--small" id="ls-review-title">
              Answer review
            </h2>
          </div>
          <div className="ls-segbtns" role="group" aria-label="Show questions">
            <button type="button" className={filter === 'all' ? 'is-on' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
              All {questions.length}
            </button>
            <button
              type="button"
              className={filter === 'missed' ? 'is-on' : ''}
              aria-pressed={filter === 'missed'}
              onClick={() => setFilter('missed')}
              disabled={!wrong}
            >
              Missed {wrong}
            </button>
          </div>
        </header>

        {mapGroup && reveal && (
          <figure className="ls-review__map">
            {mapGroup.map ? <PlanMap spec={mapGroup.map} reveal={reveal} misses={misses} /> : <ParkMap reveal={reveal} misses={misses} />}
            <figcaption>
              {mapGroup.map
                ? 'Answer key: each place where the speaker says it is. Letters with no label are never used.'
                : 'Answer key for the map: every place where the ranger says it is. C and F are never used.'}
              {misses.length > 0 && ' Red tags show where your wrong answers went, with a dotted hop to the right place.'}
            </figcaption>
          </figure>
        )}

        <ol className="ls-cards">
          {reviewed.map((q, i) => {
            const m = marks.find((x) => x.n === q.n)!
            return (
              <ReviewCard
                key={q.n}
                q={q}
                m={m}
                set={set}
                index={i}
                given={answers[q.n] ?? ''}
                canHear={Boolean(set.audio) || voices.length > 0}
                speaking={speaking === q.n}
                onHear={hear}
              />
            )
          })}
        </ol>
        {!reviewed.length && <p className="ls-review__clean">Nothing missed. Every answer was spot on.</p>}
      </section>

      {/* ======================================================== transcript */}
      <section className="ls-transcript" aria-labelledby="ls-transcript-title">
        <header className="ls-review__head">
          <div>
            <p className="ls-kicker">THE SCRIPT</p>
            <h2 className="ls-h2 ls-h2--small" id="ls-transcript-title">
              Full transcript
            </h2>
          </div>
          <label className="ls-switch">
            <input type="checkbox" checked={traps} onChange={(e) => setTraps(e.target.checked)} />
            <span className="ls-switch__track" aria-hidden="true" />
            Show traps
          </label>
        </header>
        <p className="ls-transcript__legend">
          <span className="ls-hl ls-hl--answer">answer</span> where each answer is spoken
          {traps && (
            <>
              {' '}
              · <span className="ls-hl ls-hl--trap">trap</span> a distractor planted to catch you
            </>
          )}
        </p>
        <ol className="ls-script">
          {set.script.map((item, i) => {
            if (isPause(item))
              return (
                <li key={i} className="ls-script__pause">
                  <span>
                    {item.wait} seconds to look at {item.label}
                  </span>
                </li>
              )
            const sp = set.speakers.find((s) => s.id === item.s)
            const pieces = piecesOf(item, set, traps)
            const notes = pieces.filter((p) => p.kind === 'trap')
            return (
              <li key={i} id={`ls-line-${i}`} className={`ls-script__line ${item.s === 'ann' ? 'is-ann' : ''}`}>
                <span className="ls-script__who" style={{ '--ls-c': speakerColor(set, item.s) } as CSSProperties}>
                  {sp?.name}
                </span>
                <div className="ls-script__body">
                  <p>
                    {pieces.map((p, j) =>
                      p.kind === 'answer' ? (
                        <mark key={j} className="ls-hl ls-hl--answer">
                          <sup>Q{p.q}</sup>
                          {p.text}
                        </mark>
                      ) : p.kind === 'trap' ? (
                        <span key={j} className="ls-hl ls-hl--trap">
                          <sup>trap</sup>
                          {p.text}
                        </span>
                      ) : (
                        <span key={j}>{p.text}</span>
                      ),
                    )}
                  </p>
                  {notes.map((p, j) => (
                    <p key={j} className="ls-script__note">
                      <strong>Q{p.q} trap:</strong> {p.note}
                    </p>
                  ))}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ============================================================== next */}
      <section className="ls-after" aria-labelledby="ls-after-title">
        <h2 className="ls-h2 ls-h2--small" id="ls-after-title">
          What’s next on Owl FM
        </h2>
        <ul className="ls-after__cards">
          <li>
            <button type="button" className="ls-after__card" onClick={onRetry}>
              <span className="ls-after__k">RETUNE · {formatFreq(station.freq)} FM</span>
              <span className="ls-after__t">Beat {score}/{total} on this station</span>
              <span className="ls-after__d">
                {result.mode === 'practice' ? 'Ready for test-day rules? Try exam mode: one play, no pauses.' : 'Hear it again in practice mode and pause on every trap.'}
              </span>
            </button>
          </li>
          {next && nextStation && (
            <li>
              <Link to={`/student/listening/practice/${next.id}`} className="ls-after__card" onClick={() => sfx.click()}>
                <span className="ls-after__k">
                  NEXT BROADCAST · {formatFreq(nextStation.freq)} FM
                </span>
                <span className="ls-after__t">{next.title.replace(/^Part \d · /, '')}</span>
                <span className="ls-after__d">
                  {nextStation.part} · {next.questionCount} questions · {next.kinds.join(', ')}
                </span>
              </Link>
            </li>
          )}
          {lecture && (
            <li>
              <Link to={`/student/listening/lecture/${lecture.id}`} className="ls-after__card" onClick={() => sfx.click()}>
                <span className="ls-after__k">REWIND THE TAPE · LECTURE</span>
                <span className="ls-after__t">{lecture.title}</span>
                <span className="ls-after__d">{lecture.summary}</span>
              </Link>
            </li>
          )}
          <li>
            <Link to={profileResultPath(attempt)} className="ls-after__card" onClick={() => sfx.click()}>
              <span className="ls-after__k">SAVED TO YOUR PROFILE</span>
              <span className="ls-after__t">This result, every answer</span>
              <span className="ls-after__d">Your band over time sits there too, next to Reading and Writing.</span>
            </Link>
          </li>
          <li>
            <Link to="/student/listening/practice" className="ls-after__card" onClick={() => sfx.click()}>
              <span className="ls-after__k">BACK TO THE DIAL</span>
              <span className="ls-after__t">All practice tests</span>
              <span className="ls-after__d">Pick the next broadcast: a full test or one question type at a time.</span>
            </Link>
          </li>
        </ul>
        <p className="ls-after__sign">
          That was <strong>{info.title}</strong> on Owl FM. Same time tomorrow?
        </p>
      </section>
    </div>
  )
}

// ------------------------------------------------------------ review card ---

interface CardProps {
  q: Question
  m: Marked
  set: PracticeSet
  index: number
  given: string
  canHear: boolean
  speaking: boolean
  onHear: (n: number, line: SpokenLine) => void
}

function ReviewCard({ q, m, set, index, given, canHear, speaking, onHear }: CardProps) {
  const lineIndex = evidenceIndex(set, q)
  const line = lineIndex >= 0 ? (set.script[lineIndex] as SpokenLine) : undefined
  const speaker = line ? set.speakers.find((s) => s.id === line.s) : undefined
  const traps = set.traps.filter((t) => t.q === q.n)
  const givenText = q.kind === 'gap' ? given.trim() : given ? `${given}${optionText(set, q, given) ? ` · ${optionText(set, q, given)}` : ''}` : ''
  const answerText = q.kind === 'gap' ? q.answer : `${q.answer}${optionText(set, q, q.answer) ? ` · ${optionText(set, q, q.answer)}` : ''}`
  const accepted = q.kind === 'gap' ? (q.accept ?? []) : []

  const [before, after] = line ? [line.t.slice(0, line.t.indexOf(q.evidence)), line.t.slice(line.t.indexOf(q.evidence) + q.evidence.length)] : ['', '']

  return (
    <li className={`ls-card is-${m.verdict} ${m.correct ? 'is-ok' : 'is-bad'}`} id={`ls-review-${q.n}`} style={{ '--i': Math.min(index, 8) } as CSSProperties}>
      <header className="ls-card__head">
        <span className="ls-card__no">Q{q.n}</span>
        <span className="ls-card__label">{questionLabel(set, q)}</span>
        <span className="ls-card__verdict">
          <i aria-hidden="true" />
          {VERDICT[m.verdict]}
        </span>
      </header>

      <dl className="ls-card__answers">
        <div className="ls-card__given">
          <dt>You wrote</dt>
          <dd>{givenText || <em>nothing</em>}</dd>
        </div>
        {!m.correct && (
          <div className="ls-card__key">
            <dt>Answer</dt>
            <dd>
              {answerText}
              {accepted.length > 0 && <small> (also accepted: {accepted.join(', ')})</small>}
            </dd>
          </div>
        )}
      </dl>

      {HINT[m.verdict] && <p className={`ls-card__hint is-${m.verdict}`}>{HINT[m.verdict]}</p>}
      <p className="ls-card__explain">{q.explain}</p>

      {line && (
        <figure className="ls-card__quote">
          <blockquote>
            <p>
              {before.length > 70 ? `…${before.slice(-70)}` : before}
              <mark className="ls-hl ls-hl--answer">{q.evidence}</mark>
              {after.length > 70 ? `${after.slice(0, 70)}…` : after}
            </p>
          </blockquote>
          <figcaption>
            <span className="ls-card__speaker" style={{ '--ls-c': speakerColor(set, line.s) } as CSSProperties}>
              {speaker?.name}
            </span>
            {canHear && (
              <button type="button" className={`ls-card__hear ${speaking ? 'is-on' : ''}`} onClick={() => onHear(q.n, line)}>
                <span className={`ls-card__hear-icon ${speaking ? 'is-stop' : ''}`} aria-hidden="true" />
                {speaking ? 'Stop' : 'Hear it again'}
              </button>
            )}
            <ScrollLink
              to={`ls-line-${lineIndex}`}
              className="ls-card__find"
              onClick={(e) => {
                e.preventDefault()
                jumpTo(`ls-line-${lineIndex}`)
              }}
            >
              Find in transcript
            </ScrollLink>
          </figcaption>
        </figure>
      )}

      {traps.length > 0 && (
        <ul className="ls-card__traps">
          {traps.map((t) => (
            <li key={t.phrase}>
              <strong>Trap:</strong> “{t.phrase}” <span>{t.note}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
