import { W, H, C, P, boxes } from './lib.jsx'

// deterministic noise
let s = 7
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)
const seed = (n) => { s = n }

// dithered vertical bands: list of [colour] top→bottom over [y0,y1) art rows
export function bands(cols, y0, y1, x0 = 0, w = W / P + 40, n = 1) {
  const out = [], step = (y1 - y0) / cols.length
  cols.forEach((c, i) => {
    const a = Math.round(y0 + i * step), b = Math.round(y0 + (i + 1) * step)
    out.push([x0, a, w, b - a, c])
    if (i < cols.length - 1) for (let x = x0; x < x0 + w; x += 2) out.push([x + ((b >> 0) % 2), b - 1, 1, 1, cols[i + 1]], [x + 1, b, 1, 1, c])
  })
  return out
}
export const stars = (n, x0, y0, w, h, k = 3, col = C.cream) => { seed(k); const o = []; for (let i = 0; i < n; i++) o.push([x0 + Math.floor(rnd() * w), y0 + Math.floor(rnd() * h), 1, 1, rnd() < 0.3 ? '#8f93d6' : col]); return o }
export const disc = (cx, cy, r, col) => { const o = []; for (let y = -r; y <= r; y++) { const hw = Math.floor(Math.sqrt(r * r - y * y)); o.push([cx - hw, cy + y, hw * 2 + 1, 1, col]) } return o }

// night skyline: buildings with lit windows
export function skyline(x0, base, w, k, cols = [C.blue1, '#1c2550', '#2a3870'], lit = ['#ffd23f', '#f2a541', '#fff1c9']) {
  seed(k); const o = []; let x = x0
  while (x < x0 + w) {
    const bw = 8 + Math.floor(rnd() * 12), bh = 18 + Math.floor(rnd() * 45), c = cols[Math.floor(rnd() * cols.length)]
    o.push([x, base - bh, bw, bh, c])
    if (rnd() < 0.3) o.push([x + bw / 2 - 1, base - bh - 6, 1, 6, c])
    for (let yy = base - bh + 3; yy < base - 3; yy += 4) for (let xx = x + 2; xx < x + bw - 2; xx += 3) if (rnd() < 0.35) o.push([xx, yy, 1, 2, lit[Math.floor(rnd() * lit.length)]])
    x += bw + 1
  }
  return o
}

// Timur's room at night — listening universe: vinyl, cassettes, fairy lights, moonlight on the floor
export function bedroomNight({ lampOn = true } = {}) {
  const o = []
  // wall: deep blue with soft vertical wallpaper pattern and a warmer lower half
  o.push([-20, -20, 190, 230, '#24245c'])
  for (let x = -20; x < 170; x += 8) o.push([x, -20, 1, 230, '#2a2a68'], [x + 4, 4, 1, 1, '#33337a'], [x + 4, 40, 1, 1, '#33337a'], [x + 4, 76, 1, 1, '#33337a'], [x + 4, 112, 1, 1, '#33337a'], [x + 4, 148, 1, 1, '#33337a'])
  o.push([-20, 160, 190, 2, '#1c1c4c'], [-20, 196, 190, 9, '#3a2a3e'], [-20, 196, 190, 1, '#4a3a4e'])
  // window: frame, night sky, skyline, moon with halo, curtains with folds, sill with a plant
  o.push([82, 22, 58, 76, '#3a2418'], [84, 24, 54, 72, '#4a2e1c'])
  o.push(...bands(['#101236', '#16184a', '#1f205a', '#2b2b6e', '#3a2f74'], 26, 92, 86, 50))
  o.push(...stars(30, 87, 27, 48, 40, 11), ...disc(124, 40, 9, '#2f3270'), ...disc(124, 40, 6, C.cream), ...disc(121, 37, 2, '#f0dca8'), ...disc(126, 43, 1, '#f0dca8'))
  o.push(...skyline(86, 92, 50, 5))
  o.push([110, 26, 2, 66, '#4a2e1c'], [86, 58, 50, 2, '#4a2e1c'])
  for (const [x0, dir] of [[74, 1], [134, -1]]) { o.push([x0, 16, 12, 88, '#7a2a3a']); for (let k = 0; k < 4; k++) o.push([x0 + 2 + k * 3, 16, 1, 88, '#5e1f2c']); o.push([x0 + (dir > 0 ? 9 : 0), 16, 3, 88, '#9a3a4a']) }
  o.push([70, 14, 80, 3, '#2e2a3c'], [80, 96, 62, 4, C.woodL], [80, 100, 62, 2, C.woodD])
  o.push([84, 88, 8, 8, '#c8704a'], [83, 87, 10, 2, '#a85a3a'], ...disc(88, 82, 5, '#3f7a5a'), ...disc(86, 79, 3, '#4f8a4f'))
  // moonlight falling on the wall and floor
  for (let k = 0; k < 6; k++) o.push([84 - k * 3, 104 + k * 16, 50, 16, '#2c2c6c'])
  // fairy lights across the wall
  for (let x = -16; x < 74; x += 2) { const y = 12 + Math.round(4 * Math.sin((x + 16) / 14)); o.push([x, y, 2, 1, '#14142e']) }
  for (let x = -14, k = 0; x < 72; x += 7, k++) { const y = 13 + Math.round(4 * Math.sin((x + 16) / 14)); o.push([x, y, 2, 2, ['#ffd23f', '#f08a9a', '#7bc188', '#5d99ea'][k % 4]]) }
  // shelf 1: vinyl records, a turntable speaker, a cassette stack
  o.push([2, 44, 54, 3, C.woodL], [2, 47, 54, 1, C.woodD], [4, 47, 2, 4, C.woodD], [52, 47, 2, 4, C.woodD])
  ;[['#c8402e', '#ffd23f'], ['#2e51a6', '#f4f0e8'], ['#3f7a5a', '#ffd23f'], ['#8a4aa0', '#f08a9a'], ['#1a1424', '#f2a541']].forEach(([c, d], i) => o.push([6 + i * 3, 30, 2, 14, c], [6 + i * 3, 34, 2, 2, d]))
  o.push([24, 32, 14, 12, '#2e2a3c'], [25, 33, 12, 10, '#3a3850'], ...disc(31, 38, 3, '#1a1424'), [31, 38, 1, 1, '#605f71'])
  o.push([42, 40, 10, 4, '#2e2a3c'], [43, 41, 8, 2, '#f2a541'], [42, 36, 10, 4, '#2e2a3c'], [43, 37, 8, 2, '#5d99ea'])
  // shelf 2: headphones on a stand, a small trophy, a plant
  o.push([2, 74, 54, 3, C.woodL], [2, 77, 54, 1, C.woodD])
  o.push([8, 62, 8, 12, '#3f7a5a'], [10, 58, 4, 4, '#4f8a4f'], [6, 60, 3, 3, '#4f8a4f'], [16, 59, 3, 3, '#4f8a4f'])
  o.push([25, 72, 10, 2, '#2e2a3c'], [29, 62, 2, 10, '#605f71'], [24, 60, 12, 2, '#2e2a3c'], [23, 61, 3, 6, '#2e2a3c'], [34, 61, 3, 6, '#2e2a3c'], [23, 63, 2, 3, C.mint], [35, 63, 2, 3, C.mint])
  o.push([42, 70, 8, 4, '#c8a040'], [44, 64, 4, 6, '#ffd23f'], [43, 62, 6, 2, '#ffd23f'])
  // poster: a sound wave
  o.push([58, 30, 22, 28, '#e8e0c8'], [59, 31, 20, 26, '#1d1e4e'])
  ;[2, 5, 9, 12, 7, 4, 10, 13, 6, 3].forEach((h, i) => o.push([60 + i * 2, 44 - h / 2, 1, h, i % 2 ? '#5d99ea' : '#7bc188']))
  o.push([60, 52, 18, 2, '#c8402e'])
  // floor: planks + a round rug
  o.push([-20, 205, 190, 70, '#4a3448'])
  for (let y = 210; y < 280; y += 8) o.push([-20, y, 190, 1, '#3a2638'])
  for (let y = 205, k = 0; y < 280; y += 8, k++) for (let x = -20 + (k % 2) * 20; x < 170; x += 40) o.push([x, y, 1, 8, '#3a2638'])
  for (let k = 0; k < 4; k++) o.push([96 - k * 4, 214 + k * 12, 50, 12, '#544066'])
  o.push([10, 236, 124, 22, '#6a3a4a'], [14, 238, 116, 18, '#8a4a5a'], [20, 241, 104, 12, '#a85a6a'], [26, 245, 92, 4, '#c87a7a'])
  return boxes(o, -0, 0)
}
// the desk in front (drawn over the boy): top, front, lamp, clock
export function deskFront({ y = 170, lamp = true } = {}) {
  const o = [[-2, y, 150, 5, C.woodL], [-2, y, 150, 1, '#c89a65'], [-2, y + 5, 150, 2, C.woodD], [2, y + 7, 140, 44, C.wood]]
  for (let k = 0; k < 6; k++) o.push([4 + k * 23, y + 12 + (k % 3) * 9, 16, 1, '#7a4c2a'])
  o.push([6, y + 12, 40, 16, C.woodD], [7, y + 13, 38, 14, '#7a4c2a'], [22, y + 19, 8, 2, '#c8a040'], [6, y + 31, 40, 16, C.woodD], [7, y + 32, 38, 14, '#7a4c2a'], [22, y + 38, 8, 2, '#c8a040'])
  o.push([98, y + 12, 40, 35, C.woodD], [99, y + 13, 38, 33, '#7a4c2a'], [116, y + 28, 2, 6, '#c8a040'])
  if (lamp) o.push([112, y - 2, 14, 2, '#3a3a50'], [117, y - 26, 3, 24, '#4a4a60'], [106, y - 34, 22, 9, '#2e51a6'], [107, y - 33, 20, 2, '#5d99ea'], [108, y - 26, 18, 2, '#ffd23f'],
    [13, y - 18, 12, 18, '#2e2a3c'], [14, y - 17, 10, 16, '#3a3850'], ...disc(19, y - 13, 2, '#1a1424'), [19, y - 13, 1, 1, '#a9a8bb'], ...disc(19, y - 6, 3, '#1a1424'), ...disc(19, y - 6, 1, '#605f71'), [14, y - 1, 10, 1, '#1a1424'],
    [30, y - 8, 7, 8, '#f4f0e8'], [31, y - 7, 5, 3, '#8a5a32'], [37, y - 6, 2, 3, '#f4f0e8'], [32, y - 12, 1, 3, '#e8e8f8'], [34, y - 14, 1, 4, '#e8e8f8'],
    [124, y - 6, 12, 3, '#2e2a3c'], [125, y - 5, 10, 1, '#f2a541'], [124, y - 9, 12, 3, '#2e2a3c'], [125, y - 8, 10, 1, '#c8402e'], [136, y - 6, 9, 6, '#c8704a'], [135, y - 7, 11, 2, '#a85a3a'], [137, y - 4, 7, 1, '#d8865a'], [139, y - 19, 4, 12, '#3f8a4f'], [140, y - 19, 1, 12, '#5fae6a'], [136, y - 15, 3, 2, '#3f8a4f'], [136, y - 17, 2, 2, '#3f8a4f'], [143, y - 13, 3, 2, '#3f8a4f'], [144, y - 16, 2, 3, '#3f8a4f'], [139, y - 21, 4, 2, '#f08a9a'], [140, y - 22, 2, 1, '#ffd23f'], [142, y - 16, 1, 1, '#e8f4d8'], [139, y - 12, 1, 1, '#e8f4d8'], [142, y - 9, 1, 1, '#e8f4d8'])
  return boxes(o)
}
export function lampGlow(cx = 117 * P, cy = 150 * P, r = 300, a = 0.35) {
  return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={{ kind: 'radial', stops: [{ offset: 0, color: '#ffd23f', opacity: a }, { offset: 0.65, color: '#ffd23f', opacity: 0 }] }} />
}

// the school in the afternoon
export function schoolDay() {
  const o = [...bands(['#5d99ea', '#7fb0f0', '#a6c6f2', '#c3d1ef', '#e8c9c0'], -20, 150, -20, 190)]
  for (const [x, y] of [[10, 20], [90, 12], [60, 40], [120, 34]]) o.push([x, y, 16, 3, C.white], [x + 3, y - 2, 9, 2, C.white], [x + 2, y + 3, 12, 1, '#dfe8f8'])
  o.push(...skyline(-20, 150, 190, 9, ['#8ea4cf', '#9db0d8', '#7f95c4'], ['#c3d1ef']), [-20, 150, 190, 26, '#6f9a52'], [-20, 150, 190, 2, '#86b064'])
  o.push([10, 95, 124, 80, '#a0472a'], [8, 90, 128, 6, '#7a3420'], [50, 74, 44, 22, '#a0472a'], [48, 70, 48, 5, '#7a3420'])
  for (let y = 102; y < 160; y += 16) for (let x = 16; x < 130; x += 14) if (!(x > 60 && x < 84 && y > 140)) o.push([x, y, 9, 10, '#f4f0e8'], [x + 1, y + 1, 7, 8, '#5d99ea'], [x + 4, y + 1, 1, 8, '#f4f0e8'])
  o.push([62, 140, 20, 35, '#4a2e1c'], [64, 142, 7, 33, '#6a3e22'], [73, 142, 7, 33, '#6a3e22'], [56, 80, 32, 10, '#f4f0e8'], [64, 60, 1, 14, '#605f71'], [65, 60, 10, 6, '#d8323c'])
  o.push([-20, 175, 190, 30, '#a9a8bb'], [-20, 175, 190, 2, '#d4cede'], [-20, 205, 190, 70, '#605f71'])
  for (let x = -16; x < 170; x += 24) o.push([x, 230, 12, 2, '#d4cede'])
  for (const tx of [0, 134]) o.push([tx + 3, 150, 4, 26, '#5a3a22'], ...disc(tx + 5, 142, 12, '#3f7a5a'), ...disc(tx + 2, 138, 6, '#4f8a4f'))
  return boxes(o)
}

// a classroom: blackboard and front desks
export function classroom() {
  const o = [[-20, -20, 190, 220, '#c9b28a'], [-20, 150, 190, 4, '#a08860'], [10, 40, 124, 62, '#5a3a22'], [13, 43, 118, 56, '#24483a']]
  o.push([20, 52, 40, 2, '#e8e0c8'], [20, 58, 28, 2, '#e8e0c8'], [70, 52, 50, 2, '#e8e0c8'], [70, 60, 34, 2, '#e8e0c8'], [20, 80, 60, 2, '#e8e0c8'], [96, 84, 24, 6, '#e8e0c8'])
  o.push([10, 102, 124, 3, '#a08860'], [110, 14, 18, 18, '#f4f0e8'], [118, 17, 1, 8, C.ink], [118, 24, 6, 1, C.ink])
  o.push([-20, 200, 190, 80, '#7a5a40'])
  return boxes(o)
}
export function classDesks() {
  return boxes([[-10, 206, 70, 5, C.woodL], [-6, 211, 62, 30, C.wood], [84, 206, 70, 5, C.woodL], [88, 211, 62, 30, C.wood]])
}

// exam hall: grey wall, big clock, IELTS banner, floor
export function examHall() {
  const o = [[-20, -20, 190, 150, '#565468'], [-20, 100, 190, 24, '#4a4858'], [-20, 120, 190, 4, '#3a3848']]
  for (let x = -20; x < 170; x += 12) o.push([x, -20, 1, 120, '#5e5c72'])
  // tall windows with light
  for (const x of [-6, 34]) o.push([x, 18, 22, 72, '#3a3848'], [x + 2, 20, 18, 68, '#9ab4e0'], [x + 2, 20, 18, 8, '#c3d1ef'], [x + 10, 20, 2, 68, '#3a3848'], [x + 2, 52, 18, 2, '#3a3848'])
  // banner and clock
  o.push([60, 52, 76, 22, '#1d2448'], [62, 54, 72, 18, '#2e51a6'], [62, 54, 72, 3, '#c8402e'], [66, 60, 30, 3, '#f4f0e8'], [66, 65, 44, 2, '#c3d1ef'])
  o.push(...disc(124, 30, 12, '#2e2a3c'), ...disc(124, 30, 10, '#fffaf0'), [123, 22, 2, 9, C.ink], [124, 29, 6, 2, C.ink], [123, 29, 2, 2, C.red])
  // wall speakers (it is a listening test)
  for (const x of [92, 140]) o.push([x, 4, 12, 14, '#2e2a3c'], [x + 1, 5, 10, 12, '#3a3850'], ...disc(x + 6, 11, 3, '#1a1424'), [x + 5, 10, 2, 2, '#605f71'])
  // floor tiles with light from the windows
  o.push([-20, 124, 190, 150, '#2e2a3c'])
  for (let y = 124; y < 280; y += 12) for (let x = -20; x < 170; x += 12) if (((x + y) / 12) % 2 === 0) o.push([x, y, 12, 12, '#353144'])
  for (let k = 0; k < 4; k++) o.push([-6 + k * 6, 128 + k * 12, 26, 12, '#3e3a50'], [34 + k * 6, 128 + k * 12, 26, 12, '#3e3a50'])
  return boxes(o)
}
