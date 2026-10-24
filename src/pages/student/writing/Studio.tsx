import {
  memo,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import type { PracticeInfo } from '../../../learn/types'
import { useStopwatch } from '../../../learn/useTimer'
import { analyse } from './analysis'
import { pieceNoun } from './content'
import { FigureView } from './Figures'
import { useMediaQuery } from './hooks'
import { CohesionPanel, InkTimer, SentenceBars, WordMeter } from './LivePanels'
import { figureNoun, taskLabel, type WritingPrompt } from './prompts'
import { formatDate, relativeTime } from './stats'

interface StudioProps {
  info: PracticeInfo
  prompt: WritingPrompt
  studentName: string
  text: string
  onText: (text: string) => void
  plan: string[]
  onPlan: (index: number, value: string) => void
  /** Seconds on the clock before this sitting. */
  banked: number
  /** Written with the live clock total on every tick. */
  totalRef: RefObject<number>
  onTimeUp: () => void
  paused: boolean
  onTogglePause: () => void
  savedAt: string | null
  /** Fewest words that can be handed in. */
  floor: number
  onSubmit: () => void
  wordBump: number
  /** Full tests: one clock for both tasks (seconds), a task switcher and their own hand-in rule. */
  limitSec?: number
  switcher?: ReactNode
  handIn?: { ok: boolean; note: string }
}

/** Can the textarea grow with its content in CSS alone? (Then no layout work per keystroke.) */
const FIELD_SIZING = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('field-sizing', 'content')

const WordMeterMemo = memo(WordMeter)
const CohesionPanelMemo = memo(CohesionPanel)
const SentenceBarsMemo = memo(SentenceBars)

/** The distraction-free writing studio: prompt, plan, lined paper and live feedback. */
export function Studio(props: StudioProps) {
  const { info, prompt, text, plan, paused, savedAt, floor } = props
  const deferred = useDeferredValue(text)
  const analysis = useMemo(() => analyse(deferred, prompt.question), [deferred, prompt.question])
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [today] = useState(() => formatDate(new Date().toISOString()))
  const narrow = useMediaQuery('(max-width: 860px)')
  const paragraphTarget = prompt.task === 'task1-academic' ? '3–4' : '4–5'
  const linkerTarget = prompt.task === 'task2' ? 5 : 4
  const noun = pieceNoun(prompt.task)
  const canHandIn = props.handIn ? props.handIn.ok : analysis.words >= floor
  const notes = plan.filter((p) => p.trim()).length

  // Grow the paper with the essay so the lines never scroll inside a box. Browsers with
  // `field-sizing: content` do it in CSS; the rest measure once per frame, not per keystroke.
  useLayoutEffect(() => {
    if (FIELD_SIZING) return
    const el = editorRef.current
    if (!el) return
    const raf = window.requestAnimationFrame(() => {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight + 2}px`
    })
    return () => window.cancelAnimationFrame(raf)
  }, [text])

  useEffect(() => {
    editorRef.current?.focus({ preventScroll: true })
  }, [])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => props.onText(e.target.value)

  // One polite announcement for milestones only, never for every word.
  const overused = analysis.overused.map((l) => `“${l.phrase}”`).join(', ')
  const announcement = [
    analysis.words >= prompt.minWords ? `Minimum of ${prompt.minWords} words reached.` : '',
    overused ? `Over-used linking words: ${overused}.` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="wr-studio">
      <div className="wr-bar" role="region" aria-label="Writing controls">
        <div className="wr-bar__task">
          <span className="wr-stamp wr-bar__stamp">{prompt.task === 'task2' ? 'TASK 2' : 'TASK 1'}</span>
          <span className="wr-bar__title">{info.title}</span>
        </div>
        {props.switcher}
        <StudioClock
          banked={props.banked}
          limit={props.limitSec ?? prompt.minutes * 60}
          paused={paused}
          onTogglePause={props.onTogglePause}
          totalRef={props.totalRef}
          onTimeUp={props.onTimeUp}
        />
        <div className="wr-bar__counts" aria-hidden="true">
          <p className={`wr-bar__words ${analysis.words >= prompt.minWords ? 'is-met' : ''}`}>
            <strong>{analysis.words}</strong>/{prompt.minWords}
            <span> words</span>
          </p>
          <p className={`wr-bar__links ${analysis.linkerVariety >= linkerTarget ? 'is-met' : ''}`}>
            <strong>{analysis.linkerVariety}</strong>
            <span> {analysis.linkerVariety === 1 ? 'linker' : 'linkers'}</span>
          </p>
        </div>
        <p className="wr-bar__saved">
          {savedAt ? (
            <>
              <span className="wr-bar__dot" aria-hidden="true" /> Saved {relativeTime(savedAt)}
            </>
          ) : (
            'Autosave on'
          )}
        </p>
        <button
          type="button"
          className="wr-btn wr-btn--wax wr-bar__submit"
          onClick={props.onSubmit}
          disabled={!canHandIn}
          aria-describedby={canHandIn ? undefined : 'wr-floor-note'}
        >
          {canHandIn ? (
            <>
              Hand it in <span className="wr-btn__arrow" aria-hidden="true">→</span>
            </>
          ) : (
            <span className="wr-bar__floorwrap">
              Hand in <span className="wr-bar__floor">{props.handIn ? props.handIn.note : `at ${floor} words`}</span>
            </span>
          )}
        </button>
        <span id="wr-floor-note" className="visually-hidden">
          {props.handIn ? `You can hand in once ${props.handIn.note}.` : `You can hand in your ${noun} once it has at least ${floor} words.`}
        </span>
      </div>
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>

      <div className="wr-studio__grid">
        <aside className="wr-studio__left" aria-label="Task and plan">
          <Fold
            narrow={narrow}
            className="wr-fold--task"
            summary={
              <>
                <span className="wr-fold__tag">{prompt.task === 'task2' ? 'TASK 2' : 'TASK 1'}</span>
                <span className="wr-fold__text">{prompt.instructions[0]}</span>
                <span className="wr-fold__open">Show task</span>
              </>
            }
          >
            <PromptCardMemo prompt={prompt} />
          </Fold>
          <Fold
            narrow={narrow}
            className="wr-fold--plan"
            summary={
              <>
                <span className="wr-fold__tag">PLAN</span>
                <span className="wr-fold__text">
                  {notes ? `${notes} of ${prompt.plan.length} notes made` : 'Five minutes of planning, well spent'}
                </span>
                <span className="wr-fold__open">Open</span>
              </>
            }
          >
            <section className="wr-plan" aria-labelledby="wr-plan-title">
              <h2 id="wr-plan-title" className="wr-plan__title">
                Plan <span>(5 minutes well spent)</span>
              </h2>
              {prompt.plan.map((field, i) => (
                <label key={field.label} className="wr-plan__field">
                  <span className="wr-plan__label">{field.label}</span>
                  <textarea
                    value={plan[i] ?? ''}
                    rows={2}
                    placeholder={field.hint}
                    onChange={(e) => props.onPlan(i, e.target.value)}
                    className="wr-plan__input"
                  />
                </label>
              ))}
            </section>
          </Fold>
        </aside>

        <div className="wr-studio__paper">
          <div className={`wr-paper ${paused ? 'is-paused' : ''}`}>
            <span className="wr-paper__holes" aria-hidden="true" />
            <div className="wr-paper__head" aria-hidden="true">
              <span className="wr-hand">{props.studentName}</span>
              <span>{taskLabel(prompt)}</span>
              <span>{today}</span>
            </div>
            <label htmlFor="wr-editor" className="visually-hidden">
              Your {noun}: {info.title}
            </label>
            <textarea
              id="wr-editor"
              ref={editorRef}
              className={`wr-paper__editor ${FIELD_SIZING ? 'wr-paper__editor--auto' : ''}`}
              value={text}
              onChange={onChange}
              readOnly={paused}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="sentences"
              placeholder={
                prompt.task === 'task1-gt'
                  ? 'Dear Ms Okafor,\n\nStart writing here. Press Enter to start a new paragraph…'
                  : 'Start writing here. Press Enter to start a new paragraph…'
              }
            />
            {paused && (
              <div className="wr-paper__pause">
                <p className="wr-hand">The ink is resting.</p>
                <button type="button" className="wr-btn wr-btn--ink" onClick={props.onTogglePause}>
                  Resume the clock
                </button>
              </div>
            )}
          </div>
          <p className="wr-studio__hint">
            Spellcheck is off, just like the real exam. Your draft saves itself as you write.
          </p>
        </div>

        <aside className="wr-studio__right" aria-label="Live feedback">
          <WordMeterMemo
            words={analysis.words}
            min={prompt.minWords}
            paragraphs={analysis.paragraphs.length}
            paragraphTarget={paragraphTarget}
            bump={props.wordBump}
          />
          <CohesionPanelMemo linkers={analysis.linkers} target={linkerTarget} />
          <SentenceBarsMemo sentences={analysis.sentences} />
        </aside>
      </div>
    </div>
  )
}

/** On phones the task and the plan fold away so the paper starts near the top. */
function Fold({ narrow, className, summary, children }: { narrow: boolean; className: string; summary: ReactNode; children: ReactNode }) {
  if (!narrow) return <>{children}</>
  return (
    <details className={`wr-fold ${className}`}>
      <summary className="wr-fold__summary">{summary}</summary>
      <div className="wr-fold__body">{children}</div>
    </details>
  )
}

interface StudioClockProps {
  banked: number
  limit: number
  paused: boolean
  onTogglePause: () => void
  totalRef: RefObject<number>
  onTimeUp: () => void
}

/**
 * The ink clock owns its stopwatch, so its four ticks a second re-render only
 * this little bottle, never the paper or the live panels.
 */
function StudioClock({ banked, limit, paused, onTogglePause, totalRef, onTimeUp }: StudioClockProps) {
  const { elapsed } = useStopwatch(!paused)
  const total = banked + elapsed
  const remaining = limit - total
  const over = remaining <= 0

  useEffect(() => {
    totalRef.current = total
  }, [total, totalRef])

  useEffect(() => {
    if (over) onTimeUp()
  }, [over, onTimeUp])

  const stage = over ? 'over' : remaining <= 300 ? 'low' : 'ok'
  return (
    <>
      <InkTimer remaining={remaining} total={limit} paused={paused} onTogglePause={onTogglePause} compact />
      <span className="visually-hidden" aria-live="polite">
        {stage === 'over' ? 'Time is up. Finish your sentence and hand it in.' : stage === 'low' ? 'Five minutes left on the ink clock.' : ''}
      </span>
    </>
  )
}

/** The task as printed on the exam paper, with its visual. */
export function PromptCard({ prompt, compact = false }: { prompt: WritingPrompt; compact?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  return (
    <section className={`wr-prompt ${compact ? 'wr-prompt--compact' : ''}`} aria-label="The task">
      <p className="wr-prompt__head">
        <span>{taskLabel(prompt).toUpperCase()}</span>
        <span>{prompt.minutes} MIN</span>
      </p>
      <p className="wr-prompt__time">You should spend about {prompt.minutes} minutes on this task.</p>
      <div className="wr-prompt__box">
        {prompt.instructions.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {prompt.bullets && (
          <ul className="wr-prompt__bullets">
            {prompt.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </div>
      {prompt.footer.map((f) => (
        <p key={f} className="wr-prompt__foot">
          {f}
        </p>
      ))}
      {prompt.figure && (
        <div className="wr-prompt__figure">
          <FigureView figure={prompt.figure} />
          <button
            type="button"
            className="wr-prompt__zoom"
            onClick={() => {
              const d = dialogRef.current
              if (!d) return
              d.showModal()
              d.querySelector<HTMLButtonElement>('.wr-dialog__close')?.focus()
            }}
          >
            ⤢ Enlarge the {figureNoun(prompt.figure)}
          </button>
          <dialog
            ref={dialogRef}
            className="wr-dialog wr-dialog--figure"
            aria-label={prompt.figure.title}
            onClick={(e) => {
              if (e.target === e.currentTarget) e.currentTarget.close()
            }}
          >
            <div className="wr-dialog__inner">
              <FigureView figure={prompt.figure} large />
              <form method="dialog">
                <button type="submit" className="wr-btn wr-btn--ink wr-btn--small wr-dialog__close">
                  Close
                </button>
              </form>
            </div>
          </dialog>
        </div>
      )}
    </section>
  )
}

const PromptCardMemo = memo(PromptCard)
