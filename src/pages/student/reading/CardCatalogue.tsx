import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { SectionStats } from '../../../learn/useProgress'
import { practiceSets } from './content'
import { HUB_PATH, accuracyOf, callNumber, pct, stampDate, type DraftSummary } from './library'
import { SectionHeader } from './SectionHeader'
import { useReveal } from './hooks'

export function CardCatalogue({ stats, drafts = {} }: { stats: SectionStats; drafts?: Record<string, DraftSummary> }) {
  const [ref, inView] = useReveal<HTMLDivElement>()
  const attemptsBySet = (id: string) => stats.attempts.filter((a) => a.practiceId === id)

  const note =
    stats.practiceAttempted === 0
      ? 'Each card is a full IELTS-style passage with real question types. Borrow one — no late fees, I promise.'
      : stats.practiceAttempted < stats.practiceTotal
        ? `${stats.practiceAttempted} of ${stats.practiceTotal} tests borrowed. Your best score is stamped on each card.`
        : 'You’ve borrowed every test. Now chase a higher stamp on each card!'

  return (
    <section className="rd-section rd-catalogue" id="rd-catalogue" aria-labelledby="rd-catalogue-title">
      <SectionHeader id="rd-catalogue-title" plate="PRACTICE TESTS" title="The Card Catalogue" note={note} />

      <div ref={ref} className={`rd-cabinet ${inView ? 'is-in' : ''}`}>
        <div className="rd-cabinet__drawer">
          <ul className="rd-cards">
            {practiceSets.map((set, i) => {
              const best = stats.best[set.id]
              const tries = attemptsBySet(set.id)
              const accuracy = best ? accuracyOf(best) : 0
              const stampTone = !best ? 'new' : accuracy >= 0.7 ? 'great' : accuracy >= 0.5 ? 'good' : 'low'
              const draft = drafts[set.id]
              return (
                <li key={set.id} className="rd-cards__slot" style={{ '--rd-i': i } as CSSProperties}>
                  <Link
                    to={`${HUB_PATH}/practice/${set.id}`}
                    className={`rd-card rd-card--${stampTone}`}
                    aria-label={`${set.title}. ${set.level} practice test, ${set.minutes} minutes, ${set.questionCount} questions. ${
                      best ? `Best score ${best.score} out of ${best.total}, ${tries.length} attempts.` : 'Not attempted yet.'
                    }${draft ? ` In progress: ${draft.answered} of ${set.questionCount} answered.` : ''}`}
                  >
                    <span className="rd-card__rule" aria-hidden="true" />
                    <span className="rd-card__head" aria-hidden="true">
                      <span className="rd-card__call">{callNumber(i)}</span>
                      <span className={`rd-card__level rd-card__level--${set.level.toLowerCase()}`}>{set.level}</span>
                    </span>
                    <span className="rd-card__title" aria-hidden="true">
                      {set.title}
                    </span>
                    <span className="rd-card__summary" aria-hidden="true">
                      {set.summary}
                    </span>
                    <span className="rd-card__subjects" aria-hidden="true">
                      {set.kinds.map((k, ki) => (
                        <span key={k}>
                          {ki + 1}. {k}
                        </span>
                      ))}
                    </span>
                    {draft && (
                      <span className="rd-card__inprog" aria-hidden="true">
                        <i />
                        IN PROGRESS · {draft.answered}/{set.questionCount}
                      </span>
                    )}
                    <span className="rd-card__facts" aria-hidden="true">
                      <span>{set.minutes} min</span>
                      <span>{set.questionCount} questions</span>
                      <span>{tries.length ? `borrowed ×${tries.length}` : 'never borrowed'}</span>
                      {tries.length > 1 && (
                        <span className="rd-card__history" title="Your last attempts">
                          {tries
                            .slice(0, 6)
                            .reverse()
                            .map((a) => (
                              <i key={a.at} style={{ '--rd-v': accuracyOf(a) } as CSSProperties} title={pct(accuracyOf(a))} />
                            ))}
                        </span>
                      )}
                    </span>
                    <span className="rd-card__stamp" aria-hidden="true">
                      {best ? (
                        <>
                          <span className="rd-card__stamp-top">BEST</span>
                          <span className="rd-card__stamp-score">
                            {best.score}/{best.total}
                          </span>
                          <span className="rd-card__stamp-date">{stampDate(best.at)}</span>
                        </>
                      ) : (
                        <>
                          <span className="rd-card__stamp-top">NOT YET</span>
                          <span className="rd-card__stamp-score">NEW</span>
                          <span className="rd-card__stamp-date">BORROWED</span>
                        </>
                      )}
                    </span>
                    <span className="rd-card__cta" aria-hidden="true">
                      {draft ? 'Resume reading' : best ? 'Borrow again' : 'Borrow this test'} <b>→</b>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="rd-cabinet__front" aria-hidden="true">
            <span className="rd-cabinet__label">
              <span>READING · A–{String.fromCharCode(64 + practiceSets.length)}</span>
            </span>
            <span className="rd-cabinet__handle" />
          </div>
        </div>
      </div>
    </section>
  )
}
