import { memo, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PixelSprite } from '../../../components/PixelSprite'
import { useUser } from '../../../auth/auth-context'
import { findPractice } from '../../../learn/catalog'
import type { Attempt } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import type { PracticeInfo } from '../../../learn/types'
import { useProgress } from '../../../learn/useProgress'
import { formatClock } from '../../../learn/useTimer'
import { BurningCandle } from './Candle'
import { practiceSets } from './content'
import { useClock, useReducedMotion, useStableCallback } from './hooks'
import { LibrarianOwl } from './LibrarianOwl'
import { LibraryBackdrop } from './LibraryBackdrop'
import { HUB_PATH, SECTION, bandEstimate, callNumber, practiceIndex } from './library'
import { Passage } from './Passage'
import { PRACTICE, type PracticeSet } from './practice-data'
import {
  clearDraft,
  grade,
  highlightCount,
  isAnswered,
  loadDraft,
  numberQuestions,
  saveDraft,
  type Answers,
  type Draft,
  type Graded,
  type Highlights,
} from './practice-logic'
import { PracticeIntro } from './PracticeIntro'
import { PracticeResults } from './PracticeResults'
import { FlagIcon, QuestionSheet } from './QuestionSheet'
import { ReviewSheet, type ReviewFilter } from './ReviewSheet'
import { HIGHLIGHTER_SPRITE } from './sprites'
import './reading.css'
import './practice.css'

/** A practice test in the Moonlit Library's reading room. */
export default function ReadingPractice() {
  const { practiceId } = useParams()
  const info = findPractice(SECTION, practiceId)
  const set = info ? PRACTICE[info.id] : undefined
  if (!info || !set) return <Navigate to={HUB_PATH} replace />
  return <ReadingRoom key={info.id} info={info} set={set} />
}

type Phase = 'intro' | 'test' | 'results'
type View = 'passage' | 'questions'

interface Result {
  attempt: Attempt
  graded: Graded[]
  previousBest?: Attempt
}

const hudSpace = () => {
  const el = document.querySelector('.student')
  const v = el ? parseFloat(getComputedStyle(el).getPropertyValue('--hud-space')) : NaN
  return Number.isFinite(v) ? v : 124
}

function ReadingRoom({ info, set }: { info: PracticeInfo; set: PracticeSet }) {
  const user = useUser()
  const progress = useProgress()
  const stats = progress.section(SECTION)
  const reduced = useReducedMotion()
  const questions = useMemo(() => numberQuestions(set), [set])
  const index = practiceIndex(info.id)
  const call = callNumber(index)
  const firstName = user.name.split(' ')[0] || 'friend'

  const [phase, setPhase] = useState<Phase>('intro')
  const [draft, setDraft] = useState<Draft | null>(() => loadDraft(user.id, set.id))
  const [answers, setAnswers] = useState<Answers>({})
  const [flagged, setFlagged] = useState<Set<string>>(() => new Set())
  const [highlights, setHighlights] = useState<Highlights>({})
  const [current, setCurrent] = useState(questions[0].q.id)
  const [view, setView] = useState<View>('passage')
  const [highlighter, setHighlighter] = useState(true)
  const [pulse, setPulse] = useState<{ ids: string[]; nonce: number } | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [timeUpSeen, setTimeUpSeen] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  /** Bumped whenever the clock is reset, so the time-up alarm is re-armed. */
  const [clockEpoch, setClockEpoch] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all')
  const [secondLook, setSecondLook] = useState(false)

  const { read: readClock, reset: resetClock } = useClock(phase === 'test')
  const submitted = useRef(false)
  const passagePane = useRef<HTMLDivElement>(null)
  const questionPane = useRef<HTMLDivElement>(null)
  const reviewRef = useRef<HTMLElement>(null)
  const submitBtn = useRef<HTMLButtonElement>(null)
  /** Phones show one page at a time: remember where each page was scrolled to. */
  const viewScroll = useRef<Record<View, number | null>>({ passage: null, questions: null })

  const attempts = stats.attempts.filter((a) => a.practiceId === info.id)
  const limit = info.minutes * 60
  const answeredCount = questions.filter((x) => isAnswered(answers[x.q.id])).length
  const unanswered = questions.filter((x) => !isAnswered(answers[x.q.id]))
  const currentIndex = Math.max(
    0,
    questions.findIndex((x) => x.q.id === current),
  )

  const nextPractice = useMemo(() => {
    const others = [...practiceSets.slice(index + 1), ...practiceSets.slice(0, index)]
    return others.find((p) => !stats.best[p.id]) ?? others[0]
  }, [index, stats.best])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // One alarm for the end of the candle, instead of checking the time on every tick.
  useEffect(() => {
    if (phase !== 'test') return
    const left = limit - readClock()
    if (left <= 0) {
      const id = window.requestAnimationFrame(() => setTimeUp(true))
      return () => window.cancelAnimationFrame(id)
    }
    const id = window.setTimeout(() => setTimeUp(true), left * 1000 + 50)
    return () => window.clearTimeout(id)
  }, [phase, limit, readClock, clockEpoch])

  // Keep a bookmark of the test in progress, so leaving the room never loses work.
  const saveNow = useStableCallback(() => {
    if (phase === 'test' && !submitted.current)
      saveDraft(user.id, set.id, { answers, flagged: [...flagged], highlights, elapsed: readClock() })
  })
  useEffect(() => {
    if (phase !== 'test') return
    const save = () => {
      if (!submitted.current) saveDraft(user.id, set.id, { answers, flagged: [...flagged], highlights, elapsed: readClock() })
    }
    save()
    const id = window.setInterval(save, 4000)
    window.addEventListener('pagehide', save)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('pagehide', save)
      save()
    }
  }, [phase, answers, flagged, highlights, user.id, set.id, readClock])

  // ------------------------------------------------------------- actions ---

  const begin = (from: Draft | null) => {
    submitted.current = false
    setAnswers(from?.answers ?? {})
    setFlagged(new Set(from?.flagged ?? []))
    setHighlights(from?.highlights ?? {})
    resetClock(from?.elapsed ?? 0)
    setClockEpoch((e) => e + 1)
    setTimeUp(Boolean(from && from.elapsed >= limit))
    if (!from) clearDraft(user.id, set.id)
    setDraft(null)
    setCurrent(questions[0].q.id)
    setView('passage')
    viewScroll.current = { passage: null, questions: null }
    setPulse(null)
    setTimeUpSeen(Boolean(from && from.elapsed >= limit))
    setResult(null)
    setReviewFilter('all')
    setSecondLook(false)
    setPhase('test')
    sfx.page()
    window.scrollTo(0, 0)
    // The start button has gone: put keyboard and screen-reader users at the top of the passage.
    window.requestAnimationFrame(() => passagePane.current?.focus({ preventScroll: true }))
  }

  const setAnswer = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }))

  const toggleFlag = (id: string) =>
    setFlagged((f) => {
      const next = new Set(f)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  /** Scroll an element into view inside its page of the book (or the window on phones). */
  const reveal = (el: HTMLElement, pane: HTMLElement | null) => {
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth'
    const paneScrolls = pane && getComputedStyle(pane).overflowY !== 'visible' && pane.scrollHeight > pane.clientHeight + 2
    if (pane && paneScrolls) {
      const hud = hudSpace()
      const desk = pane.closest<HTMLElement>('.rd-desk')
      const deskTop = desk?.getBoundingClientRect().top ?? hud
      if (desk && Math.abs(deskTop - hud) > 30 && phase === 'results') {
        window.scrollTo({ top: window.scrollY + deskTop - hud, behavior })
      }
      const top = el.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop - pane.clientHeight * 0.25
      pane.scrollTo({ top: Math.max(0, top), behavior })
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY - hudSpace() - 120
      window.scrollTo({ top: Math.max(0, y), behavior })
    }
  }

  const singlePage = () => getComputedStyle(passagePane.current ?? document.body).overflowY === 'visible'

  /** Switch pages from the toggle: on phones, come back to where that page was left. */
  const switchView = (next: View) => {
    if (next === view) return
    sfx.page()
    if (!singlePage()) {
      setView(next)
      return
    }
    viewScroll.current[view] = window.scrollY
    setView(next)
    const saved = viewScroll.current[next]
    window.requestAnimationFrame(() => {
      if (saved !== null) {
        window.scrollTo(0, saved)
        return
      }
      const desk = passagePane.current?.closest<HTMLElement>('.rd-desk')
      const top = desk ? desk.getBoundingClientRect().top + window.scrollY - hudSpace() + 4 : 0
      if (window.scrollY > top) window.scrollTo(0, top)
    })
  }

  const rememberScroll = () => {
    if (singlePage()) viewScroll.current[view] = window.scrollY
  }

  const goTo = useStableCallback((id: string) => {
    if (view !== 'questions') rememberScroll()
    setCurrent(id)
    setView('questions')
    // In review, a filter or the second look may hide the question: show everything again.
    if (phase === 'results' && !document.getElementById(`rd-q-${id}`)) {
      setReviewFilter('all')
      setSecondLook(false)
    }
    window.requestAnimationFrame(() => {
      const el = document.getElementById(`rd-q-${id}`)
      if (!el) return
      reveal(el, questionPane.current)
      if (phase === 'test') {
        const field = el.querySelector<HTMLElement>('input:checked, input[type=text], select, input')
        field?.focus({ preventScroll: true })
      }
      el.classList.remove('is-pinged')
      void el.offsetWidth
      el.classList.add('is-pinged')
    })
  })

  const step = (delta: number) => {
    const next = questions[Math.min(questions.length - 1, Math.max(0, currentIndex + delta))]
    if (next) {
      sfx.click()
      goTo(next.q.id)
    }
  }

  const showEvidence = useStableCallback((g: Graded) => {
    if (view !== 'passage') rememberScroll()
    setCurrent(g.x.q.id)
    setView('passage')
    setPulse({ ids: g.x.q.evidence, nonce: Date.now() })
    window.requestAnimationFrame(() => {
      const el = document.getElementById(`rd-s-${g.x.q.evidence[0]}`)
      if (el) reveal(el, passagePane.current)
    })
  })

  const setAnswerStable = useStableCallback(setAnswer)
  const toggleFlagStable = useStableCallback(toggleFlag)

  const changeSecondLook = (on: boolean) => {
    setSecondLook(on)
    setReviewFilter(on ? 'missed' : 'all')
    // Don't leave a moonlit sentence showing where the answer is.
    if (on) setPulse(null)
  }

  const submit = () => {
    if (submitted.current) return
    submitted.current = true
    const graded = grade(questions, answers)
    const score = graded.filter((g) => g.correct).length
    const previousBest = stats.best[info.id]
    const attempt = progress.recordAttempt(SECTION, {
      practiceId: info.id,
      score,
      total: questions.length,
      durationSec: Math.max(1, Math.round(readClock())),
      band: bandEstimate(score, questions.length),
      detail: {
        answers,
        flagged: [...flagged],
        wrong: graded.filter((g) => !g.correct).map((g) => g.x.q.id),
      },
    })
    clearDraft(user.id, set.id)
    setConfirming(false)
    setResult({ attempt, graded, previousBest })
    setPulse(null)
    setView('questions')
    viewScroll.current = { passage: null, questions: null }
    setCurrent(questions[0].q.id)
    setPhase('results')
    window.scrollTo(0, 0)
  }

  const requestSubmit = () => {
    sfx.click()
    if (unanswered.length) setConfirming(true)
    else submit()
  }

  const toReview = () => {
    sfx.page()
    const desk = reviewRef.current?.querySelector('.rd-desk')
    if (desk)
      window.scrollTo({
        top: desk.getBoundingClientRect().top + window.scrollY - hudSpace(),
        behavior: reduced ? 'auto' : 'smooth',
      })
  }

  // ----------------------------------------------------------------- render ---

  if (phase === 'intro') {
    return (
      <div className="rd-world rd-practice rd-practice--intro">
        <LibraryBackdrop />
        <PracticeIntro
          info={info}
          set={set}
          callNumber={call}
          attempts={attempts}
          best={stats.best[info.id]}
          draft={draft}
          questionCount={questions.length}
          onStart={() => begin(null)}
          onResume={() => begin(draft)}
        />
      </div>
    )
  }

  const mode = phase === 'test' ? 'test' : 'review'
  const gradedById = Object.fromEntries((result?.graded ?? []).map((g) => [g.x.q.id, g]))
  const marks = highlightCount(highlights)

  const desk = (
    <div className={`rd-desk rd-desk--${mode} is-view-${view}`}>
      <div className="rd-deskbar">
        {mode === 'test' ? (
          <Link to={`${HUB_PATH}/practice`} className="rd-deskbar__leave" title="Your answers are kept as a bookmark" onClick={saveNow}>
            <span aria-hidden="true">←</span>
            <span className="rd-deskbar__leave-text">Leave</span>
            <span className="visually-hidden"> the reading room (your answers are saved)</span>
          </Link>
        ) : (
          <button
            type="button"
            className="rd-deskbar__leave"
            onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          >
            <span aria-hidden="true">↑</span>
            <span className="rd-deskbar__leave-text">Results</span>
          </button>
        )}

        <div className="rd-deskbar__title">
          <p>
            <span className="rd-deskbar__call">{call}</span> {info.title}
          </p>
          <small>
            {mode === 'test'
              ? `${answeredCount} of ${questions.length} answered`
              : `${result?.attempt.score ?? 0} of ${questions.length} correct · review`}
          </small>
        </div>

        <div className="rd-viewtoggle" role="group" aria-label="Show">
          <button
            type="button"
            className={view === 'passage' ? 'is-on' : ''}
            aria-pressed={view === 'passage'}
            onClick={() => switchView('passage')}
          >
            Passage
          </button>
          <button
            type="button"
            className={view === 'questions' ? 'is-on' : ''}
            aria-pressed={view === 'questions'}
            onClick={() => switchView('questions')}
          >
            {mode === 'test' ? 'Questions' : 'Review'}
            {mode === 'test' && (
              <span className="rd-viewtoggle__count">
                {answeredCount}/{questions.length}
              </span>
            )}
          </button>
        </div>

        <div className="rd-deskbar__tools">
          <button
            type="button"
            className={`rd-tool ${highlighter ? 'is-on' : ''}`}
            aria-pressed={highlighter}
            onClick={() => {
              sfx.click()
              setHighlighter((h) => !h)
            }}
            title="Select text in the passage to highlight it"
          >
            <PixelSprite sprite={HIGHLIGHTER_SPRITE} scale={2} />
            <span className="rd-tool__text">Highlighter</span>
          </button>
          {marks > 0 && (
            <button
              type="button"
              className="rd-tool rd-tool--clear"
              onClick={() => {
                sfx.click()
                setHighlights({})
              }}
              title="Remove every highlight"
            >
              <span aria-hidden="true">✕</span>
              <span className="rd-tool__text">Clear {marks}</span>
              <span className="visually-hidden"> highlights</span>
            </button>
          )}
        </div>

        {mode === 'test' ? (
          <DeskTimer read={readClock} limit={limit} timeUp={timeUp} onTimeUp={setTimeUp} />
        ) : (
          <div className="rd-timer is-done">
            <BurningCandle
              fraction={Math.max(0, 1 - (result?.attempt.durationSec ?? 0) / limit)}
              lit={false}
              className="rd-timer__candle"
            />
            <span className="rd-timer__digits">
              <span className="visually-hidden">Time used: </span>
              {formatClock(result?.attempt.durationSec ?? 0)}
            </span>
          </div>
        )}

        {mode === 'test' ? (
          <button type="button" ref={submitBtn} className="rd-btn rd-btn--ink rd-deskbar__submit" onClick={requestSubmit}>
            Submit <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button type="button" className="rd-btn rd-btn--ink rd-deskbar__submit" onClick={() => begin(null)}>
            Try again
          </button>
        )}
      </div>

      <div className="rd-openbook">
        {mode === 'test' && timeUp && !timeUpSeen && (
          <div className="rd-timeup" role="alert">
            <LibrarianOwl scale={3} look={1} />
            <div>
              <p className="rd-timeup__title">The candle has burned out.</p>
              <p className="rd-timeup__text">In the real exam, pens go down now. Hand in, or keep going in overtime.</p>
            </div>
            <div className="rd-timeup__actions">
              <button type="button" className="rd-btn rd-btn--small" onClick={requestSubmit}>
                Submit now
              </button>
              <button
                type="button"
                className="rd-btn rd-btn--small rd-btn--ghost"
                onClick={() => {
                  sfx.click()
                  setTimeUpSeen(true)
                }}
              >
                Keep going
              </button>
            </div>
          </div>
        )}

        <div className="rd-leaf rd-leaf--passage" ref={passagePane} tabIndex={0} role="region" aria-label="Reading passage">
          <Passage
            set={set}
            info={info}
            callNumber={call}
            questions={questions}
            answers={answers}
            highlights={highlights}
            onHighlights={setHighlights}
            highlighter={highlighter}
            pulse={pulse}
            mode={mode}
            graded={result?.graded}
            onGoToQuestion={goTo}
          />
        </div>
        <div className="rd-openbook__gutter" aria-hidden="true" />
        <div
          className="rd-leaf rd-leaf--questions"
          ref={questionPane}
          tabIndex={0}
          role="region"
          aria-label={mode === 'test' ? 'Questions' : 'Answer review'}
        >
          {mode === 'test' ? (
            <QuestionSheet
              set={set}
              questions={questions}
              answers={answers}
              onAnswer={setAnswerStable}
              flagged={flagged}
              onToggleFlag={toggleFlagStable}
              current={current}
              onCurrent={setCurrent}
            />
          ) : (
            result && (
              <ReviewSheet
                graded={result.graded}
                flagged={flagged}
                current={current}
                onShowEvidence={showEvidence}
                filter={reviewFilter}
                onFilter={setReviewFilter}
                second={secondLook}
                onSecond={changeSecondLook}
              />
            )
          )}
        </div>
      </div>

      <nav className="rd-navbar" aria-label="Question navigator">
        <button type="button" className="rd-navbar__step" onClick={() => step(-1)} disabled={currentIndex === 0}>
          <span aria-hidden="true">‹</span>
          <span className="visually-hidden">Previous question</span>
        </button>
        <ol className="rd-tiles">
          {questions.map((x, i) => {
            const id = x.q.id
            const answered = isAnswered(answers[id])
            const g = gradedById[id]
            const status = g ? (g.correct ? 'right' : g.answered ? 'wrong' : 'blank') : answered ? 'answered' : 'open'
            const newGroup = i > 0 && x.groupIndex !== questions[i - 1].groupIndex
            return (
              <li key={id} className={newGroup ? 'is-group-start' : ''} style={{ '--rd-i': i } as CSSProperties}>
                <button
                  type="button"
                  className={`rd-tile rd-tile--${status} ${flagged.has(id) ? 'is-flagged' : ''} ${current === id ? 'is-current' : ''}`}
                  aria-current={current === id ? 'step' : undefined}
                  onClick={() => {
                    sfx.click()
                    goTo(id)
                  }}
                >
                  <span aria-hidden="true">{x.n}</span>
                  {g && (
                    <i className="rd-tile__mark" aria-hidden="true">
                      {g.correct ? '✓' : '✗'}
                    </i>
                  )}
                  <span className="visually-hidden">
                    Question {x.n}
                    {g
                      ? g.correct
                        ? ', correct'
                        : g.answered
                          ? ', incorrect'
                          : ', not answered'
                      : answered
                        ? ', answered'
                        : ', not answered'}
                    {flagged.has(id) ? ', flagged' : ''}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <button
          type="button"
          className="rd-navbar__step"
          onClick={() => step(1)}
          disabled={currentIndex === questions.length - 1}
        >
          <span aria-hidden="true">›</span>
          <span className="visually-hidden">Next question</span>
        </button>
        {mode === 'test' && (
          <button
            type="button"
            className={`rd-navbar__flag ${flagged.has(current) ? 'is-on' : ''}`}
            aria-pressed={flagged.has(current)}
            onClick={() => {
              sfx.click()
              toggleFlag(current)
            }}
          >
            <FlagIcon />
            <span className="rd-navbar__flag-text">{flagged.has(current) ? 'Flagged' : 'Flag'}</span>
            <span className="visually-hidden"> question {questions[currentIndex].n} for review</span>
          </button>
        )}
      </nav>
    </div>
  )

  return (
    <div className={`rd-world rd-practice rd-practice--${phase}`}>
      <LibraryBackdrop candles={phase !== 'test'} />
      {phase === 'results' && result ? (
        <>
          <div className="rd-practice__results">
            <PracticeResults
              info={info}
              attempt={result.attempt}
              graded={result.graded}
              previousBest={result.previousBest}
              firstName={firstName}
              next={nextPractice}
              onReview={toReview}
              onRetry={() => begin(null)}
            />
          </div>
          <section ref={reviewRef} className="rd-practice__review" aria-label="Review your answers">
            {desk}
          </section>
        </>
      ) : (
        desk
      )}

      {confirming && (
        <SubmitDialog
          blanks={unanswered.map((x) => ({ id: x.q.id, n: x.n }))}
          onCancel={() => {
            setConfirming(false)
            submitBtn.current?.focus()
          }}
          onGoTo={(id) => {
            setConfirming(false)
            goTo(id)
          }}
          onSubmit={submit}
        />
      )}
    </div>
  )
}

/** The candle and mm:ss. It polls the clock itself, so only this little component re-renders each second. */
const DeskTimer = memo(function DeskTimer({
  read,
  limit,
  timeUp,
  onTimeUp,
}: {
  read: () => number
  limit: number
  timeUp: boolean
  /** Also raised from here, in case the page's own alarm was delayed (e.g. a throttled background tab). */
  onTimeUp: (up: true) => void
}) {
  const [seconds, setSeconds] = useState(() => Math.floor(read()))
  useEffect(() => {
    const id = window.setInterval(() => setSeconds(Math.floor(read())), 250)
    return () => window.clearInterval(id)
  }, [read])
  const remaining = limit - seconds
  useEffect(() => {
    if (remaining <= 0 && !timeUp) onTimeUp(true)
  }, [remaining, timeUp, onTimeUp])
  const low = remaining <= 120
  return (
    <div className={`rd-timer ${low ? 'is-low' : ''} ${timeUp ? 'is-up' : ''}`} role="timer" aria-live="off">
      <BurningCandle
        fraction={Math.max(0, remaining / limit)}
        lit={!timeUp}
        warn={low && !timeUp}
        className="rd-timer__candle"
      />
      <span className="rd-timer__digits">
        <span className="visually-hidden">{timeUp ? 'Time is up. Overtime: ' : 'Time remaining: '}</span>
        {timeUp ? `+${formatClock(Math.max(0, -remaining))}` : formatClock(Math.max(0, remaining))}
      </span>
    </div>
  )
})

function SubmitDialog({
  blanks,
  onCancel,
  onGoTo,
  onSubmit,
}: {
  blanks: { id: string; n: number }[]
  onCancel: () => void
  onGoTo: (id: string) => void
  onSubmit: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const keepRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    keepRef.current?.focus()
  }, [])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onCancel()
      return
    }
    if (e.key !== 'Tab' || !cardRef.current) return
    const items = [...cardRef.current.querySelectorAll<HTMLElement>('button')]
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const count = blanks.length
  return (
    <div
      className="rd-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        ref={cardRef}
        className="rd-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rd-modal-title"
        aria-describedby="rd-modal-text"
        onKeyDown={onKeyDown}
      >
        <LibrarianOwl scale={3} look={-1} className="rd-modal__owl" />
        <h2 className="rd-modal__title" id="rd-modal-title">
          Hand in with {count} blank {count === 1 ? 'answer' : 'answers'}?
        </h2>
        <p className="rd-modal__text" id="rd-modal-text">
          There is no penalty for a wrong answer in IELTS, so a sensible guess can only help. Tap a number to fill it in.
        </p>
        <ul className="rd-modal__blanks" aria-label="Unanswered questions">
          {blanks.map((b) => (
            <li key={b.id}>
              <button type="button" className="rd-tile rd-tile--open" onClick={() => onGoTo(b.id)}>
                <span aria-hidden="true">{b.n}</span>
                <span className="visually-hidden">Go to question {b.n}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="rd-modal__actions">
          <button type="button" ref={keepRef} className="rd-btn rd-btn--ghost" onClick={onCancel}>
            Keep reading
          </button>
          <button type="button" className="rd-btn rd-btn--ink" onClick={onSubmit}>
            Submit anyway <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
