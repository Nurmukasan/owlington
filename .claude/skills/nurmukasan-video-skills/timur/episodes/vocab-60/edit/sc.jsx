import { W, H, C, P, FONT, IMG, Layer, Scene, blinks, every, popScale, popSlide, PText } from './lib.jsx'
import { PowerUp, Chip, BigTitle, Steps } from './ui.jsx'
import { Glitch, Message, box, T as Tx } from './ui3.jsx'
import { Hud5, Stats5, HookTitle, Flash, Curve, Bricks, KnownWord, Say, Scores5 } from './ui5.jsx'
import { T, D } from './times.jsx'

// Layout rule for every shot: overlays stay inside x 56-664, below the HUD (y > 240) and above the faces.
// Faces (720x1280, zoom 1): room/call Timur x 280-440 y 690-830; mirror y 590-715; exam y 680-760; Jake y 430-650.
const rel = (at, k) => Math.max(0.05, T[k] - at)
const hud = (v, dots = 0) => Hud5({ value: v, dots })
const st = (dur, words, mem, at = 0, flash = []) => <Stats5 at={at} dur={dur - at} words={words} mem={mem} flash={flash} />
const darken = (a = 0.5, t = 0.3) => <rect x={0} y={0} width={W} height={H} fill="#0b0c26" animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: t, value: a }] }]} />
const stamp = (dur, at, title, lines, mark, markAt, col = C.red) => (
  <Layer at={at} dur={dur - at} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 700 }, { at: 0.35, value: 0, easing: 'ease-out' }] }]}>
    <rect x={130} y={330} width={460} height={220} fill={C.ink} /><rect x={136} y={336} width={448} height={208} fill="#f4ead2" />
    <text x={160} y={356} width={400} fontFamily={FONT} fontWeight={400} fontSize={18} color={C.ink}>{title}</text>
    {lines.map(([s, lt], i) => <Layer at={lt} dur={dur - at - lt}><text x={160} y={410 + i * 40} width={260} fontFamily={FONT} fontWeight={400} fontSize={15} color="#5a4a3a">{s}</text></Layer>)}
    <Layer at={markAt} dur={dur - at - markAt} centre animate={[{ property: 'scale', keyframes: [{ at: 0, value: 2.4 }, { at: 0.15, value: 0.95 }, { at: 0.25, value: 1 }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.05, value: 1 }] }]}>
      <rect x={416} y={382} width={160} height={116} fill="#00000000" strokeColor={col} strokeWidth={8} />
      <text x={416} y={410} width={160} fontFamily={FONT} fontWeight={400} fontSize={44} color={col} align="center">{mark}</text>
    </Layer>
  </Layer>
)
// cards that fly away from his head, left of the owl and above his hair (never across a face)
const flyAway = (at, dur, words) => words.map((w, i) => {
  const x = i % 2 === 0 ? 70 : 250, y = 600 - (i >> 1) * 40, d = Math.min(1.4, dur - i * 0.25)
  if (d < 0.3) return null
  return (
    <Layer at={at + i * 0.25} dur={d} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 0 }, { at: d, value: -200 }] }, { property: 'offsetX', keyframes: [{ at: 0, value: 0 }, { at: d, value: i % 2 === 0 ? -20 : 20 }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.1, value: 1 }, { at: d * 0.7, value: 1 }, { at: d, value: 0 }] }]}>
      <rect x={x - 4} y={y - 4} width={168} height={58} fill={C.ink} /><rect x={x} y={y} width={160} height={50} fill={['#fff3b0', '#d8ecff', '#ffd8e0', '#d8f5dc', '#fbf7ec'][i % 5]} />
      {Tx(x, y + 18, 160, w.length > 8 ? 11 : 14, C.ink, w, 'center')}
    </Layer>
  )
})
// falling cards for the cold open, in the side columns only
const rain = (dur) => Array.from({ length: 12 }, (_, i) => {
  const x = i % 2 ? 60 + (i % 3) * 50 : 500 + (i % 3) * 40, a = (i * 0.37) % 2.6, d = 1.6
  if (a + 0.2 > dur) return null
  return (
    <Layer at={a} dur={Math.min(d, dur - a)} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: -120 }, { at: d, value: 700 }] }]}>
      <rect x={x - 3} y={250} width={66} height={44} fill={C.ink} /><rect x={x} y={253} width={60} height={38} fill={['#fff3b0', '#d8ecff', '#ffd8e0', '#d8f5dc', '#fbf7ec'][i % 5]} />
      <rect x={x + 8} y={264} width={44} height={4} fill="#6a6070" /><rect x={x + 8} y={274} width={30} height={4} fill="#a89aa0" />
    </Layer>
  )
})

// camera guard: keep the face bottom at y <= 800 (caption at 872) without showing the plate edge — face bottoms measured on the plates
const FB = { room: 815, max: 815, wall: 815, pile: 815, kitchen: 875, klass: 836, call: 775, owl: 790 }
const Sc = ({ base, zoom = [1, 1.06], panY, ...o }) => {
  const fb = FB[base.split('_')[0]]
  if (!fb || panY) return Scene({ base, zoom, panY, ...o })
  const zmin = 480 / (1280 - fb) + 0.005
  const z = zoom.map((v) => Math.max(v, zmin))
  return Scene({ base, zoom: z, panY: z.map((v) => Math.min(0, 160 - v * (fb - 640))), ...o })
}

// --- shots ---------------------------------------------------------------
export const SHOTS = []
const shot = (t, fn) => SHOTS.push([t > 0 ? t - 0.08 : 0, fn])

// 01 cold open — the title and the voice are there on frame 0
shot(0, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="max" zoom={[1.22, 1.04]} swaps={blinks('max_b', [1.2, 3.1])}>
    {rain(dur)}
    <Layer at={0} dur={dur}>{HookTitle({ y: 250, text: '60 ДНЕЙ', size: 64 })}{HookTitle({ y: 340, text: 'ТОЛЬКО СЛОВА', size: 38, color: C.white, under: C.blue2 })}</Layer>
    <Steps at={0.35} dur={dur - 0.35} t1={Math.max(0.6, dur - 0.6)} values={['50', '400', '900', '1500', '2200', '3000']} x={0} y={440} size={52} color={C.yellow} />
    <Layer at={0.35} dur={dur - 0.35}>{Tx(0, 512, W, 18, C.white, 'СЛОВ', 'center')}</Layer>
  </Sc>
))
// 02 universe #5: no books, no talking, only flashcards
shot(T.u5, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="room_open" zoom={[1.0, 1.08]} swaps={blinks('room_b', [1.4])}>
    <Glitch at={0} dur={0.35} />
    <Layer at={0.1} dur={dur - 0.1} animate={popSlide()}>{hud('ДЕНЬ 0')}</Layer>
    {st(dur, '0', '-', 0.1)}
    <Chip at={0.05} dur={dur - 0.05} x={70} y={260} text="ВСЕЛЕННАЯ #5" color={C.red} size={20} />
    {[['КНИГИ ×', 70], ['РАЗГОВОРЫ ×', 236]].map(([t, x], i) => <Chip at={rel(at, 'nobooks') + 0.4 + i * 0.5} dur={dur - rel(at, 'nobooks') - 0.4 - i * 0.5} x={x} y={330} text={t} color={C.grey2} size={16} />)}
    <BigTitle at={rel(at, 'onlycards')} dur={dur - rel(at, 'onlycards')} y={530} text="ТОЛЬКО КАРТОЧКИ" size={32} />
  </Sc>
))
// 03 day 0: mock speaking, 5.0
shot(T.day0, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_um" zoom={[1.0, 1.06]} swaps={every('examB_blink', dur, 1.3, 0.14, 0.9)}>
    {hud('ДЕНЬ 0')}{st(dur, '0', '-')}
    <BigTitle at={0.05} dur={rel(at, 'probe')} y={260} text="ДЕНЬ 0" size={56} />
    {stamp(dur, rel(at, 'probe'), 'MOCK · SPEAKING', [['ПАУЗЫ: 14', 0.25], ['«ЭЭЭ...»: 22', 0.45]], '5.0', Math.max(0.5, rel(at, 's5') - rel(at, 'probe')))}
    <Chip at={rel(at, 'decided')} dur={dur - rel(at, 'decided')} x={150} y={580} text="НЕ ХВАТАЕТ СЛОВ?" color={C.gold} fg={C.ink} size={20} />
  </Sc>
))
// 04 the rule: 50 new words a day
shot(T.rule, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="room_open" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 1', 1)}{st(dur, '0', '-')}
    <PowerUp at={0.1} dur={dur - 0.1} icon="book" title="ПРАВИЛО" sub="50 СЛОВ В ДЕНЬ" y={300} tab="КАЖДЫЙ ДЕНЬ" />
    <Chip at={rel(at, 'nomiss')} dur={dur - rel(at, 'nomiss')} x={160} y={510} text="БЕЗ ПРОПУСКОВ" color={C.red} size={22} />
  </Sc>
))
// 05 day 1: the flashcard mumble, all 50 in two hours
const EN = [['ABANDON', 'БРОСАТЬ'], ['ABILITY', 'СПОСОБНОСТЬ'], ['ABSOLUTELY', 'АБСОЛЮТНО'], ['ABUNDANT', 'ОБИЛЬНЫЙ'], ['ACCOMPLISH', 'ДОСТИГАТЬ']]
shot(T.day1, ({ at, dur }) => {
  const ws = D.words || [], cs = ['#fff3b0', '#d8ecff', '#ffd8e0', '#d8f5dc', '#fbf7ec']
  return (
    <Sc at={at} dur={dur} base="room" zoom={[1.0, 1.1]} swaps={every('room_b', dur, 1.6, 0.14, 1.2)}>
      {hud('ДЕНЬ 1', 1)}
      {st(rel(at, 'twoh'), '0', '-')}{st(dur, '50', '100%', rel(at, 'twoh'), [[0, 0], [1, 0]])}
      <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'words') - 0.05)} y={250} text="ДЕНЬ 1" size={56} />
      {EN.map(([en, ru], i) => {
        const t0 = ws[i] ? ws[i][1] - at - 0.05 : rel(at, 'words') + i * 0.9
        const t1 = i + 1 < EN.length ? (ws[i + 1] ? ws[i + 1][1] - at - 0.05 : t0 + 0.9) : rel(at, 'twoh')
        return <Flash at={t0} dur={Math.max(0.2, t1 - t0)} en={en} ru={ru} y={300} col={cs[i]} />
      })}
      <Chip at={rel(at, 'twoh')} dur={dur - rel(at, 'twoh')} x={70} y={270} text="2 ЧАСА" color={C.navy3} size={20} />
      <Steps at={rel(at, 'twoh')} dur={dur - rel(at, 'twoh')} t1={rel(at, 'twoh') + 1.0} values={['10/50', '30/50', '50/50']} x={56} w={400} y={360} size={48} color={C.mintL} />
    </Sc>
  )
})
// 06 next morning: half of it is gone
shot(T.morning, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="room_wide" zoom={[1.08, 1.18]} panY={[0, -20]} swaps={[['room_wide2', dur * 0.6, dur]]}>
    {hud('ДЕНЬ 2', 1)}{st(dur, '50', '50%', 0, [[1, 0.6]])}
    <Chip at={0.05} dur={dur - 0.05} x={70} y={250} text="УТРО" color={C.gold} fg={C.ink} size={22} />
    {flyAway(0.3, dur - 0.3, ['ABANDON', 'ABUNDANT', 'ABILITY', 'ACCOMPLISH'])}
    <Steps at={0.6} dur={dur - 0.6} t1={Math.max(0.8, dur - 0.5)} values={['50', '41', '33', '25']} x={200} w={240} y={250} size={56} color={C.red} />
  </Sc>
))
// 07 twist: the forgetting curve
shot(T.twist, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="room_wide2" zoom={[1.15, 1.25]}>
    <Glitch at={0} dur={0.3} />
    {darken(0.6, 0.3)}
    <BigTitle at={0.05} dur={dur - 0.05} y={250} text="ПОВОРОТ!" size={52} />
    <Curve at={Math.max(0.4, rel(at, 'brainf') - 0.1)} dur={dur - Math.max(0.4, rel(at, 'brainf') - 0.1)} t0={0.2} span={1.4} titleAt={Math.max(0.1, rel(at, 'curve') - Math.max(0.4, rel(at, 'brainf') - 0.1))} labelAt={1.7} />
  </Sc>
))
// 08 new rule: spaced repetition
shot(T.rule2, ({ at, dur }) => {
  const c0 = 0.9
  return (
    <Sc at={at} dur={dur} base="room_open" zoom={[1.0, 1.06]}>
      {hud('НЕДЕЛЯ 1', 1)}{st(dur, '350', '80%', rel(at, 'nextweek'), [[1, 0]])}{st(rel(at, 'nextweek'), '350', '50%')}
      <Layer at={0.05} dur={c0} animate={popSlide()}>{box(110, 270, 500, 70, C.yellow, C.navy1)}{Tx(110, 294, 500, 20, C.yellow, 'НОВОЕ ПРАВИЛО', 'center')}</Layer>
      <Curve at={c0} dur={dur - c0} spaced={true} t0={0.1} span={Math.max(1.0, rel(at, 'nextweek') - c0)} title="ПОВТОРЫ ПО ГРАФИКУ" label="ПОМНИТ: 80%" labelAt={Math.max(0.3, rel(at, 'nextweek') - c0 + 0.5)}
        marks={[['СЕГОДНЯ', rel(at, 'today') - c0, 0], ['+1 ДЕНЬ', rel(at, 'nextday') - c0, 3], ['+7 ДНЕЙ', rel(at, 'nextweek') - c0, 20]]} />
    </Sc>
  )
})
shot(T.owlw, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="owl_open" zoom={[1.0, 1.08]} swaps={blinks('owl_wink', [dur * 0.55])}>
    <Chip at={0.05} dur={dur - 0.05} x={150} y={300} text="СОВА СЛЕДИТ" color={C.yellow} fg={C.ink} size={24} />
  </Sc>
))
// 09 week 2: cards everywhere — the fridge, the mirror... the owl
shot(T.week2, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="wall" zoom={[1.0, 1.08]} swaps={every('wall_b', dur, 1.2, 0.14, 0.8)}>
    {hud('НЕДЕЛЯ 2', 2)}{st(dur, '700', '80%')}
    <BigTitle at={0.05} dur={dur - 0.05} y={250} text="НЕДЕЛЯ 2" size={48} />
    <Chip at={0.6} dur={dur - 0.6} x={70} y={330} text="КАРТОЧКИ ВЕЗДЕ" color={C.red} size={22} />
  </Sc>
))
shot(T.fridge - 0.1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="kitchen" zoom={[1.0, 1.1]}>
    {hud('НЕДЕЛЯ 2', 2)}
    <Chip at={0.05} dur={dur - 0.05} x={70} y={270} text="ХОЛОДИЛЬНИК" color={C.blue2} size={20} />
  </Sc>
))
shot(T.mirrorw - 0.1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="mirror" zoom={[1.0, 1.08]}>
    {hud('НЕДЕЛЯ 2', 2)}
    <Chip at={0.05} dur={dur - 0.05} x={70} y={270} text="ЗЕРКАЛО" color={C.mint} fg={C.ink} size={20} />
  </Sc>
))
shot(T.onowl - 0.15, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="owl_card" zoom={[1.05, 1.15]}>
    <Chip at={0.05} dur={dur - 0.05} x={190} y={300} text="...НА СОВЕ" color={C.red} size={22} />
  </Sc>
))
// 10 day 30: 1500 words, words even the teacher doesn't know
shot(T.day30, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="pile" zoom={[1.0, 1.08]} swaps={every('pile_b', dur, 1.3, 0.14, 0.9)}>
    {hud('ДЕНЬ 30', 3)}{st(dur, '1500', '85%', 0, [[0, 0.1]])}
    <BigTitle at={0.05} dur={dur - 0.05} y={250} text="ДЕНЬ 30" size={52} />
    <Steps at={0.6} dur={dur - 0.6} t1={Math.max(0.8, rel(at, 'w1500') + 0.5)} values={['700', '1000', '1300', '1500']} x={56} w={400} y={340} size={52} color={C.yellow} />
    <Layer at={0.6} dur={dur - 0.6}>{Tx(56, 410, 400, 18, C.white, 'СЛОВ', 'center')}</Layer>
  </Sc>
))
shot(T.teacher, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="klass" zoom={[1.0, 1.06]} swaps={[['klass_o', Math.min(dur - 0.3, 2.2), dur]]}>
    {hud('ДЕНЬ 30', 3)}
    {[['UBIQUITOUS', 0.3], ['SERENDIPITY', 0.9], ['QUINTESSENTIAL', 1.5]].map(([w, t], i) => (
      <Layer at={t} dur={dur - t} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.15, value: 1 }] }]}>{Tx(70, 270 + i * 66, 580, 28, '#e8e0c8', w, 'center')}</Layer>
    ))}
    <Chip at={Math.min(dur - 0.3, 2.2)} dur={dur - Math.min(dur - 0.3, 2.2)} x={70} y={540} text="УЧИТЕЛЬ: ???" color={C.gold} fg={C.ink} size={20} />
  </Sc>
))
// 11 day 45: Jake calls
shot(T.day45, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="call" zoom={[1.0, 1.06]} swaps={blinks('call_blink', [1.0])}>
    {hud('ДЕНЬ 45', 4)}{st(dur, '2250', '90%')}
    <BigTitle at={0.05} dur={dur - 0.05} y={250} text="ДЕНЬ 45" size={52} />
    <Message at={rel(at, 'callw')} dur={dur - rel(at, 'callw')} from="JAKE · МАНЧЕСТЕР" text="Входящий видеозвонок..." y={360} />
  </Sc>
))
const splitAt = (k, re) => { const w = D[k] || []; const i = w.findIndex((x, j) => j > 0 && re.test(w[j - 1][0])); return i > 0 ? w[i][1] - 0.08 : (T[k] + T[k + '_end']) / 2 }
const SJ = splitAt('jake', /weekend/i), SE = splitAt('exam', /visit/i)
const talk = (k, from, to, period = 0.26, on = 0.13) => { const o = []; for (let t = from; t < to - 0.05; t += period) o.push([k, t, on]); return o }
shot(T.jake - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="screen" zoom={[1.0, 1.05]} swaps={talk('screen_talk', 0.15, dur - 0.3)}>
    <Say at={0.1} dur={dur - 0.1} y={790} en="Alright mate! So what did you do last weekend?" ru="«Здорово, бро! Чем занимался на выходных?»" name="JAKE" tab="#3f7a5a" tail="up" />
  </Sc>
))
shot(SJ, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="call_um" zoom={[1.05, 1.12]} swaps={every('call_um2', dur, 0.9, 0.4, 0.5)}>
    <Say at={0.05} dur={dur - 0.05} y={250} w={390} en="I... weekend... I go... ubiquitous...?" ru="«Я... выходные... я идти... вездесущий...?»" name="ТИМУР" tab={C.red} />
  </Sc>
))
// 12 he knew every word of the question — and couldn't answer
const QW = [['WHAT', 70, 240], ['DID', 280, 240], ['YOU', 70, 320], ['DO', 280, 320], ['LAST', 70, 400], ['WEEKEND', 240, 400]]
shot(T.knew, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="call_um2" zoom={[1.12, 1.2]} panY={[-30, -50]}>
    {st(dur, '2250', '90%', 0, [[2, rel(at, 'couldnt')]])}
    {QW.map(([w, x, y], i) => <KnownWord at={0.1 + i * 0.3} dur={dur - 0.1 - i * 0.3} x={x} y={y} text={w} />)}
    <Layer at={rel(at, 'couldnt')} dur={dur - rel(at, 'couldnt')} centre animate={popScale(0.3)}>{box(110, 510, 500, 90, C.red, C.navy1)}{Tx(110, 530, 500, 16, C.grey3, 'ОТВЕТ', 'center')}{Tx(110, 560, 500, 24, C.red, '...', 'center')}</Layer>
  </Sc>
))
// 13 words are bricks, speech is a house
shot(T.bricks, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="sky" zoom={[1.0, 1.04]}>
    <BigTitle at={0.05} dur={rel(at, 'house')} y={260} text="СЛОВА = КИРПИЧИ" size={30} />
    <BigTitle at={rel(at, 'house')} dur={rel(at, 'without') - rel(at, 'house')} y={260} text="РЕЧЬ = ДОМ" size={36} color={C.mintL} under={C.blue2} />
    <Bricks at={0.2} dur={dur - 0.2} tHouse={rel(at, 'house') - 0.2} tHeap={rel(at, 'without') + 0.6} />
    <Layer at={rel(at, 'house') + 1.0} dur={rel(at, 'without') - rel(at, 'house') - 0.4}>{Tx(56, 716, 608, 14, '#d4cede', 'РАСТВОР = ГРАММАТИКА · СВЕТ = ПРАКТИКА', 'center')}</Layer>
    <Chip at={rel(at, 'without') + 0.7} dur={dur - rel(at, 'without') - 0.7} x={70} y={350} text="ГРАММАТИКА ×" color={C.red} size={18} />
    <Chip at={rel(at, 'without') + 1.1} dur={dur - rel(at, 'without') - 1.1} x={330} y={350} text="ПРАКТИКА ×" color={C.red} size={18} />
  </Sc>
))
// 14 day 60: 3000 words, the exam
shot(T.day60, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="hall" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 60', 5)}{st(dur, '3000', '90%', 0, [[0, rel(at, 'w3000')]])}
    <BigTitle at={0.05} dur={dur - 0.05} y={270} text="ДЕНЬ 60" size={52} />
    <Chip at={rel(at, 'w3000')} dur={dur - rel(at, 'w3000')} x={70} y={370} text="3000 СЛОВ" color={C.gold} fg={C.ink} size={22} />
    <Chip at={rel(at, 'examw')} dur={dur - rel(at, 'examw')} x={70} y={450} text="SPEAKING" color={C.red} size={22} />
  </Sc>
))
shot(T.exam - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examA" zoom={[1.0, 1.05]} swaps={talk('examA_talk', 0.15, dur - 0.2)}>
    <Say at={0.1} dur={dur - 0.1} y={300} en="Describe a place you like to visit." ru="«Опишите место, которое вы любите посещать.»" name="EXAMINER" tab={C.grey2} />
  </Sc>
))
shot(SE, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_um" zoom={[1.05, 1.12]} swaps={every('examB_scared', dur, 0.9, 0.4, 0.5)}>
    <Say at={0.05} dur={dur - 0.05} y={300} en="Place... very... beautiful... quintessential..." ru="«Место... очень... красивый... квинтэссенция...»" name="ТИМУР" tab={C.red} />
  </Sc>
))
// 15 results
shot(T.result, ({ at, dur }) => {
  const notes = [['helped', 'СЛОВА ПОМОГЛИ', C.mint], ['byear', 'НА СЛУХ - НЕ УЗНАЁТ', C.gold], ['likeday0', 'КАК В ДЕНЬ 0', C.red]]
  return (
    <Sc at={at} dur={dur} base="sky" zoom={[1.0, 1.04]}>
      <BigTitle at={0.05} dur={dur - 0.05} y={200} text="РЕЗУЛЬТАТ" size={40} />
      <Scores5 at={0.2} dur={dur - 0.2} rows={[['READING', 5.0, 6.5, C.yellow], ['LISTENING', 5.0, 5.5, C.blue3], ['WRITING', 5.0, 5.0, C.mint], ['SPEAKING', 5.0, 5.0, '#f08a9a']]}
        times={[rel(at, 'rR') - 0.2, rel(at, 'rL') - 0.2, rel(at, 'rW') - 0.2, rel(at, 'rS') - 0.2]} />
      {notes.map(([k, s, col], i) => {
        const a = rel(at, k), b = rel(at, ['rL', 'rW', 'overall'][i])
        return <Layer at={a} dur={Math.max(0.1, b - a)} centre animate={popScale(0.2)}>{box(80, 706, 560, 56, col, C.navy1)}{Tx(80, 724, 560, 18, col, s, 'center')}</Layer>
      })}
      <Layer at={rel(at, 'overall')} dur={dur - rel(at, 'overall')} centre animate={popScale(0.35)}>{box(170, 700, 380, 110, C.red, C.navy1)}{Tx(190, 740, 200, 22, C.white, 'ОБЩИЙ')}{Tx(360, 726, 170, 52, C.red, '5.5', 'right')}</Layer>
    </Sc>
  )
})
// 16 the lesson
shot(T.power, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="wall" zoom={[1.0, 1.08]} swaps={every('wall_b', dur, 1.4, 0.14, 1.0)}>
    <BigTitle at={0.05} dur={dur - 0.05} y={250} text="3000 СЛОВ = СИЛА" size={30} />
    <Layer at={rel(at, 'notyours')} dur={dur - rel(at, 'notyours')} centre animate={popScale(0.3)}>
      {box(90, 500, 540, 150, C.red, C.navy1)}{Tx(90, 522, 540, 18, C.white, 'НЕ СКАЗАЛ ВСЛУХ', 'center')}{Tx(90, 580, 540, 30, C.red, '→ НЕ ТВОЁ', 'center')}
    </Layer>
  </Sc>
))
shot(T.tips, ({ at, dur }) => {
  const rows = [['tips', '1. В ПРЕДЛОЖЕНИЯХ'], ['listenw', '2. СЛУШАЙ, КАК ГОВОРЯТ'], ['usew', '3. СРАЗУ ИСПОЛЬЗУЙ']]
  const f = rel(at, 'five')
  return (
    <Sc at={at} dur={dur} base="mirror_talk" zoom={[1.0, 1.06]} swaps={every('mirror_talk2', dur, 0.5, 0.25, 0.3)}>
      <Layer at={0.05} dur={f - 0.05} animate={popSlide()}>
        {box(70, 140, 580, 270, C.mint, C.navy1)}{Tx(70, 160, 580, 18, C.mintL, 'КАК УЧИТЬ СЛОВА', 'center')}
        {rows.map(([k, s], i) => <Layer at={Math.max(0.1, rel(at, k) - 0.05)} dur={Math.max(0.05, f - 0.05 - Math.max(0.1, rel(at, k) - 0.05))}>{Tx(100, 220 + i * 64, 540, 18, C.white, s)}</Layer>)}
      </Layer>
      <Layer at={f} dur={dur - f} centre animate={popScale(0.3)}>
        {box(90, 150, 540, 250, C.yellow, C.navy1)}
        {Tx(90, 180, 540, 40, C.mintL, '5 ВСЛУХ', 'center')}{Tx(90, 252, 540, 30, C.white, '>', 'center')}{Tx(90, 310, 540, 24, C.grey3, '50 НА КАРТОЧКЕ', 'center')}
      </Layer>
    </Sc>
  )
})
// 17 call to action: the owl checks
shot(T.cta, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="owl_open" zoom={[1.0, 1.1]} swaps={[['owl_wink', rel(at, 'check') + 0.5, dur]]}>
    <BigTitle at={0.1} dur={dur - 0.1} y={250} text="СКОЛЬКО СЛОВ" size={34} />
    <BigTitle at={0.4} dur={dur - 0.4} y={320} text="В ДЕНЬ?" size={34} color={C.white} under={C.blue2} />
    <Chip at={rel(at, 'comments')} dur={dur - rel(at, 'comments')} x={110} y={420} text="ПИШИ В КОММЕНТАХ" color={C.mint} fg={C.ink} size={20} />
  </Sc>
))
