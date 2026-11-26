import { W, H, C, P, FONT, IMG, Layer, Scene, blinks, every, popScale, popSlide, PText } from './lib.jsx'
import { PowerUp, Chip, BigTitle, Steps } from './ui.jsx'
import { Glitch, box, T as Tx } from './ui3.jsx'
import { Hud5, Stats5, HookTitle, Counter, Say, Scores5, Zzz, CanDrop } from './ui6.jsx'
import { T, D } from './times.jsx'

// Layout rules (same as vocab-60): overlays inside x 56-664, below the HUD (y > 240), above every face, never on the owl
// (room plates: keep x 460-570 / y 320-490 free), captions centred at y 872, counters on their own panels at x 70.
const rel = (at, k) => Math.max(0.05, T[k] - at)
const hud = (v, dots = 0) => Hud5({ value: v, dots })
const st = (dur, hours, mock, sleep, at = 0, flash = []) => <Stats5 at={at} dur={Math.max(0.05, dur - at)} hours={hours} mock={mock} sleep={sleep} flash={flash} />
const darken = (a = 0.5, t = 0.3) => <rect x={0} y={0} width={W} height={H} fill="#0b0c26" animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: t, value: a }] }]} />
const stamp = (dur, at, title, lines, mark, markAt, col = C.red) => (
  <Layer at={at} dur={dur - at} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 700 }, { at: 0.35, value: 0, easing: 'ease-out' }] }]}>
    <rect x={130} y={330} width={460} height={230} fill={C.ink} /><rect x={136} y={336} width={448} height={218} fill="#f4ead2" />
    <text x={160} y={356} width={400} fontFamily={FONT} fontWeight={400} fontSize={18} color={C.ink}>{title}</text>
    {lines.map(([s, lt], i) => <Layer at={lt} dur={dur - at - lt}><text x={160} y={404 + i * 34} width={250} fontFamily={FONT} fontWeight={400} fontSize={14} color="#5a4a3a">{s}</text></Layer>)}
    <Layer at={markAt} dur={dur - at - markAt} centre animate={[{ property: 'scale', keyframes: [{ at: 0, value: 2.4 }, { at: 0.15, value: 0.95 }, { at: 0.25, value: 1 }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.05, value: 1 }] }]}>
      <rect x={420} y={390} width={150} height={116} fill="#00000000" strokeColor={col} strokeWidth={8} />
      <text x={420} y={418} width={150} fontFamily={FONT} fontWeight={400} fontSize={42} color={col} align="center">{mark}</text>
    </Layer>
  </Layer>
)
// attention meter that drains (green -> red), on its own panel at the left column
const Attn = ({ at, dur, drain = 3.0 }) => (
  <Layer at={at} dur={dur} animate={popSlide()}>
    {box(70, 262, 380, 84, C.mint, C.navy1)}
    {Tx(88, 276, 344, 14, C.grey3, 'ВНИМАНИЕ')}
    <rect x={88} y={304} width={344} height={26} fill="#26264f" />
    <rect x={88} y={304} width={344} height={26} fill={C.mintL} origin="top-left" animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: 1 }, { at: 0.3, value: 1 }, { at: drain, value: 0.06, easing: 'ease-in' }] }, { property: 'opacity', keyframes: [{ at: 0, value: 1 }, { at: drain * 0.6, value: 0.2 }] }]} />
    <rect x={88} y={304} width={344} height={26} fill={C.red} origin="top-left" opacity={0} animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: 1 }, { at: 0.3, value: 1 }, { at: drain, value: 0.06, easing: 'ease-in' }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: drain * 0.6, value: 1 }] }]} />
  </Layer>
)
const talk = (k, from, to, period = 0.26, on = 0.13) => { const o = []; for (let t = from; t < to - 0.05; t += period) o.push([k, t, on]); return o }
const splitAt = (k, re) => { const w = D[k] || []; const i = w.findIndex((x, j) => j > 0 && re.test(w[j - 1][0])); return i > 0 ? w[i][1] - 0.08 : (T[k] + T[k + '_end']) / 2 }

// camera guard: keep the face bottom at y <= 800 (captions at 872) without showing the plate edge (face bottoms measured on the plates)
const FB = { hook: 815, fresh: 815, fire: 815, read: 815, write: 815, happy: 815, wk2: 815, wk3: 815, nod: 815, wide: 815, focus: 815, end: 815,
  asleep: 855, owl_lamp: 860, owl_dark: 860, kitchen: 875, kitchen_m1: 875, kitchen_m2: 875, street: 805, owl_open: 790, owl_wink: 790 }
const Sc = ({ base, zoom = [1, 1.06], panY, ...o }) => {
  const fb = FB[base] || FB[base.split('_')[0]]
  if (!fb || panY) return Scene({ base, zoom, panY, ...o })
  const zmin = 480 / (1280 - fb) + 0.005
  const z = zoom.map((v) => Math.max(v, zmin))
  return Scene({ base, zoom: z, panY: z.map((v) => Math.min(0, 160 - v * (fb - 640))), ...o })
}

// --- shots ---------------------------------------------------------------
export const SHOTS = []
const shot = (t, fn) => SHOTS.push([t > 0 ? t - 0.08 : 0, fn])

// 01 hook — title, counter and voice from frame 0
shot(0, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="hook" zoom={[1.2, 1.04]} swaps={blinks('hook_b', [1.3, 3.6])}>
    <Layer at={0} dur={dur}>{HookTitle({ y: 250, text: '16 ЧАСОВ', size: 60 })}{HookTitle({ y: 336, text: '60 ДНЕЙ ПОДРЯД', size: 30, color: C.white, under: C.blue2 })}</Layer>
    <Counter at={0.25} dur={dur - 0.25} t1={Math.max(0.8, rel(at, 'h960') + 0.6)} values={['0', '112', '336', '480', '720', '960']} y={412} x={210} label="ЧАСОВ АНГЛИЙСКОГО" color={C.gold} fg={C.yellow} />
  </Sc>
))
// 02 universe #6: everything at once
shot(T.u6, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="fresh" zoom={[1.0, 1.06]} swaps={blinks('fresh_b', [1.5])}>
    <Glitch at={0} dur={0.35} />
    <Layer at={0.1} dur={dur - 0.1} animate={popSlide()}>{hud('ДЕНЬ 0')}</Layer>
    {st(dur, '0', '-', '8 Ч', 0.1)}
    <Chip at={0.05} dur={dur - 0.05} x={70} y={262} text="ВСЕЛЕННАЯ #6" color={C.red} size={20} />
    {[['LISTENING', 70, 336, C.blue2], ['READING', 300, 336, C.gold], ['WRITING', 70, 396, C.mint], ['SPEAKING', 300, 396, '#c8507a']].map(([t, x, y, c], i) => (
      <Chip at={rel(at, 'notone') + 0.4 + i * 0.3} dur={dur - rel(at, 'notone') - 0.4 - i * 0.3} x={x} y={y} text={t} color={c} fg={c === C.gold || c === C.mint ? C.ink : C.white} size={16} />))}
    <BigTitle at={rel(at, 'allatonce')} dur={dur - rel(at, 'allatonce')} y={530} text="ВСЁ СРАЗУ" size={40} />
  </Sc>
))
// 03 day 0: 5.0 everywhere
shot(T.day0, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_um" zoom={[1.0, 1.06]} swaps={every('examB_blink', dur, 1.3, 0.14, 0.9)}>
    {hud('ДЕНЬ 0')}{st(rel(at, 'all5'), '0', '-', '8 Ч')}{st(dur, '0', '5.0', '8 Ч', rel(at, 'all5'), [[1, 0]])}
    <BigTitle at={0.05} dur={rel(at, 'mock0')} y={262} text="ДЕНЬ 0" size={56} />
    {stamp(dur, rel(at, 'mock0'), 'MOCK · ДЕНЬ 0', [['LISTENING 5.0', 0.2], ['READING   5.0', 0.35], ['WRITING   5.0', 0.5], ['SPEAKING  5.0', 0.65]], '5.0', Math.max(0.8, rel(at, 'all5') - rel(at, 'mock0')))}
  </Sc>
))
// 04 the rule: 16 hours, up at 7, bed at 2
shot(T.rule, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="fire" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 1', 1)}{st(rel(at, 'rest'), '0', '5.0', '8 Ч')}{st(dur, '0', '5.0', '5 Ч', rel(at, 'rest'), [[2, 0]])}
    <PowerUp at={0.1} dur={dur - 0.1} icon="book" title="ПРАВИЛО" sub="16 ЧАСОВ В ДЕНЬ" y={292} tab="БЕЗ ВЫХОДНЫХ" />
    <Chip at={rel(at, 'wake7')} dur={dur - rel(at, 'wake7')} x={70} y={482} text="07:00 ПОДЪЁМ" color={C.mint} fg={C.ink} size={18} />
    <Chip at={rel(at, 'bed2')} dur={dur - rel(at, 'bed2')} x={70} y={540} text="02:00 ОТБОЙ" color={C.navy3} size={18} />
    <Chip at={rel(at, 'rest')} dur={dur - rel(at, 'rest')} x={70} y={598} text="СОН: 5 Ч" color={C.red} size={18} />
  </Sc>
))
// 05 week 1: reading, writing, speaking — 112 hours, mock 6.0
shot(T.wk1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="read" zoom={[1.0, 1.08]} swaps={[['write', 0.8, 0.8], ['mirror', 1.6, 0.8], ['happy', 2.4, dur]]}>
    {hud('НЕДЕЛЯ 1', 1)}
    {st(rel(at, 'h112'), '0', '5.0', '5 Ч')}{st(rel(at, 'm6'), '112', '5.0', '5 Ч', rel(at, 'h112'), [[0, 0]])}{st(dur, '112', '6.0', '5 Ч', rel(at, 'm6'), [[1, 0]])}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'h112') - 0.35)} y={256} text="НЕДЕЛЯ 1" size={48} />
    <Counter at={Math.max(0.1, rel(at, 'h112') - 0.3)} dur={dur - Math.max(0.1, rel(at, 'h112') - 0.3)} t1={0.9} values={['0', '40', '80', '112']} y={262} label="ЧАСОВ" color={C.gold} fg={C.yellow} />
    <Chip at={rel(at, 'm6')} dur={dur - rel(at, 'm6')} x={70} y={392} text="MOCK 6.0" color={C.mint} fg={C.ink} size={22} />
  </Sc>
))
// 06 week 2: 6.5, more and more energy drinks land on the desk
shot(T.wk2, ({ at, dur }) => {
  const c = rel(at, 'cans')
  return (
    <Sc at={at} dur={dur} base="wk2" zoom={[1.0, 1.06]} swaps={every('wk2_b', dur, 1.4, 0.14, 1.0)}
      world={[[100, 0.35], [130, 1.05], [116, 1.65]].filter(([x, t]) => c + t < dur - 0.3).map(([x, t]) => <CanDrop at={c + t} dur={dur - c - t} x={x} base={182} />)}>
      {hud('НЕДЕЛЯ 2', 2)}{st(dur, '224', '6.5', '5 Ч', 0.9, [[1, 0], [0, 0]])}{st(0.9, '112', '6.0', '5 Ч')}
      <BigTitle at={0.05} dur={Math.max(0.3, c - 0.05)} y={256} text="НЕДЕЛЯ 2" size={48} />
      <Counter at={c} dur={dur - c} t1={1.8} values={['3', '6', '10', '14']} y={262} label="ЭНЕРГЕТИКОВ" color={C.mint} fg={C.mintL} />
    </Sc>
  )
})
// 07 mum (her own line), then "he didn't answer — he had his headphones on"
shot(T.mom - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="kitchen_m1" zoom={[1.0, 1.04]} swaps={talk('kitchen_m2', 0.15, dur - 0.2).concat(talk('kitchen', 0.28, dur - 0.2))}>
    {hud('НЕДЕЛЯ 2', 2)}
    <Say at={0.1} dur={dur - 0.1} x={60} y={300} w={560} en="Тимур, ты когда последний раз на улице был? Солнце видел вообще?" ru="" name="МАМА" tab="#c8504a" tail="left" />
  </Sc>
))
shot(T.noans, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="kitchen" zoom={[1.0, 1.04]}>
    {hud('НЕДЕЛЯ 2', 2)}
    <Chip at={0.05} dur={dur - 0.05} x={70} y={300} text="НЕ ОТВЕТИЛ" color={C.grey2} size={20} />
    <Chip at={rel(at, 'phonesw')} dur={dur - rel(at, 'phonesw')} x={70} y={364} text="В НАУШНИКАХ" color={C.mint} fg={C.ink} size={20} />
  </Sc>
))
// 08 week 3: the same page for the third time
shot(T.wk3, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="wk3" zoom={[1.0, 1.08]} swaps={every('wk3_b', dur, 1.8, 0.2, 1.2)}>
    {hud('НЕДЕЛЯ 3', 3)}{st(dur, '336', '6.5', '5 Ч', 0, [[0, 0.1]])}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'page') - 0.05)} y={256} text="НЕДЕЛЯ 3" size={48} />
    <Counter at={rel(at, 'page')} dur={dur - rel(at, 'page')} t1={1.4} values={['47', '47', '47']} y={262} label="СТРАНИЦА" color={C.gold} fg={C.yellow} />
    <Chip at={rel(at, 'page') + 1.4} dur={dur - rel(at, 'page') - 1.4} x={70} y={384} text="3-Й РАЗ" color={C.gold} fg={C.ink} size={20} />
    <Chip at={rel(at, 'noword')} dur={dur - rel(at, 'noword')} x={70} y={446} text="НЕ ПОМНИТ НИ СЛОВА" color={C.red} size={16} />
  </Sc>
))
// 09 day 30: mock listening, he closes his eyes "for a second"
shot(T.d30, ({ at, dur }) => {
  const c = rel(at, 'closed')
  return (
    <Sc at={at} dur={dur} base="wk3" zoom={[1.0, 1.1]} swaps={[['nod', c, 0.8], ['asleep', c + 0.8, dur]]}
      world={c + 1.0 < dur - 0.3 ? [<Zzz at={c + 1.0} dur={dur - c - 1.0} x={420} y={730} />] : []}>
      {hud('ДЕНЬ 30', 4)}{st(dur, '480', '6.5', '5 Ч')}
      <BigTitle at={0.05} dur={rel(at, 'mockL')} y={256} text="ДЕНЬ 30" size={52} />
      <Chip at={rel(at, 'mockL')} dur={dur - rel(at, 'mockL')} x={70} y={336} text="ПРОБНЫЙ LISTENING" color={C.blue2} size={18} />
    </Sc>
  )
})
shot(T.rec - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="asleep" zoom={[1.08, 1.16]} world={[<Zzz at={0} dur={dur} x={420} y={730} />]}>
    <Say at={0.1} dur={dur - 0.1} y={296} en="This is the end of section four. You now have ten minutes to transfer your answers." ru="«Конец четвёртой части. У вас 10 минут, чтобы перенести ответы.»" name="ЗАПИСЬ · SECTION 4" tab={C.grey2} tail="center" />
  </Sc>
))
// 10 mock 5.0 — like day 0
shot(T.m5, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="wide" zoom={[1.04, 1.1]}>
    {hud('ДЕНЬ 30', 4)}{st(dur, '480', '5.0', '5 Ч', 0.1, [[1, 0]])}{st(0.1, '480', '6.5', '5 Ч')}
    {stamp(dur, 0.05, 'MOCK · ДЕНЬ 30', [['ЧАСОВ: 480', 0.2], ['ОТВЕТОВ: 9/40', 0.4]], '5.0', 0.55)}
    <Chip at={rel(at, 'likeday0')} dur={dur - rel(at, 'likeday0')} x={150} y={590} text="КАК В ДЕНЬ 0" color={C.red} size={22} />
  </Sc>
))
// 11 twist: 480 hours, zero progress
shot(T.twist, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="wk3" zoom={[1.15, 1.25]}>
    <Glitch at={0} dur={0.3} />
    {darken(0.55, 0.3)}
    <BigTitle at={0.05} dur={dur - 0.05} y={252} text="ПОВОРОТ!" size={52} />
    <Chip at={rel(at, 'h480')} dur={dur - rel(at, 'h480')} x={70} y={350} text="480 ЧАСОВ" color={C.gold} fg={C.ink} size={22} />
    <Chip at={rel(at, 'zero')} dur={dur - rel(at, 'zero')} x={70} y={420} text="ПРОГРЕСС: 0" color={C.red} size={22} />
  </Sc>
))
// 12 why: attention switches off, no sleep = nothing sticks; sat 16 h, learned ~4
shot(T.brain, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="wk3" zoom={[1.04, 1.1]} swaps={every('wk3_b', dur, 1.6, 0.2, 1.0)}>
    {hud('ДЕНЬ 30', 4)}{st(dur, '480', '5.0', '5 Ч')}
    <Attn at={Math.max(0.1, rel(at, 'attn') - 0.2)} dur={dur - Math.max(0.1, rel(at, 'attn') - 0.2)} drain={Math.max(1.2, rel(at, 'nosleep') - rel(at, 'attn') + 0.3)} />
    <Chip at={rel(at, 'nosleep')} dur={dur - rel(at, 'nosleep')} x={70} y={372} text="БЕЗ СНА = НЕ ЗАКРЕПЛЯЕТСЯ" color={C.navy3} size={14} />
    <Chip at={rel(at, 'sat')} dur={dur - rel(at, 'sat')} x={70} y={432} text="СИДЕЛ: 16 Ч" color={C.gold} fg={C.ink} size={18} />
    <Chip at={rel(at, 'real4')} dur={dur - rel(at, 'real4')} x={70} y={492} text="УЧИЛСЯ: ~4 Ч" color={C.mint} fg={C.ink} size={18} />
  </Sc>
))
// 13 that night the owl turned off his lamp
shot(T.owl, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="owl_lamp" zoom={[1.0, 1.08]} swaps={[['owl_dark', Math.min(1.0, dur - 0.4), dur]]}
    world={[<Zzz at={0} dur={dur} x={420} y={730} />]}>
  </Sc>
))
// 14 the new rule
shot(T.rule2, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="fresh" zoom={[1.0, 1.06]} swaps={blinks('fresh_b', [2.0])}>
    {hud('ДЕНЬ 31', 4)}{st(rel(at, 'sleep8'), '480', '5.0', '5 Ч')}{st(dur, '480', '5.0', '8 Ч', rel(at, 'sleep8'), [[2, 0]])}
    <PowerUp at={0.1} dur={dur - 0.1} icon="book" title="НОВОЕ ПРАВИЛО" sub="8 ЧАСОВ, НЕ БОЛЬШЕ" y={292} tab="ОТ СОВЫ" />
    <Chip at={rel(at, 'blocks')} dur={dur - rel(at, 'blocks')} x={70} y={482} text="50 МИН + 10 ОТДЫХ" color={C.mint} fg={C.ink} size={16} />
    <Chip at={rel(at, 'sleep8')} dur={dur - rel(at, 'sleep8')} x={70} y={538} text="СОН: 8 Ч" color={C.navy3} size={16} />
    <Chip at={rel(at, 'walk')} dur={dur - rel(at, 'walk')} x={70} y={594} text="ПРОГУЛКА КАЖДЫЙ ДЕНЬ" color={C.gold} fg={C.ink} size={16} />
  </Sc>
))
// 15 days 40 and 50: walks, focus, the score climbs faster
shot(T.d40, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="street" zoom={[1.0, 1.06]} swaps={every('street_b', dur, 0.6, 0.3, 0.3)}>
    {hud('ДЕНЬ 40', 4)}{st(dur, '560', '6.5', '8 Ч', 0.4, [[1, 0], [0, 0]])}{st(0.4, '480', '5.0', '8 Ч')}
    <BigTitle at={0.05} dur={dur - 0.05} y={256} text="ДЕНЬ 40" size={52} />
    <Chip at={0.6} dur={dur - 0.6} x={70} y={340} text="MOCK 6.5" color={C.mint} fg={C.ink} size={22} />
  </Sc>
))
shot(T.d50, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="focus" zoom={[1.0, 1.06]} swaps={blinks('focus_b', [1.6])}>
    {hud('ДЕНЬ 50', 5)}{st(dur, '640', '7.5', '8 Ч', 0.3, [[1, 0], [0, 0]])}{st(0.3, '560', '6.5', '8 Ч')}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'half') - 0.05)} y={256} text="ДЕНЬ 50" size={52} />
    <Chip at={0.5} dur={dur - 0.5} x={70} y={340} text="MOCK 7.5" color={C.mint} fg={C.ink} size={22} />
    <Chip at={rel(at, 'half')} dur={dur - rel(at, 'half')} x={70} y={406} text="ЧАСОВ В 2 РАЗА МЕНЬШЕ" color={C.gold} fg={C.ink} size={16} />
    <Chip at={rel(at, 'half') + 1.0} dur={dur - rel(at, 'half') - 1.0} x={70} y={464} text="БАЛЛ РАСТЁТ БЫСТРЕЕ" color={C.mint} fg={C.ink} size={16} />
  </Sc>
))
// 16 day 60: the exam
shot(T.d60, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="hall" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 60', 5)}{st(dur, '720', '7.5', '8 Ч')}
    <BigTitle at={0.05} dur={dur - 0.05} y={272} text="ДЕНЬ 60" size={52} />
    <Chip at={rel(at, 'examw')} dur={dur - rel(at, 'examw')} x={70} y={372} text="ЭКЗАМЕН" color={C.red} size={22} />
  </Sc>
))
const SE = splitAt('exam', /time/i)
shot(T.exam - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examA" zoom={[1.0, 1.05]} swaps={talk('examA_talk', 0.15, dur - 0.2)}>
    <Say at={0.1} dur={dur - 0.1} y={300} en="Tell me about something you enjoy doing in your free time." ru="«Расскажите, чем вам нравится заниматься в свободное время.»" name="EXAMINER" tab={C.grey2} tail="center" />
  </Sc>
))
shot(SE, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_talk" zoom={[1.03, 1.1]} swaps={every('examB_calm', dur, 0.5, 0.25, 0.3)}>
    <Say at={0.05} dur={dur - 0.05} y={290} en="Actually, I've recently got into long walks. It sounds simple, but it really clears my head." ru="«Вообще-то я недавно полюбил долгие прогулки. Звучит просто, но реально прочищает голову.»" name="ТИМУР" tab={C.red} tail="center" />
  </Sc>
))
// 17 results: 5.0 everywhere -> 8.0 overall
shot(T.result, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="sky" zoom={[1.0, 1.04]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={200} text="РЕЗУЛЬТАТ" size={40} />
    <Scores5 at={0.2} dur={dur - 0.2} rows={[['LISTENING', 5.0, 8.5, C.blue3], ['READING', 5.0, 8.5, C.yellow], ['WRITING', 5.0, 7.0, C.mint], ['SPEAKING', 5.0, 8.0, '#f08a9a']]}
      times={[rel(at, 'rL') - 0.2, rel(at, 'rR') - 0.2, rel(at, 'rW') - 0.2, rel(at, 'rS') - 0.2]} />
    <Layer at={rel(at, 'overall')} dur={dur - rel(at, 'overall')} centre animate={popScale(0.35)}>{box(170, 708, 380, 110, C.yellow, C.navy1)}{Tx(190, 748, 200, 22, C.white, 'ОБЩИЙ')}{Tx(360, 734, 170, 52, C.yellow, '8.0', 'right')}</Layer>
  </Sc>
))
// 18 the moral
shot(T.moral, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="end" zoom={[1.0, 1.06]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={252} text="НЕ ЧАСЫ, А КАЧЕСТВО" size={24} />
    <Layer at={rel(at, 'notsit')} dur={dur - rel(at, 'notsit')} centre animate={popScale(0.3)}>
      {box(70, 330, 380, 124, C.mint, C.navy1)}{Tx(88, 352, 344, 16, C.white, 'НЕ СКОЛЬКО СИДИШЬ,')}{Tx(88, 394, 344, 16, C.mintL, 'А СКОЛЬКО УЧИШЬСЯ')}
    </Layer>
    <Chip at={rel(at, 'rest2')} dur={dur - rel(at, 'rest2')} x={70} y={488} text="ОТДЫХ = ПОДГОТОВКА" color={C.gold} fg={C.ink} size={18} />
  </Sc>
))
// 19 call to action: the owl checks
shot(T.cta, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="owl_open" zoom={[1.0, 1.1]} swaps={[['owl_wink', rel(at, 'check') + 0.5, dur]]}>
    <BigTitle at={0.1} dur={dur - 0.1} y={250} text="СКОЛЬКО ЧАСОВ" size={32} />
    <BigTitle at={0.4} dur={dur - 0.4} y={320} text="В ДЕНЬ?" size={32} color={C.white} under={C.blue2} />
    <Chip at={rel(at, 'comments')} dur={dur - rel(at, 'comments')} x={110} y={420} text="ПИШИ В КОММЕНТАХ" color={C.mint} fg={C.ink} size={20} />
  </Sc>
))
