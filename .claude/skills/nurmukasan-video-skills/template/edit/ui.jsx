import { W, H, C, FONT, T, Layer, boxes, sprite, popScale, popSlide, slam, fadeIn } from './lib.jsx'

// ---- icons (pixel sprites, static: never scale or move a layer that holds them up/left) ----
const OWL = ['..o..........o..', '..oo........oo..', '..obo......obo..', '.obbboooooobbbo.', '.obbbbbbbbbbbbo.', 'obbwwwwbbwwwwbbo', 'obwyyyywwyyyywbo', 'obwyhkywwyhkywbo', 'obwykkynnykkywbo', 'obwyyyynnyyyywbo', 'obbbwwwnnwwwbbbo', '.obbbbbbbbbbbbo.', '..oooooooooooo..']
const OWLP = { o: '#1e120c', b: '#7f5236', w: '#f3e3c3', y: '#ffb627', k: '#120c08', h: '#ffffff', n: '#f08a24' }
const BOW = ['pp...pp', 'pPp.pPp', 'pppPppp', 'pPp.pPp', 'pp...pp']
export const owlHead = (x, y, p = 3) => [...sprite(OWL, OWLP, x, y, p), ...sprite(BOW, { p: '#ff7fbf', P: '#ffc2e2' }, x + 4.5 * p, y - 3 * p, p)]
export const ICON = {
  phones: (x, y, p = 4) => boxes([[2, 0, 8, 2, '#e6dcff'], [1, 1, 2, 4, '#e6dcff'], [9, 1, 2, 4, '#e6dcff'], [0, 5, 3, 5, C.mint], [9, 5, 3, 5, C.mint], [1, 6, 1, 3, '#c8ffe0'], [10, 6, 1, 3, '#c8ffe0']], x, y, p),
  book: (x, y, p = 4) => boxes([[0, 1, 5, 8, '#fff7e6'], [7, 1, 5, 8, '#fff7e6'], [5, 0, 2, 10, C.lilacD], [1, 3, 3, 1, C.gold], [1, 5, 3, 1, C.gold], [8, 3, 3, 1, C.gold], [8, 5, 3, 1, C.gold], [0, 9, 12, 1, C.lilacD]], x, y, p),
  pen: (x, y, p = 4) => boxes([[8, 0, 3, 3, C.yellow], [6, 2, 3, 3, C.yellow], [4, 4, 3, 3, C.yellow], [2, 6, 3, 3, C.gold], [1, 9, 2, 2, C.ink]], x, y, p),
  mic: (x, y, p = 4) => boxes([[4, 0, 4, 6, '#e6dcff'], [5, 1, 2, 4, C.grey], [2, 4, 1, 3, '#e6dcff'], [9, 4, 1, 3, '#e6dcff'], [3, 7, 6, 1, '#e6dcff'], [5, 8, 2, 2, '#e6dcff'], [3, 10, 6, 1, '#e6dcff']], x, y, p),
  sun: (x, y, p = 4) => boxes([[3, 3, 6, 6, C.yellow], [4, 2, 4, 8, C.yellow], [2, 4, 8, 4, C.yellow], [5, 0, 2, 1, C.gold], [5, 11, 2, 1, C.gold], [0, 5, 1, 2, C.gold], [11, 5, 1, 2, C.gold], [1, 1, 1, 1, C.gold], [10, 1, 1, 1, C.gold], [1, 10, 1, 1, C.gold], [10, 10, 1, 1, C.gold]], x, y, p),
  moon: (x, y, p = 4) => boxes([[3, 1, 4, 1, C.cream], [2, 2, 3, 1, C.cream], [1, 3, 3, 5, C.cream], [2, 8, 3, 1, C.cream], [3, 9, 5, 1, C.cream], [5, 8, 4, 1, C.cream], [9, 1, 1, 1, C.yellow], [10, 4, 1, 1, C.yellow]], x, y, p),
  clock: (x, y, p = 4) => boxes([[3, 0, 6, 1, C.white], [1, 1, 10, 10, C.white], [3, 11, 6, 1, C.white], [2, 2, 8, 8, '#fff7e6'], [5, 3, 2, 4, C.ink], [7, 6, 2, 1, C.ink], [0, 3, 1, 6, C.white], [11, 3, 1, 6, C.white]], x, y, p),
  check: (x, y, p = 4) => boxes([[0, 5, 2, 2, C.mint], [2, 7, 2, 2, C.mint], [4, 5, 2, 2, C.mint], [6, 3, 2, 2, C.mint], [8, 1, 2, 2, C.mint]], x, y, p),
}
// ---- panels ----
export const panel = (x, y, w, h, bd = C.lilac, fill = C.panel, r = 14) => [
  <rect x={x + 6} y={y + 9} width={w} height={h} fill={C.ink} opacity={0.55} radius={r} />,
  <rect x={x} y={y} width={w} height={h} fill={{ kind: 'linear', angle: 90, stops: [{ offset: 0, color: C.panel2 }, { offset: 1, color: fill }] }} radius={r} strokeColor={bd} strokeWidth={5} />,
  <rect x={x + 12} y={y + 9} width={w - 24} height={3} fill={C.white} opacity={0.16} radius={2} />,
]
export const paper = (x, y, w, h, bd = C.ink) => [
  <rect x={x + 6} y={y + 9} width={w} height={h} fill={C.ink} opacity={0.55} radius={10} />,
  <rect x={x} y={y} width={w} height={h} fill="#fff8ea" radius={10} strokeColor={bd} strokeWidth={5} />,
  ...Array.from({ length: Math.floor((h - 70) / 34) }, (_, i) => <rect x={x + 22} y={y + 70 + i * 34} width={w - 44} height={2} fill="#d9d2f0" />),
  <rect x={x + 44} y={y + 6} width={2} height={h - 12} fill="#ffb3c8" />,
]
export const tab = (x, y, text, bg = C.pink, fg = C.ink, size = 13) => {
  const w = text.length * size + 26
  return [<rect x={x} y={y} width={w} height={size + 18} fill={bg} radius={8} strokeColor={C.ink} strokeWidth={3} />, T(x + 13, y + 9, w - 20, size, fg, text, 'left', { shadow: false })]
}
export function Chip({ at, dur, x, y, text, bg = C.pink, fg = C.ink, size = 16, anim }) {
  const w = text.length * size + 34
  return (
    <Layer at={at} dur={dur} animate={anim || popSlide(0.25, 24)}>
      <rect x={x + 4} y={y + 6} width={w} height={size + 26} fill={C.ink} opacity={0.6} radius={10} />
      <rect x={x} y={y} width={w} height={size + 26} fill={bg} radius={10} strokeColor={C.ink} strokeWidth={4} />
      {T(x + 17, y + 13, w - 20, size, fg, text, 'left', { shadow: false })}
    </Layer>
  )
}
// ---- top HUD: day pips + countdown + mock (y 128-208 = inside the safe zone) ----
export function Hud({ at, dur, day, left, mock, hot = false }) {
  const pips = []
  for (let i = 0; i < 7; i++) pips.push(<rect x={128 + i * 30} y={182} width={24} height={10} radius={3} fill={i < day ? (i === day - 1 ? C.yellow : C.pink) : '#4a3f72'} />)
  return (
    <Layer at={at} dur={dur}>
      {panel(56, 128, 292, 80)}
      <rect x={68} y={140} width={52} height={56} fill="#3a2f66" radius={8} />
      {owlHead(70, 152, 3)}
      {T(132, 146, 210, 18, C.cream, day > 7 ? 'ЭКЗАМЕН' : `ДЕНЬ ${day}/7`)}
      {pips}
      {panel(372, 128, 292, 80, hot ? C.red : C.lilac)}
      {T(388, 142, 160, 11, C.grey, 'ДО IELTS')}
      {T(388, 164, 170, 22, hot ? C.red : C.yellow, left)}
      {T(560, 142, 92, 11, C.grey, 'MOCK', 'right')}
      {T(540, 164, 112, 22, C.mint, mock, 'right')}
    </Layer>
  )
}
// ---- captions: karaoke words, speaker tab, x 60-600 / y 872 (safe zone) ----
const WHO = { n: [C.white, null], k: ['#ffc2e6', 'КАТЯ'], m: ['#b8f5d4', 'МАМА'], f: ['#ffe08a', 'АНЯ · ГОЛОСОВОЕ'], e: ['#bfe3ff', null] }
export function Caption({ at, dur, words, who = 'n' }) {
  const [col, label] = WHO[who]
  const lab = who === 'e' ? (words[0][0] === 'My' || (words[0][0] === 'Good' && at > 116) ? 'КАТЯ' : 'EXAMINER') : label
  return (
    <Layer at={at} dur={dur}>
      {lab ? tab(330 - (lab.length * 12 + 26) / 2, 822, lab, who === 'k' || lab === 'КАТЯ' ? C.pink : who === 'm' ? C.mint : who === 'f' ? C.yellow : C.sky, C.ink, 12) : null}
      <row x={60} y={872} width={540} gap={16} rowGap={14} wrap={true} justify="center">
        {words.map(([w, t, hi]) => (
          <text fontFamily={FONT} fontWeight={400} fontSize={27} color={hi ? C.yellow : col} lineHeight={1.3}
            shadow={{ x: 3, y: 4, blur: 0, color: C.ink }} strokeColor={C.ink} strokeWidth={7}
            animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.5, easing: 'hold' }, { at: Math.max(0.01, t), value: 1 }] }]}>{w}</text>
        ))}
      </row>
    </Layer>
  )
}
// ---- big centred title (two lines) ----
export function Title({ at, dur, l1, l2, y = 240, c1 = C.cream, c2 = C.yellow, s1 = 30, s2 = 44, anim }) {
  return (
    <Layer at={at} dur={dur} centre animate={anim || popScale(0.3)}>
      {l1 ? T(40, y, 640, s1, c1, l1, 'center', { stroke: true }) : null}
      {l2 ? T(40, y + s1 + 22, 640, s2, c2, l2, 'center', { stroke: true }) : null}
    </Layer>
  )
}
// ---- day banner (one opacity track only!) ----
export function DayCard({ at, dur = 1.6, n, sub }) {
  return (
    <Layer at={at} dur={dur} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: -60 }, { at: 0.28, value: 0, easing: 'ease-out' }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.1, value: 1 }, { at: dur - 0.25, value: 1 }, { at: dur, value: 0 }] }]}>
      {panel(170, 236, 380, sub ? 118 : 88, C.yellow)}
      {T(170, 258, 380, 36, C.yellow, `ДЕНЬ ${n}`, 'center', { stroke: true })}
      {sub ? T(170, 310, 380, 14, C.cream, sub, 'center') : null}
    </Layer>
  )
}
// ---- rule card ----
export function RuleCard({ at, dur, n, lines, y = 380, col = C.pink }) {
  const h = 56 + lines.length * 34
  return (
    <Layer at={at} dur={dur} animate={popScale(0.3)} centre>
      {panel(70, y, 580, h, col)}
      {tab(92, y - 18, `ПРАВИЛО №${n}`, col)}
      {lines.map((l, i) => T(96, y + 34 + i * 34, 530, 20, C.cream, l))}
    </Layer>
  )
}
export { T }
