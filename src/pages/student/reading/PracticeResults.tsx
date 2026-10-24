import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { profileResultPath } from '../../../learn/results/results'
import { floatText, pixelConfetti } from '../../../learn/fx'
import type { Attempt } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import type { PracticeInfo } from '../../../learn/types'
import { formatClock } from '../../../learn/useTimer'
import { lectures } from './content'
import { useCountUp, useReducedMotion } from './hooks'
import { LibrarianOwl } from './LibrarianOwl'
import { BAND7_ACCURACY, CELEBRATE_ACCURACY, HUB_PATH, accuracyOf, bandEstimate, stampDate } from './library'
import { scoreByKind, verdictLine, type Graded, type KindScore } from './practice-logic'

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
/** An accuracy ring with a tick at the Band 7 line (75%, about 30 of 40). */
function AccuracyRing({ value, shown }: { value: number; shown: number }) {
  const size = 188
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const angle = BAND7_ACCURACY * 2 * Math.PI - Math.PI / 2
  const tick = (d: number) => ({ x: size / 2 + Math.cos(angle) * d, y: size / 2 + Math.sin(angle) * d })
  const a = tick(r - stroke / 2 - 5)
  const b = tick(r + stroke / 2 + 5)
  const label = tick(r + stroke / 2 + 18)
  return (
    <div
      className="rd-ring"
      role="img"
      aria-label={`Accuracy ${Math.round(value * 100)} percent. The Band 7 line is at ${Math.round(BAND7_ACCURACY * 100)} percent, about 30 of 40.`}
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
        <text className="rd-ring__tick-label" x={label.x} y={label.y} dy="0.35em" textAnchor="middle">
          B7
        </text>
      </svg>
      <span className="rd-ring__label">
        <b>{Math.round(shown * 100)}%</b>
        <small>accuracy</small>
      </span>
      <span className="rd-ring__target" aria-hidden="true">
        Band 7 line ≈ 30/40
      </span>
    </div>
  )
}

/**
 * The question types to revise: lowest share correct, ties broken by the most
 * marks lost; a dead heat names both.
 */
function trickiestKinds(kinds: KindScore[]) {
  const missed = kinds.filter((k) => k.correct < k.total)
  const rank = (k: KindScore) => [k.correct / k.total, -(k.total - k.correct)] as const
  missed.sort((a, b) => rank(a)[0] - rank(b)[0] || rank(a)[1] - rank(b)[1])
  const [first] = missed
  if (!first) return []
  return missed.filter((k) => rank(k)[0] === rank(first)[0] && rank(k)[1] === rank(first)[1]).slice(0, 2)
}

/** The verdict: animated score, accuracy, XP and a breakdown by question type. */
export function PracticeResults({ info, attempt, graded, previousBest, firstName, next, onReview, onRetry }: ResultsProps) {
  const reduced = useReducedMotion()
  const accuracy = accuracyOf(attempt)
  const band = bandEstimate(attempt.score, attempt.total)
  const great = accuracy >= CELEBRATE_ACCURACY
  const isBest = !previousBest || accuracy > accuracyOf(previousBest)
  const improved = previousBest && accuracy > accuracyOf(previousBest)
  const kinds = scoreByKind(graded)
  const trickiest = trickiestKinds(kinds)
  const titleRef = useRef<HTMLHeadingElement>(null)
  // The owl reads its verdict out for a moment, then listens.
  const [talking, setTalking] = useState(!reduced && !great)

  useEffect(() => {
    if (!talking) return
    const id = window.setTimeout(() => setTalking(false), 2500)
    return () => window.clearTimeout(id)
  }, [talking])

  // The submit button has gone: move focus to the verdict so it is read out.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(id)
  }, [])

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
    if (attempt.xp > 0) timers.push(window.setTimeout(() => xpRef.current && floatText(`+${attempt.xp} XP`, xpRef.current, '#ffcf5c'), 900))
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
            <h1 className="rd-verdict__title" id="rd-verdict-title" ref={titleRef} tabIndex={-1}>
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
            {attempt.repeat && (
              <p className="rd-verdict__pb rd-verdict__pb--muted">Retake: XP is earned on the first attempt only.</p>
            )}
          </div>

          <AccuracyRing value={accuracy} shown={ring} />

          <dl className="rd-verdict__facts">
            <div ref={xpRef}>
              <dt>{attempt.repeat ? 'XP · retake' : 'XP earned'}</dt>
              <dd>{attempt.repeat ? '0' : `+${Math.round(xp)}`}</dd>
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
          <Link to={`${HUB_PATH}/practice`} className="rd-verdict__home">
            Back to all tests
          </Link>
          <Link to={profileResultPath(attempt)} className="rd-verdict__home">
            Saved to your profile →
          </Link>
        </div>
        <div className="rd-verdict__lower">
          <div className="rd-verdict__owl">
            <LibrarianOwl happy={great} talking={talking} scale={4} />
            <p className="rd-verdict__bubble">
              {verdictLine(accuracy, band, BAND7_ACCURACY)}
              {trickiest.length > 0 && (
                <>
                  {' '}
                  Trickiest tonight:{' '}
                  {trickiest.map((k, i) => (
                    <Fragment key={k.label}>
                      {i > 0 && ' and '}
                      <b>{k.label}</b> ({k.correct}/{k.total})
                    </Fragment>
                  ))}
                  .{' '}
                  {[...new Set(trickiest.map((k) => k.lectureId))].map((id, i) => {
                    const lecture = lectures.find((l) => l.id === id)
                    return (
                      lecture && (
                        <Fragment key={id}>
                          {i > 0 && ' · '}
                          <Link to={`${HUB_PATH}/lecture/${lecture.id}`}>Revise “{lecture.title}”</Link>
                        </Fragment>
                      )
                    )
                  })}
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
