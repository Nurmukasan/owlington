import { useState } from 'react'
import { useUser } from '../../../auth/auth-context'
import { PracticeCatalog, type InProgressNote } from '../../../learn/components/PracticeCatalog'
import { practiceSets } from './content'
import { draftsFor } from './library'

/** The Moonlit Library's practice tests. */
export default function ReadingPracticeList() {
  const user = useUser()
  // Drafts only change on the test page, so reading them once per visit is enough.
  const [inProgress] = useState(() => {
    const drafts = draftsFor(user.id)
    const out: Record<string, InProgressNote> = {}
    for (const p of practiceSets) {
      const d = drafts[p.id]
      if (d) out[p.id] = { label: `${d.answered} of ${p.questionCount} answered`, share: d.answered / Math.max(1, p.questionCount) }
    }
    return out
  })
  return (
    <PracticeCatalog
      section="reading"
      worldName="The Moonlit Library"
      fullFormat="3 passages · 40 questions · 60 minutes"
      inProgress={inProgress}
    />
  )
}
