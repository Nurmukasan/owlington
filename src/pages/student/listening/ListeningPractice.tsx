import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useUser } from '../../../auth/auth-context'
import { findPractice } from '../../../learn/catalog'
import { sfx } from '../../../learn/sfx'
import type { PracticeInfo } from '../../../learn/types'
import { useProgress } from '../../../learn/useProgress'
import { formatClock, useStopwatch } from '../../../learn/useTimer'
import { bandForAccuracy } from './answers'
import { Aurora } from './components/Aurora'
import { DjOwl } from './components/DjOwl'
import { lectures, practiceSets } from './content'
import { isPause, PRACTICE_SETS, questionsOf, type PracticeSet } from './practice-data'
import { BroadcastDesk } from './practice/BroadcastDesk'
import { Briefing } from './practice/Briefing'
import { clearDraft, readDraft, saveDraft, type Draft } from './practice/draft'
import { QuestionPaper } from './practice/QuestionPaper'
import { Report, type Result } from './practice/Report'
import { answeredCount, focusQuestion, liveRanges, markAll, type Answers, type AudioSource, type Mode } from './practice/script'
import { autoCast, Broadcast, type Cast, type Driver, type VoiceStatus, useVoices } from './speech'
import { formatFreq, LECTURE_PRACTICE, stationFor, type Station } from './stations'
import './listening.css'
import './practice.css'

// ------------------------------------------------------------- prefs ---

interface Prefs {
  mode: Mode
  rate: number
  audio: AudioSource
}

const PREFS_KEY = 'owlington:listening:prefs'
const DEFAULT_PREFS: Prefs = { mode: 'practice', rate: 1, audio: 'voices' }

/** Per-viewer convenience only: the last mode / speed / audio source chosen. */
function readPrefs(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}') as Partial<Prefs>
    return {
      mode: raw.mode === 'exam' ? 'exam' : 'practice',
      rate: typeof raw.rate === 'number' && raw.rate >= 0.7 && raw.rate <= 1.3 ? raw.rate : 1,
      audio: raw.audio === 'transcript' ? 'transcript' : 'voices',
    }
  } catch {
    return DEFAULT_PREFS
  }
}

function savePrefs(prefs: Prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // storage unavailable: the choice just won't be remembered
  }
}

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'auto' })

// -------------------------------------------------------------- page ---

export default function ListeningPractice() {
  const id = useParams().practiceId
  const info = findPractice('listening', id)
  const set = id ? PRACTICE_SETS[id] : undefined
  if (!info || !set) return <Navigate to="/student/listening" replace />
  return <OnAir key={info.id} info={info} set={set} />
}

type Stage = 'intro' | 'test' | 'results'

function OnAir({ info, set }: { info: PracticeInfo; set: PracticeSet }) {
  const progress = useProgress()
  const stats = progress.section('listening')
  const index = practiceSets.findIndex((p) => p.id === info.id)
  const station = stationFor(info.id, index)
  const { voices, status } = useVoices()

  const [prefs, setPrefs] = useState(readPrefs)
  const update = (patch: Partial<Prefs>) =>
    setPrefs((p) => {
      const next = { ...p, ...patch }
      savePrefs(next)
      return next
    })

  const [custom, setCustom] = useState<Cast>({})
  const cast = useMemo(() => ({ ...autoCast(set.speakers, voices), ...custom }), [set, voices, custom])
  const onCast = (speaker: string, voiceURI: string) =>
    setCustom((c) => ({ ...c, [speaker]: { voiceURI, pitch: cast[speaker]?.pitch ?? 1 } }))

  const driver: Driver = prefs.audio === 'voices' && status === 'ready' ? 'speech' : 'text'

  const userId = useUser().id
  const [stage, setStage] = useState<Stage>('intro')
  const [run, setRun] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<Result | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const submitted = useRef(false)
  const { elapsed, reset } = useStopwatch(stage === 'test')

  // A broadcast left half-way (HUD tab, back button, closed tab) is saved on this device and offered back on the briefing.
  const [draft, setDraft] = useState(() => readDraft(userId, info.id))
  const [resume, setResume] = useState({ elapsed: 0, index: 0 })
  const [position, setPosition] = useState(0)
  const onAir = resume.elapsed + elapsed

  const history = stats.attempts.filter((a) => a.practiceId === info.id)
  const best = stats.best[info.id]
  const questions = questionsOf(set)
  const answered = answeredCount(set, answers)

  const latest = useRef({ answers, onAir, position })
  useEffect(() => {
    latest.current = { answers, onAir, position }
  })
  const persist = useCallback(() => {
    const now = latest.current
    if (submitted.current) return
    if (!answeredCount(set, now.answers) && !now.position) clearDraft(userId, info.id)
    else saveDraft(userId, info.id, { answers: now.answers, elapsed: Math.round(now.onAir), index: now.position, savedAt: Date.now() })
  }, [set, userId, info.id])

  // Save on every answer, every new line of the recording, and every few seconds of the clock.
  const clockTick = Math.floor(onAir / 5)
  useEffect(() => {
    if (stage === 'test') persist()
  }, [stage, answers, position, clockTick, persist])

  // Leaving by any route (back button included) keeps the latest draft.
  useEffect(() => {
    if (stage !== 'test') return
    return () => persist()
  }, [stage, persist])

  // Reloading or closing the tab mid-broadcast asks first (the draft is saved either way).
  useEffect(() => {
    if (stage !== 'test') return
    const warn = (e: BeforeUnloadEvent) => {
      persist()
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [stage, persist])

  // Links that leave the page mid-broadcast (breadcrumb, HUD tabs, logo) ask first. The click is held
  // back, and replayed on the same link if the student chooses to leave, so it works the same under
  // browser and hash routing (no URL parsing: under hash routing every route shares one pathname).
  const held = useRef<HTMLAnchorElement | null>(null)
  const departing = useRef<HTMLAnchorElement | null>(null)
  const replaying = useRef(false)
  useEffect(() => {
    if (stage !== 'test') return
    const onClick = (e: MouseEvent) => {
      if (replaying.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href]') : null
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return
      const raw = link.getAttribute('href') ?? ''
      // in-page jumps (ScrollLink renders "#id"; hash-routed links are "#/route")
      if (raw.startsWith('#') && !raw.startsWith('#/')) return
      if (link.origin !== window.location.origin || link.href === window.location.href) return
      e.preventDefault()
      e.stopPropagation()
      sfx.click()
      held.current = link
      setLeaving(true)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [stage])

  const stay = () => {
    held.current = null
    setLeaving(false)
  }

  const leave = () => {
    departing.current = held.current
    held.current = null
    persist()
    setLeaving(false)
  }

  // Replay the held click once the dialog has closed (the page behind a modal dialog is inert).
  useEffect(() => {
    const link = departing.current
    if (leaving || !link) return
    departing.current = null
    replaying.current = true
    try {
      link.click()
    } finally {
      replaying.current = false
    }
  }, [leaving])

  const goLive = (from?: Draft | null) => {
    sfx.click()
    submitted.current = false
    if (from) {
      setAnswers(from.answers)
      const index = Math.min(from.index, set.script.length - 1)
      setResume({ elapsed: from.elapsed, index })
      setPosition(index)
    } else {
      clearDraft(userId, info.id)
      setDraft(null)
      setAnswers({})
      setResume({ elapsed: 0, index: 0 })
      setPosition(0)
    }
    setResult(null)
    reset()
    setRun((r) => r + 1)
    setStage('test')
    scrollTop()
  }

  const submit = () => {
    if (submitted.current) return
    submitted.current = true
    setConfirming(false)
    clearDraft(userId, info.id)
    setDraft(null)
    const marks = markAll(set, answers)
    const score = marks.filter((m) => m.correct).length
    const total = marks.length
    const durationSec = Math.max(1, Math.round(onAir))
    const prevBest = stats.best[info.id]
    const attempt = progress.recordAttempt('listening', {
      practiceId: info.id,
      score,
      total,
      durationSec,
      band: bandForAccuracy(total ? score / total : 0),
      detail: { answers, mode: prefs.mode, audio: driver },
    })
    setResult({ marks, score, total, attempt, prevBest, durationSec, mode: prefs.mode, transcript: driver === 'text' })
    setStage('results')
    scrollTop()
  }

  const requestSubmit = () => {
    sfx.click()
    if (answered < questions.length) setConfirming(true)
    else submit()
  }

  const retry = () => {
    sfx.click()
    submitted.current = false
    setAnswers({})
    setResult(null)
    setResume({ elapsed: 0, index: 0 })
    setPosition(0)
    reset()
    setStage('intro')
    scrollTop()
  }

  // Next broadcast: the next unattempted station after this one, else simply the next one.
  const after = [...practiceSets.slice(index + 1), ...practiceSets.slice(0, index)]
  const next = after.find((p) => !stats.best[p.id] && p.id !== info.id) ?? after[0]
  const nextIndex = next ? practiceSets.findIndex((p) => p.id === next.id) : -1
  const related = lectures.filter((l) => LECTURE_PRACTICE[l.id] === info.id)
  const lecture = related.find((l) => !progress.lecture('listening', l.id)?.completedAt) ?? related[0]
  const blanks = questions.filter((q) => !(answers[q.n] ?? '').trim()).map((q) => q.n)

  return (
    <div className={`ls-world ls-practice is-${stage}`}>
      <div className="ls-practice__sky" aria-hidden="true">
        <span className="ls-stars" />
        <span className="ls-stars ls-stars--twinkle" />
        <Aurora className="ls-practice__aurora" />
      </div>

      <div className="ls-practice__inner">
        <nav className="ls-crumbs" aria-label="Breadcrumb">
          <Link to="/student/listening">
            <span className="ls-crumbs__back" aria-hidden="true" />
            Owl FM
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/student/listening/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{formatFreq(station.freq)} FM</span>
        </nav>

        {stage === 'intro' && (
          <Briefing
            info={info}
            set={set}
            station={station}
            mode={prefs.mode}
            onMode={(mode) => update({ mode })}
            audio={prefs.audio}
            onAudio={(audio) => update({ audio })}
            rate={prefs.rate}
            onRate={(rate) => update({ rate })}
            voices={voices}
            voiceStatus={status}
            cast={cast}
            history={history}
            best={best}
            draft={draft}
            onStart={() => goLive()}
            onResume={() => goLive(draft)}
          />
        )}

        {stage === 'test' && (
          <LiveTest
            key={run}
            info={info}
            set={set}
            station={station}
            mode={prefs.mode}
            driver={driver}
            voices={voices}
            voiceStatus={status}
            cast={cast}
            onCast={onCast}
            rate={prefs.rate}
            onRate={(rate) => update({ rate })}
            audio={prefs.audio}
            onAudio={(audio) => update({ audio })}
            answers={answers}
            onAnswer={(n, v) => setAnswers((a) => ({ ...a, [n]: v }))}
            onSubmit={requestSubmit}
            elapsed={onAir}
            resumeAt={resume.index}
            onPosition={setPosition}
          />
        )}

        {stage === 'results' && result && (
          <Report
            info={info}
            set={set}
            station={station}
            result={result}
            answers={answers}
            voices={status === 'ready' ? voices : []}
            cast={cast}
            rate={prefs.rate}
            next={next}
            nextIndex={nextIndex}
            lecture={lecture}
            onRetry={retry}
          />
        )}
      </div>

      {stage === 'test' && (
        <ConfirmSubmit
          open={confirming}
          blanks={blanks}
          onCancel={() => setConfirming(false)}
          onConfirm={submit}
          onGoTo={(n) => {
            setConfirming(false)
            window.setTimeout(() => focusQuestion(n), 60)
          }}
        />
      )}
      {stage === 'test' && (
        <StationDialog
          open={leaving}
          id="ls-leave"
          kicker="LEAVING THE STUDIO?"
          title="The broadcast is still on air"
          look={1}
          onCancel={stay}
          actions={
            <>
              <button type="button" className="ls-btn ls-btn--teal" onClick={stay} autoFocus>
                Stay on air
              </button>
              <button type="button" className="ls-btn ls-btn--ghost" onClick={leave}>
                Leave for now
              </button>
            </>
          }
        >
          {answered
            ? `Your ${answered === 1 ? 'answer' : `${answered} answers`} and your place in the recording are saved on this device.`
            : 'Your place in the recording is saved on this device.'}{' '}
          Come back to {formatFreq(station.freq)} FM any time today and pick up where you left off. Nothing is scored until you submit.
        </StationDialog>
      )}
    </div>
  )
}

// ---------------------------------------------------------- live test ---

interface LiveProps {
  info: PracticeInfo
  set: PracticeSet
  station: Station
  mode: Mode
  driver: Driver
  voices: SpeechSynthesisVoice[]
  voiceStatus: VoiceStatus
  cast: Cast
  onCast: (speaker: string, voiceURI: string) => void
  rate: number
  onRate: (rate: number) => void
  audio: AudioSource
  onAudio: (audio: AudioSource) => void
  answers: Answers
  onAnswer: (n: number, value: string) => void
  onSubmit: () => void
  elapsed: number
  /** Script item to pick up from (a resumed broadcast); 0 for a fresh start. */
  resumeAt: number
  onPosition: (index: number) => void
}

const DOCK_STATUS = { idle: 'Standing by', reading: 'Reading time', playing: 'On air', paused: 'Paused', ended: 'Broadcast over' }

function LiveTest(props: LiveProps) {
  const { info, set, station, mode, driver, voices, voiceStatus, cast, rate, answers, onPosition } = props
  const [bc] = useState(() => {
    const b = new Broadcast(set.script, { driver, cast, rate, voices })
    if (props.resumeAt > 0) b.seek(props.resumeAt)
    return b
  })
  const snap = useSyncExternalStore(bc.subscribe, bc.getSnapshot)
  const [captions, setCaptions] = useState(false)
  const ranges = useMemo(() => liveRanges(set.script), [set])
  const live = snap.phase === 'idle' ? null : ranges[snap.index]
  const title = info.title.replace(/^Part \d · /, '')
  const answered = answeredCount(set, answers)
  const total = questionsOf(set).length
  const item = set.script[snap.index]
  const speaker = item && !isPause(item) ? set.speakers.find((s) => s.id === item.s) : undefined
  const running = snap.phase === 'playing' || snap.phase === 'reading'

  useEffect(() => () => bc.destroy(), [bc])
  useEffect(() => {
    bc.configure({ cast, voices, rate })
  }, [bc, cast, voices, rate])
  useEffect(() => {
    bc.setDriver(driver)
  }, [bc, driver])
  useEffect(() => {
    if (snap.phase !== 'idle') onPosition(snap.index)
  }, [snap.index, snap.phase, onPosition])

  const chooseAudio = (audio: AudioSource) => {
    props.onAudio(audio)
    bc.setDriver(audio === 'voices' && voiceStatus === 'ready' ? 'speech' : 'text')
  }

  const dockStatus =
    snap.phase === 'reading'
      ? `Reading time · ${formatClock(Math.ceil(snap.waitLeft))}`
      : snap.phase === 'playing' && speaker
        ? `${speaker.name} speaking`
        : DOCK_STATUS[snap.phase]

  return (
    <div className={`ls-live is-${snap.phase}`}>
      <header className="ls-live__bar">
        <h1 className="ls-live__title">
          <span className="ls-live__freq">{formatFreq(station.freq)} FM</span> {title}
        </h1>
        <p className="ls-live__meta">
          <span className={`ls-live__mode ${mode === 'exam' ? 'is-exam' : ''}`}>{mode === 'exam' ? 'Exam mode' : 'Practice mode'}</span>
          <span className="ls-live__clock" aria-label={`Time on air ${formatClock(props.elapsed)}`}>
            {formatClock(props.elapsed)}
          </span>
        </p>
      </header>

      <div className="ls-live__grid">
        <div className="ls-live__deck">
          <BroadcastDesk
            bc={bc}
            snap={snap}
            set={set}
            freq={formatFreq(station.freq)}
            part={station.part}
            mode={mode}
            voices={voices}
            voiceStatus={voiceStatus}
            cast={cast}
            onCast={props.onCast}
            rate={rate}
            onRate={props.onRate}
            audio={props.audio}
            onAudio={chooseAudio}
            captions={captions}
            onCaptions={setCaptions}
            elapsed={props.elapsed}
            minutes={info.minutes}
            onGoTo={focusQuestion}
          />
        </div>
        <QuestionPaper
          set={set}
          part={station.part}
          title={title}
          answers={answers}
          onAnswer={props.onAnswer}
          mode={mode}
          live={live}
          onSubmit={props.onSubmit}
        />
      </div>

      {/* phones: a dock with the essentials while you scroll the paper */}
      <div className="ls-dock" role="region" aria-label="Broadcast status">
        {mode === 'practice' || snap.phase === 'idle' || snap.phase === 'paused' ? (
          <button
            type="button"
            className={`ls-dock__play ${running ? 'is-on' : ''}`}
            onClick={() => {
              sfx.click()
              if (snap.phase === 'idle') bc.play()
              else bc.toggle()
            }}
            aria-label={running ? 'Pause' : snap.phase === 'paused' ? 'Resume' : 'Play'}
          >
            <span className={`ls-tbtn__icon ${running ? 'ls-tbtn__icon--pause' : 'ls-tbtn__icon--play'}`} aria-hidden="true" />
          </button>
        ) : (
          <span className={`ls-dock__lamp ${running ? 'is-on' : ''}`} aria-hidden="true" />
        )}
        <span className="ls-dock__status" aria-live="off">
          {dockStatus}
        </span>
        <span className="ls-dock__count">
          {answered}/{total}
        </span>
        <button type="button" className="ls-btn ls-btn--teal ls-btn--small ls-dock__submit" onClick={props.onSubmit}>
          Submit
        </button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------ confirm ---

interface ConfirmProps {
  open: boolean
  blanks: number[]
  onCancel: () => void
  onConfirm: () => void
  onGoTo: (n: number) => void
}

function ConfirmSubmit({ open, blanks, onCancel, onConfirm, onGoTo }: ConfirmProps) {
  const list = blanks.length > 4 ? `${blanks.slice(0, 4).join(', ')} and ${blanks.length - 4} more` : blanks.join(', ')
  return (
    <StationDialog
      open={open}
      id="ls-confirm"
      kicker="BEFORE YOU SIGN OFF"
      title={blanks.length === 1 ? 'One answer is still blank' : `${blanks.length} answers are still blank`}
      look={-1}
      onCancel={onCancel}
      actions={
        <>
          <button type="button" className="ls-btn ls-btn--teal" onClick={() => onGoTo(blanks[0])} autoFocus>
            Go to Q{blanks[0]}
          </button>
          <button type="button" className="ls-btn ls-btn--ghost" onClick={onConfirm}>
            Submit anyway
          </button>
        </>
      }
    >
      {blanks.length === 1 ? 'Question' : 'Questions'} {list}. A blank never scores, but a sensible guess might. Fill{' '}
      {blanks.length === 1 ? 'it' : 'them'} in with your best guess, or submit as it is.
    </StationDialog>
  )
}

interface DialogProps {
  open: boolean
  id: string
  kicker: string
  title: string
  look: -1 | 0 | 1
  onCancel: () => void
  actions: ReactNode
  children: ReactNode
}

/** A modal styled as a note from DJ Hoot (native <dialog>: focus trap and Esc come for free). */
function StationDialog({ open, id, kicker, title, look, onCancel, actions, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog ref={ref} className="ls-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-text`} onClose={onCancel}>
      <div className="ls-dialog__body">
        <span className="ls-dialog__owl" aria-hidden="true">
          <DjOwl scale={4} look={look} />
        </span>
        <div>
          <p className="ls-kicker">{kicker}</p>
          <h2 className="ls-dialog__title" id={`${id}-title`}>
            {title}
          </h2>
          <p className="ls-dialog__text" id={`${id}-text`}>
            {children}
          </p>
        </div>
      </div>
      <div className="ls-dialog__actions">{actions}</div>
    </dialog>
  )
}
