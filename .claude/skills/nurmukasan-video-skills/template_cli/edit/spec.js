// Timur ep.5 «А если всё сразу?» — shots, cards, HUD
const s = (k) => L(k).start, e = (k) => L(k).end, c = (k) => L(k).start - 0.08
const END = TL.END
const CL = window.CLIPN || {} // clip frame counts (filled by render.js)

// ---------- SHOTS ----------
shot(0, c('n02'), { clip: 'c01', from: 0.9, speed: 0.95, z: [1.08, 1.0] })
shot(c('n02'), c('n03'), { img: 'ots_laptop', z: [1.0, 1.32], px: [0.5, 0.55], py: [0.5, 0.72] })
const n3 = c('n03'), n3e = c('t01'), fl = 0.55
;['old_r', 'old_s', 'old_w', 'old_l'].forEach((k, i) => shot(n3 + i * fl, n3 + (i + 1) * fl, { img: k, z: [1.0, 1.08], filter: () => 'saturate(.55) contrast(1.05) brightness(.9)' }))
shot(n3 + 4 * fl, n3e, { img: 'facepalm', z: [1.05, 1.18], py: [0.35, 0.3] })
shot(c('t01'), c('n04'), { clip: 'c02', from: 0.4 })
shot(c('n04'), c('n05'), { img: 'board_top', z: [1.0, 1.12], py: [0.25, 0.2] })
shot(c('n05'), c('n05') + 3.9, { clip: 'c03' })
shot(c('n05') + 3.9, c('n06'), { img: 'read_morning', z: [1.0, 1.15], py: [0.4, 0.3] })
shot(c('n06'), c('n06') + 2.4, { clip: 'c04' })
shot(c('n06') + 2.4, c('x01'), { img: 'bus', z: [1.12, 1.3], px: [0.6, 0.65], py: [0.3, 0.25] })
shot(c('x01'), c('n07'), { img: 'bus', z: [1.55, 1.75], px: [0.72, 0.75], py: [0.28, 0.25] })
shot(c('n07'), c('n08'), { img: 'serious', z: [1.0, 1.25], py: [0.35, 0.3], filter: (lt) => `brightness(${1 - lt * 0.08})` })
shot(c('n08'), e('n08') + 0.25, { clip: 'c13' })
shot(e('n08') + 0.25, c('m01'), { img: 'drawer', z: [1.05, 1.2], py: [0.6, 0.65] })
shot(c('m01'), c('n09'), { img: 'margaret', z: [1.0, 1.12], py: [0.35, 0.3] })
shot(c('n09'), c('n09') + 1.6, { clip: 'c05' })
shot(c('n09') + 1.6, c('n09') + 5.6, { clip: 'c14' })
shot(c('n09') + 5.6, c('j01'), { img: 'write_night', z: [1.15, 1.35], px: [0.4, 0.45], py: [0.35, 0.3] })
shot(c('j01'), c('n10'), { img: 'jake', z: [1.0, 1.1], py: [0.3, 0.25] })
shot(c('n10'), c('n10') + 3.5, { clip: 'c06' })
shot(c('n10') + 3.5, c('mum'), { img: 'talk_room', z: [1.45, 1.6], px: [0.5, 0.5], py: [0.45, 0.42] })
shot(c('mum'), c('n11'), { img: 'mum', z: [1.0, 1.08], px: [0.5, 0.5], py: [0.3, 0.3] })
shot(c('n11'), c('n11') + 4.0, { clip: 'c07' })
shot(c('n11') + 4.0, c('n12'), { img: 'asleep', z: [1.3, 1.45], px: [0.3, 0.3], py: [0.55, 0.55] })
shot(c('n12'), c('n13'), { clip: 'c08' })
shot(c('n13'), c('inv'), { clip: 'c09', speed: 1.1 })
shot(c('inv'), c('ex1'), { img: 'hall_timur', z: [1.0, 1.08], py: [0.3, 0.3] })
shot(c('ex1'), c('t02'), { img: 'examiner', z: [1.0, 1.1], py: [0.3, 0.25] })
shot(c('t02'), c('t02') + 3.6, { clip: 'c10' })
shot(c('t02') + 3.6, c('n14'), { img: 'timur_speak', z: [1.05, 1.15], py: [0.3, 0.28] })
const tOv = Wt('n14', 'общий') - 0.1
shot(c('n14'), tOv, { img: 'phone_pov', z: [1.2, 1.2], px: [0.493, 0.493], py: [0.353, 0.353] })
shot(tOv, c('j02'), { clip: 'c11', speed: 0.5 })
shot(c('j02'), c('n15'), { img: 'jake', z: [1.15, 1.25], py: [0.25, 0.22] })
shot(c('n15'), c('n15') + 3, { clip: 'c12', speed: 0.55 })
shot(c('n15') + 3, END + 1, { img: 'owl_close', z: [1.25, 1.35], py: [0.6, 0.62] })

// ---------- HOOK ----------
fx(0, 0.18, (lt) => `<div style="position:absolute;inset:0;background:#fff;opacity:${1 - lt / 0.18}"></div>`)
ov(0, c('n02'), () => TX(40, 900, 640, 32, 'var(--cream)', 'ВСЕ 4 ЧАСТИ.', 'center', 'stroke2') + TX(40, 956, 640, 46, 'var(--yellow)', '60 ДНЕЙ.', 'center', 'stroke2'), { anim: 'slam', out: 0.15 })
CAP_HIDE.push([0, c('n02')])

// ---------- STAKES: e-mail and mock ON the laptop screen ----------
const LAP = [622, 1226, 1194, 1578], n2 = s('n02'), mk = Wt('n02', 'мок')
const scr = (inner, bg = '#f3eefc') => `<div style="position:absolute;inset:0;background:${bg}">${inner}</div>`
ov(n2 + 0.1, mk - 0.1, (lt) => SCREEN(LAP, 250, scr(`<div style="position:absolute;left:0;right:0;top:0;height:30px;background:#8a62d6"></div>${TX(10, 9, 230, 11, '#fff', '1 НОВОЕ ПИСЬМО')}
 ${TX(12, 40, 230, 9, '#6d6290', 'UNIVERSITY · MANCHESTER')}${TX(12, 60, 230, 15, '#160f24', 'OFFER: <span style="color:#c8304a">7.0</span>')}
 ${TX(12, 90, 230, 10, '#160f24', 'НИ ОДНОЙ ЧАСТИ<br>НИЖЕ <span style="color:#c8304a">6.5</span>', 'left', '', 'line-height:1.7')}
 <div style="position:absolute;left:12px;top:136px;width:${Math.min(1, lt / 1.2) * 220}px;height:5px;background:#ffd23f"></div>`)), { anim: 'fade', out: 0 })
ov(mk - 0.1, c('n03'), (lt) => SCREEN(LAP, 360, scr(`${TX(14, 12, 330, 11, '#ff5a6e', 'MOCK TEST · ДЕНЬ 0')}` + SK.map(([k, col], i) => {
  const v = [5, 5, 5, 6][i], y = 40 + i * 30
  return TX(16, y + 2, 30, 12, col, k) + `<div class="bar" style="left:46px;top:${y}px;width:210px;height:18px;border-width:2px"><i style="width:${(v / 9) * 100 * Math.min(1, lt / 0.4)}%;background:${col}"></i></div>` + TX(270, y + 2, 70, 12, '#f7f3ff', v.toFixed(1), 'right')
}).join('') + TX(16, 168, 200, 11, '#a89cc8', 'OVERALL') + TX(200, 160, 140, 22, '#ff5a6e', '5.5', 'right', 'stroke'), '#1e1736')), { anim: 'fade', out: 0 })
fx(mk - 0.1, mk + 0.05, () => `<div style="position:absolute;inset:0;background:rgba(255,90,110,.25)"></div>`)
ov(e('n02') - 0.55, c('n03'), (lt) => ROW(690, `<div style="filter:blur(${Math.max(0, 3 - lt * 4)}px);display:flex;gap:10px">${CHIPC('В ФИНАЛЕ: OVERALL ?.?', 'var(--yellow)', 15)}</div>`), { anim: 'up' })
;[['ВСЕЛЕННАЯ 1 · READING', 'var(--yellow)'], ['ВСЕЛЕННАЯ 2 · SPEAKING', 'var(--mint)'], ['ВСЕЛЕННАЯ 3 · WRITING', 'var(--pink)'], ['ВСЕЛЕННАЯ 4 · LISTENING', 'var(--sky)']].forEach(([t, col], i) =>
  ov(n3 + i * fl, n3 + (i + 1) * fl, () => ROW(236, CHIPC(t, col, 13)), { anim: 'fade', out: 0 }))

// ---------- HUD ----------
HUD = { from: e('t01') - 0.1, to: END, hide: [], states: [
  { t: 0, day: 1, vals: [5, 5, 5, 6] }, { t: c('n05'), day: 6, vals: [5, 5, 5, 6] }, { t: c('n06'), day: 12, vals: [5.5, 5.5, 5, 6] },
  { t: c('n07'), day: 30, vals: [6.5, 7, 5, 6.5], hot: true }, { t: c('m01'), day: 31, vals: [6.5, 7, 5, 6.5], hot: true },
  { t: c('j01'), day: 38, vals: [7, 7, 5.5, 6.5] }, { t: c('n11'), day: 44, vals: [7, 7.5, 5.5, 7] }, { t: c('n12'), day: 55, vals: [7.5, 7.5, 6, 7] }, { t: c('n13'), day: 61, vals: [7.5, 7.5, 6, 7] } ] }

// ---------- RULE 1 + SCHEDULE (on the cork-board area, above his head) ----------
ov(s('n04'), Wt('n04', 'каждый') - 0.1, () => CARD(240, 440, 104, 'var(--pink)', 'ПРАВИЛО №1', TX(0, 30, 440, 17, 'var(--cream)', 'НЕ КАЧАЙ ЧАСТИ<br>ПО ОЧЕРЕДИ', 'center', '', 'line-height:1.7')))
const sched = [['УТРО', 'READING', 'var(--yellow)'], ['ДОРОГА', 'LISTENING', 'var(--sky)'], ['ВЕЧЕР', 'WRITING', 'var(--pink)'], ['НОЧЬ', 'SPEAKING', 'var(--mint)']]
ov(Wt('n04', 'каждый') - 0.1, c('n05'), (lt) => CARD(240, 440, 196, 'var(--yellow)', 'КАЖДЫЙ ДЕНЬ · ВСЕ 4', sched.map(([a, b, col], i) => `<div style="${anim(lt - i * 0.12, 99, 'left', 0)}position:absolute;inset:0">${TX(26, 32 + i * 38, 150, 13, 'var(--grey)', a)}${TX(170, 30 + i * 38, 250, 16, col, b)}</div>`).join('')))

// ---------- READING ----------
ov(Wt('n05', 'сначала') - 0.1, Wt('n05', 'вопросе') - 0.1, () => ROW(236, CHIPC('1. ВОПРОСЫ', 'var(--yellow)', 15) + CHIPC('2. ТЕКСТ', 'var(--cream)', 15)), { anim: 'down' })
ov(Wt('n05', 'вопросе') - 0.1, Wt('n05', 'если') - 0.1, (lt) => CARD(604, 460, 168, 'var(--yellow)', 'ПАРАФРАЗ',
  TX(0, 28, 460, 11, 'var(--grey)', 'В ВОПРОСЕ', 'center') + TX(0, 48, 460, 17, 'var(--cream)', 'a big problem', 'center') +
  `<div style="opacity:${clamp((lt - 1.3) / 0.2)}">${TX(0, 90, 460, 11, 'var(--grey)', 'В ТЕКСТЕ', 'center')}${TX(0, 110, 460, 17, 'var(--yellow)', 'a significant issue', 'center')}</div>`))
ov(Wt('n05', 'если') - 0.1, c('n06'), () => ROW(660, CHIPC('НЕТ ИНФЫ → NOT GIVEN', 'var(--pink)', 16)), { anim: 'up' })

// ---------- LISTENING ----------
ov(Wt('n06', 'число') - 0.1, c('x01'), () => ROW(690, ['ЧИСЛО?', 'ИМЯ?', 'МЕСТО?'].map((t) => CHIPC(t, 'var(--sky)', 15)).join('')), { anim: 'up' })
ov(s('x01'), c('n07'), (lt, d, t) => {
  const struck = t > Wt('x01', 'sorry') - 0.05, fixed = t > Wt('x01', 'forty') - 0.05
  let h = `<div style="position:absolute;left:30px;top:30px;display:flex;gap:5px;align-items:end;height:34px">` + Array.from({ length: 30 }, (_, i) => `<div style="width:8px;background:var(--yellow);height:${6 + Math.abs(Math.sin(i * 1.7 + t * 9)) * 28}px;border-radius:2px"></div>`).join('') + `</div>`
  h += TX(120, 84, 80, 30, struck ? 'var(--red)' : 'var(--cream)', '14', 'center', 'stroke', struck ? 'text-decoration:line-through;text-decoration-thickness:5px' : '')
  if (fixed) h += `<div style="position:absolute;left:210px;top:92px">${ARROW(4)}</div>` + TX(260, 84, 80, 30, 'var(--mint)', '40', 'center', 'stroke2')
  return CARD(610, 420, 140, 'var(--yellow)', 'ЛОВУШКА', h)
}, { anim: 'up' })

// ---------- DAY 30 ----------
fx(s('n07'), e('n08'), (lt) => `<div style="position:absolute;inset:0;background:rgba(10,4,20,${Math.min(0.3, lt * 0.12)})"></div>`)
ov(s('n07') + 0.15, c('n08'), () => ROW(700, CHIPC('ДЕНЬ 30', 'var(--red)', 20)), { anim: 'up' })
ov(s('n08'), e('n08') + 0.25, (lt) => CARD(612, 440, 178, 'var(--lilac)', 'MOCK · ДЕНЬ 30', SK.map(([k, col], i) => {
  const v = [6.5, 7, 5, 6.5][i], y = 30 + i * 34, hot = i === 2, g = clamp((lt - i * 0.12) / 0.45), sh = hot && lt > 0.9 ? Math.sin(lt * 50) * 3 : 0
  return `<div style="position:absolute;inset:0;transform:translateX(${sh}px)">${TX(24, y + 3, 30, 15, col, k)}<div class="bar" style="left:62px;top:${y}px;width:260px;${hot && lt > 0.9 ? 'border-color:var(--red)' : ''}"><i style="width:${(lerp(i === 3 ? 6 : 5, v, g) / 9) * 100}%;background:${hot ? 'var(--red)' : col}"></i></div>${TX(330, y + 3, 90, 15, hot ? 'var(--red)' : 'var(--mint)', v.toFixed(1) + (hot ? ' =' : ' ↑'), 'right')}</div>`
}).join('')), { anim: 'up' })

// ---------- WRITING ----------
HUD.hide.push([c('m01'), c('n09')])
ov(Wt('n09', 'второе') - 0.1, Wt('n09', 'позиция') - 0.1, () => ROW(236, CHIPC('TASK 2 = ×2', 'var(--pink)', 18) + CHIPC('НАЧНИ С НЕГО', 'var(--cream)', 13)), { anim: 'down' })
const sk = [['ВСТУПЛЕНИЕ', 'ПОЗИЦИЯ'], ['ДОВОД 1', '1 МЫСЛЬ'], ['ДОВОД 2', '1 МЫСЛЬ'], ['ВЫВОД', 'ИТОГ']]
ov(Wt('n09', 'позиция') - 0.1, Wt('n09', 'первом', 1) - 0.1, (lt) => CARD(240, 440, 192, 'var(--pink)', 'ЭССЕ · 4 АБЗАЦА', sk.map(([a, b], i) => `<div style="${anim(lt - i * 0.3, 99, 'left', 0)}position:absolute;inset:0">${TX(24, 32 + i * 38, 240, 15, 'var(--cream)', `${i + 1}. ${a}`)}${TX(260, 34 + i * 38, 156, 12, 'var(--pink)', b, 'right')}</div>`).join('')))
ov(Wt('n09', 'первом', 1) - 0.1, c('j01'), () => CARD(240, 440, 96, 'var(--yellow)', 'TASK 1', TX(0, 26, 440, 18, 'var(--yellow)', 'OVERVIEW!', 'center') + TX(0, 60, 440, 11, 'var(--grey)', 'БЕЗ НЕГО — МАКСИМУМ 5', 'center')))

// ---------- SPEAKING ----------
ov(Wt('n10', 'схема') - 0.1, Wt('n10', 'бойся') - 0.1, (lt) => CARD(630, 520, 92, 'var(--mint)', 'СХЕМА ОТВЕТА',
  `<div style="position:absolute;left:0;right:0;top:28px;display:flex;justify-content:center;align-items:center;gap:10px">` + ['ОТВЕТ', 'ПОЧЕМУ', 'ПРИМЕР'].map((t, i) => `<div style="${anim(lt - i * 0.3, 99, 'pop', 0)}">${CHIPC(t, 'var(--mint)', 13)}</div>` + (i < 2 ? ARROW(3, '#7fe0a8') : '')).join('') + `</div>`), { anim: 'up' })
ov(Wt('n10', 'бойся') - 0.1, c('mum'), () => ROW(680, CHIPC('БЕГЛОСТЬ > ГРАММАТИКА', 'var(--mint)', 15)), { anim: 'up' })

// ---------- NIGHT / SLEEP ----------
HUD.hide.push([c('mum'), c('n12')])
ov(s('mum') - 0.05, c('n11'), () => ROW(650, CHIPC('ДЕНЬ 44 · 02:00', 'var(--lilac)', 15)), { anim: 'up' })
ov(s('n11') + 0.1, c('n12'), (lt) => CARD(600, 460, 180, 'var(--lilac)', 'ПРАВИЛО №2', TX(0, 28, 460, 17, 'var(--cream)', 'СОН = ПОДГОТОВКА', 'center') +
  `<div style="opacity:${clamp((lt - 2.2) / 0.2)}">${TX(0, 70, 460, 12, 'var(--grey)', 'ПОСЛЕДНИЕ 2 НЕДЕЛИ', 'center')}${TX(0, 96, 460, 13, 'var(--cream)', 'ПН–СБ · ПОЛНЫЙ МОК', 'center')}${TX(0, 122, 460, 13, 'var(--yellow)', 'ВС · ВЫХОДНОЙ', 'center')}</div>`), { anim: 'up' })

// ---------- DAY 55 ----------
ov(s('n12'), c('n13'), (lt) => CARD(612, 440, 178, 'var(--mint)', 'MOCK · ДЕНЬ 55', SK.map(([k, col], i) => {
  const v = [7.5, 7.5, 6, 7][i], y = 30 + i * 34, g = clamp((lt - i * 0.12) / 0.6)
  return TX(24, y + 3, 30, 15, col, k) + `<div class="bar" style="left:62px;top:${y}px;width:260px"><i style="width:${(lerp([6.5, 7, 5, 6.5][i], v, g) / 9) * 100}%;background:${col}"></i></div>` + TX(330, y + 3, 90, 15, i === 2 ? 'var(--pink)' : 'var(--mint)', v.toFixed(1) + ' ↑', 'right')
}).join('')), { anim: 'up' })

// ---------- EXAM ----------
HUD.hide.push([c('n13'), END + 1])
ov(s('n13') + 0.05, s('n13') + 2.2, () => ROW(236, CHIPC('ДЕНЬ 60 · ЭКЗАМЕН', 'var(--yellow)', 17)), { anim: 'down' })

// ---------- RESULT on the phone screen ----------
const PH = [520, 666, 997, 1619]
const rows = [['LISTENING', 'var(--sky)', 8, 'лиснинг'], ['READING', 'var(--yellow)', 8, 'ридинг'], ['SPEAKING', 'var(--mint)', 7.5, 'спикинг'], ['WRITING', 'var(--pink)', 6.5, 'шесть']]
ov(c('n14'), tOv, (lt, d, t) => SCREEN(PH, 260, `<div style="position:absolute;inset:0;background:linear-gradient(#2f2556,#160f24)"></div>
  <div style="position:absolute;left:0;right:0;top:22px;display:flex;justify-content:center">${owlSvg(3)}</div>${TX(0, 70, 260, 12, 'var(--yellow)', 'IELTS · РЕЗУЛЬТАТ', 'center')}` +
  rows.map(([k, col, v, w], i) => {
    const y = 110 + i * 78, ta = Wt('n14', w) - 0.05, on = t >= ta, g = clamp((t - ta) / 0.45)
    let h = TX(18, y, 150, 11, col, k) + TX(160, y - 4, 82, 18, on ? 'var(--cream)' : '#6d6290', on ? v.toFixed(1) : '?', 'right')
    h += `<div class="bar" style="left:18px;top:${y + 24}px;width:224px;height:16px;border-width:2px"><i style="width:${g * (v / 9) * 100}%;background:${col}"></i></div>`
    if (i === 3) h += on ? `<div style="position:absolute;left:18px;top:${y + 50}px">${CHECK(2)}</div>` + TX(46, y + 50, 200, 9, 'var(--mint)', 'ПОРОГ 6.5 — ЕСТЬ!') : TX(18, y + 50, 230, 9, `rgba(255,210,63,${0.5 + 0.5 * Math.abs(Math.sin(t * 6))})`, 'НУЖНО МИНИМУМ 6.5')
    return h
  }).join(''), `box-shadow:0 0 30px rgba(255,210,63,.5)`), { anim: 'fade', out: 0 })
ov(tOv, c('j02'), () => CARD(650, 360, 130, 'var(--yellow)', '', TX(0, 18, 360, 15, 'var(--cream)', 'OVERALL', 'center') + TX(0, 50, 360, 54, 'var(--yellow)', '7.5', 'center', 'stroke2')), { anim: 'slam' })
fx(tOv, tOv + 0.15, (lt) => `<div style="position:absolute;inset:0;background:#fff;opacity:${0.8 - lt * 5}"></div>`)
ov(s('j02') - 0.1, c('n15'), () => CARD(650, 420, 100, 'var(--mint)', 'JAKE · 21:04', TX(0, 30, 420, 15, 'var(--cream)', 'See you in<br>Manchester, mate!', 'center', '', 'line-height:1.6')), { anim: 'up' })

// ---------- CTA ----------
ov(s('n15') + 0.1, END + 1, () => CARD(210, 460, 128, 'var(--pink)', '', TX(0, 24, 460, 17, 'var(--cream)', 'С КАКОЙ ЧАСТИ<br>НАЧАЛ БЫ ТЫ?', 'center', '', 'line-height:1.7') + TX(0, 90, 460, 13, 'var(--yellow)', 'ПИШИ В КОММЕНТЫ ↓', 'center')), { anim: 'pop', out: 0 })
ov(Wt('n15', 'сова') - 0.1, END + 1, () => ROW(364, `<div style="display:flex;align-items:center;gap:12px">${owlSvg(3)}<div style="font-family:Fr;font-weight:650;font-variation-settings:'SOFT' 100,'WONK' 1;font-size:38px;color:#fff1c9;text-shadow:3px 4px 0 #160f24">Owlington</div></div>`), { anim: 'up', out: 0 })
