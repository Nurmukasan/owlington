import { W, H, C, P, FONT, IMG, Layer, Scene, blinks, every, popScale, popSlide, PText } from './lib.jsx'
import { Hud, PowerUp, Chip, BigTitle, Steps } from './ui.jsx'
import { Bubble, Wave, Glitch, Scores, box, T as Tx } from './ui3.jsx'
import { T, D } from './times.jsx'

// --- helpers --------------------------------------------------------------
const talk = (k, t0, a, b, period = 0.26, on = 0.13) => { const o = []; for (let t = a; t < b - 0.05; t += period) o.push([k, t - t0, on]); return o }
const hud = (day, dots = 0) => Hud({ icon: 'phones', kicker: 'АКТИВНО', title: 'LISTENING', dots, value: day })
const rel = (at, k) => Math.max(0.05, T[k] - at)
const Sub = ({ at, dur, text }) => {
  const n = Math.ceil(text.length / 30)
  return (
    <Layer at={at} dur={dur} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.12, value: 1 }] }]}>
      <rect x={40} y={1150 - n * 26 - 16} width={640} height={n * 26 + 16} fill="#0b0c26" />
      <text x={50} y={1150 - n * 26 - 6} width={620} fontFamily={FONT} fontWeight={400} fontSize={19} color={C.grey4} align="center" lineHeight={1.35}>{text}</text>
    </Layer>
  )
}
const Stats = ({ at = 0, dur, mock, hours, und, flash = [] }) => {
  const x = 440, y = 40, w = 252, h = 92
  const row = (i, label, v, col) => [Tx(x + 14, y + 10 + i * 27, 130, 13, C.grey3, label), Tx(x + 110, y + 6 + i * 27, 128, 20, col, v, 'right')]
  return (
    <Layer at={at} dur={dur}>
      {box(x, y, w, h, C.mint, C.navy1)}
      {row(0, 'MOCK', mock, C.yellow)}{row(1, 'ЧАСОВ', hours, C.mintL)}{row(2, 'ПОНЯТНО', und, parseInt(und) < 40 ? C.red : parseInt(und) < 75 ? C.gold : C.mintL)}
      {flash.map(([i, ft]) => <Layer at={ft} dur={0.5} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.9 }, { at: 0.5, value: 0 }] }]}><rect x={x} y={y + 4 + i * 27} width={w} height={26} fill={C.white} /></Layer>)}
    </Layer>
  )
}
const st = (dur, mock, hours, und, at = 0, flash = []) => <Stats at={at} dur={dur - at} mock={mock} hours={hours} und={und} flash={flash} />
const card = (dur, at, lines, stamp, stampAt, col = '#d8323c') => (
  <Layer at={at} dur={dur - at} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 700 }, { at: 0.35, value: 0, easing: 'ease-out' }] }]}>
    <rect x={130} y={330} width={460} height={220} fill={C.ink} /><rect x={136} y={336} width={448} height={208} fill="#f4ead2" />
    <text x={160} y={356} width={400} fontFamily={FONT} fontWeight={400} fontSize={18} color={C.ink}>MOCK · LISTENING</text>
    {lines.map(([s, lt], i) => <Layer at={lt} dur={dur - at - lt}><text x={160} y={410 + i * 40} width={260} fontFamily={FONT} fontWeight={400} fontSize={15} color="#5a4a3a">{s}</text></Layer>)}
    <Layer at={stampAt} dur={dur - at - stampAt} centre animate={[{ property: 'scale', keyframes: [{ at: 0, value: 2.4 }, { at: 0.15, value: 0.95 }, { at: 0.25, value: 1 }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.05, value: 1 }] }]}>
      <rect x={416} y={382} width={160} height={116} fill="#00000000" strokeColor={col} strokeWidth={8} />
      <text x={416} y={410} width={160} fontFamily={FONT} fontWeight={400} fontSize={44} color={col} align="center">{stamp}</text>
    </Layer>
  </Layer>
)
const darken = (a = 0.5, t = 0.3, col = '#0b0c26') => <rect x={0} y={0} width={W} height={H} fill={col} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: t, value: a }] }]} />
// a media player bar: pause / rewind / speed label
const Player = ({ at, dur, title, speed, col = C.mint, y = 840 }) => (
  <Layer at={at} dur={dur} animate={popSlide()}>
    {box(60, y, 600, 130, col, C.navy1)}
    {Tx(84, y + 18, 560, 14, C.grey3, title)}
    <rect x={84} y={y + 50} width={552} height={10} fill="#3a3a6e" /><rect x={84} y={y + 50} width={220} height={10} fill={col} /><rect x={298} y={y + 44} width={12} height={22} fill={C.white} />
    <rect x={90} y={y + 80} width={10} height={32} fill={C.white} /><rect x={108} y={y + 80} width={10} height={32} fill={C.white} />
    {[0, 1].map((i) => [<rect x={150 + i * 22} y={y + 92} width={8} height={8} fill={C.white} />, <rect x={158 + i * 22} y={y + 86} width={8} height={20} fill={C.white} />])}
    {speed ? Tx(420, y + 84, 210, 26, col, speed, 'right') : null}
  </Layer>
)
// little floating music notes (sound going past him)
const notes = (at, dur, x0, y0, n = 6, col = C.sky) => Array.from({ length: n }, (_, i) => {
  const d = Math.min(1.2, dur - i * (dur / n))
  if (d < 0.3) return null
  return (
    <Layer at={at + i * (dur / n)} dur={d} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 0 }, { at: d, value: -140 * d / 1.2 }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.12, value: 1 }, { at: d * 0.8, value: 1 }, { at: d, value: 0 }] }]}>
      <rect x={x0 + (i % 3) * 70} y={y0 + 20} width={14} height={14} fill={col} /><rect x={x0 + (i % 3) * 70 + 10} y={y0 - 14} width={4} height={36} fill={col} /><rect x={x0 + (i % 3) * 70 + 14} y={y0 - 14} width={12} height={6} fill={col} />
    </Layer>
  )
})
// accent roulette: a list that highlights entries in turn and stops on `stop`
const ACC = ['UK', 'USA', 'AUSTRALIA', 'SCOTLAND', 'INDIA', 'IRELAND']
const Roulette = ({ at, dur, stop, spin = 1.2 }) => {
  const steps = 10, out = []
  const target = ACC.indexOf(stop)
  for (let k = 0; k <= steps; k++) {
    const idx = k === steps ? target : (target + k + 2) % ACC.length
    const a = (spin * k) / steps, d = k === steps ? dur - a : spin / steps
    out.push(<Layer at={a} dur={d}><rect x={130} y={330 + idx * 56} width={460} height={50} fill={k === steps ? C.yellow : C.blue2} /></Layer>)
  }
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(110, 270, 500, 420, C.gold, C.navy1)}
      {Tx(110, 290, 500, 18, C.white, 'РУЛЕТКА АКЦЕНТОВ', 'center')}
      {out}
      {ACC.map((n, i) => Tx(130, 346 + i * 56, 460, 20, C.white, n, 'center'))}
      <Layer at={spin} dur={dur - spin}>{Tx(130, 346 + target * 56, 460, 20, C.ink, stop, 'center')}</Layer>
    </Layer>
  )
}
const loading = (at, dur, x, y) => Array.from({ length: Math.floor(dur / 0.15) }, (_, k) => (
  <Layer at={at + k * 0.15} dur={0.15}>{box(x, y, 220, 60, C.grey2, C.navy1)}{Tx(x + 12, y + 20, 200, 14, C.white, 'ЗАГРУЗКА' + '.'.repeat(k % 4))}</Layer>
))


// the answer sheet's printed text and handwritten answers (rows 1..10); row k top = 380 + (k-1)*70
const ROWY = (k) => 380 + (k - 1) * 70
const tick = (x, y, col) => [<rect x={x} y={y + 18} width={8} height={8} fill={col} />, <rect x={x + 8} y={y + 26} width={8} height={8} fill={col} />, <rect x={x + 16} y={y + 18} width={8} height={8} fill={col} />, <rect x={x + 24} y={y + 10} width={8} height={8} fill={col} />, <rect x={x + 32} y={y + 2} width={8} height={8} fill={col} />]
const Sheet = ({ answers, marks = {} }) => [
  Tx(64, 216, 140, 22, '#9e1f2c', 'IELTS'), Tx(200, 214, 380, 14, C.white, 'LISTENING'), Tx(200, 236, 380, 12, '#f4c8c8', 'ANSWER SHEET'),
  Tx(70, 304, 200, 12, C.grey2, 'NAME'), Tx(150, 302, 250, 16, '#2e3a6a', 'TIMUR'), Tx(442, 304, 100, 12, C.grey2, 'No.'), Tx(500, 302, 150, 16, '#2e3a6a', '0472'),
  Tx(66, 354, 60, 12, C.grey2, '#'), Tx(140, 354, 200, 12, C.grey2, 'ANSWER'),
  ...Array.from({ length: 10 }, (_, i) => Tx(60, ROWY(i + 1) + 18, 60, 20, C.ink, String(i + 1), 'center')),
  ...answers.map((a, i) => (a ? Tx(146, ROWY(i + 1) + 16, 380, 22, '#2e3a6a', a) : null)),
  ...Object.entries(marks).map(([k, m]) => (m === 'ok' ? tick(566, ROWY(+k) + 6, '#3f9a5a') : Tx(622, ROWY(+k) + 14, 40, 26, C.red, '×', 'center'))),
]

// --- shots ---------------------------------------------------------------
export const SHOTS = []
const shot = (t, fn) => SHOTS.push([t, fn])

// 01 cold open: the three universes flash by
shot(0, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="u1" zoom={[1.15, 1.0]} swaps={[['u2', dur * 0.33, dur * 0.33], ['u3', dur * 0.66, dur * 0.34]]}>
    <Chip at={0.05} dur={dur * 0.33} x={30} y={170} text="#1 READING" color={C.navy3} size={18} />
    <Chip at={dur * 0.33} dur={dur * 0.33} x={30} y={170} text="#2 SPEAKING" color={C.navy3} size={18} />
    <Chip at={dur * 0.66} dur={dur * 0.34} x={30} y={170} text="#3 WRITING" color={C.navy3} size={18} />
    <BigTitle at={0.05} dur={dur - 0.05} y={300} text="ФИНАЛЬНАЯ" size={50} />
    <BigTitle at={0.25} dur={dur - 0.25} y={380} text="СЕРИЯ" size={50} />
    <Glitch at={dur * 0.33 - 0.12} dur={0.24} /><Glitch at={dur * 0.66 - 0.12} dur={0.24} /><Glitch at={dur - 0.3} dur={0.3} />
  </Scene>
))
// 02 universe #4: he only listens
shot(T.u4, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room" zoom={[1.0, 1.1]} swaps={blinks('room_blink', [1.6])}>
    <Glitch at={0} dur={0.4} />
    <Layer at={0.1} dur={dur - 0.1} animate={popSlide()}>{hud('ДЕНЬ 0')}</Layer>
    <Chip at={0.1} dur={dur - 0.1} x={30} y={170} text="ВСЕЛЕННАЯ #4" color={C.red} size={20} />
    {[['ЧИТАЕТ ×', 60, 260], ['ПИШЕТ ×', 260, 260], ['ГОВОРИТ ×', 440, 260]].map(([t, x, y], i) => <Chip at={rel(at, 'not') + i * 0.5} dur={dur - rel(at, 'not') - i * 0.5} x={x} y={y} text={t} color={C.grey2} size={16} />)}
    <BigTitle at={rel(at, 'listen')} dur={dur - rel(at, 'listen')} y={370} text="ТОЛЬКО СЛУШАЕТ" size={34} />
    {notes(rel(at, 'listen'), dur - rel(at, 'listen'), 200, 640)}
  </Scene>
))
// 03 day 0
shot(T.day0, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="hall" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 0')}
    <BigTitle at={0.05} dur={dur - 0.05} y={210} text="ДЕНЬ 0" size={60} />
    <Chip at={0.6} dur={dur - 0.6} x={130} y={330} text="ПРОБНЫЙ LISTENING" color={C.red} size={20} />
  </Scene>
))
// 04 the trap: "fourteen... sorry, forty"
shot(T.exam0 - 0.1, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="close" zoom={[1.05, 1.2]} swaps={[['close_scared', 1.4, dur - 1.4]]}>
    {hud('ДЕНЬ 0')}
    <Bubble at={0.1} dur={dur - 0.1} x={40} y={260} w={640} name="RECORDING · SECTION 1" tab={C.grey2} text="The tour starts at fourteen... sorry, forty minutes past ten." lines={3} />
    {loading(1.6, dur - 1.7, 250, 470)}
    <Sub at={0.1} dur={dur - 0.1} text="«Экскурсия начнётся в 14... простите, в 10:40»" />
  </Scene>
))
// 05 he writes 14; listening 5.0
shot(T.writes, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="sheet" zoom={[1.0, 1.0]}>
    {hud('ДЕНЬ 0')}
    <Layer at={0} dur={dur}>{Sheet({ answers: ['MONDAY', 'LIBRARY', '?', 'B', '...', 'C', '14', '?', '', ''] })}</Layer>
    <Layer at={0.6} dur={dur - 0.6} centre animate={popScale(0.2)}>
      <rect x={140} y={ROWY(7) + 26} width={76} height={6} fill={C.red} />{Tx(250, ROWY(7) + 16, 260, 22, C.red, '→ 40!')}{Tx(622, ROWY(7) + 14, 40, 26, C.red, '×', 'center')}
    </Layer>
    {st(dur, '5.0', '0', '30%', rel(at, 'l5'))}
    {card(dur, rel(at, 'l5') - 0.1, [['RAW: 16/40', 0.2], ['ЛОВУШКИ: 0/5', 0.4]], '5.0', 0.25)}
  </Scene>
))
// 06 the rule
shot(T.rule, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_open" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 1')}
    {st(dur, '5.0', '0', '30%')}
    <PowerUp at={0.1} dur={dur - 0.1} icon="phones" title="ПРАВИЛО" sub="2 ЧАСА ENGLISH В ДЕНЬ" y={240} tab="НА СЛУХ" />
  </Scene>
))
// 07 two weeks in the background, while gaming and scrolling
shot(T.bg, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="bed" zoom={[1.0, 1.1]} swaps={every('bed_b', dur, 1.3, 0.15, 0.8)}>
    {hud('НЕДЕЛЯ 1', 1)}
    {st(rel(at, 'mock5'), '5.0', '0→20', '30%')}
    {st(dur, '5.0', '20', '32%', rel(at, 'mock5'), [[0, 0]])}
    <Chip at={0.2} dur={dur - 0.2} x={40} y={300} text="ФОНОМ" color={C.grey2} size={22} />
    <Chip at={1.2} dur={dur - 1.2} x={40} y={380} text="МОЗГ: В ИГРЕ" color={C.red} size={18} />
    {notes(0.2, dur - 0.2, 420, 560, 8, '#8f93d6')}
    <Steps at={rel(at, 'h20') - 0.6} dur={dur - rel(at, 'h20') + 0.6} t1={rel(at, 'h20') + 0.3} values={['1 ЧАС', '8 ЧАСОВ', '14 ЧАСОВ', '20 ЧАСОВ']} x={0} y={520} size={36} color={C.white} />
    <Chip at={rel(at, 'mock5')} dur={dur - rel(at, 'mock5')} x={150} y={580} text="MOCK: СНОВА 5.0" color={C.red} size={22} />
  </Scene>
))
// 08 twist: background listening doesn't count
shot(T.twist, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="bed_sad" zoom={[1.2, 1.3]} panY={[-40, -60]}>
    <Glitch at={0} dur={0.3} />
    {darken(0.45, 0.3)}
    <BigTitle at={0.05} dur={dur - 0.05} y={260} text="ПОВОРОТ!" size={56} />
    <BigTitle at={0.9} dur={dur - 0.9} y={360} text="ФОНОМ НЕ СЧИТАЕТСЯ" size={26} color={C.white} under={C.red} />
  </Scene>
))
// 09 dictation: pause, rewind, every word on paper
shot(T.dict, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="dict" zoom={[1.0, 1.08]} swaps={every('dict_b', dur, 1.4, 0.15, 1.0)}>
    {hud('ДЕНЬ 15', 2)}
    {st(dur, '5.0', '24', '40%')}
    <PowerUp at={0.05} dur={dur - 0.05} icon="pen" title="ДИКТАНТ" sub="1 МИН АУДИО = 10 МИН" y={230} tab="НОВОЕ ПРАВИЛО" />
    <Player at={rel(at, 'pausew')} dur={dur - rel(at, 'pausew')} title="PODCAST · EP. 12" y={430} />
  </Scene>
))
// 10 the owl helps the old way: a pencil in a cassette
shot(T.owl, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="dict_owl" zoom={[1.5, 1.6]} pan={[-150, -170]} panY={[-300, -320]}>
    <Chip at={0.3} dur={dur - 0.3} x={150} y={250} text="ПО-СТАРИНКЕ" color={C.gold} fg={C.ink} size={22} />
    <Chip at={0.9} dur={dur - 0.9} x={250} y={330} text="(90-Е)" color={C.navy3} size={16} />
  </Scene>
))
// 11 week 3: playback speed 1.25x, 1.5x
shot(T.week3, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="speed1" zoom={[1.0, 1.12]} swaps={[['speed2', rel(at, 'speed') + 1.2, dur]]}>
    {hud('НЕДЕЛЯ 3', 3)}
    {st(dur, '6.0', '42', '60%')}
    <BigTitle at={0.05} dur={dur - 0.05} y={190} text="НЕДЕЛЯ 3" size={44} />
    <Player at={0.4} dur={dur - 0.4} title="PODCAST · EP. 30" y={300} col={C.red} />
    <Steps at={0.4} dur={dur - 0.4} t1={Math.min(dur - 0.3, rel(at, 'speed') + 1.4)} values={['1.0×', '1.25×', '1.5×']} x={420} y={384} w={210} size={26} color={C.yellow} align="right" />
  </Scene>
))
// 12 back to 1x: everybody talks in slow motion
shot(T.back, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="slow" zoom={[1.08, 1.12]}>
    {hud('НЕДЕЛЯ 3', 3)}
    <Player at={0} dur={dur} title="PODCAST · EP. 31" y={300} speed="1.0×" />
    <Bubble at={1.0} dur={dur - 1.0} x={60} y={480} w={600} text="Heeelloooo... hooow... aaare... yooou..." lines={2} size={20} />
    <Chip at={2.0} dur={dur - 2.0} x={140} y={640} text="SLOW MOTION" color={C.mint} fg={C.ink} size={22} />
  </Scene>
))
// 13 week 4: accent roulette → Australia
shot(T.week4, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_open" zoom={[1.0, 1.06]}>
    {hud('НЕДЕЛЯ 4', 4)}
    {st(dur, '6.5', '56', '70%')}
    <BigTitle at={0.05} dur={dur - 0.05} y={170} text="НЕДЕЛЯ 4" size={40} />
    <Roulette at={0.5} dur={dur - 0.5} stop="AUSTRALIA" spin={Math.max(0.6, rel(at, 'aus') - 0.8)} />
  </Scene>
))
shot(T.aus - 0.1, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_up" zoom={[1.15, 1.25]} panY={[-60, -80]}>
    {hud('НЕДЕЛЯ 4', 4)}
    <Bubble at={0.1} dur={dur - 0.1} x={40} y={260} w={640} name="AUSTRALIA" tab="#e0a030" text="G'day mate! How ya goin'? Fair dinkum!" lines={2} />
    <Sub at={0.1} dur={dur - 0.1} text="«Здорово, приятель! Как жизнь? Честно!»" />
  </Scene>
))
shot(T.terp, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_smile" zoom={[1.0, 1.06]}>
    {hud('НЕДЕЛЯ 4', 4)}
    <Chip at={0.05} dur={0.9} x={240} y={200} text="ТЕРПИМО" color={C.mint} fg={C.ink} size={22} />
    <Roulette at={0.6} dur={dur - 0.6} stop="SCOTLAND" spin={Math.max(0.5, dur - 1.0)} />
  </Scene>
))
shot(T.scot - 0.1, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_wide" zoom={[1.15, 1.3]} panY={[-60, -100]} swaps={every('room_wide2', dur, 0.5, 0.25, 0.3)}>
    {hud('НЕДЕЛЯ 4', 4)}
    <Bubble at={0.1} dur={dur - 0.1} x={40} y={260} w={640} name="SCOTLAND" tab="#2e51a6" text="It's a braw, bricht, moonlicht nicht the nicht!" lines={2} />
    {loading(0.8, dur - 0.9, 250, 470)}
    <Sub at={0.1} dur={dur - 0.1} text="«Сегодня славная, светлая, лунная ночь!»" />
  </Scene>
))
shot(T.nocom, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_wide2" zoom={[1.35, 1.45]} panY={[-130, -150]}>
    <Chip at={0.05} dur={dur - 0.05} x={110} y={240} text="БЕЗ КОММЕНТАРИЕВ" color={C.red} size={22} />
    {st(dur, '6.5', '58', '0%', 0.2, [[2, 0]])}
  </Scene>
))
// 14 day 40: locked in — bus, street, kitchen
shot(T.day40, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_happy" zoom={[1.0, 1.08]}>
    {hud('ДЕНЬ 40', 5)}
    {st(dur, '7.0', '80', '80%')}
    <BigTitle at={0.05} dur={dur - 0.05} y={190} text="ДЕНЬ 40" size={52} />
    <Layer at={rel(at, 'locked')} dur={dur - rel(at, 'locked')} centre animate={popScale(0.3)}>{box(130, 320, 460, 110, C.yellow, C.navy1)}{Tx(130, 340, 460, 16, C.grey3, 'РЕЖИМ', 'center')}{Tx(130, 372, 460, 34, C.yellow, 'LOCKED IN', 'center')}</Layer>
  </Scene>
))
shot(T.busw, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="bus" zoom={[1.05, 1.12]} swaps={every('bus_b', dur, 0.3, 0.15, 0.1)}>
    {hud('ДЕНЬ 41', 5)}<Chip at={0.05} dur={dur - 0.05} x={220} y={300} text="АВТОБУС" color={C.blue2} size={22} />
  </Scene>
))
shot(T.streetw, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="street" zoom={[1.05, 1.12]} swaps={every('street_b', dur, 0.6, 0.3, 0.3)}>
    {hud('ДЕНЬ 43', 5)}<Chip at={0.05} dur={dur - 0.05} x={250} y={300} text="УЛИЦА" color={C.mint} fg={C.ink} size={22} />
  </Scene>
))
shot(T.kitchenw, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="kitchen" zoom={[1.0, 1.08]} swaps={T.mom < at + dur ? talk('kitchen_shout', at, T.mom, T.mom_end, 0.24, 0.12).concat(talk('kitchen_shout2', at, T.mom + 0.12, T.mom_end, 0.24, 0.12)) : []}>
    {hud('ДЕНЬ 45', 5)}<Chip at={0.05} dur={rel(at, 'mom')} x={250} y={300} text="КУХНЯ" color={C.gold} fg={C.ink} size={22} />
    <Bubble at={rel(at, 'mom')} dur={dur - rel(at, 'mom')} x={250} y={420} w={430} name="МАМА" tab="#c8504a" tail="right" text="ТИМУР! УЖИНАТЬ! ТИМУ-У-УР!!" lines={2} />
  </Scene>
))
shot(T.nohear, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="kitchen_shout2" zoom={[1.15, 1.25]} panY={[-60, -80]} swaps={every('kitchen', dur, 0.4, 0.2, 0.1)}>
    <Chip at={0.05} dur={dur - 0.05} x={190} y={240} text="НЕ СЛЫШИТ" color={C.red} size={24} />
    <Chip at={0.5} dur={dur - 0.5} x={150} y={320} text="ШУМОДАВ: 100%" color={C.navy3} size={18} />
  </Scene>
))
// 15 day 50: a new podcast... a familiar voice
const Cover = ({ at, dur }) => (
  <Layer at={at} dur={dur} animate={popSlide()}>
    {box(110, 280, 500, 220, '#d0702a', C.navy1)}
    <rect x={130} y={300} width={180} height={180} fill="#d0702a" /><rect x={160} y={330} width={120} height={50} fill="#f6d6be" /><rect x={150} y={316} width={140} height={24} fill="#a85a20" /><rect x={160} y={390} width={120} height={80} fill="#3f7a5a" />
    <rect x={185} y={350} width={12} height={12} fill={C.ink} /><rect x={243} y={350} width={12} height={12} fill={C.ink} />
    {Tx(330, 310, 270, 15, C.white, 'MANCHESTER', 'left', 1.4)}{Tx(330, 336, 270, 15, C.white, 'MORNINGS', 'left', 1.4)}{Tx(330, 380, 270, 12, C.grey3, 'PODCAST · EP. 1', 'left', 1.4)}{Tx(330, 430, 270, 12, '#d0702a', '● HOST: J.', 'left', 1.4)}
  </Layer>
)
shot(T.day50, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_open" zoom={[1.0, 1.08]} swaps={[['room_up', rel(at, 'voice'), dur]]}>
    {hud('ДЕНЬ 50', 6)}
    {st(dur, '7.5', '100', '90%')}
    <BigTitle at={0.05} dur={dur - 0.05} y={190} text="ДЕНЬ 50" size={52} />
    <Cover at={rel(at, 'podcast')} dur={dur - rel(at, 'podcast')} />
  </Scene>
))
shot(T.jake - 0.1, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="room_up" zoom={[1.1, 1.18]} panY={[-40, -60]}>
    {hud('ДЕНЬ 50', 6)}
    <Bubble at={0.1} dur={dur - 0.1} x={40} y={300} w={640} name="PODCAST HOST · MANCHESTER" tab="#3f7a5a" text="Alright mate! Welcome back to the pod, innit!" lines={2} />
    <Chip at={0.8} dur={dur - 0.8} x={150} y={520} text="ГДЕ-ТО СЛЫШАЛИ..." color={C.navy3} size={18} />
    <Sub at={0.1} dur={dur - 0.1} text="«Здорово, бро! С возвращением на подкаст, ага!»" />
  </Scene>
))
// 16 day 60: the exam, the same trap
shot(T.day60, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="hall" zoom={[1.0, 1.08]}>
    {hud('ДЕНЬ 60', 8)}
    {st(dur, '7.5', '120', '95%')}
    <BigTitle at={0.05} dur={dur - 0.05} y={200} text="ДЕНЬ 60" size={56} />
    <Chip at={rel(at, 'exam')} dur={dur - rel(at, 'exam')} x={210} y={320} text="ЭКЗАМЕН" color={C.red} size={24} />
    <Chip at={rel(at, 'trap')} dur={dur - rel(at, 'trap')} x={150} y={400} text="ТА ЖЕ ЛОВУШКА" color={C.yellow} fg={C.ink} size={22} />
  </Scene>
))
shot(T.exam60 - 0.1, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="close_calm" zoom={[1.05, 1.2]}>
    {hud('ДЕНЬ 60', 8)}
    <Bubble at={0.1} dur={dur - 0.1} x={40} y={260} w={640} name="RECORDING · SECTION 1" tab={C.grey2} text="The bus leaves at fourteen... sorry, forty minutes past nine." lines={3} />
    <Sub at={0.1} dur={dur - 0.1} text="«Автобус уходит в 14... простите, в 9:40»" />
  </Scene>
))
shot(T.forty, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="sheet" zoom={[1.0, 1.0]}>
    <Layer at={0} dur={dur}>{Sheet({ answers: ['MONDAY', 'LIBRARY', 'SUNDAY', 'B', 'MAP', 'C', '40', 'PARKING', 'A', 'TICKETS'], marks: { 1: 'ok', 2: 'ok', 3: 'ok', 4: 'ok', 5: 'ok', 6: 'ok', 8: 'ok', 9: 'ok', 10: 'ok' } })}</Layer>
    <Layer at={0.15} dur={dur - 0.15} centre animate={popScale(0.25)}><rect x={134} y={ROWY(7) + 4} width={92} height={50} fill="#00000000" strokeColor="#3f9a5a" strokeWidth={6} />{tick(566, ROWY(7) + 6, '#3f9a5a')}</Layer>
  </Scene>
))
shot(T.noblink, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="close_smirk" zoom={[1.2, 1.35]} panY={[-80, -110]}>
    <Chip at={0.2} dur={dur - 0.2} x={130} y={240} text="ДАЖЕ НЕ МОРГНУЛ" color={C.mint} fg={C.ink} size={22} />
  </Scene>
))
// 17 results
shot(T.result, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="sky" zoom={[1.0, 1.05]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={170} text="РЕЗУЛЬТАТ" size={44} />
    <Scores at={0.2} dur={dur - 0.2} rows={[['LISTENING', 5.0, 9.0, C.blue3], ['SPEAKING', 5.5, 8.0, '#f08a9a'], ['READING', 5.5, 6.5, C.yellow], ['WRITING', 5.5, 6.0, C.mint]]} t0={0.6} step={(rel(at, 'overall') - 1.2) / 3} />
    <Layer at={rel(at, 'overall')} dur={dur - rel(at, 'overall')} centre animate={popScale(0.35)}>{box(170, 740, 380, 110, C.yellow, C.navy1)}{Tx(190, 772, 200, 22, C.white, 'ОБЩИЙ')}{Tx(360, 758, 170, 52, C.yellow, '7.5', 'right')}</Layer>
    <Chip at={rel(at, 'live')} dur={rel(at, 'overall') - rel(at, 'live')} x={60} y={740} text="ЖИВАЯ РЕЧЬ → SPEAKING ↑" color="#f08a9a" fg={C.ink} size={18} />
    <Chip at={rel(at, 'pods')} dur={dur - rel(at, 'pods')} x={110} y={890} text="100+ ПОДКАСТОВ" color={C.mint} fg={C.ink} size={22} />
    <Chip at={rel(at, 'pods') + 1.6} dur={dur - rel(at, 'pods') - 1.6} x={60} y={970} text="БОЛЬШЕ, ЧЕМ УЧЕБНИК" color={C.gold} fg={C.ink} size={20} />
  </Scene>
))
// 18 the multiverse: four Timurs; what they all had in common
const Q = [['u1', 0, 0, '#1 READING', '7.0'], ['u2', 360, 0, '#2 SPEAKING', '7.0'], ['u3', 0, 640, '#3 WRITING', '6.5'], ['room_open', 360, 640, '#4 LISTENING', '7.5']]
const quad = (dur, k, i, x, y, label, score, show) => (
  <Layer at={show} dur={dur - show}>
    <media file={IMG[k]} x={x} y={y} width={360} height={640} fit="fill" />
    <rect x={x} y={y} width={360} height={4} fill={C.ink} /><rect x={x} y={y} width={4} height={640} fill={C.ink} />
    {box(x + 16, y + 16, 200, 56, C.gold, C.navy1)}{Tx(x + 24, y + 28, 190, 12, C.white, label)}{Tx(x + 24, y + 48, 190, 14, C.yellow, score)}
  </Layer>
)
const Multi = ({ at, dur, shows, ringT = 1e9, ringO = 1e9 }) => [
  ...Q.map(([k, x, y, l, s], i) => quad(dur, k, i, x, y, l, s, Math.min(shows[i], dur - 0.05))),
  ...(ringT >= dur ? [] : Q.map(([k, x, y]) => <Layer at={Math.min(ringT, dur - 0.05)} dur={Math.max(0.05, Math.min(1.0, dur - ringT))}><rect x={x + 120} y={y + 330} width={120} height={150} fill="#00000000" strokeColor={C.yellow} strokeWidth={6} /></Layer>)),
  ...(ringO >= dur ? [] : Q.map(([k, x, y]) => <Layer at={Math.min(ringO, dur - 0.05)} dur={Math.max(0.05, dur - ringO)} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.1, value: 1 }, { at: 0.35, value: 0.4 }, { at: 0.6, value: 1 }] }]}><rect x={x + 222} y={y + 170} width={76} height={90} fill="#00000000" strokeColor={C.yellow} strokeWidth={6} /></Layer>)),
]
shot(T.four, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="sky" zoom={[1.0, 1.0]}>
    {Multi({ at, dur, shows: [0.05, rel(at, 'four2'), rel(at, 'four3'), rel(at, 'four3') + 0.5] })}
    <BigTitle at={0.05} dur={dur - 0.05} y={568} text="4 ВСЕЛЕННЫЕ" size={36} />
  </Scene>
))
shot(T.const, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="sky" zoom={[1.0, 1.0]}>
    {Multi({ at, dur, shows: [0, 0, 0, 0], ringT: rel(at, 'always1'), ringO: rel(at, 'owlc') })}
    <Layer at={rel(at, 'always1')} dur={rel(at, 'always2') - rel(at, 'always1')}>{box(160, 560, 400, 64, C.yellow, C.navy1)}{Tx(160, 580, 400, 22, C.white, "ТИМУР", "center")}</Layer>
    <Layer at={rel(at, 'always2')} dur={rel(at, 'owlc') - rel(at, 'always2')}>{box(160, 560, 400, 64, C.red, C.navy1)}{Tx(160, 580, 400, 22, C.white, 'ЭКЗАМЕН', 'center')}</Layer>
    <Layer at={rel(at, 'owlc')} dur={dur - rel(at, 'owlc')} centre animate={popScale(0.3)}>{box(160, 560, 400, 64, C.yellow, C.navy1)}{Tx(160, 580, 400, 22, C.yellow, 'СОВА', 'center')}</Layer>
  </Scene>
))
// 19 the end: the owl knows
shot(T.allatonce, ({ at, dur }) => (
  <Scene at={at} dur={dur} base="owl_open" zoom={[1.0, 1.12]} swaps={[['owl_wink', rel(at, 'knows') + 0.6, dur]]}>
    <BigTitle at={0.1} dur={dur - 0.1} y={200} text="А ЕСЛИ ВСЁ СРАЗУ?" size={30} color={C.white} under={C.blue2} />
    <BigTitle at={rel(at, 'knows')} dur={dur - rel(at, 'knows')} y={300} text="СОВА ЗНАЕТ КАК" size={34} />
  </Scene>
))
