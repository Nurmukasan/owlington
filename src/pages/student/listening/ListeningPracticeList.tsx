import { useState } from 'react'
import { useUser } from '../../../auth/auth-context'
import { PracticeCatalog, type InProgressNote } from '../../../learn/components/PracticeCatalog'
import { practiceSets } from './content'
import { readDraft } from './practice/draft'

/** Owl FM's practice broadcasts. */
export default function ListeningPracticeList() {
  const user = useUser()
  // Drafts only change on the test page, so reading them once per visit is enough.
  const [inProgress] = useState(() => {
    const out: Record<string, InProgressNote> = {}
    for (const p of practiceSets) {
      const d = readDraft(user.id, p.id)
      if (!d) continue
      const answered = Object.values(d.answers).filter((v) => String(v ?? '').trim()).length
      out[p.id] = { label: `${answered} of ${p.questionCount} answered`, share: answered / Math.max(1, p.questionCount) }
    }
    return out
  })
  return (
    <PracticeCatalog
      section="listening"
      worldName="Owl FM"
      fullFormat="4 parts · 40 questions · about 30 minutes, each recording played once"
      inProgress={inProgress}
    />
  )
}
