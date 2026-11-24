// node render.js preview t1,t2,...   -> edit/prev/<t>.png
// node render.js full out.mp4 [fps]  -> pipes JPEG frames into ffmpeg
const { chromium } = require('playwright')
const fs = require('fs'), path = require('path'), { spawn } = require('child_process')
const T5 = path.resolve(__dirname, '..')
const tl = JSON.parse(fs.readFileSync(T5 + '/timeline.json', 'utf8'))
const clipn = {}
for (const d of fs.readdirSync(T5 + '/clips/f')) clipn[d] = fs.readdirSync(T5 + '/clips/f/' + d).length
fs.writeFileSync(T5 + '/edit/timeline.js', `const TL=${JSON.stringify(tl)};window.CLIPN=${JSON.stringify(clipn)};`)
;(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] })
  const p = await b.newPage({ viewport: { width: 720, height: 1280 } })
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)))
  await p.goto('file://' + T5 + '/edit/index.html'); await p.evaluate(() => document.fonts.ready)
  if (errs.length) { console.error(errs); process.exit(1) }
  const mode = process.argv[2]
  if (mode === 'preview') {
    fs.mkdirSync(T5 + '/edit/prev', { recursive: true })
    for (const t of process.argv[3].split(',').map(Number)) {
      await p.evaluate((t) => renderAt(t), t)
      await p.screenshot({ path: `${T5}/edit/prev/${t.toFixed(2)}.png` })
    }
  } else {
    const out = process.argv[3], fps = Number(process.argv[4] || 24), N = Math.round(tl.END * fps)
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] })
    for (let i = 0; i < N; i++) {
      await p.evaluate((t) => renderAt(t), i / fps)
      const buf = await p.screenshot({ type: 'jpeg', quality: 93 })
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
      if (i % 240 === 0) console.log('frame', i, '/', N)
    }
    ff.stdin.end(); await new Promise((r) => ff.on('close', r))
  }
  if (errs.length) console.error(errs)
  await b.close()
})()
