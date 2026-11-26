import { W, H, C, P, boxes } from './lib.jsx'
import { bands, stars, disc, skyline } from './sets.jsx'

let s = 21
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)
const seed = (n) => { s = n }

// Margaret's sitting room in Edinburgh: rain, the castle on its rock, a framed certificate, shelves, teapot
export function margaretRoom() {
  const o = [[-20, -20, 190, 300, '#5a4a3e']]
  for (let x = -20; x < 170; x += 10) o.push([x, -20, 2, 210, '#64523f'])
  // window: grey rainy sky, castle rock with towers
  o.push([70, 14, 66, 76, '#3a2a1e'], ...bands(['#7a8090', '#8a90a0', '#9aa0ae'], 17, 87, 73, 60))
  o.push([73, 66, 60, 21, '#4a4a58'], [80, 58, 46, 10, '#4a4a58'], [88, 52, 30, 8, '#4a4a58'])
  o.push([90, 40, 26, 12, '#3a3a48'], [92, 34, 4, 6, '#3a3a48'], [104, 30, 4, 10, '#3a3a48'], [112, 36, 4, 4, '#3a3a48'], [96, 44, 2, 3, '#ffd23f'], [108, 42, 2, 3, '#ffd23f'], [100, 46, 2, 3, '#ffd23f'])
  seed(4); for (let i = 0; i < 30; i++) o.push([73 + Math.floor(rnd() * 58), 17 + Math.floor(rnd() * 66), 1, 3, '#c4ccd8'])
  o.push([102, 17, 2, 70, '#3a2a1e'], [73, 50, 60, 2, '#3a2a1e'], [66, 90, 74, 4, '#8a6a4a'])
  // framed certificate (the IELTS examiner one), left wall
  o.push([12, 24, 40, 30, '#c8a040'], [14, 26, 36, 26, '#f4ecd8'], [18, 29, 28, 4, '#c8202a'], [18, 36, 22, 2, '#8a8070'], [18, 40, 26, 2, '#8a8070'], [18, 45, 12, 2, '#8a8070'], [38, 43, 8, 6, '#c8a040'])
  // shelf with books, a cat ornament
  o.push([6, 74, 56, 3, '#8a6a4a'])
  seed(8); let bx = 8; while (bx < 50) { const bw = 2 + Math.floor(rnd() * 3), bh = 9 + Math.floor(rnd() * 6); o.push([bx, 74 - bh, bw, bh, ['#7a2a2a', '#2a4a6a', '#6a5a2a', '#3a5a3a', '#5a3a5a'][Math.floor(rnd() * 5)]]); bx += bw + 1 }
  o.push([52, 66, 6, 8, '#2e2a3c'], [52, 64, 2, 2, '#2e2a3c'], [56, 64, 2, 2, '#2e2a3c'])
  // table
  o.push([-20, 172, 190, 5, '#b07a45'], [-20, 177, 190, 3, '#5a3a22'], [-20, 180, 190, 100, '#3e2a1e'])
  o.push([-20, 168, 190, 4, '#e8e0d0'])
  return boxes(o)
}
// on Margaret's table: a teapot and cup, a printed essay covered in red pen, a red pen
export const margaretProps = () => boxes([
  [104, 154, 18, 14, '#f4f0e8'], [106, 150, 14, 4, '#f4f0e8'], [111, 147, 4, 3, '#f4f0e8'], [122, 157, 5, 3, '#f4f0e8'], [100, 158, 4, 6, '#f4f0e8'], [108, 158, 10, 3, '#5d99ea'],
  [126, 162, 10, 7, '#f4f0e8'], [136, 164, 3, 3, '#f4f0e8'], [127, 163, 8, 2, '#8a5a32'],
  [14, 160, 40, 10, '#f4f0e8'], [16, 162, 30, 1, '#8a8070'], [16, 165, 34, 1, '#8a8070'], [20, 161, 10, 3, '#d8323c'], [36, 164, 8, 3, '#d8323c'], [56, 166, 16, 2, '#d8323c'], [70, 166, 2, 2, '#f4f0e8'],
])

// a lined exam sheet, seen from above, with n lines of handwriting and optional red corrections
export function paper({ lines = 0, red = 0, ink = '#2e3a6a', count = 22 } = {}) {
  const o = [[-20, -20, 190, 300, '#6e4628'], [-20, -20, 190, 300, '#7a5232']]
  for (let y = -20; y < 280; y += 14) o.push([-20, y, 190, 1, '#6a4428'])
  o.push([10, 18, 124, 222, '#1d1a28'], [8, 16, 124, 222, '#f8f4ea'])
  for (let i = 0; i < count; i++) o.push([14, 34 + i * 9, 112, 1, '#b8c4dc'])
  o.push([22, 16, 1, 222, '#e8a0a0'], [12, 20, 70, 5, '#2e51a6'], [14, 21, 30, 3, '#f4f0e8'])
  seed(17)
  for (let i = 0; i < lines; i++) {
    let x = 26; const y = 30 + i * 9
    const end = i === lines - 1 ? 60 + rnd() * 40 : 118 + rnd() * 6
    while (x < end) { const w = 3 + Math.floor(rnd() * 9); o.push([x, y, Math.min(w, end - x), 2, ink], [x, y + 2, Math.min(w, end - x) - 1, 1, '#5a6aa0']); x += w + 2 }
  }
  seed(31)
  for (let k = 0; k < red; k++) {
    const i = Math.floor(rnd() * Math.max(1, lines)), y = 29 + i * 9, x = 28 + Math.floor(rnd() * 80)
    if (k % 3 === 0) o.push([x, y + 1, 16, 1, '#d8323c'])
    else if (k % 3 === 1) o.push([x, y - 2, 12, 1, '#d8323c'], [x, y + 4, 12, 1, '#d8323c'], [x - 1, y - 1, 1, 5, '#d8323c'], [x + 12, y - 1, 1, 5, '#d8323c'])
    else o.push([126, y - 1, 4, 4, '#d8323c'], [127, y, 2, 2, '#f8f4ea'])
  }
  return boxes(o)
}
// a pen lying across the page / held
export const penOnPage = (x = 96, y = 150) => boxes([[x, y, 3, 3, '#2e51a6'], [x + 3, y + 3, 3, 3, '#2e51a6'], [x + 6, y + 6, 3, 3, '#2e51a6'], [x + 9, y + 9, 3, 3, '#2e51a6'], [x - 1, y - 1, 2, 2, '#f4f0e8']])

// the laptop screen with a chat-style AI writing an essay
export function aiScreen({ rows = 10 } = {}) {
  const o = [[-20, -20, 190, 300, '#14153a'], [2, 48, 140, 108, '#1a1424'], [4, 50, 136, 104, '#101420'], [4, 50, 136, 8, '#1c2234']]
  o.push([8, 64, 70, 10, '#2e51a6'], [10, 67, 50, 2, '#c3d1ef'], [10, 70, 30, 2, '#c3d1ef'])
  o.push([56, 80, 80, 70, '#20283c'])
  seed(5); for (let i = 0; i < rows; i++) { const w = 50 + Math.floor(rnd() * 22); o.push([60, 84 + i * 6, i === rows - 1 ? w / 2 : w, 2, '#7bc188']) }
  o.push([-6, 156, 156, 4, '#605f71'], [-12, 160, 168, 26, '#8d8b9c'], [-14, 186, 172, 4, '#605f71'], [-20, 190, 190, 90, C.woodD], [-20, 190, 190, 3, C.woodL])
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) o.push([6 + c * 11 - r, 163 + r * 5, 9, 3, '#a9a8bb'])
  return boxes(o)
}

// the super saiyan aura: flame tongues around a figure centred at cx (screen px), base y, frame k
export function aura(cx, top, bottom, k = 0, w = 300) {
  const out = []
  seed(100 + k * 13)
  const cols = 24
  for (let i = 0; i < cols; i++) {
    const x = cx - w / 2 + (i * w) / cols
    const edge = Math.abs(i - cols / 2) / (cols / 2)
    const h = (bottom - top) * (0.55 + 0.45 * (1 - edge)) * (0.75 + rnd() * 0.35)
    const y = bottom - h
    const cw = w / cols + 2
    out.push(<rect x={x} y={y} width={cw} height={h} fill="#ffd23f" opacity={0.0} />)
    out.push([x, y, cw, h])
  }
  const fl = out.filter((e) => Array.isArray(e))
  return [
    <rect x={cx - w * 0.9} y={top - 140} width={w * 1.8} height={bottom - top + 260} fill={{ kind: 'radial', stops: [{ offset: 0, color: '#ffd23f', opacity: 0.55 }, { offset: 0.7, color: '#ffd23f', opacity: 0 }] }} />,
    ...fl.map(([x, y, cw, h]) => <rect x={x} y={y} width={cw} height={h} fill="#f2a541" />),
    ...fl.map(([x, y, cw, h]) => <rect x={x + 5} y={y + 18} width={Math.max(4, cw - 10)} height={h - 18} fill="#ffd23f" />),
    ...fl.map(([x, y, cw, h], i) => (i % 3 === k % 3 ? <rect x={x + 8} y={y + 40} width={Math.max(3, cw - 16)} height={h - 40} fill="#fff1a8" /> : null)),
  ]
}
// sparks / electricity around the aura
export const sparks = (cx, cy, k = 0) => {
  seed(300 + k * 7); const o = []
  for (let i = 0; i < 9; i++) { const a = rnd() * Math.PI * 2, r = 150 + rnd() * 120; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 1.3; o.push(<rect x={x} y={y} width={10} height={10} fill="#fff1a8" />, <rect x={x + 10} y={y + 10} width={10} height={10} fill="#ffffff" />, <rect x={x - 10} y={y + 20} width={10} height={10} fill="#fff1a8" />) }
  return o
}

// paper everywhere: level 0..3 fills the floor, the desk, the wall
export function paperClutter(level = 1) {
  const o = []; seed(42)
  const sheet = (x, y, w = 14, h = 10) => { o.push([x, y, w, h, '#f4f0e8'], [x + 2, y + 2, w - 5, 1, '#9aa4c0'], [x + 2, y + 4, w - 4, 1, '#9aa4c0'], [x + 2, y + 6, w - 7, 1, '#9aa4c0'], [x, y + h - 1, w, 1, '#c8c0b0']) }
  const n = [6, 22, 48, 90][level]
  for (let i = 0; i < n; i++) {
    const zone = rnd()
    if (zone < 0.5) sheet(-16 + Math.floor(rnd() * 170), 230 + Math.floor(rnd() * 30))
    else if (zone < 0.75) sheet(-16 + Math.floor(rnd() * 170), 196 + Math.floor(rnd() * 34), 16, 11)
    else if (level >= 2) sheet(-10 + Math.floor(rnd() * 160), 20 + Math.floor(rnd() * 150), 12, 15)
    else sheet(-16 + Math.floor(rnd() * 170), 238 + Math.floor(rnd() * 20))
  }
  if (level >= 1) for (let k = 0; k < level * 3; k++) o.push([4 + k * 2, 166 - k * 2, 22, 3, k % 2 ? '#f4f0e8' : '#e8e0d0'])
  if (level >= 2) for (let k = 0; k < level * 4; k++) o.push([110 - (k % 2), 170 - k * 2, 24, 3, k % 2 ? '#f4f0e8' : '#e8e0d0'])
  return boxes(o)
}
// daylight in the window (drawn over the night window of bedroomNight)
export const dayWindow = () => boxes([...bands(['#5d99ea', '#7fb0f0', '#a6c6f2', '#c3d1ef'], 29, 93, 87, 48), ...skyline(87, 93, 48, 5, ['#8ea4cf', '#9db0d8', '#7f95c4'], ['#c3d1ef']), ...disc(98, 40, 5, '#fff1a8'),
  [110, 29, 2, 64, '#4a2e1c'], [87, 60, 48, 2, '#4a2e1c']])
