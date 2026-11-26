// Pixel-art helpers: one art pixel = P screen px; sprites are merged into one path per colour.
export const W = 720
export const H = 1280
export const P = 5
export const FONT = 'Press Start 2P'

export const C = {
  ink: '#140c1c', navy0: '#0b0c26', navy1: '#14153a', navy2: '#1d1e4e', navy3: '#2b2b66',
  blue1: '#25305c', blue2: '#2e51a6', blue3: '#5d99ea', sky: '#c3d1ef',
  gold: '#f2a541', yellow: '#ffd23f', red: '#d8323c', redD: '#9e1f2c', mint: '#7bc188', mintL: '#b8f0c0',
  cream: '#fff1c9', white: '#f4f0e8', grey1: '#2e2a3c', grey2: '#605f71', grey3: '#a9a8bb', grey4: '#d4cede',
  wood: '#8a5a32', woodL: '#b07a45', woodD: '#5a3a22',
}

// rects in art pixels → one path per colour; each entry [x, y, w, h, colour]
export function boxes(list, ox = 0, oy = 0, p = P) {
  const runs = []
  for (const [x, y, w, h, c] of list) {
    if (!c || w <= 0 || h <= 0) continue
    const X = ox + x * p, Y = oy + y * p
    const d = `M${X} ${Y}H${X + w * p}V${Y + h * p}H${X}Z`
    const last = runs[runs.length - 1]
    if (last && last.c === c) last.d.push(d)
    else runs.push({ c, d: [d] })
  }
  return runs.map((r) => <path d={r.d.join('')} fill={r.c} />)
}

// parts with a 1-art-pixel outline drawn behind all fills
export function outlined(parts, ox, oy, p = P, ink = C.ink) {
  const outline = parts.filter((q) => !q[5]).map(([x, y, w, h]) => [x - 1, y - 1, w + 2, h + 2, ink])
  return [...boxes(outline, ox, oy, p), ...boxes(parts.map((q) => q.slice(0, 5)), ox, oy, p)]
}

// character-map sprite (rows of chars, '.' = empty)
export function sprite(rows, pal, ox, oy, p = P) {
  const list = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      let n = 1
      while (x + n < row.length && row[x + n] === ch) n++
      if (ch !== '.' && pal[ch]) list.push([x, y, n, 1, pal[ch]])
      x += n
    }
  })
  return boxes(list, ox, oy, p)
}

// a timed full-canvas layer (the only way to time children inside a scene)
export function Layer({ at = 0, dur, children, animate, motion }) {
  return (
    <frame at={at} duration={dur} width={W} height={H} layout="none"
      animate={animate || (motion ? [{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.06, value: 1 }] }] : undefined)}>
      {motion ? <Cam motion={motion}>{children}</Cam> : children}
    </frame>
  )
}

// scale animations go through frame motion: an animated 'scale' property hides the vector paths inside
// The engine drops vector paths whenever a frame is moved left or up. A centred zoom is done as:
// inner frame placed at (-W/2,-H/2) statically, outer frame scaled about its corner and moved by a
// constant (+W/2,+H/2) — the same picture, with no negative motion anywhere.
const centred = (k) => ({ scale: k, x: W / 2, y: H / 2 })
export const pop = (t0 = 0, d = 0.25) => ({ timeline: { duration: d, from: centred(0.55), to: centred(1), easing: { kind: 'overshoot', amount: 2.2 } } })
export const zoom = (d, a, b) => ({ timeline: { duration: d, from: centred(a), to: centred(b), easing: 'linear' } })
export const Cam = ({ motion, children }) => (
  <frame width={W} height={H} layout="none" motion={motion}>
    <frame x={-W / 2} y={-H / 2} width={W} height={H} layout="none">{children}</frame>
  </frame>
)

// pixel text with a hard dark drop shadow
export function PText({ x, y, w = 680, size = 28, color = C.white, align = 'left', shadow = C.ink, text, lh = 1.35 }) {
  return (
    <text x={x} y={y} width={w} fontFamily={FONT} fontWeight={400} fontSize={size} color={color} align={align} lineHeight={lh}
      shadow={{ x: Math.max(2, size / 8), y: Math.max(2, size / 8), blur: 0, color: shadow }}>{text}</text>
  )
}
