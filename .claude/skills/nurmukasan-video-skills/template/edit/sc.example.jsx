// EXAMPLE (v4, faces measured and never covered) from episode "Катя: что если до IELTS осталась неделя" (2:21). Copy as sc.jsx and rewrite SHOTS + OVERLAYS for the new script.
// Rules: every nested <Layer> must end inside its parent (dur = parentDur - at); never put pixel sprites (boxes/sprite/ICON/owlHead)
// inside a layer that scales (popScale/slam) or moves up/left - use popSlide (moves down) for those; one opacity track per layer.
import { W, H, C, T, IMG, Layer, Scene, Clip, popScale, popSlide, slam, fadeIn, fadeOut, boxes } from './lib.jsx'
import { panel, paper, tab, Chip, Hud, Title, DayCard, RuleCard, ICON, owlHead } from './ui.jsx'
import { T as K } from './times.jsx'

const S = (a, b, base, o = {}) => <Scene at={a} dur={b - a} base={base} {...o} />
const V = (a, b, k, o = {}) => <Clip at={a} dur={b - a} k={k} {...o} />
const c0 = (k) => K[k] - 0.08
const span = (a, b) => ({ at: a, dur: b - a })

// cut points (cut 0.08 s before the word that starts the new shot)
const t = {
  room: c0('kat'), level: 5.4, mock: c0('mock3'), pile: c0('dozens'), friends: c0('friends'), cafe: c0('cafe'), kitchen: c0('help'), phone: K.friend - 0.13,
  bed: c0('noans'), cal: c0('holid'), plan: c0('cancel'), drawer: c0('phone'), bun: c0('d7'), eyes: K.katya1 - 0.18, day1: c0('day1'), trash: c0('w100'),
  board: c0('week'), day2: c0('day2'), listen: c0('fast'), read: c0('ans'), essay: c0('wstruct'), mirror: c0('speak20'), sched: c0('sched'), sun: c0('w50'),
  sleep: c0('sleepedu'), brain: c0('brain'), day4: c0('day4'), cry: c0('cry'), mom1: 94.0, hug: 97.0, owl: c0('owl'), day5: c0('day5'), day6: c0('day6'),
  day7: c0('day7'), hall: c0('examday'), qc: c0('part'), speak: K.exam - 0.1, res: c0('res'), jump: c0('rO'), win: c0('end1'), cta: c0('cta'), END: K.END,
}
// a function, so IMG/VID are filled before the JSX is built
export const SHOTS = () => [
  V(0, t.room, 'v_hook', { zoom: [1, 1.04] }),
  V(t.room, t.level, 'v_room'),
  S(t.level, t.mock, 'level', { zoom: [1.06, 1.14] }),
  S(t.mock, t.pile, 'mock55', { zoom: [1.18, 1.04] }),
  S(t.pile, t.friends, 'pile', { zoom: [1.02, 1.14], panY: [30, -10] }),
  S(t.friends, t.cafe, 'friends', { zoom: [1.12, 1.12], pan: [40, -40] }),
  S(t.cafe, t.kitchen, 'cafe', { zoom: [1.04, 1.12] }),
  S(t.kitchen, t.phone, 'kitchen', { zoom: [1.14, 1.06], pan: [-20, 20] }),
  S(t.phone, t.bed, 'phone', { zoom: [1.04, 1.1] }),
  S(t.bed, t.cal, 'bedsad', { zoom: [1.14, 1.04] }),
  S(t.cal, t.plan, 'calendar', { zoom: [1.8, 1.86], panY: [268, 282], pan: [-155, -160] }),
  S(t.plan, t.drawer, 'planner', { zoom: [1.06, 1.12] }),
  S(t.drawer, t.bun, 'drawer', { zoom: [1.08, 1.2], pan: [0, -30] }),
  V(t.bun, t.eyes, 'v_bun'),
  S(t.eyes, t.day1, 'eyes2', { zoom: [1.0, 1.08] }),
  S(t.day1, t.trash, 'deskback', { zoom: [1.02, 1.1] }),
  S(t.trash, t.board, 'trash', { zoom: [1.06, 1.14], panY: [-20, 0] }),
  S(t.board, t.day2, 'deskback', { zoom: [1.3, 1.45], panY: [180, 220] }),
  S(t.day2, t.listen, 'write', { zoom: [1.04, 1.12] }),
  S(t.listen, t.read, 'listen', { zoom: [1.12, 1.04], pan: [30, -10] }),
  S(t.read, t.essay, 'readtop', { zoom: [1.04, 1.16], panY: [0, -40] }),
  S(t.essay, t.mirror, 'planner', { zoom: [2.0, 2.06], panY: [-560, -590] }),
  S(t.mirror, t.sched, 'mirror', { zoom: [1.04, 1.12], pan: [-20, 10] }),
  S(t.sched, t.sun, 'alarm', { zoom: [1.04, 1.14] }),
  V(t.sun, t.sleep, 'v_sun'),
  S(t.sleep, t.brain, 'sleep', { zoom: [1.12, 1.02] }),
  V(t.brain, t.day4, 'v_brain'),
  S(t.day4, t.cry, 'ressad', { zoom: [1.02, 1.14] }),
  V(t.cry, t.mom1, 'v_cry2'),
  V(t.mom1, t.hug, 'v_cry', { from: 0.6 }),
  S(t.hug, t.owl, 'hug', { zoom: [1.04, 1.12] }),
  V(t.owl, t.day5, 'v_owl'),
  S(t.day5, t.day6, 'sunrise', { zoom: [1.16, 1.08], pan: [20, -10] }),
  S(t.day6, t.day7, 'happy', { zoom: [1.06, 1.14] }),
  S(t.day7, t.hall, 'park', { zoom: [1.02, 1.12], pan: [-20, 20] }),
  V(t.hall, t.qc, 'v_hall'),
  S(t.qc, t.speak, 'qclose', { zoom: [1.04, 1.12] }),
  S(t.speak, t.res, 'speak', { zoom: [1.04, 1.1], pan: [10, -10] }),
  S(t.res, t.jump, 'reslap', { zoom: [1.02, 1.08] }),
  V(t.jump, t.win, 'v_jump', { zoom: [1, 1.04] }),
  S(t.win, t.cta, 'window', { zoom: [1.04, 1.14] }),
  V(t.cta, t.END, 'v_cta'),
]

// --- overlay helpers ---
const flash = (a, d = 0.18, col = '#ffffff') => <Layer at={a} dur={d} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.85 }, { at: d, value: 0 }] }]}><rect x={0} y={0} width={W} height={H} fill={col} /></Layer>
const dim = (a, b, o = 0.42) => <Layer at={a} dur={b - a} animate={fadeIn(0.25)}><rect x={0} y={0} width={W} height={H} fill={C.ink} opacity={o} /></Layer>
const strike = (x, y, w, at0, col = C.red, pd = 99) => <Layer at={at0} dur={pd - at0} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.08, value: 1 }] }]}><rect x={x - 6} y={y} width={w + 12} height={6} fill={col} radius={3} /></Layer>
const L = (at, dur, kids, anim) => <Layer at={at} dur={dur} animate={anim}>{kids}</Layer>
const rel = (k, base) => K[k] - base

// CEFR level bar
const Level = () => {
  const a = c0('eng'), d = t.mock - a, lv = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], col = ['#6d6290', '#7d6aa8', '#9a7ccc', C.lilac, C.pink, '#ffd6ec']
  return L(a, d, [
    ...panel(70, 236, 580, 132),
    ...tab(92, 218, 'УРОВЕНЬ КАТИ', C.lilac),
    ...lv.map((s, i) => [<rect x={92 + i * 92} y={262} width={84} height={34} radius={6} fill={col[i]} opacity={i < 3 ? 0.55 : 1} />, T(92 + i * 92, 271, 84, 15, C.ink, s, 'center', { shadow: false })]).flat(),
    <Layer at={K.b2 - a} dur={d - (K.b2 - a)} animate={popSlide(0.25, -20)}>{[<rect x={92 + 3 * 92 + 30} y={304} width={24} height={14} fill={C.yellow} radius={3} />, T(70, 326, 580, 14, C.yellow, 'B2 · ПОЧТИ C1', 'center')]}</Layer>,
    <Layer at={K.c1 - a} dur={d - (K.c1 - a)} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.15, value: 0.9 }, { at: 0.5, value: 0.35 }, { at: 0.8, value: 0.8 }] }]}><rect x={92 + 4 * 92 - 4} y={258} width={92} height={42} radius={8} fill="#00000000" strokeColor={C.yellow} strokeWidth={4} /></Layer>,
  ], fadeIn(0.25))
}
// friend voice message (waveform lights up while the clip plays)
const Chat = () => {
  const a = K.friend - 0.13, d = K.noans + 1.0 - a, n = 22, bars = []
  for (let i = 0; i < n; i++) {
    const h = 8 + Math.round(26 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)))
    bars.push(<rect x={232 + i * 14} y={352 - h / 2} width={8} height={h} radius={3} fill={C.ink} opacity={0.35}
      animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.35, easing: 'hold' }, { at: 0.35 + (K.friend_end - K.friend) * i / n, value: 1 }] }]} />)
  }
  return L(a, d, [
    ...panel(70, 200, 580, 250, C.yellow),
    <rect x={92} y={220} width={60} height={60} radius={30} fill={C.yellow} />, T(92, 239, 60, 22, C.ink, 'А', 'center', { shadow: false }),
    T(168, 226, 400, 18, C.cream, 'Аня · курсы IELTS'), T(168, 256, 400, 12, C.mint, 'в сети'),
    <rect x={92} y={300} width={500} height={104} radius={18} fill="#ffe9a8" strokeColor={C.ink} strokeWidth={3} />,
    <rect x={112} y={322} width={60} height={60} radius={30} fill={C.ink} />,
    boxes([[0, 0, 2, 8, C.yellow], [2, 1, 2, 6, C.yellow], [4, 2, 2, 4, C.yellow], [6, 3, 1, 2, C.yellow]], 134, 336, 4),
    ...bars,
    T(520, 376, 60, 11, C.grey2, '0:04', 'right', { shadow: false }),
    <Layer at={K.noans - a} dur={d - (K.noans - a)} animate={popSlide(0.2, 12)}>{T(92, 414, 500, 12, C.grey, 'Прочитано · 23:48', 'right')}</Layer>,
  ], popSlide(0.3, 40))
}
// cancelled plans (items struck through on the words)
const Plans = () => {
  const a = c0('cancel'), d = t.drawer - a, items = [['Смена в кофейне', 'smeny'], ['Кино с Аней', 'kino'], ['Встречи и др', 'vstr']]
  return L(a, d, [
    ...paper(140, 124, 440, 176),
    T(196, 140, 360, 14, C.pinkD, 'ПЛАНЫ НА НЕДЕЛЮ', 'left', { shadow: false }),
    ...items.map(([s, k], i) => [T(196, 180 + i * 34, 300, 15, C.ink, s, 'left', { shadow: false }), strike(196, 185 + i * 34, s.length * 15, K[k] - a + 0.1, C.red, d)]).flat(),
    <Layer at={K.vstr - a + 0.1} dur={d - (K.vstr - a + 0.1)} animate={slam(0.2)} centre>{[<rect x={430} y={238} width={136} height={40} radius={8} fill="#00000000" strokeColor={C.red} strokeWidth={4} />, T(430, 251, 136, 13, C.red, 'ОТМЕНЕНО', 'center', { shadow: false })]}</Layer>,
  ], popScale(0.3))
}
// IELTS structure board (tiles hold pixel icons -> popSlide, not popScale)
const Board = () => {
  const a = c0('L'), d = t.day2 - a
  const tile = (i, k, icon, name, l1, l2, col) => {
    const x = 70 + (i % 2) * 300, y = 300 + Math.floor(i / 2) * 230
    return <Layer at={K[k] - 0.1 - a} dur={d - (K[k] - 0.1 - a)} animate={popSlide(0.28, 30)}>{[...panel(x, y, 280, 210, col), <rect x={x + 18} y={y + 20} width={64} height={64} radius={10} fill="#3a2f66" />, ICON[icon](x + 26, y + 28, 4), T(x + 96, y + 40, 180, 15, col, name), T(x + 20, y + 110, 250, 14, C.cream, l1), T(x + 20, y + 146, 250, 13, C.grey, l2)]}</Layer>
  }
  return L(a, d, [
    tile(0, 'L', 'phones', 'LISTENING', '4 части', '40 вопросов', C.mint),
    tile(1, 'R', 'book', 'READING', '3 текста', '60 минут', C.sky),
    tile(2, 'Wr', 'pen', 'WRITING', '2 задачи', '60 минут', C.yellow),
    tile(3, 'S', 'mic', 'SPEAKING', '3 части', '11-14 минут', C.pink),
  ])
}
// growth-speed chart
const Growth = () => {
  const a = c0('slow'), d = K.fast + 0.9 - a
  const row = (i, name, w, col, lab, at0) => <Layer at={at0} dur={d - (at0)} animate={popSlide(0.25, 16)}>{[T(92, 180 + i * 40, 160, 13, C.cream, name), <rect x={250} y={174 + i * 40} width={240} height={26} radius={6} fill="#3a2f66" />, <rect x={250} y={174 + i * 40} width={Math.round(w * 0.8)} height={26} radius={6} fill={col} />, T(500, 182 + i * 40, 140, 10, col, lab, 'left')]}</Layer>
  return L(a, d, [
    ...panel(70, 150, 580, 190),
    ...tab(92, 132, 'ЧТО РАСТЁТ БЫСТРЕЕ ЗА НЕДЕЛЮ', C.lilac),
    row(0, 'Listening', 280, C.mint, 'БЫСТРО', 0.15), row(1, 'Reading', 262, C.mint, 'БЫСТРО', 0.3),
    row(2, 'Speaking', 170, C.yellow, 'СРЕДНЕ', 0.45), row(3, 'Writing', 70, C.red, 'МЕДЛЕННО', 0.6),
    <Layer at={K.fast - a} dur={d - (K.fast - a)} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.12, value: 1 }, { at: 0.45, value: 0.4 }, { at: 0.75, value: 1 }] }]}>{[<rect x={82} y={168} width={556} height={78} radius={10} fill="#00000000" strokeColor={C.yellow} strokeWidth={4} />]}</Layer>,
  ], popScale(0.3))
}
// paraphrase cards (placed low so the heroine's face stays visible)
const Para = () => {
  const a = c0('closed'), d = t.essay - a
  return L(a, d, [
    <Layer at={0} dur={d - (0)} animate={popScale(0.28)} centre>{[...panel(70, 568, 580, 112, C.sky), ...tab(92, 550, 'ВОПРОС', C.sky), T(96, 594, 530, 17, C.cream, 'The museum is'), T(96, 628, 530, 20, C.yellow, 'closed on Mondays.')]}</Layer>,
    <Layer at={K.turns - a} dur={d - (K.turns - a)} animate={popSlide(0.25, 20)}>{[T(386, 690, 120, 24, C.pink, '=', 'left', { stroke: true }), T(430, 698, 200, 11, C.pink, 'ПЕРЕФРАЗ', 'left')]}</Layer>,
    <Layer at={K.turns - a + 0.25} dur={d - (K.turns - a + 0.25)} animate={popScale(0.28)} centre>{[...panel(70, 738, 580, 112, C.mint), ...tab(92, 720, 'В ТЕКСТЕ', C.mint), T(96, 764, 530, 17, C.cream, 'It does not open its doors'), T(96, 798, 530, 17, C.yellow, 'at the start of the week.')]}</Layer>,
  ])
}
// essay template
const Essay = () => {
  const a = c0('wstruct'), d = t.mirror - a
  const blk = (i, s, k, col, h) => {
    const y = [300, 372, 470, 568][i]
    return <Layer at={(k ? K[k] - a : 0.3) + (i === 2 ? 0.35 : 0)} dur={d - ((k ? K[k] - a : 0.3) + (i === 2 ? 0.35 : 0))} animate={popSlide(0.22, 16)}>{[<rect x={150} y={y} width={420} height={h} radius={8} fill={col} opacity={0.9} strokeColor={C.ink} strokeWidth={3} />, T(170, y + 14, 380, 14, C.ink, s, 'left', { shadow: false }), <rect x={170} y={y + 40} width={300} height={4} fill={C.ink} opacity={0.25} />, h > 70 ? <rect x={170} y={y + 56} width={360} height={4} fill={C.ink} opacity={0.25} /> : null]}</Layer>
  }
  return L(a, d, [
    ...paper(120, 230, 480, 440),
    T(170, 250, 400, 16, C.pinkD, 'WRITING · TASK 2', 'left', { shadow: false }),
    blk(0, 'ВСТУПЛЕНИЕ', 'intro', C.lilac, 60), blk(1, 'АБЗАЦ 1 · АРГУМЕНТ', 'par2', '#ffc2e2', 84), blk(2, 'АБЗАЦ 2 · АРГУМЕНТ', 'par2', '#ffc2e2', 84), blk(3, 'ВЫВОД', 'concl', C.lilac, 60),
    <Layer at={K.tmpl - a + 0.3} dur={d - (K.tmpl - a + 0.3)} animate={slam(0.25)} centre>{[<rect x={380} y={612} width={200} height={56} radius={8} fill={C.yellow} strokeColor={C.ink} strokeWidth={5} />, T(380, 630, 200, 18, C.ink, 'ШАБЛОН', 'center', { shadow: false })]}</Layer>,
  ], popScale(0.3))
}
// daily schedule (rows hold icons -> popSlide)
const Sched = () => {
  const a = c0('sched'), d = t.sleep - a
  const row = (i, time, s, icon, k) => <Layer at={K[k] - a} dur={d - (K[k] - a)} animate={popSlide(0.25, 18)}>{[<rect x={92} y={650 + i * 50} width={536} height={44} radius={8} fill="#3a2f66" />, ICON[icon](102, 655 + i * 50, 3), T(150, 664 + i * 50, 130, 15, C.yellow, time), T(272, 666 + i * 50, 350, 12, C.cream, s)]}</Layer>
  return L(a, d, [
    ...panel(70, 622, 580, 236),
    ...tab(92, 604, 'РАСПИСАНИЕ КАТИ', C.lilac),
    row(0, '07:00', 'ПОДЪЁМ', 'sun', 'up7'), row(1, '09:00', 'MOCK, КАК НА ЭКЗАМЕНЕ', 'pen', 'mock9'),
    row(2, '50/10', 'РАБОТА / ОТДЫХ', 'clock', 'w50'), row(3, '23:00', 'ОТБОЙ · 8 ЧАСОВ СНА', 'moon', 'off11'),
  ], popSlide(0.3, 40))
}
// brain labels
const Brain = () => {
  const a = t.brain, d = t.day4 - a
  return L(a, d, [
    <Layer at={0.3} dur={d - (0.3)} animate={popSlide(0.3, 18)}>{[...tab(214, 312, 'ДОЛГАЯ ПАМЯТЬ', C.sky, C.ink, 15)]}</Layer>,
    <Layer at={0.9} dur={d - (0.9)} animate={popSlide(0.3, 18)}>{[...tab(196, 760, 'КОРОТКАЯ ПАМЯТЬ', C.yellow, C.ink, 15)]}</Layer>,
    <Layer at={K.nosleep - a} dur={d - (K.nosleep - a)} animate={popScale(0.3)} centre>{[...panel(110, 176, 500, 96, C.red), T(110, 196, 500, 13, C.cream, 'НЕ ВЫСПАЛАСЬ:', 'center'), T(110, 226, 500, 22, C.red, 'СОХРАНИТСЯ ~60%', 'center')]}</Layer>,
  ])
}
// mock progress bars
const Progress = () => {
  const a = c0('day5'), d = t.day7 - a, pts = [['ДО', 5.5, 0], ['Д4', 6.0, 0], ['Д5', 6.5, rel('m65', a)], ['Д6', 7.0, rel('m7', a)]]
  return L(a, d, [
    ...panel(130, 656, 460, 190, C.mint),
    ...tab(152, 638, 'MOCK ПО ДНЯМ', C.mint),
    ...pts.map(([lab, v, at0], i) => {
      const h = Math.round((v - 5) * 50), x = 172 + i * 104, y = 814 - h
      return <Layer at={at0} dur={d - (at0)} animate={popSlide(0.25, 20)}>{[<rect x={x} y={y} width={64} height={h} radius={6} fill={i === 3 ? C.yellow : i === 2 ? C.mint : C.grey2} />, T(x - 10, y - 30, 90, 15, i >= 2 ? C.cream : C.grey, v.toFixed(1), 'center'), T(x - 10, 820, 90, 10, C.grey, lab, 'center')]}</Layer>
    }),
  ], popScale(0.3))
}
// results report
const Results = () => {
  const a = t.res, d = t.jump - a, rows = [['LISTENING', '8.0', 'rL', C.mint], ['READING', '8.0', 'rR', C.sky], ['WRITING', '6.5', 'rW', C.yellow], ['SPEAKING', '7.0', 'rS', C.pink]]
  return L(a, d, [
    ...panel(110, 124, 500, 250, C.yellow),
    T(110, 138, 500, 11, C.grey, 'IELTS · TEST REPORT FORM', 'center'),
    T(110, 158, 500, 17, C.cream, 'КАТЯ', 'center'),
    ...rows.map(([s, v, k, col], i) => <Layer at={K[k] - a} dur={d - (K[k] - a)} animate={popSlide(0.22, 16)}>{[<rect x={130} y={190 + i * 44} width={460} height={38} radius={8} fill="#3a2f66" />, T(150, 202 + i * 44, 300, 14, C.cream, s), <rect x={504} y={194 + i * 44} width={78} height={30} radius={6} fill={col} />, T(504, 200 + i * 44, 78, 16, C.ink, v, 'center', { shadow: false })]}</Layer>),
  ], popScale(0.3))
}
export const OVERLAYS = () => [
  // hook
  <Title at={0.05} dur={t.room - 0.05} l1="ЧТО ЕСЛИ ДО IELTS" l2="ВСЕГО 7 ДНЕЙ?" y={170} s1={26} s2={40} />,
  <Layer at={0.6} dur={t.room - 0.6} animate={popScale(0.25)} centre>{[...panel(230, 282, 260, 62, C.red), T(230, 300, 260, 24, C.red, '168:00:00', 'center')]}</Layer>,
  flash(t.room - 0.04, 0.16),
  // intro
  <Layer at={K.kat} dur={t.level - K.kat} animate={popSlide(0.3, 20)}>{[...panel(70, 400, 230, 70, C.pink), T(70, 422, 230, 24, C.cream, 'КАТЯ', 'center')]}</Layer>,
  Level(),
  <Chip at={K.mock3} dur={t.pile - K.mock3} x={70} y={236} text="3 МЕСЯЦА НАЗАД" bg={C.sky} />,
  <Layer at={K.f55e + 0.2} dur={t.pile - K.f55e - 0.2} animate={slam(0.25)} centre>{[<rect x={260} y={640} width={200} height={130} radius={14} fill="#00000000" strokeColor={C.red} strokeWidth={9} />, T(260, 662, 200, 13, C.red, 'MOCK', 'center', { shadow: false }), T(260, 692, 200, 46, C.red, '5.5', 'center', { shadow: false })]}</Layer>,
  <Chip at={K.dozens + 0.9} dur={t.friends - K.dozens - 0.9} x={70} y={236} text="МОКОВ РЕШЕНО: 40+" bg={C.yellow} />,
  <Chip at={K.friends + 0.3} dur={t.cafe - K.friends - 0.3} x={70} y={236} text="ПОДРУГИ: 3 МЕСЯЦА ПОДГОТОВКИ" bg={C.mint} size={14} />,
  <Chip at={K.cafe + 0.3} dur={t.kitchen - K.cafe - 0.3} x={70} y={236} text="СМЕНА ДО 23:00" bg={C.lilac} />,
  <Chip at={K.help + 0.2} dur={t.phone - K.help - 0.2} x={70} y={236} text="+ ДОМАШКА БРАТЬЕВ" bg={C.lilac} />,
  Chat(),
  <Chip at={K.holid + 0.1} dur={t.plan - K.holid - 0.1} x={262} y={490} text="КАНИКУЛЫ!" bg={C.yellow} size={22} anim={slam(0.25)} />,
  Plans(),
  <Title at={K.d7} dur={t.eyes - K.d7} l1="7 ДНЕЙ =" l2="168 ЧАСОВ" y={580} s1={30} s2={56} />,
  flash(K.h168, 0.14, C.yellow),
  <Chip at={K.each + 0.1} dur={t.eyes - K.each - 0.1} x={190} y={756} text="КАЖДЫЙ НА СЧЕТУ" bg={C.pink} />,
  // HUD through the week (hidden in emotional / full-screen scenes)
  <Hud {...span(K.katya1_end - 0.9, t.day2)} day={1} left="168 Ч" mock="5.5" />,
  <Hud {...span(t.day2, c0('slow'))} day={2} left="144 Ч" mock="5.5" />,
  <Hud {...span(K.fast + 0.9, t.sched)} day={2} left="144 Ч" mock="5.5" />,
  <Hud {...span(t.sched, t.brain)} day={3} left="120 Ч" mock="5.5" />,
  <Hud {...span(t.day4, t.cry)} day={4} left="96 Ч" mock="6.0" />,
  <Hud {...span(t.owl, t.day5)} day={4} left="96 Ч" mock="6.0" />,
  <Hud {...span(t.day5, t.day6)} day={5} left="72 Ч" mock="6.5" />,
  <Hud {...span(t.day6, t.day7)} day={6} left="48 Ч" mock="7.0" />,
  <Hud {...span(t.day7, t.hall)} day={7} left="24 Ч" mock="7.0" />,
  <Hud {...span(t.hall, t.speak)} day={8} left="СЕГОДНЯ" mock="7.0" hot={true} />,
  // day 1
  <DayCard at={K.day1} dur={1.5} n={1} sub="ПОНЕДЕЛЬНИК" />,
  <RuleCard at={K.rule1 + 0.2} dur={t.trash - K.rule1 - 0.2} n={1} lines={['СТАРЫЕ МЕТОДЫ', 'УЖЕ НЕ РАБОТАЮТ']} />,
  <Layer at={K.w100} dur={t.board - K.w100} animate={popScale(0.28)} centre>{[...panel(150, 222, 420, 100, C.red), T(150, 240, 420, 16, C.cream, '100 СЛОВ В ДЕНЬ', 'center'), T(150, 270, 420, 28, C.red, '×  ПОЗДНО', 'center')]}</Layer>,
  <Layer at={K.week} dur={c0('L') - K.week} animate={popScale(0.28)} centre>{[T(40, 330, 640, 30, C.grey, 'АНГЛИЙСКИЙ', 'center', { stroke: true }), strike(170, 346, 380, 1.2, C.red, c0('L') - K.week), <Layer at={K.exam1 - K.week} dur={c0('L') - K.exam1} animate={slam(0.25)} centre>{T(40, 400, 640, 46, C.yellow, 'ЭКЗАМЕН', 'center', { stroke: true })}</Layer>]}</Layer>,
  dim(c0('L') - 0.1, t.day2, 0.5),
  Board(),
  // day 2
  <DayCard at={K.day2} dur={1.4} n={2} />,
  <RuleCard at={K.rule2 + 0.1} dur={c0('slow') - K.rule2 - 0.1} n={2} lines={['НЕ ТРАТЬ НЕДЕЛЮ', 'НА WRITING']} col={C.yellow} y={660} />,
  Growth(),
  <Chip at={K.ans + 0.2} dur={c0('closed') - K.ans - 0.2} x={110} y={612} text="ОТВЕТ - НЕ КОПИЯ ВОПРОСА" bg={C.sky} size={16} />,
  Para(),
  Essay(),
  <Layer at={t.mirror + 0.1} dur={t.sched - t.mirror - 0.1} animate={popSlide(0.25, 16)}>{[...panel(70, 236, 300, 70, C.red), <rect x={92} y={258} width={24} height={24} radius={12} fill={C.red} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 1 }, { at: 0.5, value: 0.2 }, { at: 1.0, value: 1 }, { at: 1.5, value: 0.2 }, { at: 2.0, value: 1 }] }]} />, T(130, 260, 220, 20, C.cream, 'REC 20:00')]}</Layer>,
  Sched(),
  <Chip at={t.sleep + 0.2} dur={t.brain - t.sleep - 0.2} x={180} y={720} text="СОН = ТОЖЕ УЧЁБА" bg={C.sky} size={18} />,
  Brain(),
  // day 4 drama
  <DayCard at={K.day4} dur={1.2} n={4} />,
  <Layer at={K.m6 + 0.1} dur={t.cry - K.m6 - 0.1} animate={slam(0.25)} centre>{[...panel(240, 660, 240, 120, C.grey), T(240, 676, 240, 12, C.grey, 'MOCK', 'center'), T(240, 704, 240, 36, C.cream, '6.0', 'center'), T(240, 754, 260, 11, C.grey, '+0.5 ЗА 4 ДНЯ', 'center')]}</Layer>,
  // days 5-7
  Progress(),
  <DayCard at={K.day7} dur={1.3} n={7} sub="ОТДЫХ" />,
  <Chip at={K.nomocks} dur={t.hall - K.nomocks} x={60} y={400} text="НИКАКИХ МОКОВ" bg={C.pink} size={13} />,
  <Chip at={K.walk + 0.6} dur={t.hall - K.walk - 0.6} x={60} y={452} text="ПРОГУЛКА" bg={C.mint} size={13} />,
  <Chip at={K.walk + 1.4} dur={t.hall - K.walk - 1.4} x={60} y={504} text="СОН В 22:00" bg={C.sky} size={13} />,
  // exam
  <Title at={K.examday} dur={1.6} l1="" l2="ДЕНЬ ЭКЗАМЕНА" y={250} s2={38} />,
  flash(K.examday, 0.14),
  <Chip at={K.part} dur={t.speak - K.part} x={70} y={610} text="■ КАЖДАЯ ЧАСТЬ" bg={C.mint} />,
  <Chip at={K.trap} dur={t.speak - K.trap} x={70} y={676} text="■ КАЖДАЯ ЛОВУШКА" bg={C.mint} />,
  <Layer at={t.speak + 0.1} dur={t.res - t.speak - 0.1} animate={popSlide(0.25, 16)}>{[...tab(70, 236, 'SPEAKING · PART 1', C.sky, C.ink, 15)]}</Layer>,
  Results(),
  flash(t.jump, 0.2, C.yellow),
  <Layer at={t.jump + 0.05} dur={t.win - t.jump - 0.05} animate={slam(0.3)} centre>{[...panel(200, 650, 320, 190, C.yellow), T(200, 674, 320, 14, C.cream, 'OVERALL BAND', 'center'), T(200, 712, 320, 72, C.yellow, '7.5', 'center', { stroke: true })]}</Layer>,
  // ending + CTA + logo
  <Layer at={K.end1} dur={t.cta - K.end1} animate={popScale(0.3)} centre>{[...panel(70, 130, 580, 96, C.pink), T(70, 164, 580, 20, C.cream, 'НЕДЕЛЯ — ЭТО НЕ КОНЕЦ', 'center')]}</Layer>,
  <Layer at={K.end3} dur={t.cta - K.end3} animate={popSlide(0.3, 20)}>{[...panel(70, 246, 580, 110, C.yellow), T(70, 270, 580, 16, C.cream, 'ПОЙМИ СТРУКТУРУ', 'center'), T(70, 308, 580, 20, C.yellow, '→ ВЫСОКИЙ БАЛЛ', 'center')]}</Layer>,
  <Layer at={t.cta + 0.1} dur={t.END - t.cta - 0.1} animate={popScale(0.3)} centre>{[...panel(70, 190, 580, 150, C.lilac), T(70, 214, 580, 18, C.cream, 'СКОЛЬКО ДНЕЙ', 'center'), T(70, 248, 580, 18, C.cream, 'ДО IELTS У ТЕБЯ?', 'center'), T(70, 292, 580, 15, C.yellow, 'ПИШИ В КОММЕНТЫ ↓', 'center')]}</Layer>,
  <Layer at={t.cta + 0.6} dur={t.END - t.cta - 0.6} animate={popSlide(0.3, 20)}><media file={IMG.logo} x={215} y={364} width={290} height={63} fit="contain" /></Layer>,
]
export { t as CUTS }
