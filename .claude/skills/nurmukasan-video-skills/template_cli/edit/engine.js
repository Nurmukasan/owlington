// Minimal deterministic compositor: renderAt(t) draws one frame.
const FPS = 24
const LINES = Object.fromEntries(TL.lines.map((l) => [l.k, l]))
const L = (k) => LINES[k]
const norm = (s) => s.toLowerCase().replace(/[^a-zа-яё0-9.,]/gi, '')
function Wt(k, sub, n = 0) { // time of the n-th word in line k containing sub
  const ws = L(k).words.filter(([w]) => norm(w).includes(norm(sub)))
  if (!ws[n]) throw new Error('word not found ' + k + ' ' + sub)
  return ws[n][1]
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x))
const lerp = (a, b, u) => a + (b - a) * u
const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2)
const easeOut = (u) => 1 - Math.pow(1 - u, 3)
const back = (u) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2) }

const SHOTS = [], OVS = [], FX = []
let HUD = null, CAP_HIDE = [], CAP_STYLE = {}
function shot(t0, t1, o) { SHOTS.push({ t0, t1, ...o }) }
function ov(a, b, f, o = {}) { OVS.push({ a, b, f, ...o }) }
function fx(a, b, f) { FX.push({ a, b, f }) }

// enter/exit animation wrapper -> style string
function anim(lt, d, kind = 'pop', out = 0.2) {
  let op = 1, tr = ''
  const u = clamp(lt / 0.28)
  if (kind === 'pop') { const s = lt < 0.28 ? lerp(0.55, 1, back(u)) : 1; tr = `scale(${s})`; op = clamp(lt / 0.12) }
  else if (kind === 'slam') { const s = lt < 0.22 ? lerp(2.2, 1, easeOut(clamp(lt / 0.22))) : 1; tr = `scale(${s})`; op = clamp(lt / 0.08) }
  else if (kind === 'down') { tr = `translateY(${lerp(-50, 0, easeOut(u))}px)`; op = clamp(lt / 0.15) }
  else if (kind === 'up') { tr = `translateY(${lerp(50, 0, easeOut(u))}px)`; op = clamp(lt / 0.15) }
  else if (kind === 'left') { tr = `translateX(${lerp(-80, 0, easeOut(u))}px)`; op = clamp(lt / 0.15) }
  else if (kind === 'fade') { op = clamp(lt / 0.25) }
  if (out && d - lt < out) op *= clamp((d - lt) / out)
  return `opacity:${op.toFixed(3)};transform:${tr};`
}
// pixel sprites
const OWL = ['..o..........o..', '..oo........oo..', '..obo......obo..', '.obbboooooobbbo.', '.obbbbbbbbbbbbo.', 'obbwwwwbbwwwwbbo', 'obwyyyywwyyyywbo', 'obwyhkywwyhkywbo', 'obwykkynnykkywbo', 'obwyyyynnyyyywbo', 'obbbwwwnnwwwbbbo', '.obbbbbbbbbbbbo.', '..oooooooooooo..']
const OWLP = { o: '#1e120c', b: '#7f5236', w: '#f3e3c3', y: '#ffb627', k: '#120c08', h: '#ffffff', n: '#f08a24' }
function sprite(rows, pal, p) {
  let r = ''
  rows.forEach((row, y) => [...row].forEach((c, x) => { if (pal[c]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[c]}"/>` }))
  return `<svg width="${rows[0].length * p}" height="${rows.length * p}" viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" style="display:block">${r}</svg>`
}
const owlSvg = (p) => sprite(OWL, OWLP, p)
const CHECK = (p = 4, c = '#7fe0a8') => sprite(['........cc', '.......ccc', 'c.....ccc.', 'cc...ccc..', 'ccc.ccc...', '.ccccc....', '..ccc.....'], { c }, p)
const ARROW = (p = 4, c = '#ffd23f') => sprite(['....c...', '....cc..', 'cccccccc', 'cccccccc', '....cc..', '....c...'], { c }, p)

// ---------- helpers for cards ----------
const P = (x, y, w, h, bd = 'var(--lilac)', extra = '') => `<div class="panel" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-color:${bd};${extra}"></div>`
const TX = (x, y, w, size, col, text, align = 'left', cls = '', extra = '') => `<div class="p ${cls}" style="left:${x}px;top:${y}px;width:${w}px;font-size:${size}px;color:${col};text-align:${align};${extra}">${text}</div>`
const CHIP = (x, y, text, bg = 'var(--pink)', size = 16, extra = '') => `<div class="chip" style="left:${x}px;top:${y}px;background:${bg};font-size:${size}px;${extra}">${text}</div>`
const TAB = (x, y, text, bg = 'var(--pink)', extra = '') => `<div class="tab" style="left:${x}px;top:${y}px;background:${bg};${extra}">${text}</div>`
const G = (style, inner, origin = 'center center') => `<div style="position:absolute;inset:0;transform-origin:${origin};${style}">${inner}</div>`

// ---------- captions ----------
const WHO = { // speaker -> [label, tabColor, textColor]
  t01: ['ТИМУР', 'var(--sky)', '#d9efff'], t02: ['ТИМУР', 'var(--sky)', '#d9efff'], m01: ['МАРГАРЕТ · ЭДИНБУРГ', 'var(--lilac)', '#eadcff'],
  j01: ['ДЖЕЙК · МАНЧЕСТЕР', 'var(--mint)', '#d4ffe6'], j02: ['ДЖЕЙК · МАНЧЕСТЕР', 'var(--mint)', '#d4ffe6'], mum: ['МАМА', 'var(--mint)', '#d4ffe6'],
  ex1: ['EXAMINER', 'var(--sky)', '#d9efff'], inv: ['INVIGILATOR', 'var(--grey)', '#e8e2ff'], x01: ['АУДИО · PART 1', 'var(--yellow)', '#fff3c2'],
}
const TR = { m01: 'Тимур. Идеи нормальные. Абзацы — каша.', j01: 'Бро, хватит зубрить. Просто болтай со мной!', ex1: 'Опишите человека, который помог вам чему-то научиться.',
  t02: 'Вообще-то двое. Парень из Манчестера… и леди из Эдинбурга.', j02: 'Увидимся в Манчестере, бро!', inv: 'Можете начинать.', x01: 'Автобус уходит в четырнадцать… простите, в сорок минут десятого.' }
function chunks(line) {
  const out = []; let cur = []
  for (const w of line.words) {
    const len = cur.map((x) => x[0]).join(' ').length
    if (cur.length && (len + w[0].length > 34 || /[.!?…]$/.test(cur[cur.length - 1][0]) && len > 10)) { out.push(cur); cur = [] }
    cur.push(w)
  }
  if (cur.length) out.push(cur)
  return out.map((c, i, arr) => ({ words: c, a: c[0][1] - 0.05, b: i + 1 < arr.length ? arr[i + 1][0][1] - 0.05 : line.end + 0.25 }))
}
function captionAt(t) {
  if (CAP_HIDE.some(([a, b]) => t >= a && t < b)) return ''
  for (const line of TL.lines) {
    if (t < line.start - 0.05 || t > line.end + 0.3) continue
    for (const c of chunks(line)) {
      if (t < c.a || t >= c.b) continue
      const who = WHO[line.k]; const col = who ? who[2] : '#f7f3ff'
      let h = ''
      if (who) h += TAB(360 - (who[0].length * 13 + 30) / 2, 818, who[0], who[1])
      h += `<div class="cap">` + c.words.map(([w, wt]) => `<span style="color:${t >= wt ? (/\d|восемь|семь|шесть|пять/.test(w.toLowerCase()) && !who ? '#ffd23f' : col) : col};opacity:${t >= wt ? 1 : 0.45}">${w}</span>`).join('') + `</div>`
      if (TR[line.k]) h += TX(70, 872 + (c.words.map((x) => x[0]).join(' ').length > 20 ? 92 : 50), 580, 15, '#cfc6ea', TR[line.k], 'center', 'stroke', 'line-height:1.5')
      return h
    }
  }
  return ''
}
// ---------- HUD ----------
const SK = [['L', '#a8d8ff'], ['R', '#ffd23f'], ['W', '#ff8fc7'], ['S', '#7fe0a8']]
function hudHtml(day, vals, hot) {
  let h = P(56, 128, 300, 84, 'var(--lilac)')
  h += `<div style="position:absolute;left:68px;top:141px;width:56px;height:58px;background:#3a2f66;border-radius:8px"></div><div style="position:absolute;left:72px;top:150px">${owlSvg(3)}</div>`
  h += TX(136, 146, 210, 17, 'var(--cream)', day > 60 ? 'ЭКЗАМЕН' : `ДЕНЬ ${day}/60`)
  h += `<div style="position:absolute;left:136px;top:178px;width:206px;height:12px;background:#4a3f72;border-radius:4px"><div style="width:${clamp(day / 60) * 100}%;height:100%;background:var(--yellow);border-radius:4px"></div></div>`
  h += P(376, 128, 288, 84, hot ? 'var(--red)' : 'var(--lilac)')
  SK.forEach(([s, c], i) => {
    const x = 392 + i * 66; const v = vals[i]
    h += TX(x, 142, 60, 12, c, s, 'center')
    h += TX(x, 166, 60, 15, i === 2 && hot ? 'var(--red)' : 'var(--cream)', v.toFixed(1), 'center')
  })
  return h
}
function hudAt(t) {
  if (!HUD) return ''
  for (const [a, b] of HUD.hide) if (t >= a && t < b) return ''
  if (t < HUD.from || t >= HUD.to) return ''
  let st = HUD.states[0]
  for (const s of HUD.states) if (t >= s.t) st = s
  const lt = t - HUD.from
  return `<div style="${anim(lt, 999, 'down', 0)}position:absolute;inset:0">${hudHtml(st.day, st.vals, st.hot)}</div>`
}
// ---------- frame ----------
const imgCache = {}
function setBg(el, src, s, x, y, w0, h0) {
  if (el.dataset.src !== src) { el.src = src; el.dataset.src = src }
  const base = Math.max(720 / w0, 1280 / h0) * s
  const W = w0 * base, H = h0 * base
  const ox = (720 - W) * x, oy = (1280 - H) * y
  el.style.width = W + 'px'; el.style.height = H + 'px'; el.style.transform = `translate(${ox}px,${oy}px)`
  el.style.display = 'block'
}
window.renderAt = async function (t) {
  const sh = SHOTS.find((s) => t >= s.t0 && t < s.t1) || SHOTS[SHOTS.length - 1]
  const u = clamp((t - sh.t0) / (sh.t1 - sh.t0)); const e = sh.lin ? u : ease(u)
  const z = sh.z || [1, 1.06], px = sh.px || [0.5, 0.5], py = sh.py || [0.5, 0.5]
  let src, w0 = 720, h0 = 1280
  if (sh.clip) {
    const n = (window.CLIPN || {})[sh.clip] || 9999
    const idx = Math.min(n, Math.max(1, Math.floor(((t - sh.t0) * (sh.speed || 1) + (sh.from || 0)) * FPS) + 1))
    src = `../clips/f/${sh.clip}/${String(idx).padStart(4, '0')}.jpg`
  } else { src = `../st/${sh.img}.png`; w0 = 1520; h0 = 2688 }
  const A = document.getElementById('bgA'); document.getElementById('bgB').style.display = 'none'
  setBg(A, src, lerp(z[0], z[1], e), lerp(px[0], px[1], e), lerp(py[0], py[1], e), w0, h0)
  A.style.filter = sh.filter ? sh.filter(t - sh.t0) : ''
  // fx (flash, vignette, darken) + overlays + hud + captions
  let f = `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(10,6,20,.55) 100%)"></div>`
  f += `<div style="position:absolute;left:0;right:0;top:780px;height:260px;background:linear-gradient(rgba(14,9,26,0),rgba(14,9,26,.5) 45%,rgba(14,9,26,.5) 70%,rgba(14,9,26,0))"></div>`
  for (const x of FX) if (t >= x.a && t < x.b) f += x.f(t - x.a, x.b - x.a)
  document.getElementById('fx').innerHTML = f
  let h = ''
  for (const o of OVS) if (t >= o.a && t < o.b) h += `<div style="position:absolute;inset:0;transform-origin:${o.origin || '50% 50%'};${anim(t - o.a, o.b - o.a, o.anim || 'pop', o.out ?? 0.2)}">${o.f(t - o.a, o.b - o.a, t)}</div>`
  h += hudAt(t) + captionAt(t)
  document.getElementById('ov').innerHTML = h
  if (!A.complete || !A.naturalWidth) await new Promise((r) => { A.onload = r; A.onerror = r })
  await document.fonts.ready
}
