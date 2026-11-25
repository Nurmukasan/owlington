// scans the timeline every 0.25 s; reports text that leaves its card/panel or the safe area
const { chromium } = require('playwright'); const T6 = process.argv[2]
;(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 720, height: 1280 } })
  await p.goto('file://' + T6 + '/edit/index.html'); await p.evaluate(() => document.fonts.ready)
  const END = await p.evaluate(() => TL.END); const bad = {}
  for (let t = 0; t < END; t += 0.25) {
    await p.evaluate((t) => renderAt(t), t)
    const issues = await p.evaluate(() => {
      const out = []
      const texts = [...document.querySelectorAll('#ov .p, #ov .chip, #ov .tab')]
      for (const el of texts) {
        const r = el.getBoundingClientRect(); if (r.width === 0) continue
        // text node extent
        const rg = document.createRange(); rg.selectNodeContents(el); const tr = rg.getBoundingClientRect()
        const box = el.closest('[data-card]') || null
        if (tr.left < 56 || tr.right > 664) out.push('safe-x: ' + el.textContent.slice(0, 30))
        if (box) { const br = box.getBoundingClientRect(); if (!el.classList.contains('tab') && (tr.left < br.left + 14 || tr.right > br.right - 14 || tr.top < br.top + 10 || tr.bottom > br.bottom - 12)) out.push('card: ' + el.textContent.slice(0, 30)) }
        if (el.classList.contains('p') && el.style.width && tr.width > parseFloat(el.style.width) + 2) out.push('width: ' + el.textContent.slice(0, 30))
      }
      return out
    })
    for (const i of issues) (bad[i] = bad[i] || []).push(t.toFixed(2))
  }
  for (const [k, v] of Object.entries(bad)) console.log(k, '@', v[0], '…', v[v.length - 1], `(${v.length})`)
  console.log('checked', Object.keys(bad).length, 'issues'); await b.close()
})()
