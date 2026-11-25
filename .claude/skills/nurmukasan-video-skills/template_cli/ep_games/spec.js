// «Что если прокачивать английский только играя в видеоигры?» — shots, cards, HUD
const s = (k) => L(k).start, e = (k) => L(k).end, c = (k) => L(k).start - 0.08
const END = TL.END
// ---------- game-UI helpers ----------
const TROPHY = (p = 4) => sprite(['.yyyyyy.', 'yyYYYYyy', 'yyYYYYyy', '.yyYYyy.', '..yyyy..', '...yy...', '..oooo..', '.oooooo.'], { y: '#ffd23f', Y: '#fff1a8', o: '#8a62d6' }, p)
const EXCL = (p = 4) => sprite(['.yy.', '.yy.', '.yy.', '.yy.', '....', '.yy.'], { y: '#ffd23f' }, p)
const PAUSE = (p = 6) => sprite(['ww.ww', 'ww.ww', 'ww.ww', 'ww.ww', 'ww.ww'], { w: '#f7f3ff' }, p)
function TOAST(y, col, icon, head, text, w = 520) {
  const h = 70 + 26 * (String(text).split('<br>').length)
  return CARD(y, w, h, col, '', `<div style="position:absolute;left:20px;top:${(h - 40) / 2}px">${icon}</div>` + TX(84, 20, w - 104, 12, col, head) + TX(84, 46, w - 104, 15, 'var(--cream)', text, 'left', '', 'line-height:1.6'))
}
const SRC = (y, t) => ROW(y, `<div style="font-family:PS;font-size:11px;color:#cfc6ea;background:rgba(7,5,15,.75);padding:7px 10px;border-radius:4px">${t}</div>`)

// ---------- SHOTS ----------
shot(0, c('n02'), { clip: 'k01', z: [1.0, 1.04] })
const mk = Wt('n02', 'пробный') - 0.1, nb = Wt('n02', 'но') - 0.1
shot(c('n02'), mk, { img: 'room', z: [1.0, 1.15], py: [0.4, 0.4] })
shot(mk, nb, { img: 'mock_pov_u0', z: [1.0, 1.08], py: [0.35, 0.3] })
shot(nb, c('t01'), { img: 'room', z: [1.9, 2.05], px: [0.78, 0.8], py: [0.5, 0.5] })
shot(c('t01'), c('n03'), { clip: 'k02', z: [1.25, 1.25], py: [0.2, 0.2] })
{ const SET = { z: [2.0, 2.3], px: [0.53, 0.53], py: [0.48, 0.48], span: [c('n03'), c('n04')] }
  const w = ['английском', 'субтитрами', 'международные'].map((x) => Wt('n03', x) - 0.05), ts = [c('n03'), ...w, c('n04')]
  for (let i = 0; i < 4; i++) shot(ts[i], ts[i + 1], { img: 'settings_u' + i, ...SET }) }
shot(c('n04'), e('t02') + 0.05, { img: 'day1', z: [1.05, 1.45], py: [0.35, 0.28] })
const fA = e('t02') + 0.05
shot(fA, c('n05'), { clip: 'k04', z: [1.6, 1.6], px: [0.62, 0.62], py: [0.48, 0.48] })
shot(c('n05'), c('n06'), { img: 'tv_story_u0', z: [1.45, 1.6], px: [0.2, 0.22], py: [0.55, 0.55] })
shot(c('n06'), c('n07'), { img: 'brain', z: [1.05, 1.3], py: [0.5, 0.5] })
const sw = Wt('n07', 'шведские') - 0.1
shot(c('n07'), sw, { img: 'curious', z: [1.0, 1.2], py: [0.3, 0.3] })
shot(sw, c('n08'), { img: 'sweden', z: [1.05, 1.12], py: [0.55, 0.6] })
shot(c('n08'), c('p02'), { clip: 'k05', z: [1.15, 1.15], py: [0.4, 0.4] })
shot(c('p02'), c('p02') + 2.4, { clip: 'k06', z: [1.12, 1.12], py: [0.35, 0.35] })
shot(c('p02') + 2.4, c('n10'), { img: 'win', z: [1.2, 1.35], px: [0.6, 0.62], py: [0.4, 0.4] })
shot(c('n10'), c('s01'), { img: 'stream', z: [1.2, 1.35], px: [0.5, 0.55], py: [0.7, 0.72] })
shot(c('s01'), c('mum'), { img: 'stream', z: [1.7, 1.85], px: [0.6, 0.62], py: [0.78, 0.8] })
shot(c('mum'), c('n11'), { img: 'mum', z: [1.0, 1.1], py: [0.3, 0.3] })
shot(c('n11'), c('n12'), { img: 'mock45_u0', z: [1.0, 1.1], py: [0.3, 0.3] })
shot(c('n12'), c('n12') + 4, { clip: 'k07', z: [1.05, 1.05], py: [0.35, 0.35] })
shot(c('n12') + 4, c('n13'), { img: 'essay', z: [1.15, 1.3], py: [0.35, 0.4] })
shot(c('n13'), c('ex1'), { img: 'hall', z: [1.0, 1.25], py: [0.4, 0.3] })
shot(c('ex1'), c('t04'), { clip: 'k08', z: [1.2, 1.2], py: [0.4, 0.4] })
shot(c('t04'), c('n14'), { img: 'speak_close', z: [1.8, 1.95], px: [0.75, 0.75], py: [0.42, 0.42] })
{ const PP = { z: [1.6, 1.6], px: [0.5, 0.5], py: [1.0, 1.0] }, ks = ['ридинг', 'лиснинг', 'спикинг', 'пять', 'общий']
  const ts = [c('n14'), ...ks.map((w) => Wt('n14', w) - 0.05), c('n15')]
  for (let i = 0; i < 6; i++) shot(ts[i], ts[i + 1], { img: 'res_pov_u' + i, ...PP }) }
const cta = Wt('n15', 'какие') - 0.1
shot(c('n15'), cta, { img: 'mixed', z: [1.8, 1.95], px: [0.62, 0.62], py: [0.5, 0.5] })
shot(cta, END + 1, { clip: 'k09', z: [1.1, 1.1], py: [0.5, 0.5] })

// ---------- HOOK (cold viewers: the question, from frame 0) ----------
CAP_HIDE.push([0, c('n02')])
ov(0, c('n02'), (lt) => TX(30, 880, 660, 30, 'var(--cream)', 'ВЫУЧИТЬ АНГЛИЙСКИЙ,', 'center', 'stroke2') + TX(30, 932, 660, 30, 'var(--cream)', 'ТОЛЬКО ИГРАЯ', 'center', 'stroke2') + TX(30, 984, 660, 40, 'var(--yellow)', 'В ИГРЫ?', 'center', 'stroke2'), { anim: 'none', out: 0.1 })

// ---------- PREMISE ----------
ov(Wt('n02', 'университет') - 0.3, mk, () => ROW(250, CHIPC('ЦЕЛЬ: IELTS → УНИВЕР', 'var(--yellow)', 15)), { anim: 'down' })
ov(nb, c('t01'), () => ROW(250, CHIPC('БРОСИТЬ ИГРЫ? НЕТ.', 'var(--red)', 16)), { anim: 'down' })
ov(c('n03') + 0.05, c('n04'), () => TOAST(236, 'var(--yellow)', EXCL(5), 'НОВЫЙ КВЕСТ', '60 ДНЕЙ · ВСЁ НА ENGLISH'), { anim: 'down' })

// ---------- HUD ----------
HUD = { from: c('n04'), to: END, hide: [], states: [
  { t: 0, day: 1, vals: [5, 5, 5, 5] }, { t: c('n06'), day: 8, vals: [5.5, 5.5, 5, 5] }, { t: c('n08'), day: 20, vals: [6, 6.5, 5, 6] },
  { t: c('n10'), day: 33, vals: [6.5, 7, 5, 6.5] }, { t: c('n11'), day: 45, vals: [6.5, 7, 5, 6.5], hot: true }, { t: c('n13'), day: 61, vals: [6.5, 7, 5, 6.5] } ] }
fx(fA, c('n05'), (lt) => `<div style="position:absolute;inset:0;background:rgba(255,40,60,${0.35 * Math.max(0, 1 - lt / 0.8)})"></div>`)
ov(fA + 0.05, c('n05'), () => ROW(700, CHIPC('DEFEAT', 'var(--red)', 26)), { anim: 'slam' })
ov(s('n05') + 0.1, c('n06'), () => ROW(236, `<div style="display:flex;align-items:center;gap:12px">${PAUSE(6)}${CHIPC('ПАУЗА НА КАЖДОЙ ФРАЗЕ', 'var(--cream)', 13)}</div>`), { anim: 'down' })

// ---------- SCIENCE ----------
const em = Wt('n06', 'эмоции') - 0.1, lb = Wt('n06', 'любопытство') - 0.1
ov(em, lb, () => TOAST(236, 'var(--pink)', sprite(['.pp.pp.', 'ppppppp', 'ppppppp', '.ppppp.', '..ppp..', '...p...'], { p: '#ff8fc7' }, 6), 'НАУКА · ЭМОЦИИ', 'ВОЛНУЕТ → ЗАПОМИНАЕТСЯ<br>СИЛЬНЕЕ') + SRC(372, 'McGaugh, 2004 · Annual Review of Neuroscience'), { anim: 'down' })
ov(lb, c('n07'), () => TOAST(236, 'var(--yellow)', TROPHY(5), 'НАУКА · ЛЮБОПЫТСТВО', 'НАГРАДА МОЗГА →<br>СЛОВА ЗАХОДЯТ ЛЕГЧЕ') + SRC(372, 'Gruber et al., 2014 · Neuron'), { anim: 'down' })
ov(s('n07') + 0.1, sw, () => CARD(236, 500, 96, 'var(--sky)', 'СУБТИТРЫ', TX(0, 26, 500, 15, 'var(--cream)', 'СЛЫШИШЬ + ЧИТАЕШЬ', 'center') + TX(0, 56, 500, 13, 'var(--sky)', '= LISTENING + READING', 'center')), { anim: 'down' })
ov(sw, c('n08'), (lt) => CARD(236, 460, 150, 'var(--sky)', 'ИССЛЕДОВАНИЕ · ШВЕЦИЯ', TX(24, 26, 220, 12, 'var(--grey)', 'СЛОВАРНЫЙ ЗАПАС') +
  `<div style="position:absolute;left:24px;top:52px;width:${clamp(lt / 0.6) * 300}px;height:20px;background:var(--mint)"></div>` + TX(24, 78, 300, 11, 'var(--mint)', 'МНОГО ИГРАЮТ') +
  `<div style="position:absolute;left:24px;top:98px;width:${clamp(lt / 0.6) * 180}px;height:20px;background:var(--grey)"></div>` + TX(24, 124, 300, 11, 'var(--grey)', 'МАЛО ИЛИ НЕ ИГРАЮТ')) + SRC(398, 'Sundqvist & Wikström, 2015 · System'), { anim: 'up' })

// ---------- SPEAKING ----------
ov(s('t03') - 0.1, c('p02'), () => TOAST(236, 'var(--yellow)', TROPHY(5), 'ACHIEVEMENT UNLOCKED', 'ПЕРВЫЙ КОЛЛ НА ENGLISH'), { anim: 'down' })
ov(s('n09') + 0.1, c('n10'), (lt) => ROW(236, `<div style="font-family:PS;font-size:34px;color:var(--yellow)" class="stroke2">LEVEL UP!</div>`) + ROW(300, CHIPC('SPEAKING +1', 'var(--mint)', 16) + CHIPC('БЕЗ ЗУБРЁЖКИ', 'var(--cream)', 13)), { anim: 'slam' })
ov(s('n10') + 0.1, c('mum'), () => ROW(236, CHIPC('● LIVE', 'var(--red)', 15) + CHIPC('СЛЕНГ · ШУТКИ · СКОРОСТЬ', 'var(--lilac)', 12)), { anim: 'down' })
ov(e('mum') + 0.05, c('n11'), () => ROW(700, CHIPC('НЕ ДО УЖИНА — ГРИНД!', 'var(--yellow)', 16)), { anim: 'slam' })
HUD.hide.push([c('mum'), c('n11')])

// ---------- DAY 45 / WRITING ----------
ov(Wt('n12', 'эссе') - 0.3, c('n13'), () => TOAST(236, 'var(--red)', EXCL(5), 'КВЕСТ ПРОВАЛЕН', 'СТРУКТУРА ЭССЕ: ???'), { anim: 'down' })

// ---------- EXAM ----------
HUD.hide.push([c('n13'), END + 1])
ov(s('n13') + 0.05, c('ex1'), () => ROW(236, CHIPC('ДЕНЬ 60 · ЭКЗАМЕН', 'var(--yellow)', 17)), { anim: 'down' })
ov(Wt('n14', 'пять') + 0.3, c('n15'), () => ROW(250, CHIPC('WRITING: НЕТ СТРУКТУРЫ', 'var(--red)', 14)), { anim: 'down' })

// ---------- CTA ----------
ov(c('n15') + 0.1, cta, () => CARD(236, 500, 120, 'var(--mint)', 'ИТОГ', TX(0, 28, 500, 14, 'var(--mint)', 'ИГРЫ → ЖИВОЙ АНГЛИЙСКИЙ', 'center') + TX(0, 66, 500, 14, 'var(--red)', 'СТРУКТУРА → УЧИ ОТДЕЛЬНО', 'center')), { anim: 'down' })
ov(cta, END + 1, () => CARD(206, 500, 128, 'var(--pink)', '', TX(0, 24, 500, 16, 'var(--cream)', 'В КАКИЕ ИГРЫ ТЫ<br>ИГРАЕШЬ НА ENGLISH?', 'center', '', 'line-height:1.7') + TX(0, 92, 500, 13, 'var(--yellow)', 'ПИШИ В КОММЕНТЫ ↓', 'center')), { anim: 'pop', out: 0 })
ov(cta + 1.2, END + 1, () => ROW(360, `<div style="display:flex;align-items:center;gap:12px">${owlSvg(3)}<div style="font-family:Fr;font-weight:650;font-variation-settings:'SOFT' 100,'WONK' 1;font-size:38px;color:#fff1c9;text-shadow:3px 4px 0 #160f24">Owlington</div></div>`), { anim: 'up', out: 0 })
