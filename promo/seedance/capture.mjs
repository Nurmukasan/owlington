// Builds the Seedance reference pack in promo/seedance/assets from the real site.
// Needs the dev server: npx vite --port 5173 (repo root). Run: node promo/seedance/capture.mjs
import { createRequire } from 'node:module'
const require = createRequire('/opt/node22/lib/node_modules/')
const { chromium } = require('playwright')
const B = 'http://127.0.0.1:5173'
const OUT = new URL('./assets/', import.meta.url).pathname
const browser = await chromium.launch()
const errors = []

// 1. mascot poses + logo (transparent PNG)
{
  const page = await browser.newPage({ viewport: { width: 2400, height: 1400 } })
  page.on('pageerror', (e) => errors.push(e.message))
  for (const name of ['front', 'point', 'happy', 'wink', 'logo', 'sheet']) {
    await page.goto(`${B}/promo/index.html?asset=${name}`)
    await page.evaluate(() => document.fonts.ready)
    await page.addStyleTag({ content: 'html,body{background:transparent!important}' })
    await page.waitForTimeout(400)
    await page.locator('#asset').screenshot({ path: `${OUT}owl-${name}.png`, omitBackground: name !== 'sheet' })
  }
  await page.close()
}

// 2. the real interface, as a seeded student
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 })
const page = await ctx.newPage()
page.on('pageerror', (e) => errors.push(e.message))
const go = async (path, wait = 1500) => {
  await page.goto(B + path)
  await page.waitForTimeout(wait)
}
const shot = (name, opts = {}) => page.screenshot({ path: `${OUT}${name}.png`, ...opts })

await go('/', 1800)
await shot('site-landing')
await go('/login')
await page.fill('input[name=email]', 'aruzhan.bekova@student.owlington.app')
await page.fill('input[name=password]', 'owl-student-2026')
await page.click('button[type=submit]')
await page.waitForTimeout(2000)
await shot('site-dashboard')
await go('/student/reading')
await shot('site-reading-hub')
await go('/student/reading/lecture/skim-scan', 2000)
await shot('site-lesson')
await go('/student/reading/practice/night-shift', 1500)
await page.locator('.rd-ticket__go').first().click()
await page.waitForTimeout(1200)
await shot('site-reading-test')
await go('/student/listening/practice/part2-park', 1500)
await page.locator('.ls-golive--hero').first().click()
await page.waitForTimeout(1500)
await shot('site-listening-test')

// Writing: a real essay, submitted and self-assessed
const t1 = [
  'The line graph shows how the share of journeys to work made by car, bus and bicycle in Marlow changed between 2005 and 2025.',
  'Overall, the car was the most popular way to travel throughout the period, but its share fell steadily, while cycling grew dramatically. Bus use stayed fairly stable.',
  'In 2005, cars were used for 62% of journeys, compared with 24% for buses and only 6% for bicycles. Over the next twenty years, car journeys declined gradually to 44% in 2020 and then to 38% in 2025.',
  'Cycling followed the opposite trend. It rose slowly to 15% in 2015 and then climbed sharply, reaching 26% in 2020 and 31% by the end of the period. Meanwhile, the figure for buses remained between 23% and 25% until 2015, dipped to 18% in 2020 and recovered slightly to 20% in 2025. As a result, bicycles overtook buses as the second most common mode of transport.',
].join('\n\n')
const t2 = [
  'In many cities, people have to pay to enter museums and art galleries. Some argue that these places should be free for everyone and that the government should cover all of their costs. I strongly agree that entry should be free, but I do not think the state should pay for everything.',
  'Firstly, free entry makes culture available to all. Families with low incomes often cannot afford tickets, so they miss the chance to learn about art and history. When museums in my city stopped charging for entry, the number of school groups and young visitors grew noticeably within a single year. Free museums are also good for the economy. They attract tourists, who spend money in local shops, cafes and hotels, and this creates jobs for local people.',
  'On the other hand, government budgets are limited. If the state paid every cost, there would be less money for schools and hospitals, which most people consider more important. For this reason, museums should also earn their own income. For instance, they can charge for special exhibitions, sell books and souvenirs, and ask companies to sponsor new galleries. Many large museums already receive generous donations from businesses and wealthy individuals, who are happy to see their names on a new exhibition hall.',
  'In conclusion, I believe museums and galleries should not charge visitors for entry, because this gives everyone equal access to culture. However, the costs should be shared between the government, private sponsors and the museums themselves, rather than paid only by taxpayers.',
].join('\n\n')
await go('/student/writing/practice/wfull-01', 1500)
await page.getByRole('button', { name: /Start the clock/ }).click()
await page.waitForTimeout(800)
await page.fill('#wr-editor', t1)
await page.locator('.wr-switch__tab').nth(1).click()
await page.waitForTimeout(600)
await page.fill('#wr-editor', t2)
await page.waitForTimeout(600)
await shot('site-writing-editor')
await page.locator('.wr-bar__submit').click()
await page.waitForTimeout(1200)
await shot('site-writing-review-task1')
await page.getByRole('button', { name: /examine Task 2/ }).click()
await page.waitForTimeout(900)
await shot('site-writing-review')
await page.getByRole('button', { name: /grade yourself/ }).click()
await page.waitForTimeout(800)
await shot('site-writing-selfassess')
for (let t = 0; t < 2; t++) {
  const cards = page.locator('fieldset.wr-crit-card')
  const n = await cards.count()
  for (let i = 0; i < n; i++) await cards.nth(i).locator('input[type=radio]').nth(2).check({ force: true })
  await page.waitForTimeout(300)
  await page.locator('.wr-estimate__seal').click()
  await page.waitForTimeout(1000)
}
await page.waitForTimeout(2500)
await shot('site-writing-result')

await go('/student/profile', 2500)
await shot('site-profile-progress')
await page.evaluate(() => window.scrollTo(0, 900))
await page.waitForTimeout(800)
await shot('site-profile-ranks')
await go('/student/profile?tab=results', 2000)
await shot('site-profile-results')

console.log(errors.join('\n') || 'no errors')
await browser.close()
