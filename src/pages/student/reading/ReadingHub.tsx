import { useState } from 'react'
import { useUser } from '../../../auth/auth-context'
import { useProgress } from '../../../learn/useProgress'
import { CardCatalogue } from './CardCatalogue'
import { LectureStacks } from './LectureStacks'
import { LibraryHero } from './LibraryHero'
import { ReadingLog } from './ReadingLog'
import { LIBRARIAN_TIPS, SECTION, draftsFor, nextStep } from './library'
import './reading.css'
import './hub.css'

/** The Moonlit Library: the Reading section's home. */
export default function ReadingHub() {
  const user = useUser()
  const progress = useProgress()
  const stats = progress.section(SECTION)
  // Read once per visit: drafts only change on the practice page.
  const [drafts] = useState(() => draftsFor(user.id))
  const step = nextStep(stats, (id) => progress.lecture(SECTION, id)?.watched ?? 0, drafts)
  const firstName = user.name.split(' ')[0] || 'friend'
  const [tipOfTheNight] = useState(() => LIBRARIAN_TIPS[new Date().getDate() % LIBRARIAN_TIPS.length])

  return (
    <div className="rd-world rd-hub">
      <LibraryHero firstName={firstName} stats={stats} progress={progress} step={step} />
      <div className="rd-hub__rooms">
        <LectureStacks stats={stats} progress={progress} />
        <CardCatalogue stats={stats} drafts={drafts} />
        <ReadingLog readerName={user.name} stats={stats} progress={progress} step={step} />
        <footer className="rd-hub__footer">
          <p className="rd-hub__footer-eyebrow">TIP OF THE NIGHT</p>
          <blockquote className="rd-hub__footer-quote">“{tipOfTheNight}”</blockquote>
          <p className="rd-hub__footer-sign">— the Librarian, who never sleeps</p>
        </footer>
      </div>
    </div>
  )
}
