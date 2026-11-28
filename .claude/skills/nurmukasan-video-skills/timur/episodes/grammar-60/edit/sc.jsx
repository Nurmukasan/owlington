import { W, H, C, P, FONT, IMG, Layer, Scene, blinks, every, popScale, popSlide, PText } from './lib.jsx'
import { Chip, BigTitle } from './ui.jsx'
import { Glitch, box, T as Tx } from './ui3.jsx'
import { Hud5, HookTitle, Counter, Say, Scores5, Zzz, RuleCard } from './ui6.jsx'
import { T, D } from './times.jsx'

// Layout rules (same as hours-16): overlays inside x 56-664, below the HUD (y > 240), above every face, never on the owl
// (room plates: keep x 460-570 / y 320-490 free -> cards stay on the left column x 70-450), captions centred at y 872.
const rel = (at, k) => Math.max(0.05, T[k] - at)
const hud = (v, dots = 0) => Hud5({ value: v, dots, title: 'ГРАММАТИКА' })
// top-right panel: exercises done, mock, sentences said out loud (stays 0 until the owl's advice)
const St = ({ at = 0, dur, ex, mock, aloud = '0', flash = [] }) => {
  const x = 404, y = 128, w = 236, h = 92
  const row = (i, label, v, col) => [Tx(x + 14, y + 10 + i * 27, 120, 13, C.grey3, label), Tx(x + 100, y + 6 + i * 27, 122, 20, col, v, 'right')]
  const mc = parseFloat(mock) >= 6 ? C.yellow : C.gold
  return (
    <Layer at={at} dur={Math.max(0.05, dur - at)}>
      {box(x, y, w, h, C.mint, C.navy1)}
      {row(0, 'УПР.', ex, C.yellow)}{row(1, 'МОК', mock, mc)}{row(2, 'ВСЛУХ', aloud, aloud === '0' ? C.red : C.mintL)}
      {flash.map(([i, ft]) => (
        <Layer at={ft} dur={0.5} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.9 }, { at: 0.5, value: 0 }] }]}>
          <rect x={x} y={y + 4 + i * 27} width={w} height={26} fill={C.white} />
        </Layer>
      ))}
    </Layer>
  )
}
const st = (dur, ex, mock, at = 0, flash = [], aloud = '0') => <St at={at} dur={dur} ex={ex} mock={mock} aloud={aloud} flash={flash} />
const darken = (a = 0.5, t = 0.3) => <rect x={0} y={0} width={W} height={H} fill="#0b0c26" animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: t, value: a }] }]} />
// a paper result card on the left column (x 70-450) with a stamped mark on its right
const stamp = (dur, at, title, lines, mark, markAt, col = C.red, y = 300) => (
  <Layer at={at} dur={dur - at} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 700 }, { at: 0.35, value: 0, easing: 'ease-out' }] }]}>
    <rect x={70} y={y} width={380} height={200} fill={C.ink} /><rect x={76} y={y + 6} width={368} height={188} fill="#f4ead2" />
    <text x={96} y={y + 24} width={340} fontFamily={FONT} fontWeight={400} fontSize={15} color={C.ink}>{title}</text>
    {lines.map(([s, lt], i) => <Layer at={lt} dur={dur - at - lt}><text x={96} y={y + 66 + i * 28} width={200} fontFamily={FONT} fontWeight={400} fontSize={12} color="#5a4a3a">{s}</text></Layer>)}
    <Layer at={markAt} dur={dur - at - markAt} centre animate={[{ property: 'scale', keyframes: [{ at: 0, value: 2.4 }, { at: 0.15, value: 0.95 }, { at: 0.25, value: 1 }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.05, value: 1 }] }]}>
      <rect x={296} y={y + 62} width={134} height={100} fill="#00000000" strokeColor={col} strokeWidth={7} />
      <text x={296} y={y + 94} width={134} fontFamily={FONT} fontWeight={400} fontSize={mark.length > 3 ? 30 : 38} color={col} align="center">{mark}</text>
    </Layer>
  </Layer>
)
// a draining bar on its own panel at the left column (time to answer)
const Drain = ({ at, dur, drain = 3.0, label = 'ВРЕМЯ НА ОТВЕТ', y = 398 }) => (
  <Layer at={at} dur={dur} animate={popSlide()}>
    {box(70, y, 380, 84, C.red, C.navy1)}
    {Tx(88, y + 14, 344, 14, C.grey3, label)}
    <rect x={88} y={y + 42} width={344} height={26} fill="#26264f" />
    <rect x={88} y={y + 42} width={344} height={26} fill={C.gold} origin="top-left" animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: 1 }, { at: 0.2, value: 1 }, { at: drain, value: 0.0, easing: 'linear' }] }]} />
  </Layer>
)
// IELTS Writing/Speaking: four criteria, a quarter each — grammar lights up first, the other three on "Остальное"
const Criteria = ({ at, dur, restAt }) => {
  const R = [['ГРАММАТИКА', C.yellow, 0], ['СЛОВА', C.mintL, restAt], ['СВЯЗНОСТЬ', C.blue3, restAt + 0.35], ['БЕГЛОСТЬ', '#f08a9a', restAt + 0.7]]
  return (
    <Layer at={at} dur={dur} animate={popSlide()}>
      {box(70, 262, 380, 236, C.gold, C.navy1)}
      {Tx(70, 278, 380, 13, C.grey3, 'WRITING · SPEAKING', 'center')}
      {R.map(([name, col, t], i) => (
        <Layer at={Math.min(t, dur - 0.1)} dur={dur - Math.min(t, dur - 0.1)} centre animate={popScale(0.2)}>
          <rect x={88} y={306 + i * 46} width={344} height={38} fill={i === 0 ? '#3a3a10' : '#26264f'} />
          <rect x={88} y={306 + i * 46} width={8} height={38} fill={col} />
          {Tx(108, 318 + i * 46, 220, 14, col, name)}
          {Tx(330, 318 + i * 46, 90, 14, C.white, '25%', 'right')}
        </Layer>
      ))}
    </Layer>
  )
}
const talk = (k, from, to, period = 0.26, on = 0.13) => { const o = []; for (let t = from; t < to - 0.05; t += period) o.push([k, t, on]); return o }
const splitAt = (k, re) => { const w = D[k] || []; const i = w.findIndex((x, j) => j > 0 && re.test(w[j - 1][0])); return i > 0 ? w[i][1] - 0.08 : (T[k] + T[k + '_end']) / 2 }

// camera guard: keep the face bottom at y <= 800 (captions at 872) without showing the plate edge (face bottoms measured on the plates)
const FB = { hook: 815, fresh: 815, fire: 815, write: 815, happy: 815, explain: 815, d30: 815, dark: 815, end: 815, owl_open: 790, owl_wink: 790 }
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

// 01 hook — title, counter and voice from frame 0; the counter (40 exercises x day) speeds up and lands on the spoken "2400"
const ROLL_DAYS = [0, 1, 2, 3, 5, 7, 10, 14, 19, 25, 31, 38, 45, 52, 57, 60]
shot(0, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="hook" zoom={[1.2, 1.04]} swaps={blinks('hook_b', [1.3, 3.0])}>
    <Layer at={0} dur={dur}>{HookTitle({ y: 250, text: '60 ДНЕЙ', size: 60 })}{HookTitle({ y: 336, text: 'ТОЛЬКО ГРАММАТИКА', size: 30, color: C.white, under: C.blue2 })}</Layer>
    <Counter at={0.25} dur={dur - 0.25} times={T.roll.map((t) => Math.max(0, t - at - 0.25))} values={ROLL_DAYS.map((d) => String(d * 40))} y={412} x={210} label="УПРАЖНЕНИЙ" color={C.gold} fg={C.yellow} />
  </Sc>
))
// 02 universe #7: no series, no talking, only the grammar book
shot(T.u7, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="fresh" zoom={[1.0, 1.06]} swaps={blinks('fresh_b', [1.5, 3.4])}>
    <Glitch at={0} dur={0.35} />
    <Layer at={0.1} dur={dur - 0.1} animate={popSlide()}>{hud('ДЕНЬ 0')}</Layer>
    {st(dur, '0', '-', 0.1)}
    <Chip at={0.05} dur={dur - 0.05} x={70} y={262} text="ВСЕЛЕННАЯ #7" color={C.red} size={20} />
    <Chip at={rel(at, 'notone') + 0.5} dur={dur - rel(at, 'notone') - 0.5} x={70} y={336} text="БЕЗ СЕРИАЛОВ" color={C.grey2} size={16} />
    <Chip at={rel(at, 'notone') + 1.1} dur={dur - rel(at, 'notone') - 1.1} x={70} y={396} text="БЕЗ РАЗГОВОРОВ" color={C.grey2} size={16} />
    <BigTitle at={rel(at, 'book')} dur={dur - rel(at, 'book')} y={530} text="ТОЛЬКО УЧЕБНИК" size={36} />
  </Sc>
))
// 03 day 0: 5.0 everywhere; "it's all about mistakes"
shot(T.day0, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_um" zoom={[1.0, 1.06]} swaps={every('examB_blink', dur, 1.3, 0.14, 0.9)}>
    {hud('ДЕНЬ 0')}{st(rel(at, 'all5'), '0', '-')}{st(dur, '0', '5.0', rel(at, 'all5'), [[1, 0]])}
    <BigTitle at={0.05} dur={rel(at, 'mock0')} y={262} text="ДЕНЬ 0" size={56} />
    {stamp(dur, rel(at, 'mock0'), 'MOCK · ДЕНЬ 0', [['LISTENING 5.0', 'L0'], ['READING   5.0', 'R0'], ['WRITING   5.0', 'W0'], ['SPEAKING  5.0', 'S0']].map(([s, k]) => [s, Math.max(0.2, T[k] - T.mock0 - 0.05)]), '5.0', Math.max(0.8, rel(at, 'all5') - rel(at, 'mock0')), C.red, 330)}
    <Chip at={rel(at, 'errors')} dur={dur - rel(at, 'errors')} x={70} y={262} text="ВСЁ ДЕЛО В ОШИБКАХ?" color={C.gold} fg={C.ink} size={16} />
  </Sc>
))
// 04 the rule: 40 exercises a day, every mistake into the notebook
shot(T.rule, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="fire" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 1', 1)}{st(dur, '0', '5.0')}
    <RuleCard at={0.05} dur={dur - 0.05} title="ПРАВИЛО" sub="40 УПРАЖНЕНИЙ/ДЕНЬ" tab="БЕЗ ВЫХОДНЫХ" y={292} />
    <Chip at={rel(at, 'notebook')} dur={dur - rel(at, 'notebook')} x={70} y={446} text="ОШИБКА → В ТЕТРАДЬ" color={C.red} size={16} />
  </Sc>
))
// 05 week 1: all 12 tenses — Timur mumbles them (his own line)
shot(T.wk1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="write" zoom={[1.0, 1.08]} swaps={talk('write_t', rel(at, 'tenses') + 0.1, rel(at, 'tenses_end'), 0.24, 0.12).concat(talk('write_t2', rel(at, 'tenses') + 0.22, rel(at, 'tenses_end'), 0.48, 0.1))}>
    {hud('НЕДЕЛЯ 1', 1)}{st(dur, '280', '5.0', 0.4, [[0, 0]])}{st(0.4, '0', '5.0')}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 't12') - 0.05)} y={256} text="НЕДЕЛЯ 1" size={48} />
    <Counter at={rel(at, 't12')} dur={rel(at, 'tenses') - rel(at, 't12')} t1={0.8} values={['0', '4', '8', '12']} y={262} label="ВРЕМЁН" color={C.gold} fg={C.yellow} />
    <Say at={rel(at, 'tenses') + 0.05} dur={dur - rel(at, 'tenses') - 0.05} x={60} y={300} w={390} size={18} en="I have been... he has been... they had been... I will have been..." ru="" name="ТИМУР" tab={C.red} tail="right" />
  </Sc>
))
// 06 grammar test: 90%
shot(T.test90, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="happy" zoom={[1.0, 1.06]} swaps={blinks('happy_b', [1.2])}>
    {hud('НЕДЕЛЯ 1', 1)}{st(dur, '280', '5.0')}
    {stamp(dur, 0.05, 'КОНТРОЛЬНАЯ', [['ВРЕМЕНА: 12/12', 0.3], ['ОШИБОК: 2', 0.5]], '90%', Math.max(0.6, rel(at, 'p90')), '#2f8a4a')}
  </Sc>
))
// 07 week 2: articles, passive, conditionals
shot(T.wk2, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="write" zoom={[1.0, 1.06]}>
    {hud('НЕДЕЛЯ 2', 2)}{st(dur, '560', '5.0', 0.4, [[0, 0]])}{st(0.4, '280', '5.0')}
    <BigTitle at={0.05} dur={dur - 0.05} y={256} text="НЕДЕЛЯ 2" size={48} />
    <Chip at={rel(at, 'art')} dur={dur - rel(at, 'art')} x={70} y={336} text="A / AN / THE" color={C.blue2} size={16} />
    <Chip at={rel(at, 'passive')} dur={dur - rel(at, 'passive')} x={70} y={396} text="PASSIVE" color={C.mint} fg={C.ink} size={16} />
    <Chip at={rel(at, 'cond')} dur={dur - rel(at, 'cond')} x={70} y={456} text="IF I HAD..." color={C.gold} fg={C.ink} size={16} />
  </Sc>
))
// 08 he explains the third conditional to the owl — the owl falls asleep
shot(T.explain, ({ at, dur }) => {
  const z = rel(at, 'owlsleep')
  return (
    <Sc at={at} dur={dur} base="explain" zoom={[1.0, 1.05]} swaps={talk('explain_b', 0.1, z, 0.3, 0.14).concat([['explain_z', z - 0.15, dur]]).concat(talk('explain_zb', z, dur, 0.3, 0.14))}
      world={z + 0.2 < dur - 0.3 ? [<Zzz at={z + 0.2} dur={dur - z - 0.2} x={500} y={360} />] : []}>
      {hud('НЕДЕЛЯ 2', 2)}{st(dur, '560', '5.0')}
      <Say at={0.1} dur={dur - 0.1} x={60} y={300} w={390} size={18} en="If I had studied, I would have passed!" ru="«Если бы я учился, я бы сдал!»" name="3-Й ТИП" tab={C.gold} tail="right" />
    </Sc>
  )
})
// 09 day 30: 1200 exercises, mock writing 6.0, no tense mistakes
shot(T.d30, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="d30" zoom={[1.0, 1.06]} swaps={blinks('d30_b', [1.6, 4.2])}>
    {hud('ДЕНЬ 30', 3)}{st(rel(at, 'ex1200'), '560', '5.0')}{st(rel(at, 'w6'), '1200', '5.0', rel(at, 'ex1200'), [[0, 0]])}{st(dur, '1200', '5.5', rel(at, 'w6'), [[1, 0]])}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'ex1200') - 0.05)} y={256} text="ДЕНЬ 30" size={52} />
    <Counter at={rel(at, 'ex1200')} dur={rel(at, 'mockW') - rel(at, 'ex1200')} t1={0.8} values={['560', '800', '1000', '1200']} y={262} label="УПРАЖНЕНИЙ" color={C.gold} fg={C.yellow} />
    {stamp(dur, rel(at, 'mockW'), 'WRITING · MOCK', [['TASK 1 + TASK 2', 0.3]], '6.0', Math.max(0.5, rel(at, 'w6') - rel(at, 'mockW')), '#2f8a4a')}
    <Chip at={rel(at, 'noerr')} dur={dur - rel(at, 'noerr')} x={70} y={520} text="0 ОШИБОК ВО ВРЕМЕНАХ" color={C.mint} fg={C.ink} size={14} />
  </Sc>
))
// 10 then the mock speaking: the examiner asks, Timur freezes on every tense (their own lines)
shot(T.mockS, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examA" zoom={[1.0, 1.04]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={262} text="ПРОБНЫЙ SPEAKING" size={30} />
  </Sc>
))
const SS = splitAt('speak', /hometown/i)
shot(T.speak - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examA" zoom={[1.0, 1.05]} swaps={talk('examA_talk', 0.15, dur - 0.2)}>
    <Say at={0.1} dur={dur - 0.1} y={300} en="So, tell me about your hometown." ru="«Расскажите о своём родном городе.»" name="EXAMINER" tab={C.grey2} tail="center" />
  </Sc>
))
shot(SS, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_um" zoom={[1.02, 1.12]} swaps={every('examB_talk', dur, 1.4, 0.45, 0.2).concat(every('examB_blink', dur, 2.1, 0.14, 1.0))}>
    <Say at={0.05} dur={dur - 0.05} y={290} size={20} en="My hometown... is... was... has been... um... I have been living there... no... I had lived..." ru="«Мой родной город... есть... был... был... эм... я живу там... нет... я жил...»" name="ТИМУР" tab={C.red} tail="center" />
  </Sc>
))
// 11 he built every sentence like an exercise — and while he picked a tense, the time ran out
shot(T.built, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_um" zoom={[1.06, 1.14]} swaps={every('examB_blink', dur, 1.5, 0.14, 0.8)}>
    {['IS?', 'WAS?', 'HAS BEEN?', 'HAD LIVED?'].map((t, i) => (
      <Chip at={0.3 + i * 0.45} dur={dur - 0.3 - i * 0.45} x={i % 2 ? 300 : 70} y={262 + Math.floor(i / 2) * 64} text={t} color={C.navy3} size={16} />))}
    <Drain at={rel(at, 'choosing')} dur={dur - rel(at, 'choosing')} drain={Math.max(0.6, rel(at, 'timeout') - rel(at, 'choosing'))} />
    <Chip at={rel(at, 'timeout')} dur={dur - rel(at, 'timeout')} x={70} y={500} text="ВРЕМЯ ВЫШЛО" color={C.red} size={22} />
  </Sc>
))
// 12 twist: grammar is only a quarter of the Writing and Speaking score, not marked on its own in Listening/Reading
shot(T.twist, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="dark" zoom={[1.1, 1.18]} swaps={every('dark_b', dur, 1.8, 0.2, 1.2)}>
    <Glitch at={0} dur={0.3} />
    {darken(0.5, 0.3)}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'quarter') - 0.35)} y={252} text="ПОВОРОТ!" size={52} />
    <Criteria at={Math.max(0.3, rel(at, 'quarter') - 0.3)} dur={dur - Math.max(0.3, rel(at, 'quarter') - 0.3)} restAt={rel(at, 'rest') - Math.max(0.3, rel(at, 'quarter') - 0.3)} />
  </Sc>
))
shot(T.notLR, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="dark" zoom={[1.0, 1.06]} swaps={every('dark_b', dur, 1.6, 0.2, 0.9)}>
    {darken(0.35, 0.01)}
    <Chip at={0.2} dur={dur - 0.2} x={70} y={262} text="LISTENING" color={C.blue2} size={18} />
    <Chip at={0.5} dur={dur - 0.5} x={70} y={322} text="READING" color={C.gold} fg={C.ink} size={18} />
    <Chip at={1.2} dur={dur - 1.2} x={70} y={392} text="ГРАММАТИКУ НЕ ОЦЕНИВАЮТ" color={C.red} size={14} />
  </Sc>
))
// 13 grammar is the skeleton: the school skeleton keeps its mouth shut without words and practice
shot(T.skeleton, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="skel" zoom={[1.0, 1.06]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={226} text="ГРАММАТИКА = СКЕЛЕТ" size={26} />
    <Layer at={rel(at, 'nospeak') + 0.6} dur={dur - rel(at, 'nospeak') - 0.6} centre animate={popScale(0.2)}>
      {box(330, 400, 130, 64, C.white, C.white)}<rect x={420} y={464} width={22} height={18} fill={C.white} />
      {Tx(330, 420, 130, 22, C.ink, '...', 'center')}
    </Layer>
    <Chip at={rel(at, 'nospeak') + 0.2} dur={dur - rel(at, 'nospeak') - 0.2} x={70} y={560} text="+ СЛОВА" color={C.mint} fg={C.ink} size={16} />
    <Chip at={rel(at, 'nospeak') + 0.8} dur={dur - rel(at, 'nospeak') - 0.8} x={70} y={620} text="+ ПРАКТИКА" color={C.gold} fg={C.ink} size={16} />
  </Sc>
))
// 14 day 60: the exam
shot(T.d60, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="hall" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 60', 5)}{st(dur, '2400', '5.5', 0.9, [[0, 0]])}{st(0.9, '1200', '5.5')}
    <BigTitle at={0.05} dur={dur - 0.05} y={272} text="ДЕНЬ 60" size={52} />
    <Chip at={0.9} dur={dur - 0.9} x={70} y={364} text="2400 УПРАЖНЕНИЙ" color={C.gold} fg={C.ink} size={18} />
    <Chip at={rel(at, 'examw')} dur={dur - rel(at, 'examw')} x={70} y={428} text="ЭКЗАМЕН" color={C.red} size={22} />
  </Sc>
))
// 15 results in the order they are read: W 6.5, R 5.5, L 5.0, S 5.0 -> overall 5.5 (mean 5.5)
shot(T.result, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="sky" zoom={[1.0, 1.04]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={200} text="РЕЗУЛЬТАТ" size={40} />
    <Scores5 at={0.2} dur={dur - 0.2} rows={[['WRITING', 5.0, 6.5, C.mint], ['READING', 5.0, 5.5, C.yellow], ['LISTENING', 5.0, 5.0, C.blue3], ['SPEAKING', 5.0, 5.0, '#f08a9a']]}
      times={[rel(at, 'rW') - 0.2, rel(at, 'rR') - 0.2, rel(at, 'rL') - 0.2, rel(at, 'rS') - 0.2]} />
    <Layer at={rel(at, 'overall')} dur={dur - rel(at, 'overall')} centre animate={popScale(0.35)}>{box(170, 708, 380, 110, C.gold, C.navy1)}{Tx(190, 748, 200, 22, C.white, 'ОБЩИЙ')}{Tx(360, 734, 170, 52, C.gold, '5.5', 'right')}</Layer>
  </Sc>
))
// 16 the moral: a tool, not the goal
shot(T.tool, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="end" zoom={[1.0, 1.06]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={252} text="ИНСТРУМЕНТ," size={36} />
    <BigTitle at={rel(at, 'notgoal') + 0.4} dur={dur - rel(at, 'notgoal') - 0.4} y={318} text="А НЕ ЦЕЛЬ" size={36} color={C.white} under={C.blue2} />
  </Sc>
))
// 17 how: 20 min of rules, then use it at once — said aloud, in the essay, found in a text
shot(T.min20, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="d30" zoom={[1.0, 1.06]} swaps={blinks('d30_b', [2.2, 5.0])}>
    {hud('СОВЕТ СОВЫ', 5)}{st(rel(at, 'aloud'), '2400', '5.5')}{st(dur, '2400', '5.5', rel(at, 'aloud'), [[2, 0]], '3')}
    <RuleCard at={0.05} dur={dur - 0.05} title="20 МИНУТ" sub="ПРАВИЛ В ДЕНЬ" tab="ОТ СОВЫ" y={292} color={C.mintL} />
    <Chip at={rel(at, 'aloud')} dur={dur - rel(at, 'aloud')} x={70} y={446} text="3 ФРАЗЫ ВСЛУХ" color={C.mint} fg={C.ink} size={16} />
    <Chip at={rel(at, 'essay')} dur={dur - rel(at, 'essay')} x={70} y={502} text="В ЭССЕ" color={C.gold} fg={C.ink} size={16} />
    <Chip at={rel(at, 'text')} dur={dur - rel(at, 'text')} x={70} y={558} text="НАЙДИ В ТЕКСТЕ" color={C.blue2} size={16} />
  </Sc>
))
// 18 call to action: the owl checks
shot(T.cta, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="owl_open" zoom={[1.0, 1.1]} swaps={[['owl_wink', rel(at, 'check') + 0.5, dur]]}>
    <BigTitle at={0.1} dur={dur - 0.1} y={250} text="УЧИШЬ" size={36} />
    <BigTitle at={0.5} dur={dur - 0.5} y={320} text="ИЛИ ИСПОЛЬЗУЕШЬ?" size={28} color={C.white} under={C.blue2} />
    <Chip at={rel(at, 'comments')} dur={dur - rel(at, 'comments')} x={110} y={420} text="ПИШИ В КОММЕНТАХ" color={C.mint} fg={C.ink} size={20} />
  </Sc>
))
