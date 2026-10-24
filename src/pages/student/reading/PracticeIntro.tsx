import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PixelSprite } from '../../../components/PixelSprite'
import type { Attempt } from '../../../learn/progress'
import type { PracticeInfo } from '../../../learn/types'
import { formatClock } from '../../../learn/useTimer'
import { lectures, practiceSets } from './content'
import { LibrarianOwl } from './LibrarianOwl'
import { HUB_PATH, accuracyOf, bandEstimate, pct, shortDate, stampDate } from './library'
import type { ReadingTest } from './practice-data'
import { KIND_HINT, KIND_LECTURE, kindsOf, testWords, type Draft } from './practice-logic'
import { CANDLE_SPRITE, HIGHLIGHTER_SPRITE, RIBBON_SPRITE, SCROLL_SPRITE } from './sprites'

interface IntroProps {
  info: PracticeInfo
  test: ReadingTest
  callNumber: string
  attempts: Attempt[]
  best?: Attempt
  draft: Draft | null
  questionCount: number
  onStart: () => void
  onResume: () => void
}

function owlLine(best: Attempt | undefined, attempts: Attempt[], draft: Draft | null) {
  if (draft) return 'Your bookmark is still in this passage. Shall we pick up where you left off?'
  if (!best) return 'Skim the whole passage first — two minutes, no more. Then the questions will feel like old friends.'
  const acc = accuracyOf(best)
  if (acc >= 1) return 'A perfect card already! Read it again at speed — can you beat your time?'
  if (acc >= 0.7) return `Your best is ${best.score}/${best.total}. One more careful read could make it a perfect card.`
  if (attempts.length > 1)
    return `Best so far: ${best.score}/${best.total}. Slow down at the key words — that stamp is about to change.`
  return `Last time: ${best.score}/${best.total}. The evidence is all in the passage — let’s beat that stamp.`
}

/** The borrowing desk: what the test holds, how the room works, and this card's history. */
export function PracticeIntro({ info, test, callNumber, attempts, best, draft, questionCount, onStart, onResume }: IntroProps) {
  const index = practiceSets.findIndex((p) => p.id === info.id)
  const kinds = kindsOf(test)
  const words = Math.round(testWords(test) / 10) * 10
  const single = test.passages.length === 1 ? test.passages[0] : undefined
  const draftAnswered = draft ? Object.values(draft.answers).filter((v) => v && v.trim()).length : 0
  const line = owlLine(best, attempts, draft)
  const stampTone = !best ? 'new' : accuracyOf(best) >= 0.7 ? 'great' : accuracyOf(best) >= 0.5 ? 'good' : 'low'

  return (
    <div className="rd-pintro">
      <nav className="rd-crumbs" aria-label="Breadcrumb">
        <Link to={HUB_PATH} className="rd-crumbs__back">
          <span aria-hidden="true">←</span> The Moonlit Library
        </Link>
        <span aria-hidden="true">/</span>
        <Link to={`${HUB_PATH}/practice`}>Practice</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{callNumber}</span>
      </nav>

      <div className="rd-pintro__grid">
        <article className="rd-ticket" aria-labelledby="rd-ticket-title">
          <span className="rd-ticket__punch" aria-hidden="true" />
          <div className="rd-pintro__owl rd-pintro__owl--inline">
            <p className="rd-ticket__bubble">{line}</p>
            <LibrarianOwl scale={3} look={1} />
          </div>

          <p className="rd-ticket__head">
            <span className="rd-ticket__call">{callNumber}</span>
            <span className={`rd-lvl rd-lvl--${info.level.toLowerCase()}`}>{info.level}</span>
          </p>
          <p className="rd-ticket__eyebrow">
            PRACTICE TEST {index + 1} OF {practiceSets.length}
          </p>
          <h1 className="rd-ticket__title" id="rd-ticket-title">
            {info.title}
          </h1>
          <p className="rd-ticket__summary">{info.summary}</p>

          <dl className="rd-ticket__facts">
            <div>
              <dt>Time</dt>
              <dd>
                {info.minutes}
                <small> min</small>
              </dd>
            </div>
            <div>
              <dt>Questions</dt>
              <dd>{questionCount}</dd>
            </div>
            <div>
              <dt>{single ? 'Passage' : 'Reading'}</dt>
              <dd>
                ~{words}
                <small> words</small>
              </dd>
            </div>
            {single ? (
              <div>
                <dt>Paragraphs</dt>
                <dd>A–{single.paragraphs[single.paragraphs.length - 1].label}</dd>
              </div>
            ) : (
              <div>
                <dt>Passages</dt>
                <dd>{test.passages.length}</dd>
              </div>
            )}
          </dl>

          <div className="rd-ticket__actions">
            {draft ? (
              <>
                <button type="button" className="rd-btn rd-btn--gold rd-ticket__go" onClick={onResume}>
                  Resume reading <span aria-hidden="true">→</span>
                </button>
                <button type="button" className="rd-btn rd-btn--ghost" onClick={onStart}>
                  Start over
                </button>
                <p className="rd-ticket__draft">
                  Bookmark saved: {draftAnswered} of {questionCount} answered ·{' '}
                  {draft.elapsed < info.minutes * 60
                    ? `${formatClock(info.minutes * 60 - draft.elapsed)} left on the candle`
                    : 'the candle had burned out'}
                </p>
              </>
            ) : (
              <>
                <button type="button" className="rd-btn rd-btn--gold rd-ticket__go" onClick={onStart}>
                  <span className="rd-ticket__flame" aria-hidden="true" />
                  Light the candle &amp; begin <span aria-hidden="true">→</span>
                </button>
                <Link to={`${HUB_PATH}/practice`} className="rd-ticket__back">
                  Back to the catalogue
                </Link>
              </>
            )}
          </div>

          <h2 className="rd-ticket__h">Inside this test</h2>
          <ul className="rd-kinds">
            {kinds.map((k, i) => {
              const lecture = lectures.find((l) => l.id === KIND_LECTURE[k.kind])
              return (
                <li key={k.label} style={{ '--rd-i': i } as CSSProperties}>
                  <span className="rd-kinds__count" aria-hidden="true">
                    {k.count}
                  </span>
                  <span className="rd-kinds__body">
                    <b>
                      {k.label}
                      <span className="visually-hidden">, {k.count} questions</span>
                    </b>
                    <span>{KIND_HINT[k.kind]}</span>
                  </span>
                  {lecture && (
                    <Link className="rd-kinds__revise" to={`${HUB_PATH}/lecture/${lecture.id}`}>
                      Revise first<span className="visually-hidden">: {lecture.title}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </article>

        <aside className="rd-pintro__side">
          <div className="rd-pintro__owl rd-pintro__owl--side">
            <p className="rd-ticket__bubble">{line}</p>
            <LibrarianOwl scale={4} look={-1} />
          </div>
          <section className="rd-howto" aria-labelledby="rd-howto-title">
            <h2 className="rd-howto__title" id="rd-howto-title">
              How the reading room works
            </h2>
            <ul className="rd-howto__list">
              <li>
                <PixelSprite sprite={CANDLE_SPRITE} scale={3} className="rd-howto__icon" />
                <span>
                  <b>The candle is your clock.</b> It burns for {info.minutes} minutes. When it goes out you can finish your
                  thought, but in the real exam pens go down.
                </span>
              </li>
              <li>
                <PixelSprite sprite={HIGHLIGHTER_SPRITE} scale={3} className="rd-howto__icon" />
                <span>
                  <b>Highlight as you read.</b> Select words in the passage to mark them in amber. Click a highlight to rub it
                  out.
                </span>
              </li>
              <li>
                <PixelSprite sprite={RIBBON_SPRITE} scale={4} className="rd-howto__icon" />
                <span>
                  <b>Flag and move on.</b> Stuck for more than 90 seconds? Make a guess, flag it and come back later.
                </span>
              </li>
              <li>
                <PixelSprite sprite={SCROLL_SPRITE} scale={3} className="rd-howto__icon" />
                <span>
                  <b>Word limits are strict.</b> Copy words exactly from the passage. Spelling counts; capitals don’t.
                </span>
              </li>
            </ul>
          </section>

          <section className="rd-history" aria-labelledby="rd-history-title">
            <div className="rd-history__head">
              <h2 className="rd-history__title" id="rd-history-title">
                Borrowing history
              </h2>
              <span className={`rd-history__stamp rd-tone--${stampTone}`} aria-hidden="true">
                {best ? (
                  <>
                    <span>BEST</span>
                    <b>
                      {best.score}/{best.total}
                    </b>
                    <span>{stampDate(best.at)}</span>
                  </>
                ) : (
                  <>
                    <span>NOT YET</span>
                    <b>NEW</b>
                    <span>BORROWED</span>
                  </>
                )}
              </span>
            </div>
            {attempts.length === 0 ? (
              <p className="rd-history__empty">
                No stamps on this card yet. Your first score lands here — and every attempt after it, so you can watch yourself
                improve.
              </p>
            ) : (
              <>
                {best && (
                  <p className="rd-history__best">
                    Best: <b>{pct(accuracyOf(best))}</b> ({best.score}/{best.total}) · about Band{' '}
                    {bandEstimate(best.score, best.total).toFixed(1)}
                  </p>
                )}
                <table className="rd-history__table">
                  <caption className="visually-hidden">Your attempts at this test, newest first</caption>
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Score</th>
                      <th scope="col">
                        <span className="visually-hidden">Accuracy</span>
                      </th>
                      <th scope="col">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.slice(0, 5).map((a) => (
                      <tr key={a.at} className={a === best ? 'is-best' : ''}>
                        <td>{shortDate(a.at)}</td>
                        <td>
                          {a.score}/{a.total}
                          {a === best && (
                            <span className="rd-history__star" aria-label="best">
                              ★
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="rd-history__bar" aria-hidden="true">
                            <i style={{ width: pct(accuracyOf(a)) }} />
                          </span>
                          <span className="visually-hidden">{pct(accuracyOf(a))}</span>
                        </td>
                        <td>{formatClock(a.durationSec)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {attempts.length > 5 && <p className="rd-history__more">+ {attempts.length - 5} earlier attempts</p>}
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
