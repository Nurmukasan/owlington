import { W, H, C, P, FONT, boxes, sprite, Layer, popScale, popSlide, PText } from './lib.jsx'

const BOOK = ['.oooo..oooo.', 'owwwwoowwwwo', 'owaawoowaawo', 'owwwwoowwwwo', 'owaawoowaawo', 'owwwwoowwwwo', 'oooooooooooo']
const BOOK_PAL = { o: '#2a1b12', w: '#fff7e6', a: '#ffb627' }
const ICONS = {
  book: (x, y, p) => sprite(BOOK, BOOK_PAL, x, y, p),
  eye: (x, y, p) => boxes([[1, 2, 10, 4, '#f4f0e8'], [0, 3, 1, 2, '#f4f0e8'], [11, 3, 1, 2, '#f4f0e8'], [4, 2, 4, 4, '#2e51a6'], [5, 3, 2, 2, C.ink], [5, 3, 1, 1, '#fff']], x, y, p),
  mic: (x, y, p) => boxes([[4, 0, 4, 6, '#d4cede'], [5, 1, 2, 4, '#a9a8bb'], [2, 4, 1, 3, '#d4cede'], [9, 4, 1, 3, '#d4cede'], [3, 7, 6, 1, '#d4cede'], [5, 8, 2, 2, '#d4cede'], [3, 10, 6, 1, '#d4cede']], x, y, p),
  pen: (x, y, p) => boxes([[8, 0, 3, 3, '#ffd23f'], [6, 2, 3, 3, '#ffd23f'], [4, 4, 3, 3, '#ffd23f'], [2, 6, 3, 3, '#f2a541'], [1, 9, 2, 2, '#2a1b12']], x, y, p),
  phones: (x, y, p) => boxes([[2, 0, 8, 2, '#d4cede'], [1, 1, 2, 4, '#d4cede'], [9, 1, 2, 4, '#d4cede'], [0, 5, 3, 5, '#7bc188'], [9, 5, 3, 5, '#7bc188'], [1, 6, 1, 3, '#b8f0c0'], [10, 6, 1, 3, '#b8f0c0']], x, y, p),
  q: (x, y, p) => <text x={x} y={y + 2} width={60} fontFamily={FONT} fontWeight={400} fontSize={40} color={C.white} align="center">?</text>,
}
const panel = (x, y, w, h, border = C.gold, fill = C.navy1) => [
  <rect x={x + 2} y={y + 2} width={w + 12} height={h + 12} fill="#05060f" opacity={0.45} />,
  <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill={C.ink} />,
  <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill={border} />,
  <rect x={x} y={y} width={w} height={h} fill={fill} />,
]

// top-left skill panel: [icon] ACTIVE / title / dots + value
export function Hud({ icon = 'book', kicker = 'АКТИВНО', title = 'READING', dots = 0, value = '', border = C.gold, accent = C.gold }) {
  const x = 28, y = 40
  const d = []
  for (let i = 0; i < 8; i++) d.push(<rect x={x + 96 + i * 24} y={y + 70} width={12} height={8} fill={i < dots ? accent : '#3a3a6e'} />)
  return [
    ...panel(x, y, 380, 92, border),
    <rect x={x + 10} y={y + 10} width={72} height={72} fill={C.navy3} />,
    <rect x={x + 10} y={y + 10} width={72} height={72} fill="#00000000" strokeColor={border} strokeWidth={3} />,
    ICONS[icon](x + 16, y + 26, icon === 'q' ? 1 : 5),
    <text x={x + 96} y={y + 14} width={270} fontFamily={FONT} fontWeight={400} fontSize={14} color={C.mint}>{'■ ' + kicker}</text>,
    <text x={x + 96} y={y + 36} width={270} fontFamily={FONT} fontWeight={400} fontSize={22} color={C.white}>{title}</text>,
    value ? <text x={x + 256} y={y + 64} width={120} fontFamily={FONT} fontWeight={400} fontSize={12} color={accent} align="right">{value}</text> : null,
    ...d,
  ]
}

// centred POWER-UP card that pops in
export function PowerUp({ at, dur, icon = 'book', title, sub, color = C.yellow, y = 250, tab = 'POWER-UP!' }) {
  const x = 70, w = 580, h = 150
  return (
    <Layer at={at} dur={dur} animate={popSlide(0.3)}>
      {panel(x, y, w, h, color)}
      <rect x={x + 18} y={y - 40} width={tab.length * 18 + 24} height={36} fill={color} />
      <text x={x + 30} y={y - 30} width={300} fontFamily={FONT} fontWeight={400} fontSize={16} color={C.ink}>{tab}</text>
      <rect x={x + 18} y={y + 18} width={114} height={114} fill={C.navy3} />
      {ICONS[icon](x + 36, y + 50, 8)}
      <text x={x + 150} y={y + 28} width={420} fontFamily={FONT} fontWeight={400} fontSize={30} color={C.white}>{title}</text>
      <text x={x + 150} y={y + 78} width={420} fontFamily={FONT} fontWeight={400} fontSize={18} color={color}>{sub}</text>
      <rect x={x + 150} y={y + 112} width={400} height={10} fill="#3a3a6e" />
      <rect x={x + 150} y={y + 112} width={400} height={10} fill={color} />
    </Layer>
  )
}

// small label chip
export function Chip({ at, dur, x, y, text, color = C.red, fg = C.white, size = 18 }) {
  const w = text.length * size + 36
  return (
    <Layer at={at} dur={dur} centre animate={popScale(0.22)}>
      <rect x={x + 2} y={y + 2} width={w + 8} height={size + 36} fill="#05060f" opacity={0.45} />
      <rect x={x - 4} y={y - 4} width={w + 8} height={size + 36} fill={C.ink} />
      <rect x={x} y={y} width={w} height={size + 28} fill={color} />
      <text x={x + 18} y={y + 14} width={w} fontFamily={FONT} fontWeight={400} fontSize={size} color={fg}>{text}</text>
    </Layer>
  )
}

// the big two-tone pixel title (yellow over red, dark outline)
export function BigTitle({ at, dur, y, text, size = 56, color = C.yellow, under = '#d8323c' }) {
  return (
    <Layer at={at} dur={dur} centre animate={popScale(0.3)}>
      <text x={0} y={y + size / 7} width={W} fontFamily={FONT} fontWeight={400} fontSize={size} color={under} align="center" strokeColor={C.ink} strokeWidth={size / 5}>{text}</text>
      <text x={0} y={y} width={W} fontFamily={FONT} fontWeight={400} fontSize={size} color={color} align="center" strokeColor={C.ink} strokeWidth={size / 7}>{text}</text>
    </Layer>
  )
}

// a number that steps through values between t0 and t1 (counters, timers)
export function Steps({ at, dur, values, t1, x, y, w = W, size = 64, color = C.white, align = 'center' }) {
  const n = values.length, out = []
  values.forEach((v, i) => {
    const a = at + (i * (t1 - at)) / Math.max(1, n - 1)
    const end = i === n - 1 ? at + dur : at + ((i + 1) * (t1 - at)) / Math.max(1, n - 1)
    out.push(<Layer at={a} dur={Math.max(0.05, end - a)}><PText x={x} y={y} w={w} size={size} color={color} align={align} text={v} /></Layer>)
  })
  return out
}

// karaoke caption: words grey until spoken, keywords yellow
export function Caption({ at, dur, words }) {
  return (
    <Layer at={at} dur={dur}>
      <row x={30} y={1085} width={660} gap={18} rowGap={14} wrap={true} justify="center">
        {words.map(([w, t, hi]) => (
          <text fontFamily={FONT} fontWeight={400} fontSize={30} color={hi ? C.yellow : C.white} lineHeight={1.3}
            shadow={{ x: 4, y: 4, blur: 0, color: C.ink }} strokeColor={C.ink} strokeWidth={6}
            animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.45, easing: 'hold' }, { at: Math.max(0.01, t), value: 1 }] }]}>{w}</text>
        ))}
      </row>
    </Layer>
  )
}
