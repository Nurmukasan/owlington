// Universe #6 — "16 hours a day, 60 days in a row". Classic Timur backdrops (same sets as every episode),
// rendered at 2x and used as stills. Energy drinks stand side by side on the desk (nobody stacks them).
import { W, H, C, P, boxes, outlined } from './lib.jsx'
import { Boy, BoyBack, Owl, Examiner, ExaminerBack, Person, Mom, Invigilator } from './chars.jsx'
import { bedroomNight, deskFront, lampGlow, examHall, disc, stars, bands, skyline } from './sets.jsx'
import { examRoom, examProps, bathroom, mirrorInside, busStopStreet } from './sets2.jsx'

const glow = (cx, cy, r, col, a) => <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={{ kind: 'radial', stops: [{ offset: 0, color: col, opacity: a }, { offset: 0.65, color: col, opacity: 0 }] }} />

// an energy drink you recognise at a glance: black can, silver lid with a tab, neon-green lightning bolt
const BOLT = '#7cff4a'
export const canUp = (x, base) => outlined([
  [0, 0, 7, 13, '#1a1a24'], [0, 0, 7, 2, '#d4d4e0', 1], [2, 0, 3, 1, '#f4f4fa', 1], [3, 0, 1, 1, '#605f71', 1], [0, 11, 7, 2, '#a9a8bb', 1], [1, 2, 1, 9, '#3a3a50', 1],
  [3, 3, 2, 2, BOLT, 1], [2, 5, 3, 2, BOLT, 1], [3, 7, 3, 2, BOLT, 1], [4, 9, 1, 1, BOLT, 1],
], x * P, (base - 13) * P)
const canDown = (x, base) => outlined([
  [0, 0, 13, 7, '#1a1a24'], [11, 0, 2, 7, '#d4d4e0', 1], [0, 0, 2, 7, '#a9a8bb', 1], [2, 1, 9, 1, '#3a3a50', 1],
  [4, 3, 2, 2, BOLT, 1], [6, 2, 2, 3, BOLT, 1], [8, 3, 2, 2, BOLT, 1],
], x * P, (base - 7) * P)
const canCrushed = (x, base) => outlined([
  [0, 1, 7, 5, '#1a1a24'], [0, 0, 7, 2, '#d4d4e0', 1], [0, 5, 7, 1, '#a9a8bb', 1], [2, 2, 1, 1, '#3a3a50', 1], [4, 3, 2, 1, '#3a3a50', 1], [3, 2, 2, 2, BOLT, 1],
], x * P, (base - 6) * P)
const mug = (x, base) => outlined([
  [0, 0, 7, 8, '#f4f0e8'], [0, 0, 7, 1, '#ffffff', 1], [1, 1, 5, 1, '#7a4c2a', 1], [7, 2, 2, 4, '#f4f0e8'], [7, 3, 1, 2, '#2b2b66', 1], [1, 4, 5, 1, '#d8323c', 1],
], x * P, (base - 8) * P)

// desk clutter by level (art px, standing on the desk top at y = 182)
const DESK = 182
const clutter = (level) => {
  const o = []
  if (level >= 1) o.push(canUp(92, DESK))
  if (level >= 2) o.push(canDown(0, DESK), canUp(99, DESK))
  if (level >= 3) o.push(canCrushed(40, DESK), canUp(130, DESK), mug(84, DESK))
  return o
}

// a dawn window over the night one (morning / day scenes)
const dawn = () => boxes([...bands(['#f6d6a8', '#f6c08a', '#f2a07a', '#d8806e', '#a86a7e'], 26, 92, 86, 50), ...disc(122, 70, 7, '#fff1c0'), ...skyline(86, 92, 50, 5, ['#7a5a7e', '#8a6a86', '#6a4a70'], ['#ffe7a8'])])

// 1. Timur at his desk (the room of every episode)
const room = ({ level = 0, day = false, owl = 'open', lamp = true, ...o } = {}) => [
  bedroomNight({ lampOn: lamp }), day ? dawn() : null, lamp ? lampGlow(600, 840, 360, day ? 0.16 : 0.34) : null,
  Boy({ x: 280, y: 700, p: 10, mode: 'write', ...o }), deskFront({ y: DESK, lamp }),
  boxes([[44, 175, 22, 7, '#2e3a6a'], [45, 175, 10, 6, '#fbf7ec'], [56, 175, 10, 6, '#f4efe2'], [55, 175, 1, 7, '#9a8c70']]),
  ...clutter(level),
  Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: owl }),
]
// 2. asleep at the desk (front view, head on his arms); the owl either on the sill or on the desk by the lamp
const asleep = ({ owlDesk = null, lamp = true } = {}) => [
  bedroomNight({ lampOn: lamp }), lamp ? lampGlow(600, 840, 360, 0.34) : null,
  Boy({ x: 280, y: 700, p: 10, mode: 'sleepdesk', pale: true, bags: true, phones: true }), deskFront({ y: DESK, lamp }),
  boxes([[44, 177, 30, 5, '#fbf7ec'], [45, 178, 12, 1, '#b8c4dc'], [60, 178, 12, 1, '#b8c4dc'], [45, 180, 10, 1, '#b8c4dc']]),
  ...clutter(3),
  owlDesk ? Owl({ x: 94 * P - 30, y: DESK * P - 20 * 5, p: 5, eyes: owlDesk, wing: owlDesk === 'happy' }) : Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: 'closed' }),
]
// 3. kitchen: mum at the stove, Timur at the table in headphones over his notebook
const kitchen = ({ mom = 'closed', ...o } = {}) => {
  const k = []
  k.push([-20, -20, 190, 300, '#efe2c4'])
  for (let y = 84; y < 120; y += 6) for (let x = -20; x < 150; x += 6) k.push([x + ((y / 6) % 2 ? 3 : 0), y, 5, 5, (x + y) % 4 ? '#f6f1e4' : '#cfe4e0'])
  k.push([-20, 24, 170, 44, '#b07a45'], [-20, 66, 170, 3, '#8a5a32'])
  for (let x = -18; x < 150; x += 25) k.push([x, 27, 22, 37, '#c08a55'], [x + 18, 42, 2, 6, '#5a3a22'])
  k.push([-20, 118, 190, 4, '#d8d0c0'], [-20, 122, 190, 60, '#a8703e'])
  for (let x = -18; x < 150; x += 22) k.push([x, 125, 19, 52, '#b8804a'], [x + 15, 140, 2, 6, '#5a3a22'])
  k.push([14, 112, 36, 6, '#2e2a3c'], [16, 113, 8, 2, '#605f71'], [38, 113, 8, 2, '#605f71'], [14, 122, 36, 30, '#3a3a50'], [17, 126, 30, 20, '#1a1424'], [18, 127, 28, 2, '#f2a541'])
  k.push([20, 98, 18, 14, '#a9a8bb'], [18, 98, 22, 3, '#d4cede'], [26, 95, 6, 3, '#605f71'], [26, 88, 3, 5, '#ffffff'], [31, 83, 3, 6, '#f4f0e8'])
  k.push([112, 18, 30, 40, '#5a3a22'], [114, 20, 26, 36, '#1d1e4e'], ...disc(132, 28, 3, C.cream), [126, 20, 2, 36, '#5a3a22'], [114, 37, 26, 2, '#5a3a22'])
  k.push([-20, 182, 190, 100, '#c8b8a0'])
  for (let y = 182; y < 280; y += 10) for (let x = -20; x < 170; x += 10) if (((x + y) / 10) % 2 === 0) k.push([x, y, 10, 10, '#b8a890'])
  k.push([71, -20, 1, 70, '#2e2a3c'], [62, 50, 20, 8, '#e8a040'], [64, 58, 16, 2, '#fff1a8'])
  return [boxes(k), glow(360, 360, 420, '#ffd88a', 0.3), Mom({ x: 110, y: 650, p: 9, mouth: mom }),
    Boy({ x: 330, y: 760, p: 10, mode: 'write', phones: true, ...o }),
    boxes([[-10, 190, 170, 5, '#f4f0e8'], [-10, 195, 170, 3, '#d8c8b0'], [-8, 198, 166, 82, '#b07a45'], [-8, 198, 166, 2, '#8a5a32'],
      [70, 186, 26, 5, '#fbf7ec'], [83, 186, 1, 5, '#9a8c70'], [100, 183, 9, 7, '#f4f0e8'], [101, 183, 7, 1, '#7a4c2a']]), canUp(112, 190)]
}
// 4. the rest of the classic sets
const mirror = (o = {}) => [bathroom(), mirrorInside(), glow(360, 420, 300, '#ffe7a8', 0.18), Boy({ x: 216, y: 517, p: 18, mode: 'arms', ...o }), boxes([[14, 179, 116, 3, '#d4cede'], [-20, 196, 190, 8, '#f4f0e8']])]
const street = (o = {}) => [busStopStreet(), Boy({ x: 236, y: 700, p: 9, phones: true, ...o })]
const examA = ({ mouth = 'closed', eyes = 'open' } = {}) => [examRoom(), Examiner({ x: 280, y: 640, p: 10, mouth, eyes }), examProps(), BoyBack({ x: -30, y: 930, p: 18 })]
const examB = (o = {}) => [examRoom(), Boy({ x: 280, y: 640, p: 10, mode: 'arms', ...o }), examProps(170, true), ExaminerBack({ x: 470, y: 930, p: 18 })]
const STU = ['#2a1c18', '#d0a040', '#1a1a24', '#5a3a22', '#8a5a3a', '#3a2418', '#c06030', '#2a1c18']
const hall = () => {
  const out = [examHall(), Invigilator({ x: 560, y: 398, p: 7 })]
  let n = 0
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const p = 4 + r, x = 20 + c * 180 + (r % 2) * 40, y = 640 + r * 150, me = r === 1 && c === 1
    out.push(me ? Boy({ x, y: y - 21 * p, p, mode: 'write', eyes: 'down' }) : Person({ x, y: y - 21 * p, p, hair: STU[n++ % STU.length], shirt: '#605f71', eyes: 'down', style: n % 3 ? 'short' : 'long' }))
    out.push(boxes([[0, 0, 22, 3, me ? C.woodL : '#7a7888'], [1, 3, 20, 10, me ? C.wood : '#5d5b70'], [4, -1, 12, 1, '#f4f0e8']], x - 3 * p, y, p))
  }
  return out
}
const owlClose = (eyes) => [
  boxes([[0, 0, 150, 260, '#14153a'], ...stars(60, 0, 0, 144, 150, 21)]),
  boxes(disc(72, 70, 40, C.cream)), boxes(disc(62, 60, 7, '#f0dca8')), boxes(disc(86, 84, 5, '#f0dca8')),
  boxes([...bands(['#14153a', '#101236'], 194, 260, 0, 150), ...skyline(0, 260, 150, 9, ['#0c0d2a', '#101236', '#14153a'])]),
  boxes([[-10, 178, 170, 9, '#4a2e1c'], [-10, 177, 170, 2, '#6a4428'], [-10, 186, 170, 2, '#3a2418']]),
  Owl({ x: 216, y: 178 * P - 20 * 12, p: 12, eyes }),
]
const sky = () => [boxes(bands(['#070820', '#0b0c26', '#101236', '#16184a', '#1d1e56'], 0, 256, 0, 144)), boxes(stars(90, 0, 0, 144, 200, 31)), boxes(disc(126, 18, 13, '#22245e')), boxes(disc(126, 18, 10, C.cream)), boxes(skyline(-4, 256, 152, 3, ['#0c0d2a', '#101236', '#14153a'])), boxes(skyline(-4, 256, 152, 8, ['#16184a', '#1c2550', '#1d1e56']))]

const T1 = { pale: true, bags: true }
export const PLATES = {
  hook: room({ level: 3, eyes: 'wide', mouth: 'flat', phones: true, owl: 'closed', ...T1 }), hook_b: room({ level: 3, eyes: 'closed', mouth: 'flat', phones: true, owl: 'closed', ...T1 }),
  fresh: room({ day: true, eyes: 'open', mouth: 'smile' }), fresh_b: room({ day: true, eyes: 'closed', mouth: 'smile' }), fire: room({ day: true, eyes: 'fierce', mouth: 'grin' }),
  read: room({ level: 1, eyes: 'down', phones: true }), write: room({ level: 1, eyes: 'fierce', mouth: 'flat' }),
  happy: room({ level: 1, eyes: 'happy', mouth: 'smile' }), happy_b: room({ level: 1, eyes: 'closed', mouth: 'smile' }),
  wk2: room({ level: 1, eyes: 'half', bags: true }), wk2_b: room({ level: 1, eyes: 'closed', bags: true }),
  wk3: room({ level: 3, eyes: 'half', mouth: 'flat', ...T1 }), wk3_b: room({ level: 3, eyes: 'closed', mouth: 'flat', ...T1 }),
  nod: room({ level: 3, eyes: 'closed', mouth: 'o', phones: true, ...T1 }), wide: room({ level: 3, eyes: 'wide', mouth: 'o', sweat: true, phones: true, ...T1 }),
  asleep: asleep(), owl_lamp: asleep({ owlDesk: 'open' }), owl_dark: asleep({ owlDesk: 'happy', lamp: false }),
  focus: room({ day: true, eyes: 'fierce', mouth: 'smile' }), focus_b: room({ day: true, eyes: 'closed', mouth: 'smile' }), end: room({ day: true, eyes: 'happy', mouth: 'smile', owl: 'happy' }),
  kitchen: kitchen({ eyes: 'down' }), kitchen_m1: kitchen({ mom: 'open', eyes: 'down' }), kitchen_m2: kitchen({ mom: 'wide', eyes: 'down' }),
  mirror: mirror({ mouth: 'open' }), mirror2: mirror({ mouth: 'wide' }),
  street: street({ eyes: 'happy', mouth: 'smile' }), street_b: street({ eyes: 'closed', mouth: 'smile' }),
  examA: examA(), examA_talk: examA({ mouth: 'open' }), examB_um: examB({ eyes: 'wide', mouth: 'o', sweat: true }), examB_blink: examB({ eyes: 'closed', sweat: true }),
  examB_calm: examB({ mouth: 'smile' }), examB_talk: examB({ mouth: 'open' }),
  hall: hall(), owl_open: owlClose('open'), owl_wink: owlClose('wink'), sky: sky(),
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
