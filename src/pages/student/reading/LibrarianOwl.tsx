import { TalkingOwl } from '../../../learn/components/TalkingOwl'
import { OWL_H, OWL_W } from '../../../scene/sprites'

interface LibrarianOwlProps {
  talking?: boolean
  happy?: boolean
  look?: -1 | 0 | 1
  scale?: number
  className?: string
}

/** The pixel owl with gold reading glasses — the Moonlit Library's librarian. */
export function LibrarianOwl({ talking, happy, look = 0, scale = 3, className = '' }: LibrarianOwlProps) {
  return (
    <span className={`rd-librarian ${className}`} style={{ width: OWL_W * scale, height: OWL_H * scale }} aria-hidden="true">
      <TalkingOwl talking={talking} happy={happy} look={look} scale={scale} />
      <svg
        className="rd-librarian__glasses"
        viewBox={`0 0 ${OWL_W} ${OWL_H}`}
        width={OWL_W * scale}
        height={OWL_H * scale}
        shapeRendering="crispEdges"
      >
        <rect x={3} y={6} width={4} height={4} fill="rgb(207 224 255 / 0.16)" />
        <rect x={9} y={6} width={4} height={4} fill="rgb(207 224 255 / 0.16)" />
        <g fill="#ffcf5c">
          <rect x={2} y={5} width={6} height={1} />
          <rect x={2} y={6} width={1} height={5} />
          <rect x={2} y={10} width={5} height={1} />
          <rect x={7} y={6} width={1} height={2} />
          <rect x={8} y={5} width={6} height={1} />
          <rect x={13} y={6} width={1} height={5} />
          <rect x={9} y={10} width={5} height={1} />
          <rect x={8} y={6} width={1} height={2} />
        </g>
        <rect x={3} y={6} width={1} height={1} fill="#fffaf0" opacity={0.85} />
        <rect x={9} y={6} width={1} height={1} fill="#fffaf0" opacity={0.85} />
      </svg>
    </span>
  )
}
