import { useEffect, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { useUser } from '../../../auth/auth-context'
import { useProgress } from '../../../learn/useProgress'
import { LibraryHero } from './LibraryHero'
import { useReducedMotion } from './hooks'
import { LIBRARIAN_TIPS, SECTION, draftsFor, nextStep } from './library'
import './reading.css'
import './hub.css'

/** The Moonlit Library: the Reading section's home. */
export default function ReadingHub() {
  const user = useUser()
  const progress = useProgress()
  const stats = progress.section(SECTION)
  // Read once per visit: drafts only change on the practice page, which saves every
  // answer as it is given (and the time used when you leave).
  const [drafts] = useState(() => draftsFor(user.id))
  const step = nextStep(stats, (id) => progress.lecture(SECTION, id)?.watched ?? 0, drafts)
  const firstName = user.name.split(' ')[0] || 'friend'
  const [tipOfTheNight] = useState(() => LIBRARIAN_TIPS[new Date().getDate() % LIBRARIAN_TIPS.length])
  const { hash } = useLocation()
  const navigationType = useNavigationType()
  const reduced = useReducedMotion()

  // Client-side links such as "Back to the catalogue" carry a #hash the router never scrolls to.
  useEffect(() => {
    const id = hash.slice(1)
    if (!id) {
      if (navigationType !== 'POP') window.scrollTo(0, 0)
      return
    }
    let raf = window.requestAnimationFrame(() => {
      raf = window.requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(id))?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      })
    })
    return () => window.cancelAnimationFrame(raf)
  }, [hash, navigationType, reduced])

  return (
    <div className="rd-world rd-hub">
      <LibraryHero firstName={firstName} stats={stats} progress={progress} step={step} />
      <div className="rd-hub__rooms">
        <footer className="rd-hub__footer">
          <p className="rd-hub__footer-eyebrow">TIP OF THE NIGHT</p>
          <blockquote className="rd-hub__footer-quote">“{tipOfTheNight}”</blockquote>
          <p className="rd-hub__footer-sign">— the Librarian, who never sleeps</p>
        </footer>
      </div>
    </div>
  )
}
