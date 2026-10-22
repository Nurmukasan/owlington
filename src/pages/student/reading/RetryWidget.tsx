import { useRef, useState, type FormEvent } from 'react'
import { floatText } from '../../../learn/fx'
import { sfx } from '../../../learn/sfx'
import { isCorrect, letter, type Graded } from './practice-logic'

interface RetryProps {
  g: Graded
  /** Called once the answer is right, with how many wrong tries it took. */
  onSolved: (misses: number) => void
  onReveal: () => void
}

interface Choice {
  value: string
  label: string
  lead?: string
}

function choicesFor(g: Graded): Choice[] | null {
  const { q, group } = g.x
  if (q.type === 'tfng') return ['TRUE', 'FALSE', 'NOT GIVEN'].map((v) => ({ value: v, label: v }))
  if (q.type === 'ynng') return ['YES', 'NO', 'NOT GIVEN'].map((v) => ({ value: v, label: v }))
  if (q.type === 'mcq') return q.options.map((o, i) => ({ value: letter(i), lead: letter(i), label: o }))
  if (q.type === 'choose' || group.options) {
    return (group.options ?? []).map((o) =>
      group.kind === 'paragraphs' ? { value: o.value, label: o.value } : { value: o.value, lead: o.value, label: o.label },
    )
  }
  return null
}

/** "Second look": answer a missed question again, with instant feedback. */
export function RetryWidget({ g, onSolved, onReveal }: RetryProps) {
  const choices = choicesFor(g)
  // The first answer is already known to be wrong, so it starts crossed out.
  const [struck, setStruck] = useState<string[]>(() => (g.answered && choices ? [g.answer] : []))
  const [typed, setTyped] = useState('')
  const [misses, setMisses] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const limit = g.x.group.limit

  const check = (value: string) => {
    if (!value.trim()) return
    if (isCorrect(g.x, value)) {
      sfx.correct()
      if (ref.current) floatText(misses === 0 ? 'Got it!' : 'There it is!', ref.current, '#9be0a9')
      onSolved(misses)
      return
    }
    sfx.wrong()
    setMisses((m) => m + 1)
    const el = ref.current
    if (el) {
      el.classList.remove('is-shaking')
      void el.offsetWidth
      el.classList.add('is-shaking')
    }
    if (choices) setStruck((s) => (s.includes(value) ? s : [...s, value]))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    check(typed)
  }

  const paragraphs = [...new Set(g.x.q.evidence.map((e) => e[0]))].join(' and ')

  return (
    <div ref={ref} className="rd-retry">
      <p className="rd-retry__lead">
        {choices
          ? g.answered
            ? 'Pick again — your first answer is crossed out.'
            : 'You left this one blank. Have a go now.'
          : `${g.answered ? 'Type it again' : 'Have a go now'}${limit ? ` (${limit.toLowerCase()})` : ''}.`}
      </p>

      {choices ? (
        <div
          className={`rd-retry__choices ${choices.some((c) => c.lead) ? 'is-rows' : ''}`}
          role="group"
          aria-label={`Question ${g.x.n}: choose again`}
        >
          {choices.map((c) => {
            const out = struck.includes(c.value)
            return (
              <button
                key={c.value}
                type="button"
                className={`rd-retry__opt ${out ? 'is-out' : ''}`}
                aria-disabled={out}
                onClick={() => {
                  if (!out) check(c.value)
                }}
              >
                {c.lead && <b>{c.lead}</b>}
                <span>{c.label}</span>
                {out && <span className="visually-hidden"> (wrong)</span>}
              </button>
            )
          })}
        </div>
      ) : (
        <form className="rd-retry__form" onSubmit={onSubmit}>
          <input
            type="text"
            className="rd-gap"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            aria-label={`Question ${g.x.n}: your new answer`}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit" className="rd-btn rd-btn--small" disabled={!typed.trim()}>
            Check
          </button>
        </form>
      )}

      <p className="rd-retry__foot" aria-live="polite">
        {misses > 0 && <span className="rd-retry__nope">Not quite. </span>}
        {misses >= 1 ? `Hint: the proof is in paragraph ${paragraphs}. ` : ''}
        <button type="button" className="rd-retry__reveal" onClick={onReveal}>
          Just show me the answer
        </button>
      </p>
    </div>
  )
}
