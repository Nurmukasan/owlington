import { C, P, outlined, sprite, boxes } from './lib.jsx'

const HAIR = '#5a3a22', HAIRL = '#7a5232', SKIN = '#f2c29b', SKIND = '#d99a74', JEANS = '#3657a8', JEANSD = '#253d78'
const MOUTH = '#7a2e2a', TEETH = '#fff7ee', TONGUE = '#e8707e'

// face details shared by every front-facing person: eyes and mouth on a 16-wide head (face rows 4-10)
function face({ eyes = 'open', mouth = 'closed', ink = C.ink, lip = '#b0604f', x = 0 }) {
  const o = []
  const E = (dx) => {
    if (eyes === 'closed') o.push([dx - 1 + x, 8, 2, 1, ink, 1])
    else if (eyes === 'happy') o.push([dx - 1 + x, 8, 1, 1, ink, 1], [dx + x, 7, 1, 1, ink, 1], [dx + 1 + x, 8, 1, 1, ink, 1])
    else if (eyes === 'wide') o.push([dx - 1 + x, 6, 2, 3, '#ffffff', 1], [dx + x, 7, 1, 1, ink, 1])
    else if (eyes === 'side') o.push([dx + 1 + x, 7, 1, 2, ink, 1])
    else if (eyes === 'half') o.push([dx - 1 + x, 7, 2, 1, ink, 1], [dx + x, 8, 1, 1, ink, 1])
    else if (eyes === 'down') o.push([dx + x, 8, 1, 1, ink, 1])
    else if (eyes === 'fierce') o.push([dx - 1 + x, 6, 2, 1, ink, 1], [dx + x, 7, 1, 2, ink, 1])
    else o.push([dx + x, 7, 1, 2, ink, 1])
  }
  E(5); E(10)
  if (mouth === 'open') o.push([7 + x, 9, 2, 2, MOUTH, 1])
  else if (mouth === 'wide') o.push([6 + x, 9, 4, 2, MOUTH, 1], [6 + x, 9, 4, 1, TEETH, 1])
  else if (mouth === 'smile') o.push([6 + x, 10, 4, 1, MOUTH, 1], [5 + x, 9, 1, 1, MOUTH, 1], [10 + x, 9, 1, 1, MOUTH, 1])
  else if (mouth === 'grin') o.push([5 + x, 9, 6, 2, MOUTH, 1], [5 + x, 9, 6, 1, TEETH, 1])
  else if (mouth === 'th') o.push([6 + x, 9, 4, 2, MOUTH, 1], [6 + x, 9, 4, 1, TEETH, 1], [7 + x, 10, 2, 1, TONGUE, 1])
  else if (mouth === 'o') o.push([7 + x, 9, 2, 2, MOUTH, 1], [6 + x, 10, 1, 1, MOUTH, 1])
  else if (mouth === 'flat') o.push([6 + x, 10, 4, 1, MOUTH, 1])
  else o.push([7 + x, 9, 2, 1, lip, 1])
  return o
}

// Timur, front. mode: stand | arms (forearms on a desk) | phone (phone up in his right hand) | point | gesture
export function boyParts({ mode = 'stand', mouth = 'closed', eyes = 'open', phones = false, sweat = false, grey = false, saiyan = false, blush = false, bags = false } = {}) {
  const red = grey ? '#8d8b9c' : C.red, redD = grey ? '#6e6c7d' : C.redD
  const hair = saiyan === 1 ? '#d8a838' : saiyan ? '#ffd23f' : grey ? '#55536a' : HAIR, skin = grey ? '#b9b7c6' : SKIN
  if (mode === 'sleepdesk') {
    // asleep face-down on folded arms (on a desk/keyboard): back and shoulders, arms in front, head turned to the side
    const o = [
      [1, 11, 14, 7, red], [2, 11, 12, 1, redD, 1],
      [3, 7, 10, 8, skin], [3, 5, 10, 4, hair], [2, 6, 2, 7, hair], [3, 5, 6, 1, HAIRL, 1],
      [9, 11, 2, 1, C.ink, 1], [8, 12, 1, 1, bags ? '#a0708a' : skin, 1], [11, 13, 1, 2, '#9fd3ff', 1],
      [0, 15, 16, 5, red], [0, 15, 16, 1, '#e8505a', 1], [1, 18, 3, 2, skin], [12, 18, 3, 2, skin],
    ]
    if (phones) o.push([2, 3, 12, 2, '#2e2a3c'], [1, 7, 2, 5, '#2e2a3c'], [1, 8, 1, 3, C.mint, 1])
    return o
  }
  const parts = [
    [3, 1, 10, 5, hair], [2, 3, 1, 5, hair], [13, 3, 1, 4, hair],
    [3, 4, 10, 7, skin],
    [3, 2, 10, 3, hair], [3, 5, 3, 1, hair, 1], [8, 5, 4, 1, hair, 1], [4, 1, 6, 1, saiyan ? '#fff1a8' : grey ? '#6a687e' : HAIRL, 1],
    ...(saiyan === true || saiyan === 2 ? [
      [2, -1, 12, 3, hair], [0, -3, 3, 5, hair], [2, -6, 3, 6, hair], [4, -10, 3, 10, hair], [6, -13, 3, 13, hair], [9, -11, 3, 11, hair], [11, -8, 3, 8, hair], [13, -4, 3, 5, hair], [14, 0, 2, 4, hair], [-1, 1, 2, 4, hair],
      [5, -9, 1, 6, '#fff1a8', 1], [7, -12, 1, 8, '#fff1a8', 1], [10, -10, 1, 6, '#fff1a8', 1], [3, -5, 1, 3, '#fff1a8', 1],
      [5, 4, 2, 2, hair, 1], [9, 4, 1, 2, hair, 1]] : saiyan === 1 ? [[3, -1, 10, 3, hair], [4, -3, 2, 3, hair], [7, -4, 2, 4, hair], [10, -3, 2, 3, hair]] : []),
    ...face({ eyes, mouth }),
    [3, 9, 1, 1, '#f0a08a', 1], [12, 9, 1, 1, '#f0a08a', 1],
    [7, 11, 2, 1, SKIND],
    [3, 12, 10, 9, red], [4, 12, 8, 1, redD, 1], [6, 13, 1, 3, C.white, 1], [9, 13, 1, 3, C.white, 1],
    [11, 13, 2, 8, grey ? '#7a7888' : '#b82a34', 1], [3, 13, 1, 8, grey ? '#9a98aa' : '#e8505a', 1], [5, 18, 6, 1, redD, 1], [6, 19, 4, 1, grey ? '#7a7888' : '#c02e38', 1],
    [9, 2, 3, 1, grey ? '#6a687e' : HAIRL, 1], [4, 4, 9, 1, grey ? '#a9a7b6' : '#e8b08c', 1],
  ]
  if (phones) parts.push([3, -1, 10, 2, '#2e2a3c'], [4, -1, 6, 1, '#4a4660', 1], [2, 0, 2, 2, '#2e2a3c'], [12, 0, 2, 2, '#2e2a3c'], [1, 5, 2, 5, '#2e2a3c'], [13, 5, 2, 5, '#2e2a3c'], [1, 6, 1, 3, C.mint, 1], [14, 6, 1, 3, C.mint, 1], [2, 5, 1, 1, '#605f71', 1], [13, 5, 1, 1, '#605f71', 1])
  if (saiyan) parts.push([4, 6, 3, 1, hair, 1], [9, 6, 3, 1, hair, 1])
  if (blush) parts.push([3, 9, 2, 1, '#f07a7a', 1], [11, 9, 2, 1, '#f07a7a', 1])
  if (sweat) parts.push([14, 3, 1, 2, '#9fd3ff'], [14, 5, 1, 1, '#ffffff', 1])
  if (bags) parts.push([4, 9, 2, 1, '#a0708a', 1], [10, 9, 2, 1, '#a0708a', 1])
  const legs = () => parts.push([4, 21, 8, 7, JEANS], [7, 23, 2, 5, JEANSD, 1], [3, 28, 4, 2, C.white], [9, 28, 4, 2, C.white])
  if (mode === 'game') {
    parts.push([1, 13, 2, 5, red], [13, 13, 2, 5, red], [2, 17, 3, 3, skin], [11, 17, 3, 3, skin], [4, 16, 8, 4, '#1a1424'], [5, 17, 6, 2, '#5d99ea', 1], [6, 17, 2, 1, '#ffd23f', 1])
  } else if (mode === 'write') {
    // left forearm on the desk, right hand holding a pen on the page
    parts.push([1, 13, 2, 7, red], [13, 13, 2, 5, red], [2, 19, 4, 2, skin], [11, 17, 3, 2, red], [10, 18, 3, 2, skin], [9, 15, 1, 4, '#2e51a6'], [9, 14, 1, 1, '#f4f0e8'])
  } else if (mode === 'arms') {
    parts.push([1, 13, 2, 7, red], [13, 13, 2, 7, red], [2, 19, 4, 2, skin], [10, 19, 4, 2, skin])
  } else if (mode === 'phone') {
    // left arm down; right arm bent up holding a phone beside his face, its back to us
    parts.push([1, 13, 2, 8, red], [13, 13, 2, 5, red], [14, 10, 2, 4, red], [14, 8, 2, 2, skin],
      [15, 3, 4, 7, '#1a1424'], [16, 4, 1, 1, '#605f71', 1], [17, 9, 1, 1, '#d8323c', 1])
  } else if (mode === 'point') {
    parts.push([1, 12, 2, 8, red], [1, 20, 2, 2, skin], [13, 13, 7, 2, red], [20, 13, 2, 2, skin], [22, 13, 1, 1, skin]); legs()
  } else if (mode === 'gesture') {
    parts.push([13, 12, 2, 8, red], [13, 20, 2, 2, skin], [0, 12, 2, 5, red], [-1, 9, 3, 3, skin]); legs()
  } else if (mode === 'sit') {
    parts.push([1, 13, 2, 7, red], [13, 13, 2, 7, red], [2, 19, 4, 2, skin], [10, 19, 4, 2, skin], [4, 21, 8, 3, JEANS])
  } else {
    parts.push([5, 17, 6, 2, redD, 1], [1, 12, 2, 8, red], [13, 12, 2, 8, red], [1, 20, 2, 2, skin], [13, 20, 2, 2, skin]); legs()
  }
  return parts
}
export const Boy = ({ x, y, p = P, ...o }) => outlined(boyParts(o), x, y, p)

// Timur from behind (over-the-shoulder shots)
export const BoyBack = ({ x, y, p = P, phones = false }) => outlined([
  [3, 1, 10, 10, HAIR], [2, 3, 1, 6, HAIR], [13, 3, 1, 6, HAIR], [4, 1, 6, 1, HAIRL, 1], [5, 9, 6, 2, '#4a2e1a', 1],
  [2, 6, 1, 2, SKIN, 1], [13, 6, 1, 2, SKIN, 1], [6, 11, 4, 1, SKIND],
  [0, 12, 16, 12, C.red], [4, 12, 8, 4, C.redD, 1], [5, 13, 6, 2, '#b82a34', 1],
  ...(phones ? [[2, -1, 12, 2, '#2e2a3c'], [1, 5, 2, 5, '#2e2a3c'], [13, 5, 2, 5, '#2e2a3c']] : []),
], x, y, p)

// the IELTS examiner: dark bob, glasses, navy blazer; seated with hands on the table
export function examinerParts({ mouth = 'closed', eyes = 'open' } = {}) {
  const hair = '#2a1c18', skin = '#e8b48c'
  return [
    [3, 1, 10, 4, hair], [2, 2, 12, 3, hair], [2, 4, 2, 8, hair], [12, 4, 2, 8, hair],
    [4, 4, 8, 7, skin], [4, 4, 4, 1, hair, 1], [9, 4, 3, 1, hair, 1],
    ...face({ eyes, mouth, lip: '#a0524a' }).filter(([x]) => x > 3 && x < 12),
    [4, 6, 3, 1, '#2e2a3c', 1], [9, 6, 3, 1, '#2e2a3c', 1], [7, 6, 2, 1, '#2e2a3c', 1], [4, 6, 1, 3, '#2e2a3c', 1], [11, 6, 1, 3, '#2e2a3c', 1],
    [2, 9, 1, 1, C.gold, 1], [13, 9, 1, 1, C.gold, 1], [7, 11, 2, 1, '#c98c6a'],
    [3, 12, 10, 9, '#25305c'], [6, 12, 4, 3, C.white, 1], [7, 15, 2, 1, C.white, 1], [4, 13, 1, 6, '#1d2448', 1], [11, 13, 1, 6, '#1d2448', 1],
    [1, 13, 2, 7, '#25305c'], [13, 13, 2, 7, '#25305c'], [2, 19, 4, 2, skin], [10, 19, 4, 2, skin],
  ]
}
export const Examiner = ({ x, y, p = P, ...o }) => outlined(examinerParts(o), x, y, p)
export const ExaminerBack = ({ x, y, p = P }) => outlined([
  [3, 1, 10, 4, '#2a1c18'], [2, 2, 12, 10, '#2a1c18'], [4, 2, 5, 1, '#3e2a24', 1], [6, 11, 4, 1, '#c98c6a'],
  [0, 12, 16, 12, '#25305c'], [7, 12, 2, 12, '#1d2448', 1],
], x, y, p)

// Jake from Manchester: ginger mop, freckles, green hoodie (head and shoulders for the call)
export function jakeParts({ mouth = 'closed', eyes = 'open', brow = 'flat' } = {}) {
  const hair = '#d0702a', hairL = '#ec9a4a', skin = '#f6d6be'
  const o = [
    [3, 1, 10, 4, hair], [2, 2, 12, 3, hair], [2, 3, 1, 5, hair], [13, 3, 1, 5, hair], [4, 0, 3, 1, hair], [9, 0, 3, 1, hair], [6, -1, 2, 1, hair],
    [3, 4, 10, 7, skin], [3, 4, 2, 1, hair, 1], [7, 4, 3, 1, hair, 1], [5, 1, 4, 1, hairL, 1],
    ...face({ eyes, mouth, lip: '#c0685a' }),
    [4, 9, 1, 1, '#e0a07a', 1], [11, 9, 1, 1, '#e0a07a', 1], [5, 10, 1, 1, '#e0a07a', 1], [10, 10, 1, 1, '#e0a07a', 1],
    [7, 11, 2, 1, '#e0b090'],
    [2, 12, 12, 9, '#3f7a5a'], [4, 12, 8, 2, '#2f6248', 1], [6, 14, 1, 3, C.white, 1], [9, 14, 1, 3, C.white, 1], [0, 14, 2, 7, '#3f7a5a'], [14, 14, 2, 7, '#3f7a5a'],
  ]
  if (brow === 'up') o.push([9, 5, 3, 1, hair, 1], [4, 6, 3, 1, '#b8602a', 1])
  else if (brow === 'happy') o.push([4, 6, 3, 1, '#b8602a', 1], [9, 6, 3, 1, '#b8602a', 1])
  return o
}
export const Jake = ({ x, y, p = P, ...o }) => outlined(jakeParts(o), x, y, p)

// the tourist: blonde ponytail, cap, backpack straps, a city map open in both hands
export function touristParts({ mouth = 'closed', eyes = 'open' } = {}) {
  const hair = '#e8c060', skin = '#f2c8a8'
  return [
    [3, 1, 10, 3, '#2e51a6'], [2, 3, 13, 1, '#2e51a6'], [13, 3, 3, 1, '#25305c'],
    [3, 4, 10, 7, skin], [2, 4, 1, 6, hair], [13, 4, 1, 4, hair], [14, 5, 2, 6, hair], [3, 4, 10, 1, hair, 1],
    ...face({ eyes, mouth, lip: '#c0685a' }), [3, 9, 1, 1, '#f0a08a', 1], [12, 9, 1, 1, '#f0a08a', 1],
    [7, 11, 2, 1, '#d9a082'],
    [3, 12, 10, 9, '#3a8a8a'], [4, 12, 1, 9, '#c8402e', 1], [11, 12, 1, 9, '#c8402e', 1],
    [1, 13, 2, 5, '#3a8a8a'], [13, 13, 2, 5, '#3a8a8a'],
    [0, 15, 16, 7, '#f0e2b6'], [0, 15, 16, 1, '#d8c89a', 1], [8, 15, 1, 7, '#c8b88a', 1], [2, 17, 4, 1, '#8ab0d0', 1], [10, 18, 4, 1, '#c86a5a', 1], [3, 19, 1, 2, '#6fa06a', 1], [12, 16, 1, 1, '#d8323c', 1],
    [-1, 16, 2, 3, skin], [15, 16, 2, 3, skin],
    [4, 22, 8, 6, '#b39a6a'], [7, 24, 2, 4, '#9a845a', 1], [4, 28, 3, 2, '#f4f0e8'], [9, 28, 3, 2, '#f4f0e8'],
  ]
}
export const Tourist = ({ x, y, p = P, ...o }) => outlined(touristParts(o), x, y, p)

// generic seated person (bus, club): head + torso. look: -1 left, 0 ahead, 1 right
export function personParts({ hair = '#2a1c18', style = 'short', skin = '#e8b48c', shirt = '#605f71', look = 0, mouth = 'closed', glasses = false, eyes = 'open', phones = false } = {}) {
  const o = [[3, 4, 10, 7, skin]]
  if (style === 'long') o.push([3, 1, 10, 4, hair], [2, 2, 12, 3, hair], [2, 4, 2, 9, hair], [12, 4, 2, 9, hair])
  else if (style === 'bun') o.push([5, -1, 6, 2, hair], [3, 1, 10, 4, hair], [2, 3, 1, 4, hair], [13, 3, 1, 4, hair])
  else if (style === 'scarf') o.push([2, 1, 12, 5, hair], [2, 4, 1, 8, hair], [13, 4, 1, 8, hair], [3, 10, 10, 2, hair])
  else if (style === 'bald') o.push([3, 2, 10, 3, skin], [2, 5, 1, 3, '#8a8a8a'], [13, 5, 1, 3, '#8a8a8a'])
  else o.push([3, 1, 10, 4, hair], [2, 3, 1, 4, hair], [13, 3, 1, 4, hair])
  o.push(...face({ eyes: look ? 'open' : eyes, mouth, x: look }).filter(([x]) => x > 3 && x < 12 + look))
  if (glasses) o.push([4 + look, 7, 3, 1, '#2e2a3c', 1], [9 + look, 7, 3, 1, '#2e2a3c', 1])
  o.push([6, 11, 4, 1, skin], [2, 12, 12, 10, shirt], [6, 12, 4, 2, '#00000033', 1], [11, 13, 3, 9, '#00000030', 1], [2, 13, 1, 9, '#ffffff22', 1])
  if (phones) o.push([3, -1, 10, 2, '#2e2a3c'], [1, 5, 2, 5, '#2e2a3c'], [13, 5, 2, 5, '#2e2a3c'])
  return o
}
export const Person = ({ x, y, p = P, ...o }) => outlined(personParts(o), x, y, p)
// a person seen from behind (audience foreground)
export const PersonBack = ({ x, y, p = P, hair = '#2a1c18', shirt = '#3a3848', style = 'short' }) => outlined([
  ...(style === 'long' ? [[2, 1, 12, 12, hair]] : style === 'bun' ? [[5, -1, 6, 2, hair], [3, 1, 10, 10, hair]] : [[3, 1, 10, 10, hair], [2, 3, 1, 6, hair], [13, 3, 1, 6, hair]]),
  [0, 12, 16, 12, shirt],
], x, y, p)

// the Owlington owl, from the site's own sprite (src/scene/sprites.ts)
const OWL_PAL = { o: '#1e120c', b: '#7f5236', d: '#523220', l: '#ecd0a2', m: '#b98b5c', w: '#f3e3c3', y: '#ffb627', k: '#120c08', h: '#ffffff', n: '#f08a24', f: '#e09a34', r: '#c8404a' }
const OWL = [
  '..o..........o..', '..oo........oo..', '..obo......obo..', '.obbboooooobbbo.', '.obbbbbbbbbbbbo.', 'obbwwwwbbwwwwbbo',
  'obwyyyywwyyyywbo', 'obwyhkywwyhkywbo', 'obwykkynnykkywbo', 'obwyyyynnyyyywbo', 'obbbwwwnnwwwbbbo', 'odbbbllllllbbbdo',
  'oddblmlmmlmlbddo', 'oddbllmllmllbddo', 'oddbllllllllbddo', 'oddblmlmmlmlbddo', 'oddbllmllmllbddo', '.oddbllllllbddo.',
  '..oddbbbbbbddo..', '...ooffooffoo...',
]
// eyes: open|closed|happy|sad|wide; ears: wings pressed over the ear tufts; beak: open beak (trying "th")
export function owlRows({ eyes = 'open', look = 0, wing = false, ears = false, beak = false } = {}) {
  const r = OWL.map((s) => s.split(''))
  for (const x0 of [3, 9]) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    let ch = 'y'
    if (eyes === 'closed') ch = ['wwww', 'wwww', 'oooo', 'wwww'][i][j]
    else if (eyes === 'happy') ch = ['wwww', 'woow', 'owwo', 'wwww'][i][j]
    else if (eyes === 'sad') ch = ['oooo', 'yyyy', 'ykky', 'yyyy'][i][j]
    else if (eyes === 'squint') ch = ['wwww', 'oooo', 'yyyy', 'wwww'][i][j]
    else if (eyes === 'wink' && x0 === 3) ch = ['wwww', 'wwww', 'oooo', 'wwww'][i][j]
    else if (i === 1 || i === 2) { const p0 = 1 + look; if (j === p0) ch = i === 1 ? 'h' : 'k'; else if (j === p0 + 1) ch = 'k' }
    r[6 + i][x0 + j] = ch
  }
  if (beak) { r[9][7] = 'r'; r[9][8] = 'r'; r[10][7] = 'n'; r[10][8] = 'n' }
  if (wing) { r[9][15] = 'o'; r[8][15] = 'o'; r[10][15] = 'd'; r[10][14] = 'd'; r[9][14] = 'd' }
  let rows = r.map((s) => s.join(''))
  if (ears) {
    // both wings swing up and cover the sides of the head
    rows = rows.map((s) => '..' + s + '..')
    const put = (y, x, str) => { const a = rows[y].split(''); for (let k = 0; k < str.length; k++) if (str[k] !== ' ') a[x + k] = str[k]; rows[y] = a.join('') }
    for (let y = 1; y <= 9; y++) { put(y, 0, y === 1 ? '.oo' : y === 9 ? '.odd' : 'oddd'); put(y, 16, y === 1 ? 'oo.' : y === 9 ? 'ddo.' : 'dddo') }
    for (let y = 2; y <= 8; y++) { put(y, 3, 'o'); put(y, 16, 'o') }
  }
  return rows
}
export const Owl = ({ x, y, p = P, ...o }) => sprite(owlRows(o), OWL_PAL, o.ears ? x - 2 * p : x, y, p)

// Margaret, retired teacher from Edinburgh: silver bun, round glasses, lilac cardigan, pearls
export function margaretParts({ mouth = 'closed', eyes = 'open', brow = 'flat' } = {}) {
  const hair = '#d8d4e0', hairD = '#b4b0c0', skin = '#f0c8b0'
  const o = [
    [5, -2, 6, 3, hair], [3, 1, 10, 4, hair], [2, 3, 1, 5, hair], [13, 3, 1, 5, hair], [6, -2, 3, 1, '#ffffff', 1], [4, 2, 8, 1, hairD, 1],
    [3, 4, 10, 7, skin], [3, 4, 3, 1, hair, 1], [10, 4, 3, 1, hair, 1],
    ...face({ eyes, mouth, lip: '#b0505a' }),
    [3, 7, 4, 2, '#00000000'], [4, 6, 3, 1, '#8a6a3a', 1], [9, 6, 3, 1, '#8a6a3a', 1], [3, 7, 1, 2, '#8a6a3a', 1], [6, 7, 1, 2, '#8a6a3a', 1], [9, 7, 1, 2, '#8a6a3a', 1], [12, 7, 1, 2, '#8a6a3a', 1], [7, 7, 2, 1, '#8a6a3a', 1],
    [4, 10, 1, 1, '#e0a090', 1], [11, 10, 1, 1, '#e0a090', 1],
    [6, 11, 4, 1, '#dcae96'],
    [2, 12, 12, 9, '#8a6aa8'], [5, 12, 6, 3, '#f4f0e8', 1], [5, 14, 1, 1, '#ffffff', 1], [7, 15, 1, 1, '#ffffff', 1], [9, 14, 1, 1, '#ffffff', 1], [10, 12, 1, 1, '#ffffff', 1], [5, 12, 1, 1, '#ffffff', 1],
    [3, 16, 1, 1, '#6a4a88', 1], [3, 18, 1, 1, '#6a4a88', 1], [0, 13, 2, 7, '#8a6aa8'], [14, 13, 2, 7, '#8a6aa8'], [1, 19, 4, 2, skin], [11, 19, 4, 2, skin],
  ]
  if (brow === 'up') o.push([9, 5, 3, 1, hairD, 1])
  return o
}
export const Margaret = ({ x, y, p = P, ...o }) => outlined(margaretParts(o), x, y, p)

// the invigilator: grey hair, suit, standing, a clipboard
export const Invigilator = ({ x, y, p = P, mouth = 'closed' }) => outlined([
  [3, 1, 10, 4, '#8d8b9c'], [2, 3, 1, 4, '#8d8b9c'], [13, 3, 1, 4, '#8d8b9c'], [3, 4, 10, 7, '#e8b48c'], [3, 4, 10, 1, '#8d8b9c', 1],
  ...face({ mouth, lip: '#a0524a' }), [7, 11, 2, 1, '#c98c6a'],
  [3, 12, 10, 10, '#2e2a3c'], [6, 12, 4, 4, C.white, 1], [7, 13, 2, 4, '#d8323c', 1], [1, 12, 2, 9, '#2e2a3c'], [13, 12, 2, 6, '#2e2a3c'],
  [12, 16, 5, 6, '#c8a878'], [13, 17, 3, 1, C.white, 1], [13, 19, 3, 1, C.white, 1], [1, 21, 2, 2, '#e8b48c'],
  [4, 22, 8, 7, '#2e2a3c'], [7, 24, 2, 5, '#1d1a28', 1], [3, 29, 4, 2, C.ink], [9, 29, 4, 2, C.ink],
], x, y, p)

// the English teacher (green cardigan), holding Timur's essay
export const Teacher = ({ x, y, p = P, mouth = 'closed' }) => outlined([
  [4, 0, 6, 3, '#3a2418'], [3, 2, 10, 4, '#3a2418'], [2, 4, 2, 7, '#3a2418'], [12, 4, 2, 7, '#3a2418'], [4, 4, 8, 7, '#e8b48c'], [4, 4, 8, 1, '#3a2418', 1],
  ...face({ mouth, lip: '#a0524a' }).filter(([x]) => x > 3 && x < 12), [7, 11, 2, 1, '#c98c6a'],
  [3, 12, 10, 10, '#3f7a5a'], [6, 12, 4, 3, C.white, 1], [1, 13, 2, 6, '#3f7a5a'], [13, 13, 2, 6, '#3f7a5a'],
  [-1, 16, 18, 8, '#f4ead2'], [0, 18, 7, 1, '#7a6a50', 1], [0, 20, 6, 1, '#7a6a50', 1], [9, 18, 7, 1, '#7a6a50', 1], [9, 20, 5, 1, '#7a6a50', 1], [8, 16, 1, 8, '#d8c89a', 1],
  [-2, 18, 2, 3, '#e8b48c'], [16, 18, 2, 3, '#e8b48c'],
  [4, 24, 8, 5, '#2e2a3c'], [4, 29, 3, 2, C.ink], [9, 29, 3, 2, C.ink],
], x, y, p)

// Timur's mum: dark bun, apron, hands on hips, standing in a doorway
export const Mom = ({ x, y, p = P, mouth = 'closed', eyes = 'open' }) => outlined([
  [5, -2, 6, 3, '#2a1c18'], [3, 1, 10, 4, '#2a1c18'], [2, 3, 1, 5, '#2a1c18'], [13, 3, 1, 5, '#2a1c18'],
  [3, 4, 10, 7, '#f0c0a0'], [3, 4, 10, 1, '#2a1c18', 1],
  ...face({ eyes, mouth, lip: '#b0505a' }), [6, 11, 4, 1, '#d8a888'],
  [3, 12, 10, 10, '#c8504a'], [4, 13, 8, 9, '#f4f0e8', 1], [5, 12, 1, 2, '#f4f0e8', 1], [10, 12, 1, 2, '#f4f0e8', 1], [6, 16, 4, 3, '#e8dcc8', 1], [10, 13, 2, 9, '#ddd6c8', 1], [7, 20, 1, 2, '#ddd6c8', 1], [4, 21, 8, 1, '#c8504a', 1], [6, 3, 4, 1, '#4a3428', 1],
  [0, 12, 3, 4, '#c8504a'], [-1, 15, 3, 3, '#f0c0a0'], [13, 12, 3, 4, '#c8504a'], [14, 15, 3, 3, '#f0c0a0'],
  [3, 22, 10, 6, '#3a3a50'], [4, 28, 3, 2, C.ink], [9, 28, 3, 2, C.ink],
], x, y, p)
