import type { ReactNode } from 'react'
import { sfx } from '../../../learn/sfx'
import type { PracticeSet, QuestionGroup } from './practice-data'
import {
  KIND_LABEL,
  groupRange,
  isAnswered,
  isOverLimit,
  letter,
  wordCount,
  type Answers,
  type NumberedQuestion,
} from './practice-logic'

interface SheetProps {
  set: PracticeSet
  questions: NumberedQuestion[]
  answers: Answers
  onAnswer: (id: string, value: string) => void
  flagged: Set<string>
  onToggleFlag: (id: string) => void
  current: string
  onCurrent: (id: string) => void
}

const LIMIT_WORDS: Record<number, string> = { 1: 'ONE', 2: 'TWO', 3: 'THREE' }

/** A bookmark-ribbon flag icon. */
export function FlagIcon() {
  return (
    <svg viewBox="0 0 10 12" width="10" height="12" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M1 0h8v12L5 8 1 12z" fill="currentColor" />
    </svg>
  )
}

function FlagButton({ n, on, onClick }: { n: number; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`rd-flag ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      onClick={() => {
        sfx.click()
        onClick()
      }}
      title={on ? 'Remove flag' : 'Flag for review'}
    >
      <FlagIcon />
      <span className="rd-flag__text">{on ? 'Flagged' : 'Flag'}</span>
      <span className="visually-hidden"> question {n} for review</span>
    </button>
  )
}

/** Instructions, with the word limit (or the answer key for T/F/NG) set out clearly. */
function Instructions({ group }: { group: QuestionGroup }) {
  if (group.kind === 'tfng' || group.kind === 'ynng') {
    const [yes, no] = group.kind === 'tfng' ? ['TRUE', 'FALSE'] : ['YES', 'NO']
    const lead =
      group.kind === 'tfng'
        ? 'Do the following statements agree with the information given in the reading passage?'
        : 'Do the following statements agree with the claims of the writer in the reading passage?'
    return (
      <>
        <p className="rd-qgroup__instructions">{lead}</p>
        <dl className="rd-key">
          <div>
            <dt>{yes}</dt>
            <dd>
              {group.kind === 'tfng'
                ? 'if the statement agrees with the information'
                : 'if the statement agrees with the claims of the writer'}
            </dd>
          </div>
          <div>
            <dt>{no}</dt>
            <dd>
              {group.kind === 'tfng'
                ? 'if the statement contradicts the information'
                : 'if the statement contradicts the claims of the writer'}
            </dd>
          </div>
          <div>
            <dt>NOT GIVEN</dt>
            <dd>
              {group.kind === 'tfng'
                ? 'if there is no information on this'
                : 'if it is impossible to say what the writer thinks about this'}
            </dd>
          </div>
        </dl>
      </>
    )
  }
  const text = group.instructions
  if (group.limit && text.includes(group.limit)) {
    const [before, after] = text.split(group.limit)
    return (
      <p className="rd-qgroup__instructions">
        {before}
        <strong className="rd-limit">{group.limit}</strong>
        {after}
      </p>
    )
  }
  return <p className="rd-qgroup__instructions">{text}</p>
}

/** The shared list for a group: headings or a word box, crossed off as they are used. */
function OptionsBox({ group, questions, answers }: { group: QuestionGroup; questions: NumberedQuestion[]; answers: Answers }) {
  if (!group.options) return null
  const inGroup = questions.filter((x) => x.group === group)
  const usedBy = (value: string) =>
    inGroup
      .filter((x) => answers[x.q.id] === value)
      .map((x) => (x.q.type === 'choose' && x.q.paragraph ? x.q.paragraph : String(x.n)))
  return (
    <div className={`rd-optbox rd-optbox--${group.kind}`}>
      <p className="rd-optbox__title">{group.optionsTitle ?? 'Options'}</p>
      <ul className="rd-optbox__list">
        {group.options.map((o) => {
          const used = usedBy(o.value)
          return (
            <li key={o.value} className={used.length ? 'is-used' : ''}>
              <b>{o.value}</b>
              <span>{o.label}</span>
              {used.length > 0 && (
                <em className="rd-optbox__used">
                  → {used.join(', ')}
                  <span className="visually-hidden"> (used)</span>
                </em>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function WordMeter({ x, value }: { x: NumberedQuestion; value: string }) {
  const max = x.group.maxWords
  if (!max) return null
  const count = wordCount(value)
  const over = count > max
  return (
    <p className={`rd-meter ${over ? 'is-over' : ''} ${count ? 'is-on' : ''}`} aria-live="polite">
      {over ? (
        <>
          <b>{count} words</b> — the limit is {x.group.limit ?? `${max} words`}. Extra words cost the whole mark.
        </>
      ) : (
        <>
          {count} / {max} {max === 1 ? 'word' : 'words'}
        </>
      )}
    </p>
  )
}

export function QuestionSheet({ set, questions, answers, onAnswer, flagged, onToggleFlag, current, onCurrent }: SheetProps) {
  const choose = (id: string, value: string) => {
    if (answers[id] !== value) sfx.click()
    onAnswer(id, value)
  }

  const radio = (x: NumberedQuestion, value: string, face: ReactNode, extraClass = '') => {
    const checked = answers[x.q.id] === value
    return (
      <label key={value} className={`rd-opt ${extraClass} ${checked ? 'is-on' : ''}`}>
        <input
          type="radio"
          className="rd-opt__input"
          name={`rd-${x.q.id}`}
          value={value}
          checked={checked}
          onChange={() => choose(x.q.id, value)}
        />
        <span className="rd-opt__face">{face}</span>
      </label>
    )
  }

  const card = (x: NumberedQuestion, body: ReactNode, prompt: ReactNode, extra = '') => {
    const id = x.q.id
    const answered = isAnswered(answers[id])
    return (
      <li
        key={id}
        id={`rd-q-${id}`}
        className={`rd-q ${extra} ${current === id ? 'is-current' : ''} ${flagged.has(id) ? 'is-flagged' : ''} ${answered ? 'is-answered' : ''}`}
        onFocusCapture={() => onCurrent(id)}
        onPointerDown={() => onCurrent(id)}
      >
        <div className="rd-q__head">
          <span className="rd-q__n" aria-hidden="true">
            {x.n}
          </span>
          <div className="rd-q__prompt" id={`rd-qp-${id}`}>
            <span className="visually-hidden">Question {x.n}. </span>
            {prompt}
          </div>
          <FlagButton n={x.n} on={flagged.has(id)} onClick={() => onToggleFlag(id)} />
        </div>
        {body}
      </li>
    )
  }

  const renderQuestion = (x: NumberedQuestion) => {
    const { q, group } = x
    const labelled = { role: 'radiogroup', 'aria-labelledby': `rd-qp-${q.id}` } as const

    if (q.type === 'tfng' || q.type === 'ynng') {
      const values = q.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN']
      return card(
        x,
        <div className="rd-opts rd-opts--tri" {...labelled}>
          {values.map((v) => radio(x, v, v))}
        </div>,
        <p>{q.prompt}</p>,
      )
    }

    if (q.type === 'mcq') {
      return card(
        x,
        <div className="rd-opts rd-opts--mcq" {...labelled}>
          {q.options.map((o, i) =>
            radio(
              x,
              letter(i),
              <>
                <b className="rd-opt__letter">{letter(i)}</b>
                <span>{o}</span>
              </>,
              'rd-opt--row',
            ),
          )}
        </div>,
        <p>{q.prompt}</p>,
      )
    }

    if (q.type === 'choose') {
      const options = group.options ?? []
      const picked = options.find((o) => o.value === answers[q.id])
      const isHeading = group.kind === 'headings'
      return card(
        x,
        <>
          <div className={`rd-opts rd-opts--chips ${isHeading ? 'rd-opts--roman' : ''}`} {...labelled}>
            {options.map((o) =>
              radio(
                x,
                o.value,
                <>
                  <span aria-hidden="true">{o.value}</span>
                  <span className="visually-hidden">{isHeading ? `heading ${o.value}: ${o.label}` : o.label}</span>
                </>,
                'rd-opt--chip',
              ),
            )}
          </div>
          {isHeading && (
            <p className={`rd-picked ${picked ? 'is-on' : ''}`} aria-hidden="true">
              {picked ? picked.label : 'Pick a heading from the list above.'}
            </p>
          )}
        </>,
        isHeading ? (
          <p>
            <b>{q.prompt}</b>
          </p>
        ) : (
          <p>{q.prompt}</p>
        ),
        isHeading ? 'rd-q--heading' : '',
      )
    }

    // A gap in a sentence (summaries are rendered separately). The sentence is the prompt.
    const value = answers[q.id] ?? ''
    const [, afterFirst = '', afterRest = ''] = q.after.match(/^(\S*)([\s\S]*)$/) ?? []
    return card(
      x,
      <WordMeter x={x} value={value} />,
      <p className="rd-gapline">
        {q.before}{' '}
        <span className="rd-nowrap">
          <input
            type="text"
            className={`rd-gap ${isOverLimit(x, value) ? 'is-over' : ''}`}
            value={value}
            onChange={(e) => onAnswer(q.id, e.target.value)}
            aria-label={`Question ${x.n}: ${q.before} … ${q.after}`}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
          />
          {afterFirst && (/^[.,;:!?]/.test(afterFirst) ? afterFirst : ` ${afterFirst}`)}
        </span>
        {afterRest}
      </p>,
      'rd-q--gap',
    )
  }

  const renderSummary = (group: QuestionGroup, items: NumberedQuestion[]) => {
    const over = items.filter((x) => isOverLimit(x, answers[x.q.id]))
    return (
      <div className="rd-summary">
        {group.summaryTitle && <p className="rd-summary__title">{group.summaryTitle}</p>}
        <p className="rd-summary__text">
          {items.map((x) => {
            if (x.q.type !== 'gap') return null
            const id = x.q.id
            const value = answers[id] ?? ''
            return (
              <span
                key={id}
                id={`rd-q-${id}`}
                className={`rd-sgap ${current === id ? 'is-current' : ''} ${flagged.has(id) ? 'is-flagged' : ''}`}
                onFocusCapture={() => onCurrent(id)}
              >
                {x.q.before}{' '}
                <span className="rd-sgap__field">
                  <span className="rd-sgap__n" aria-hidden="true">
                    {x.n}
                  </span>
                  {group.options ? (
                    <select
                      className={`rd-gapselect ${value ? 'is-on' : ''}`}
                      value={value}
                      onChange={(e) => choose(id, e.target.value)}
                      aria-label={`Question ${x.n}: ${x.q.before} … ${x.q.after}`}
                    >
                      <option value="">Choose…</option>
                      {group.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.value} — {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={`rd-gap ${isOverLimit(x, value) ? 'is-over' : ''}`}
                      value={value}
                      onChange={(e) => onAnswer(id, e.target.value)}
                      aria-label={`Question ${x.n}: ${x.q.before} … ${x.q.after}`}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  )}
                  {flagged.has(id) && (
                    <span className="rd-sgap__flag" title="Flagged for review">
                      <FlagIcon />
                    </span>
                  )}
                </span>{' '}
                {x.q.after}{' '}
              </span>
            )
          })}
        </p>
        {group.maxWords && (
          <p className={`rd-meter ${over.length ? 'is-over is-on' : ''}`} aria-live="polite">
            {over.length
              ? `${over.map((x) => `Question ${x.n}`).join(', ')}: over the limit (${group.limit}). Extra words cost the whole mark.`
              : `${LIMIT_WORDS[group.maxWords] ?? group.maxWords} ${group.maxWords === 1 ? 'word' : 'words'} at most per gap.`}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rd-sheet">
      <header className="rd-sheet__head">
        <p className="rd-sheet__eyebrow">QUESTION BOOKLET</p>
        <h2 className="rd-sheet__title">
          Questions {questions[0]?.n}–{questions[questions.length - 1]?.n}
        </h2>
        <p className="rd-sheet__hint">Answers save as you go. Change them as often as you like before you hand in.</p>
      </header>

      {set.groups.map((group, gi) => {
        const items = questions.filter((x) => x.groupIndex === gi)
        const isSummary = group.kind === 'summary' || group.kind === 'wordbox'
        return (
          <section key={gi} className={`rd-qgroup rd-qgroup--${group.kind}`} aria-labelledby={`rd-qg-${gi}`}>
            <header className="rd-qgroup__head">
              <h3 className="rd-qgroup__range" id={`rd-qg-${gi}`}>
                {groupRange(questions, gi)}
              </h3>
              <p className="rd-qgroup__kind">{KIND_LABEL[group.kind]}</p>
            </header>
            <Instructions group={group} />
            {group.kind !== 'paragraphs' && <OptionsBox group={group} questions={questions} answers={answers} />}
            {isSummary ? renderSummary(group, items) : <ol className="rd-qlist">{items.map(renderQuestion)}</ol>}
          </section>
        )
      })}
    </div>
  )
}
