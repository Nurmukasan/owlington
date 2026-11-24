const { chromium } = require('playwright'); const T5 = process.argv[2]
const jobs = JSON.parse(process.argv[3])
;(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1600, height: 1600 } })
  await p.goto('file://' + T5 + '/ui/ui.html'); await p.evaluate(() => document.fonts.ready)
  for (const [name, fn, W, H, n] of jobs) {
    await p.evaluate(([fn, W, H, n]) => { document.getElementById('root').innerHTML = window[fn](W, H, n) }, [fn, W, H, n])
    await p.waitForTimeout(50); await (await p.$('#root > div')).screenshot({ path: `${T5}/ui/${name}.png` })
  }
  await b.close()
})()
