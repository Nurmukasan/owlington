// Backdrops for "60 days of vocabulary only" (universe #5), rendered at 2x and used as stills in the edit.
import { W, H, C, P, boxes } from './lib.jsx'
import { Boy, BoyBack, Owl, Examiner, ExaminerBack, Jake, Person, Mom, Invigilator, Teacher } from './chars.jsx'
import { bedroomNight, deskFront, lampGlow, examHall, classroom, classDesks, disc, stars, bands, skyline } from './sets.jsx'
import { examRoom, examProps, laptopBack, jakeRoom, bathroom, mirrorInside } from './sets2.jsx'
let s = 1
const seed = (k) => { s = k * 7919 + 13 }
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)

const glow = (cx, cy, r, col, a) => <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={{ kind: 'radial', stops: [{ offset: 0, color: col, opacity: a }, { offset: 0.65, color: col, opacity: 0 }] }} />

// flashcards: cream / yellow / blue / pink / green, a dark outline and two "text" lines
const CARD = ['#fbf7ec', '#fff3b0', '#d8ecff', '#ffd8e0', '#d8f5dc']
const card = (x, y, k = 0, w = 11, h = 7) => [[x - 1, y - 1, w + 2, h + 2, '#1a1424'], [x, y, w, h, CARD[k % 5]], [x + 2, y + 2, w - 4, 1, '#6a6070'], [x + 2, y + 4, w - 6, 1, '#a89aa0']]
// a stack of cards on the desk, seen from the front: n thin layers + the top card
const pile = (x, y, n, k = 0, w = 16) => {
  const o = [[x - 1, y - n - 3, w + 2, n + 4, '#1a1424']]
  for (let i = 0; i < n; i++) o.push([x + (i % 3 === 1 ? 1 : 0), y - i - 1, w - 1, 1, i % 2 ? '#e8dcc0' : CARD[(k + i) % 5]])
  o.push([x, y - n - 2, w, 2, CARD[k % 5]])
  return o
}
// a card lying ON the owl's head (in owl-sprite pixels: rows 0.5-4.5 over the forehead, tape strip down onto the head)
const cardOnOwl = (x, y, p, k = 3) => boxes([[3, 0.5, 10, 4, '#1a1424'], [3.5, 1, 9, 3, CARD[k]], [4.5, 1.8, 6, 0.5, '#6a6070'], [4.5, 2.8, 4, 0.5, '#a89aa0'], [7, 3.8, 2, 1.4, '#d4d4e0']], x, y, p)
// a card lying flat on the desk top (seen edge-on)
const flat = (x, y, k = 0) => [[x - 1, y - 2, 14, 3, '#1a1424'], [x, y - 1, 12, 1, CARD[k % 5]]]
// cards stuck all over the bedroom wall (week 2+)
const WALL = [[4, 84], [18, 90], [34, 82], [48, 92], [62, 86], [8, 104], [24, 110], [40, 102], [56, 108], [10, 124], [28, 128], [46, 122], [62, 130], [60, 34],
  [88, 104], [104, 110], [120, 104], [134, 112], [96, 124], [116, 128], [136, 130], [12, 140], [32, 146], [70, 120]]
const wallCards = (n = WALL.length) => WALL.slice(0, n).flatMap(([x, y], i) => card(x, y, i))

// 1. night room: Timur at the desk with flashcards; level = how many cards (1 a few, 2 piles, 3 towers + wall)
const room = ({ level = 1, wall = 0, owl = 'open', owlCard = false, held = true, ...o } = {}) => {
  const out = [bedroomNight(), lampGlow(600, 840, 360, 0.34)]
  if (wall) out.push(boxes(wallCards(wall)))
  out.push(Boy({ x: 280, y: 700, p: 10, mode: 'write', ...o }), deskFront({ y: 182 }))
  const d = []
  const N = level === 1 ? [3, 5] : level === 2 ? [12, 16] : [26, 30]
  d.push(...pile(36, 181, N[0], 0), ...pile(96, 181, N[1], 2))
  if (level >= 2) d.push(...pile(14, 181, N[0] - 4, 3, 14), ...pile(116, 181, N[1] - 6, 1, 14))
  if (level >= 3) d.push(...flat(0, 181, 1), ...flat(132, 181, 3), ...flat(4, 179, 4), ...card(18, 240, 1), ...card(108, 244, 3), ...card(62, 246, 0))
  if (held) d.push(...card(64, 172, 1, 14, 9))
  out.push(boxes(d))
  out.push(Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: owl }))
  if (owlCard) out.push(cardOnOwl(94 * P, 74 * P, 5))
  return out
}

// 2. the kitchen: the fridge covered in cards, mum at the stove
const kitchen = ({ ...o } = {}) => {
  const k = []
  k.push([-20, -20, 190, 300, '#efe2c4'])
  for (let y = 84; y < 120; y += 6) for (let x = -20; x < 112; x += 6) k.push([x + ((y / 6) % 2 ? 3 : 0), y, 5, 5, (x + y) % 4 ? '#f6f1e4' : '#cfe4e0'])
  k.push([-20, 24, 128, 44, '#b07a45'], [-20, 66, 128, 3, '#8a5a32'])
  for (let x = -18; x < 104; x += 25) k.push([x, 27, 22, 37, '#c08a55'], [x + 18, 42, 2, 6, '#5a3a22'])
  k.push([-20, 118, 132, 4, '#d8d0c0'], [-20, 122, 132, 60, '#a8703e'])
  for (let x = -18; x < 108; x += 22) k.push([x, 125, 19, 52, '#b8804a'], [x + 15, 140, 2, 6, '#5a3a22'])
  k.push([14, 112, 36, 6, '#2e2a3c'], [16, 113, 8, 2, '#605f71'], [38, 113, 8, 2, '#605f71'], [14, 122, 36, 30, '#3a3a50'], [17, 126, 30, 20, '#1a1424'], [18, 127, 28, 2, '#f2a541'])
  k.push([20, 98, 18, 14, '#a9a8bb'], [18, 98, 22, 3, '#d4cede'], [26, 95, 6, 3, '#605f71'], [38, 104, 6, 2, '#a9a8bb'], [26, 88, 3, 5, '#ffffff'], [31, 83, 3, 6, '#f4f0e8'])
  // the big fridge on the right, cards everywhere on it
  k.push([96, 30, 50, 152, '#1a1424'], [97, 31, 48, 150, '#eef0f6'], [97, 90, 48, 2, '#c8cad6'], [140, 50, 2, 26, '#a9a8bb'], [140, 100, 2, 40, '#a9a8bb'])
  const FR = [[100, 36], [114, 34], [128, 38], [102, 50], [118, 48], [104, 64], [124, 60], [100, 78], [116, 76], [130, 72], [102, 98], [120, 96], [106, 112], [124, 110], [100, 126], [116, 128], [130, 124], [104, 144], [122, 142], [110, 160]]
  FR.forEach(([x, y], i) => k.push(...card(x, y, i, 11, 7)))
  k.push([-20, 182, 190, 100, '#c8b8a0'])
  for (let y = 182; y < 280; y += 10) for (let x = -20; x < 170; x += 10) if (((x + y) / 10) % 2 === 0) k.push([x, y, 10, 10, '#b8a890'])
  k.push([60, -20, 1, 64, '#2e2a3c'], [51, 44, 20, 8, '#e8a040'], [53, 52, 16, 2, '#fff1a8'])
  return [boxes(k), glow(300, 330, 420, '#ffd88a', 0.3), Mom({ x: 110, y: 650, p: 9, mouth: 'closed' }), Boy({ x: 330, y: 760, p: 10, mode: 'arms', ...o }),
    boxes([[-10, 190, 170, 5, '#f4f0e8'], [-10, 195, 170, 3, '#d8c8b0'], [-8, 198, 166, 82, '#b07a45'], [-8, 198, 166, 2, '#8a5a32']])]
}

// 3. the bathroom mirror, cards round the frame; the owl on the sink with a card too
const mirror = ({ owl = true, ...o } = {}) => [
  bathroom(), mirrorInside(), glow(360, 420, 300, '#ffe7a8', 0.18),
  Boy({ x: 216, y: 517, p: 18, mode: 'arms', ...o }),
  boxes([[14, 179, 116, 3, '#d4cede'], [-20, 196, 190, 8, '#f4f0e8'],
    ...[[16, 20], [36, 18], [96, 20], [116, 24], [14, 40], [118, 44], [14, 66], [118, 70], [16, 150], [116, 150], [14, 128], [118, 120]].flatMap(([x, y], i) => card(x, y, i, 11, 7))]),
  ...(owl ? [Owl({ x: 500, y: 980 - 20 * 7, p: 7, eyes: 'squint' }), cardOnOwl(500, 980 - 20 * 7, 7, 1)] : []),
]

// 4. classroom: the teacher puzzled, Timur proud; the blackboard left clean for the overlay words
const klass = ({ tm = 'closed', ...o } = {}) => [
  classroom(), boxes([[13, 43, 118, 56, '#24483a'], [16, 46, 112, 50, '#2a5242']]),
  Teacher({ x: 70, y: 731, p: 9, mouth: tm }), Boy({ x: 470, y: 730, p: 9, mode: 'arms', ...o }),
  boxes([[84, 182, 66, 5, C.woodL], [84, 182, 66, 1, '#c89a65'], [86, 187, 62, 26, C.wood], [88, 189, 58, 1, '#7a4c2a'], [90, 213, 4, 60, C.woodD], [142, 213, 4, 60, C.woodD], [100, 178, 14, 4, '#f4f0e8'], [101, 179, 10, 1, '#9a8c70']]),
]

// 5. the video call: Timur at the laptop (back of the lid), and the screen itself (Jake big, self-view top-left)
const call = ({ owl = 'open', ...o } = {}) => [
  bedroomNight(), boxes(wallCards()), lampGlow(600, 840, 360, 0.3),
  Boy({ x: 280, y: 650, p: 10, mode: 'arms', ...o }),
  glow(360, 760, 200, '#7fb4ff', 0.12),
  deskFront({ y: 182 }), laptopBack(182), boxes([...pile(12, 181, 14, 0), ...pile(110, 181, 18, 2), ...card(20, 241, 1), ...card(108, 245, 3)]),
  Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: owl }),
]
const screen = ({ jake = {}, me = {} } = {}) => [
  boxes([[-20, -20, 190, 300, '#14153a'], [-20, 40, 190, 1, '#1d1e4e']]),
  glow(360, 520, 520, '#5d7fd0', 0.25),
  boxes([[2, 48, 140, 108, '#1a1424'], [4, 50, 136, 104, '#2e2a3c'], [70, 51, 4, 1, '#605f71']]),
  jakeRoom(30, 270, 132, 96, 5),
  Jake({ x: 248, y: 456, p: 14, ...jake }),
  // self-view, top-left (the right column belongs to the app buttons)
  boxes([[12, 56, 30, 32, '#1a1424'], [13, 57, 28, 30, '#262660'], [13, 78, 28, 9, '#3a2a3e'], ...card(14, 58, 1, 6, 4), ...card(33, 60, 3, 6, 4)]),
  Boy({ x: 103, y: 352, p: 4, mode: 'arms', ...me }),
  boxes([[-6, 156, 156, 4, '#605f71'], [-12, 160, 168, 26, '#8d8b9c'], [-14, 186, 172, 4, '#605f71'], [-20, 190, 190, 90, C.woodD], [-20, 190, 190, 3, C.woodL]]),
  boxes(Array.from({ length: 4 }, (_, r) => Array.from({ length: 12 }, (_, c) => [6 + c * 11 - r, 163 + r * 5, 9, 3, '#a9a8bb'])).flat()),
]

// 6. speaking exam: over Timur's shoulder at the examiner (A), over hers at him (B)
const examA = ({ mouth = 'closed', eyes = 'open' } = {}) => [examRoom(), Examiner({ x: 280, y: 640, p: 10, mouth, eyes }), examProps(), BoyBack({ x: -30, y: 930, p: 18 })]
const examB = (o = {}) => [examRoom(), Boy({ x: 280, y: 640, p: 10, mode: 'arms', ...o }), examProps(170, true), ExaminerBack({ x: 470, y: 930, p: 18 })]

// 7. exam hall, day 60
const STU = ['#2a1c18', '#d0a040', '#1a1a24', '#5a3a22', '#8a5a3a', '#3a2418', '#c06030', '#2a1c18', '#1a1a24', '#d0a040', '#5a3a22']
const hall = () => {
  const out = [examHall(), Invigilator({ x: 560, y: 398, p: 7 })]
  let n = 0
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const p = 4 + r, x = 20 + c * 180 + (r % 2) * 40, y = 640 + r * 150, me1 = r === 1 && c === 1
    out.push(me1 ? Boy({ x, y: y - 21 * p, p, mode: 'write', eyes: 'down' }) : Person({ x, y: y - 21 * p, p, hair: STU[n++ % STU.length], shirt: '#605f71', eyes: 'down', style: n % 3 ? 'short' : 'long' }))
    out.push(boxes([[0, 0, 22, 3, me1 ? C.woodL : '#7a7888'], [1, 3, 20, 10, me1 ? C.wood : '#5d5b70'], [4, -1, 12, 1, '#f4f0e8']], x - 3 * p, y, p))
  }
  return out
}

// 8. the owl close-up under the moon (the constant), optionally with a card stuck on its head
const owlClose = (eyes, withCard = false) => [
  boxes([[0, 0, 150, 260, '#14153a'], ...stars(60, 0, 0, 144, 150, 21)]),
  boxes(disc(72, 70, 40, C.cream)), boxes(disc(62, 60, 7, '#f0dca8')), boxes(disc(86, 84, 5, '#f0dca8')),
  boxes([[0, 100, 40, 6, '#2a2c66'], [8, 96, 24, 4, '#2a2c66'], [100, 120, 50, 6, '#2a2c66'], [110, 116, 30, 4, '#2a2c66'], [20, 140, 34, 4, '#22245a']]),
  boxes([...bands(['#14153a', '#101236'], 194, 260, 0, 150), ...skyline(0, 260, 150, 9, ['#0c0d2a', '#101236', '#14153a'])]),
  boxes([[-10, 178, 170, 9, '#4a2e1c'], [-10, 177, 170, 2, '#6a4428'], [-10, 186, 170, 2, '#3a2418'], [120, 170, 3, 8, '#4a2e1c'], [122, 166, 8, 3, '#4a2e1c'],
    ...disc(132, 164, 4, '#3f7a5a'), ...disc(138, 168, 3, '#4f8a4f'), ...disc(18, 172, 4, '#3f7a5a'), ...disc(12, 175, 3, '#4f8a4f'), [40, 184, 3, 8, '#4a2e1c'], ...disc(41, 194, 3, '#3f7a5a')]),
  Owl({ x: 216, y: 178 * P - 20 * 12, p: 12, eyes }),
  withCard ? cardOnOwl(216, 178 * P - 20 * 12, 12) : null,
]
const sky = () => [boxes(bands(['#070820', '#0b0c26', '#101236', '#16184a', '#1d1e56'], 0, 256, 0, 144)), boxes(stars(90, 0, 0, 144, 200, 31)), boxes(disc(126, 18, 13, '#22245e')), boxes(disc(126, 18, 10, C.cream)), boxes(disc(122, 15, 2, '#f0dca8')), boxes(disc(129, 22, 1, '#f0dca8')), boxes(skyline(-4, 256, 152, 3, ['#0c0d2a', '#101236', '#14153a'])), boxes(skyline(-4, 256, 152, 8, ['#16184a', '#1c2550', '#1d1e56']))]


// 9. building lot at sunset (the "words are bricks, speech is a house" metaphor): crane, fence, a wheelbarrow of mortar,
// Timur on the right, the owl in a hard hat on a fence post. The bricks / house are animated in the edit (Scene world).
const hardHat = (x, y, p) => boxes([[3, -0.5, 10, 3, '#ffd23f'], [1.5, 2, 13, 1.2, '#e0a020'], [5, -0.5, 5, 1, '#fff1a8'], [7.3, -1.2, 1.4, 3, '#e0a020']], x, y, p)
const lot = ({ owl = 'open', ...o } = {}) => {
  const k = []
  k.push(...bands(['#14153a', '#1d1e56', '#2b2b6e', '#47377a', '#6e437c', '#a6577a', '#d8706e', '#f09a6a', '#f6b86e'], -20, 136, -20, 190))
  k.push(...stars(26, 0, -10, 144, 50, 17))
  // the sun going down behind the city, with a soft ring
  k.push(...disc(116, 124, 17, '#f6b86e'), ...disc(116, 124, 13, '#ffd27a'), ...disc(116, 124, 10, '#ffe7a8'))
  k.push(...skyline(-6, 140, 160, 23, ['#2a1f45', '#33244f', '#3d2a57'], ['#ffcf7a', '#f2a541']))
  // tower crane: lattice mast, jib, counter-jib, cab, cable and a hook with a pallet of bricks
  k.push([8, 26, 4, 116, '#c8862a'], [8, 26, 1, 116, '#e8a83a'])
  for (let y = 28; y < 140; y += 6) k.push([8, y, 4, 1, '#8a5a1a'], [9, y + 2, 1, 1, '#8a5a1a'], [10, y + 3, 1, 1, '#8a5a1a'])
  k.push([-4, 24, 96, 3, '#c8862a'], [-4, 24, 96, 1, '#e8a83a'], [12, 18, 2, 6, '#c8862a'], [12, 18, 40, 1, '#8a5a1a'], [-10, 27, 10, 4, '#5a4a6a'])
  for (let x = 14; x < 92; x += 6) k.push([x, 25, 1, 1, '#8a5a1a'])
  k.push([6, 27, 8, 6, '#3a3a50'], [7, 28, 6, 3, '#9ab4e0'], [74, 27, 1, 26, '#2e2a3c'], [72, 53, 5, 2, '#2e2a3c'], [73, 55, 1, 2, '#2e2a3c'])
  k.push([66, 57, 18, 2, '#5a3a22'], [66, 59, 18, 1, '#3a2418'])
  for (let i = 0; i < 3; i++) k.push([67 + i * 6, 54 - 0, 5, 3, '#b04e3c'], [67 + i * 6, 54, 5, 1, '#e08a6a'])
  // ground: grass edge, dirt with stones
  k.push([-20, 158, 190, 100, '#6b4a32'], [-20, 158, 190, 2, '#4f8a4f'], [-20, 157, 190, 1, '#7bc188'])
  seed(31); for (let i = 0; i < 70; i++) k.push([Math.floor(rnd() * 150) - 4, 162 + Math.floor(rnd() * 94), 2, 1, rnd() < 0.5 ? '#5a3c28' : '#7d5a40'])
  // construction fence behind (low planks)
  for (let x = -4; x < 150; x += 9) k.push([x, 142, 7, 16, '#c8a878'], [x, 142, 7, 1, '#e0c49a'], [x + 3, 140, 1, 2, '#8a6a4a'])
  k.push([-4, 146, 154, 2, '#8a6a4a'], [-4, 153, 154, 2, '#8a6a4a'])
  // the owl's post on the left
  k.push([4, 128, 9, 30, '#7a5232'], [4, 128, 9, 2, '#a87850'], [5, 131, 1, 26, '#5a3a22'])
  // wheelbarrow of mortar on the right, a trowel stuck in it
  k.push([122, 148, 20, 8, '#4a5a8a'], [123, 149, 18, 6, '#5d6a9a'], [124, 145, 16, 4, '#b8b6c6'], [126, 143, 10, 2, '#d4d2e0'], [131, 138, 1, 6, '#5a3a22'], [129, 136, 5, 3, '#a9a8bb'])
  k.push(...disc(126, 158, 3, '#2e2a3c'), ...disc(126, 158, 1, '#a9a8bb'), [140, 152, 8, 2, '#5a3a22'], [138, 156, 2, 4, '#5a3a22'])
  return [boxes(k), glow(580, 600, 340, '#ffb070', 0.18), Owl({ x: 8 * P - 6, y: 128 * P - 20 * 4, p: 4, eyes: owl }), hardHat(8 * P - 6, 128 * P - 20 * 4, 4),
    Boy({ x: 500, y: 158 * P - 30 * 6, p: 6, ...o })]
}

export const PLATES = {
  max: room({ level: 3, wall: 24, eyes: 'wide', sweat: true, mouth: 'o', owlCard: true, owl: 'squint' }), max_b: room({ level: 3, wall: 24, eyes: 'closed', sweat: true, mouth: 'o', owlCard: true, owl: 'squint' }),
  room: room({ eyes: 'down' }), room_b: room({ eyes: 'closed' }), room_open: room({ eyes: 'open', held: false }), room_smile: room({ eyes: 'happy', mouth: 'smile' }),
  room_wide: room({ eyes: 'wide', sweat: true, mouth: 'o' }), room_wide2: room({ eyes: 'wide', sweat: true, mouth: 'flat' }),
  wall: room({ level: 2, wall: 24, eyes: 'happy', mouth: 'smile' }), wall_b: room({ level: 2, wall: 24, eyes: 'closed', mouth: 'smile' }),
  pile: room({ level: 2, wall: 24, eyes: 'half', mouth: 'smile' }), pile_b: room({ level: 2, wall: 24, eyes: 'closed', mouth: 'smile' }),
  kitchen: kitchen({ eyes: 'happy', mouth: 'smile' }), mirror: mirror({ eyes: 'happy', mouth: 'smile' }), mirror_talk: mirror({ owl: false, mouth: 'open' }), mirror_talk2: mirror({ owl: false, mouth: 'wide' }),
  klass: klass({ eyes: 'half', mouth: 'smile' }), klass_o: klass({ tm: 'o', eyes: 'half', mouth: 'smile' }),
  call: call(), call_blink: call({ eyes: 'closed' }), call_um: call({ eyes: 'wide', mouth: 'o', sweat: true }), call_um2: call({ eyes: 'wide', mouth: 'flat', sweat: true }),
  screen: screen(), screen_talk: screen({ jake: { mouth: 'open' } }), screen_q: screen({ jake: { brow: 'up' }, me: { eyes: 'wide', sweat: true } }),
  examA: examA(), examA_talk: examA({ mouth: 'open' }), examB_scared: examB({ eyes: 'wide', sweat: true }), examB_um: examB({ eyes: 'wide', mouth: 'o', sweat: true }), examB_blink: examB({ eyes: 'closed', sweat: true }),
  lot_q: lot({ mode: 'stand', eyes: 'side', mouth: 'flat' }), lot_happy: lot({ mode: 'gesture', eyes: 'happy', mouth: 'smile', owl: 'happy' }), lot_sad: lot({ mode: 'stand', eyes: 'down', mouth: 'flat', sweat: true, owl: 'sad' }),
  hall: hall(), owl_open: owlClose('open'), owl_wink: owlClose('wink'), owl_card: owlClose('squint', true), sky: sky(),
}
export const ORDER = Object.keys(PLATES)

export default async ({ project }) => {
  const p = await project({ dir: '.', size: '1440x2560', fps: 24, background: '#ff00ff' })
  p.compose(
    <frame width={W * 2} height={H * 2} layout="none">
      {ORDER.map((k, i) => (
        <frame at={i} duration={1} width={W * 2} height={H * 2} layout="none">
          <frame width={W} height={H} layout="none" clip={true} motion={{ timeline: { duration: 1, from: { scale: 2 }, to: { scale: 2 }, easing: 'linear' } }}>
            {PLATES[k]}
          </frame>
        </frame>
      ))}
    </frame>,
    { at: 0, dur: ORDER.length }
  )
}
