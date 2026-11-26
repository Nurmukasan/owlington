// UI for universe #5 (vocabulary), laid out inside the TikTok/IG safe zone:
// x 56-664, nothing above y 128, right column (x > 610) free from y 600, captions centred at y 872.
import { W, H, C, FONT, Layer, popScale, popSlide, PText } from './lib.jsx'
import { box, T as Tx } from './ui3.jsx'
import { Steps } from './ui.jsx'

const cardIcon = (x, y) => [
  <rect x={x} y={y + 12} width={44} height={30} fill={C.ink} />, <rect x={x + 3} y={y + 15} width={38} height={24} fill="#fff3b0" />,
  <rect x={x + 14} y={y} width={44} height={30} fill={C.ink} />, <rect x={x + 17} y={y + 3} width={38} height={24} fill="#fbf7ec" />,
  <rect x={x + 22} y={y + 9} width={26} height={4} fill="#6a6070" />, <rect x={x + 22} y={y + 17} width={18} height={4} fill="#a89aa0" />,
]
// top-left skill panel
export function Hud5({ value = '', dots = 0 }) {
  const x = 56, y = 128, w = 320
  const d = []
  for (let i = 0; i < 5; i++) d.push(<rect x={x + 96 + i * 20} y={y + 70} width={12} height={8} fill={i < dots ? C.gold : '#3a3a6e'} />)
  return [
    ...box(x, y, w, 92, C.gold, C.navy1),
    <rect x={x + 10} y={y + 10} width={72} height={72} fill={C.navy3} />,
    <rect x={x + 10} y={y + 10} width={72} height={72} fill="#00000000" strokeColor={C.gold} strokeWidth={3} />,
    ...cardIcon(x + 17, y + 24),
    Tx(x + 96, y + 14, 210, 14, C.mint, '■ АКТИВНО'), Tx(x + 96, y + 36, 210, 22, C.white, 'VOCAB'),
    value ? Tx(x + 190, y + 64, 120, 12, C.gold, value, 'right') : null, ...d,
  ]
}
// top-right panel: words learnt, how much he remembers, words said out loud (always 0)
export function Stats5({ at = 0, dur, words, mem, aloud = '0', flash = [] }) {
  const x = 404, y = 128, w = 236, h = 92
  const row = (i, label, v, col) => [Tx(x + 14, y + 10 + i * 27, 120, 13, C.grey3, label), Tx(x + 100, y + 6 + i * 27, 122, 20, col, v, 'right')]
  const mc = parseInt(mem) < 50 ? C.red : parseInt(mem) < 80 ? C.gold : C.mintL
  return (
    <Layer at={at} dur={dur}>
      {box(x, y, w, h, C.mint, C.navy1)}
      {row(0, 'СЛОВ', words, C.yellow)}{row(1, 'ПОМНИТ', mem, mc)}{row(2, 'ВСЛУХ', aloud, aloud === '0' ? C.red : C.mintL)}
      {flash.map(([i, ft]) => (
        <Layer at={ft} dur={0.5} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.9 }, { at: 0.5, value: 0 }] }]}>
          <rect x={x} y={y + 4 + i * 27} width={w} height={26} fill={C.white} />
        </Layer>
      ))}
    </Layer>
  )
}
// karaoke caption, exactly centred: a 540-px row (x 90-630) at y 872
export function Caption5({ at, dur, words }) {
  return (
    <Layer at={at} dur={dur}>
      <row x={90} y={872} width={540} gap={16} rowGap={12} wrap={true} justify="center">
        {words.map(([w, t, hi]) => (
          <text fontFamily={FONT} fontWeight={400} fontSize={28} color={hi ? C.yellow : C.white} lineHeight={1.3}
            shadow={{ x: 4, y: 4, blur: 0, color: C.ink }} strokeColor={C.ink} strokeWidth={6}
            animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.45, easing: 'hold' }, { at: Math.max(0.01, t), value: 1 }] }]}>{w}</text>
        ))}
      </row>
    </Layer>
  )
}
// the cold-open title: visible on frame 0 (no pop-in), two-tone like BigTitle
export function HookTitle({ y, text, size = 56, color = C.yellow, under = C.red }) {
  return [
    <text x={0} y={y + size / 7} width={W} fontFamily={FONT} fontWeight={400} fontSize={size} color={under} align="center" strokeColor={C.ink} strokeWidth={size / 5}>{text}</text>,
    <text x={0} y={y} width={W} fontFamily={FONT} fontWeight={400} fontSize={size} color={color} align="center" strokeColor={C.ink} strokeWidth={size / 7}>{text}</text>,
  ]
}
// a big flashcard: English word + Russian translation
export function Flash({ at, dur, en, ru, y = 300, col = '#fff3b0' }) {
  const x = 60, w = 380, h = 190
  return (
    <Layer at={at} dur={dur} centre animate={popScale(0.18)}>
      <rect x={x + 8} y={y + 8} width={w} height={h} fill="#05060f" opacity={0.45} />
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill={C.ink} />
      <rect x={x} y={y} width={w} height={h} fill={col} />
      <rect x={x} y={y + 40} width={w} height={3} fill="#e8a0a0" />
      {Tx(x, y + 76, w, en.length > 11 ? 26 : 32, C.ink, en, 'center')}
      {Tx(x, y + 136, w, 16, '#6a6070', ru, 'center')}
    </Layer>
  )
}
// forgetting curve: retention bars fall; with `spaced`, reviews push it back up (mint)
const R1 = (t) => 25 + 75 * Math.exp(-t * 1.7)
const R2 = (t) => t < 1 ? R1(t) : t < 7 ? 25 + 75 * Math.exp(-(t - 1) * 0.28) : 100 - (t - 7) * 3
export function Curve({ at, dur, t0 = 0.3, span = 1.6, spaced = false, title = 'КРИВАЯ ЗАБЫВАНИЯ', titleAt = 0, label = 'ЧЕРЕЗ СУТКИ: 34%', labelAt = 1.6, marks = [] }) {
  const x0 = 96, y0 = 330, w = 528, h = 330, bx = x0 + 34, by = y0 + 272, bh = 200, N = 24
  const cols = []
  for (let k = 0; k < N; k++) {
    const t = (k / (N - 1)) * 8, r = spaced ? R2(t) : R1(t), a = t0 + (k * span) / N
    const col = spaced && t >= 1 ? C.mintL : r < 50 ? C.red : r < 75 ? C.gold : C.yellow
    cols.push(<Layer at={a} dur={Math.max(0.05, dur - a)}><rect x={bx + k * 20} y={by - (bh * r) / 100} width={16} height={(bh * r) / 100} fill={col} /></Layer>)
  }
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(x0, y0, w, h, spaced ? C.mint : C.red, C.navy1)}
      <Layer at={titleAt} dur={dur - titleAt}>{Tx(x0, y0 + 18, w, 18, C.white, title, 'center')}</Layer>
      <rect x={bx - 8} y={by - bh - 6} width={4} height={bh + 10} fill={C.grey3} /><rect x={bx - 8} y={by + 2} width={N * 20 + 8} height={4} fill={C.grey3} />
      {Tx(bx - 28, by - bh - 4, 60, 10, C.grey3, '100%')}
      {cols}
      {marks.map(([lbl, mt, k]) => <Layer at={mt} dur={Math.max(0.05, dur - mt)} centre animate={popScale(0.2)}>{Tx(bx + k * 20 - 40, by - bh - 30 + (k > 2 ? 0 : 0), 100, 11, C.mintL, lbl, 'center')}<rect x={bx + k * 20 + 6} y={by - bh - 14} width={4} height={10} fill={C.mintL} /></Layer>)}
      <Layer at={labelAt} dur={Math.max(0.05, dur - labelAt)}>{Tx(x0, by + 18, w, 14, spaced ? C.mintL : C.red, label, 'center')}</Layer>
    </Layer>
  )
}
// words as bricks: a heap -> a house (grammar = mortar, practice = the door light) -> a heap again
const BW = ['I', 'GO', 'WEEKEND', 'LAST', 'DID', 'YOU', 'WHAT', 'PLACE', 'VERY', 'BEAUTIFUL', 'ABANDON', 'ABILITY', 'VISIT', 'LIKE', 'DO', 'SAY']
const HOUSE = BW.map((_, i) => { const r = Math.floor(i / 4), c = i % 4; return [196 + c * 82 + (r % 2 ? 20 : 0), 640 - r * 34] })
const HEAP = [[150, 640], [232, 640], [314, 640], [396, 640], [478, 640], [190, 608], [272, 608], [354, 608], [436, 608], [232, 576], [314, 576], [396, 576], [272, 544], [354, 544], [314, 512], [560, 640]]
export function Bricks({ at, dur, tHouse, tHeap, move = 0.6 }) {
  const brick = (i, w) => [<rect x={0} y={0} width={78} height={30} fill={C.ink} />, <rect x={3} y={3} width={72} height={24} fill={i % 3 ? '#c8604a' : '#b04e3c'} />, <rect x={3} y={3} width={72} height={4} fill="#e08a6a" />,
    Tx(3, 11, 72, w.length > 7 ? 7 : 9, C.white, w, 'center')]
  const out = BW.map((w, i) => {
    const [hx, hy] = HEAP[i], [ox, oy] = HOUSE[i]
    const dx = ox - hx, dy = oy - hy
    return (
      <frame x={hx} y={hy} width={78} height={30} layout="none" animate={[
        { property: 'offsetX', keyframes: [{ at: 0, value: 0 }, { at: tHouse + i * 0.03, value: 0 }, { at: tHouse + move + i * 0.03, value: dx, easing: 'ease-out' }, { at: tHeap, value: dx }, { at: tHeap + 0.35, value: 0, easing: 'ease-in' }] },
        { property: 'offsetY', keyframes: [{ at: 0, value: 0 }, { at: tHouse + i * 0.03, value: 0 }, { at: tHouse + move + i * 0.03, value: dy, easing: 'ease-out' }, { at: tHeap, value: dy }, { at: tHeap + 0.35, value: 0, easing: 'ease-in' }] }]}>
        {brick(i, w)}
      </frame>
    )
  })
  const roofOn = tHouse + move + 0.5
  return (
    <Layer at={at} dur={dur}>
      <rect x={70} y={670} width={580} height={10} fill="#3f7a5a" /><rect x={70} y={680} width={580} height={22} fill="#4a3422" /><rect x={70} y={670} width={580} height={3} fill="#5fae6a" />
      {out}
      <Layer at={roofOn} dur={Math.max(0.05, tHeap - roofOn)} animate={popSlide(0.2)}>
        {[0, 1, 2, 3, 4].map((k) => <rect x={196 + k * 36} y={508 - k * 30} width={348 - k * 72} height={30} fill={k % 2 ? '#3a4a8a' : '#2e3a6a'} />)}
        <rect x={330} y={604} width={62} height={66} fill={C.yellow} /><rect x={336} y={610} width={50} height={60} fill="#fff1a8" />
        {[0, 1, 2, 3].map((r) => <rect x={196} y={638 - r * 34} width={348} height={4} fill="#d4cede" />)}
      </Layer>
    </Layer>
  )
}
// a word with a green pixel tick (he knows it)
export const tick = (x, y, col = '#3f9a5a') => [[0, 18], [8, 26], [16, 18], [24, 10], [32, 2]].map(([dx, dy]) => <rect x={x + dx} y={y + dy} width={8} height={8} fill={col} />)
export function KnownWord({ at, dur, x, y, text }) {
  const w = text.length * 20 + 76
  return (
    <Layer at={at} dur={dur} centre animate={popScale(0.2)}>
      {box(x, y, w, 50, C.mint, C.navy1)}
      {Tx(x + 14, y + 15, w, 20, C.white, text)}
      {tick(x + w - 52, y + 2, C.mintL)}
    </Layer>
  )
}
// monospace word wrap: how many lines a string takes at cpl characters per line
const wrapN = (s, cpl) => { let n = 1, cur = 0; for (const w of s.split(' ')) { if (cur === 0) cur = w.length; else if (cur + 1 + w.length <= cpl) cur += 1 + w.length; else { n++; cur = w.length } } return n }
// speech bubble with the English line and a small Russian translation under it
export function Say({ at, dur, x = 60, y, w = 600, en, ru, name, tab = C.blue2, tail = 'left', size = 22 }) {
  const lines = wrapN(en, Math.floor((w - 36) / size)), rlines = wrapN(ru, Math.floor((w - 36) / 15))
  const h = lines * size * 1.45 + rlines * 15 * 1.5 + 44
  const tx = tail === 'left' ? x + 40 : tail === 'right' ? x + w - 70 : x + w / 2 - 15
  return (
    <Layer at={at} dur={dur} centre animate={popScale(0.22)}>
      <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} fill={C.ink} />
      <rect x={x} y={y} width={w} height={h} fill={C.white} />
      {tail === 'up'
        ? [<rect x={tx - 5} y={y - 22} width={40} height={22} fill={C.ink} />, <rect x={tx} y={y - 14} width={30} height={14} fill={C.white} />]
        : [<rect x={tx - 5} y={y + h} width={40} height={22} fill={C.ink} />, <rect x={tx} y={y + h} width={30} height={14} fill={C.white} />]}
      {name ? [<rect x={x + 14} y={y - 30} width={name.length * 15 + 22} height={30} fill={tab} />, Tx(x + 25, y - 23, 400, 14, C.white, name)] : null}
      {Tx(x + 18, y + 16, w - 36, size, C.ink, en, 'left', 1.45)}
      {Tx(x + 18, y + 26 + lines * size * 1.45, w - 36, 15, '#6a6070', ru, 'left', 1.5)}
    </Layer>
  )
}
// final score sheet with explicit times for every row
export function Scores5({ at, dur, rows, times }) {
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(70, 280, 580, 400, C.gold, C.navy1)}
      {Tx(70, 300, 580, 22, C.white, 'IELTS · РЕЗУЛЬТАТ', 'center')}
      {rows.map(([name, from, to, col], i) => {
        const y = 360 + i * 76, ta = Math.min(times[i], dur - 0.1)
        return (
          <Layer at={ta} dur={dur - ta}>
            {Tx(100, y + 8, 220, 18, C.white, name)}
            <rect x={330} y={y} width={220} height={36} fill="#26264f" />
            <rect x={330} y={y} width={220 * (to / 9)} height={36} fill={col} origin="top-left" animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: from / to }, { at: 0.5, value: 1, easing: 'ease-out' }] }]} />
            {Tx(560, y + 6, 80, 22, col, to.toFixed(1), 'right')}
          </Layer>
        )
      })}
    </Layer>
  )
}

// a counter on its own dark panel, on the left column (x 70, same edge as the chips): label on top, the number counts up/down
export function Counter({ at, dur, values, t1 = 1.0, y, label, color = C.mint, fg = C.mintL, w = 300 }) {
  const x = 70
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(x, y, w, 100, color, C.navy1)}
      {Tx(x + 18, y + 14, w - 36, 14, C.grey3, label)}
      <Steps at={0.15} dur={Math.max(0.1, dur - 0.15)} t1={Math.max(0.3, Math.min(t1, dur - 0.1))} values={values} x={x + 18} w={w - 36} y={y + 42} size={44} color={fg} align="left" />
    </Layer>
  )
}

// ---- words are bricks, speech is a house: the whole build lives in plate coordinates (Scene world) on the 'lot' plate ----
// art px * 5 = screen px. Ground at art 158. House wall art x 18..92, rows 6 (7 art pitch), roof 8 steps, door, two windows, chimney.
const Q = 5
const BW5 = ['WEEKEND', 'GO', 'I', 'LAST', 'YOU', 'DID', 'WHAT', 'PLACE', 'VERY', 'NICE', 'ABANDON', 'ABILITY', 'VISIT', 'LIKE', 'SAY']
const HOUSE5 = (() => {
  const o = []
  for (let r = 0; r < 6; r++) {
    const y = 152 - 7 * r
    const row = r % 2 === 0 ? [[18, 14], [33, 14], [48, 14], [63, 14], [78, 14]] : [[18, 7], [26, 14], [41, 14], [56, 14], [71, 14], [86, 6]]
    row.forEach(([x, w]) => o.push([x, y, w]))
  }
  return o
})()
const heapSlots = (n) => {
  const lens = n === 15 ? [5, 4, 3, 2, 1] : [8, 7, 6, 5, 4, 3], o = []
  let i = 0
  lens.forEach((len, j) => {
    const x0 = 55 - (len * 10 + 4) / 2
    for (let k = 0; k < len && i < n; k++, i++) o.push([x0 + k * 10 + (((i * 37) % 5) - 2), 152 - j * 5 + (((i * 13) % 3) - 1)])
  })
  return o
}
const HEAP_A = heapSlots(15), HEAP_B = heapSlots(33)
const brickEls = (w, i, word) => [
  <rect x={0} y={0} width={w * Q} height={6 * Q} fill="#5a2418" />,
  <rect x={Q * 0.6} y={Q * 0.6} width={w * Q - Q * 1.2} height={6 * Q - Q * 1.2} fill={i % 3 === 0 ? '#b04e3c' : i % 3 === 1 ? '#c25a44' : '#a8463a'} />,
  <rect x={Q * 0.6} y={Q * 0.6} width={w * Q - Q * 1.2} height={Q} fill="#e08a6a" />,
  <rect x={Q * 0.6} y={6 * Q - Q * 1.6} width={w * Q - Q * 1.2} height={Q} fill="#7a3426" />,
  word ? Tx(0, Q * 2.1, w * Q, word.length > 6 ? 8 : 10, '#fff1e0', word, 'center') : null,
]
export function HouseWorld({ dur, tHouse, tMortarOff, tLightsOff, tCollapse }) {
  const out = []
  const fade = (a, b, k = 0.25) => [{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: Math.min(k, (b - a) / 2), value: 1 }, { at: Math.max(0.02, b - a - 0.2), value: 1 }, { at: b - a, value: 0 }] }]
  // grammar = the mortar behind the bricks
  out.push(<Layer at={tHouse + 0.15} dur={tMortarOff + 0.3 - tHouse - 0.15} animate={fade(tHouse + 0.15, tMortarOff + 0.3, 0.3)}><rect x={18 * Q} y={117 * Q} width={74 * Q} height={41 * Q} fill="#d8d2e2" /><rect x={18 * Q} y={117 * Q} width={74 * Q} height={Q} fill="#f0ecf6" /></Layer>)
  // the bricks: the 15 word-bricks fly from the heap into the wall, the rest drop in; at the end every brick falls into a bigger heap
  HOUSE5.forEach(([x, y, w], i) => {
    const [bx, by] = HEAP_B[i], dB = [(bx - x) * Q, (by - y) * Q], cAt = tCollapse + (32 - i) * 0.012
    if (i < 15) {
      const [ax, ay] = HEAP_A[i], dA = [(ax - x) * Q, (ay - y) * Q], f0 = tHouse + i * 0.02, f1 = f0 + 0.3
      const kf = (d0, d1) => [{ at: 0, value: d0 }, { at: f0, value: d0 }, { at: f1, value: 0, easing: 'ease-out' }, { at: cAt, value: 0 }, { at: cAt + 0.42, value: d1, easing: 'ease-in' }]
      out.push(<frame x={x * Q} y={y * Q} width={w * Q} height={6 * Q} layout="none" animate={[{ property: 'offsetX', keyframes: kf(dA[0], dB[0]) }, { property: 'offsetY', keyframes: kf(dA[1], dB[1]) }]}>{brickEls(w, i, BW5[i])}</frame>)
    } else {
      const a = tHouse + 0.25 + (i - 15) * 0.015, c = cAt - a
      out.push(
        <Layer at={a} dur={dur - a}>
          <frame x={x * Q} y={y * Q} width={w * Q} height={6 * Q} layout="none" animate={[
            { property: 'offsetY', keyframes: [{ at: 0, value: -140 }, { at: 0.2, value: 0, easing: 'ease-in' }, { at: c, value: 0 }, { at: c + 0.42, value: dB[1], easing: 'ease-in' }] },
            { property: 'offsetX', keyframes: [{ at: 0, value: 0 }, { at: c, value: 0 }, { at: c + 0.42, value: dB[0], easing: 'ease-in' }] }]}>{brickEls(w, i, null)}</frame>
        </Layer>)
    }
  })
  // door + window frames, then the lights (practice) — they go out, then everything falls
  const t0 = tHouse + 0.6, gone = tCollapse + 0.15
  out.push(<Layer at={t0} dur={gone - t0} animate={fade(t0, gone, 0.12)}>
    <rect x={47 * Q} y={137 * Q} width={16 * Q} height={21 * Q} fill="#4a2e1c" /><rect x={48 * Q} y={138 * Q} width={14 * Q} height={20 * Q} fill="#7a4c2a" />
    <rect x={49 * Q} y={139 * Q} width={12 * Q} height={8 * Q} fill="#8a5a32" /><rect x={49 * Q} y={149 * Q} width={12 * Q} height={8 * Q} fill="#8a5a32" /><rect x={59 * Q} y={148 * Q} width={2 * Q} height={2 * Q} fill="#ffd23f" />
    {[23, 73].map((wx) => [<rect x={wx * Q} y={126 * Q} width={14 * Q} height={12 * Q} fill="#4a2e1c" />, <rect x={(wx + 1) * Q} y={127 * Q} width={12 * Q} height={10 * Q} fill="#2b2b5a" />, <rect x={(wx - 1) * Q} y={138 * Q} width={16 * Q} height={2 * Q} fill="#e8e0d0" />])}
  </Layer>)
  const lOn = tHouse + 0.85
  out.push(<Layer at={lOn} dur={tLightsOff - lOn} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.12, value: 1 }, { at: Math.max(0.15, tLightsOff - lOn - 0.12), value: 1 }, { at: tLightsOff - lOn, value: 0 }] }]}>
    {[23, 73].map((wx) => [<rect x={(wx + 1) * Q} y={127 * Q} width={12 * Q} height={10 * Q} fill="#ffd27a" />, <rect x={(wx + 1) * Q} y={127 * Q} width={12 * Q} height={3 * Q} fill="#fff1c0" />,
      <rect x={(wx + 6.5) * Q} y={127 * Q} width={Q} height={10 * Q} fill="#4a2e1c" />, <rect x={(wx + 1) * Q} y={131.5 * Q} width={12 * Q} height={Q} fill="#4a2e1c" />,
      <rect x={(wx - 6) * Q} y={120 * Q} width={26 * Q} height={24 * Q} fill={{ kind: 'radial', stops: [{ offset: 0, color: '#ffd27a', opacity: 0.35 }, { offset: 0.7, color: '#ffd27a', opacity: 0 }] }} />])}
  </Layer>)
  // roof steps drop in; chimney with smoke while the lights are on
  for (let k = 0; k < 8; k++) {
    const a = tHouse + 0.55 + k * 0.03
    out.push(<Layer at={a} dur={tCollapse - a + 0.32} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: -90 }, { at: 0.18, value: 0, easing: 'ease-in' }, { at: tCollapse - a, value: 0 }, { at: tCollapse - a + 0.3, value: 260, easing: 'ease-in' }] }]}>
      <rect x={(13 + 5 * k) * Q} y={(113 - 4 * k) * Q} width={(84 - 10 * k) * Q} height={4 * Q} fill={k % 2 ? '#8a2f2a' : '#a8413a'} />
      <rect x={(13 + 5 * k) * Q} y={(113 - 4 * k) * Q} width={(84 - 10 * k) * Q} height={Q} fill={k % 2 ? '#a8413a' : '#c8564a'} />
    </Layer>)
  }
  const ch = tHouse + 0.75
  out.push(<Layer at={ch} dur={gone - ch} animate={fade(ch, gone, 0.1)}><rect x={75 * Q} y={95 * Q} width={8 * Q} height={15 * Q} fill="#5a2418" /><rect x={76 * Q} y={96 * Q} width={6 * Q} height={14 * Q} fill="#b04e3c" /><rect x={74 * Q} y={94 * Q} width={10 * Q} height={2 * Q} fill="#7a3426" /></Layer>)
  for (let k = 0; k < 6; k++) {
    const a = tHouse + 0.95 + k * 0.28, d = 1.1
    if (a + 0.2 > tLightsOff) break
    const dd = Math.min(d, tLightsOff - a)
    out.push(<Layer at={a} dur={dd} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 0 }, { at: dd, value: -70 * dd }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.15, value: 0.85 }, { at: dd, value: 0 }] }]}>
      <rect x={(77 + (k % 2) * 2) * Q} y={89 * Q} width={4 * Q} height={4 * Q} fill="#e8e4f0" />
    </Layer>)
  }
  // dust when it all comes down
  const dd0 = Math.max(0.3, Math.min(0.9, dur - tCollapse - 0.3))
  out.push(<Layer at={tCollapse + 0.3} dur={dd0} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: dd0 * 0.2, value: 0.7 }, { at: dd0, value: 0 }] }]}>
    {[[14, 150], [30, 146], [70, 148], [88, 150], [50, 140]].map(([x, y]) => <rect x={x * Q} y={y * Q} width={12 * Q} height={6 * Q} fill="#c8b8a0" />)}
  </Layer>)
  return out
}
