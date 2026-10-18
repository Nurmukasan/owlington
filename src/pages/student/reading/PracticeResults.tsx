import { useEffect, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { floatText, pixelConfetti } from '../../../learn/fx'
import type { Attempt } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import type { PracticeInfo } from '../../../learn/types'
import { formatClock } from '../../../learn/useTimer'
import { lectures } from './content'
import { useCountUp, useReducedMotion } from './hooks'
import { LibrarianOwl } from './LibrarianOwl'
import { HUB_PATH, accuracyOf, bandEstimate, stampDate } from './library'
import { scoreByKind, verdictLine, type Graded } from './practice-logic'

interface ResultsProps {
  info: PracticeInfo
  attempt: Attempt
  graded: Graded[]
  previousBest?: Attempt
  firstName: string
  next?: PracticeInfo
  onReview: () => void
  onRetry: () => void
}

const GOLDS = ['#ffcf5c', '#ffe7a3', '#f2b84b', '#fff1c9', '#c23b4a', '#cfe0ff']
const TARGET = 0.7

/** An accuracy ring with a tick at the 70% "Band 7" line. */
function AccuracyRing({ value, shown }: { value: number; shown: number }) {
  const size = 188
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const angle = TARGET * 2 * Math.PI - Math.PI / 2
  const tick = (d: number) => ({ x: size / 2 + Math.cos(angle) * d, y: size / 2 + Math.sin(angle) * d })
  const a = tick(r - stroke / 2 - 5)
  const b = tick(r + stroke / 2 + 5)
  return (
    <div
      className="rd-ring"
      role="img"
      aria-label={`Accuracy ${Math.round(value * 100)} percent. The Band 7 line is at about 70 percent.`}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
        <circle className="rd-ring__track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="rd-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - Math.max(0.001, shown))}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <line className="rd-ring__tick" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
      </svg>
      <span className="rd-ring__label">
        <b>{Math.round(shown * 100)}%</b>
        <small>accuracy</small>
      </span>
      <span className="rd-ring__target" aria-hidden="true">
        Band 7 line
      </span>
    </div>
  )
}

/** The verdict: animated score, accuracy, XP and a breakdown by question type. */
export function PracticeResults({ info, attempt, graded, previousBest, firstName, next, onReview, onRetry }: ResultsProps) {
  const reduced = useReducedMotion()
  const accuracy = accuracyOf(attempt)
  const band = bandEstimate(attempt.score, attempt.total)
  const great = accuracy >= TARGET
  const isBest = !previousBest || accuracy > accuracyOf(previousBest)
  const improved = previousBest && accuracy > accuracyOf(previousBest)
  const kinds = scoreByKind(graded)
  const weakest = [...kinds].filter((k) => k.correct < k.total).sort((a, b) => a.correct / a.total - b.correct / b.total)[0]
  const weakLecture = weakest && lectures.find((l) => l.id === weakest.lectureId)

  const score = useCountUp(attempt.score, true, 1300)
  const ring = useCountUp(accuracy, true, 1500)
  const xp = useCountUp(attempt.xp, true, 1200)

  const stampRef = useRef<HTMLDivElement>(null)
  const xpRef = useRef<HTMLDivElement>(null)
  const celebrated = useRef(false)

  useEffect(() => {
    if (celebrated.current) return
    celebrated.current = true
    const timers: number[] = []
    if (great) {
      sfx.complete()
      timers.push(
        window.setTimeout(() => {
          if (stampRef.current) pixelConfetti(stampRef.current, { colors: GOLDS, count: 70 })
        }, 700),
        window.setTimeout(
          () => pixelConfetti({ x: window.innerWidth / 2, y: window.innerHeight * 0.3 }, { colors: GOLDS, count: 50 }),
          1150,
        ),
      )
    } else {
      sfx.page()
    }
    timers.push(window.setTimeout(() => xpRef.current && floatText(`+${attempt.xp} XP`, xpRef.current, '#ffcf5c'), 900))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [great, attempt.xp])

  const stampWord = accuracy >= 1 ? 'PERFECT' : great ? 'SPLENDID' : accuracy >= 0.5 ? 'WELL READ' : 'RETURNED'

  return (
    <section className={`rd-verdict ${great ? 'is-great' : ''} ${reduced ? 'is-still' : ''}`} aria-labelledby="rd-verdict-title">
      <div className="rd-verdict__card">
        <span className="rd-verdict__punch" aria-hidden="true" />

        <div className="rd-verdict__top">
          <div className="rd-verdict__intro">
            <p className="rd-verdict__eyebrow">RETURNED TO THE DESK · {stampDate(attempt.at)}</p>
            <h1 className="rd-verdict__title" id="rd-verdict-title">
              {great ? `Splendid reading, ${firstName}!` : `Card returned, ${firstName}.`}
            </h1>
            <p className="rd-verdict__sub">
              {info.title} · {info.level}
            </p>
          </div>
          <div className="rd-verdict__stamp" ref={stampRef} aria-hidden="true">
            <span className="rd-verdict__stamp-top">{stampWord}</span>
            <span className="rd-verdict__stamp-score">
              {attempt.score}/{attempt.total}
            </span>
            <span className="rd-verdict__stamp-date">{stampDate(attempt.at)}</span>
          </div>
        </div>

        <div className="rd-verdict__main">
          <div className="rd-verdict__hero">
            <p className="rd-verdict__figure" aria-label={`${attempt.score} out of ${attempt.total} correct`}>
              <b aria-hidden="true">{Math.round(score)}</b>
              <span aria-hidden="true">/ {attempt.total}</span>
            </p>
            <p className="rd-verdict__figure-label">correct answers</p>
            {isBest && (
              <p className="rd-verdict__pb">
                <span aria-hidden="true">★</span> {improved ? 'New personal best!' : 'First stamp on this card!'}
              </p>
            )}
            {!isBest && previousBest && (
              <p className="rd-verdict__pb rd-verdict__pb--muted">
                Personal best still {previousBest.score}/{previousBest.total}
              </p>
            )}
          </div>

          <AccuracyRing value={accuracy} shown={ring} />

          <dl className="rd-verdict__facts">
            <div ref={xpRef}>
              <dt>XP earned</dt>
              <dd>+{Math.round(xp)}</dd>
            </div>
            <div>
              <dt>Band estimate</dt>
              <dd>≈ {band.toFixed(1)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>
                {formatClock(attempt.durationSec)}
                <small> / {info.minutes}:00</small>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rd-verdict__actions">
          <button type="button" className="rd-btn" onClick={onReview}>
            Review answers <span aria-hidden="true">↓</span>
          </button>
          <button type="button" className="rd-btn rd-btn--ink" onClick={onRetry}>
            Try again
          </button>
          {next && (
            <Link to={`${HUB_PATH}/practice/${next.id}`} className="rd-btn rd-btn--ghost">
              Next test: {next.title} <span aria-hidden="true">→</span>
            </Link>
          )}
          <Link to={HUB_PATH} className="rd-verdict__home">
            Back to the library
          </Link>
        </div>
        <div className="rd-verdict__lower">
          <div className="rd-verdict__owl">
            <LibrarianOwl happy={great} talking={!great} scale={4} />
            <p className="rd-verdict__bubble">
              {verdictLine(accuracy, band)}
              {weakest && weakLecture && (
                <>
                  {' '}
                  Trickiest tonight: <b>{weakest.label}</b> ({weakest.correct}/{weakest.total}).{' '}
                  <Link to={`${HUB_PATH}/lecture/${weakLecture.id}`}>Revise “{weakLecture.title}”</Link>
                </>
              )}
            </p>
          </div>

          <div className="rd-types">
            <h2 className="rd-types__title">By question type</h2>
            <ul className="rd-types__list">
              {kinds.map((k, i) => (
                <li
                  key={k.label}
                  style={{ '--rd-i': i, '--rd-v': k.correct / k.total } as CSSProperties}
                  title={`${k.label}: ${k.correct} of ${k.total} correct`}
                >
                  <span className="rd-types__label">{k.label}</span>
                  <span className="rd-types__track" aria-hidden="true">
                    <span className="rd-types__fill" />
                  </span>
                  <span className="rd-types__value">
                    {k.correct}/{k.total}
                    <span className="visually-hidden"> correct</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="rd-types__note">
              The band is a rough guide: it assumes this accuracy across a full 40-question Academic paper.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
