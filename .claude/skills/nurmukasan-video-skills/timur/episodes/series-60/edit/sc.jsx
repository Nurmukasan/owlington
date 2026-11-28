import { W, H, C, P, FONT, IMG, Layer, Scene, blinks, every, popScale, popSlide, PText } from './lib.jsx'
import { Chip, BigTitle } from './ui.jsx'
import { Glitch, box, T as Tx } from './ui3.jsx'
import { Hud5, HookTitle, Counter, Say, Scores5, RuleCard } from './ui6.jsx'
import { T, D } from './times.jsx'

// Layout rules (same as grammar-60): overlays inside x 56-664, below the HUD (y > 240), above every face, never on the owl
// (room plates: keep x 460-570 / y 320-490 free -> cards stay on the left column x 70-450), captions centred at y 872.
// Subtitles on the laptop screen belong to the picture: they are `world` children (plate coordinates, move with the camera).
const rel = (at, k) => Math.max(0.05, T[k] - at)
const hud = (v, dots = 0) => Hud5({ value: v, dots, title: 'СЕРИАЛЫ' })
// top-right panel: episodes watched, mock, which subtitles
const St = ({ at = 0, dur, ep, mock, sub, flash = [] }) => {
  const x = 404, y = 128, w = 236, h = 92
  const row = (i, label, v, col) => [Tx(x + 14, y + 10 + i * 27, 120, 13, C.grey3, label), Tx(x + 100, y + 6 + i * 27, 122, 20, col, v, 'right')]
  const mc = parseFloat(mock) >= 6 ? C.yellow : C.gold
  const sc = sub === 'RU' ? C.red : sub === 'EN' ? C.blue3 : sub === 'НЕТ' ? C.mintL : C.grey3
  return (
    <Layer at={at} dur={Math.max(0.05, dur - at)}>
      {box(x, y, w, h, C.mint, C.navy1)}
      {row(0, 'СЕРИЙ', ep, C.yellow)}{row(1, 'МОК', mock, mc)}{row(2, 'СУБТ.', sub, sc)}
      {flash.map(([i, ft]) => (
        <Layer at={ft} dur={0.5} animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0.9 }, { at: 0.5, value: 0 }] }]}>
          <rect x={x} y={y + 4 + i * 27} width={w} height={26} fill={C.white} />
        </Layer>
      ))}
    </Layer>
  )
}
const st = (dur, ep, mock, sub, at = 0, flash = []) => <St at={at} dur={dur} ep={ep} mock={mock} sub={sub} flash={flash} />
const darken = (a = 0.5, t = 0.3) => <rect x={0} y={0} width={W} height={H} fill="#0b0c26" animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: t, value: a }] }]} />
// a paper result card on the left column (x 70-450) with a stamped mark on its right
const stamp = (dur, at, title, lines, mark, markAt, col = C.red, y = 300) => (
  <Layer at={at} dur={dur - at} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 700 }, { at: 0.35, value: 0, easing: 'ease-out' }] }]}>
    <rect x={70} y={y} width={380} height={200} fill={C.ink} /><rect x={76} y={y + 6} width={368} height={188} fill="#f4ead2" />
    <text x={96} y={y + 24} width={340} fontFamily={FONT} fontWeight={400} fontSize={15} color={C.ink}>{title}</text>
    {lines.map(([s, lt], i) => <Layer at={lt} dur={dur - at - lt}><text x={96} y={y + 66 + i * 28} width={200} fontFamily={FONT} fontWeight={400} fontSize={12} color="#5a4a3a">{s}</text></Layer>)}
    <Layer at={markAt} dur={dur - at - markAt} centre animate={[{ property: 'scale', keyframes: [{ at: 0, value: 2.4 }, { at: 0.15, value: 0.95 }, { at: 0.25, value: 1 }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.05, value: 1 }] }]}>
      <rect x={296} y={y + 62} width={134} height={100} fill="#00000000" strokeColor={col} strokeWidth={7} />
      <text x={296} y={y + 94} width={134} fontFamily={FONT} fontWeight={400} fontSize={38} color={col} align="center">{mark}</text>
    </Layer>
  </Layer>
)
// a labelled bar on its own panel (left column): fills from `from` to `to` (0..1) over `t`
const Meter = ({ at, dur, label, from = 0, to = 1, t = 0.8, col = C.mintL, y = 398, border = C.mint }) => (
  <Layer at={at} dur={dur} animate={popSlide()}>
    {box(70, y, 380, 84, border, C.navy1)}
    {Tx(88, y + 14, 344, 14, C.grey3, label)}
    <rect x={88} y={y + 42} width={344} height={26} fill="#26264f" />
    <rect x={88} y={y + 42} width={344} height={26} fill={col} origin="top-left" animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: Math.max(0.001, from) }, { at: 0.2, value: Math.max(0.001, from) }, { at: t, value: to, easing: 'ease-out' }] }]} />
  </Layer>
)
// eyes vs ears with Russian subtitles: the eyes bar fills, the ears bar barely moves
const EyesEars = ({ at, dur }) => (
  <Layer at={at} dur={dur} animate={popSlide()}>
    {box(70, 262, 380, 150, C.gold, C.navy1)}
    {Tx(88, 280, 160, 14, C.white, 'ГЛАЗА')}{Tx(88, 302, 160, 11, C.grey3, 'ЧИТАЮТ')}
    <rect x={220} y={284} width={212} height={26} fill="#26264f" />
    <rect x={220} y={284} width={212} height={26} fill={C.yellow} origin="top-left" animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: 0.001 }, { at: 0.3, value: 0.001 }, { at: 1.0, value: 1, easing: 'ease-out' }] }]} />
    {Tx(88, 348, 160, 14, C.white, 'УШИ')}{Tx(88, 370, 160, 11, C.grey3, 'СЛУШАЮТ')}
    <rect x={220} y={352} width={212} height={26} fill="#26264f" />
    <rect x={220} y={352} width={212} height={26} fill={C.red} origin="top-left" animate={[{ property: 'scaleX', keyframes: [{ at: 0, value: 0.001 }, { at: 0.6, value: 0.001 }, { at: 1.2, value: 0.08, easing: 'ease-out' }] }]} />
  </Layer>
)
// subtitles on the laptop screen (world space: plate px, the screen's bottom band is y 690-770)
const Sub = ({ at, dur, text, col = C.white, size = 22 }) => (
  <Layer at={at} dur={dur} centre animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.06, value: 1 }] }]}>
    <text x={30} y={text.includes('\n') ? 668 : 700} width={660} fontFamily={FONT} fontWeight={400} fontSize={size} color={col} align="center" lineHeight={1.35}
      strokeColor={C.ink} strokeWidth={7} shadow={{ x: 3, y: 3, blur: 0, color: C.ink }}>{text}</text>
  </Layer>
)
// the phrase notebook, compact, on the sitcom wall above the friends' heads (y 248-368): lines appear on their words
const Notebook = ({ at, dur, lines }) => (
  <Layer at={at} dur={dur} animate={popSlide()}>
    <rect x={70} y={248} width={380} height={120} fill={C.ink} /><rect x={75} y={253} width={370} height={110} fill="#fff3b0" />
    <rect x={75} y={276} width={370} height={2} fill="#e8a0a0" />
    {Tx(92, 260, 330, 11, '#6a4a3a', 'ТЕТРАДЬ ФРАЗ')}
    {lines.map(([s, lt], i) => <Layer at={Math.min(lt, dur - 0.1)} dur={dur - Math.min(lt, dur - 0.1)} centre animate={popScale(0.18)}>{Tx(92, 286 + i * 26, 340, 15, C.ink, s)}</Layer>)}
  </Layer>
)
const talk = (k, from, to, period = 0.26, on = 0.13) => { const o = []; for (let t = from; t < to - 0.05; t += period) o.push([k, t, on]); return o }
const splitAt = (k, re) => { const w = D[k] || []; const i = w.findIndex((x, j) => j > 0 && re.test(w[j - 1][0])); return i > 0 ? w[i][1] - 0.08 : (T[k] + T[k + '_end']) / 2 }

// camera guard: keep the face bottom at y <= 800 (captions at 872) — Timur behind the laptop: face bottom 765 on the plates
const FB = { hook: 770, fresh: 770, laugh: 770, read: 770, dull: 770, wide: 770, tired: 770, focus: 770, happy: 770, nosub: 770, laugh3: 770, call: 770, end: 770, owl_open: 790, owl_wink: 790 }
const Sc = ({ base, zoom = [1, 1.06], panY, ...o }) => {
  const fb = FB[base] || FB[base.split('_')[0]]
  if (!fb || panY) return Scene({ base, zoom, panY, ...o })
  const zmin = 480 / (1280 - fb) + 0.005
  const z = zoom.map((v) => Math.max(v, zmin))
  return Scene({ base, zoom: z, panY: z.map((v) => Math.min(0, 160 - v * (fb - 640))), ...o })
}

// --- shots ---------------------------------------------------------------
export const SHOTS = []
export const VID = {}
const shot = (t, fn) => SHOTS.push([t > 0 ? t - 0.08 : 0, fn])
// a show clip on the laptop screen (screen.py composited every frame onto the classic screen plate)
const Vid = ({ k, from = 0 }) => <media file={VID[k]} x={0} y={0} width={W} height={H} fit="fill" trimStart={from} />
// falling snow for the «Winter is coming» joke (screen space)
const Snow = ({ at, dur, n = 46 }) => {
  const o = []
  for (let i = 0; i < n; i++) {
    const x = (i * 157) % W, y0 = -40 - ((i * 263) % 700), sp = 260 + ((i * 71) % 160), s = 6 + (i % 3) * 4
    o.push(<rect x={x} y={y0} width={s} height={s} fill="#ffffff" opacity={0.85} animate={[{ property: 'offsetY', keyframes: [{ at: 0, value: 0 }, { at: dur, value: sp * dur }] }, { property: 'offsetX', keyframes: [{ at: 0, value: 0 }, { at: dur, value: (i % 2 ? 30 : -30) * dur }] }]} />)
  }
  return <Layer at={at} dur={dur}>{o}</Layer>
}
const frost = (a = 0.28) => <rect x={0} y={0} width={W} height={H} fill="#9fd3ff" animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.25, value: a }] }]} />

// 01 cold open on the sitcom itself: the question as a title, laughing friends on screen
shot(0, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="tv_laugh" zoom={[1.18, 1.04]} swaps={every('tv', dur, 0.9, 0.35, 0.6)}>
    <Layer at={0} dur={dur}>{HookTitle({ y: 250, text: 'ТОЛЬКО СЕРИАЛЫ', size: 40 })}{HookTitle({ y: 318, text: 'ВЫУЧИШЬ АНГЛИЙСКИЙ?', size: 26, color: C.white, under: C.blue2 })}</Layer>
  </Sc>
))
// 02 Timur checked it: 60 days, the counter rolls to the spoken "180"; spoiler stamp
const ROLL_DAYS = [0, 1, 2, 3, 5, 7, 10, 14, 19, 25, 31, 38, 45, 52, 57, 60]
shot(T.checked, ({ at, dur }) => {
  const sp = rel(at, 'spoiler')
  return (
    <Sc at={at} dur={dur} base="hook" zoom={[1.12, 1.02]} swaps={blinks('hook_b', [1.0, 2.6])}>
      <Layer at={0} dur={dur}>{HookTitle({ y: 250, text: '60 ДНЕЙ', size: 56 })}</Layer>
      <Counter at={0.1} dur={dur - 0.1} times={T.roll.map((t) => Math.max(0, t - T.checked - 0.02))} values={ROLL_DAYS.map((d) => String(d * 3))} y={330} x={210} label="СЕРИЙ" color={C.gold} fg={C.yellow} />
      <Glitch at={sp} dur={0.3} />
      <Layer at={sp} dur={dur - sp} centre animate={[{ property: 'scale', keyframes: [{ at: 0, value: 2.2 }, { at: 0.15, value: 0.95 }, { at: 0.25, value: 1 }] }, { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.05, value: 1 }] }]}>
        <rect x={110} y={462} width={500} height={110} fill={C.ink} /><rect x={116} y={468} width={488} height={98} fill={C.red} />
        {Tx(116, 484, 488, 16, C.white, 'СПОЙЛЕР:', 'center')}
        <Layer at={Math.max(0.05, rel(at, 'first60') - sp)} dur={dur - sp - Math.max(0.05, rel(at, 'first60') - sp)}>{Tx(116, 516, 488, 20, C.yellow, '60 СЕРИЙ ВПУСТУЮ', 'center')}</Layer>
      </Layer>
    </Sc>
  )
})
// 03 universe #8: no books, no tutors, 3 episodes a day
shot(T.u8, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="fresh" zoom={[1.0, 1.06]} swaps={blinks('fresh_b', [1.5, 3.6])}>
    <Glitch at={0} dur={0.35} />
    <Layer at={0.1} dur={dur - 0.1} animate={popSlide()}>{hud('ДЕНЬ 0')}</Layer>
    {st(dur, '0', '-', '-', 0.1)}
    <Chip at={0.05} dur={dur - 0.05} x={70} y={262} text="ВСЕЛЕННАЯ #8" color={C.red} size={20} />
    <Chip at={rel(at, 'nobooks')} dur={dur - rel(at, 'nobooks')} x={70} y={336} text="БЕЗ УЧЕБНИКОВ" color={C.grey2} size={16} />
    <Chip at={rel(at, 'nobooks') + 0.7} dur={dur - rel(at, 'nobooks') - 0.7} x={70} y={396} text="БЕЗ РЕПЕТИТОРОВ" color={C.grey2} size={16} />
    <BigTitle at={rel(at, 'three')} dur={dur - rel(at, 'three')} y={530} text="3 СЕРИИ В ДЕНЬ" size={34} />
  </Sc>
))
// 04 day 0: 5.0 in every skill
shot(T.day0, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_um" zoom={[1.0, 1.06]} swaps={every('examB_blink', dur, 1.3, 0.14, 0.9)}>
    {hud('ДЕНЬ 0')}{st(rel(at, 'all5'), '0', '-', '-')}{st(dur, '0', '5.0', '-', rel(at, 'all5'), [[1, 0]])}
    <BigTitle at={0.05} dur={rel(at, 'mock0')} y={262} text="ДЕНЬ 0" size={56} />
    {stamp(dur, rel(at, 'mock0'), 'MOCK · ДЕНЬ 0', ['LISTENING 5.0', 'READING   5.0', 'WRITING   5.0', 'SPEAKING  5.0'].map((s, i) => [s, Math.max(0.2, rel(at, 'all5') - rel(at, 'mock0') - 0.3 + i * 0.12)]), '5.0', Math.max(0.8, rel(at, 'all5') - rel(at, 'mock0') + 0.4), C.red, 330)}
  </Sc>
))
// 05 stage 1: «Friends» with native-language subtitles — he gets every joke
shot(T.ph1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="laugh" zoom={[1.0, 1.06]} swaps={every('laugh_b', dur, 0.5, 0.22, rel(at, 'excited'))}>
    {hud('ЭТАП 1', 1)}{st(rel(at, 'native1'), '0', '5.0', '-')}{st(dur, '0', '5.0', 'РОДН', rel(at, 'native1'), [[2, 0]])}
    <BigTitle at={0.05} dur={dur - 0.05} y={256} text="ЭТАП 1" size={48} />
    <Chip at={rel(at, 'friends')} dur={dur - rel(at, 'friends')} x={70} y={336} text="СЕРИАЛ: ДРУЗЬЯ" color={C.gold} fg={C.ink} size={16} />
    <Chip at={rel(at, 'native1')} dur={dur - rel(at, 'native1')} x={70} y={396} text="СУБТИТРЫ: РОДНОЙ ЯЗЫК" color={C.red} size={14} />
    <Chip at={rel(at, 'joke')} dur={dur - rel(at, 'joke')} x={70} y={456} text="ПОНИМАЕТ КАЖДУЮ ШУТКУ" color={C.mint} fg={C.ink} size={14} />
  </Sc>
))
// 06 the sitcom line (her own voice) with native-language subtitles on the screen
shot(T.show - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="tv_talk" zoom={[1.0, 1.05]} swaps={talk('tv_talk2', 0.12, dur - 0.2, 0.24, 0.12)}
    world={[<Sub at={0.1} dur={dur - 0.1} text={'О боже! Ты съел мой сэндвич?\nМОЙ сэндвич?!'} />]}>
    <Chip at={0.05} dur={dur - 0.05} x={70} y={262} text="СУБТИТРЫ: РОДНОЙ" color={C.red} size={14} />
  </Sc>
))
// 07 ...but he reads them: his eyes on the subtitles
shot(T.reads, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="read" zoom={[1.06, 1.14]} swaps={blinks('read_b', [1.2])}>
    {hud('ЭТАП 1', 1)}{st(dur, '30', '5.0', 'РОДН')}
    <Chip at={Math.max(0.1, rel(at, 'rus') - 0.3)} dur={dur - Math.max(0.1, rel(at, 'rus') - 0.3)} x={70} y={300} text="ЧИТАЕТ, А НЕ СЛУШАЕТ" color={C.red} size={16} />
  </Sc>
))
// 08 day 20: 60 episodes, mock listening 5.0 — like day 0
shot(T.d20, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="dull" zoom={[1.0, 1.08]} swaps={every('read_b', dur, 1.8, 0.14, 1.2)}>
    {hud('ДЕНЬ 20', 2)}{st(rel(at, 'ep60'), '30', '5.0', 'РОДН')}{st(dur, '60', '5.0', 'РОДН', rel(at, 'ep60'), [[0, 0]])}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'ep60') - 0.05)} y={256} text="ДЕНЬ 20" size={52} />
    <Counter at={rel(at, 'ep60')} dur={rel(at, 'mockL1') - rel(at, 'ep60')} t1={0.8} values={['30', '45', '60']} y={262} label="СЕРИЙ" color={C.gold} fg={C.yellow} />
    {stamp(dur, rel(at, 'mockL1'), 'LISTENING · MOCK', [['60 СЕРИЙ', 0.3]], '5.0', Math.max(0.5, rel(at, 'l5') - rel(at, 'mockL1')), C.red)}
    <Chip at={rel(at, 'likeday0')} dur={dur - rel(at, 'likeday0')} x={70} y={520} text="КАК В ДЕНЬ 0" color={C.red} size={18} />
  </Sc>
))
// 09 twist: with native-language subtitles the brain reads instead of listening
shot(T.twist, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="read" zoom={[1.1, 1.18]} swaps={blinks('read_b', [2.4, 5.0])}>
    <Glitch at={0} dur={0.3} />
    {darken(0.45, 0.3)}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'notlisten') - 0.1)} y={252} text="ПОВОРОТ!" size={52} />
    <EyesEars at={Math.max(0.3, rel(at, 'notlisten') - 0.1)} dur={dur - Math.max(0.3, rel(at, 'notlisten') - 0.1)} />
    <Chip at={rel(at, 'noise')} dur={dur - rel(at, 'noise')} x={70} y={440} text="РЕЧЬ = ФОНОВЫЙ ШУМ" color={C.navy3} size={16} />
  </Sc>
))
// 10 stage 2: English subtitles and a new show — «Sherlock» (British accent, fast speech)
shot(T.ph2, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="focus" zoom={[1.0, 1.05]}>
    {hud('ЭТАП 2', 2)}{st(rel(at, 'ensub'), '60', '5.0', 'РОДН')}{st(dur, '60', '5.0', 'EN', rel(at, 'ensub'), [[2, 0]])}
    <BigTitle at={0.05} dur={dur - 0.05} y={256} text="ЭТАП 2" size={48} />
    <Chip at={rel(at, 'ensub')} dur={dur - rel(at, 'ensub')} x={70} y={336} text="EN СУБТИТРЫ" color={C.blue2} size={20} />
  </Sc>
))
shot(T.sher - 0.15, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="scr_sher" zoom={[1.0, 1.06]}>
    <Chip at={0.05} dur={dur - 0.05} x={70} y={262} text="СЕРИАЛ: ШЕРЛОК" color={C.gold} fg={C.ink} size={16} />
    <Chip at={rel(at, 'accent')} dur={dur - rel(at, 'accent')} x={70} y={322} text="UK АКЦЕНТ" color={C.red} size={16} />
  </Sc>
))
// 11 one episode takes 3 hours instead of 1.5: pause, rewind, dictionary
shot(T.ep1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="tired" zoom={[1.0, 1.06]} swaps={every('tired_b', dur, 1.6, 0.18, 1.0)}>
    {hud('ЭТАП 2', 2)}{st(dur, '60', '5.0', 'EN')}
    <Counter at={0.05} dur={dur - 0.05} t1={Math.max(0.6, rel(at, 'h3') + 0.3)} values={['1.5 Ч', '2 Ч', '3 Ч']} y={262} label="ОДНА СЕРИЯ" color={C.red} fg={C.gold} size={36} />
    <Chip at={rel(at, 'pause')} dur={dur - rel(at, 'pause')} x={70} y={384} text="ПАУЗА" color={C.navy3} size={16} />
    <Chip at={rel(at, 'rewind')} dur={dur - rel(at, 'rewind')} x={70} y={440} text="ПЕРЕМОТКА" color={C.navy3} size={16} />
    <Chip at={rel(at, 'dict')} dur={dur - rel(at, 'dict')} x={70} y={496} text="СЛОВАРЬ" color={C.navy3} size={16} />
  </Sc>
))
// 12 live phrases: English subtitles on the Sherlock screen + the phrase notebook
shot(T.phrases, ({ at, dur }) => {
  const g = rel(at, 'gonna'), n = rel(at, 'noway'), e = rel(at, 'elem')
  return (
    <Sc at={at} dur={dur} base="scr_sher" zoom={[1.0, 1.05]} swaps={[['scr_sher_1', g, n - g], ['scr_sher_2', n, e - n], ['scr_sher_3', e, dur - e]]}>
      <Notebook at={0.15} dur={dur - 0.15} lines={[["I'M GONNA", g], ['NO WAY', n], ['ELEMENTARY!', e]]} />
    </Sc>
  )
})
// 13 day 40: mock listening 6.0, reading 6.0 — subtitles taught fast reading
shot(T.d40, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="happy" zoom={[1.0, 1.06]} swaps={blinks('happy_b', [1.4, 4.0])}>
    {hud('ДЕНЬ 40', 3)}{st(rel(at, 'l6'), '120', '5.0', 'EN')}{st(dur, '120', '5.5', 'EN', rel(at, 'l6'), [[1, 0]])}
    <BigTitle at={0.05} dur={Math.max(0.3, rel(at, 'mockL2') - 0.05)} y={256} text="ДЕНЬ 40" size={52} />
    {stamp(dur, rel(at, 'mockL2'), 'MOCK · ДЕНЬ 40', [['LISTENING 6.0', Math.max(0.2, rel(at, 'l6') - rel(at, 'mockL2'))], ['READING   6.0', Math.max(0.4, rel(at, 'r6') - rel(at, 'mockL2'))]], '6.0', Math.max(0.5, rel(at, 'l6') - rel(at, 'mockL2')), '#2f8a4a')}
    <Chip at={rel(at, 'fastread')} dur={dur - rel(at, 'fastread')} x={70} y={520} text="СУБТИТРЫ = БЫСТРОЕ ЧТЕНИЕ" color={C.mint} fg={C.ink} size={13} />
  </Sc>
))
// 14 stage 3: no subtitles — «Breaking Bad»: half; «Game of Thrones»: even less (old words, a dozen accents)
shot(T.ph3, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="nosub" zoom={[1.0, 1.06]} swaps={every('nosub_b', dur, 1.5, 0.14, 0.9)}>
    {hud('ЭТАП 3', 4)}{st(rel(at, 'nosub'), '120', '5.5', 'EN')}{st(dur, '120', '5.5', 'НЕТ', rel(at, 'nosub'), [[2, 0]])}
    <BigTitle at={0.05} dur={dur - 0.05} y={256} text="ЭТАП 3" size={48} />
    <Chip at={rel(at, 'nosub')} dur={dur - rel(at, 'nosub')} x={70} y={336} text="БЕЗ СУБТИТРОВ" color={C.red} size={20} />
  </Sc>
))
shot(T.bb - 0.1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="scr_bb" zoom={[1.0, 1.06]}>
    <Chip at={0.05} dur={dur - 0.05} x={70} y={262} text="ВО ВСЕ ТЯЖКИЕ" color={C.gold} fg={C.ink} size={16} />
    <Meter at={Math.max(0.2, rel(at, 'half') - 0.1)} dur={dur - Math.max(0.2, rel(at, 'half') - 0.1)} label="ПОНИМАЕТ" from={0} to={0.5} t={0.8} col={C.gold} border={C.gold} y={330} />
  </Sc>
))
shot(T.got - 0.1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="scr_got" zoom={[1.0, 1.05]} world={[<Vid k="got" />]}>
    <Chip at={0.05} dur={dur - 0.05} x={70} y={262} text="ИГРА ПРЕСТОЛОВ" color={C.blue2} size={16} />
    <Meter at={0.2} dur={dur - 0.2} label="ПОНИМАЕТ" from={0.5} to={0.3} t={0.9} col={C.red} border={C.red} y={330} />
  </Sc>
))
// 15 why it helps: IELTS listening has British, American and Australian accents
shot(T.useful, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="focus" zoom={[1.0, 1.06]}>
    {hud('ЭТАП 3', 4)}{st(dur, '135', '5.5', 'НЕТ')}
    <BigTitle at={0.05} dur={dur - 0.05} y={252} text="IELTS LISTENING" size={30} />
    {[['UK', C.red], ['USA', C.blue2], ['AUS', C.gold]].map(([t, c], i) => (
      <Chip at={rel(at, 'accents') + i * 0.45} dur={dur - rel(at, 'accents') - i * 0.45} x={70 + i * 130} y={330} text={t} color={c} fg={c === C.gold ? C.ink : C.white} size={20} />))}
    <Chip at={rel(at, 'more')} dur={dur - rel(at, 'more')} x={70} y={410} text="БОЛЬШЕ СЕРИАЛОВ = ЛЕГЧЕ" color={C.mint} fg={C.ink} size={14} />
  </Sc>
))
// 16 day 50: he laughs before the laugh track
shot(T.d50, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="laugh3" zoom={[1.0, 1.06]} swaps={every('laugh3_b', dur, 0.45, 0.2, 0.6)}>
    {hud('ДЕНЬ 50', 4)}{st(dur, '150', '5.5', 'НЕТ')}
    <BigTitle at={0.05} dur={dur - 0.05} y={256} text="ДЕНЬ 50" size={52} />
    <Meter at={0.2} dur={dur - 0.2} label="ПОНИМАЕТ" from={0.3} to={0.95} t={1.4} col={C.mintL} y={336} />
    <Chip at={rel(at, 'laughtrack')} dur={dur - rel(at, 'laughtrack')} x={70} y={440} text="СМЕЁТСЯ РАНЬШЕ ЗАКАДРА" color={C.gold} fg={C.ink} size={14} />
  </Sc>
))
// 17 day 55: Jake calls (their own lines): Jake on the screen, Timur at the laptop
shot(T.d55, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="call" zoom={[1.0, 1.05]}>
    {hud('ДЕНЬ 55', 5)}{st(dur, '165', '5.5', 'НЕТ')}
    <BigTitle at={0.05} dur={dur - 0.05} y={256} text="ДЕНЬ 55" size={52} />
    <Chip at={rel(at, 'callw')} dur={dur - rel(at, 'callw')} x={70} y={336} text="ЗВОНОК: ДЖЕЙК" color={C.blue2} size={18} />
  </Sc>
))
const J1 = splitAt('jake', /to\?$/i), J2 = splitAt('jake', /doin/i), J3 = splitAt('jake', /summer/i)
shot(T.jake - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="jscreen_talk" zoom={[1.0, 1.04]} swaps={talk('jscreen', 0.2, dur - 0.1)}>
    <Say at={0.1} dur={dur - 0.1} y={260} en="Alright mate! What've you been up to?" ru="«Здорово, бро! Чем занимался?»" name="ДЖЕЙК" tab={C.blue2} tail="center" />
  </Sc>
))
shot(J1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="call_talk" zoom={[1.03, 1.08]} swaps={talk('call', 0.2, dur - 0.1, 0.3, 0.12)}>
    <Say at={0.05} dur={dur - 0.05} x={60} y={290} w={390} en="Oh, you know... How you doin'?" ru="«Да так... Как сам?»" name="ТИМУР" tab={C.red} tail="right" />
  </Sc>
))
shot(J2, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="jscreen_talk" zoom={[1.02, 1.06]} swaps={talk('jscreen', 0.2, dur - 0.1)}>
    <Say at={0.05} dur={dur - 0.05} y={260} en="Good! So, tell me about your plans for the summer." ru="«Норм! Слушай, а какие планы на лето?»" name="ДЖЕЙК" tab={C.blue2} tail="center" />
  </Sc>
))
shot(J3, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="call_um" zoom={[1.06, 1.14]} swaps={every('call_um2', dur, 1.1, 0.4, 0.4).concat(every('call_blink', dur, 1.7, 0.14, 0.9))}>
    <Say at={0.05} dur={dur - 0.05} x={60} y={290} w={390} en="Uh... I'm gonna... um... You know what?.." ru="«Эм... я собираюсь... это... знаешь что?..»" name="ТИМУР" tab={C.red} tail="right" />
  </Sc>
))
// 18 he understood every word, but hardly said a sentence of his own
shot(T.understood, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="call_um2" zoom={[1.0, 1.06]} swaps={every('call_blink', dur, 1.6, 0.14, 1.0)}>
    {hud('ДЕНЬ 55', 5)}{st(dur, '165', '5.5', 'НЕТ')}
    <Chip at={0.1} dur={dur - 0.1} x={70} y={262} text="ПОНИМАЕТ: ВСЁ" color={C.mint} fg={C.ink} size={18} />
    <Chip at={rel(at, 'notsaid')} dur={dur - rel(at, 'notsaid')} x={70} y={326} text="СВОИХ ФРАЗ ВСЛУХ: ~0" color={C.red} size={16} />
  </Sc>
))
// 19 day 60: the exam — and the speaking question about winter («Winter is coming.»)
shot(T.d60, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="hall" zoom={[1.0, 1.06]}>
    {hud('ДЕНЬ 60', 5)}{st(dur, '180', '5.5', 'НЕТ', 0.4, [[0, 0]])}
    <BigTitle at={0.05} dur={dur - 0.05} y={272} text="ДЕНЬ 60" size={52} />
    <Chip at={rel(at, 'examw')} dur={dur - rel(at, 'examw')} x={70} y={372} text="ЭКЗАМЕН" color={C.red} size={22} />
  </Sc>
))
const E1 = splitAt('exam', /^winter$/i), E2 = splitAt('exam', /coming/i)
shot(T.exam - 0.05, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examA" zoom={[1.0, 1.05]} swaps={talk('examA_talk', 0.15, dur - 0.2)}>
    <Say at={0.1} dur={dur - 0.1} y={300} en="So, what's the weather like in your city in winter?" ru="«Какая погода в вашем городе зимой?»" name="EXAMINER" tab={C.grey2} tail="center" />
  </Sc>
))
shot(E1, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examB_epic" zoom={[1.0, 1.14]} swaps={[['examB_epic_talk', 0.1, Math.max(0.2, dur - 0.5)]]}>
    {frost(0.3)}
    <Snow at={0} dur={dur} />
    <Say at={0.1} dur={dur - 0.1} y={300} en="Winter is coming." ru="«Зима близко.»" name="ТИМУР" tab={C.red} tail="center" size={30} />
  </Sc>
))
shot(E2, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="examA_huh" zoom={[1.0, 1.05]} swaps={talk('examA_talk', Math.max(0.3, dur * 0.35), dur - 0.2)}>
    <Say at={0.1} dur={dur - 0.1} y={300} en="...Right. Could you tell me a little more?" ru="«...Так. Можете рассказать подробнее?»" name="EXAMINER" tab={C.grey2} tail="center" />
  </Sc>
))
// 20 results in the order they are read: L 8.0, R 6.0, S 6.5, W 5.0 -> mean 6.375 -> overall 6.5
shot(T.result, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="sky" zoom={[1.0, 1.04]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={200} text="РЕЗУЛЬТАТ" size={40} />
    <Scores5 at={0.2} dur={dur - 0.2} rows={[['LISTENING', 5.0, 8.0, C.blue3], ['READING', 5.0, 6.0, C.yellow], ['SPEAKING', 5.0, 6.5, '#f08a9a'], ['WRITING', 5.0, 5.0, C.mint]]}
      times={[rel(at, 'rL') - 0.2, rel(at, 'rR') - 0.2, rel(at, 'rS') - 0.2, rel(at, 'rW') - 0.2]} />
    <Layer at={rel(at, 'overall')} dur={dur - rel(at, 'overall')} centre animate={popScale(0.35)}>{box(170, 708, 380, 110, C.yellow, C.navy1)}{Tx(190, 748, 200, 22, C.white, 'ОБЩИЙ')}{Tx(360, 734, 170, 52, C.yellow, '6.5', 'right')}</Layer>
  </Sc>
))
// 21 the answer: understand — yes; speak — halfway; write — no; a trainer for the ears
shot(T.q, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="end" zoom={[1.0, 1.06]}>
    <BigTitle at={0.05} dur={dur - 0.05} y={250} text="ТАК МОЖНО?" size={40} />
    <Chip at={rel(at, 'understand')} dur={dur - rel(at, 'understand')} x={70} y={330} text="ПОНИМАТЬ — ДА" color={C.mint} fg={C.ink} size={18} />
    <Chip at={rel(at, 'speakno')} dur={dur - rel(at, 'speakno')} x={70} y={392} text="ГОВОРИТЬ — НАПОЛОВИНУ" color={C.gold} fg={C.ink} size={16} />
    <Chip at={rel(at, 'writeno')} dur={dur - rel(at, 'writeno')} x={70} y={454} text="ПИСАТЬ — НЕТ" color={C.red} size={18} />
    <Chip at={rel(at, 'trainer')} dur={dur - rel(at, 'trainer')} x={70} y={530} text="ТРЕНАЖЁР ДЛЯ УШЕЙ" color={C.gold} fg={C.ink} size={18} />
  </Sc>
))
// 22 how to watch: the level ladder sitcoms -> detective/drama -> fantasy
shot(T.how, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="happy" zoom={[1.0, 1.06]} swaps={blinks('happy_b', [1.8, 4.2])}>
    <BigTitle at={0.05} dur={dur - 0.05} y={252} text="КАК СМОТРЕТЬ" size={36} />
    <Chip at={rel(at, 'sitcom')} dur={dur - rel(at, 'sitcom')} x={70} y={330} text="1. СИТКОМЫ · B1" color={C.mint} fg={C.ink} size={16} />
    <Chip at={rel(at, 'drama')} dur={dur - rel(at, 'drama')} x={70} y={390} text="2. ДЕТЕКТИВЫ, ДРАМЫ · B2" color={C.gold} fg={C.ink} size={14} />
    <Chip at={rel(at, 'fantasy')} dur={dur - rel(at, 'fantasy')} x={70} y={450} text="3. ФЭНТЕЗИ · C1" color={C.red} size={16} />
  </Sc>
))
// 23 watch an episode twice, repeat aloud, 5 phrases an episode
shot(T.twice, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="end" zoom={[1.0, 1.06]}>
    <RuleCard at={0.05} dur={dur - 0.05} title="СЕРИЮ — ДВАЖДЫ" sub="EN СУБТ. → БЕЗ" tab="СОВЕТ СОВЫ" y={292} color={C.mintL} />
    <Chip at={rel(at, 'tip2')} dur={dur - rel(at, 'tip2')} x={70} y={446} text="ПОВТОРЯЙ ВСЛУХ" color={C.mint} fg={C.ink} size={16} />
    <Chip at={rel(at, 'tip3')} dur={dur - rel(at, 'tip3')} x={70} y={502} text="5 ФРАЗ ИЗ СЕРИИ" color={C.gold} fg={C.ink} size={16} />
  </Sc>
))
// 24 call to action: the owl checks
shot(T.cta, ({ at, dur }) => (
  <Sc at={at} dur={dur} base="owl_open" zoom={[1.0, 1.1]} swaps={[['owl_wink', rel(at, 'check') + 0.5, dur]]}>
    <BigTitle at={0.1} dur={dur - 0.1} y={250} text="КАКОЙ СЕРИАЛ" size={32} />
    <BigTitle at={0.5} dur={dur - 0.5} y={320} text="ПОМОГ ТЕБЕ?" size={32} color={C.white} under={C.blue2} />
    <Chip at={rel(at, 'comments')} dur={dur - rel(at, 'comments')} x={110} y={420} text="ПИШИ В КОММЕНТАХ" color={C.mint} fg={C.ink} size={20} />
  </Sc>
))
