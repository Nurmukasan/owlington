// Backdrops for the Listening finale, rendered at 2x and used as stills in the edit.
import { W, H, C, P, boxes } from './lib.jsx'
import { Boy, Owl, Person, Mom, Invigilator } from './chars.jsx'
import { bedroomNight, deskFront, lampGlow, examHall, disc, stars, bands, skyline } from './sets.jsx'
import { busStopStreet } from './sets2.jsx'
import { paper } from './sets3.jsx'

const glow = (cx, cy, r, col, a) => <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={{ kind: 'radial', stops: [{ offset: 0, color: col, opacity: a }, { offset: 0.65, color: col, opacity: 0 }] }} />

// 1. night room: Timur at the desk with big headphones, the owl on the windowsill (same place in every universe)
const room = ({ owl = 'open', notebook = false, cassette = false, ...o } = {}) => {
  const out = [bedroomNight(), lampGlow(600, 840, 360, 0.34), Boy({ x: 280, y: 700, p: 10, mode: notebook ? 'write' : 'arms', phones: true, ...o }), deskFront({ y: 182 })]
  if (notebook) out.push(boxes([
    [44, 175, 52, 8, '#25305c'], [45, 175, 24, 7, '#fbf7ec'], [71, 175, 24, 7, '#f4efe2'], [69, 175, 2, 8, '#9a8c70'],
    [46, 176, 22, 1, '#b8c4dc'], [46, 178, 22, 1, '#b8c4dc'], [46, 180, 22, 1, '#b8c4dc'], [72, 176, 22, 1, '#b8c4dc'], [72, 178, 22, 1, '#b8c4dc'], [72, 180, 22, 1, '#b8c4dc'],
    [47, 176, 14, 1, '#2e3a6a'], [47, 178, 18, 1, '#2e3a6a'], [47, 180, 10, 1, '#2e3a6a'], [73, 176, 16, 1, '#2e3a6a'], [73, 178, 8, 1, '#2e3a6a'],
    [49, 175, 1, 8, '#e8a0a0'], [75, 175, 1, 8, '#e8a0a0']]))
  out.push(boxes([[94, 180, 30, 3, '#8d8b9c'], [93, 182, 32, 1, '#605f71'], [96, 160, 26, 20, '#605f71'], [97, 161, 24, 18, '#c8c6d6'], [97, 161, 24, 2, '#e4e2ee'], [106, 166, 6, 7, '#7f5236'], [107, 167, 4, 2, '#ffb627'], [107, 169, 4, 3, '#ecd0a2'], [107, 167, 1, 1, '#120c08'], [110, 167, 1, 1, '#120c08']]))
  if (cassette) {
    out.push(Owl({ x: 470, y: 910 - 20 * 7, p: 7, eyes: 'squint' }))
    out.push(boxes([[96, 168, 26, 15, '#2e2a3c'], [97, 169, 24, 5, '#f2a541'], ...disc(103, 177, 2, '#e8e0d0'), ...disc(115, 177, 2, '#e8e0d0'), [103, 176, 1, 2, '#2e2a3c'], [115, 176, 1, 2, '#2e2a3c'],
      [114, 152, 2, 24, '#ffd23f'], [114, 150, 2, 2, '#f08a9a'], [113, 175, 4, 3, '#7f5236'], [95, 175, 4, 3, '#7f5236']]))
  } else out.push(Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: owl }))
  return out
}
// 2. passive listening: on the bed, gaming on the phone, headphones on
const bed = (o = {}) => [
  bedroomNight(), glow(360, 800, 240, '#5d99ea', 0.22),
  boxes([
    // headboard with posts
    [8, 140, 128, 22, '#5a3a22'], [10, 142, 124, 18, '#6e4628'], [12, 144, 120, 2, '#8a5a32'], [6, 134, 6, 90, '#4a2e1c'], [132, 134, 6, 90, '#4a2e1c'], [6, 132, 6, 3, '#8a5a32'], [132, 132, 6, 3, '#8a5a32'],
    // pillows
    [16, 156, 34, 14, '#e8e4f0'], [16, 156, 34, 3, '#ffffff'], [18, 167, 30, 3, '#c8c4d8'], [94, 156, 34, 14, '#e8e4f0'], [94, 156, 34, 3, '#ffffff'], [96, 167, 30, 3, '#c8c4d8'],
    // bedside table with a night light
    [-14, 176, 20, 30, '#5a3a22'], [-14, 176, 20, 3, '#8a5a32'], [-12, 184, 16, 1, '#3a2418'], [-6, 166, 6, 10, '#f2a541'], [-8, 164, 10, 3, '#fff1a8'],
  ]),
  glow(-20, 830, 140, '#ffd23f', 0.35),
  Boy({ x: 280, y: 640, p: 10, mode: 'game', phones: true, eyes: 'down', ...o }),
  boxes([
    // checked blanket with a fold and a highlight
    [8, 184, 128, 32, '#2e51a6'], ...Array.from({ length: 16 }, (_, i) => [8 + i * 8, 184, 4, 32, '#3a62b8']), ...Array.from({ length: 4 }, (_, i) => [8, 186 + i * 8, 128, 2, '#25458e']),
    [8, 184, 128, 4, '#e8e4f0'], [8, 188, 128, 1, '#c8c4d8'], [40, 196, 30, 2, '#5d82d0'], [90, 204, 26, 2, '#5d82d0'],
    [8, 216, 128, 6, '#4a2e1c'], [6, 216, 4, 14, '#4a2e1c'], [134, 216, 4, 14, '#4a2e1c'],
  ]),
  Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: 'closed' }),
]
// 3. the kitchen at dinner time: cabinets, stove with a steaming pot, sink, fridge, a lamp over the table; mum at the stove
const kitchen = ({ mom = 'closed', steam = 0, ...o } = {}) => {
  const k = []
  // wall + tiled backsplash
  k.push([-20, -20, 190, 300, '#efe2c4'])
  for (let y = 84; y < 120; y += 6) for (let x = -20; x < 112; x += 6) k.push([x + ((y / 6) % 2 ? 3 : 0), y, 5, 5, (x + y) % 4 ? '#f6f1e4' : '#cfe4e0'])
  // upper cabinets
  k.push([-20, 24, 128, 44, '#b07a45'], [-20, 66, 128, 3, '#8a5a32'])
  for (let x = -18; x < 104; x += 25) k.push([x, 27, 22, 37, '#c08a55'], [x + 18, 42, 2, 6, '#5a3a22'])
  // window with curtains, night outside
  k.push([112, 18, 30, 40, '#5a3a22'], [114, 20, 26, 36, '#1d1e4e'], ...disc(132, 28, 3, C.cream), [126, 20, 2, 36, '#5a3a22'], [114, 37, 26, 2, '#5a3a22'])
  for (let y = 16; y < 62; y += 4) k.push([108, y, 6, 2, y % 8 ? '#d8323c' : '#f4f0e8'], [140, y, 6, 2, y % 8 ? '#d8323c' : '#f4f0e8'])
  // counter: base cabinets, worktop, stove, sink
  k.push([-20, 118, 132, 4, '#d8d0c0'], [-20, 122, 132, 60, '#a8703e'])
  for (let x = -18; x < 108; x += 22) k.push([x, 125, 19, 52, '#b8804a'], [x + 15, 140, 2, 6, '#5a3a22'])
  k.push([14, 112, 36, 6, '#2e2a3c'], [16, 113, 8, 2, '#605f71'], [38, 113, 8, 2, '#605f71'], [14, 122, 36, 30, '#3a3a50'], [17, 126, 30, 20, '#1a1424'], [18, 127, 28, 2, '#f2a541'])
  k.push([20, 98, 18, 14, '#a9a8bb'], [18, 98, 22, 3, '#d4cede'], [26, 95, 6, 3, '#605f71'], [38, 104, 6, 2, '#a9a8bb'])
  k.push([60, 116, 24, 3, '#a9a8bb'], [62, 117, 20, 2, '#605f71'], [70, 104, 3, 12, '#d4cede'], [70, 104, 9, 3, '#d4cede'])
  // fridge
  k.push([116, 64, 30, 118, '#eef0f6'], [116, 104, 30, 2, '#c8cad6'], [140, 76, 2, 18, '#a9a8bb'], [140, 112, 2, 26, '#a9a8bb'], [120, 70, 5, 5, '#d8323c'], [127, 72, 5, 5, '#ffd23f'], [121, 80, 9, 7, '#5d99ea'])
  // floor
  k.push([-20, 182, 190, 100, '#c8b8a0'])
  for (let y = 182; y < 280; y += 10) for (let x = -20; x < 170; x += 10) if (((x + y) / 10) % 2 === 0) k.push([x, y, 10, 10, '#b8a890'])
  // hanging lamp over the table
  k.push([71, -20, 1, 70, '#2e2a3c'], [62, 50, 20, 8, '#e8a040'], [64, 58, 16, 2, '#fff1a8'])
  const st = steam ? [[24, 86, 3, 6, '#ffffff'], [30, 80, 3, 8, '#ffffff'], [27, 74, 3, 5, '#f4f0e8']] : [[26, 88, 3, 5, '#ffffff'], [31, 83, 3, 6, '#f4f0e8'], [25, 78, 3, 4, '#ffffff']]
  return [
    boxes([...k, ...st]),
    glow(360, 360, 420, '#ffd88a', 0.32),
    Mom({ x: 120, y: 650, p: 9, mouth: mom }),
    boxes([[33, 157, 2, 10, '#a9a8bb'], [31, 166, 6, 3, '#a9a8bb']]),
    Boy({ x: 340, y: 700, p: 10, mode: 'arms', phones: true, ...o }),
    boxes([[-10, 182, 170, 5, '#f4f0e8'], [-10, 187, 170, 3, '#d8c8b0'], [-8, 190, 166, 90, '#b07a45'],
      ...Array.from({ length: 16 }, (_, i) => [-10 + i * 11, 182, 5, 5, '#d8323c']),
      [70, 176, 34, 6, '#f4f0e8'], [74, 174, 26, 4, '#e8b040'], [78, 173, 6, 2, '#c87a3a'], [88, 173, 6, 2, '#8a5a32'], [108, 172, 9, 10, '#c8402e'], [117, 175, 3, 4, '#c8402e'], [109, 173, 7, 2, '#8a3020'],
      [48, 177, 16, 5, '#d8a060'], [50, 176, 12, 2, '#e8b878']]),
  ]
}
// 4. street: walking with headphones
const street = (o = {}) => [busStopStreet(), Boy({ x: 236, y: 760, p: 9, phones: true, ...o })]
// 5. exam hall: everyone in headphones; close on Timur at his desk
const STU = ['#2a1c18', '#d0a040', '#1a1a24', '#5a3a22', '#8a5a3a', '#3a2418', '#c06030', '#2a1c18', '#1a1a24', '#d0a040', '#5a3a22']
const hall = ({ me = {} } = {}) => {
  const out = [examHall(), Invigilator({ x: 560, y: 398, p: 7 })]
  let n = 0
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const p = 4 + r, x = 20 + c * 180 + (r % 2) * 40, y = 640 + r * 150, me1 = r === 1 && c === 1
    out.push(me1 ? Boy({ x, y: y - 21 * p, p, mode: 'write', eyes: 'down', phones: true, ...me }) : Person({ x, y: y - 21 * p, p, hair: STU[n++ % STU.length], shirt: '#605f71', eyes: 'closed', style: n % 3 ? 'short' : 'long', phones: true }))
    out.push(boxes([[0, 0, 22, 3, me1 ? C.woodL : '#7a7888'], [1, 3, 20, 10, me1 ? C.wood : '#5d5b70'], [4, -1, 12, 1, '#f4f0e8']], x - 3 * p, y, p))
  }
  return out
}
const close = (o = {}) => [
  examHall(),
  Person({ x: 60, y: 560, p: 7, hair: '#2a1c18', shirt: '#605f71', eyes: 'closed', phones: true }), Person({ x: 540, y: 560, p: 7, hair: '#d0a040', style: 'long', shirt: '#8a4aa0', eyes: 'closed', phones: true }),
  boxes([[-20, 140, 70, 4, '#7a7888'], [-20, 144, 70, 20, '#5d5b70'], [104, 140, 70, 4, '#7a7888'], [104, 144, 70, 20, '#5d5b70']]),
  Boy({ x: 264, y: 690, p: 12, mode: 'write', eyes: 'down', phones: true, ...o }),
  boxes([[-20, 186, 190, 5, C.woodL], [-20, 191, 190, 90, C.wood],
    // the answer sheet lying on the desk: blue header, two columns of numbered answer boxes, a pencil
    [38, 177, 68, 10, '#1d1a28'], [37, 176, 68, 10, '#fbf8f0'], [37, 176, 68, 2, '#2e51a6'], [39, 176, 20, 1, '#c3d1ef'],
    ...Array.from({ length: 3 }, (_, r) => [[39, 179 + r * 2, 2, 1, '#8a8070'], [42, 179 + r * 2, 22, 1, '#c3d1ef'], [72, 179 + r * 2, 2, 1, '#8a8070'], [75, 179 + r * 2, 22, 1, '#c3d1ef']]).flat(),
    [43, 179, 8, 1, '#2e3a6a'], [43, 181, 12, 1, '#2e3a6a'], [76, 179, 10, 1, '#2e3a6a'],
    [92, 184, 14, 2, '#ffd23f'], [106, 184, 2, 2, '#f4d0a0'], [90, 184, 2, 2, '#f08a9a']]),
]
// 6. the answer sheet, close
// the IELTS listening answer sheet, close: header, candidate boxes, numbered answer rows with tick columns
const sheet = () => {
  const o = [[-20, -20, 190, 300, '#6e4628']]
  for (let y = -20; y < 280; y += 14) o.push([-20, y, 190, 1, '#5e3a20'], [-20, y + 7, 190, 1, '#7a5232'])
  o.push([12, 40, 128, 190, '#2a1a12'], [8, 36, 128, 190, '#fbf8ef'], [8, 36, 128, 2, '#ffffff'])
  o.push([8, 38, 128, 16, '#9e1f2c'], [8, 52, 128, 2, '#7a1622'], [12, 41, 26, 10, '#f4f0e8'])
  o.push([12, 58, 70, 10, '#e8e4dc'], [13, 59, 68, 8, '#ffffff'], [86, 58, 46, 10, '#e8e4dc'], [87, 59, 44, 8, '#ffffff'])
  for (let k = 0; k < 10; k++) {
    const y = 76 + k * 14
    o.push([12, y, 12, 11, k === 6 ? '#ffd23f' : '#e8e4dc'], [26, y, 82, 11, '#c8c4d4'], [27, y + 1, 80, 9, k === 6 ? '#fff6d0' : '#ffffff'], [112, y + 1, 9, 9, '#c8c4d4'], [113, y + 2, 7, 7, '#ffffff'], [124, y + 1, 9, 9, '#c8c4d4'], [125, y + 2, 7, 7, '#ffffff'])
  }
  o.push([60, 218, 3, 3, '#ffd23f'], [63, 221, 3, 3, '#ffd23f'], [66, 224, 3, 3, '#ffd23f'], [69, 227, 3, 3, '#ffd23f'], [72, 230, 3, 3, '#ffd23f'], [57, 215, 3, 3, '#f08a9a'], [75, 233, 2, 2, '#2a1a12'])
  return [boxes(o)]
}
// 7. the owl close-up under the moon (the constant)
const owlClose = (eyes) => [
  boxes([[0, 0, 150, 260, '#14153a'], ...stars(60, 0, 0, 144, 150, 21)]),
  boxes(disc(72, 70, 40, C.cream)), boxes(disc(62, 60, 7, '#f0dca8')), boxes(disc(86, 84, 5, '#f0dca8')),
  boxes([[0, 100, 40, 6, '#2a2c66'], [8, 96, 24, 4, '#2a2c66'], [100, 120, 50, 6, '#2a2c66'], [110, 116, 30, 4, '#2a2c66'], [20, 140, 34, 4, '#22245a']]),
  boxes([...bands(['#14153a', '#101236'], 194, 260, 0, 150), ...skyline(0, 260, 150, 9, ['#0c0d2a', '#101236', '#14153a'])]),
  boxes([[-10, 178, 170, 9, '#4a2e1c'], [-10, 177, 170, 2, '#6a4428'], [-10, 186, 170, 2, '#3a2418'], [120, 170, 3, 8, '#4a2e1c'], [122, 166, 8, 3, '#4a2e1c'],
    ...disc(132, 164, 4, '#3f7a5a'), ...disc(138, 168, 3, '#4f8a4f'), ...disc(18, 172, 4, '#3f7a5a'), ...disc(12, 175, 3, '#4f8a4f'), [40, 184, 3, 8, '#4a2e1c'], ...disc(41, 194, 3, '#3f7a5a')]),
  Owl({ x: 216, y: 178 * P - 20 * 12, p: 12, eyes }),
]
const sky = () => [boxes(bands(['#070820', '#0b0c26', '#101236', '#16184a', '#1d1e56'], 0, 256, 0, 144)), boxes(stars(90, 0, 0, 144, 200, 31)), boxes(disc(126, 18, 13, '#22245e')), boxes(disc(126, 18, 10, C.cream)), boxes(disc(122, 15, 2, '#f0dca8')), boxes(disc(129, 22, 1, '#f0dca8')), boxes(skyline(-4, 256, 152, 3, ['#0c0d2a', '#101236', '#14153a'])), boxes(skyline(-4, 256, 152, 8, ['#16184a', '#1c2550', '#1d1e56']))]

export const PLATES = {
  room: room({ eyes: 'closed' }), room_open: room(), room_blink: room({ eyes: 'closed', owl: 'closed' }), room_wide: room({ eyes: 'wide', sweat: true }), room_wide2: room({ eyes: 'wide', sweat: true, mouth: 'o' }),
  room_smile: room({ mouth: 'smile', eyes: 'closed' }), room_happy: room({ mouth: 'smile', owl: 'happy' }), room_up: room({ eyes: 'side', mouth: 'flat' }),
  dict: room({ notebook: true, eyes: 'down' }), dict_b: room({ notebook: true, eyes: 'closed' }), dict_owl: room({ notebook: true, eyes: 'down', cassette: true }),
  speed1: room({ eyes: 'fierce', mouth: 'flat', sweat: true }), speed2: room({ eyes: 'wide', mouth: 'o', sweat: true }), slow: room({ eyes: 'half', mouth: 'smile' }),
  bed: bed(), bed_b: bed({ eyes: 'closed' }), bed_sad: bed({ eyes: 'open', mouth: 'flat' }),
  kitchen: kitchen({ eyes: 'happy', mouth: 'smile' }), kitchen_shout: kitchen({ mom: 'wide', steam: 1, eyes: 'happy', mouth: 'smile' }), kitchen_shout2: kitchen({ mom: 'open', eyes: 'closed', mouth: 'smile' }),
  street: street({ eyes: 'happy', mouth: 'smile' }), street_b: street({ eyes: 'closed', mouth: 'smile' }),
  hall: hall(), close: close(), close_scared: close({ eyes: 'wide', sweat: true }), close_smirk: close({ eyes: 'half', mouth: 'smile' }), close_calm: close({ eyes: 'down', mouth: 'smile' }),
  sheet: sheet(), owl_open: owlClose('open'), owl_wink: owlClose('wink'), owl_happy: owlClose('happy'), sky: sky(),
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
