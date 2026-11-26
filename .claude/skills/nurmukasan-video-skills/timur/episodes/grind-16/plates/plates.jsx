// Universe #6 (60 days x 16 hours): backdrops rendered at 2x and used as stills. Text that sits ON an object
// (calendar, laptop screen, alarm clock, the owl's note) is drawn in the edit inside a Plane with the same
// rotation/skew as the object below — the geometry constants here are mirrored in edit/geo.jsx.
import { W, H, C, P, boxes } from './lib.jsx'
import { Boy, BoyBack, Owl, Examiner, ExaminerBack, Person, Mom, Invigilator } from './chars.jsx'
import { bedroomNight, deskFront, lampGlow, examHall, disc, stars, bands, skyline } from './sets.jsx'
import { examRoom, examProps, bathroom, mirrorInside, busStopStreet } from './sets2.jsx'

const glow = (cx, cy, r, col, a) => <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={{ kind: 'radial', stops: [{ offset: 0, color: col, opacity: a }, { offset: 0.65, color: col, opacity: 0 }] }} />
const poly = (pts, fill) => <path d={'M' + pts.map(([x, y]) => `${x} ${y}`).join('L') + 'Z'} fill={fill} />
const rotPts = (cx, cy, w, h, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]) }
const rotRect = (cx, cy, w, h, deg, fill) => poly(rotPts(cx, cy, w, h, deg), fill)

// --- shared geometry (px, 720x1280) -------------------------------------------------------------------------
export const CAL = { cx: 125, cy: 520, w: 76, h: 92, rot: 5 }          // tear-off calendar on the bedroom wall
export const CLOCK = { cx: 360, cy: 600, r: 44 }                        // wall clock above Timur in the hook
export const ALARM = { x: 62, y: 700, w: 78, h: 44 }                    // alarm clock face on the nightstand
export const SCREEN = [[388, 606], [596, 628], [596, 776], [388, 760]]   // laptop screen (3/4 view), crash plate

// the tear-off calendar (blank sheet: the day number is drawn in the edit, rotated with it)
const calendar = () => {
  const { cx, cy, w, h, rot } = CAL
  return [rotRect(cx + 3, cy + 4, w, h, rot, '#14142e'), rotRect(cx, cy, w + 6, h + 6, rot, C.ink), rotRect(cx, cy, w, h, rot, '#fbf7ec'),
    poly(rotPts(cx, cy, w, h, rot).map(([x, y], i) => (i < 2 ? [x, y] : [x, y])).slice(0, 2).concat(rotPts(cx, cy - h / 2 + 11, w, 22, rot).slice(2)), '#d8323c'),
    rotRect(cx - 18, cy - h / 2 - 2, 6, 10, rot, '#a9a8bb'), rotRect(cx + 18, cy - h / 2 + 1, 6, 10, rot, '#a9a8bb')]
}
// energy drinks and coffee mugs, stacked from the desk top up (art px); returns the boxes and the top y
export const tower = (x, base, n, start = 0) => {
  const o = []; let y = base
  for (let i = 0; i < n; i++) {
    const can = (i + start) % 2 === 1
    if (can) { o.push([x, y - 12, 7, 12, '#1a1424'], [x + 1, y - 11, 5, 10, '#2e51a6'], [x + 1, y - 7, 5, 2, '#ffd23f'], [x + 2, y - 11, 3, 1, '#a9a8bb']); y -= 12 }
    else { o.push([x, y - 7, 8, 7, '#1a1424'], [x + 1, y - 6, 6, 5, '#f4f0e8'], [x + 1, y - 6, 6, 1, '#7a4c2a'], [x + 7, y - 5, 2, 3, '#1a1424']); y -= 7 }
  }
  return { o, top: y }
}
export const TOWER_L = 12, TOWER_R = 124, DESK = 182
const LEVELS = [[0, 0], [2, 1], [5, 3], [9, 6]]

// a dawn window over the night one (morning scenes)
const dawn = () => boxes([...bands(['#f6d6a8', '#f6c08a', '#f2a07a', '#d8806e', '#a86a7e'], 26, 92, 86, 50), ...disc(122, 70, 7, '#fff1c0'), ...skyline(86, 92, 50, 5, ['#7a5a7e', '#8a6a86', '#6a4a70'], ['#ffe7a8'])])

// 1. the bedroom desk. level 0..3 = how many mugs/cans; day = dawn window; calendar on the wall
const room = ({ level = 0, day = false, owl = 'open', clock = false, lamp = true, ...o } = {}) => {
  const out = [bedroomNight({ lampOn: lamp })]
  if (day) out.push(dawn())
  if (lamp) out.push(lampGlow(600, 840, 360, day ? 0.16 : 0.34))
  out.push(...calendar())
  if (clock) out.push(boxes(disc(CLOCK.cx / P, CLOCK.cy / P, 10, C.ink)), boxes(disc(CLOCK.cx / P, CLOCK.cy / P, 9, '#fffaf0')),
    boxes([[CLOCK.cx / P - 0.5, CLOCK.cy / P - 9, 1, 2, C.ink], [CLOCK.cx / P - 0.5, CLOCK.cy / P + 7, 1, 2, C.ink], [CLOCK.cx / P - 9, CLOCK.cy / P - 0.5, 2, 1, C.ink], [CLOCK.cx / P + 7, CLOCK.cy / P - 0.5, 2, 1, C.ink]]))
  out.push(Boy({ x: 280, y: 700, p: 10, mode: 'write', ...o }), deskFront({ y: DESK, lamp }))
  const [nl, nr] = LEVELS[level]
  out.push(boxes([...tower(TOWER_L, DESK, nl).o, ...tower(TOWER_R, DESK, nr, 1).o,
    [44, 175, 22, 7, '#2e3a6a'], [45, 175, 10, 6, '#fbf7ec'], [56, 175, 10, 6, '#f4efe2'], [55, 175, 1, 7, '#9a8c70']]))
  out.push(Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: owl }))
  return out
}

// 2. crash: asleep face-down on the laptop, the screen turned 3/4 towards us (its plane is SCREEN), cans everywhere
const crash = ({ grey = true, owl = 'closed', lamp = true, owlDesk = null, note = false } = {}) => {
  const out = [bedroomNight({ lampOn: lamp })]
  if (lamp) out.push(lampGlow(600, 700, 340, 0.32))
  out.push(...calendar())
  // laptop: lid (dark rim) + screen + keyboard base
  const [a, b, c, d] = SCREEN
  out.push(poly([[a[0] - 8, a[1] - 8], [b[0] + 8, b[1] - 6], [c[0] + 8, c[1] + 8], [d[0] - 8, d[1] + 8]], '#2e2a3c'))
  out.push(poly(SCREEN, lamp || owlDesk === null ? '#1d3a7a' : '#0e1430'))
  out.push(poly([[d[0] - 14, d[1] + 10], [c[0] + 12, c[1] + 8], [c[0] + 40, 804], [d[0] - 30, 800]], '#605f71'), poly([[d[0] - 6, d[1] + 14], [c[0] + 6, c[1] + 12], [c[0] + 26, 796], [d[0] - 18, 792]], '#8d8b9c'))
  out.push(glow(490, 690, 200, '#5d99ea', lamp ? 0.16 : 0.08))
  out.push(Boy({ x: 330, y: 600, p: 10, mode: 'sleepdesk', grey, bags: true, phones: true }))
  out.push(deskFront({ y: 160, lamp }))
  out.push(boxes([[14, 148, 7, 12, '#1a1424'], [15, 149, 5, 10, '#2e51a6'], [15, 153, 5, 2, '#ffd23f'], [24, 152, 8, 8, '#1a1424'], [25, 153, 6, 6, '#f4f0e8'], [25, 153, 6, 1, '#7a4c2a'],
    [126, 157, 12, 3, '#1a1424'], [127, 157, 10, 2, '#2e51a6'], [129, 157, 3, 2, '#ffd23f']]))
  if (owlDesk) {
    out.push(Owl({ x: 520, y: 800 - 20 * 6, p: 6, eyes: owlDesk, wing: true }))
    if (note) out.push(...ownNote())
  } else out.push(Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: owl }))
  return out
}
// the owl's sticky note, stuck on the laptop screen: it follows the screen's slope (skewY), and so does its text
export const NOTE = { x: 486, y: 626, w: 92, h: 64, skewY: 6.04 }
const ownNote = () => {
  const { x, y, w, h, skewY } = NOTE, k = Math.tan((skewY * Math.PI) / 180), dy = w * k
  return [poly([[x + 3, y + 4], [x + w + 3, y + dy + 4], [x + w + 3, y + dy + h + 4], [x + 3, y + h + 4]], '#14142e'),
    poly([[x, y], [x + w, y + dy], [x + w, y + dy + h], [x, y + h]], '#fff3b0'), poly([[x, y], [x + w, y + dy], [x + w, y + dy + 8], [x, y + 8]], '#f2d860'),
    <frame x={x} y={y + dy / 2} width={w} height={h} layout="none" origin="center" animate={[{ property: 'skewY', from: skewY, to: skewY, at: 0, duration: 1 }]}>
      <text x={0} y={14} width={w} fontFamily="Press Start 2P" fontWeight={400} fontSize={11} color={C.ink} align="center" lineHeight={1.55}>{'СОВА\nЗНАЕТ\nКАК'}</text>
    </frame>]
}

// 3. bed at 6:00 (alarm clock on the nightstand, its digits in the edit) and asleep (the dream)
const bed = ({ wake = false, ...o } = {}) => [
  bedroomNight(), wake ? dawn() : null, glow(360, 800, 240, wake ? '#ffd27a' : '#5d99ea', wake ? 0.18 : 0.12),
  boxes([[8, 140, 128, 22, '#5a3a22'], [10, 142, 124, 18, '#6e4628'], [12, 144, 120, 2, '#8a5a32'], [6, 134, 6, 90, '#4a2e1c'], [132, 134, 6, 90, '#4a2e1c'],
    [16, 156, 34, 14, '#e8e4f0'], [16, 156, 34, 3, '#ffffff'], [94, 156, 34, 14, '#e8e4f0'], [94, 156, 34, 3, '#ffffff'],
    // nightstand with the alarm clock (face = ALARM)
    [8, 152, 26, 40, '#5a3a22'], [8, 152, 26, 3, '#8a5a32'], [10, 164, 22, 1, '#3a2418'], [11, 138, 18, 14, '#1a1424'], [12, 139, 16, 12, '#2e2a3c'], [12, 137, 3, 2, '#d8323c'], [25, 137, 3, 2, '#d8323c']]),
  Boy({ x: 300, y: wake ? 640 : 690, p: 10, mode: 'arms', ...o }),
  boxes([[8, 184, 128, 32, '#2e51a6'], ...Array.from({ length: 16 }, (_, i) => [8 + i * 8, 184, 4, 32, '#3a62b8']), [8, 184, 128, 4, '#e8e4f0'], [8, 216, 128, 6, '#4a2e1c']]),
  Owl({ x: 94 * P, y: 74 * P, p: 5, eyes: 'closed' }),
]

// 4. kitchen: mum at the stove, Timur at the table in headphones over his notebook
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
  k.push([112, 18, 30, 40, '#5a3a22'], [114, 20, 26, 36, '#9cc4f0'], [126, 20, 2, 36, '#5a3a22'], [114, 37, 26, 2, '#5a3a22'])
  k.push([-20, 182, 190, 100, '#c8b8a0'])
  for (let y = 182; y < 280; y += 10) for (let x = -20; x < 170; x += 10) if (((x + y) / 10) % 2 === 0) k.push([x, y, 10, 10, '#b8a890'])
  k.push([71, -20, 1, 70, '#2e2a3c'], [62, 50, 20, 8, '#e8a040'], [64, 58, 16, 2, '#fff1a8'])
  return [boxes(k), glow(360, 360, 420, '#ffd88a', 0.3), Mom({ x: 110, y: 650, p: 9, mouth: mom }),
    Boy({ x: 330, y: 760, p: 10, mode: 'write', phones: true, ...o }),
    boxes([[-10, 190, 170, 5, '#f4f0e8'], [-10, 195, 170, 3, '#d8c8b0'], [-8, 198, 166, 82, '#b07a45'], [-8, 198, 166, 2, '#8a5a32'],
      [70, 186, 26, 5, '#fbf7ec'], [83, 186, 1, 5, '#9a8c70'], [100, 184, 9, 6, '#f4f0e8'], [101, 184, 7, 1, '#7a4c2a']])]
}

// 5. mirror (speaking practice), street walk, exam rooms, hall, owl close-ups, night sky
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
const sky = () => [boxes(bands(['#070820', '#0b0c26', '#101236', '#16184a', '#1d1e56'], 0, 256, 0, 144)), boxes(stars(90, 0, 0, 144, 200, 31)), boxes(disc(126, 18, 10, C.cream)), boxes(skyline(-4, 256, 152, 3, ['#0c0d2a', '#101236', '#14153a']))]

export const PLATES = {
  hook: room({ level: 3, clock: true, grey: true, bags: true, eyes: 'wide', mouth: 'flat', phones: true, owl: 'closed' }),
  hook_b: room({ level: 3, clock: true, grey: true, bags: true, eyes: 'closed', mouth: 'flat', phones: true, owl: 'closed' }),
  fresh: room({ day: true, eyes: 'open', mouth: 'smile' }), fresh_b: room({ day: true, eyes: 'closed', mouth: 'smile' }),
  read: room({ level: 1, eyes: 'down', phones: true }), write: room({ level: 1, eyes: 'fierce', mouth: 'flat' }),
  happy: room({ level: 1, eyes: 'happy', mouth: 'smile' }),
  wk2: room({ level: 1, eyes: 'half', bags: true }), wk2b: room({ level: 1, eyes: 'closed', bags: true }),
  wk3: room({ level: 3, eyes: 'half', mouth: 'flat', bags: true }), wk4: room({ level: 3, eyes: 'half', mouth: 'flat', bags: true, grey: true }),
  auto: room({ level: 3, eyes: 'half', mouth: 'o', bags: true, grey: true }), auto_b: room({ level: 3, eyes: 'closed', mouth: 'o', bags: true, grey: true }),
  nod: room({ level: 3, eyes: 'closed', mouth: 'flat', bags: true, grey: true, phones: true }),
  crash: crash(), crash_owl: crash({ owl: 'open' }),
  owl_lamp: crash({ owlDesk: 'open' }), owl_dark: crash({ owlDesk: 'happy', lamp: false, note: true }), owl_dark_w: crash({ owlDesk: 'wink', lamp: false, note: true }),
  focus: room({ day: true, eyes: 'fierce', mouth: 'smile' }), focus_b: room({ day: true, eyes: 'closed', mouth: 'smile' }),
  end: room({ day: true, eyes: 'happy', mouth: 'smile', owl: 'happy' }),
  bed_alarm: bed({ wake: true, eyes: 'half', mouth: 'o' }), bed_alarm2: bed({ wake: true, eyes: 'wide', mouth: 'o', sweat: true }), bed_dream: bed({ eyes: 'closed' }),
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
  await p.add('../fonts/PressStart2P-Regular.ttf')
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
