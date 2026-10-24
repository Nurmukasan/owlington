// Two more reference shots from the real site: a Reading full test at 35/40 (Band 8.0)
// and the rank-up to Scholar Owl on the profile. Needs the dev server and keys.json (answers).
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire('/opt/node22/lib/node_modules/')
const { chromium } = require('playwright')
const B = 'http://127.0.0.1:5173'
const OUT = new URL('./assets/', import.meta.url).pathname
const keys = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(`${B}/login`)
await page.waitForTimeout(1200)
await page.fill('input[name=email]', 'dana.omarova@student.owlington.app')
await page.fill('input[name=password]', 'owl-student-2026')
await page.click('button[type=submit]')
await page.waitForTimeout(1800)
const uid = await page.evaluate(() => localStorage.getItem('owlington:session'))

// Reading full test 1, five answers left out → 35/40
const answers = { ...keys.reading['full-01'] }
for (const k of Object.keys(answers).slice(-5)) delete answers[k]
await page.evaluate(([uid, answers]) => localStorage.setItem(`owlington:rd-draft:${uid}:full-01`, JSON.stringify({ answers, flagged: [], highlights: [], elapsed: 3300, savedAt: new Date().toISOString() })), [uid, answers])
await page.goto(`${B}/student/reading/practice/full-01`)
await page.waitForTimeout(1500)
await page.locator('.rd-ticket__go').first().click()
await page.waitForTimeout(1000)
await page.locator('.rd-deskbar__submit').first().click()
await page.waitForTimeout(600)
const anyway = page.getByRole('button', { name: /Submit anyway/ })
if (await anyway.count()) await anyway.click()
await page.waitForTimeout(3200)
await page.screenshot({ path: `${OUT}site-result-band8.png` })

// Profile: bring XP just below 1,900 with first attempts, then cross it on camera
await page.goto(`${B}/student/profile`)
await page.waitForTimeout(2000)
const step = (target) =>
  page.evaluate(
    async ([uid, target]) => {
      const m = await import('/src/learn/progress.ts')
      const c = await import('/src/learn/catalog.ts')
      const st = m.getProgressStore(uid)
      for (const section of ['listening', 'reading']) {
        for (const p of c.CATALOG[section].practiceSets) {
          const xp = st.getSnapshot().xp
          if (xp >= target) return xp
          if (st.getSnapshot().firsts[`${section}:${p.id}`]) continue
          const score = Math.max(0, Math.min(p.questionCount, target - xp))
          st.recordAttempt(section, { practiceId: p.id, score, total: p.questionCount, durationSec: p.minutes * 50 })
        }
      }
      return st.getSnapshot().xp
    },
    [uid, target],
  )
let xp = 0
for (const target of [1700, 1800, 1850, 1880, 1890, 1895]) xp = await step(target)
console.log('xp before crossing', xp)
if (xp >= 1900) throw new Error('crossed too early: ' + xp)
await page.goto(`${B}/student/profile`)
await page.waitForTimeout(2500)
console.log('xp after', await step(1905))
await page.waitForTimeout(700)
await page.screenshot({ path: `${OUT}site-rank-up.png` })
await page.waitForTimeout(8000)
await page.goto(`${B}/student/profile`)
await page.waitForTimeout(2200)
await page.screenshot({ path: `${OUT}site-profile-scholar.png` })
console.log(errors.join('\n') || 'no errors')
await browser.close()
