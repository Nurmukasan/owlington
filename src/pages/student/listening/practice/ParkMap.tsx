import type { CSSProperties } from 'react'

/*
 * Larkhill Country Park, drawn for Part 2 (north is up). Where each letter
 * sits is what the ranger's directions describe:
 *   A  west of the main path, just south of the lake (opposite B)
 *   B  east of the main path, just before the water            → café
 *   C  by Beech Wood, where the old bird hide stood (distractor)
 *   D  the north shore of the lake, at the water's edge        → bird hide
 *   E  north of the stream, between the lake and the bridge    → meadow
 *   F  south bank, across the bridge (farmland, distractor)
 *   G  just east of the visitor centre                         → toilets
 *   H  far west by the fence, between car park and Beech Wood  → picnic area
 * Answer locations are deliberately not drawn differently from distractors.
 */

const MAP_POINTS: Record<string, { x: number; y: number }> = {
  A: { x: 282, y: 272 },
  B: { x: 358, y: 272 },
  C: { x: 186, y: 90 },
  D: { x: 320, y: 70 },
  E: { x: 482, y: 112 },
  F: { x: 546, y: 236 },
  G: { x: 486, y: 370 },
  H: { x: 44, y: 268 },
}

const TREES: [number, number, number][] = [
  [48, 44, 15],
  [80, 60, 17],
  [118, 42, 14],
  [150, 64, 13],
  [44, 92, 16],
  [86, 104, 15],
  [128, 96, 17],
  [160, 118, 12],
  [52, 146, 16],
  [96, 160, 15],
  [136, 150, 14],
  [62, 190, 13],
  [116, 196, 14],
  [156, 176, 11],
  // scattered park trees
  [226, 352, 11],
  [246, 396, 9],
  [600, 318, 12],
  [578, 352, 9],
  [606, 412, 11],
  [420, 290, 9],
  [548, 420, 8],
]

const SR_DESCRIPTION =
  'Map of Larkhill Country Park, with north at the top. The main gate, marked You are here, is in the middle of the southern fence. ' +
  'The main path runs straight north from the gate to a large lake in the upper middle of the park, and a path loops all the way round the lake. ' +
  'Beech Wood fills the north-west corner. The car park is in the south-west corner and the visitor centre is just east of the main path, near the gate. ' +
  'A stream flows east from the lake to the eastern fence and is crossed by a bridge near the east side. ' +
  'Letter A is just west of the main path, a little south of the lake. Letter B is just east of the main path, directly across from A. ' +
  'Letter C is on the path beside the eastern edge of Beech Wood. Letter D is on the north shore of the lake. ' +
  'Letter E is north of the stream, between the lake and the bridge. Letter F is south of the stream, at the southern end of the bridge. ' +
  'Letter G is just east of the visitor centre. Letter H is beside the western fence, between the car park and Beech Wood.'

interface ParkMapProps {
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

export function ParkMap({ highlight = null, placed = {}, reveal, misses = [], onPick, className = '' }: ParkMapProps) {
  return (
    <>
      <figure className={`ls-map ${reveal ? 'is-reveal' : ''} ${className}`}>
        <svg viewBox="0 0 640 460" className="ls-map__svg" role="img" aria-labelledby="ls-map-title ls-map-desc">
          <title id="ls-map-title">Larkhill Country Park map</title>
          <desc id="ls-map-desc">{SR_DESCRIPTION}</desc>
          <defs>
            <pattern id="ls-map-grass" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" className="ls-map__grass" />
              <rect x="3" y="4" width="2" height="2" className="ls-map__tuft" />
              <rect x="9" y="10" width="2" height="2" className="ls-map__tuft" />
            </pattern>
            <pattern id="ls-map-water" width="16" height="10" patternUnits="userSpaceOnUse">
              <rect width="16" height="10" className="ls-map__water-bg" />
              <path d="M2 5h5" className="ls-map__ripple" />
              <path d="M10 9h4" className="ls-map__ripple" />
            </pattern>
            <pattern id="ls-map-bays" width="22" height="40" patternUnits="userSpaceOnUse">
              <rect width="22" height="40" className="ls-map__tarmac" />
              <path d="M0 0v16M0 24v16" className="ls-map__bay" />
            </pattern>
          </defs>

          {/* ground + fence */}
          <rect x="14" y="14" width="612" height="432" rx="16" fill="url(#ls-map-grass)" />
          <rect x="14" y="14" width="612" height="432" rx="16" className="ls-map__fence" />
          <rect x="300" y="440" width="40" height="12" className="ls-map__gate-gap" />

          {/* paths */}
          <path d="M150 400 C 210 412, 270 430, 320 436" className="ls-map__path" />
          <path d="M320 446 V 246" className="ls-map__path ls-map__path--main" />
          <ellipse cx="320" cy="150" rx="140" ry="96" className="ls-map__path" />
          <path d="M320 368 H 360" className="ls-map__path" />
          <path d="M452 128 C 488 134, 520 150, 546 160" className="ls-map__path ls-map__path--trail" />
          <path d="M546 194 V 222" className="ls-map__path ls-map__path--trail" />

          {/* water */}
          <path d="M428 158 C 470 150, 502 180, 546 177 S 604 166, 626 176" className="ls-map__stream" />
          <ellipse cx="320" cy="150" rx="112" ry="70" fill="url(#ls-map-water)" className="ls-map__lake" />
          <text x="320" y="156" className="ls-map__label ls-map__label--water" textAnchor="middle">
            Lake
          </text>
          <text x="596" y="156" className="ls-map__label ls-map__label--small" textAnchor="middle">
            stream
          </text>

          {/* bridge */}
          <g className="ls-map__bridge">
            <rect x="536" y="158" width="20" height="38" rx="2" />
            <path d="M536 166h20M536 174h20M536 182h20M536 190h20" />
          </g>
          <text x="530" y="204" className="ls-map__label ls-map__label--small" textAnchor="end">
            bridge
          </text>

          {/* Beech Wood */}
          <g className="ls-map__trees">
            {TREES.map(([x, y, r], i) => (
              <g key={i}>
                <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={r * 0.7} className="ls-map__tree" />
                <rect x={x - r * 0.55} y={y - r * 0.7} width={r * 0.8} height={r * 0.6} rx={r * 0.3} className="ls-map__tree-hi" />
              </g>
            ))}
          </g>
          <g className="ls-map__tag">
            <rect x="52" y="108" width="98" height="22" rx="4" />
            <text x="101" y="124" textAnchor="middle" className="ls-map__label">
              Beech Wood
            </text>
          </g>

          {/* car park */}
          <rect x="34" y="330" width="116" height="100" rx="6" fill="url(#ls-map-bays)" className="ls-map__carpark" />
          <g className="ls-map__tag">
            <rect x="52" y="370" width="80" height="22" rx="4" />
            <text x="92" y="386" textAnchor="middle" className="ls-map__label">
              Car park
            </text>
          </g>

          {/* visitor centre */}
          <rect x="360" y="344" width="92" height="48" rx="4" className="ls-map__building" />
          <path d="M360 344 l46 -16 l46 16" className="ls-map__roof" />
          <text x="406" y="366" textAnchor="middle" className="ls-map__label ls-map__label--small">
            Visitor
          </text>
          <text x="406" y="380" textAnchor="middle" className="ls-map__label ls-map__label--small">
            centre
          </text>

          {/* gate + you are here */}
          <g className="ls-map__here">
            <rect x="294" y="436" width="8" height="16" />
            <rect x="338" y="436" width="8" height="16" />
            <path d="M320 410 l5 10 l11 1 l-8 7 l3 11 l-11 -6 l-11 6 l3 -11 l-8 -7 l11 -1 z" className="ls-map__star" />
          </g>
          <text x="352" y="431" className="ls-map__label ls-map__label--small">
            Main gate
          </text>
          <text x="352" y="414" className="ls-map__label ls-map__label--here">
            YOU ARE HERE
          </text>

          {/* compass */}
          <g className="ls-map__compass" transform="translate(598 52)">
            <circle r="18" />
            <path d="M0 -14 L6 4 L0 0 L-6 4 Z" className="ls-map__needle" />
            <text y="-22" textAnchor="middle" className="ls-map__label ls-map__label--n">
              N
            </text>
          </g>

          {/* review: where a wrong answer went, with a dashed hop to the right place */}
          {misses.map(([n, from, to]) => {
            const a = MAP_POINTS[from]
            const b = MAP_POINTS[to]
            if (!a || !b) return null
            return <path key={`hop-${n}`} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} className="ls-map__hop" />
          })}

          {/* letters */}
          {Object.entries(MAP_POINTS).map(([letter, p]) => {
            const tags = placed[letter] ?? []
            const name = reveal?.[letter]
            const lit = highlight === letter
            const wrong = misses.filter(([, from]) => from === letter).map(([n]) => n)
            const wrongText = wrong.map((n) => `Q${n}`).join(' ')
            return (
              <g
                key={letter}
                className={`ls-map__pin ${lit ? 'is-lit' : ''} ${tags.length ? 'is-placed' : ''} ${reveal ? (name ? 'is-answer' : 'is-unused') : ''} ${wrong.length ? 'is-missed' : ''}`}
                style={
                  {
                    '--ls-x': `${p.x}px`,
                    '--ls-y': `${p.y}px`,
                  } as CSSProperties
                }
                onClick={onPick ? () => onPick(letter) : undefined}
                aria-hidden="true"
              >
                <circle cx={p.x} cy={p.y} r="20" className="ls-map__halo" />
                <rect x={p.x - 12} y={p.y - 12} width="24" height="24" rx="3" className="ls-map__pin-box" />
                <text x={p.x} y={p.y + 5} textAnchor="middle" className="ls-map__pin-letter">
                  {letter}
                </text>
                {tags.length > 0 && !reveal && (
                  <g className="ls-map__qtag">
                    <rect x={p.x + 10} y={p.y - 24} width={12 + tags.join(',').length * 7} height="16" rx="3" />
                    <text x={p.x + 16} y={p.y - 12}>
                      {tags.join(',')}
                    </text>
                  </g>
                )}
                {wrong.length > 0 && (
                  // below the pin (A's answer label already hangs below A, so its tag goes above)
                  <g className="ls-map__miss">
                    <rect
                      x={p.x - (wrongText.length * 7 + 26) / 2}
                      y={letter === 'A' ? p.y - 40 : p.y + 17}
                      width={wrongText.length * 7 + 26}
                      height="19"
                      rx="4"
                    />
                    <text x={p.x} y={letter === 'A' ? p.y - 26 : p.y + 31} textAnchor="middle">
                      {wrongText} ×
                    </text>
                  </g>
                )}
                {name && (
                  <g className="ls-map__name">
                    {/* A's label hangs below it, clear of H's label and of B across the path. */}
                    <rect
                      x={letter === 'A' ? p.x - (name.length * 6.6 + 12) / 2 : p.x + 14}
                      y={letter === 'A' ? p.y + 15 : p.y - 10}
                      width={name.length * 6.6 + 12}
                      height="20"
                      rx="4"
                    />
                    <text x={letter === 'A' ? p.x - (name.length * 6.6 + 12) / 2 + 6 : p.x + 20} y={letter === 'A' ? p.y + 29 : p.y + 4}>
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
