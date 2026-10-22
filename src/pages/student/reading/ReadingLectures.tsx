import { Link } from 'react-router-dom'
import { useProgress } from '../../../learn/useProgress'
import { LectureStacks } from './LectureStacks'
import { LibraryBackdrop } from './LibraryBackdrop'
import { HUB_PATH, SECTION } from './library'
import './reading.css'
import './hub.css'
import './lecture.css'

/** The Moonlit Library's lectures: the bookcase of volumes. */
export default function ReadingLectures() {
  const progress = useProgress()
  const stats = progress.section(SECTION)

  return (
    <div className="rd-world rd-shelfpage">
      <LibraryBackdrop />
      <div className="rd-lecture__wrap">
        <nav className="rd-crumbs" aria-label="Breadcrumb">
          <Link to={HUB_PATH} className="rd-crumbs__back">
            <span aria-hidden="true">←</span> The Moonlit Library
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Lecture Stacks</span>
        </nav>
        <LectureStacks stats={stats} progress={progress} />
        <p className="rd-shelfpage__next">
          Finished a volume? <Link to={`${HUB_PATH}/practice`}>Put it to the test in the practice catalogue →</Link>
        </p>
      </div>
    </div>
  )
}
