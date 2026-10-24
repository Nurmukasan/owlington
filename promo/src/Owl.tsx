/**
 * The Owlington mascot, rigged for animation. The shapes, colours and proportions are copied
 * from src/components/OwlMascot.tsx; only pivots were added (head, wings, lids, pupils, hop).
 */

export interface OwlPose {
  /** 0 open … 1 shut */
  blink?: number
  /** ^ ^ happy eyes (as when the site owl hoots) */
  happy?: boolean
  /** pupil direction, -1…1 */
  lookX?: number
  lookY?: number
  /** head tilt in degrees */
  tilt?: number
  /** head nod, 0…1 (dips the head) */
  nod?: number
  /** raise of each wing in degrees; positive opens it outwards */
  wingL?: number
  wingR?: number
  /** hop height in viewBox units */
  hop?: number
  /** squash/stretch: 1 normal, <1 squashed */
  squash?: number
  /** beak open 0…1 */
  beak?: number
  /** lean of the whole bird in degrees */
  lean?: number
  /** shut only the right eye (a wink), 0…1 */
  wink?: number
}

const EYES = [
  { cx: 95, cy: 118 },
  { cx: 165, cy: 118 },
]

export function Owl({ pose = {}, id, width = 260, shadow = true }: { pose?: OwlPose; id: string; width?: number; shadow?: boolean }) {
  const { blink = 0, happy = false, lookX = 0, lookY = 0, tilt = 0, nod = 0, wingL = 0, wingR = 0, hop = 0, squash = 1, beak = 0, lean = 0, wink = 0 } = pose
  const lid = happy ? 1 : blink
  const px = lookX * 8
  const py = lookY * 8
  const stretch = 1 / Math.sqrt(squash)
  return (
    <svg viewBox="-60 -40 380 380" width={width * (380 / 260)} style={{ overflow: 'visible', display: 'block' }} aria-hidden="true">
      <defs>
        {EYES.map((eye, i) => (
          <clipPath key={i} id={`${id}-eye-${i}`}>
            <circle cx={eye.cx} cy={eye.cy} r="27" />
          </clipPath>
        ))}
        <radialGradient id={`${id}-iris`} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="55%" stopColor="#ffb627" />
          <stop offset="100%" stopColor="#e07d00" />
        </radialGradient>
        <radialGradient id={`${id}-body`} cx="62%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#9a6743" />
          <stop offset="100%" stopColor="#6c4329" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {shadow && <ellipse cx="130" cy="300" rx={70 - hop * 0.25} ry="12" fill={`url(#${id}-shadow)`} />}

      <g transform={`translate(0 ${-hop}) rotate(${lean} 130 300) translate(130 300) scale(${stretch} ${squash}) translate(-130 -300)`}>
        {/* tail */}
        <path d="M112 270 L130 306 L148 270 Z" fill="#3f2618" />

        <g>
          <path
            d="M130 46 C186 46 214 84 214 134 C214 172 222 206 212 238 C200 276 168 292 130 292 C92 292 60 276 48 238 C38 206 46 172 46 134 C46 84 74 46 130 46 Z"
            fill={`url(#${id}-body)`}
          />
          {/* wings, hinged at the shoulders */}
          <g transform={`rotate(${wingL} 80 160)`}>
            <path d="M50 152 C28 192 32 252 76 284 C70 242 72 198 86 166 C76 152 62 148 50 152 Z" fill="#523220" />
            <path d="M58 200 C56 226 62 248 74 264" stroke="#6b452d" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          <g transform={`rotate(${-wingR} 180 160)`}>
            <path d="M210 152 C232 192 228 252 184 284 C190 242 188 198 174 166 C184 152 198 148 210 152 Z" fill="#523220" />
            <path d="M196 210 C198 232 194 250 186 264" stroke="#6b452d" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          {/* belly */}
          <ellipse cx="130" cy="222" rx="54" ry="62" fill="#ecd0a2" />
          <g stroke="#b98b5c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M106 188 l8 7 l8 -7 M138 188 l8 7 l8 -7" />
            <path d="M92 210 l8 7 l8 -7 M122 210 l8 7 l8 -7 M152 210 l8 7 l8 -7" />
            <path d="M106 232 l8 7 l8 -7 M138 232 l8 7 l8 -7" />
            <path d="M98 254 l8 7 l8 -7 M122 256 l8 7 l8 -7 M146 254 l8 7 l8 -7" />
          </g>
          {/* feet */}
          <g fill="#e09a34">
            <rect x="98" y="282" width="8" height="16" rx="4" />
            <rect x="108" y="284" width="8" height="16" rx="4" />
            <rect x="118" y="282" width="8" height="16" rx="4" />
            <rect x="134" y="282" width="8" height="16" rx="4" />
            <rect x="144" y="284" width="8" height="16" rx="4" />
            <rect x="154" y="282" width="8" height="16" rx="4" />
          </g>
        </g>

        <g transform={`translate(0 ${nod * 10}) rotate(${tilt + nod * 6} 130 150)`}>
          {/* ear tufts */}
          <path d="M60 96 L50 24 L108 60 Z" fill="#7f5236" />
          <path d="M200 96 L210 24 L152 60 Z" fill="#7f5236" />
          <path d="M66 82 L60 42 L94 62 Z" fill="#523220" />
          <path d="M194 82 L200 42 L166 62 Z" fill="#523220" />
          {/* brows */}
          <path d="M64 82 Q95 64 124 84 M136 84 Q165 64 196 82" stroke="#523220" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* facial disc */}
          <path d="M130 94.8 A42 42 0 1 0 130 141.2 A42 42 0 1 0 130 94.8 Z" fill="#f3e3c3" stroke="#5e3a24" strokeWidth="4" />
          {/* cheeks */}
          <circle cx="68" cy="152" r="10" fill="#ff8a7a" opacity={happy ? 0.6 : 0.35} />
          <circle cx="192" cy="152" r="10" fill="#ff8a7a" opacity={happy ? 0.6 : 0.35} />
          {EYES.map((eye, i) => (
            <g key={i}>
              <circle cx={eye.cx} cy={eye.cy} r="27" fill={`url(#${id}-iris)`} stroke="#1e120c" strokeWidth="4" />
              <g transform={`translate(${px} ${py})`}>
                <circle cx={eye.cx} cy={eye.cy} r="14" fill="#120c08" />
                <circle cx={eye.cx - 6} cy={eye.cy - 7} r="5" fill="#fff" />
                <circle cx={eye.cx + 6} cy={eye.cy + 6} r="2.4" fill="#fff" opacity="0.8" />
              </g>
              <g clipPath={`url(#${id}-eye-${i})`}>
                <rect x={eye.cx - 30} y={eye.cy - 30} width="60" height={60 * (i === 1 ? Math.max(lid, wink) : lid)} fill={happy ? '#f3e3c3' : '#7f5236'} />
              </g>
              {happy && (
                <path
                  d={`M${eye.cx - 14} ${eye.cy + 6} Q${eye.cx} ${eye.cy - 14} ${eye.cx + 14} ${eye.cy + 6}`}
                  stroke="#1e120c"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          ))}
          {/* beak */}
          <g transform={`translate(0 ${beak * 4})`}>
            <path d="M130 132 L144 148 L130 174 L116 148 Z" fill="#f08a24" />
            <path d="M130 132 L144 148 L130 154 Z" fill="#ffad55" />
          </g>
          {beak > 0.05 && <path d="M120 152 L140 152 L130 160 Z" fill="#7a2f0a" opacity={Math.min(1, beak * 2)} transform={`translate(0 ${beak * 2})`} />}
        </g>
      </g>
    </svg>
  )
}
