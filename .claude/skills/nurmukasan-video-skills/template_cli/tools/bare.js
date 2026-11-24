const { chromium } = require('playwright'); const fs = require('fs')
const T5 = process.argv[2]
;(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 720, height: 1280 } })
  await p.addInitScript(() => { window.NOOV = 1 })
  await p.goto('file://' + T5 + '/edit/index.html'); await p.evaluate(() => document.fonts.ready)
  const ovs = await p.evaluate(() => OVS.map((o, i) => [i, o.a, o.b]))
  fs.mkdirSync(T5 + '/edit/bare', { recursive: true })
  for (const [i, a, bb] of ovs) for (const [j, t] of [[0, a + 0.02], [1, (a + bb) / 2], [2, bb - 0.05]]) {
    await p.evaluate((t) => renderAt(t), t); await p.screenshot({ path: `${T5}/edit/bare/o${String(i).padStart(2, '0')}_${j}.png` })
  }
  console.log(JSON.stringify(ovs.map(([i, a, bb]) => [i, +a.toFixed(2), +bb.toFixed(2)])))
  await b.close()
})()
