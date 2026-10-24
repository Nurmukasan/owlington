import { useState } from 'react'
import { xpLabel, type Attempt } from '../../../learn/progress'
import { detailOf, formatBand, formatDate, hasJudgedBand } from './stats'

/** Past submissions for one prompt, newest first; each one can be opened and read. */
interface HistoryProps {
  attempts: Attempt[]
  title?: string
  light?: boolean
  /** "essay", "report" or "letter". */
  noun?: string
}

export function History({ attempts, title = 'Past submissions', light = false, noun = 'essay' }: HistoryProps) {
  const Noun = noun.charAt(0).toUpperCase() + noun.slice(1)
  const [open, setOpen] = useState<string | null>(null)
  if (!attempts.length) return null
  return (
    <section className={`wr-history ${light ? 'wr-history--light' : ''}`} aria-label={title}>
      <h3 className="wr-history__title">{title}</h3>
      <ol className="wr-history__list">
        {attempts.map((a, i) => {
          const d = detailOf(a)
          const isOpen = open === a.at
          const judged = hasJudgedBand(a)
          return (
            <li key={a.at} className={isOpen ? 'is-open' : ''}>
              <button
                type="button"
                className="wr-history__row"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : a.at)}
              >
                <span className={`wr-history__band ${judged ? '' : 'is-unjudged'}`} aria-hidden="true">
                  {judged && a.band ? formatBand(a.band) : '–'}
                </span>
                <span className="wr-history__main">
                  <span className="wr-history__name">
                    {Noun} {attempts.length - i} · {formatDate(a.at, true)}
                  </span>
                  <span className="wr-history__meta">
                    {d.words} words · checklist {a.score}/{a.total} · {Math.round(a.durationSec / 60)} min · {xpLabel(a)}
                    {!judged && a.band ? ' · too short for a band' : ''}
                  </span>
                </span>
                <span className="visually-hidden">
                  Band {judged && a.band ? formatBand(a.band) : 'not counted'}. {isOpen ? 'Hide' : 'Read'} this {noun}.
                </span>
                <span className="wr-history__chev" aria-hidden="true">
                  {isOpen ? '–' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="wr-history__text">
                  {d.text ? d.text.split(/\n+/).filter(Boolean).map((p, k) => <p key={k}>{p}</p>) : <p>(No text saved.)</p>}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
