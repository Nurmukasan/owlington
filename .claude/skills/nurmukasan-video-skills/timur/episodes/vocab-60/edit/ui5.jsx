// UI for universe #5 (vocabulary), laid out inside the TikTok/IG safe zone:
// x 56-664, nothing above y 128, right column (x > 610) free from y 600, captions centred at y 872.
import { W, H, C, FONT, Layer, popScale, popSlide, PText } from './lib.jsx'
import { box, T as Tx } from './ui3.jsx'

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
  const x = 150, w = 420, h = 190
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
const HOUSE = BW.map((_, i) => { const r = Math.floor(i / 4), c = i % 4; return [196 + c * 82 + (r % 2 ? 20 : 0), 600 - r * 34] })
const HEAP = [[120, 616], [210, 622], [300, 612], [390, 620], [480, 616], [160, 588], [250, 594], [350, 586], [440, 592], [200, 560], [300, 556], [400, 562], [250, 528], [350, 530], [140, 640], [470, 644]]
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
      {out}
      <Layer at={roofOn} dur={Math.max(0.05, tHeap - roofOn)} animate={popSlide(0.2)}>
        {[0, 1, 2, 3, 4].map((k) => <rect x={196 + k * 36} y={460 - k * 30} width={336 - k * 72} height={30} fill={k % 2 ? '#3a4a8a' : '#2e3a6a'} />)}
        <rect x={330} y={566} width={62} height={68} fill={C.yellow} /><rect x={336} y={572} width={50} height={62} fill="#fff1a8" />
        {[0, 1, 2, 3].map((r) => <rect x={196} y={598 - r * 34} width={330} height={4} fill="#d4cede" />)}
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
// speech bubble with the English line and a small Russian translation under it
export function Say({ at, dur, x = 60, y, w = 600, en, ru, name, tab = C.blue2, tail = 'left', size = 22 }) {
  const lines = Math.ceil((en.length * size * 1.08) / (w - 36)), rlines = Math.ceil((ru.length * 15 * 1.08) / (w - 36))
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
