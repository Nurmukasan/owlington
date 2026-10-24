import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../../auth/auth-context'
import { ProgressRing } from '../../../learn/components/ProgressWidgets'
import { TalkingOwl } from '../../../learn/components/TalkingOwl'
import { floatText, pixelConfetti } from '../../../learn/fx'
import type { Attempt } from '../../../learn/progress'
import { profileResultPath } from '../../../learn/results/results'
import { sfx } from '../../../learn/sfx'
import type { PracticeInfo } from '../../../learn/types'
import { useProgress } from '../../../learn/useProgress'
import { analyse, countWords, type CheckResult, type Criterion, type TextAnalysis } from './analysis'
import { WaxSeal } from './art'
import { AnalysisView, InkedEssay, SelfAssess } from './Assessment'
import { clearDraft, hasContent, loadDraft, saveDraft } from './drafts'
import { History } from './History'
import { fullBand, type FullWritingTest } from './library'
import { checkEssay, estimateBand, type WritingPrompt } from './prompts'
import { ChecklistReview, ModelAnswer } from './Results'
import { CRITERIA, formatBand, formatDate } from './stats'
import { PromptCard, Studio } from './Studio'
import { ConfirmDialog } from './WritingPractice'
import { handInFloor, plural } from './words'

/** The real exam: one hour for both tasks. */
const LIMIT = 60 * 60

type Phase = 'intro' | 'write' | 'review' | 'assess' | 'done'
type Scores = Partial<Record<Criterion, number>>

interface Submission {
  text: string
  analysis: TextAnalysis
  checks: CheckResult[]
}

const TASK_NAMES = ['Task 1', 'Task 2'] as const

/**
 * A full Writing paper: Task 1 and Task 2 against one 60-minute clock. The
 * student moves freely between the two papers, hands both in together, reviews
 * and grades each one, and gets an overall band in which Task 2 counts double.
 */
export function FullPractice({ info, test }: { info: PracticeInfo; test: FullWritingTest }) {
  const user = useUser()
  const progress = useProgress()
  const prompts = useMemo(() => [test.task1, test.task2] as const, [test])
  const keys = useMemo(() => [`${test.id}/t1`, `${test.id}/t2`], [test.id])
  const history = progress.section('writing').attempts.filter((a) => a.practiceId === test.id)

  const [initial] = useState(() =>
    keys.map((k) => {
      const d = loadDraft(user.id, k)
      return hasContent(d) ? d : null
    }),
  )
  const [phase, setPhase] = useState<Phase>('intro')
  const [active, setActive] = useState(0)
  const [texts, setTexts] = useState<string[]>(() => initial.map((d) => d?.text ?? ''))
  const [plans, setPlans] = useState<string[][]>(() => prompts.map((p, i) => p.plan.map((_, k) => initial[i]?.plan[k] ?? '')))
  const [banked, setBanked] = useState(() => Math.max(initial[0]?.elapsed ?? 0, initial[1]?.elapsed ?? 0))
  const totalRef = useRef(banked)
  const [paused, setPaused] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(initial[0]?.updatedAt ?? initial[1]?.updatedAt ?? null)
  const [subs, setSubs] = useState<Submission[] | null>(null)
  const [durationSec, setDurationSec] = useState(0)
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<Scores[]>([{}, {}])
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [confirming, setConfirming] = useState<number | null>(null)
  const [timeUp, setTimeUp] = useState(false)
  const timeUpNoted = useRef(false)
  const recorded = useRef(false)

  const floors = prompts.map((p) => handInFloor(p.minWords))
  const words = texts.map(countWords)
  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // --- autosave (each task keeps its own draft; both carry the shared clock) ---
  const persist = useCallback(
    (ts: string[], ps: string[][]) => {
      const at = new Date().toISOString()
      let saved = false
      ts.forEach((t, i) => {
        if (!t.trim() && !ps[i].some((x) => x.trim())) return
        saved = saveDraft(user.id, keys[i], { text: t, plan: ps[i], elapsed: Math.round(totalRef.current), updatedAt: at }) || saved
      })
      if (saved) setSavedAt(at)
    },
    [user.id, keys],
  )
  useEffect(() => {
    if (phase !== 'write') return
    const id = window.setTimeout(() => persist(texts, plans), 700)
    return () => window.clearTimeout(id)
  }, [texts, plans, phase, persist])
  const latest = useRef({ texts, plans })
  useEffect(() => {
    latest.current = { texts, plans }
  }, [texts, plans])
  useEffect(() => {
    if (phase !== 'write') return
    const save = () => persist(latest.current.texts, latest.current.plans)
    const id = window.setInterval(save, 15000)
    window.addEventListener('pagehide', save)
    document.addEventListener('visibilitychange', save)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('pagehide', save)
      document.removeEventListener('visibilitychange', save)
      save()
    }
  }, [phase, persist])

  const onTimeUp = useCallback(() => {
    if (timeUpNoted.current) return
    timeUpNoted.current = true
    setTimeUp(true)
  }, [])

  // --- actions ---
  const reset = () => {
    keys.forEach((k) => clearDraft(user.id, k))
    setTexts(['', ''])
    setPlans(prompts.map((p) => p.plan.map(() => '')))
    setBanked(0)
    totalRef.current = 0
    setSavedAt(null)
    timeUpNoted.current = false
    setTimeUp(false)
  }

  const start = (fresh: boolean) => {
    sfx.page()
    if (fresh) reset()
    setActive(0)
    setPaused(false)
    setPhase('write')
    goTop()
  }

  /** The studio remounts per task, so the clock is banked before switching. */
  const switchTo = (i: number) => {
    if (i === active) return
    sfx.page()
    setBanked(totalRef.current)
    setActive(i)
    goTop()
  }

  const submit = (confirmed = false) => {
    if (words.some((w, i) => w < floors[i])) return
    const short = words.findIndex((w, i) => w < prompts[i].minWords)
    if (short >= 0 && !confirmed) {
      sfx.click()
      setConfirming(short)
      return
    }
    setConfirming(null)
    sfx.page()
    persist(texts, plans)
    setSubs(
      prompts.map((p, i) => {
        const analysis = analyse(texts[i], p.question)
        return { text: texts[i], analysis, checks: checkEssay(p, texts[i], analysis) }
      }),
    )
    setDurationSec(Math.round(totalRef.current))
    setStep(0)
    setPhase('review')
    goTop()
  }

  const keepWriting = (i: number) => {
    sfx.page()
    setBanked(totalRef.current)
    setSubs(null)
    setActive(i)
    setPhase('write')
    goTop()
  }

  const seal = () => {
    if (!subs || recorded.current) return
    const bands = scores.map((s) => estimateBand(Object.values(s).filter((v): v is number => typeof v === 'number')))
    if (scores.some((s) => Object.keys(s).length < 4)) return
    recorded.current = true
    const band = fullBand(bands[0], bands[1])
    const met = subs.flatMap((s) => s.checks.filter((c) => c.met))
    const combined: Scores = {}
    for (const c of CRITERIA) combined[c.id] = fullBand(scores[0][c.id] ?? 0, scores[1][c.id] ?? 0)
    const result = progress.recordAttempt('writing', {
      practiceId: test.id,
      score: met.length,
      total: subs.reduce((n, s) => n + s.checks.length, 0),
      durationSec,
      band,
      words: subs[0].analysis.words + subs[1].analysis.words,
      criteria: [
        { label: 'Task 1', band: bands[0] },
        { label: 'Task 2', band: bands[1] },
      ],
      items: subs.flatMap((s, t) =>
        s.checks.map((c, i) => ({
          n: t * s.checks.length + i + 1,
          type: `${TASK_NAMES[t]} · ${CRITERIA.find((k) => k.id === c.criterion)?.name ?? c.criterion}`,
          label: c.label,
          correct: c.met,
          given: c.found,
        })),
      ),
      detail: {
        words: subs[0].analysis.words + subs[1].analysis.words,
        text: `TASK 1\n\n${subs[0].text.trim()}\n\nTASK 2\n\n${subs[1].text.trim()}`,
        criteria: combined,
        met: met.map((c) => c.id),
        tasks: bands,
      },
    })
    keys.forEach((k) => clearDraft(user.id, k))
    setAttempt(result)
    setPhase('done')
    goTop()
  }

  const retry = () => {
    reset()
    recorded.current = false
    setSubs(null)
    setScores([{}, {}])
    setAttempt(null)
    setActive(0)
    setPaused(false)
    setPhase('write')
    goTop()
  }

  const prompt = prompts[active]
  const ready = words.every((w, i) => w >= floors[i])
  const shortBy = words.map((w, i) => Math.max(0, floors[i] - w))
  const handInNote = ready
    ? ''
    : shortBy[0] && shortBy[1]
      ? `at ${shortBy[0]} + ${shortBy[1]} more words`
      : `${TASK_NAMES[shortBy[0] ? 0 : 1]}: ${shortBy[0] || shortBy[1]} more words`

  return (
    <div className={`wr-world wr-practice wr-practice--${phase} wr-full`}>
      {phase === 'intro' && (
        <FullIntro
          info={info}
          test={test}
          history={history}
          draft={texts.some((t) => t.trim()) ? { words, elapsed: banked } : null}
          onStart={start}
        />
      )}

      {phase === 'write' && (
        <Studio
          key={active}
          info={info}
          prompt={prompt}
          studentName={user.name}
          text={texts[active]}
          onText={(t) => setTexts((ts) => ts.map((x, i) => (i === active ? t : x)))}
          plan={plans[active]}
          onPlan={(k, v) => setPlans((ps) => ps.map((p, i) => (i === active ? p.map((x, j) => (j === k ? v : x)) : p)))}
          banked={banked}
          totalRef={totalRef}
          onTimeUp={onTimeUp}
          paused={paused}
          onTogglePause={() => {
            sfx.click()
            setPaused((p) => !p)
          }}
          savedAt={savedAt}
          floor={floors[active]}
          onSubmit={() => submit()}
          wordBump={0}
          limitSec={LIMIT}
          handIn={{ ok: ready, note: handInNote }}
          switcher={
            <div className="wr-switch" role="group" aria-label="Choose a task">
              {prompts.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`wr-switch__tab ${i === active ? 'is-on' : ''} ${words[i] >= p.minWords ? 'is-met' : ''}`}
                  aria-pressed={i === active}
                  onClick={() => switchTo(i)}
                >
                  {TASK_NAMES[i]}
                  <span>
                    {words[i]}/{p.minWords}
                  </span>
                </button>
              ))}
            </div>
          }
        />
      )}

      {phase === 'review' && subs && (
        <AnalysisView
          key={`r${step}`}
          prompt={prompts[step]}
          text={subs[step].text}
          analysis={subs[step].analysis}
          checks={subs[step].checks}
          durationSec={durationSec}
          step={`Full test · ${TASK_NAMES[step]} · under the lamp`}
          backLabel={step === 0 ? 'Keep writing' : 'Back to Task 1'}
          nextLabel={step === 0 ? 'Next: examine Task 2' : 'Next: grade yourself'}
          onBack={() => {
            if (step === 0) keepWriting(0)
            else {
              setStep(0)
              goTop()
            }
          }}
          onNext={() => {
            sfx.page()
            if (step === 0) setStep(1)
            else {
              setStep(0)
              setPhase('assess')
            }
            goTop()
          }}
        />
      )}

      {phase === 'assess' && subs && (
        <SelfAssess
          key={`a${step}`}
          prompt={prompts[step]}
          checks={subs[step].checks}
          scores={scores[step]}
          step={`Full test · ${TASK_NAMES[step]} · be your own examiner`}
          sealLabel={step === 0 ? 'Next: grade Task 2 →' : 'Seal the whole paper'}
          onScore={(c, b) => {
            sfx.click()
            setScores((s) => s.map((x, i) => (i === step ? { ...x, [c]: b } : x)))
          }}
          onBack={() => {
            if (step === 0) {
              setStep(1)
              setPhase('review')
            } else setStep(0)
            goTop()
          }}
          onSeal={() => {
            if (step === 0) {
              sfx.page()
              setStep(1)
              goTop()
            } else seal()
          }}
        />
      )}

      {phase === 'done' && subs && attempt && (
        <FullResults info={info} prompts={prompts} subs={subs} scores={scores} attempt={attempt} history={history} onRetry={retry} />
      )}

      {confirming !== null && (
        <ConfirmDialog
          words={words[confirming]}
          min={prompts[confirming].minWords}
          noun={confirming === 0 ? 'Task 1 answer' : 'Task 2 essay'}
          onCancel={() => {
            setConfirming(null)
            if (phase === 'write' && active !== confirming) switchTo(confirming)
          }}
          onConfirm={() => submit(true)}
        />
      )}

      {timeUp && phase === 'write' && (
        <div className="wr-toast" role="status">
          <p>
            <strong>Time!</strong> The hour is up. In the exam both papers would be collected now — finish your sentence and hand in.
          </p>
          <button type="button" className="wr-toast__close" onClick={() => setTimeUp(false)} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ intro ---

interface FullIntroProps {
  info: PracticeInfo
  test: FullWritingTest
  history: Attempt[]
  draft: { words: number[]; elapsed: number } | null
  onStart: (fresh: boolean) => void
}

function FullIntro({ info, test, history, draft, onStart }: FullIntroProps) {
  const best = history.reduce<number | null>((b, a) => (typeof a.band === 'number' && (b === null || a.band > b) ? a.band : b), null)
  return (
    <div className="wr-fullintro">
      <header className="wr-exam__head">
        <p className="wr-eyebrow">IELTS Academic Writing · full test</p>
        <h1 className="wr-exam__title wr-display">{info.title}</h1>
        <p className="wr-exam__lead">
          Two tasks, one hour, exactly as in the exam. Spend about 20 minutes on Task 1 and 40 on Task 2 — Task 2 counts twice as
          much towards your band. Switch between the papers whenever you like; both are handed in together.
        </p>
        <ul className="wr-fullintro__facts">
          <li>
            <b>60</b> minutes
          </li>
          <li>
            <b>150 + 250</b> words minimum
          </li>
          <li>
            <b>{history.length}</b> {history.length === 1 ? 'attempt' : 'attempts'}
            {best !== null && <> · best {formatBand(best)}</>}
          </li>
        </ul>
      </header>
      <div className="wr-fullintro__tasks">
        {[test.task1, test.task2].map((p) => (
          <div key={p.id} className="wr-intro__sheet">
            <span className="wr-stamp wr-intro__stamp">
              {p.task === 'task2' ? 'TASK 2' : 'TASK 1'} · {p.minutes} MIN · {p.minWords}+ WORDS
            </span>
            <PromptCard prompt={p} compact />
          </div>
        ))}
      </div>
      <div className="wr-fullintro__actions">
        {draft ? (
          <>
            <button type="button" className="wr-btn wr-btn--wax" onClick={() => onStart(false)}>
              Resume ({draft.words[0]} + {draft.words[1]} words, {Math.floor(draft.elapsed / 60)} min used)
            </button>
            <button type="button" className="wr-btn wr-btn--ghost" onClick={() => onStart(true)}>
              Start again from a blank paper
            </button>
          </>
        ) : (
          <button type="button" className="wr-btn wr-btn--wax" onClick={() => onStart(true)}>
            Start the clock <span className="wr-btn__arrow" aria-hidden="true">→</span>
          </button>
        )}
        <Link to="/student/writing/practice" className="wr-btn wr-btn--ghost">
          All assignments
        </Link>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- results ---

interface FullResultsProps {
  info: PracticeInfo
  prompts: readonly [WritingPrompt, WritingPrompt]
  subs: Submission[]
  scores: Scores[]
  attempt: Attempt
  history: Attempt[]
  onRetry: () => void
}

type Tab = 'c1' | 'm1' | 'c2' | 'm2' | 'essay' | 'history'

function FullResults({ info, prompts, subs, scores, attempt, history, onRetry }: FullResultsProps) {
  const [tab, setTab] = useState<Tab>('c1')
  const sealRef = useRef<HTMLDivElement>(null)
  const bands = scores.map((s) => estimateBand(Object.values(s).filter((v): v is number => typeof v === 'number')))
  const accuracy = attempt.total ? attempt.score / attempt.total : 0
  const celebrated = useRef(false)

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
    { id: 'c1', label: `Task 1 checklist · ${subs[0].checks.filter((c) => c.met).length}/${subs[0].checks.length}` },
    { id: 'm1', label: 'Task 1 model' },
    { id: 'c2', label: `Task 2 checklist · ${subs[1].checks.filter((c) => c.met).length}/${subs[1].checks.length}` },
    { id: 'm2', label: 'Task 2 model' },
    { id: 'essay', label: 'Your answers' },
    { id: 'history', label: `History · ${history.length}` },
  ]
  const owl =
    bands[1] < bands[0]
      ? 'Your Task 2 band is the lower one — and it counts double. Put your next hour of practice there.'
      : bands[0] < bands[1]
        ? 'Task 1 is holding you back a little. A sharper overview and more precise data would lift the whole paper.'
        : 'Both tasks are level — a well-balanced paper. Read the two model answers for the next half band.'

  return (
    <div className="wr-results">
      <section className="wr-sealed" aria-labelledby="wr-sealed-title">
        <div className="wr-sealed__paper" aria-hidden="true">
          <div className="wr-sealed__text">
            <p className="wr-sealed__head">
              <span>{info.title}</span>
              <span>{attempt.detail && typeof attempt.detail === 'object' ? subs[0].analysis.words + subs[1].analysis.words : 0} words</span>
            </p>
            {[subs[0].text, subs[1].text].map((t, i) => (
              <p key={i}>{t.trim().split(/\n+/)[0]}</p>
            ))}
          </div>
          <div ref={sealRef} className="wr-sealed__stamp">
            <WaxSeal size={168} />
            <span className="wr-sealed__band">{attempt.band ? formatBand(attempt.band) : '–'}</span>
          </div>
        </div>
        <div className="wr-sealed__copy">
          <p className="wr-eyebrow">Full test · sealed · {formatDate(attempt.at)}</p>
          <h1 id="wr-sealed-title" className="wr-sealed__title wr-display">
            The whole paper, sealed.
          </h1>
          <p className="wr-sealed__band-line">
            Estimated Writing band <strong>{attempt.band ? formatBand(attempt.band) : '—'}</strong>
            <span className="wr-sealed__disclaimer">Task 2 counts double · self-assessed estimate, not an official score</span>
          </p>
          <ul className="wr-sealed__criteria" aria-label="Band per task">
            <li>
              <span>Task 1</span>
              <b>{formatBand(bands[0])}</b>
            </li>
            <li>
              <span>Task 2</span>
              <b>{formatBand(bands[1])}</b>
            </li>
          </ul>
          <div className="wr-sealed__row">
            <ProgressRing
              value={accuracy}
              size={112}
              stroke={10}
              color="var(--wr-coral)"
              track="rgb(255 255 255 / 0.12)"
              segments={10}
              label={`Checklists: ${attempt.score} of ${attempt.total} points met`}
              className="wr-sealed__ring"
            >
              <span className="wr-sealed__score">
                {attempt.score}
                <small>/{attempt.total}</small>
              </span>
            </ProgressRing>
            <div className="wr-sealed__xp">
              <span className="wr-sealed__xp-n">+{attempt.xp}</span>
              <span className="wr-sealed__xp-l">XP earned</span>
              <span className="wr-sealed__xp-s">{plural(subs[0].analysis.words + subs[1].analysis.words, 'word')} added to your total</span>
            </div>
            <div className="wr-sealed__owl">
              <TalkingOwl happy={accuracy >= 0.5} scale={4} />
              <p className="wr-sealed__says">{owl}</p>
            </div>
          </div>
          <div className="wr-sealed__actions">
            <button type="button" className="wr-btn" onClick={onRetry}>
              Sit it again
            </button>
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
        {tabs.map((t) => (
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
          >
            {t.label}
          </button>
        ))}
      </div>
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
          {t.id === 'c1' && <ChecklistReview checks={subs[0].checks} />}
          {t.id === 'm1' && <ModelAnswer prompt={prompts[0]} />}
          {t.id === 'c2' && <ChecklistReview checks={subs[1].checks} />}
          {t.id === 'm2' && <ModelAnswer prompt={prompts[1]} />}
          {t.id === 'essay' &&
            subs.map((s, i) => (
              <div key={i} className="wr-sheetpaper wr-sheetpaper--essay">
                <p className="wr-sheetpaper__meta">
                  {TASK_NAMES[i]} · {s.analysis.words} words · {s.analysis.paragraphs.length} paragraphs · band {formatBand(bands[i])}
                </p>
                <InkedEssay text={s.text} overused={s.analysis.overused.map((o) => o.phrase)} />
              </div>
            ))}
          {t.id === 'history' && <History attempts={history} title={`Every sitting of “${info.title}”`} light noun="paper" />}
        </div>
      ))}
    </div>
  )
}
