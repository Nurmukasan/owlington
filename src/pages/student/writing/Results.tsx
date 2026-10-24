import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { profileResultPath } from '../../../learn/results/results'
import { ProgressRing } from '../../../learn/components/ProgressWidgets'
import { TalkingOwl } from '../../../learn/components/TalkingOwl'
import { floatText, pixelConfetti } from '../../../learn/fx'
import type { Attempt } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import type { PracticeInfo } from '../../../learn/types'
import type { CheckResult, Criterion, TextAnalysis } from './analysis'
import { WaxSeal } from './art'
import { InkedEssay } from './Assessment'
import { pieceNoun } from './content'
import { History } from './History'
import { useCountUp } from './hooks'
import { rubricFor, type Annotation, type WritingPrompt } from './prompts'
import { formatBand } from './stats'
import { countWords } from './words'

interface ResultsProps {
  info: PracticeInfo
  prompt: WritingPrompt
  attempt: Attempt
  checks: CheckResult[]
  text: string
  analysis: TextAnalysis
  history: Attempt[]
  next?: PracticeInfo
  onRetry: () => void
}

type Tab = 'checklist' | 'model' | 'essay' | 'history'

const CRITERION_NAMES = {
  TA: 'Task',
  CC: 'Coherence',
  LR: 'Vocabulary',
  GRA: 'Grammar',
}

/**
 * The headline weighs both inputs: the objective checklist and the student's own
 * band estimate. Only both together earn "examiner-ready"; otherwise the owl
 * praises what the checklist shows and points at the weakest criterion.
 */
function verdict(score: number, band: number | undefined, weakest: { name: string; band: number } | null, noun: string) {
  const lift = weakest ? ` Your lowest criterion is ${weakest.name} (band ${weakest.band}) — that is where the next half band hides.` : ''
  if (score >= 9 && (band ?? 0) >= 7)
    return {
      title: `A beautifully sealed ${noun}.`,
      owl: 'Hoo-hoo! The checklist and your own grading agree: this is examiner-ready work. Read the model answer for the final polish.',
    }
  if (score >= 9)
    return {
      title: score >= 10 ? 'A spotless checklist.' : 'Nearly every box ticked.',
      owl: `${score >= 10 ? 'Every' : 'Nearly every'} structural box is ticked — lovely discipline.${lift || ' Now lift the language itself: the model answer’s margin notes show how.'}`,
    }
  if (score >= 7)
    return {
      title: 'Strong work — sealed and stamped.',
      owl: `Lovely! A couple of checklist points stand between you and the top — see which below.${lift}`,
    }
  if (score >= 5)
    return {
      title: 'Solid foundations.',
      owl: `Good effort. Fix the missed points below and write it again — second drafts are where bands move.${lift}`,
    }
  return {
    title: 'Every manuscript starts somewhere.',
    owl: 'Don’t be discouraged! Read the model answer, then try again with the checklist beside you.',
  }
}

/** Step 3: the sealed result, the checklist review, the model answer and the essay history. */
export function Results({ info, prompt, attempt, checks, text, analysis, history, next, onRetry }: ResultsProps) {
  const sealRef = useRef<HTMLDivElement>(null)
  const celebrated = useRef(false)
  const [tab, setTab] = useState<Tab>('checklist')
  const shownScore = useCountUp(attempt.score, true, 900)
  const shownXp = useCountUp(attempt.xp, true, 1200)
  const accuracy = attempt.total ? attempt.score / attempt.total : 0
  const noun = pieceNoun(prompt.task)
  const criteria = useMemo(() => (attempt.detail?.criteria ?? {}) as Partial<Record<Criterion, number>>, [attempt.detail])
  const weakest = useMemo(() => {
    const ranked = rubricFor(prompt.task)
      .filter((c) => typeof criteria[c.id] === 'number')
      .sort((a, b) => (criteria[a.id] ?? 0) - (criteria[b.id] ?? 0))
    const low = ranked[0]
    const high = ranked[ranked.length - 1]
    return low && high && (criteria[low.id] ?? 0) < (criteria[high.id] ?? 0) ? { name: low.name, band: criteria[low.id] ?? 0 } : null
  }, [criteria, prompt.task])
  const v = verdict(attempt.score, attempt.band, weakest, noun)

  // The celebration answers the student's "Seal my essay" click.
  useEffect(() => {
    if (celebrated.current) return
    celebrated.current = true
    const timer = window.setTimeout(() => {
      sfx.complete()
      const el = sealRef.current
      if (accuracy >= 0.7) pixelConfetti(el ?? undefined, { count: 80, colors: ['#ff9a85', '#b3262e', '#d9b464', '#fbf4e4', '#2a78d6'] })
      if (el) floatText(`+${attempt.xp} XP`, el, '#ff9a85')
    }, 520)
    return () => window.clearTimeout(timer)
  }, [accuracy, attempt.xp])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'checklist', label: `Checklist · ${attempt.score}/10` },
    { id: 'model', label: 'Model answer' },
    { id: 'essay', label: `Your ${noun}` },
    { id: 'history', label: `History · ${history.length}` },
  ]
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const j = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length
    setTab(tabs[j].id)
    document.getElementById(`wr-tab-${tabs[j].id}`)?.focus()
  }

  const excerpt = useMemo(
    () =>
      text
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .slice(0, 5),
    [text],
  )

  return (
    <div className="wr-results">
      <section className="wr-sealed" aria-labelledby="wr-sealed-title">
        <div className="wr-sealed__paper" aria-hidden="true">
          <div className="wr-sealed__text">
            <p className="wr-sealed__head">
              <span>{info.title}</span>
              <span>{analysis.words} words</span>
            </p>
            {excerpt.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div ref={sealRef} className="wr-sealed__stamp">
            <WaxSeal size={168} />
            <span className="wr-sealed__band">{attempt.band ? formatBand(attempt.band) : '–'}</span>
          </div>
        </div>

        <div className="wr-sealed__copy">
          <p className="wr-eyebrow">Step 3 of 3 · sealed</p>
          <h1 id="wr-sealed-title" className="wr-sealed__title wr-display">
            {v.title}
          </h1>
          <p className="wr-sealed__band-line">
            Estimated band <strong>{attempt.band ? formatBand(attempt.band) : '—'}</strong>
            <span className="wr-sealed__disclaimer">self-assessed estimate, not an official score</span>
          </p>
          <ul className="wr-sealed__criteria" aria-label="Your self-assessment">
            {(Object.keys(CRITERION_NAMES) as (keyof typeof CRITERION_NAMES)[]).map((k) => (
              <li key={k}>
                <span>{CRITERION_NAMES[k]}</span>
                <b>{criteria[k] ?? '–'}</b>
              </li>
            ))}
          </ul>

          <div className="wr-sealed__row">
            <ProgressRing
              value={accuracy}
              size={112}
              stroke={10}
              color="var(--wr-coral)"
              track="rgb(255 255 255 / 0.12)"
              segments={10}
              label={`Checklist: ${attempt.score} of ${attempt.total} points met`}
              className="wr-sealed__ring"
            >
              <span className="wr-sealed__score">
                {Math.round(shownScore)}
                <small>/{attempt.total}</small>
              </span>
            </ProgressRing>
            <div className="wr-sealed__xp">
              <span className="wr-sealed__xp-n">+{Math.round(shownXp)}</span>
              <span className="wr-sealed__xp-l">XP earned</span>
              <span className="wr-sealed__xp-s">{analysis.words} words added to your total</span>
            </div>
            <div className="wr-sealed__owl">
              <TalkingOwl happy={accuracy >= 0.5} scale={4} />
              <p className="wr-sealed__says">{v.owl}</p>
            </div>
          </div>

          <div className="wr-sealed__actions">
            <button type="button" className="wr-btn" onClick={onRetry}>
              Write it again
            </button>
            {next && (
              <Link to={`/student/writing/practice/${next.id}`} className="wr-btn wr-btn--brass">
                Next assignment <span className="wr-btn__arrow" aria-hidden="true">→</span>
              </Link>
            )}
            <Link to="/student/writing/practice" className="wr-btn wr-btn--ghost">
              All assignments
            </Link>
            <Link to={profileResultPath(attempt)} className="wr-sealed__profile">
              Saved to your profile →
            </Link>
          </div>
        </div>
      </section>

      <div className="wr-tabs" role="tablist" aria-label="Review">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            id={`wr-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`wr-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className={`wr-tabs__tab ${tab === t.id ? 'is-on' : ''}`}
            onClick={() => {
              sfx.page()
              setTab(t.id)
            }}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Every panel stays in the DOM (inactive ones hidden), so each tab's aria-controls points at a real element. */}
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`wr-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`wr-tab-${t.id}`}
          className="wr-tabpanel"
          tabIndex={0}
          hidden={tab !== t.id}
        >
          {t.id === 'checklist' && <ChecklistReview checks={checks} />}
          {t.id === 'model' && <ModelAnswer prompt={prompt} />}
          {t.id === 'essay' && (
            <div className="wr-sheetpaper wr-sheetpaper--essay">
              <p className="wr-sheetpaper__meta">
                {info.title} · {analysis.words} words · {analysis.paragraphs.length} paragraphs · {analysis.linkerVariety} linking
                words
              </p>
              <InkedEssay text={text} overused={analysis.overused.map((o) => o.phrase)} />
            </div>
          )}
          {t.id === 'history' && <History attempts={history} title={`Every ${noun} on “${info.title}”`} light noun={noun} />}
        </div>
      ))}
    </div>
  )
}

export function ChecklistReview({ checks }: { checks: CheckResult[] }) {
  return (
    <ol className="wr-review">
      {checks.map((c, i) => (
        <li key={c.id} className={`wr-review__item ${c.met ? 'is-met' : 'is-miss'}`} style={{ animationDelay: `${i * 60}ms` }}>
          <span className="wr-review__mark" aria-hidden="true">
            {c.met ? '✓' : '✗'}
          </span>
          <div>
            <p className="wr-review__label">
              <span className="wr-review__num">{i + 1}.</span> {c.label}
              <span className="wr-review__crit">{c.criterion}</span>
              <span className="visually-hidden">{c.met ? ' — met.' : ' — not yet.'}</span>
            </p>
            <p className="wr-review__found">{c.found}</p>
            <p className="wr-review__why">{c.why}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** The model answer with numbered highlights that link to margin notes. */
export function ModelAnswer({ prompt }: { prompt: WritingPrompt }) {
  const [active, setActive] = useState<number | null>(null)
  const { text, notes } = prompt.model

  const paragraphs = useMemo(() => {
    const spans: { start: number; end: number; n: number }[] = []
    notes.forEach((note: Annotation, n) => {
      const start = text.indexOf(note.quote)
      if (start >= 0) spans.push({ start, end: start + note.quote.length, n })
    })
    spans.sort((a, b) => a.start - b.start)
    const out: ReactNode[][] = []
    let current: ReactNode[] = []
    let pos = 0
    const pushText = (chunk: string) => {
      chunk.split(/\n+/).forEach((part, i) => {
        if (i > 0) {
          if (current.length) out.push(current)
          current = []
        }
        if (part) current.push(part)
      })
    }
    for (const s of spans) {
      if (s.start < pos) continue
      pushText(text.slice(pos, s.start))
      current.push(
        <mark key={s.n} className="wr-model__mark" data-n={s.n + 1}>
          {text.slice(s.start, s.end)}
          <sup aria-hidden="true">{s.n + 1}</sup>
        </mark>,
      )
      pos = s.end
    }
    pushText(text.slice(pos))
    if (current.length) out.push(current)
    return out
  }, [text, notes])

  const words = countWords(text)

  return (
    <div className={`wr-model ${active !== null ? `is-focus-${active + 1}` : ''}`}>
      <div className="wr-sheetpaper wr-model__text">
        <p className="wr-sheetpaper__meta">
          An original model answer · {words} words · read the margin notes to see why it works
        </p>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <ol className="wr-model__notes" aria-label="Margin notes">
        {notes.map((n, i) => (
          <li
            key={n.quote}
            className={active === i ? 'is-on' : ''}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            tabIndex={0}
          >
            <span className="wr-model__n">{i + 1}</span>
            <span className="wr-model__tag">{n.criterion}</span>
            <p className="wr-model__quote">“{n.quote}”</p>
            <p className="wr-model__note">{n.note}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
