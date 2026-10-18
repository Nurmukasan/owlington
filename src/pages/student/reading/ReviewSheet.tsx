import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { pixelConfetti } from '../../../learn/fx'
import { sfx } from '../../../learn/sfx'
import { lectures } from './content'
import { HUB_PATH } from './library'
import { KIND_LABEL, KIND_LECTURE, alsoAccepted, correctText, describe, type Graded } from './practice-logic'
import { FlagIcon } from './QuestionSheet'
import { RetryWidget } from './RetryWidget'

interface ReviewProps {
  graded: Graded[]
  flagged: Set<string>
  current: string
  onShowEvidence: (g: Graded) => void
}

type Filter = 'all' | 'missed' | 'flagged'

function promptOf(g: Graded) {
  const { q, group } = g.x
  if (q.type === 'gap') return `${q.before} ______ ${q.after}`
  if (q.type === 'choose')
    return group.kind === 'headings' ? `Choose the heading for ${q.prompt}.` : `Which paragraph contains ${q.prompt}?`
  return q.prompt
}

/** The marked answer sheet: every question with the student's answer, the key and the reasoning. */
export function ReviewSheet({ graded, flagged, current, onShowEvidence }: ReviewProps) {
  const missed = graded.filter((g) => !g.correct)
  const flaggedList = graded.filter((g) => flagged.has(g.x.q.id))
  const [filter, setFilter] = useState<Filter>('all')
  // Second look: retry the missed questions before seeing the key.
  const [second, setSecond] = useState(false)
  const [fixed, setFixed] = useState<Set<string>>(() => new Set())
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set())
  const doneRef = useRef<HTMLDivElement>(null)
  const shown = second ? missed : filter === 'missed' ? missed : filter === 'flagged' ? flaggedList : graded
  const settled = missed.filter((g) => fixed.has(g.x.q.id) || revealed.has(g.x.q.id)).length
  const allSettled = second && missed.length > 0 && settled === missed.length

  const startSecondLook = () => {
    sfx.page()
    setSecond(true)
    setFilter('missed')
  }

  const solve = (id: string) => {
    const next = new Set(fixed).add(id)
    setFixed(next)
    const done = missed.every((g) => next.has(g.x.q.id) || revealed.has(g.x.q.id))
    if (done) {
      // Bring the banner into view inside its page (or the window on phones) without shifting the desk.
      const el = doneRef.current
      const pane = el?.closest<HTMLElement>('.rd-leaf')
      if (el && pane) {
        if (getComputedStyle(pane).overflowY !== 'visible') pane.scrollTo({ top: 0, behavior: 'smooth' })
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3, behavior: 'smooth' })
      }
      window.setTimeout(() => {
        sfx.complete()
        pixelConfetti(doneRef.current ?? undefined, { colors: ['#9be0a9', '#ffcf5c', '#fff1c9', '#cfe0ff'], count: 56 })
      }, 450)
    }
  }

  const tabs: [Filter, string, number][] = [
    ['all', 'All', graded.length],
    ['missed', 'To learn from', missed.length],
    ['flagged', 'Flagged', flaggedList.length],
  ]

  return (
    <div className="rd-sheet rd-sheet--review">
      <header className="rd-sheet__head">
        <p className="rd-sheet__eyebrow">MARKED BY THE LIBRARIAN</p>
        <h2 className="rd-sheet__title">Answers &amp; evidence</h2>
        <p className="rd-sheet__hint">“Show in passage” turns to the sentence that proves each answer.</p>
        {missed.length > 0 && !second && (
          <div className="rd-second">
            <span className="rd-second__icon" aria-hidden="true">
              ☾
            </span>
            <p>
              <b>Take a second look.</b> Retry the {missed.length} you missed before you read the answers — the evidence button
              becomes your hint.
            </p>
            <button type="button" className="rd-btn rd-btn--small" onClick={startSecondLook}>
              Start
            </button>
          </div>
        )}
        {second && (
          <div ref={doneRef} className={`rd-second rd-second--on ${allSettled ? 'is-done' : ''}`} aria-live="polite">
            <span className="rd-second__icon" aria-hidden="true">
              {allSettled ? '★' : '☾'}
            </span>
            <p>
              {allSettled ? (
                <>
                  <b>
                    {fixed.size === missed.length
                      ? 'Every mistake fixed!'
                      : `${fixed.size} of ${missed.length} fixed on your own.`}
                  </b>{' '}
                  That is exactly how a band goes up: one understood mistake at a time.
                </>
              ) : (
                <>
                  <b>Second look:</b> {fixed.size} of {missed.length} fixed.
                </>
              )}
            </p>
            <button
              type="button"
              className="rd-btn rd-btn--small rd-btn--ghost"
              onClick={() => {
                sfx.click()
                setSecond(false)
                setFilter('all')
              }}
            >
              {allSettled ? 'See all answers' : 'Exit'}
            </button>
          </div>
        )}
        <div className={`rd-filter ${second ? 'is-hidden' : ''}`} role="group" aria-label="Filter questions">
          {tabs.map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              className={`rd-filter__btn ${filter === key ? 'is-on' : ''}`}
              aria-pressed={filter === key}
              disabled={count === 0 && key !== 'all'}
              onClick={() => {
                sfx.click()
                setFilter(key)
              }}
            >
              {label} <span>{count}</span>
            </button>
          ))}
        </div>
      </header>

      {shown.length === 0 ? (
        <p className="rd-rev-empty">Nothing here — every one of these is correct.</p>
      ) : (
        <ol className="rd-revlist">
          {shown.map((g, i) => {
            const { q, n, group } = g.x
            const status = g.correct ? 'right' : g.answered ? 'wrong' : 'blank'
            const lecture = lectures.find((l) => l.id === KIND_LECTURE[group.kind])
            const accepted = alsoAccepted(g.x)
            return (
              <li
                key={q.id}
                id={`rd-q-${q.id}`}
                className={`rd-rev rd-rev--${status} ${current === q.id ? 'is-current' : ''} ${fixed.has(q.id) ? 'is-fixed' : ''}`}
                style={{ '--rd-i': Math.min(i, 12) } as CSSProperties}
              >
                <div className="rd-rev__head">
                  <span className="rd-rev__n" aria-hidden="true">
                    {n}
                  </span>
                  <span className="rd-rev__status">
                    <span className="rd-rev__icon" aria-hidden="true">
                      {status === 'right' ? '✓' : status === 'wrong' ? '✗' : '–'}
                    </span>
                    <span className="visually-hidden">Question {n}: </span>
                    {status === 'right' ? 'Correct' : status === 'wrong' ? 'Incorrect' : 'Not answered'}
                  </span>
                  {fixed.has(q.id) && <span className="rd-rev__fixed">✓ Fixed on second look</span>}
                  <span className="rd-rev__kind">{KIND_LABEL[group.kind]}</span>
                  {flagged.has(q.id) && (
                    <span className="rd-rev__flag">
                      <FlagIcon /> Flagged
                    </span>
                  )}
                </div>

                <p className="rd-rev__prompt">{promptOf(g)}</p>

                {second && !g.correct && !fixed.has(q.id) && !revealed.has(q.id) ? (
                  <RetryWidget
                    g={g}
                    onSolved={() => solve(q.id)}
                    onReveal={() => {
                      sfx.page()
                      setRevealed((r) => new Set(r).add(q.id))
                    }}
                  />
                ) : (
                  <>
                    <dl className="rd-rev__answers">
                      <div className={`rd-rev__ans rd-rev__ans--yours ${g.correct ? '' : 'is-off'}`}>
                        <dt>Your answer</dt>
                        <dd>
                          {g.answered ? <span className="rd-rev__given">{describe(g.x, g.answer)}</span> : <em>left blank</em>}
                          {g.overLimit && <em className="rd-rev__note"> — over the word limit ({group.limit})</em>}
                        </dd>
                      </div>
                      {!g.correct && (
                        <div className="rd-rev__ans rd-rev__ans--key">
                          <dt>Correct answer</dt>
                          <dd>
                            {correctText(g.x)}
                            {accepted.length > 0 && <small> (also accepted: {accepted.join(', ')})</small>}
                          </dd>
                        </div>
                      )}
                      {g.correct && accepted.length > 0 && (
                        <div className="rd-rev__ans rd-rev__ans--key">
                          <dt>Also accepted</dt>
                          <dd>{[q.type === 'gap' ? q.answers[0] : '', ...accepted].filter(Boolean).join(', ')}</dd>
                        </div>
                      )}
                    </dl>

                    <p className="rd-rev__why">
                      <b>Why: </b>
                      {q.explanation}
                    </p>
                  </>
                )}

                <div className="rd-rev__actions">
                  <button
                    type="button"
                    className="rd-evbtn"
                    onClick={() => {
                      sfx.page()
                      onShowEvidence(g)
                    }}
                  >
                    <span aria-hidden="true">☾</span>{' '}
                    {second && !fixed.has(q.id) && !revealed.has(q.id) ? 'Hint: show me where' : 'Show in passage'}
                    <span className="rd-evbtn__ids">¶ {[...new Set(q.evidence.map((e) => e[0]))].join(', ')}</span>
                  </button>
                  {!g.correct && lecture && (
                    <Link to={`${HUB_PATH}/lecture/${lecture.id}`} className="rd-revise">
                      Revise: {lecture.title} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
