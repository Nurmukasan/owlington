import { useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import type { PracticeInfo } from '../../../learn/types'
import { analyse } from './analysis'
import { FigureView } from './Figures'
import { CohesionPanel, InkTimer, SentenceBars, WordMeter } from './LivePanels'
import { taskLabel, type WritingPrompt } from './prompts'
import { formatDate, relativeTime } from './stats'

interface StudioProps {
  info: PracticeInfo
  prompt: WritingPrompt
  studentName: string
  text: string
  onText: (text: string) => void
  plan: string[]
  onPlan: (index: number, value: string) => void
  remaining: number
  paused: boolean
  onTogglePause: () => void
  savedAt: string | null
  onSubmit: () => void
  wordBump: number
}

/** The distraction-free writing studio: prompt, plan, lined paper and live feedback. */
export function Studio(props: StudioProps) {
  const { info, prompt, text, plan, remaining, paused, savedAt } = props
  const deferred = useDeferredValue(text)
  const analysis = useMemo(() => analyse(deferred, prompt.question), [deferred, prompt.question])
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [today] = useState(() => formatDate(new Date().toISOString()))
  const paragraphTarget = prompt.task === 'task2' ? '4–5' : prompt.task === 'task1-gt' ? '4–5' : '3–4'
  const linkerTarget = prompt.task === 'task2' ? 5 : 4

  // Grow the paper with the essay so the lines never scroll inside a box.
  useLayoutEffect(() => {
    const el = editorRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }, [text])

  useEffect(() => {
    editorRef.current?.focus({ preventScroll: true })
  }, [])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => props.onText(e.target.value)

  return (
    <div className="wr-studio">
      <div className="wr-bar" role="region" aria-label="Writing controls">
        <div className="wr-bar__task">
          <span className="wr-stamp wr-bar__stamp">{prompt.task === 'task2' ? 'TASK 2' : 'TASK 1'}</span>
          <span className="wr-bar__title">{info.title}</span>
        </div>
        <InkTimer remaining={remaining} total={prompt.minutes * 60} paused={paused} onTogglePause={props.onTogglePause} compact />
        <p className={`wr-bar__words ${analysis.words >= prompt.minWords ? 'is-met' : ''}`} aria-hidden="true">
          <strong>{analysis.words}</strong>/{prompt.minWords}
          <span> words</span>
        </p>
        <p className="wr-bar__saved" aria-live="polite">
          {savedAt ? (
            <>
              <span className="wr-bar__dot" aria-hidden="true" /> Saved {relativeTime(savedAt)}
            </>
          ) : (
            'Autosave on'
          )}
        </p>
        <button type="button" className="wr-btn wr-btn--wax wr-bar__submit" onClick={props.onSubmit}>
          Hand it in <span className="wr-btn__arrow" aria-hidden="true">→</span>
        </button>
      </div>

      <div className="wr-studio__grid">
        <aside className="wr-studio__left" aria-label="Task and plan">
          <PromptCard prompt={prompt} />
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
              Your answer to {info.title}
            </label>
            <textarea
              id="wr-editor"
              ref={editorRef}
              className="wr-paper__editor"
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
          <WordMeter
            words={analysis.words}
            min={prompt.minWords}
            paragraphs={analysis.paragraphs.length}
            paragraphTarget={paragraphTarget}
            bump={props.wordBump}
          />
          <CohesionPanel linkers={analysis.linkers} target={linkerTarget} />
          <SentenceBars sentences={analysis.sentences} />
        </aside>
      </div>
    </div>
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
            ⤢ Enlarge the {prompt.figure.kind === 'line' ? 'graph' : 'diagram'}
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
