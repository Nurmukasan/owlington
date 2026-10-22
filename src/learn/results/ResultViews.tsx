import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PixelSprite } from '../../components/PixelSprite'
import { findPractice } from '../catalog'
import type { Attempt, AttemptItem } from '../progress'
import {
  SECTION_META,
  accuracyOf,
  bandDelta,
  formatBand,
  formatDuration,
  formatOf,
  formatWhen,
  pct,
  previousAttempt,
  scoreText,
  tallyByType,
  titleOf,
} from './results'
import './results.css'

const themeOf = (a: Attempt) =>
  ({ '--rs-color': SECTION_META[a.section].color, '--rs-chart': SECTION_META[a.section].chart }) as CSSProperties

/** One small square per question: filled when right, hollow when missed. */
export function ResultStrip({ items, className = '' }: { items: AttemptItem[]; className?: string }) {
  if (!items.length) return null
  const right = items.filter((i) => i.correct).length
  return (
    <span className={`rs-strip ${className}`} role="img" aria-label={`${right} of ${items.length} right`}>
      {items.map((item) => (
        <i key={item.n} className={item.correct ? 'is-ok' : 'is-miss'} />
      ))}
    </span>
  )
}

function Delta({ now, before, label }: { now?: number; before?: number; label: string }) {
  const d = bandDelta(now, before)
  if (!d) return null
  const dir = d.value > 0 ? 'up' : d.value < 0 ? 'down' : 'flat'
  return (
    <span className={`rs-delta is-${dir}`} title={label}>
      <span aria-hidden="true">{dir === 'up' ? '▲' : dir === 'down' ? '▼' : '■'}</span> {d.text}
      <span className="visually-hidden"> {label}</span>
    </span>
  )
}

/** A result in the profile's list. `all` is every attempt, to compare with the one before. */
export function ResultRow({ attempt: a, all, to, index = 0 }: { attempt: Attempt; all: Attempt[]; to: string; index?: number }) {
  const meta = SECTION_META[a.section]
  const prev = previousAttempt(all, a)
  const full = formatOf(a) === 'full'
  return (
    <li className="rs-row" style={{ ...themeOf(a), '--rs-i': Math.min(index, 12) } as CSSProperties}>
      <Link to={to} className="rs-row__link">
        <span className="rs-badge" aria-hidden="true">
          <PixelSprite sprite={meta.icon} scale={2} />
        </span>
        <span className="rs-row__main">
          <span className="rs-row__kicker">
            {meta.name} · {full ? 'Full test' : 'Focused'}
          </span>
          <span className="rs-row__title">{titleOf(a)}</span>
          <span className="rs-row__sub">
            {formatWhen(a.at)} · {formatDuration(a.durationSec)}
          </span>
          {a.items && <ResultStrip items={a.items} />}
        </span>
        <span className="rs-row__score">
          <span className="rs-row__band">
            <small>BAND</small>
            {formatBand(a.band)}
          </span>
          <span className="rs-row__raw">{scoreText(a)}</span>
          {prev && <Delta now={a.band} before={prev.band} label="since your last try at this test" />}
        </span>
      </Link>
    </li>
  )
}

function Bars({ rows, max, unit }: { rows: { label: string; value: number; text: string }[]; max: number; unit: string }) {
  return (
    <ul className="rs-bars" aria-label={unit}>
      {rows.map((r) => (
        <li key={r.label} className="rs-bars__row">
          <span className="rs-bars__label">{r.label}</span>
          <span className="rs-bars__track" aria-hidden="true">
            <span className="rs-bars__fill" style={{ width: `${Math.max(0, Math.min(1, r.value / max)) * 100}%` }} />
          </span>
          <span className="rs-bars__value">{r.text}</span>
        </li>
      ))}
    </ul>
  )
}

function Verdict({ item, check }: { item: AttemptItem; check: boolean }) {
  // A writing check is met or not yet; a question is right, wrong or left blank.
  const state = item.correct ? 'ok' : item.given || check ? 'miss' : 'blank'
  const text = { ok: check ? 'Met' : 'Right', miss: check ? 'Not yet' : 'Wrong', blank: 'Blank' }[state]
  return (
    <span className={`rs-verdict is-${state}`}>
      <span className="rs-verdict__icon" aria-hidden="true">
        {state === 'ok' ? '✓' : state === 'miss' ? '✗' : '–'}
      </span>
      {text}
    </span>
  )
}

/** The full report for one attempt, the same for every section. */
export function ResultDetail({ attempt: a, all, backTo }: { attempt: Attempt; all: Attempt[]; backTo: string }) {
  const meta = SECTION_META[a.section]
  const info = findPractice(a.section, a.practiceId)
  const prev = previousAttempt(all, a)
  const others = all.filter((x) => x.section === a.section && x.practiceId === a.practiceId)
  const best = others.reduce<Attempt | undefined>((b, x) => (!b || accuracyOf(x) > accuracyOf(b) ? x : b), undefined)
  const isBest = best === a && others.length > 1
  const writing = a.section === 'writing'
  const items = a.items ?? []
  const tallies = tallyByType(items)
  const full = formatOf(a) === 'full'

  return (
    <article className="rs-detail" style={themeOf(a)} aria-labelledby="rs-detail-title">
      <Link to={backTo} className="rs-back">
        <span aria-hidden="true">◀</span> All results
      </Link>

      <header className="rs-detail__head">
        <span className="rs-badge rs-badge--big" aria-hidden="true">
          <PixelSprite sprite={meta.icon} scale={3} />
        </span>
        <div>
          <p className="rs-detail__kicker">
            {meta.name} · {meta.world} · {full ? 'Full test' : 'Focused practice'}
          </p>
          <h2 id="rs-detail-title" className="rs-detail__title">
            {titleOf(a)}
          </h2>
          <p className="rs-detail__when">
            {formatWhen(a.at)} · +{a.xp} XP
          </p>
        </div>
      </header>

      <dl className="rs-stats">
        <div className="rs-stat rs-stat--band">
          <dt>Estimated band</dt>
          <dd>
            <span className="rs-stat__hero">{formatBand(a.band)}</span>
            {prev ? (
              <Delta now={a.band} before={prev.band} label="since your last try at this test" />
            ) : (
              <span className="rs-stat__note">First try at this test</span>
            )}
          </dd>
        </div>
        <div className="rs-stat">
          <dt>Score</dt>
          <dd>
            <span className="rs-stat__value">
              {a.score}
              <small> / {a.total}</small>
            </span>
            <span className="rs-meter" aria-hidden="true">
              <span style={{ width: pct(accuracyOf(a)) }} />
            </span>
            <span className="rs-stat__note">
              {pct(accuracyOf(a))} {writing ? 'of the checklist met' : 'correct'}
            </span>
          </dd>
        </div>
        <div className="rs-stat">
          <dt>Time</dt>
          <dd>
            <span className="rs-stat__value">{formatDuration(a.durationSec)}</span>
            {info && <span className="rs-stat__note">{info.minutes} min suggested</span>}
          </dd>
        </div>
        <div className="rs-stat">
          <dt>{writing ? 'Words' : 'Your best here'}</dt>
          <dd>
            {writing ? (
              <>
                <span className="rs-stat__value">{a.words ?? '—'}</span>
                <span className="rs-stat__note">words written</span>
              </>
            ) : (
              <>
                <span className="rs-stat__value">{best ? pct(accuracyOf(best)) : '—'}</span>
                <span className="rs-stat__note">
                  {isBest ? 'This is your best!' : `over ${others.length} ${others.length === 1 ? 'try' : 'tries'}`}
                </span>
              </>
            )}
          </dd>
        </div>
      </dl>

      {writing && a.criteria && a.criteria.length > 0 && (
        <section className="rs-block" aria-labelledby="rs-criteria">
          <h3 id="rs-criteria" className="rs-block__title">
            Band by criterion
          </h3>
          <Bars rows={a.criteria.map((c) => ({ label: c.label, value: c.band, text: formatBand(c.band) }))} max={9} unit="Band out of 9" />
        </section>
      )}

      {tallies.length > 0 && (
        <section className="rs-block" aria-labelledby="rs-types">
          <h3 id="rs-types" className="rs-block__title">
            {writing ? 'Checklist by criterion' : 'By question type'}
          </h3>
          <Bars
            rows={tallies.map((t) => ({ label: t.type, value: t.correct / t.total, text: `${t.correct}/${t.total} · ${pct(t.correct / t.total)}` }))}
            max={1}
            unit="Share right"
          />
        </section>
      )}

      <section className="rs-block" aria-labelledby="rs-items">
        <h3 id="rs-items" className="rs-block__title">
          {writing ? 'The checklist' : 'Question by question'}
        </h3>
        {items.length ? (
          <table className="rs-table">
            <thead>
              <tr>
                <th scope="col">{writing ? '#' : 'Q'}</th>
                <th scope="col">{writing ? 'Check' : 'Type'}</th>
                <th scope="col">{writing ? 'What we found' : 'Your answer'}</th>
                {!writing && <th scope="col">Correct answer</th>}
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.n} className={item.correct ? 'is-ok' : 'is-miss'}>
                  <td className="rs-table__n">{item.n}</td>
                  <td data-label={writing ? 'Check' : 'Type'}>
                    {writing ? (
                      <>
                        <strong>{item.label}</strong>
                        <span className="rs-table__muted">{item.type}</span>
                      </>
                    ) : (
                      item.type
                    )}
                  </td>
                  <td data-label={writing ? 'Found' : 'You'}>{item.given || <span className="rs-table__muted">no answer</span>}</td>
                  {!writing && <td data-label="Answer">{item.answer}</td>}
                  <td>
                    <Verdict item={item} check={writing} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="rs-empty">Question-by-question detail wasn’t saved for this attempt. Your next tries will have it.</p>
        )}
      </section>

      <footer className="rs-detail__actions">
        <Link to={`/student/${a.section}/practice/${a.practiceId}`} className="btn btn--amber notched">
          Try this test again
        </Link>
        <Link to={`/student/${a.section}/practice`} className="rs-detail__more">
          More {meta.name} practice →
        </Link>
      </footer>
    </article>
  )
}
