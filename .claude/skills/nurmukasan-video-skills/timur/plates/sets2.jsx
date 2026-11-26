import { W, H, C, P, boxes } from './lib.jsx'
import { bands, stars, disc, skyline } from './sets.jsx'

let s = 11
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)
const seed = (n) => { s = n }

// IELTS speaking room by day: pale wall, blinds, wall clock, plant, table along the bottom
export function examRoom({ tableY = 170 } = {}) {
  const o = [[-20, -20, 190, 300, '#b9b3c9']]
  for (let x = -20; x < 170; x += 12) o.push([x, -20, 1, tableY + 20, '#aea8bf'])
  o.push([-20, 120, 190, 3, '#8f89a3'], [-20, 123, 190, 60, '#9b94ad'])
  // window with blinds, daylight
  o.push([8, 20, 50, 62, '#e8e0f0'], [10, 22, 46, 58, '#9cc4f0'])
  o.push(...skyline(10, 80, 46, 7, ['#c8d8f0', '#b8cceb', '#d0dcf2'], ['#e8f0ff']))
  for (let y = 24; y < 80; y += 5) o.push([10, y, 46, 2, '#e8e0f0'])
  o.push([31, 20, 2, 62, '#d8d0e4'], [6, 82, 54, 3, '#d8d0e4'])
  // clock
  o.push(...disc(118, 34, 11, '#2e2a3c'), ...disc(118, 34, 9, '#fffaf0'), [117, 27, 2, 8, C.ink], [118, 33, 6, 2, C.ink], [117, 33, 2, 2, C.red])
  // sign on the wall
  o.push([88, 64, 50, 22, '#2e51a6'], [90, 66, 46, 18, '#25305c'])
  // plant
  o.push([130, 100, 12, 20, '#c8704a'], [128, 98, 16, 4, '#a85a3a'], ...disc(136, 88, 8, '#3f7a5a'), ...disc(132, 82, 5, '#4f8a4f'), ...disc(140, 84, 4, '#4f8a4f'))
  // table: top + front
  o.push([-20, tableY, 190, 5, '#c08a55'], [-20, tableY + 5, 190, 3, '#8a5a32'], [-20, tableY + 8, 190, 90, '#6e4628'])
  for (let x = -20; x < 170; x += 30) o.push([x, tableY + 8, 1, 90, '#5e3a20'])
  return boxes(o)
}
// things on the exam table: voice recorder with a red light, papers, a glass of water
export const examProps = (tableY = 170, rec = true) => boxes([
  [96, tableY - 6, 18, 7, '#2e2a3c'], [98, tableY - 5, 10, 3, '#605f71'], ...(rec ? [[110, tableY - 5, 2, 2, '#ff4a4a']] : [[110, tableY - 5, 2, 2, '#5a2a2a']]),
  [26, tableY - 2, 26, 3, '#f4f0e8'], [28, tableY - 3, 22, 1, '#e4dcc8'], [30, tableY - 1, 14, 1, '#9a8c70'],
  [62, tableY - 12, 7, 12, '#cfe6f6'], [63, tableY - 8, 5, 7, '#9cc4f0'],
])

// laptop on the desk, seen from behind its lid, an owl sticker on it; screen light spills up
export const laptopBack = (y = 182) => boxes([
  [52, y - 16, 42, 16, '#2e2a3c'], [53, y - 15, 40, 14, '#a9a8bb'], [54, y - 14, 38, 1, '#c8c6d6'],
  [69, y - 12, 6, 7, '#7f5236'], [70, y - 11, 4, 2, '#ffb627'], [70, y - 9, 4, 3, '#ecd0a2'], [71, y - 11, 1, 1, '#120c08'], [73, y - 11, 1, 1, '#120c08'],
  [48, y - 1, 50, 2, '#605f71'],
])
// a phone propped on books, pointing at him, red REC dot
export const phoneTripod = (y = 182) => boxes([
  [60, y - 8, 26, 8, '#3a6ea5'], [62, y - 7, 22, 1, '#e8dcbc'], [61, y - 14, 24, 6, '#c8402e'], [62, y - 13, 22, 1, '#e8dcbc'],
  [66, y - 34, 14, 20, '#1a1424'], [72, y - 33, 2, 2, '#605f71'], [76, y - 31, 2, 2, '#ff4a4a'],
])

// Jake's room in Manchester, late afternoon, rain on the window
export function jakeRoom(x0, y0, w, h, p) {
  const o = [[0, 0, w, h, '#6a4a5a']]
  for (let x = 0; x < w; x += 8) o.push([x, 0, 1, h, '#5e4050'])
  o.push([w - 34, 8, 28, 36, '#3a2a30'], [w - 32, 10, 24, 32, '#5a7090'])
  seed(5); for (let i = 0; i < 26; i++) { const x = w - 31 + Math.floor(rnd() * 22), y = 11 + Math.floor(rnd() * 26); o.push([x, y, 1, 3, '#a8c0dc']) }
  o.push([w - 21, 10, 1, 32, '#3a2a30'], [w - 32, 25, 24, 1, '#3a2a30'], [w - 36, 44, 32, 3, '#8a6a50'])
  o.push([6, 10, 18, 24, '#e8e0c8'], [8, 12, 14, 12, '#d8323c'], [10, 14, 10, 8, '#f4f0e8'], [8, 26, 14, 2, '#2e2a3c'], [8, 30, 9, 1, '#605f71'])
  o.push([4, h - 12, 12, 10, '#f4f0e8'], [16, h - 10, 3, 5, '#f4f0e8'], [5, h - 11, 10, 3, '#8a5a32'])
  return boxes(o, x0, y0, p)
}

// bathroom: tiles, a mirror with a frame, a sink edge at the bottom
export function bathroom() {
  const o = [[-20, -20, 190, 300, '#8fb8c8']]
  for (let y = -20; y < 280; y += 10) o.push([-20, y, 190, 1, '#7aa4b6'])
  for (let y = -20; y < 280; y += 20) for (let x = -20; x < 170; x += 10) o.push([x + ((y / 10) % 2 ? 5 : 0), y, 1, 10, '#7aa4b6'])
  o.push([14, 18, 116, 164, '#d4cede'], [17, 21, 110, 158, '#c3d1ef'], [17, 21, 110, 158, '#3a4a6a'])
  o.push([20, 24, 30, 2, '#5a6a8a'], [20, 24, 2, 30, '#5a6a8a'])
  o.push([-20, 196, 190, 8, '#f4f0e8'], [-20, 204, 190, 4, '#d4cede'], [-20, 208, 190, 70, '#6a8a9a'])
  o.push([60, 186, 4, 10, '#a9a8bb'], [56, 184, 16, 3, '#d4cede'], [110, 186, 8, 10, '#f2a541'], [111, 184, 6, 2, '#d8323c'])
  return boxes(o)
}
// the mirror's inside: Timur's own room-light glow
export const mirrorInside = () => boxes([[17, 21, 110, 158, '#2f3d5c'], [20, 24, 28, 2, '#56688e'], [20, 24, 2, 28, '#56688e'], [110, 150, 14, 2, '#56688e']])

// speaking club hall: warm wall, banner, string lights, wooden floor
export function clubHall() {
  const o = [[-20, -20, 190, 300, '#5a3e5a']]
  for (let x = -20; x < 170; x += 14) o.push([x, -20, 6, 150, '#644566'])
  o.push([18, 18, 108, 26, '#2e2a3c'], [20, 20, 104, 22, '#d8323c'], [20, 38, 104, 4, '#9e1f2c'])
  seed(9); for (let x = -16; x < 170; x += 9) { const y = 8 + Math.round(3 * Math.sin(x / 9)); o.push([x, y, 2, 2, ['#ffd23f', '#7bc188', '#5d99ea', '#f2a541'][Math.floor(rnd() * 4)]]) }
  o.push([-20, 130, 190, 150, '#7a5232'])
  for (let y = 134; y < 280; y += 8) o.push([-20, y, 190, 1, '#6a4428'])
  return boxes(o)
}

// a sunny street with a bus stop (route 12), a road and a crossing
export function busStopStreet() {
  const o = [...bands(['#7fb0f0', '#a6c6f2', '#c3d1ef'], -20, 120, -20, 190)]
  for (const [x, y] of [[14, 22], [96, 14], [60, 40]]) o.push([x, y, 16, 3, C.white], [x + 3, y - 2, 9, 2, C.white])
  o.push(...skyline(-20, 120, 190, 4, ['#c8a888', '#b89878', '#d8b898'], ['#7fb0f0']))
  o.push([-20, 120, 190, 6, '#8a7a6a'])
  // shop fronts
  o.push([-20, 126, 70, 56, '#d8c8a8'], [-14, 132, 26, 26, '#9cc4f0'], [16, 132, 26, 40, '#5a3a22'], [-20, 126, 70, 4, '#c8402e'])
  o.push([50, 126, 46, 56, '#a89cb8'], [56, 134, 14, 14, '#9cc4f0'], [76, 134, 14, 14, '#9cc4f0'], [50, 126, 46, 3, '#8a7a9a'])
  o.push([96, 126, 74, 56, '#c8b8d8'], [102, 132, 30, 26, '#9cc4f0'], [136, 132, 20, 40, '#3a3a50'], [96, 126, 74, 4, '#2e51a6'])
  // pavement
  o.push([-20, 182, 190, 36, '#c9c3d1'], [-20, 182, 190, 2, '#e4e0ea'])
  for (let x = -20; x < 170; x += 16) o.push([x, 184, 1, 34, '#b4aec0'])
  o.push([-20, 218, 190, 4, '#8a8a9a'], [-20, 222, 190, 60, '#4a4a5a'])
  for (let x = -10; x < 170; x += 26) o.push([x, 246, 14, 2, '#e8e4ee'])
  // bus stop shelter (right) and the route sign "12"
  o.push([104, 120, 3, 66, '#2e2a3c'], [152, 120, 3, 66, '#2e2a3c'], [102, 116, 56, 5, '#2e2a3c'], [107, 122, 45, 40, '#dceaf6'], [109, 168, 41, 4, '#605f71'])
  o.push([92, 120, 2, 66, '#605f71'], [86, 102, 14, 18, '#2e51a6'], [87, 103, 12, 16, '#f4f0e8'], [88, 104, 10, 6, '#2e51a6'])
  return boxes(o)
}
