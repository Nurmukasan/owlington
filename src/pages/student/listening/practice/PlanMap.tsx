import { useId, type CSSProperties } from 'react'
import type { MapShape, MapSpec } from '../practice-data'

/*
 * Any map or floor plan for a labelling task, drawn from data in the same
 * pixel style as the Larkhill park map. Answer letters are drawn exactly like
 * the distractors; only the review reveals what each one is.
 */

interface PlanMapProps {
  spec: MapSpec
  /** Letter to spotlight (hovered / focused in the answer grid). */
  highlight?: string | null
  /** Question numbers currently placed on each letter. */
  placed?: Record<string, number[]>
  /** Review mode: the place name shown on each answer letter. */
  reveal?: Record<string, string>
  /** Review mode: wrong placements, as [question number, letter chosen, correct letter]. */
  misses?: [number, string, string][]
  onPick?: (letter: string) => void
  className?: string
}

const AREA_CLASS: Record<string, string> = {
  building: 'ls-map__building',
  room: 'ls-map__room',
  water: 'ls-map__lake',
  green: 'ls-map__lawn',
  trees: 'ls-map__wood',
  parking: 'ls-map__carpark',
  field: 'ls-map__field',
  sand: 'ls-map__sand',
  stage: 'ls-map__stage',
}

function Area({ shape, ids }: { shape: Extract<MapShape, { w: number }>; ids: Record<string, string> }) {
  const fill = shape.kind === 'water' ? `url(#${ids.water})` : shape.kind === 'parking' ? `url(#${ids.bays})` : undefined
  const lines = shape.label?.split('\n') ?? []
  const cx = shape.x + shape.w / 2
  const cy = shape.y + shape.h / 2 - ((lines.length - 1) * 14) / 2 + 4
  return (
    <g>
      {shape.round ? (
        <ellipse cx={cx} cy={shape.y + shape.h / 2} rx={shape.w / 2} ry={shape.h / 2} className={AREA_CLASS[shape.kind]} fill={fill} />
      ) : (
        <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.kind === 'room' ? 2 : 6} className={AREA_CLASS[shape.kind]} fill={fill} />
      )}
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={cy + i * 14}
          textAnchor="middle"
          className={`ls-map__label ${shape.kind === 'water' ? 'ls-map__label--water' : ''} ${shape.w < 90 ? 'ls-map__label--small' : ''}`}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

export function PlanMap({ spec, highlight = null, placed = {}, reveal, misses = [], onPick, className = '' }: PlanMapProps) {
  const uid = useId().replace(/:/g, '')
  const ids = { grass: `ls-g-${uid}`, water: `ls-w-${uid}`, bays: `ls-b-${uid}`, title: `ls-t-${uid}`, desc: `ls-d-${uid}` }
  const width = spec.width ?? 640
  const height = spec.height ?? 460
  const floor = spec.ground === 'floor'
  const points = spec.points

  return (
    <>
      <figure className={`ls-map ${floor ? 'is-plan' : ''} ${reveal ? 'is-reveal' : ''} ${className}`}>
        <svg viewBox={`0 0 ${width} ${height}`} className="ls-map__svg" role="img" aria-labelledby={`${ids.title} ${ids.desc}`}>
          <title id={ids.title}>{spec.title}</title>
          <desc id={ids.desc}>{spec.description}</desc>
          <defs>
            <pattern id={ids.grass} width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" className={floor ? 'ls-map__floor' : 'ls-map__grass'} />
              {!floor && <rect x="3" y="4" width="2" height="2" className="ls-map__tuft" />}
              {!floor && <rect x="9" y="10" width="2" height="2" className="ls-map__tuft" />}
            </pattern>
            <pattern id={ids.water} width="16" height="10" patternUnits="userSpaceOnUse">
              <rect width="16" height="10" className="ls-map__water-bg" />
              <path d="M2 5h5" className="ls-map__ripple" />
              <path d="M10 9h4" className="ls-map__ripple" />
            </pattern>
            <pattern id={ids.bays} width="22" height="40" patternUnits="userSpaceOnUse">
              <rect width="22" height="40" className="ls-map__tarmac" />
              <path d="M0 0v16M0 24v16" className="ls-map__bay" />
            </pattern>
          </defs>

          <rect x="14" y="14" width={width - 28} height={height - 28} rx={floor ? 4 : 16} fill={`url(#${ids.grass})`} />
          <rect x="14" y="14" width={width - 28} height={height - 28} rx={floor ? 4 : 16} className={floor ? 'ls-map__outer-wall' : 'ls-map__fence'} />

          {spec.shapes.map((shape, i) => {
            if ('d' in shape) {
              const cls =
                shape.kind === 'road'
                  ? 'ls-map__road'
                  : shape.kind === 'river'
                    ? 'ls-map__stream'
                    : shape.kind === 'wall'
                      ? 'ls-map__wall'
                      : 'ls-map__path'
              return <path key={i} d={shape.d} className={cls} />
            }
            return null
          })}
          {spec.shapes.map((shape, i) => ('w' in shape ? <Area key={i} shape={shape} ids={ids} /> : null))}
          {spec.shapes.map((shape, i) =>
            shape.kind === 'label' ? (
              <text key={i} x={shape.x} y={shape.y} textAnchor="middle" className={`ls-map__label ${shape.small ? 'ls-map__label--small' : ''}`}>
                {shape.text}
              </text>
            ) : null,
          )}

          {spec.here && (
            <g className="ls-map__here">
              <path
                d={`M${spec.here[0]} ${spec.here[1] - 13} l5 10 l11 1 l-8 7 l3 11 l-11 -6 l-11 6 l3 -11 l-8 -7 l11 -1 z`}
                className="ls-map__star"
              />
              <text x={spec.here[0]} y={spec.here[1] + 30} textAnchor="middle" className="ls-map__label ls-map__label--here">
                {spec.hereLabel ?? 'YOU ARE HERE'}
              </text>
            </g>
          )}

          <g className="ls-map__compass" transform={`translate(${width - 42} 52)`}>
            <circle r="18" />
            <path d="M0 -14 L6 4 L0 0 L-6 4 Z" className="ls-map__needle" />
            <text y="-22" textAnchor="middle" className="ls-map__label ls-map__label--n">
              N
            </text>
          </g>

          {misses.map(([n, from, to]) => {
            const a = points[from]
            const b = points[to]
            if (!a || !b) return null
            return <path key={`hop-${n}`} d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} className="ls-map__hop" />
          })}

          {Object.entries(points).map(([letter, [x, y]]) => {
            const tags = placed[letter] ?? []
            const name = reveal?.[letter]
            const lit = highlight === letter
            const wrong = misses.filter(([, from]) => from === letter).map(([n]) => n)
            const wrongText = wrong.map((n) => `Q${n}`).join(' ')
            // Names hang to the right unless that would run off the edge.
            const nameW = (name?.length ?? 0) * 6.6 + 12
            const left = x + 14 + nameW > width - 8
            return (
              <g
                key={letter}
                className={`ls-map__pin ${lit ? 'is-lit' : ''} ${tags.length ? 'is-placed' : ''} ${reveal ? (name ? 'is-answer' : 'is-unused') : ''} ${wrong.length ? 'is-missed' : ''}`}
                style={{ '--ls-x': `${x}px`, '--ls-y': `${y}px` } as CSSProperties}
                onClick={onPick ? () => onPick(letter) : undefined}
                aria-hidden="true"
              >
                <circle cx={x} cy={y} r="20" className="ls-map__halo" />
                <rect x={x - 12} y={y - 12} width="24" height="24" rx="3" className="ls-map__pin-box" />
                <text x={x} y={y + 5} textAnchor="middle" className="ls-map__pin-letter">
                  {letter}
                </text>
                {tags.length > 0 && !reveal && (
                  <g className="ls-map__qtag">
                    <rect x={x + 10} y={y - 24} width={12 + tags.join(',').length * 7} height="16" rx="3" />
                    <text x={x + 16} y={y - 12}>
                      {tags.join(',')}
                    </text>
                  </g>
                )}
                {wrong.length > 0 && (
                  <g className="ls-map__miss">
                    <rect x={x - (wrongText.length * 7 + 26) / 2} y={y + 17} width={wrongText.length * 7 + 26} height="19" rx="4" />
                    <text x={x} y={y + 31} textAnchor="middle">
                      {wrongText} ×
                    </text>
                  </g>
                )}
                {name && (
                  <g className="ls-map__name">
                    <rect x={left ? x - 14 - nameW : x + 14} y={y - 10} width={nameW} height="20" rx="4" />
                    <text x={left ? x - 8 - nameW : x + 20} y={y + 4}>
                      {name}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </figure>
      <p className="ls-map__swipe" aria-hidden="true">
        « SWIPE TO SEE THE WHOLE MAP »
      </p>
    </>
  )
}
