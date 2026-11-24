export const W = 720
export const H = 1280
export const FONT = 'Press Start 2P'
export const C = {
  ink: '#160f24', ink2: '#221838', panel: '#231b40', panel2: '#2f2556', lilac: '#c39bff', lilacD: '#8a62d6', pink: '#ff8fc7', pinkD: '#d85c9c',
  cream: '#fff1c9', yellow: '#ffd23f', gold: '#f2a541', mint: '#7fe0a8', mintD: '#3fa874', red: '#ff5a6e', redD: '#c8304a', white: '#f7f3ff', grey: '#a89cc8', grey2: '#6d6290', sky: '#a8d8ff',
}
export const IMG = {}
export const VID = {}
// rects in art pixels -> one path per colour
export function boxes(list, ox = 0, oy = 0, p = 4) {
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
export function sprite(rows, pal, ox, oy, p = 4) {
  const list = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]; let n = 1
      while (x + n < row.length && row[x + n] === ch) n++
      if (ch !== '.' && pal[ch]) list.push([x, y, n, 1, pal[ch]])
      x += n
    }
  })
  return boxes(list, ox, oy, p)
}
export function Layer({ at = 0, dur, children, animate, centre = false }) {
  return (
    <frame at={Math.max(0, at)} duration={Math.max(0.04, dur + Math.min(0, at))} width={W} height={H} layout="none" origin={centre ? 'center' : 'top-left'} animate={animate}>
      {children}
    </frame>
  )
}
export const Plate = ({ k }) => <media file={IMG[k]} x={0} y={0} width={W} height={H} fit="cover" />
// still shot: the camera moves the picture
export function Scene({ at, dur, base, zoom = [1.02, 1.1], pan = [0, 0], panY = [0, 0], children }) {
  return (
    <frame at={at} duration={dur} width={W} height={H} layout="none" clip={true}>
      <frame width={W} height={H} layout="none" origin="center"
        animate={[{ property: 'scale', from: zoom[0], to: zoom[1], at: 0, duration: dur, easing: 'ease-in-out' },
          { property: 'offsetX', from: pan[0], to: pan[1], at: 0, duration: dur, easing: 'ease-in-out' },
          { property: 'offsetY', from: panY[0], to: panY[1], at: 0, duration: dur, easing: 'ease-in-out' }]}>
        <Plate k={base} />
      </frame>
      {children}
    </frame>
  )
}
// video shot from a generated clip
export function Clip({ at, dur, k, from = 0, zoom = [1, 1], children }) {
  return (
    <frame at={at} duration={dur} width={W} height={H} layout="none" clip={true}>
      <frame width={W} height={H} layout="none" origin="center" animate={[{ property: 'scale', from: zoom[0], to: zoom[1], at: 0, duration: dur, easing: 'linear' }]}>
        <media file={VID[k]} x={0} y={0} width={W} height={H} fit="cover" trimStart={from} />
      </frame>
      {children}
    </frame>
  )
}
export const popScale = (d = 0.3) => [
  { property: 'scale', keyframes: [{ at: 0, value: 0.6 }, { at: d * 0.6, value: 1.07 }, { at: d, value: 1 }] },
  { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.06, value: 1 }] },
]
export const slam = (d = 0.25) => [
  { property: 'scale', keyframes: [{ at: 0, value: 2.2 }, { at: d * 0.7, value: 0.94 }, { at: d, value: 1 }] },
  { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.05, value: 1 }] },
]
export const popSlide = (d = 0.3, dy = 40) => [
  { property: 'offsetY', keyframes: [{ at: 0, value: dy }, { at: d, value: 0, easing: 'ease-out' }] },
  { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.1, value: 1 }] },
]
export const fadeOut = (dur, d = 0.2) => [{ property: 'opacity', keyframes: [{ at: Math.max(0, dur - d), value: 1 }, { at: dur, value: 0 }] }]
export const fadeIn = (d = 0.2) => [{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: d, value: 1 }] }]
export const T = (x, y, w, size, color, s, align = 'left', o = {}) => (
  <text x={x} y={y} width={w} fontFamily={FONT} fontWeight={400} fontSize={size} color={color} align={align} lineHeight={o.lh || 1.35}
    strokeColor={o.stroke ? C.ink : undefined} strokeWidth={o.stroke ? Math.max(4, size / 4) : undefined}
    shadow={o.shadow === false ? undefined : { x: Math.max(2, size / 9), y: Math.max(2, size / 8), blur: 0, color: C.ink }}>{s}</text>
)
