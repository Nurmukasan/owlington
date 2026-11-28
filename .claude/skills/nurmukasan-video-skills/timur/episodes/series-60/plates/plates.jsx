// Universe #8 — "60 days of TV series only". Classic Timur backdrops rendered at 2x and used as stills.
// Timur watches on his laptop (back of the lid, blue screen light on his face, a popcorn bucket in the binge phase);
// the screen itself shows a pixel sitcom living room — subtitles are drawn in the edit (world space) on its bottom band.
import { W, H, C, P, boxes, outlined } from './lib.jsx'
import { Boy, BoyBack, Owl, Examiner, ExaminerBack, Jake, Person, Invigilator } from './chars.jsx'
import { bedroomNight, deskFront, lampGlow, examHall, disc, stars, bands, skyline } from './sets.jsx'
import { examRoom, examProps, laptopBack, jakeRoom } from './sets2.jsx'

const glow = (cx, cy, r, col, a) => <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={{ kind: 'radial', stops: [{ offset: 0, color: col, opacity: a }, { offset: 0.65, color: col, opacity: 0 }] }} />
const DESK = 182
// a striped popcorn bucket standing on the desk (right of the laptop)
const popcorn = (x, base) => outlined([
  [1, 3, 12, 11, '#f4f0e8'], [1, 3, 2, 11, '#d8323c', 1], [5, 3, 2, 11, '#d8323c', 1], [9, 3, 2, 11, '#d8323c', 1], [0, 3, 14, 1, '#c8c0b0', 1],
  [1, 0, 3, 3, '#fff3c8'], [3, -1, 3, 3, '#fff8e0'], [6, 0, 3, 3, '#ffe9a8'], [9, -1, 3, 3, '#fff3c8'], [11, 0, 2, 3, '#ffe9a8'], [5, -2, 3, 2, '#fffaf0'],
], x * P, (base - 14) * P)
// phase 2: an open dictionary and the phrase notebook next to the laptop
const study = () => boxes([[8, 177, 26, 5, '#2e51a6'], [9, 177, 12, 4, '#fbf7ec'], [21, 177, 12, 4, '#f4efe2'], [11, 178, 8, 1, '#9aa8c8'], [23, 178, 7, 1, '#9aa8c8'],
  [102, 176, 18, 6, '#1a1424'], [103, 176, 16, 5, '#fff3b0'], [105, 177, 10, 1, '#d8323c'], [105, 179, 8, 1, '#6a6070']])
const dawn = () => boxes([...bands(['#f6d6a8', '#f6c08a', '#f2a07a', '#d8806e', '#a86a7e'], 26, 92, 86, 50), ...disc(122, 70, 7, '#fff1c0'), ...skyline(86, 92, 50, 5, ['#7a5a7e', '#8a6a86', '#6a4a70'], ['#ffe7a8'])])

// 1. Timur at his desk behind the laptop
const watch = ({ day = false, owl = 'open', pop = false, books = false, ...o } = {}) => [
  bedroomNight({ lampOn: true }), day ? dawn() : null, lampGlow(600, 840, 360, day ? 0.14 : 0.26),
  Boy({ x: 280, y: 650, p: 10, mode: 'arms', ...o }),
  glow(360, 740, 230, '#7fb4ff', day ? 0.1 : 0.22),
  deskFront({ y: DESK }), laptopBack(DESK),
  pop ? popcorn(104, DESK) : null, books ? study() : null,
  owl ? Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: owl }) : null,
]
// 2. the laptop screen: a pixel sitcom living room (two friends on a sofa), desk and keyboard below
const SIT_WALL = '#f0b878'
const tv = ({ a = {}, b = {}, pop = true } = {}) => {
  const w = [[4, 50, 136, 104, SIT_WALL]]
  for (let x = 8; x < 140; x += 12) w.push([x, 50, 1, 62, '#e4a868'])
  w.push([96, 58, 32, 30, '#fbf7ec'], [98, 60, 28, 26, '#7fb0f0'], [111, 60, 2, 26, '#fbf7ec'], [98, 72, 28, 2, '#fbf7ec'], [99, 61, 8, 3, '#ffffff'],
    [14, 60, 24, 18, '#5a3a22'], [16, 62, 20, 14, '#3f8a7a'], [18, 70, 8, 6, '#e8d070'], [26, 66, 9, 10, '#2e51a6'],
    [50, 62, 10, 6, '#ffe7a8'], [54, 68, 2, 30, '#605f71'], [50, 98, 10, 2, '#605f71'], [4, 112, 136, 42, '#a86a4a'], [4, 112, 136, 2, '#8a5a3a'])
  return [
    boxes([[-20, -20, 190, 300, '#14153a'], [-20, 40, 190, 1, '#1d1e4e']]),
    glow(360, 520, 520, '#ffb070', 0.18),
    boxes([[2, 48, 140, 108, '#1a1424']]), boxes(w),
    Person({ x: 130, y: 372, p: 8, hair: '#3a2418', shirt: '#3f9a5a', ...a }),
    Person({ x: 462, y: 372, p: 8, hair: '#d0a040', style: 'long', shirt: '#c8507a', ...b }),
    boxes([[10, 108, 124, 18, '#5a7090'], [10, 108, 124, 2, '#7a90b0'], [6, 104, 10, 30, '#4a6080'], [128, 104, 10, 30, '#4a6080'], [10, 126, 124, 10, '#4a6080'], [12, 134, 4, 6, '#2e2a3c'], [128, 134, 4, 6, '#2e2a3c'],
      [40, 112, 1, 14, '#4a6080'], [72, 112, 1, 14, '#4a6080'], [104, 112, 1, 14, '#4a6080']]),
    boxes([[-6, 156, 156, 4, '#605f71'], [-12, 160, 168, 26, '#8d8b9c'], [-14, 186, 172, 4, '#605f71'], [-20, 190, 190, 90, C.woodD], [-20, 190, 190, 3, C.woodL]]),
    boxes(Array.from({ length: 4 }, (_, r) => Array.from({ length: 12 }, (_, c) => [6 + c * 11 - r, 163 + r * 5, 9, 3, '#a9a8bb'])).flat()),
    pop ? popcorn(118, 196) : null,
  ]
}
// 3. the video call with Jake (same layout as vocab-60): Jake big, Timur's self-view top-left
const jscreen = ({ jake = {}, me = {} } = {}) => [
  boxes([[-20, -20, 190, 300, '#14153a'], [-20, 40, 190, 1, '#1d1e4e']]),
  glow(360, 520, 520, '#5d7fd0', 0.25),
  boxes([[2, 48, 140, 108, '#1a1424'], [4, 50, 136, 104, '#2e2a3c'], [70, 51, 4, 1, '#605f71']]),
  jakeRoom(30, 270, 132, 96, 5),
  Jake({ x: 248, y: 456, p: 14, ...jake }),
  boxes([[12, 56, 30, 32, '#1a1424'], [13, 57, 28, 30, '#262660'], [13, 78, 28, 9, '#3a2a3e']]),
  Boy({ x: 103, y: 352, p: 4, mode: 'arms', ...me }),
  boxes([[-6, 156, 156, 4, '#605f71'], [-12, 160, 168, 26, '#8d8b9c'], [-14, 186, 172, 4, '#605f71'], [-20, 190, 190, 90, C.woodD], [-20, 190, 190, 3, C.woodL]]),
  boxes(Array.from({ length: 4 }, (_, r) => Array.from({ length: 12 }, (_, c) => [6 + c * 11 - r, 163 + r * 5, 9, 3, '#a9a8bb'])).flat()),
]
// 4. exam sets, the night sky and the owl close-up
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

export const PLATES = {
  hook: watch({ pop: true, owl: null, eyes: 'happy', mouth: 'grin' }), hook_b: watch({ pop: true, owl: null, eyes: 'closed', mouth: 'grin' }),
  fresh: watch({ day: true, eyes: 'open', mouth: 'smile' }), fresh_b: watch({ day: true, eyes: 'closed', mouth: 'smile' }),
  laugh: watch({ pop: true, eyes: 'happy', mouth: 'grin' }), laugh_b: watch({ pop: true, eyes: 'happy', mouth: 'wide' }),
  read: watch({ pop: true, eyes: 'down', mouth: 'smile' }), read_b: watch({ pop: true, eyes: 'closed', mouth: 'smile' }),
  dull: watch({ pop: true, eyes: 'down', mouth: 'flat' }), wide: watch({ pop: true, eyes: 'wide', mouth: 'o', sweat: true }),
  tired: watch({ books: true, eyes: 'half', mouth: 'flat', bags: true }), tired_b: watch({ books: true, eyes: 'closed', mouth: 'flat', bags: true }),
  focus: watch({ books: true, eyes: 'fierce', mouth: 'flat' }), happy: watch({ day: true, books: true, eyes: 'happy', mouth: 'grin' }), happy_b: watch({ day: true, books: true, eyes: 'closed', mouth: 'grin' }),
  nosub: watch({ day: true, eyes: 'wide', mouth: 'flat' }), nosub_b: watch({ day: true, eyes: 'closed', mouth: 'flat' }),
  laugh3: watch({ day: true, eyes: 'happy', mouth: 'wide' }), laugh3_b: watch({ day: true, eyes: 'happy', mouth: 'grin' }),
  call: watch({ day: true, eyes: 'happy', mouth: 'smile' }), call_talk: watch({ day: true, eyes: 'happy', mouth: 'open' }),
  call_um: watch({ day: true, eyes: 'wide', mouth: 'o', sweat: true }), call_um2: watch({ day: true, eyes: 'wide', mouth: 'flat', sweat: true }), call_blink: watch({ day: true, eyes: 'closed', mouth: 'flat', sweat: true }),
  end: watch({ day: true, books: true, eyes: 'happy', mouth: 'smile', owl: 'happy' }),
  tv: tv(), tv_talk: tv({ b: { mouth: 'wide' }, a: { eyes: 'wide', mouth: 'o' } }), tv_talk2: tv({ b: { mouth: 'open' }, a: { eyes: 'wide', mouth: 'o' } }), tv_laugh: tv({ a: { eyes: 'happy', mouth: 'grin' }, b: { eyes: 'happy', mouth: 'grin' } }),
  jscreen: jscreen(), jscreen_talk: jscreen({ jake: { mouth: 'open' } }), jscreen_q: jscreen({ jake: { brow: 'up' }, me: { eyes: 'wide', sweat: true } }),
  examA: examA(), examA_talk: examA({ mouth: 'open' }), examA_huh: examA({ eyes: 'wide' }),
  examB_epic: examB({ eyes: 'fierce', mouth: 'flat' }), examB_epic_talk: examB({ eyes: 'fierce', mouth: 'open' }),
  examB_um: examB({ eyes: 'wide', mouth: 'o', sweat: true }), examB_blink: examB({ eyes: 'closed', sweat: true }),
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
