import { PixelSprite } from '../../../components/PixelSprite'
import { OWL_HEAD } from '../../../scene/sprites'
import { useReveal } from './hooks'

interface SectionHeaderProps {
  id: string
  plate: string
  title: string
  note?: string
}

/** Brass plate + serif title + a line from the librarian. */
export function SectionHeader({ id, plate, title, note }: SectionHeaderProps) {
  const [ref, inView] = useReveal<HTMLElement>()
  return (
    <header ref={ref} className={`rd-sechead ${inView ? 'is-in' : ''}`}>
      <p className="rd-sechead__plate">
        <span>{plate}</span>
      </p>
      <h1 id={id} className="rd-sechead__title">
        {title}
      </h1>
      {note && (
        <p className="rd-sechead__note">
          <PixelSprite sprite={OWL_HEAD} scale={2} className="rd-sechead__owl" />
          <span>{note}</span>
        </p>
      )}
    </header>
  )
}
