import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { pixelConfetti } from '../../../learn/fx'
import { sfx } from '../../../learn/sfx'
import { lectures } from './content'
import { HUB_PATH } from './library'
import { KIND_LABEL, KIND_LECTURE, alsoAccepted, correctText, describe, type Graded } from './practice-logic'
import { FlagIcon } from './QuestionSheet'
import { RetryWidget } from './RetryWidget'

export type ReviewFilter = 'all' | 'missed' | 'flagged'

interface ReviewProps {
  graded: Graded[]
  /** In a full test, only this passage's questions are listed. */
  passage?: number
  flagged: Set<string>
  current: string
  onShowEvidence: (g: Graded) => void
  /** Filter and "second look" live in the page, so the navigator can always reach a question. */
  filter: ReviewFilter
  onFilter: (filter: ReviewFilter) => void
  second: boolean
  onSecond: (on: boolean) => void
}

function promptOf(g: Graded) {
  const { q, group } = g.x
  if (q.type === 'pick') return `${group.prompt} (one of the two answers)`
  if (q.type === 'gap') return group.kind === 'short' ? q.before : `${q.before} ______ ${q.after}`.trim()
  if (q.type === 'choose') {
    if (group.kind === 'headings') return `Choose the heading for ${q.prompt}.`
    if (group.kind === 'paragraphs') return `Which paragraph contains ${q.prompt}?`
    if (group.kind === 'endings') return `${q.prompt} …`
  }
  return q.prompt
}

/** Which questions a filter shows. */
function reviewShown(graded: Graded[], flagged: Set<string>, filter: ReviewFilter, second: boolean) {
  if (second || filter === 'missed') return graded.filter((g) => !g.correct)
  if (filter === 'flagged') return graded.filter((g) => flagged.has(g.x.q.id))
  return graded
}

/** How a missed question was put right on the second look. */
type Fix = 'own' | 'hint'

/** The marked answer sheet: every question with the student's answer, the key and the reasoning. */
export function ReviewSheet({
  graded,
  passage,
  flagged,
  current,
  onShowEvidence,
  filter,
  onFilter,
  second,
  onSecond,
}: ReviewProps) {
  const missed = graded.filter((g) => !g.correct)
  // Second look: retry the missed questions before seeing the key.
  const [fixed, setFixed] = useState<Map<string, Fix>>(() => new Map())
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set())
  /** Questions where the student asked to be shown the evidence before answering again. */
  const [hinted, setHinted] = useState<Set<string>>(() => new Set())
  const doneRef = useRef<HTMLDivElement>(null)
  const answers = Object.fromEntries(graded.map((g) => [g.x.q.id, g.answer]))
  const here = passage === undefined ? graded : graded.filter((g) => g.x.passage === passage)
  const shown = reviewShown(here, flagged, filter, second)
  const settled = missed.filter((g) => fixed.has(g.x.q.id) || revealed.has(g.x.q.id)).length
  const allSettled = second && missed.length > 0 && settled === missed.length
  const ownFixes = [...fixed.values()].filter((f) => f === 'own').length
  const hintFixes = fixed.size - ownFixes

  const startSecondLook = () => {
    sfx.page()
    onSecond(true)
  }

  const solve = (id: string, misses: number) => {
    const next = new Map(fixed).set(id, misses === 0 && !hinted.has(id) ? 'own' : 'hint')
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
      // Confetti is for answers found unaided; a hint or a process of elimination earns a quieter well done.
      const own = [...next.values()].filter((f) => f === 'own').length
      if (own > 0) {
        window.setTimeout(() => {
          if (own === missed.length) sfx.complete()
          pixelConfetti(doneRef.current ?? undefined, {
            colors: ['#9be0a9', '#ffcf5c', '#fff1c9', '#cfe0ff'],
            count: Math.round(16 + (48 * own) / missed.length),
          })
        }, 450)
      }
    }
  }

  const tabs: [ReviewFilter, string, number][] = [
    ['all', 'All', here.length],
    ['missed', 'To learn from', here.filter((g) => !g.correct).length],
    ['flagged', 'Flagged', here.filter((g) => flagged.has(g.x.q.id)).length],
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
                    {ownFixes === missed.length
                      ? 'Every mistake fixed first time!'
                      : `${ownFixes} of ${missed.length} fixed first time${hintFixes ? `, ${hintFixes} with a hint` : ''}${
                          revealed.size ? `, ${revealed.size} looked up` : ''
                        }.`}
                  </b>{' '}
                  {ownFixes === missed.length
                    ? 'That is exactly how a band goes up: one understood mistake at a time.'
                    : 'Read the explanations below — understanding the ones that needed help is where the marks come from.'}
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
                onSecond(false)
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
                onFilter(key)
              }}
            >
              {label} <span>{count}</span>
            </button>
          ))}
        </div>
      </header>

      {shown.length === 0 ? (
        <p className="rd-rev-empty">
          {second && passage !== undefined && missed.length
            ? 'Nothing left to fix in this passage — try the other passages above.'
            : 'Nothing here — every one of these is correct.'}
        </p>
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
                  {fixed.has(q.id) && (
                    <span className={`rd-rev__fixed ${fixed.get(q.id) === 'hint' ? 'is-hint' : ''}`}>
                      {fixed.get(q.id) === 'own' ? '✓ Fixed first time' : '✓ Fixed with a hint'}
                    </span>
                  )}
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
                    answers={answers}
                    onSolved={(misses) => solve(q.id, misses)}
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
                      if (second && !g.correct && !fixed.has(q.id)) setHinted((h) => new Set(h).add(q.id))
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
