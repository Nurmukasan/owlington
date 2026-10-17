import type { CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PixelSprite } from '../../components/PixelSprite'
import { getSection } from '../../data/sections'

/**
 * Video lectures for one IELTS section.
 * Placeholder for now — the lecture library gets designed next.
 */
export default function SectionPage() {
  const { section: id } = useParams()
  const section = getSection(id)
  if (!section) return <Navigate to="/student" replace />

  return (
    <section className="panel pixel-panel" style={{ '--accent': section.color } as CSSProperties}>
      <header className="panel__header">
        <span className="panel__icon">
          <PixelSprite sprite={section.icon} scale={4} />
        </span>
        <div>
          <p className="panel__eyebrow">VIDEO LECTURES</p>
          <h1 className="panel__title">{section.title.toUpperCase()}</h1>
        </div>
      </header>

      <div className="panel__empty">
        <p className="panel__empty-title">The lectures are on their way</p>
        <p>
          Our teachers are recording the {section.title} lessons right now. They’ll appear here as soon as
          they’re ready — hoo-ray!
        </p>
      </div>

      <dl className="panel__facts">
        <div>
          <dt>On test day</dt>
          <dd>{section.format.join(' · ')}</dd>
        </div>
        <div>
          <dt>You’ll learn</dt>
          <dd>{section.skills.join(' · ')}</dd>
        </div>
      </dl>

      <Link to="/student" className="panel__back">
        ◀ Back to the forest
      </Link>
    </section>
  )
}
