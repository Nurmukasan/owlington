import { W, H, C, FONT, Layer, popScale, popSlide, PText } from './lib.jsx'

export const box = (x, y, w, h, border, fill) => [
  <rect x={x + 2} y={y + 2} width={w + 12} height={h + 12} fill="#05060f" opacity={0.45} />,
  <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill={C.ink} />,
  <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill={border} />,
  <rect x={x} y={y} width={w} height={h} fill={fill} />,
]
export const T = (x, y, w, size, color, s, align = 'left', lh = 1.3) => <text x={x} y={y} width={w} fontFamily={FONT} fontWeight={400} fontSize={size} color={color} align={align} lineHeight={lh}>{s}</text>

// top-right panel: mock band, calls made, fear level
export function Stats({ mock, calls, fear, at = 0, dur, flash = [], fearCol }) {
  const x = 440, y = 40, w = 252, h = 92
  const row = (i, label, v, col) => [T(x + 14, y + 10 + i * 27, 130, 13, C.grey3, label), T(x + 110, y + 6 + i * 27, 128, 20, col, v, 'right')]
  const fc = fearCol || (parseInt(fear) > 50 ? C.red : parseInt(fear) > 20 ? C.gold : C.mintL)
  return (
    <Layer at={at} dur={dur}>
      {box(x, y, w, h, C.mint, C.navy1)}
      {row(0, 'MOCK', mock, C.yellow)}
      {row(1, 'ЗВОНКИ', calls, C.mintL)}
      {row(2, 'СТРАХ', fear, fc)}
      {flash.map(([i, ft]) => (
        <Layer at={ft} dur={0.5} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.9 }, { at: 0.5, value: 0 }] }]}>
          <rect x={x} y={y + 4 + i * 27} width={w} height={26} fill={C.white} />
        </Layer>
      ))}
    </Layer>
  )
}

// speech bubble with a tail; who: colour of the name tab
export function Bubble({ at, dur, x, y, w, text, name, color = C.white, tab = C.blue2, tail = 'left', size = 22, lines = 2, fg = C.ink }) {
  const h = lines * size * 1.45 + 30
  const tx = tail === 'left' ? x + 40 : tail === 'right' ? x + w - 70 : x + w / 2 - 15
  return (
    <Layer at={at} dur={dur} centre animate={popScale(0.22)}>
      <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} fill={C.ink} />
      <rect x={x} y={y} width={w} height={h} fill={color} />
      <rect x={tx - 5} y={y + h} width={40} height={22} fill={C.ink} />
      <rect x={tx} y={y + h} width={30} height={14} fill={color} />
      <rect x={tx + (tail === 'right' ? 18 : 0)} y={y + h + 14} width={12} height={12} fill={C.ink} />
      {name ? [<rect x={x + 14} y={y - 30} width={name.length * 15 + 22} height={30} fill={tab} />, T(x + 25, y - 23, 300, 14, C.white, name)] : null}
      {T(x + 18, y + 16, w - 36, size, fg, text, 'left', 1.45)}
    </Layer>
  )
}

// a rec waveform: bars that jump every 0.12 s (on a phone screen)
export function Wave({ at, dur, x, y, w = 300, h = 90, color = C.red, n = 16, seed = 3 }) {
  let s = seed; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const frames = []
  for (let t = 0; t < dur - 0.02; t += 0.12) {
    const bars = []
    for (let i = 0; i < n; i++) { const k = 0.15 + r() * 0.85; bars.push(<rect x={x + i * (w / n)} y={y + (h - h * k) / 2} width={w / n - 6} height={h * k} fill={color} />) }
    frames.push(<Layer at={t} dur={Math.min(0.12, dur - t)}>{bars}</Layer>)
  }
  return <Layer at={at} dur={dur}>{frames}</Layer>
}

// intonation: a flat robot line, then a question going up and a statement coming down
export function Intonation({ at, dur, tMelody = 2.0 }) {
  const x0 = 80, y0 = 330, w = 560, h = 300
  const flat = Array.from({ length: 24 }, (_, i) => <rect x={x0 + 40 + i * 20} y={y0 + 140} width={14} height={8} fill={C.grey3} />)
  const up = Array.from({ length: 9 }, (_, i) => <Layer at={tMelody + i * 0.05} dur={dur - tMelody - i * 0.05}><rect x={x0 + 40 + i * 24} y={y0 + 210 - i * 14} width={18} height={10} fill={C.yellow} /></Layer>)
  const down = Array.from({ length: 9 }, (_, i) => <Layer at={tMelody + 0.6 + i * 0.05} dur={dur - tMelody - 0.6 - i * 0.05}><rect x={x0 + 300 + i * 24} y={y0 + 98 + i * 14} width={18} height={10} fill={C.mintL} /></Layer>)
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(x0, y0, w, h, C.gold, C.navy1)}
      {T(x0 + 20, y0 + 18, 520, 18, C.white, 'ИНТОНАЦИЯ')}
      <Layer at={0} dur={tMelody}>{flat}{T(x0 + 20, y0 + 230, 520, 16, C.grey3, 'БЫЛО: РОБОТ-НАВИГАТОР', 'center')}</Layer>
      {up}{down}
      <Layer at={tMelody + 0.3} dur={dur - tMelody - 0.3}>{T(x0 + 30, y0 + 250, 240, 16, C.yellow, 'REALLY? ↑', 'center')}</Layer>
      <Layer at={tMelody + 0.9} dur={dur - tMelody - 0.9}>{T(x0 + 290, y0 + 250, 250, 16, C.mintL, 'I LOVE IT. ↓', 'center')}</Layer>
    </Layer>
  )
}

// the "th" diagram: teeth, tongue between them, air
export function MouthCard({ at, dur, y = 300 }) {
  const x = 150
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(x, y, 420, 300, C.yellow, C.navy1)}
      {T(x + 20, y + 18, 380, 20, C.white, 'TH = ЯЗЫК МЕЖДУ ЗУБОВ')}
      <rect x={x + 90} y={y + 90} width={240} height={150} fill="#7a2e2a" />
      <rect x={x + 100} y={y + 100} width={220} height={36} fill="#fff7ee" />
      <rect x={x + 100} y={y + 196} width={220} height={36} fill="#fff7ee" />
      {[0, 1, 2, 3, 4].map((i) => <rect x={x + 100 + i * 44} y={y + 100} width={4} height={36} fill="#d8cfc0" />)}
      <rect x={x + 150} y={y + 136} width={140} height={60} fill="#e8707e" animate={[{ property: 'offsetX', keyframes: [{ at: 0, value: 40 }, { at: 0.6, value: -30, easing: 'ease-out' }] }]} />
      <Layer at={0.8} dur={dur - 0.8} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.2, value: 1 }] }]}>
        {[0, 1, 2].map((i) => <rect x={x + 40 - i * 20} y={y + 150 + i * 12} width={36} height={6} fill={C.sky} />)}
      </Layer>
      {T(x + 20, y + 254, 380, 16, C.red, '«СИНК» ×')}{T(x + 220, y + 254, 180, 16, C.mintL, '→ THINK', 'right')}
    </Layer>
  )
}

// exchange timer: EN 30 | RU 30
export function Exchange({ at, dur }) {
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(110, 330, 500, 170, C.mint, C.navy1)}
      {T(110, 350, 500, 18, C.white, 'ЯЗЫКОВОЙ ОБМЕН', 'center')}
      <rect x={140} y={400} width={210} height={76} fill={C.blue2} /><rect x={370} y={400} width={210} height={76} fill={C.red} />
      {T(140, 412, 210, 22, C.white, 'EN 30', 'center')}{T(370, 412, 210, 22, C.white, 'RU 30', 'center')}
      {T(140, 446, 210, 12, C.sky, 'ДЖЕЙК УЧИТ', 'center')}{T(370, 446, 210, 12, '#ffd0d0', 'ТИМУР УЧИТ', 'center')}
    </Layer>
  )
}

// a random topic card + a one-minute countdown bar
export function Topic({ at, dur, text, n }) {
  return (
    <Layer at={at} dur={dur} centre animate={popScale(0.25)}>
      {box(90, 300, 540, 190, C.yellow, '#f4ead2')}
      {T(110, 316, 300, 14, '#7a6a50', 'ТЕМА · 1 МИНУТА')}
      {T(470, 316, 140, 14, C.red, n, 'right')}
      {T(110, 352, 500, 22, C.ink, text, 'left', 1.4)}
      <rect x={110} y={456} width={500} height={14} fill="#d8c89a" />
      <rect x={110} y={456} width={500} height={14} fill={C.red} origin="top-left" animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: 1 }, { at: Math.max(0.5, dur - 0.3), value: 0.08 }] }]} />
    </Layer>
  )
}

// phone notification with a message
export function Message({ at, dur, from, text, y = 300 }) {
  return (
    <Layer at={at} dur={dur} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: -260 }, { at: 0.35, value: 0, easing: 'ease-out' }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.1, value: 1 }] }]}>
      {box(70, y, 580, 170, C.mint, C.navy1)}
      <rect x={90} y={y + 20} width={56} height={56} fill="#3f7a5a" />{T(90, y + 36, 56, 22, '#d0702a', 'J', 'center')}
      {T(160, y + 22, 400, 18, C.mintL, from)}{T(520, y + 24, 110, 12, C.grey3, 'сейчас', 'right')}
      {T(160, y + 60, 470, 20, C.white, text, 'left', 1.45)}
    </Layer>
  )
}

// screen glitch between universes: coloured bars that flash
export function Glitch({ at, dur = 0.5 }) {
  const bars = [[120, 40, C.red], [300, 18, '#5d99ea'], [520, 60, C.mintL], [760, 24, C.yellow], [940, 44, '#ff4af0'], [1120, 20, C.white]]
  return (
    <Layer at={at} dur={dur} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 1 }, { at: dur * 0.5, value: 0.6 }, { at: dur, value: 0 }] }]}>
      {bars.map(([y, h, c], i) => <rect x={0} y={y} width={W} height={h} fill={c} animate={[{ property: 'offsetX', keyframes: [{ at: 0, value: (i % 2 ? -1 : 1) * 120 }, { at: dur, value: (i % 2 ? 1 : -1) * 120 }] }]} />)}
    </Layer>
  )
}

// final score sheet: four bars filling
export function Scores({ at, dur, rows, t0 = 0.3, step = 0.9 }) {
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(70, 280, 580, 420, C.gold, C.navy1)}
      {T(70, 300, 580, 22, C.white, 'IELTS · РЕЗУЛЬТАТ', 'center')}
      {rows.map(([name, from, to, col], i) => {
        const y = 360 + i * 76, ta = t0 + i * step
        return (
          <Layer at={ta} dur={dur - ta}>
            {T(100, y + 8, 220, 18, C.white, name)}
            <rect x={330} y={y} width={220} height={36} fill="#26264f" />
            <rect x={330} y={y} width={220 * (to / 9)} height={36} fill={col} origin="top-left" animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: from / to }, { at: 0.5, value: 1, easing: 'ease-out' }] }]} />
            {T(560, y + 6, 80, 22, col, to.toFixed(1), 'right')}
          </Layer>
        )
      })}
    </Layer>
  )
}
