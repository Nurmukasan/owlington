import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useUser } from '../../../auth/auth-context'
import { findPractice } from '../../../learn/catalog'
import { floatText } from '../../../learn/fx'
import type { Attempt } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import type { PracticeInfo } from '../../../learn/types'
import { useProgress } from '../../../learn/useProgress'
import { useStopwatch } from '../../../learn/useTimer'
import { analyse, countWords, runChecks, type CheckResult, type Criterion, type TextAnalysis } from './analysis'
import { AnalysisView, SelfAssess } from './Assessment'
import { practiceSets } from './content'
import { clearDraft, hasContent, loadDraft, saveDraft } from './drafts'
import { PracticeIntro } from './PracticeIntro'
import { estimateBand, findPrompt, type WritingPrompt } from './prompts'
import { Results } from './Results'
import { Studio } from './Studio'
import './world.css'
import './practice.css'

export default function WritingPractice() {
  const { practiceId } = useParams()
  const info = findPractice('writing', practiceId)
  const prompt = findPrompt(practiceId)
  if (!info || !prompt) return <Navigate to="/student/writing" replace />
  return <Practice key={prompt.id} info={info} prompt={prompt} />
}

type Phase = 'intro' | 'write' | 'review' | 'assess' | 'done'

interface Submission {
  text: string
  analysis: TextAnalysis
  checks: CheckResult[]
  durationSec: number
}

function Practice({ info, prompt }: { info: PracticeInfo; prompt: WritingPrompt }) {
  const user = useUser()
  const progress = useProgress()
  const history = progress.section('writing').attempts.filter((a) => a.practiceId === prompt.id)
  const [initial] = useState(() => {
    const d = loadDraft(user.id, prompt.id)
    return hasContent(d) ? d : null
  })

  const [phase, setPhase] = useState<Phase>('intro')
  const [text, setText] = useState(initial?.text ?? '')
  const [plan, setPlan] = useState<string[]>(() => prompt.plan.map((_, i) => initial?.plan[i] ?? ''))
  const [banked, setBanked] = useState(initial?.elapsed ?? 0)
  const [paused, setPaused] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(initial?.updatedAt ?? null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [scores, setScores] = useState<Partial<Record<Criterion, number>>>({})
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [wordBump, setWordBump] = useState(0)
  const recorded = useRef(false)
  const celebratedGoal = useRef(countWords(initial?.text ?? '') >= prompt.minWords)
  const timeUpNoted = useRef(false)

  const { elapsed, reset } = useStopwatch(phase === 'write' && !paused)
  const total = banked + elapsed
  const remaining = prompt.minutes * 60 - total
  const totalRef = useRef(total)
  useEffect(() => {
    totalRef.current = total
  }, [total])

  // --- autosave ----------------------------------------------------------------------
  const persist = useCallback(
    (t: string, p: string[]) => {
      if (!t.trim() && !p.some((x) => x.trim())) return
      const at = new Date().toISOString()
      if (saveDraft(user.id, prompt.id, { text: t, plan: p, elapsed: Math.round(totalRef.current), updatedAt: at })) setSavedAt(at)
    },
    [user.id, prompt.id],
  )

  useEffect(() => {
    if (phase !== 'write') return
    const id = window.setTimeout(() => persist(text, plan), 700)
    return () => window.clearTimeout(id)
  }, [text, plan, phase, persist])

  // Keep the clock in the draft too, and save when the tab is hidden or closed.
  const latest = useRef({ text, plan })
  useEffect(() => {
    latest.current = { text, plan }
  }, [text, plan])
  useEffect(() => {
    if (phase !== 'write') return
    const id = window.setInterval(() => persist(latest.current.text, latest.current.plan), 15000)
    const onHide = () => persist(latest.current.text, latest.current.plan)
    window.addEventListener('pagehide', onHide)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('pagehide', onHide)
      document.removeEventListener('visibilitychange', onHide)
      onHide()
    }
  }, [phase, persist])

  // A gentle note when the clock runs out (the student may keep writing).
  const [timeUp, setTimeUp] = useState(false)
  useEffect(() => {
    if (phase !== 'write' || remaining > 0 || timeUpNoted.current) return
    timeUpNoted.current = true
    const id = window.setTimeout(() => setTimeUp(true), 0)
    return () => window.clearTimeout(id)
  }, [phase, remaining])

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // --- actions ---------------------------------------------------------------------------
  const start = (fresh: boolean) => {
    sfx.page()
    if (fresh) {
      clearDraft(user.id, prompt.id)
      setText('')
      setPlan(prompt.plan.map(() => ''))
      setBanked(0)
      setSavedAt(null)
      celebratedGoal.current = false
      timeUpNoted.current = false
      setTimeUp(false)
    }
    reset()
    setPaused(false)
    setPhase('write')
    goTop()
  }

  const onText = (next: string) => {
    setText(next)
    const words = countWords(next)
    if (!celebratedGoal.current && words >= prompt.minWords) {
      celebratedGoal.current = true
      sfx.correct()
      setWordBump((b) => b + 1)
      const meter = document.querySelector('.wr-words__count') ?? document.querySelector('.wr-bar__words')
      floatText(`${prompt.minWords} words!`, meter ?? undefined, '#ff9a85')
    }
  }

  const submit = () => {
    if (countWords(text) < prompt.minWords && !confirming) {
      sfx.click()
      setConfirming(true)
      return
    }
    setConfirming(false)
    sfx.page()
    persist(text, plan)
    const analysis = analyse(text, prompt.question)
    const checks = runChecks(prompt.checks, {
      text,
      analysis,
      minWords: prompt.minWords,
      question: prompt.question,
      bullets: prompt.bulletChecks,
    })
    setSubmission({ text, analysis, checks, durationSec: Math.round(totalRef.current) })
    setPhase('review')
    goTop()
  }

  const keepWriting = () => {
    sfx.page()
    setBanked(totalRef.current)
    reset()
    setSubmission(null)
    setPhase('write')
    goTop()
  }

  const seal = () => {
    if (!submission || recorded.current) return
    const rubric = Object.values(scores).filter((v): v is number => typeof v === 'number')
    if (rubric.length < 4) return
    recorded.current = true
    const band = estimateBand(rubric)
    const met = submission.checks.filter((c) => c.met)
    const result = progress.recordAttempt('writing', {
      practiceId: prompt.id,
      score: met.length,
      total: 10,
      durationSec: submission.durationSec,
      band,
      detail: {
        words: submission.analysis.words,
        text: submission.text,
        criteria: scores,
        met: met.map((c) => c.id),
      },
    })
    clearDraft(user.id, prompt.id)
    setAttempt(result)
    setPhase('done')
    goTop()
  }

  const retry = () => {
    sfx.page()
    clearDraft(user.id, prompt.id)
    recorded.current = false
    celebratedGoal.current = false
    timeUpNoted.current = false
    setTimeUp(false)
    setText('')
    setPlan(prompt.plan.map(() => ''))
    setBanked(0)
    setSavedAt(null)
    setSubmission(null)
    setScores({})
    setAttempt(null)
    reset()
    setPaused(false)
    setPhase('write')
    goTop()
  }

  const number = practiceSets.findIndex((p) => p.id === prompt.id) + 1
  const nextSet = useMemo(() => {
    const i = practiceSets.findIndex((p) => p.id === prompt.id)
    const best = progress.section('writing').best
    return practiceSets.slice(i + 1).find((p) => !best[p.id]) ?? practiceSets[(i + 1) % practiceSets.length]
  }, [prompt.id, progress])

  return (
    <div className={`wr-world wr-practice wr-practice--${phase}`}>
      {phase === 'intro' && (
        <PracticeIntro
          info={info}
          prompt={prompt}
          number={number}
          history={history}
          draftWords={countWords(text)}
          draftElapsed={banked}
          onStart={start}
        />
      )}

      {phase === 'write' && (
        <Studio
          info={info}
          prompt={prompt}
          studentName={user.name}
          text={text}
          onText={onText}
          plan={plan}
          onPlan={(i, v) => setPlan((p) => p.map((x, k) => (k === i ? v : x)))}
          remaining={remaining}
          paused={paused}
          onTogglePause={() => {
            sfx.click()
            setPaused((p) => !p)
          }}
          savedAt={savedAt}
          onSubmit={submit}
          wordBump={wordBump}
        />
      )}

      {phase === 'review' && submission && (
        <AnalysisView
          prompt={prompt}
          text={submission.text}
          analysis={submission.analysis}
          checks={submission.checks}
          durationSec={submission.durationSec}
          onBack={keepWriting}
          onNext={() => {
            sfx.page()
            setPhase('assess')
            goTop()
          }}
        />
      )}

      {phase === 'assess' && submission && (
        <SelfAssess
          prompt={prompt}
          checks={submission.checks}
          scores={scores}
          onScore={(c, b) => {
            sfx.click()
            setScores((s) => ({ ...s, [c]: b }))
          }}
          onBack={() => {
            setPhase('review')
            goTop()
          }}
          onSeal={seal}
        />
      )}

      {phase === 'done' && submission && attempt && (
        <Results
          info={info}
          prompt={prompt}
          attempt={attempt}
          checks={submission.checks}
          text={submission.text}
          analysis={submission.analysis}
          history={history}
          next={nextSet.id !== prompt.id ? nextSet : undefined}
          onRetry={retry}
        />
      )}

      {confirming && (
        <ConfirmDialog
          words={countWords(text)}
          min={prompt.minWords}
          onCancel={() => setConfirming(false)}
          onConfirm={submit}
        />
      )}

      {timeUp && phase === 'write' && (
        <div className="wr-toast" role="status">
          <p>
            <strong>Time!</strong> In the exam you would put the pen down now. Finish your sentence and hand it in — the
            overtime is noted.
          </p>
          <button type="button" className="wr-toast__close" onClick={() => setTimeUp(false)} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </div>
  )
}

function ConfirmDialog({ words, min, onCancel, onConfirm }: { words: number; min: number; onCancel: () => void; onConfirm: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
  }, [])
  return (
    <dialog
      ref={ref}
      className="wr-dialog wr-dialog--confirm"
      aria-labelledby="wr-confirm-title"
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
    >
      <div className="wr-dialog__inner">
        <p className="wr-eyebrow wr-eyebrow--ink">Before you hand it in</p>
        <h2 id="wr-confirm-title" className="wr-display">
          {words} of {min} words
        </h2>
        <p>
          You are {min - words} words under the minimum. Under-length answers lose marks — but you can still hand it in to see
          your analysis.
        </p>
        <div className="wr-dialog__actions">
          <button type="button" className="wr-btn wr-btn--ink" onClick={onCancel} autoFocus>
            Keep writing
          </button>
          <button type="button" className="wr-btn wr-btn--paper-ghost" onClick={onConfirm}>
            Hand it in anyway
          </button>
        </div>
      </div>
    </dialog>
  )
}
