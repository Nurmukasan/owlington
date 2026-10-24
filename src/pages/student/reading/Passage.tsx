import { Fragment, memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { PracticeSet } from './practice-data'
import { addSpan, describe, type Answers, type Graded, type Highlights, type NumberedQuestion, type Span } from './practice-logic'

interface PassageProps {
  set: PracticeSet
  /** Passage number in a full test (1–3); absent for a one-passage test. */
  number?: number
  /** Suggested minutes for this passage. */
  minutes: number
  callNumber: string
  questions: NumberedQuestion[]
  answers: Answers
  highlights: Highlights
  onHighlights: (next: Highlights) => void
  highlighter: boolean
  /** Sentences to pulse (evidence), re-triggered by a new nonce. */
  pulse: { ids: string[]; nonce: number } | null
  mode: 'test' | 'review'
  graded?: Graded[]
  onGoToQuestion: (id: string) => void
}

/** Characters from the start of `el` to a boundary point inside it. */
function offsetIn(el: Element, node: Node, offset: number) {
  const r = document.createRange()
  r.selectNodeContents(el)
  r.setEnd(node, offset)
  return r.toString().length
}

/** The reading passage as a book page, with paragraph letters, highlights and evidence pulses. */
export const Passage = memo(function Passage({
  set,
  number,
  minutes,
  callNumber,
  questions,
  answers,
  highlights,
  onHighlights,
  highlighter,
  pulse,
  mode,
  graded,
  onGoToQuestion,
}: PassageProps) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const justHighlighted = useRef(false)
  const pointerType = useRef(window.matchMedia('(pointer: coarse)').matches ? 'touch' : 'mouse')
  const [chip, setChip] = useState<{ x: number; y: number } | null>(null)

  // Headings questions show a slot at the top of their paragraph, like the computer-based test.
  const slots = useMemo(() => {
    const map: Record<string, NumberedQuestion> = {}
    for (const x of questions) if (x.q.type === 'choose' && x.q.paragraph) map[x.q.paragraph] = x
    return map
  }, [questions])
  const gradedById = useMemo(() => Object.fromEntries((graded ?? []).map((g) => [g.x.q.id, g])), [graded])
  const pulsing = useMemo(() => new Set(pulse?.ids ?? []), [pulse])

  /** The selection inside the passage, as character spans per sentence. */
  const selectedSpans = (): [string, Span][] => {
    const sel = window.getSelection()
    const body = bodyRef.current
    if (!sel || sel.isCollapsed || !sel.rangeCount || !body) return []
    const range = sel.getRangeAt(0)
    const out: [string, Span][] = []
    body.querySelectorAll<HTMLElement>('[data-sid]').forEach((el) => {
      if (!range.intersectsNode(el)) return
      const text = el.textContent ?? ''
      let start = el.contains(range.startContainer) ? offsetIn(el, range.startContainer, range.startOffset) : 0
      let end = el.contains(range.endContainer) ? offsetIn(el, range.endContainer, range.endOffset) : text.length
      while (start < end && /\s/.test(text[start])) start++
      while (end > start && /\s/.test(text[end - 1])) end--
      if (end > start && el.dataset.sid) out.push([el.dataset.sid, [start, end]])
    })
    return out
  }

  const applySelection = () => {
    const spans = selectedSpans()
    setChip(null)
    if (!spans.length) return false
    const next: Highlights = { ...highlights }
    for (const [sid, span] of spans) next[sid] = addSpan(next[sid], span)
    onHighlights(next)
    window.getSelection()?.removeAllRanges()
    return true
  }

  const removeHighlight = (sid: string, index: number) => {
    const spans = (highlights[sid] ?? []).filter((_, i) => i !== index)
    const next = { ...highlights }
    if (spans.length) next[sid] = spans
    else delete next[sid]
    onHighlights(next)
  }

  // Touch and keyboard selections get a floating "Highlight" chip instead of highlighting instantly.
  useEffect(() => {
    if (!highlighter) return
    const onChange = () => {
      if (pointerType.current === 'mouse') return
      const sel = window.getSelection()
      const body = bodyRef.current
      if (!sel || sel.isCollapsed || !sel.rangeCount || !body || !body.contains(sel.anchorNode)) {
        setChip(null)
        return
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect()
      setChip({ x: rect.left + rect.width / 2, y: rect.bottom + 10 })
    }
    document.addEventListener('selectionchange', onChange)
    document.addEventListener('scroll', onChange, true)
    return () => {
      document.removeEventListener('selectionchange', onChange)
      document.removeEventListener('scroll', onChange, true)
    }
  }, [highlighter])

  const renderSentence = (sid: string, text: string): ReactNode => {
    const spans = highlights[sid]
    if (!spans?.length) return text
    const parts: ReactNode[] = []
    let pos = 0
    spans.forEach(([s, e], i) => {
      if (s > pos) parts.push(text.slice(pos, s))
      parts.push(
        <mark
          key={`${s}-${e}`}
          className="rd-hl"
          title="Click to remove this highlight"
          tabIndex={0}
          role="button"
          aria-label={`Remove highlight: ${text.slice(s, e)}`}
          onClick={() => {
            if (!justHighlighted.current) removeHighlight(sid, i)
          }}
          onKeyDown={(ev) => {
            if (ev.key !== 'Enter' && ev.key !== ' ' && ev.key !== 'Delete' && ev.key !== 'Backspace') return
            ev.preventDefault()
            // Keep the keyboard in the passage once the mark is gone.
            ev.currentTarget.closest<HTMLElement>('.rd-leaf')?.focus({ preventScroll: true })
            removeHighlight(sid, i)
          }}
        >
          {text.slice(s, e)}
        </mark>,
      )
      pos = e
    })
    if (pos < text.length) parts.push(text.slice(pos))
    return parts
  }

  /** Two neighbouring sentences highlighted right up to the space between them. */
  const joins = (a: { id: string; text: string }, b: { id: string }) =>
    Boolean(highlights[a.id]?.some(([, e]) => e >= a.text.length) && highlights[b.id]?.some(([st]) => st === 0))

  const first = questions[0]?.n ?? 1
  const last = questions[questions.length - 1]?.n ?? first

  return (
    <article className="rd-passage" aria-labelledby="rd-passage-title">
      <header className="rd-passage__head">
        <p className="rd-passage__eyebrow">
          <span>READING PASSAGE{number ? ` ${number}` : ''}</span>
          <span aria-hidden="true">·</span>
          <span>{callNumber}</span>
        </p>
        <h2 className="rd-passage__title" id="rd-passage-title">
          {set.passageTitle}
        </h2>
        <p className="rd-passage__sub">{set.passageSubtitle}</p>
        <p className="rd-passage__brief">
          You should spend about {minutes} minutes on Questions {first}–{last}, which are based on
          {number ? ` Reading Passage ${number}` : ' the reading passage'} below.
        </p>
        <span className="rd-passage__orn" aria-hidden="true">
          <i />
          <b>❦</b>
          <i />
        </span>
      </header>

      <div
        ref={bodyRef}
        className={`rd-passage__body ${highlighter ? 'is-highlighter' : ''}`}
        onPointerDown={(e) => {
          pointerType.current = e.pointerType
        }}
        onMouseUp={() => {
          if (!highlighter || pointerType.current !== 'mouse') return
          if (applySelection()) {
            justHighlighted.current = true
            window.setTimeout(() => (justHighlighted.current = false), 0)
          }
        }}
      >
        {set.paragraphs.map((p, pi) => {
          const slot = slots[p.label]
          const g = slot ? gradedById[slot.q.id] : undefined
          return (
            <section key={p.label} className="rd-para" aria-label={`Paragraph ${p.label}`} id={`rd-para-${p.label}`}>
              <span className="rd-para__label" aria-hidden="true">
                {p.label}
              </span>
              {slot && (
                <button
                  type="button"
                  className={`rd-slot ${answers[slot.q.id] ? 'is-filled' : ''} ${g ? (g.correct ? 'is-right' : 'is-wrong') : ''}`}
                  onClick={() => onGoToQuestion(slot.q.id)}
                >
                  <span className="rd-slot__n">{slot.n}</span>
                  <span className="rd-slot__text">
                    {answers[slot.q.id]
                      ? describe(slot, answers[slot.q.id])
                      : mode === 'test'
                        ? 'Choose a heading for this paragraph'
                        : 'No heading chosen'}
                  </span>
                  {g && <span className="rd-slot__mark">{g.correct ? '✓' : '✗'}</span>}
                  <span className="visually-hidden"> — go to question {slot.n}</span>
                </button>
              )}
              <p className={`rd-para__text ${pi === 0 ? 'rd-para__text--first' : ''}`}>
                {p.sentences.map((s, si) => (
                  <Fragment key={s.id}>
                    {si > 0 &&
                      (joins(p.sentences[si - 1], s) ? (
                        <span className="rd-hl rd-hl--join" aria-hidden="true">
                          {' '}
                        </span>
                      ) : (
                        ' '
                      ))}
                    <span
                      data-sid={s.id}
                      id={`rd-s-${s.id}`}
                      className={`rd-sent ${pulsing.has(s.id) ? 'is-evidence' : ''}`}
                      key={pulsing.has(s.id) ? `${s.id}-${pulse?.nonce}` : s.id}
                    >
                      {renderSentence(s.id, s.text)}
                    </span>
                  </Fragment>
                ))}
              </p>
            </section>
          )
        })}
        <p className="rd-passage__end" aria-hidden="true">
          ✦ ✦ ✦
        </p>
      </div>

      {chip &&
        createPortal(
          <button
            type="button"
            className="rd-hlchip"
            style={{ left: chip.x, top: chip.y }}
            onPointerDown={(e) => e.preventDefault()}
            onMouseDown={(e) => e.preventDefault()}
            onClick={applySelection}
          >
            <span aria-hidden="true">▍</span> Highlight
          </button>,
          document.body,
        )}
    </article>
  )
})
