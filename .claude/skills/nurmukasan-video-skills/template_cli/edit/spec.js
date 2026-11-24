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
shot(c('n14'), tOv, { img: 'phone_pov', z: [1.0, 1.0], py: [0.3, 0.3] })
ov(c('n14'), tOv, (lt) => `<div style="position:absolute;left:250px;top:321px;width:220px;height:446px;border-radius:18px;background:linear-gradient(#2f2556,#160f24);box-shadow:0 0 ${30 + 10 * Math.sin(lt * 5)}px rgba(255,210,63,.55)"></div><div style="position:absolute;left:316px;top:600px">${owlSvg(5)}</div>${TX(250, 690, 220, 13, 'var(--yellow)', 'IELTS · TRF', 'center')}`, { anim: 'fade', out: 0 })
shot(tOv, c('j02'), { clip: 'c11', speed: 0.5 })
shot(c('j02'), c('n15'), { img: 'jake', z: [1.15, 1.25], py: [0.25, 0.22] })
shot(c('n15'), c('n15') + 3, { clip: 'c12', speed: 0.55 })
shot(c('n15') + 3, END + 1, { img: 'owl_close', z: [1.25, 1.35], py: [0.6, 0.62] })

// ---------- HOOK ----------
fx(0, 0.18, (lt) => `<div style="position:absolute;inset:0;background:#fff;opacity:${1 - lt / 0.18}"></div>`)
ov(0, c('n02'), (lt) => `${TX(40, 1004, 640, 34, 'var(--cream)', 'ВСЕ 4 ЧАСТИ.', 'center', 'stroke2')}${TX(40, 1060, 640, 46, 'var(--yellow)', '60 ДНЕЙ.', 'center', 'stroke2')}`, { anim: 'slam', out: 0.15 })
CAP_HIDE.push([0, c('n02')]) // hook title replaces captions in the first 4 s

// ---------- STAKES ----------
const n2 = s('n02'), mk = Wt('n02', 'мок')
ov(n2 + 0.1, mk - 0.1, () => `${P(70, 236, 580, 230, 'var(--sky)')}${TAB(92, 218, 'НОВОЕ ПИСЬМО · MANCHESTER', 'var(--sky)')}
 ${TX(100, 270, 520, 18, 'var(--grey)', 'UNIVERSITY OFFER')}
 ${TX(100, 312, 520, 30, 'var(--cream)', 'IELTS <span style="color:var(--yellow)">7.0</span>')}
 ${TX(100, 368, 520, 17, 'var(--cream)', 'НИ ОДНОЙ ЧАСТИ<br>НИЖЕ <span style="color:var(--yellow)">6.5</span>', 'left', '', 'line-height:1.6')}`, { anim: 'pop' })
const mockCard = (vals, o = 5.5, hot = -1) => {
  let h = P(110, 224, 500, 268, 'var(--red)') + TAB(132, 206, 'MOCK · ДЕНЬ 0', 'var(--red)')
  SK.forEach(([k, col], i) => {
    const y = 262 + i * 44
    h += TX(136, y + 3, 40, 18, col, k)
    h += `<div class="bar" style="left:186px;top:${y}px;width:300px"><i style="width:${(vals[i] / 9) * 100}%;background:${i === hot ? 'var(--red)' : col}"></i></div>`
    h += TX(498, y + 3, 90, 18, i === hot ? 'var(--red)' : 'var(--cream)', vals[i].toFixed(1))
  })
  return h + TX(136, 446, 220, 16, 'var(--grey)', 'OVERALL') + TX(380, 438, 200, 30, 'var(--red)', o.toFixed(1), 'right', 'stroke')
}
ov(mk - 0.1, c('n03'), () => mockCard([5, 5, 5, 6]), { anim: 'slam' })
ov(e('n02') - 0.55, c('n03'), (lt) => `<div style="position:absolute;left:180px;top:520px;filter:blur(${Math.max(0, 3 - lt * 4)}px)">${P(0, 0, 360, 84, 'var(--yellow)')}${TX(18, 18, 324, 16, 'var(--grey)', 'В ФИНАЛЕ', 'center')}${TX(18, 44, 324, 22, 'var(--yellow)', 'OVERALL ?.?', 'center')}</div>`, { anim: 'up' })
// four universes: labels + red down arrows
;[['ВСЕЛЕННАЯ 1 · READING', 'var(--yellow)'], ['ВСЕЛЕННАЯ 2 · SPEAKING', 'var(--mint)'], ['ВСЕЛЕННАЯ 3 · WRITING', 'var(--pink)'], ['ВСЕЛЕННАЯ 4 · LISTENING', 'var(--sky)']].forEach(([t, col], i) =>
  ov(n3 + i * fl, n3 + (i + 1) * fl, () => CHIP(360 - (t.length * 15 + 38) / 2, 230, t, col, 15) + TX(150, 300, 420, 15, '#ff9aa8', 'ОСТАЛЬНЫЕ ЧАСТИ ↓', 'center', 'stroke'), { anim: 'fade', out: 0 }))

// ---------- DECISION ----------
const day1 = c('n04')
HUD = { from: e('t01') - 0.1, to: END, hide: [], states: [
  { t: 0, day: 1, vals: [5, 5, 5, 6] }, { t: c('n05'), day: 6, vals: [5, 5, 5, 6] }, { t: c('n06'), day: 12, vals: [5.5, 5.5, 5, 6] },
  { t: c('n07'), day: 30, vals: [6.5, 7, 5, 6.5], hot: true }, { t: c('m01'), day: 31, vals: [6.5, 7, 5, 6.5], hot: true },
  { t: c('j01'), day: 38, vals: [7, 7, 5.5, 6.5] }, { t: c('n11'), day: 44, vals: [7, 7.5, 5.5, 7] }, { t: c('n12'), day: 55, vals: [7.5, 7.5, 6, 7] }, { t: c('n13'), day: 61, vals: [7.5, 7.5, 6, 7] } ] }
ov(s('n04'), Wt('n04', 'каждый') - 0.1, () => `${P(70, 300, 580, 160, 'var(--pink)')}${TAB(92, 282, 'ПРАВИЛО №1', 'var(--pink)')}${TX(96, 334, 530, 20, 'var(--cream)', 'НЕ КАЧАЙ ЧАСТИ<br>ПО ОЧЕРЕДИ', 'left', '', 'line-height:1.7')}`)
const sched = [['УТРО', 'READING', 'var(--yellow)', '1 ТЕКСТ'], ['ДОРОГА', 'LISTENING', 'var(--sky)', 'ПОДКАСТ'], ['ВЕЧЕР', 'WRITING', 'var(--pink)', '1 ЭССЕ'], ['НОЧЬ', 'SPEAKING', 'var(--mint)', 'ДЖЕЙК']]
ov(Wt('n04', 'каждый') - 0.1, c('n05'), (lt) => P(70, 250, 580, 300, 'var(--yellow)') + TAB(92, 232, 'КАЖДЫЙ ДЕНЬ · ВСЕ 4', 'var(--yellow)') + sched.map(([a, b, col, d], i) => `<div style="${anim(lt - i * 0.12, 99, 'left', 0)}position:absolute;inset:0">${TX(96, 284 + i * 64, 150, 15, 'var(--grey)', a)}${TX(236, 280 + i * 64, 220, 20, col, b)}${TX(460, 284 + i * 64, 170, 15, 'var(--cream)', d, 'right')}</div>`).join(''))

// ---------- READING ----------
const n5 = s('n05')
ov(Wt('n05', 'сначала') - 0.1, Wt('n05', 'вопросе') - 0.1, () => CHIP(160, 236, '1. ВОПРОСЫ  2. ТЕКСТ', 'var(--yellow)', 17))
ov(Wt('n05', 'вопросе') - 0.1, Wt('n05', 'если') - 0.1, (lt) => `${P(70, 228, 580, 192, 'var(--yellow)')}${TAB(92, 210, 'ПАРАФРАЗ', 'var(--yellow)')}
 ${TX(96, 254, 520, 13, 'var(--grey)', 'ВОПРОС:')}${TX(96, 276, 520, 20, 'var(--cream)', 'a big problem')}
 <div style="position:absolute;left:520px;top:300px">${ARROW(4)}</div>
 <div style="opacity:${clamp((lt - 1.4) / 0.2)}">${TX(96, 334, 520, 13, 'var(--grey)', 'В ТЕКСТЕ:')}${TX(96, 356, 520, 20, 'var(--yellow)', 'a significant issue')}</div>`)
ov(Wt('n05', 'если') - 0.1, c('n06'), () => CHIP(120, 236, 'НЕТ ИНФЫ → NOT GIVEN', 'var(--pink)', 18) + CHIP(196, 316, '20 МИН НА ТЕКСТ', 'var(--cream)', 15), { anim: 'down' })

// ---------- LISTENING ----------
ov(Wt('n06', 'число') - 0.1, c('x01'), () => ['ЧИСЛО?', 'ИМЯ?', 'МЕСТО?'].map((t, i) => CHIP(70 + i * 196, 236, t, 'var(--sky)', 17)).join(''), { anim: 'down' })
ov(s('x01'), c('n07'), (lt, d, t) => {
  const struck = t > Wt('x01', 'sorry') - 0.05
  let h = P(70, 236, 580, 210, 'var(--yellow)') + TAB(92, 218, 'ЛОВУШКА', 'var(--yellow)')
  h += `<div style="position:absolute;left:100px;top:280px;display:flex;gap:6px;align-items:end;height:50px">` + Array.from({ length: 34 }, (_, i) => `<div style="width:9px;background:var(--yellow);height:${8 + Math.abs(Math.sin(i * 1.7 + t * 9)) * 40}px;border-radius:2px"></div>`).join('') + `</div>`
  h += TX(100, 360, 200, 40, struck ? 'var(--red)' : 'var(--cream)', '14', 'left', 'stroke', struck ? 'text-decoration:line-through;text-decoration-thickness:6px' : '')
  if (t > Wt('x01', 'forty') - 0.05) h += `<div style="position:absolute;left:230px;top:372px">${ARROW(5)}</div>` + TX(320, 360, 200, 40, 'var(--mint)', '40', 'left', 'stroke2')
  return h
})

// ---------- DAY 30 TWIST ----------
fx(s('n07'), e('n08'), (lt) => `<div style="position:absolute;inset:0;background:rgba(10,4,20,${Math.min(0.35, lt * 0.15)})"></div>`)
ov(s('n07') + 0.15, s('n07') + 1.9, () => P(170, 236, 380, 92, 'var(--red)') + TX(170, 262, 380, 36, 'var(--red)', 'ДЕНЬ 30', 'center', 'stroke'), { anim: 'down' })
const bars30 = (lt) => {
  const v = [6.5, 7, 5, 6.5]; let h = P(110, 226, 500, 196, 'var(--lilac)') + TAB(132, 208, 'MOCK · ДЕНЬ 30', 'var(--lilac)')
  SK.forEach(([k, col], i) => {
    const y = 256 + i * 38, hot = i === 2, g = clamp((lt - i * 0.15) / 0.5)
    const sh = hot && lt > 0.9 ? Math.sin(lt * 50) * 4 : 0
    h += `<div style="position:absolute;inset:0;transform:translateX(${sh}px)">` + TX(136, y + 3, 40, 18, col, k)
    h += `<div class="bar" style="left:186px;top:${y}px;width:300px;${hot && lt > 0.9 ? 'border-color:var(--red)' : ''}"><i style="width:${(lerp(i === 3 ? 6 : 5, v[i], g) / 9) * 100}%;background:${hot ? 'var(--red)' : col}"></i></div>`
    h += TX(498, y + 3, 90, 18, hot ? 'var(--red)' : 'var(--mint)', v[i].toFixed(1) + (hot ? '' : ' ↑')) + '</div>'
  })
  return h
}
ov(s('n08'), c('m01'), bars30)

// ---------- WRITING ----------
HUD.hide.push([c('m01'), c('n09')])
const n9 = s('n09')
ov(Wt('n09', 'второе') - 0.1, Wt('n09', 'позиция') - 0.1, () => CHIP(150, 610, 'TASK 2 = ×2 БАЛЛОВ', 'var(--pink)', 18) + CHIP(220, 690, 'НАЧИНАЙ С НЕГО', 'var(--cream)', 15), { anim: 'down' })
const sk = [['ВСТУПЛЕНИЕ', 'ПОЗИЦИЯ'], ['ДОВОД 1', '1 МЫСЛЬ'], ['ДОВОД 2', '1 МЫСЛЬ'], ['ВЫВОД', 'ПОВТОР']]
ov(Wt('n09', 'позиция') - 0.1, Wt('n09', 'первом', 1) - 0.1, (lt) => P(70, 500, 580, 296, 'var(--pink)') + TAB(92, 482, 'ЭССЕ · 4 АБЗАЦА', 'var(--pink)') + sk.map(([a, b], i) => `<div style="${anim(lt - i * 0.35, 99, 'left', 0)}position:absolute;inset:0">${P(96, 524 + i * 64, 528, 52, 'var(--lilacD)', 'box-shadow:none')}${TX(118, 542 + i * 64, 300, 17, 'var(--cream)', a)}${TX(400, 544 + i * 64, 200, 14, 'var(--pink)', b, 'right')}</div>`).join(''))
ov(Wt('n09', 'первом', 1) - 0.1, c('j01'), () => CHIP(120, 610, 'TASK 1: OVERVIEW!', 'var(--yellow)', 20) + CHIP(150, 694, 'НЕТ OVERVIEW → МАКС 5', 'var(--red)', 14), { anim: 'down' })

// ---------- SPEAKING ----------
ov(Wt('n10', 'схема') - 0.1, Wt('n10', 'бойся') - 0.1, (lt) => P(70, 236, 580, 160, 'var(--mint)') + TAB(92, 218, 'СХЕМА ОТВЕТА', 'var(--mint)') + ['ОТВЕТ', 'ПОЧЕМУ', 'ПРИМЕР'].map((t, i) => `<div style="${anim(lt - i * 0.3, 99, 'pop', 0)};position:absolute;inset:0;transform-origin:${150 + i * 210}px 320px">${CHIP(96 + i * 190, 292, t, 'var(--mint)', 15)}</div>`).join('') + `<div style="position:absolute;left:262px;top:356px">${ARROW(3, '#7fe0a8')}</div><div style="position:absolute;left:452px;top:356px">${ARROW(3, '#7fe0a8')}</div>`)
ov(Wt('n10', 'бойся') - 0.1, c('mum'), () => CHIP(150, 236, 'БЕГЛОСТЬ > ГРАММАТИКА', 'var(--mint)', 17), { anim: 'down' })

// ---------- LOW POINT / SLEEP ----------
HUD.hide.push([c('mum'), c('n12')])
ov(s('mum') - 0.05, s('mum') + 1.6, () => P(60, 600, 300, 92, 'var(--lilac)') + TX(60, 618, 300, 26, 'var(--cream)', 'ДЕНЬ 44', 'center', 'stroke') + TX(60, 656, 300, 15, 'var(--grey)', '02:00', 'center'), { anim: 'down' })
ov(s('n11') + 0.1, c('n12'), (lt) => P(70, 236, 580, 230, 'var(--lilac)') + TAB(92, 218, 'ПРАВИЛО №2', 'var(--lilac)') + TX(96, 268, 530, 20, 'var(--cream)', 'СОН = ПОДГОТОВКА') +
  `<div style="opacity:${clamp((lt - 2.2) / 0.2)}">${TX(96, 320, 530, 15, 'var(--grey)', 'НЕДЕЛИ 7–8:')}${TX(96, 350, 530, 16, 'var(--cream)', 'ПН–СБ · ПОЛНЫЙ МОК')}${TX(96, 384, 530, 16, 'var(--yellow)', 'ВС · ВЫХОДНОЙ')}${TX(96, 418, 530, 16, 'var(--mint)', 'СОН В 23:00')}</div>`)

// ---------- MONTAGE UP ----------
ov(s('n12'), c('n13'), (lt) => {
  const v = [7.5, 7.5, 6, 7]; let h = P(110, 580, 500, 222, 'var(--mint)') + TAB(132, 562, 'MOCK · ДЕНЬ 55', 'var(--mint)')
  SK.forEach(([k, col], i) => { const y = 614 + i * 44, g = clamp((lt - i * 0.12) / 0.6); h += TX(136, y + 3, 40, 18, col, k) + `<div class="bar" style="left:186px;top:${y}px;width:300px"><i style="width:${(lerp([6.5, 7, 5, 6.5][i], v[i], g) / 9) * 100}%;background:${col}"></i></div>` + TX(498, y + 3, 90, 18, i === 2 ? 'var(--pink)' : 'var(--mint)', v[i].toFixed(1) + ' ↑') })
  return h
})

// ---------- EXAM ----------
HUD.hide.push([c('n13'), END + 1])
ov(s('n13') + 0.05, s('n13') + 2.2, () => P(170, 236, 380, 120, 'var(--yellow)') + TX(170, 258, 380, 36, 'var(--yellow)', 'ДЕНЬ 60', 'center', 'stroke') + TX(170, 312, 380, 15, 'var(--cream)', 'ЭКЗАМЕН', 'center'), { anim: 'down' })

// ---------- RESULT ----------
const rows = [['LISTENING', 'var(--sky)', 8, 'лиснинг'], ['READING', 'var(--yellow)', 8, 'ридинг'], ['SPEAKING', 'var(--mint)', 7.5, 'спикинг'], ['WRITING', 'var(--pink)', 6.5, 'шесть']]
ov(s('n14'), tOv, (lt, d, t) => {
  let h = P(80, 180, 560, 380, 'var(--yellow)') + TAB(102, 162, 'IELTS · РЕЗУЛЬТАТ', 'var(--yellow)')
  rows.forEach(([k, col, v, w], i) => {
    const y = 226 + i * 66, ta = Wt('n14', w) - 0.05, on = t >= ta, g = clamp((t - ta) / 0.45)
    h += TX(104, y + 4, 200, 16, col, k)
    h += `<div class="bar" style="left:290px;top:${y}px;width:200px;height:26px"><i style="width:${g * (v / 9) * 100}%;background:${col}"></i></div>`
    h += TX(500, y + 2, 110, 22, on ? 'var(--cream)' : 'var(--grey2)', on ? v.toFixed(1) : '?', 'right')
    if (i === 3) {
      if (!on) h += TX(104, y + 34, 500, 13, `rgba(255,210,63,${0.55 + 0.45 * Math.abs(Math.sin(t * 6))})`, 'НУЖНО МИНИМУМ 6.5')
      else h += `<div style="position:absolute;left:110px;top:${y + 36}px">${CHECK(3)}</div>` + TX(150, y + 36, 460, 13, 'var(--mint)', 'РОВНО ПОРОГ — ПРОХОДИТ')
    }
  })
  return h
}, { anim: 'pop' })
ov(tOv, c('j02'), () => P(150, 620, 420, 150, 'var(--yellow)') + TX(150, 642, 420, 18, 'var(--cream)', 'OVERALL', 'center') + TX(150, 680, 420, 62, 'var(--yellow)', '7.5', 'center', 'stroke2'), { anim: 'slam' })
fx(tOv, tOv + 0.15, (lt) => `<div style="position:absolute;inset:0;background:#fff;opacity:${0.8 - lt * 5}"></div>`)
ov(s('j02') - 0.1, c('n15'), () => `${P(90, 640, 540, 120, 'var(--mint)')}${TAB(112, 622, 'JAKE · 21:04', 'var(--mint)')}${TX(116, 680, 490, 18, 'var(--cream)', 'See you in<br>Manchester, mate!', 'left', '', 'line-height:1.6')}`, { anim: 'up' })

// ---------- CTA ----------
ov(s('n15') + 0.1, END + 1, (lt) => `${P(80, 200, 560, 170, 'var(--pink)')}${TX(100, 228, 520, 19, 'var(--cream)', 'С КАКОЙ ЧАСТИ<br>НАЧАЛ БЫ ТЫ?', 'center', '', 'line-height:1.7')}${TX(100, 318, 520, 16, 'var(--yellow)', 'ПИШИ В КОММЕНТЫ ↓', 'center')}`, { anim: 'pop', out: 0 })
ov(Wt('n15', 'сова') - 0.1, END + 1, () => `<div style="position:absolute;left:200px;top:410px;display:flex;align-items:center;gap:14px">${owlSvg(4)}<div style="font-family:Fr;font-weight:650;font-variation-settings:'SOFT' 100,'WONK' 1;font-size:44px;color:#fff1c9;text-shadow:3px 4px 0 #160f24">Owlington</div></div>`, { anim: 'up', out: 0 })
