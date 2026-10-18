import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ProgressRing } from '../../../../learn/components/ProgressWidgets'
import { floatText, pixelConfetti } from '../../../../learn/fx'
import type { Attempt } from '../../../../learn/progress'
import { sfx } from '../../../../learn/sfx'
import type { Lecture, PracticeInfo } from '../../../../learn/types'
import { formatClock } from '../../../../learn/useTimer'
import { bandForAccuracy, type Marked, type Verdict } from '../answers'
import { DjOwl } from '../components/DjOwl'
import { useCountUp, useReducedMotion } from '../hooks'
import { isPause, questionsOf, type PracticeSet, type Question, type SpokenLine } from '../practice-data'
import { speakOnce, type Cast } from '../speech'
import { formatFreq, stationFor, type Station } from '../stations'
import { ParkMap } from './ParkMap'
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
}

const CONFETTI = ['#6fe3cf', '#7ff7ff', '#9b84ff', '#ff6fcf', '#ffcf5c', '#ffffff']

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
    stopRef.current = speakOnce(line, cast[line.s], voices, rate, () => setSpeaking((s) => (s === n ? null : s)))
  }

  const reviewed = questions.filter((q) => filter === 'all' || !marks.find((m) => m.n === q.n)?.correct)
  const nextStation = next ? stationFor(next.id, nextIndex) : undefined
  const reveal = mapGroup
    ? Object.fromEntries(mapGroup.questions.map((q) => [q.answer, q.kind === 'letter' ? q.label : '']))
    : undefined

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
              {tier.name}
              {newBest && <span className="ls-board__best">{prevBest ? 'New best' : 'First score'}</span>}
            </h1>
            <div className="ls-board__dj">
              <span className="ls-board__owl" aria-hidden="true">
                <DjOwl happy={celebrate && done} talking={!done} scale={4} />
              </span>
              <p className="ls-board__line">{tier.line}</p>
            </div>

            <ol className="ls-lamps" aria-label="Question results">
              {marks.map((m, i) => (
                <li key={m.n} className={m.correct ? 'is-ok' : 'is-bad'} style={{ '--i': i } as CSSProperties}>
                  <a href={`#ls-review-${m.n}`} aria-label={`Question ${m.n}: ${VERDICT[m.verdict]}`}>
                    {m.n}
                  </a>
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
            <dt>XP earned</dt>
            <dd className="ls-board__xp">+{attempt.xp}</dd>
          </div>
          <div>
            <dt>Band estimate</dt>
            <dd>{band.toFixed(1)}</dd>
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
        </p>

        <div className="ls-board__actions">
          <a href="#ls-review" className="ls-btn ls-btn--teal ls-btn--big">
            Review {wrong ? `${wrong} to learn from` : 'answers'} <span aria-hidden="true">↓</span>
          </a>
          <button type="button" className="ls-btn ls-btn--ghost ls-btn--big" onClick={onRetry}>
            ↺ Tune in again
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
            <ParkMap reveal={reveal} />
            <figcaption>Answer key for the map: every place where the ranger says it is. C and F are never used.</figcaption>
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
                canHear={voices.length > 0}
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
            <Link to="/student/listening" className="ls-after__card" onClick={() => sfx.click()}>
              <span className="ls-after__k">BACK TO THE STATION</span>
              <span className="ls-after__t">Owl FM hub</span>
              <span className="ls-after__d">See your signal strength, tape rack and every station on the dial.</span>
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
                {speaking ? '■ Stop' : '▶ Hear it again'}
              </button>
            )}
            <a href={`#ls-line-${lineIndex}`} className="ls-card__find">
              Find in transcript
            </a>
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
