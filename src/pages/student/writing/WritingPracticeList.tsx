import { useState } from 'react'
import { useUser } from '../../../auth/auth-context'
import { PracticeCatalog, type InProgressNote } from '../../../learn/components/PracticeCatalog'
import { metaFor, practiceSets } from './content'
import { hasContent, loadDraft } from './drafts'
import { countWords } from './words'

/** The Inkwell Study's assignments. */
export default function WritingPracticeList() {
  const user = useUser()
  // Drafts only change in the studio, so reading them once per visit is enough.
  const [inProgress] = useState(() => {
    const out: Record<string, InProgressNote> = {}
    for (const p of practiceSets) {
      const d = loadDraft(user.id, p.id)
      if (!hasContent(d) || !d) continue
      const words = countWords(d.text)
      const min = metaFor(p.id).minWords
      out[p.id] = { label: `draft · ${words} of ${min} words`, share: Math.min(1, words / min) }
    }
    return out
  })
  return (
    <PracticeCatalog
      section="writing"
      worldName="The Inkwell Study"
      fullFormat="Task 1 and Task 2 together in 60 minutes"
      inProgress={inProgress}
    />
  )
}
