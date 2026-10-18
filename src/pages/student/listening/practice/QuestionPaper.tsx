import { Fragment, useState, type CSSProperties, type ReactNode } from 'react'
import { sfx } from '../../../../learn/sfx'
import { overLimit } from '../answers'
import { questionsOf, type GapQuestion, type PracticeSet, type Question, type TaskGroup, type WordLimit } from '../practice-data'
import { ParkMap } from './ParkMap'
import { focusQuestion, groupRange, inRange, rangeText, type Answers, type Mode, type Range } from './script'

interface PaperProps {
  set: PracticeSet
  part: string
  title: string
  answers: Answers
  onAnswer: (n: number, value: string) => void
  mode: Mode
  live: Range | null
  onSubmit: () => void
}

/** The answer sheet: cream paper, IELTS layout, Owl FM ink. */
export function QuestionPaper({ set, part, title, answers, onAnswer, mode, live, onSubmit }: PaperProps) {
  const questions = questionsOf(set)
  const answered = questions.filter((q) => (answers[q.n] ?? '').trim()).length

  return (
    <section className="ls-paper" aria-labelledby="ls-paper-title">
      <nav className="ls-sheetnav" aria-label="Jump to a question">
        <span className="ls-sheetnav__label" aria-hidden="true">
          ANSWERS
        </span>
        <ol className="ls-sheetnav__list">
          {questions.map((q) => {
            const done = Boolean((answers[q.n] ?? '').trim())
            return (
              <li key={q.n}>
                <button
                  type="button"
                  className={`ls-qbtn ${done ? 'is-answered' : ''} ${inRange(q.n, live) ? 'is-live' : ''}`}
                  onClick={() => focusQuestion(q.n)}
                  aria-label={`Question ${q.n}, ${done ? 'answered' : 'not answered yet'}`}
                >
                  {q.n}
                </button>
              </li>
            )
          })}
        </ol>
        <span className="ls-sheetnav__count" aria-live="polite">
          <strong>{answered}</strong>/{questions.length}
          <span className="visually-hidden"> answered</span>
        </span>
        <button type="button" className="ls-btn ls-btn--teal ls-btn--small ls-sheetnav__submit" onClick={onSubmit}>
          Submit
        </button>
      </nav>

      <div className="ls-paper__sheet">
        <header className="ls-paper__head">
          <p className="ls-paper__kicker">IELTS LISTENING · {part}</p>
          <h2 className="ls-paper__title" id="ls-paper-title">
            {title}
          </h2>
          <p className="ls-paper__meta">
            {rangeText([1, questions.length])} · answers can be changed until you submit
          </p>
        </header>

        {set.groups.map((g, gi) => (
          <Group key={g.id} group={g} index={gi} answers={answers} onAnswer={onAnswer} mode={mode} live={live} />
        ))}

        <footer className="ls-paper__foot">
          <p>
            {answered === questions.length
              ? 'Every answer is in. Give them one last check, then hand in your sheet.'
              : `${questions.length - answered} still blank. A guess can still score, a blank never does.`}
          </p>
          <button type="button" className="ls-btn ls-btn--teal ls-btn--big" onClick={onSubmit}>
            Submit answers <span aria-hidden="true">»</span>
          </button>
        </footer>
      </div>
    </section>
  )
}

// ----------------------------------------------------------------- groups ---

interface GroupProps {
  group: TaskGroup
  index: number
  answers: Answers
  onAnswer: (n: number, value: string) => void
  mode: Mode
  live: Range | null
}

function Group({ group, index, answers, onAnswer, mode, live }: GroupProps) {
  const range = groupRange(group)
  const isLive = group.questions.some((q) => inRange(q.n, live))
  return (
    <section className={`ls-group ls-group--${group.type} ${isLive ? 'is-live' : ''}`} style={{ '--i': index } as CSSProperties} aria-labelledby={`ls-group-${group.id}`}>
      <header className="ls-group__head">
        <h3 className="ls-group__range" id={`ls-group-${group.id}`}>
          {rangeText(range)}
          {isLive && (
            <span className="ls-group__live">
              <i aria-hidden="true" /> ON AIR
            </span>
          )}
        </h3>
        <p className="ls-group__instruction">{group.instruction}</p>
        {group.limit && (
          <p className="ls-group__limit">
            Write <strong>{group.limit.text}</strong> for each answer.
          </p>
        )}
      </header>

      {(group.type === 'form' || group.type === 'notes') && <GapSheet group={group} answers={answers} onAnswer={onAnswer} mode={mode} live={live} />}
      {group.type === 'choice' && <ChoiceList group={group} answers={answers} onAnswer={onAnswer} live={live} />}
      {(group.type === 'map' || group.type === 'matching') && <LetterGrid group={group} answers={answers} onAnswer={onAnswer} live={live} />}
    </section>
  )
}

// --------------------------------------------------------- form & notes ---

function Gap({ q, value, onAnswer, limit, live, mode }: { q: GapQuestion; value: string; onAnswer: (n: number, v: string) => void; limit?: WordLimit; live: boolean; mode: Mode }) {
  const over = mode === 'practice' && overLimit(value, limit)
  return (
    <span className={`ls-gap ${live ? 'is-live' : ''} ${value.trim() ? 'is-filled' : ''} ${over ? 'is-over' : ''}`} data-q={q.n}>
      <span className="ls-gap__no" aria-hidden="true">
        {q.n}
      </span>
      <input
        id={`ls-q-${q.n}`}
        className="ls-gap__input"
        type="text"
        value={value}
        onChange={(e) => onAnswer(q.n, e.target.value)}
        aria-label={`Question ${q.n}`}
        aria-invalid={over || undefined}
        aria-describedby={over ? `ls-q-${q.n}-warn` : undefined}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={40}
      />
      {over && (
        <span className="ls-gap__warn" id={`ls-q-${q.n}-warn`}>
          Over the limit: {limit?.text.toLowerCase()}
        </span>
      )}
    </span>
  )
}

function withGaps(text: string, render: (n: number) => ReactNode) {
  return text.split(/\{(\d+)\}/).map((part, i) => (i % 2 ? <Fragment key={i}>{render(Number(part))}</Fragment> : <Fragment key={i}>{part}</Fragment>))
}

function GapSheet({ group, answers, onAnswer, mode, live }: Omit<GroupProps, 'index'>) {
  const byN = new Map(group.questions.map((q) => [q.n, q]))
  const gap = (n: number) => {
    const q = byN.get(n)
    if (!q || q.kind !== 'gap') return null
    return <Gap q={q} value={answers[n] ?? ''} onAnswer={onAnswer} limit={group.limit} live={inRange(n, live)} mode={mode} />
  }

  if (group.type === 'form') {
    return (
      <div className="ls-form">
        {group.title && <p className="ls-form__title">{group.title}</p>}
        <div className="ls-form__rows">
          {group.rows?.map((r, i) =>
            r.kind === 'heading' ? (
              <p key={i} className="ls-form__heading">
                {r.text}
              </p>
            ) : (
              <div key={i} className={`ls-form__row ${r.kind === 'example' ? 'is-example' : ''}`}>
                <span className="ls-form__label">
                  {r.kind === 'example' && <span className="ls-form__eg">Example</span>}
                  {r.label}
                </span>
                <span className="ls-form__value">{withGaps(r.text, gap)}</span>
              </div>
            ),
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="ls-notes">
      {group.title && <p className="ls-notes__title">{group.title}</p>}
      {group.rows?.map((r, i) =>
        r.kind === 'sub' ? (
          <p key={i} className="ls-notes__sub">
            {r.text}
          </p>
        ) : (
          <p key={i} className="ls-notes__item">
            {withGaps(r.text, gap)}
          </p>
        ),
      )}
    </div>
  )
}

// -------------------------------------------------------- multiple choice ---

function ChoiceList({ group, answers, onAnswer, live }: Omit<GroupProps, 'index' | 'mode'>) {
  return (
    <ol className="ls-mcqs">
      {group.questions.map((q) =>
        q.kind === 'choice' ? (
          <li key={q.n} className={`ls-mcq ${inRange(q.n, live) ? 'is-live' : ''}`} data-q={q.n}>
            <p className="ls-mcq__stem" id={`ls-q-${q.n}-stem`}>
              <span className="ls-qno" aria-hidden="true">
                {q.n}
              </span>
              <span>
                <span className="visually-hidden">Question {q.n}. </span>
                {q.stem}
              </span>
            </p>
            <div className="ls-mcq__opts" role="radiogroup" aria-labelledby={`ls-q-${q.n}-stem`} id={`ls-q-${q.n}`}>
              {q.options.map((o) => {
                const on = answers[q.n] === o.key
                return (
                  <label key={o.key} className={`ls-opt ${on ? 'is-on' : ''}`}>
                    <input
                      type="radio"
                      name={`ls-q-${q.n}`}
                      value={o.key}
                      checked={on}
                      onChange={() => {
                        sfx.click()
                        onAnswer(q.n, o.key)
                      }}
                    />
                    <span className="ls-opt__key" aria-hidden="true">
                      {o.key}
                    </span>
                    <span className="ls-opt__text">{o.text}</span>
                  </label>
                )
              })}
            </div>
          </li>
        ) : null,
      )}
    </ol>
  )
}

// ------------------------------------------------- map labelling / matching ---

function LetterGrid({ group, answers, onAnswer, live }: Omit<GroupProps, 'index' | 'mode'>) {
  const letters = group.options ?? []
  const qs = group.questions.filter((q): q is Extract<Question, { kind: 'letter' }> => q.kind === 'letter')
  const [hover, setHover] = useState<string | null>(null)
  const [active, setActive] = useState(qs[0]?.n ?? 0)
  const isMap = group.type === 'map'

  const placed: Record<string, number[]> = {}
  for (const q of qs) {
    const a = answers[q.n]
    if (a) placed[a] = [...(placed[a] ?? []), q.n]
  }

  const pick = (letter: string) => {
    if (!active) return
    sfx.click()
    onAnswer(active, letter)
    const i = qs.findIndex((q) => q.n === active)
    const nextBlank = [...qs.slice(i + 1), ...qs.slice(0, i)].find((q) => !answers[q.n])
    if (nextBlank) setActive(nextBlank.n)
  }

  return (
    <div className={`ls-lettergrid ${isMap ? 'is-map' : 'is-matching'}`}>
      {isMap ? (
        <div className="ls-lettergrid__map">
          <ParkMap highlight={hover} placed={placed} onPick={pick} />
          <p className="ls-lettergrid__hint">
            Tip: choose a place below, then tap its letter on the map, or fill in the grid. Now placing:{' '}
            <strong>
              {active} · {qs.find((q) => q.n === active)?.label}
            </strong>
          </p>
        </div>
      ) : (
        <div className="ls-box">
          <p className="ls-box__title">{group.optionsTitle}</p>
          <ul className="ls-box__list">
            {letters.map((o) => (
              <li key={o.key} className={hover === o.key ? 'is-lit' : ''}>
                <span className="ls-box__key">{o.key}</span>
                {o.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ol className="ls-bubbles">
        {qs.map((q) => (
          <li
            key={q.n}
            className={`ls-bubbles__row ${inRange(q.n, live) ? 'is-live' : ''} ${active === q.n ? 'is-active' : ''}`}
            data-q={q.n}
            onFocus={() => setActive(q.n)}
            onClick={() => setActive(q.n)}
          >
            <span className="ls-bubbles__label" id={`ls-q-${q.n}-label`}>
              <span className="ls-qno" aria-hidden="true">
                {q.n}
              </span>
              <span>
                <span className="visually-hidden">Question {q.n}: </span>
                {q.label}
              </span>
            </span>
            <span className="ls-bubbles__opts" role="radiogroup" aria-labelledby={`ls-q-${q.n}-label`} id={`ls-q-${q.n}`}>
              {letters.map((o) => {
                const on = answers[q.n] === o.key
                return (
                  <label
                    key={o.key}
                    className={`ls-bubble ${on ? 'is-on' : ''}`}
                    onPointerEnter={() => setHover(o.key)}
                    onPointerLeave={() => setHover(null)}
                  >
                    <input
                      type="radio"
                      name={`ls-q-${q.n}`}
                      value={o.key}
                      checked={on}
                      aria-label={isMap ? `Letter ${o.key}` : `${o.key}: ${o.text}`}
                      onFocus={() => setHover(o.key)}
                      onBlur={() => setHover(null)}
                      onChange={() => {
                        sfx.click()
                        onAnswer(q.n, o.key)
                      }}
                    />
                    <span aria-hidden="true">{o.key}</span>
                  </label>
                )
              })}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
