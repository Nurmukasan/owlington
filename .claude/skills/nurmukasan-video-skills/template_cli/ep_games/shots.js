const { chromium } = require('playwright'); const T5 = process.argv[2]
const jobs = JSON.parse(process.argv[3])
;(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1600, height: 1600 } })
  await p.goto('file://' + T5 + '/ui/ui.html'); await p.evaluate(() => document.fonts.ready)
  for (const [name, fn, W, H, n] of jobs) {
    await p.evaluate(([fn, W, H, n]) => { document.getElementById('root').innerHTML = window[fn](W, H, n) }, [fn, W, H, n])
    await p.waitForTimeout(50)
    const bad = await p.evaluate(() => { const r = document.querySelector('#root > div').getBoundingClientRect(); const m = r.width * 0.04
      return [...document.querySelectorAll('#root .t')].filter((e) => { const b = e.getBoundingClientRect(); return b.right > r.right - m || b.left < r.left + m * 0.5 || b.bottom > r.bottom - m * 0.5 }).map((e) => e.textContent).concat((() => { const ts = [...document.querySelectorAll('#root .t')].map((e) => [e, e.getBoundingClientRect()]); const o = []; for (let i = 0; i < ts.length; i++) for (let k = i + 1; k < ts.length; k++) { const a = ts[i][1], b = ts[k][1]; if (a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2) o.push('overlap: ' + ts[i][0].textContent + ' / ' + ts[k][0].textContent) } return o })()) })
    if (bad.length) { console.error('OVERFLOW in', name, bad); process.exitCode = 3 }
    await (await p.$('#root > div')).screenshot({ path: `${T5}/ui/${name}.png` })
  }
  await b.close()
})()
