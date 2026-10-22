import { Link } from 'react-router-dom'
import { useProgress } from '../../../learn/useProgress'
import { lectures } from './content'
import { LetterBoard } from './LetterBoard'
import './world.css'
import './hub.css'

/** The Inkwell Study's lectures: letters pinned to the corkboard. */
export default function WritingLectures() {
  const progress = useProgress()
  const stats = progress.section('writing')

  return (
    <div className="wr-world wr-hub wr-letterpage">
      <nav className="wr-section wr-letterpage__crumbs" aria-label="Breadcrumb">
        <Link to="/student/writing" className="wr-backlink">
          <span aria-hidden="true">←</span> The Inkwell Study
        </Link>
      </nav>
      <LetterBoard lectures={lectures} progressFor={(id) => progress.lecture('writing', id)} nextId={stats.nextLecture?.id} />
      <footer className="wr-hub__foot">
        <p className="wr-hand">
          Letter read? <Link to="/student/writing/practice">Try what it taught on an assignment →</Link>
        </p>
      </footer>
    </div>
  )
}
