import { useMemo } from 'react'
import { useUser } from '../../../auth/auth-context'
import { useProgress } from '../../../learn/useProgress'
import { AssignmentTray } from './AssignmentTray'
import type { BandPoint } from './BandChart'
import { lectures, metaFor, practiceSets } from './content'
import { hasContent, loadDraft, type Draft } from './drafts'
import { HubHero, type ContinueAction } from './HubHero'
import { LetterBoard } from './LetterBoard'
import { Manuscript, type ProfessorNote } from './Manuscript'
import { CRITERIA, summarise } from './stats'
import './world.css'
import './hub.css'

const TIPS = [
  'Before you write a word of Task 2, decide your position. Then guard it until the very last line.',
  'An overview needs no numbers. Say what the big picture is — the details can wait for paragraph three.',
  '“However” at the start of every sentence? Hoo-no. Vary your linkers, or let the order of ideas do the work.',
  'Copying the question costs you twice: it shows none of your vocabulary, and copied words are not counted.',
  'Leave five minutes to reread. Plurals, articles and verb endings are where marks quietly escape.',
  'Task 2 is worth twice as much as Task 1 — many night owls write it first.',
  'One idea per paragraph, explained and illustrated. Depth beats a list of half-ideas.',
]

export default function WritingHub() {
  const user = useUser()
  const progress = useProgress()
  const stats = progress.section('writing')
  const summary = useMemo(() => summarise(stats.attempts), [stats.attempts])
  const first = user.name.split(' ')[0] || 'friend'

  // Autosaved drafts are only read on mount; the hub never edits them.
  const drafts = useMemo(() => {
    const out: Record<string, Draft | null> = {}
    for (const set of practiceSets) {
      const d = loadDraft(user.id, set.id)
      out[set.id] = hasContent(d) ? d : null
    }
    return out
  }, [user.id])

  const titleOf = (id: string) => practiceSets.find((p) => p.id === id)?.title ?? 'Writing assignment'
  const attemptsFor = (id: string) => stats.attempts.filter((a) => a.practiceId === id)

  // --- what to do next -------------------------------------------------------------
  const latestDraft = Object.entries(drafts)
    .filter((e): e is [string, Draft] => Boolean(e[1] && e[1].text.trim()))
    .sort((a, b) => (b[1].updatedAt > a[1].updatedAt ? 1 : -1))[0]
  const nextLecture = stats.nextLecture
  const startedLecture = nextLecture && (progress.lecture('writing', nextLecture.id)?.watched ?? 0) > 0.01
  const unattempted = practiceSets.find((p) => !stats.best[p.id])
  const weakest = [...practiceSets].sort((a, b) => {
    const ba = stats.best[a.id]
    const bb = stats.best[b.id]
    return (ba ? ba.score / ba.total : 0) - (bb ? bb.score / bb.total : 0)
  })[0]

  const lectureAction = (l = nextLecture): ContinueAction | undefined =>
    l && {
      kind: 'lecture',
      eyebrow: startedLecture && l === nextLecture ? 'CONTINUE YOUR LETTER' : stats.lecturesCompleted ? 'NEXT LETTER' : 'YOUR FIRST LETTER',
      title: l.title,
      meta: `${l.level} · ${l.minutes} min · ${l.chapters.length} chapters`,
      to: `lecture/${l.id}`,
      cta: startedLecture && l === nextLecture ? 'Keep reading' : 'Open the letter',
    }
  const practiceAction = (p = unattempted ?? weakest): ContinueAction | undefined =>
    p && {
      kind: 'practice',
      eyebrow: stats.best[p.id] ? 'BEAT YOUR BEST' : stats.attempts.length ? 'NEXT ASSIGNMENT' : 'YOUR FIRST ASSIGNMENT',
      title: p.title,
      meta: `${p.kinds.join(' · ')} · ${p.minutes} min · ${metaFor(p.id).minWords}+ words`,
      to: `practice/${p.id}`,
      cta: 'Start writing',
    }

  let next: ContinueAction | undefined
  let secondary: ContinueAction | undefined
  if (latestDraft) {
    const [id, d] = latestDraft
    const words = d.text.trim().split(/\s+/).filter(Boolean).length
    next = {
      kind: 'draft',
      eyebrow: 'YOUR DRAFT IS STILL WARM',
      title: titleOf(id),
      meta: `${words} of ${metaFor(id).minWords} words · ${Math.floor(d.elapsed / 60)} min on the clock`,
      to: `practice/${id}`,
      cta: 'Finish the draft',
    }
    secondary = lectureAction()
  } else if (startedLecture) {
    next = lectureAction()
    secondary = practiceAction()
  } else if (stats.lecturesCompleted > stats.practiceAttempted && unattempted) {
    next = practiceAction(unattempted)
    secondary = lectureAction()
  } else {
    next = lectureAction() ?? practiceAction()
    secondary = next?.kind === 'lecture' ? practiceAction() : undefined
  }
  next ??= practiceAction(practiceSets[0])!

  // --- Professor's note ----------------------------------------------------------------
  const note = useMemo((): ProfessorNote => {
    const latest = summary.latestCriteria
    if (latest) {
      const ranked = CRITERIA.filter((c) => latest[c.id] !== undefined).sort((a, b) => (latest[a.id] ?? 0) - (latest[b.id] ?? 0))
      const low = ranked[0]
      const high = ranked[ranked.length - 1]
      if (low && high && (latest[low.id] ?? 0) < (latest[high.id] ?? 0)) {
        const lecture = lectures.find((l) => l.id === low.lecture)
        return {
          text: `Your ${high.name} is your strongest suit, ${first}. ${low.name} is lagging a little — one letter could lift it by half a band.`,
          to: `lecture/${low.lecture}`,
          cta: `Read “${lecture?.title ?? 'the letter'}”`,
        }
      }
      return {
        text: `Beautifully even across all four criteria, ${first}. Now push one of them higher: try a new prompt type and aim for one more checklist point.`,
        to: `practice/${(unattempted ?? weakest).id}`,
        cta: 'Take on an assignment',
      }
    }
    if (!stats.lecturesCompleted && !stats.attempts.length) {
      return {
        text: `Welcome to the study, ${first}. Start with the first letter — twelve minutes on Task 2 essay types — then try a 20-minute report while it’s fresh.`,
        to: `lecture/${lectures[0].id}`,
        cta: 'Open letter No. I',
      }
    }
    if (!stats.attempts.length) {
      return {
        text: `Lovely reading, ${first}. Now put it into practice: a Task 1 report takes just 20 minutes, and the studio counts your words and linkers as you go.`,
        to: `practice/${practiceSets[0].id}`,
        cta: 'Start a 20-minute report',
      }
    }
    return {
      text: `Good work sealing that essay, ${first}. Read the model answer’s margin notes, then write again — the second draft is where bands move.`,
      to: `practice/${stats.attempts[0].practiceId}`,
      cta: 'Revisit your last essay',
    }
  }, [summary.latestCriteria, stats.lecturesCompleted, stats.attempts, first, unattempted, weakest])

  const points: BandPoint[] = summary.bands.map((b) => ({ ...b, title: titleOf(b.practiceId) }))
  const tips = [
    latestDraft
      ? `Hoo! Your draft of “${titleOf(latestDraft[0])}” is still on the desk, ${first}. Shall we finish it tonight?`
      : `Hoo-hoo, ${first}! Welcome to the Inkwell Study. Click me any time for a writing tip.`,
    ...TIPS,
  ]

  return (
    <div className="wr-world wr-hub">
      <HubHero
        name={user.name}
        next={next}
        secondary={secondary}
        lettersRead={stats.lecturesCompleted}
        lettersTotal={stats.lecturesTotal}
        essays={summary.essays}
        words={summary.words}
        bestBand={summary.bestBand}
        tips={tips}
      />
      <LetterBoard lectures={lectures} progressFor={(id) => progress.lecture('writing', id)} nextId={nextLecture?.id} />
      <AssignmentTray sets={practiceSets} best={stats.best} attemptsFor={attemptsFor} drafts={drafts} />
      <Manuscript
        summary={summary}
        points={points}
        streak={progress.streak}
        today={progress.today}
        sectionXp={stats.xp}
        recent={stats.attempts.slice(0, 3)}
        titleOf={titleOf}
        note={note}
      />
      <footer className="wr-hub__foot">
        <p className="wr-hand">The lamps stay lit till dawn. Come back tomorrow — the ink never dries here.</p>
      </footer>
    </div>
  )
}
