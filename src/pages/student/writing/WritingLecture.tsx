import { useParams } from 'react-router-dom'
import { LecturePlayer } from '../../../learn/components/LecturePlayer'
import { findLecture } from '../../../learn/catalog'

/** PLACEHOLDER — replaced by the Writing section build. */
export default function WritingLecture() {
  const lecture = findLecture('writing', useParams().lectureId)
  if (!lecture) return null
  return (
    <div style={{ padding: 'calc(var(--hud-space) + 24px) 24px', maxWidth: 960, margin: '0 auto' }}>
      <LecturePlayer section="writing" lecture={lecture} />
    </div>
  )
}
