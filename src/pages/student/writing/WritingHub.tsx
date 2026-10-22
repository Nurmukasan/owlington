import { useMemo } from 'react'
import { useUser } from '../../../auth/auth-context'
import { useProgress } from '../../../learn/useProgress'
import { practiceSets } from './content'
import { hasContent, loadDraft, type Draft } from './drafts'
import { HubHero } from './HubHero'
import { summarise } from './stats'
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

/** The Inkwell Study: the Writing section's home. */
export default function WritingHub() {
  const user = useUser()
  const progress = useProgress()
  const stats = progress.section('writing')
  const summary = useMemo(() => summarise(stats.attempts), [stats.attempts])
  const first = user.name.split(' ')[0] || 'friend'

  // Autosaved drafts are only read on mount; the hub never edits them.
  const latestDraft = useMemo(() => {
    const drafts: [string, Draft][] = []
    for (const set of practiceSets) {
      const d = loadDraft(user.id, set.id)
      if (d && hasContent(d) && d.text.trim()) drafts.push([set.id, d])
    }
    return drafts.sort((a, b) => (b[1].updatedAt > a[1].updatedAt ? 1 : -1))[0]
  }, [user.id])
  const titleOf = (id: string) => practiceSets.find((p) => p.id === id)?.title ?? 'Writing assignment'

  const tips = [
    latestDraft
      ? `Hoo! Your draft of “${titleOf(latestDraft[0])}” is still on the desk, ${first}. Shall we finish it tonight?`
      : `Hoo-hoo, ${first}! Welcome to the Inkwell Study. Click me any time for a writing tip.`,
    ...TIPS,
  ]

  return (
    <div className="wr-world wr-hub">
      <HubHero
        lettersRead={stats.lecturesCompleted}
        lettersTotal={stats.lecturesTotal}
        essays={summary.essays}
        words={summary.words}
        bestBand={summary.bestBand}
        tips={tips}
      />
      <footer className="wr-hub__foot">
        <p className="wr-hand">The lamps stay lit till dawn. Come back tomorrow — the ink never dries here.</p>
      </footer>
    </div>
  )
}
