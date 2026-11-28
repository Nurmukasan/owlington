// Universe #7 — "60 days of grammar only". Classic Timur backdrops (same sets as every episode), rendered at 2x
// and used as stills. Grammar workbooks lie flat in a stack on the right of the desk (books are stacked, cans never),
// an open grammar textbook with a red correction in front of him, and a school skeleton for "grammar = the skeleton".
import { W, H, C, P, boxes, outlined } from './lib.jsx'
import { Boy, BoyBack, Owl, Examiner, ExaminerBack, Person, Invigilator } from './chars.jsx'
import { bedroomNight, deskFront, lampGlow, examHall, classroom, disc, stars, bands, skyline } from './sets.jsx'
import { examRoom, examProps } from './sets2.jsx'

const DESK = 182
// a workbook lying flat, seen from the front: cover lines top and bottom, cream page edge, coloured spine on the left
const book = (x, base, col, w = 24) => outlined([[0, 0, w, 4, '#fbf7ec'], [0, 0, w, 1, col, 1], [0, 3, w, 1, col, 1], [0, 0, 3, 4, col, 1], [4, 2, w - 6, 1, '#e4dccb', 1]], x * P, (base - 4) * P)
const COLS = ['#2e51a6', '#3f9a5a', '#c8402e', '#e8a040', '#6a4c9a', '#2e51a6', '#3f9a5a']
// level 0: one book, 1: three, 2: five, 3: seven (the top one is the red notebook of mistakes)
const stack = (level) => {
  const n = [1, 3, 5, 7][level], o = []
  for (let i = 0; i < n; i++) o.push(book(96 + ((i * 3) % 4) - 1, DESK - i * 4, i === n - 1 && level > 0 ? '#d8323c' : COLS[i], i % 2 ? 22 : 24))
  return o
}
// the open grammar textbook in front of him (blue cover, two pages of lines, one red correction)
const openBook = () => boxes([[40, 175, 32, 7, '#2e51a6'], [41, 175, 15, 6, '#fbf7ec'], [56, 175, 15, 6, '#f4efe2'], [55, 175, 1, 7, '#1d3a80'],
  [43, 177, 10, 1, '#9aa8c8'], [43, 179, 8, 1, '#9aa8c8'], [58, 177, 10, 1, '#9aa8c8'], [58, 179, 9, 1, '#d8323c']])

// a dawn window over the night one (morning / day scenes)
const dawn = () => boxes([...bands(['#f6d6a8', '#f6c08a', '#f2a07a', '#d8806e', '#a86a7e'], 26, 92, 86, 50), ...disc(122, 70, 7, '#fff1c0'), ...skyline(86, 92, 50, 5, ['#7a5a7e', '#8a6a86', '#6a4a70'], ['#ffe7a8'])])

// 1. Timur at his desk (the room of every episode)
const room = ({ level = 0, day = false, owl = 'open', ...o } = {}) => [
  bedroomNight({ lampOn: true }), day ? dawn() : null, lampGlow(600, 840, 360, day ? 0.16 : 0.34),
  Boy({ x: 280, y: 700, p: 10, mode: 'write', ...o }), deskFront({ y: DESK }),
  openBook(), ...stack(level),
  owl ? Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: owl }) : null,
]
// 2. the exam sets
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
// 3. "grammar is the skeleton": the school skeleton on its stand under the blackboard, mouth shut; the owl on the board ledge
const BONE = '#f2ead8', HOLE = '#3a3040'
const skeleton = () => boxes([
  [126, 98, 2, 100, '#7a7888'], [110, 98, 18, 2, '#7a7888'], [110, 100, 2, 4, '#7a7888'], [100, 196, 30, 3, '#605f71'],
  [104, 104, 12, 10, BONE], [105, 103, 10, 1, BONE], [106, 107, 3, 3, HOLE], [111, 107, 3, 3, HOLE], [109, 111, 2, 2, HOLE],
  [105, 114, 10, 4, BONE], [106, 115, 8, 1, HOLE], [107, 115, 1, 2, BONE], [109, 115, 1, 2, BONE], [111, 115, 1, 2, BONE], [113, 115, 1, 2, BONE],
  [109, 118, 2, 38, BONE], [98, 120, 24, 2, BONE],
  ...[0, 1, 2, 3, 4].flatMap((k) => [[102 + (k > 2 ? 1 : 0), 124 + k * 5, 7 - (k > 2 ? 1 : 0), 2, BONE], [111, 124 + k * 5, 7 - (k > 2 ? 1 : 0), 2, BONE]]),
  [97, 121, 2, 22, BONE], [121, 121, 2, 22, BONE], [96, 143, 2, 17, BONE], [122, 143, 2, 17, BONE], [95, 160, 4, 3, BONE], [121, 160, 4, 3, BONE],
  [102, 154, 16, 6, BONE], [107, 156, 6, 3, HOLE],
  [104, 160, 3, 21, BONE], [113, 160, 3, 21, BONE], [104, 181, 3, 2, '#d8cfb8'], [113, 181, 3, 2, '#d8cfb8'], [104, 183, 3, 13, BONE], [113, 183, 3, 13, BONE], [101, 194, 6, 2, BONE], [113, 194, 6, 2, BONE],
])
const skel = () => [classroom(), skeleton(), Owl({ x: 26 * P, y: 102 * P - 16 * 5, p: 5, eyes: 'open' })]
// 4. close-up of the owl on the sill at night, and the night sky for the result
const owlClose = (eyes) => [
  boxes([[0, 0, 150, 260, '#14153a'], ...stars(60, 0, 0, 144, 150, 21)]),
  boxes(disc(72, 70, 40, C.cream)), boxes(disc(62, 60, 7, '#f0dca8')), boxes(disc(86, 84, 5, '#f0dca8')),
  boxes([...bands(['#14153a', '#101236'], 194, 260, 0, 150), ...skyline(0, 260, 150, 9, ['#0c0d2a', '#101236', '#14153a'])]),
  boxes([[-10, 178, 170, 9, '#4a2e1c'], [-10, 177, 170, 2, '#6a4428'], [-10, 186, 170, 2, '#3a2418']]),
  Owl({ x: 216, y: 178 * P - 20 * 12, p: 12, eyes }),
]
const sky = () => [boxes(bands(['#070820', '#0b0c26', '#101236', '#16184a', '#1d1e56'], 0, 256, 0, 144)), boxes(stars(90, 0, 0, 144, 200, 31)), boxes(disc(126, 18, 13, '#22245e')), boxes(disc(126, 18, 10, C.cream)), boxes(skyline(-4, 256, 152, 3, ['#0c0d2a', '#101236', '#14153a'])), boxes(skyline(-4, 256, 152, 8, ['#16184a', '#1c2550', '#1d1e56']))]

export const PLATES = {
  hook: room({ level: 3, eyes: 'fierce', mouth: 'flat', owl: null }), hook_b: room({ level: 3, eyes: 'closed', mouth: 'flat', owl: null }),
  fresh: room({ day: true, eyes: 'open', mouth: 'smile' }), fresh_b: room({ day: true, eyes: 'closed', mouth: 'smile' }), fire: room({ day: true, eyes: 'fierce', mouth: 'grin' }),
  write: room({ level: 1, eyes: 'down', mouth: 'flat' }), write_t: room({ level: 1, eyes: 'down', mouth: 'open' }), write_t2: room({ level: 1, eyes: 'down', mouth: 'o' }),
  happy: room({ level: 1, eyes: 'happy', mouth: 'grin' }), happy_b: room({ level: 1, eyes: 'closed', mouth: 'grin' }),
  explain: room({ level: 2, mode: 'gesture', eyes: 'happy', mouth: 'open' }), explain_b: room({ level: 2, mode: 'gesture', eyes: 'happy', mouth: 'wide' }),
  explain_z: room({ level: 2, mode: 'gesture', eyes: 'happy', mouth: 'open', owl: 'closed' }), explain_zb: room({ level: 2, mode: 'gesture', eyes: 'happy', mouth: 'wide', owl: 'closed' }),
  d30: room({ level: 3, day: true, eyes: 'fierce', mouth: 'smile' }), d30_b: room({ level: 3, day: true, eyes: 'closed', mouth: 'smile' }),
  dark: room({ level: 3, eyes: 'half', mouth: 'flat' }), dark_b: room({ level: 3, eyes: 'closed', mouth: 'flat' }),
  end: room({ level: 3, day: true, eyes: 'happy', mouth: 'smile', owl: 'happy' }),
  examA: examA(), examA_talk: examA({ mouth: 'open' }),
  examB_um: examB({ eyes: 'wide', mouth: 'o', sweat: true }), examB_blink: examB({ eyes: 'closed', sweat: true }), examB_talk: examB({ eyes: 'side', mouth: 'open', sweat: true }),
  hall: hall(), skel: skel(), owl_open: owlClose('open'), owl_wink: owlClose('wink'), sky: sky(),
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
