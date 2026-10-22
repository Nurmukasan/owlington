import { useState } from 'react'
import type { Attempt } from '../../../learn/progress'
import { detailOf, formatBand, formatDate } from './stats'

/** Past submissions for one prompt, newest first; each one can be opened and read. */
export function History({ attempts, title = 'Past submissions', light = false }: { attempts: Attempt[]; title?: string; light?: boolean }) {
  const [open, setOpen] = useState<string | null>(null)
  if (!attempts.length) return null
  return (
    <section className={`wr-history ${light ? 'wr-history--light' : ''}`} aria-label={title}>
      <h3 className="wr-history__title">{title}</h3>
      <ol className="wr-history__list">
        {attempts.map((a, i) => {
          const d = detailOf(a)
          const isOpen = open === a.at
          return (
            <li key={a.at} className={isOpen ? 'is-open' : ''}>
              <button
                type="button"
                className="wr-history__row"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : a.at)}
              >
                <span className="wr-history__band" aria-hidden="true">
                  {a.band ? formatBand(a.band) : '–'}
                </span>
                <span className="wr-history__main">
                  <span className="wr-history__name">
                    Essay {attempts.length - i} · {formatDate(a.at, true)}
                  </span>
                  <span className="wr-history__meta">
                    {d.words} words · checklist {a.score}/{a.total} · {Math.round(a.durationSec / 60)} min · +{a.xp} XP
                  </span>
                </span>
                <span className="visually-hidden">
                  Band {a.band ? formatBand(a.band) : 'not assessed'}. {isOpen ? 'Hide' : 'Read'} this essay.
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
