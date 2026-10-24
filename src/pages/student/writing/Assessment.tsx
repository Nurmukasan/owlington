import { useMemo, useRef, type ReactNode } from 'react'
import { formatClock } from '../../../learn/useTimer'
import { linkerRanges, type CheckResult, type Criterion, type TextAnalysis } from './analysis'
import { pieceNoun } from './content'
import { prefersReducedMotion } from './hooks'
import { estimateBand, rubricFor, type WritingPrompt } from './prompts'
import { formatBand } from './stats'
import { plural } from './words'

/** The essay as paragraphs, with every linking word inked in. */
export function InkedEssay({ text, overused = [] }: { text: string; overused?: string[] }) {
  const paragraphs = useMemo(() => {
    const ranges = linkerRanges(text)
    const out: ReactNode[][] = []
    let current: ReactNode[] = []
    let pos = 0
    const pushText = (chunk: string) => {
      const parts = chunk.split(/\n+/)
      parts.forEach((part, i) => {
        if (i > 0) {
          if (current.length) out.push(current)
          current = []
        }
        if (part) current.push(part)
      })
    }
    ranges.forEach((r, i) => {
      pushText(text.slice(pos, r.start))
      current.push(
        <mark key={i} className={`wr-inked__link ${overused.includes(r.phrase) ? 'is-over' : ''}`}>
          {text.slice(r.start, r.end)}
        </mark>,
      )
      pos = r.end
    })
    pushText(text.slice(pos))
    if (current.length) out.push(current)
    return out
  }, [text, overused])

  if (!text.trim()) return <p className="wr-inked__empty">(Nothing written.)</p>
  return (
    <div className="wr-inked">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- analysis ---

interface AnalysisViewProps {
  prompt: WritingPrompt
  text: string
  analysis: TextAnalysis
  checks: CheckResult[]
  durationSec: number
  onBack: () => void
  onNext: () => void
  /** Eyebrow and button labels, for the two-task full test. */
  step?: string
  nextLabel?: string
  backLabel?: string
}

/** Step 1 after handing in: the objective analysis of the essay. */
export function AnalysisView({ prompt, text, analysis: a, checks, durationSec, onBack, onNext, step, nextLabel, backLabel }: AnalysisViewProps) {
  const short = prompt.minWords - a.words
  const usable = a.sentences.filter((s) => s.words >= 3)
  const shortS = usable.filter((s) => s.words <= 12).length
  const longS = usable.filter((s) => s.words >= 22).length
  const met = checks.filter((c) => c.met).length
  const timeLimit = prompt.minutes * 60
  const noun = pieceNoun(prompt.task)

  return (
    <div className="wr-exam">
      <header className="wr-exam__head">
        <p className="wr-eyebrow">{step ?? 'Step 1 of 3 · under the lamp'}</p>
        <h1 className="wr-exam__title wr-display">
          Your {noun}, <em>examined</em>
        </h1>
        <p className="wr-exam__lead">
          The numbers first — then you will grade yourself against the four official criteria, and finally read a model answer.
        </p>
      </header>

      {short > 0 && (
        <p className="wr-exam__warn" role="alert">
          <strong>{plural(short, 'word')} short.</strong> Answers under {prompt.minWords} words lose marks for{' '}
          {prompt.task === 'task2' ? 'Task Response' : 'Task Achievement'}. In the exam, keep a little time to reach the minimum.
        </p>
      )}

      <ul className="wr-stats">
        <li className={`wr-stat ${short > 0 ? 'is-bad' : 'is-good'}`}>
          <span className="wr-stat__label">Words</span>
          <span className="wr-stat__value">
            {a.words}
            <small> / {prompt.minWords}</small>
          </span>
          <span className="wr-stat__note">{short > 0 ? `${short} below the minimum` : 'Minimum reached'}</span>
        </li>
        <li className={`wr-stat ${a.paragraphs.length >= (prompt.task === 'task1-academic' ? 3 : 4) ? 'is-good' : 'is-bad'}`}>
          <span className="wr-stat__label">Paragraphs</span>
          <span className="wr-stat__value">{a.paragraphs.length}</span>
          <span className="wr-stat__note">aim for {prompt.task === 'task1-academic' ? '3–4' : '4–5'}</span>
        </li>
        <li className={`wr-stat ${a.linkerVariety >= (prompt.task === 'task2' ? 5 : 4) && !a.overused.length ? 'is-good' : ''}`}>
          <span className="wr-stat__label">Linking variety</span>
          <span className="wr-stat__value">{a.linkerVariety}</span>
          <span className="wr-stat__note">
            {a.overused.length ? `over-used: ${a.overused.map((o) => o.phrase).join(', ')}` : 'different linkers, none over-used'}
          </span>
        </li>
        <li className="wr-stat">
          <span className="wr-stat__label">Average sentence</span>
          <span className="wr-stat__value">
            {a.avgSentence.toFixed(1)}
            <small> words</small>
          </span>
          <span className="wr-stat__note">
            {shortS} short · {longS} long · {usable.length} sentences
          </span>
        </li>
        <li className={`wr-stat ${a.contentVariety >= 0.65 ? 'is-good' : ''}`}>
          <span className="wr-stat__label">Lexical variety</span>
          <span className="wr-stat__value">
            {Math.round(a.contentVariety * 100)}
            <small>%</small>
          </span>
          <span className="wr-stat__note">different content words ({Math.round(a.lexicalVariety * 100)}% of all words)</span>
        </li>
        <li className={`wr-stat ${durationSec <= timeLimit ? 'is-good' : ''}`}>
          <span className="wr-stat__label">Time</span>
          <span className="wr-stat__value">{formatClock(durationSec)}</span>
          <span className="wr-stat__note">
            {durationSec <= timeLimit ? `within the ${prompt.minutes} minutes` : `${formatClock(durationSec - timeLimit)} over the limit`}
          </span>
        </li>
      </ul>

      <div className="wr-exam__grid">
        <section className="wr-exam__essay" aria-labelledby="wr-exam-essay">
          <h2 id="wr-exam-essay" className="wr-exam__h2">
            Your {noun} <span>· linking words inked in</span>
          </h2>
          <div className="wr-sheetpaper">
            <InkedEssay text={text} overused={a.overused.map((o) => o.phrase)} />
          </div>
        </section>

        <div className="wr-exam__side">
          <section className="wr-repeat" aria-labelledby="wr-repeat-title">
            <h2 id="wr-repeat-title" className="wr-exam__h2">
              Most repeated words
            </h2>
            {a.repeated.length ? (
              <ul className="wr-repeat__list">
                {a.repeated.map((r) => (
                  <li key={r.word} className={r.fromPrompt ? 'is-topic' : r.count >= 5 ? 'is-hot' : ''}>
                    {r.word} <b>×{r.count}</b>
                    {r.fromPrompt && <span className="wr-repeat__tag">topic</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="wr-repeat__none">No content word is repeated three or more times. Lovely range.</p>
            )}
            <p className="wr-repeat__note">
              Topic words from the question will repeat a little — that is fine. Others are worth a synonym.
            </p>
          </section>

          <section className="wr-precheck" aria-labelledby="wr-precheck-title">
            <h2 id="wr-precheck-title" className="wr-exam__h2">
              Checklist preview <span>· {met}/10</span>
            </h2>
            <ul className="wr-precheck__list">
              {checks.map((c) => (
                <li key={c.id} className={c.met ? 'is-met' : 'is-miss'}>
                  <span className="wr-precheck__icon" aria-hidden="true">
                    {c.met ? '✓' : '✗'}
                  </span>
                  <span>
                    {c.label}
                    <span className="visually-hidden">{c.met ? ': met' : ': not yet'}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="wr-exam__actions">
        <button type="button" className="wr-btn wr-btn--ghost" onClick={onBack}>
          ← {backLabel ?? 'Keep writing'}
        </button>
        <button type="button" className="wr-btn" onClick={onNext}>
          {nextLabel ?? 'Next: grade yourself'} <span className="wr-btn__arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------- self-assessment ---

interface SelfAssessProps {
  prompt: WritingPrompt
  checks: CheckResult[]
  scores: Partial<Record<Criterion, number>>
  onScore: (criterion: Criterion, band: number) => void
  onBack: () => void
  onSeal: () => void
  step?: string
  sealLabel?: string
}

const BANDS = [5, 6, 7, 8] as const

/** Step 2: a guided self-assessment against short band-descriptor cards. */
export function SelfAssess({ prompt, checks, scores, onScore, onBack, onSeal, step, sealLabel }: SelfAssessProps) {
  const rubric = rubricFor(prompt.task)
  const chosen = rubric.map((c) => scores[c.id]).filter((v): v is number => typeof v === 'number')
  const complete = chosen.length === rubric.length
  const estimate = complete ? estimateBand(chosen) : null
  const noun = pieceNoun(prompt.task)
  /** True between a pointer press on a band card and the change it causes. Arrow keys never set it. */
  const byPointer = useRef(false)

  // After a criterion's first choice by click or tap, glide to the next one still open (then
  // to the estimate). Keyboard users explore a radio group with the arrow keys, so their
  // choices never scroll the page away from the focused radio.
  const choose = (index: number, criterion: Criterion, band: number) => {
    const first = scores[criterion] === undefined
    const pointer = byPointer.current
    byPointer.current = false
    onScore(criterion, band)
    if (!first || !pointer) return
    const next = rubric.slice(index + 1).find((c) => scores[c.id] === undefined)
    window.setTimeout(() => {
      const target = next ? document.getElementById(`wr-crit-${next.id}`) : document.querySelector('.wr-estimate')
      if (!target) return
      const r = target.getBoundingClientRect()
      const top = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
      if (r.top >= top && r.bottom <= window.innerHeight) return
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }, 320)
  }

  return (
    <div className="wr-assess">
      <header className="wr-exam__head">
        <p className="wr-eyebrow">{step ?? 'Step 2 of 3 · be your own examiner'}</p>
        <h1 className="wr-exam__title wr-display">
          Grade yourself, <em>honestly</em>
        </h1>
        <p className="wr-exam__lead">
          For each criterion, read the evidence from your {noun}, then pick the card that sounds most like it. Each criterion is
          worth a quarter of your Writing band.
        </p>
      </header>

      <div className="wr-assess__grid">
        <div className="wr-assess__list">
          {rubric.map((c, ci) => {
            const evidence = checks.filter((r) => r.criterion === c.id)
            const hint = hintFor(c.id, evidence)
            return (
              <fieldset key={c.id} id={`wr-crit-${c.id}`} className="wr-crit-card" style={{ animationDelay: `${ci * 90}ms` }}>
                <legend className="wr-crit-card__legend">
                  <span className="wr-crit-card__short">{c.short}</span> {c.name}
                </legend>
                <p className="wr-crit-card__q wr-hand">{c.question}</p>
                {evidence.length > 0 && (
                  <ul className="wr-crit-card__evidence" aria-label={`Evidence for ${c.name}`}>
                    {evidence.map((e) => (
                      <li key={e.id} className={e.met ? 'is-met' : 'is-miss'}>
                        <span aria-hidden="true">{e.met ? '✓' : '✗'}</span> {e.label}
                        <span className="visually-hidden">{e.met ? ' (met)' : ' (not yet)'}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {hint && (
                  <p className={`wr-crit-card__hint is-${hint.tone}`}>
                    <span aria-hidden="true">{hint.tone === 'strict' ? '!' : '✦'}</span> {hint.text}
                  </p>
                )}
                <div className="wr-crit-card__bands">
                  {BANDS.map((b) => (
                    <label
                      key={b}
                      className={`wr-band ${scores[c.id] === b ? 'is-on' : ''}`}
                      onPointerDown={() => {
                        byPointer.current = true
                      }}
                    >
                      <input
                        type="radio"
                        name={`wr-${c.id}`}
                        value={b}
                        checked={scores[c.id] === b}
                        onKeyDown={() => {
                          byPointer.current = false
                        }}
                        onChange={() => choose(ci, c.id, b)}
                      />
                      <span className="wr-band__n">Band {b}</span>
                      <span className="wr-band__d">{c.bands[b]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )
          })}
        </div>

        <aside className="wr-estimate" aria-label="Your estimate">
          <p className="wr-estimate__eyebrow">Your estimate</p>
          <ul className="wr-estimate__slots">
            {rubric.map((c) => (
              <li key={c.id} className={scores[c.id] ? 'is-set' : ''}>
                <span>{c.short}</span>
                <b>{scores[c.id] ?? '·'}</b>
              </li>
            ))}
          </ul>
          <p className="wr-estimate__band" aria-live="polite">
            {estimate !== null ? formatBand(estimate) : '—'}
            <span className="visually-hidden">{estimate !== null ? ' estimated band' : ' choose all four criteria'}</span>
          </p>
          <p className="wr-estimate__disclaimer">Self-assessed estimate, not an official score.</p>
          <p className="wr-estimate__how">The mean of your four choices, rounded to the nearest half band (a quarter rounds up).</p>
          <button type="button" className="wr-btn wr-btn--wax wr-estimate__seal" disabled={!complete} onClick={onSeal}>
            {sealLabel ?? `Seal my ${noun}`}
          </button>
          {!complete && <p className="wr-estimate__todo">Choose a band for all four criteria to seal it.</p>}
          <button type="button" className="wr-estimate__back" onClick={onBack}>
            ← Back to the analysis
          </button>
        </aside>
      </div>
    </div>
  )
}

/** A nudge towards an honest choice, based on what the checklist found for this criterion. */
function hintFor(criterion: Criterion, evidence: CheckResult[]): { tone: 'strict' | 'good'; text: string } | null {
  if (!evidence.length) return null
  if (criterion === 'TA' && evidence.some((e) => e.id === 'min-words' && !e.met)) {
    return { tone: 'strict', text: 'Under-length answers lose marks here, however good the ideas. Be strict with yourself.' }
  }
  const met = evidence.filter((e) => e.met).length
  if (met / evidence.length < 0.5) {
    return { tone: 'strict', text: 'The checklist found little evidence for this one — band 5 or 6 is the honest choice.' }
  }
  if (met === evidence.length) {
    return { tone: 'good', text: 'Every check met. Band 7 or higher is within reach if the language is also accurate.' }
  }
  return null
}
