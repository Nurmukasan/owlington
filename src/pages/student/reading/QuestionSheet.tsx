import { Fragment, memo, type ReactNode } from 'react'
import { sfx } from '../../../learn/sfx'
import type { PracticeSet, QuestionGroup, Segment } from './practice-data'
import {
  KIND_LABEL,
  isAnswered,
  isOverLimit,
  letter,
  rangeLabel,
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
  if (group.kind === 'features')
    return (
      <div className={`rd-optbox rd-optbox--${group.kind}`}>
        <p className="rd-optbox__title">{group.optionsTitle ?? 'Options'}</p>
        <ul className="rd-optbox__list">
          {group.options.map((o) => (
            <li key={o.value}>
              <b>{o.value}</b>
              <span>{o.label}</span>
            </li>
          ))}
        </ul>
      </div>
    )
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
  // The count is for the eyes only; screen readers hear just the moment an answer goes over (or back under) the limit.
  return (
    <>
      <p className={`rd-meter ${over ? 'is-over' : ''} ${count ? 'is-on' : ''}`}>
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
      <span className="visually-hidden" role="status">
        {over ? `Question ${x.n} is over the word limit: ${count} words, the limit is ${max}.` : ''}
      </span>
    </>
  )
}

export const QuestionSheet = memo(function QuestionSheet({
  set,
  questions,
  answers,
  onAnswer,
  flagged,
  onToggleFlag,
  current,
  onCurrent,
}: SheetProps) {
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
      const showPicked = isHeading || group.kind === 'endings' || group.kind === 'features'
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
                  <span className="visually-hidden">
                    {isHeading ? `heading ${o.value}: ${o.label}` : group.kind === 'paragraphs' ? o.label : `${o.value}: ${o.label}`}
                  </span>
                </>,
                'rd-opt--chip',
              ),
            )}
          </div>
          {showPicked && (
            <p className={`rd-picked ${picked ? 'is-on' : ''}`} aria-hidden="true">
              {picked
                ? picked.label
                : isHeading
                  ? 'Pick a heading from the list above.'
                  : group.kind === 'endings'
                    ? 'Pick an ending from the list above.'
                    : 'Pick a letter from the list above.'}
            </p>
          )}
        </>,
        isHeading ? (
          <p>
            <b>{q.prompt}</b>
          </p>
        ) : group.kind === 'endings' ? (
          <p>{q.prompt} …</p>
        ) : (
          <p>{q.prompt}</p>
        ),
        isHeading ? 'rd-q--heading' : '',
      )
    }

    if (q.type === 'pick') return null

    // A short-answer question: the question is the prompt, the answer goes underneath.
    if (group.kind === 'short') {
      const value = answers[q.id] ?? ''
      return card(
        x,
        <div className="rd-q__answer">
          <input
            type="text"
            className={`rd-gap rd-gap--short ${isOverLimit(x, value) ? 'is-over' : ''}`}
            value={value}
            onChange={(e) => onAnswer(q.id, e.target.value)}
            aria-label={`Question ${x.n}: ${q.before}`}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
          />
          <WordMeter x={x} value={value} />
        </div>,
        <p>{q.before}</p>,
        'rd-q--short',
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

  /** One numbered gap: a typed answer, or a pick from the group's word box. */
  const field = (x: NumberedQuestion, group: QuestionGroup) => {
    const id = x.q.id
    const value = answers[id] ?? ''
    const label = x.q.type === 'gap' ? `Question ${x.n}: ${x.q.before} … ${x.q.after}` : `Question ${x.n}`
    return (
      <span className="rd-sgap__field">
        <span className="rd-sgap__n" aria-hidden="true">
          {x.n}
        </span>
        {group.options ? (
          <select
            className={`rd-gapselect ${value ? 'is-on' : ''}`}
            value={value}
            onChange={(e) => choose(id, e.target.value)}
            aria-label={label}
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
            aria-label={label}
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
      </span>
    )
  }

  const gapSpan = (x: NumberedQuestion, children: ReactNode) => (
    <span
      key={x.q.id}
      id={`rd-q-${x.q.id}`}
      className={`rd-sgap ${current === x.q.id ? 'is-current' : ''} ${flagged.has(x.q.id) ? 'is-flagged' : ''}`}
      onFocusCapture={() => onCurrent(x.q.id)}
    >
      {children}
    </span>
  )

  /** The word-limit line under a block of gaps. */
  const groupMeter = (group: QuestionGroup, items: NumberedQuestion[]) => {
    if (!group.maxWords) return null
    const over = items.filter((x) => isOverLimit(x, answers[x.q.id]))
    return (
      <p className={`rd-meter ${over.length ? 'is-over is-on' : ''}`} role="status">
        {over.length
          ? `${over.map((x) => `Question ${x.n}`).join(', ')}: over the limit (${group.limit}). Extra words cost the whole mark.`
          : `${LIMIT_WORDS[group.maxWords] ?? group.maxWords} ${group.maxWords === 1 ? 'word' : 'words'} at most per gap.`}
      </p>
    )
  }

  const renderSummary = (group: QuestionGroup, items: NumberedQuestion[]) => (
    <div className="rd-summary">
      {group.summaryTitle && <p className="rd-summary__title">{group.summaryTitle}</p>}
      <p className="rd-summary__text">
        {items.map((x) =>
          x.q.type === 'gap'
            ? gapSpan(
                x,
                <>
                  {x.q.before} {field(x, group)} {x.q.after}{' '}
                </>,
              )
            : null,
        )}
      </p>
      {groupMeter(group, items)}
    </div>
  )

  /** Notes, a table or a flow-chart with numbered gaps where the answers go. */
  const renderLayout = (group: QuestionGroup, items: NumberedQuestion[]) => {
    const layout = group.layout
    if (!layout) return null
    const segs = (list: Segment[]) =>
      list.map((sg, i) => (
        <Fragment key={i}>{typeof sg === 'number' ? items[sg] && gapSpan(items[sg], field(items[sg], group)) : sg}</Fragment>
      ))
    return (
      <div className={`rd-summary rd-layout rd-layout--${layout.type}`}>
        {group.summaryTitle && layout.type !== 'table' && <p className="rd-summary__title">{group.summaryTitle}</p>}
        {layout.type === 'notes' && (
          <ul className="rd-notes">
            {layout.lines.map((l, i) => (
              <li key={i} className={l.heading ? 'is-heading' : l.bullet ? 'is-bullet' : ''}>
                {segs(l.segs)}
              </li>
            ))}
          </ul>
        )}
        {layout.type === 'table' && (
          <div className="rd-tablewrap">
            <table className="rd-table">
              {group.summaryTitle && <caption className="rd-summary__title">{group.summaryTitle}</caption>}
              <thead>
                <tr>
                  {layout.head.map((h, i) => (
                    <th key={i} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {layout.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row">
                          {segs(cell)}
                        </th>
                      ) : (
                        <td key={c}>{segs(cell)}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {layout.type === 'flow' && (
          <ol className="rd-flow">
            {layout.steps.map((step, i) => (
              <li key={i} className="rd-flow__step">
                {segs(step)}
              </li>
            ))}
          </ol>
        )}
        {groupMeter(group, items)}
      </div>
    )
  }

  /** "Choose TWO letters": one card, two answers, ticked in any order. */
  const renderPair = (group: QuestionGroup, items: NumberedQuestion[]) => {
    const [first] = items
    const last = items[items.length - 1]
    if (!first) return null
    const ids = items.map((x) => x.q.id)
    const chosen = items.map((x) => answers[x.q.id]).filter((v): v is string => isAnswered(v))
    const full = chosen.length >= items.length
    const toggle = (value: string) => {
      const on = chosen.includes(value)
      if (!on && full) return
      sfx.click()
      const next = (on ? chosen.filter((v) => v !== value) : [...chosen, value]).sort()
      items.forEach((x, i) => onAnswer(x.q.id, next[i] ?? ''))
    }
    const isFlagged = flagged.has(first.q.id)
    const here = ids.includes(current)
    return (
      <li
        key={first.q.id}
        id={`rd-q-${first.q.id}`}
        data-also={ids.slice(1).join(' ')}
        className={`rd-q rd-q--pair ${here ? 'is-current' : ''} ${isFlagged ? 'is-flagged' : ''} ${full ? 'is-answered' : ''}`}
        onFocusCapture={() => {
          if (!here) onCurrent(first.q.id)
        }}
        onPointerDown={() => {
          if (!here) onCurrent(first.q.id)
        }}
      >
        <div className="rd-q__head">
          <span className="rd-q__n rd-q__n--pair" aria-hidden="true">
            {first.n}–{last.n}
          </span>
          <div className="rd-q__prompt" id={`rd-qp-${first.q.id}`}>
            <span className="visually-hidden">
              Questions {first.n} and {last.n}.{' '}
            </span>
            <p>{group.prompt}</p>
          </div>
          <FlagButton
            n={first.n}
            on={isFlagged}
            onClick={() => ids.forEach((id) => flagged.has(id) === isFlagged && onToggleFlag(id))}
          />
        </div>
        <div className="rd-opts rd-opts--mcq" role="group" aria-labelledby={`rd-qp-${first.q.id}`}>
          {(group.options ?? []).map((o) => {
            const on = chosen.includes(o.value)
            const blocked = !on && full
            return (
              <label key={o.value} className={`rd-opt rd-opt--row rd-opt--check ${on ? 'is-on' : ''} ${blocked ? 'is-blocked' : ''}`}>
                <input
                  type="checkbox"
                  className="rd-opt__input"
                  checked={on}
                  aria-disabled={blocked}
                  onChange={() => toggle(o.value)}
                />
                <span className="rd-opt__face">
                  <b className="rd-opt__letter">{o.value}</b>
                  <span>{o.label}</span>
                </span>
              </label>
            )
          })}
        </div>
        <p className="rd-meter is-on">
          {chosen.length} of {items.length} chosen{full ? ' — untick one to change your mind.' : '.'}
        </p>
      </li>
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
        const items = questions.filter((x) => x.group === group)
        const isSummary = group.kind === 'summary' || group.kind === 'wordbox'
        const headId = `rd-qg-${set.id}-${gi}`
        return (
          <section key={gi} className={`rd-qgroup rd-qgroup--${group.kind}`} aria-labelledby={headId}>
            <header className="rd-qgroup__head">
              <h3 className="rd-qgroup__range" id={headId}>
                {rangeLabel(items)}
              </h3>
              <p className="rd-qgroup__kind">{KIND_LABEL[group.kind]}</p>
            </header>
            <Instructions group={group} />
            {group.kind !== 'paragraphs' && group.kind !== 'choose2' && (
              <OptionsBox group={group} questions={questions} answers={answers} />
            )}
            {group.layout ? (
              renderLayout(group, items)
            ) : isSummary ? (
              renderSummary(group, items)
            ) : group.kind === 'choose2' ? (
              <ol className="rd-qlist">{renderPair(group, items)}</ol>
            ) : (
              <ol className="rd-qlist">{items.map(renderQuestion)}</ol>
            )}
          </section>
        )
      })}
    </div>
  )
})
