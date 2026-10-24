// Checks every writing prompt: visuals consistent, notes quote the model answer, and
// the model answer passes its own checklist (at least 9 of 10 points).
// Run: node scripts/check-writing.mjs [id ...]
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { practiceSets } = await server.ssrLoadModule('/src/pages/student/writing/content.ts')
const { loadPrompt, loadFullTest } = await server.ssrLoadModule('/src/pages/student/writing/library.ts')
const { checkEssay } = await server.ssrLoadModule('/src/pages/student/writing/prompts.ts')
const { countWords } = await server.ssrLoadModule('/src/pages/student/writing/analysis.ts')

const only = process.argv.slice(2)
let problems = 0
const report = (id, msg) => {
  problems++
  console.log(`  ✗ ${id}: ${msg}`)
}

function checkFigure(id, f) {
  if (!f) return
  if (f.kind === 'multi') return f.parts.forEach((p) => checkFigure(id, p))
  if (f.kind === 'line' || f.kind === 'bar') {
    const xs = f.kind === 'line' ? f.xs : f.categories
    for (const s of f.series) {
      if (s.values.length !== xs.length) report(id, `${s.label}: ${s.values.length} values for ${xs.length} points`)
      if (s.values.some((v) => v > f.yMax || v < 0)) report(id, `${s.label}: value outside 0–${f.yMax}`)
    }
  }
  if (f.kind === 'pie')
    for (const p of f.pies) {
      if (p.values.length !== f.slices.length) report(id, `${p.label}: ${p.values.length} values for ${f.slices.length} slices`)
      const sum = p.values.reduce((a, b) => a + b, 0)
      if (Math.abs(sum - 100) > 0.6) report(id, `${p.label}: slices add up to ${sum}`)
      if (f.slices.length > 5) report(id, 'more than five slices')
    }
  if (f.kind === 'table') for (const r of f.rows) if (r.length !== f.columns.length) report(id, `row ${r[0]}: ${r.length} cells for ${f.columns.length} columns`)
}

function checkPrompt(id, p, minScore) {
  checkFigure(id, p.figure)
  const words = countWords(p.model.text)
  if (words < p.minWords) report(id, `model answer is ${words} words (minimum ${p.minWords})`)
  if (words > p.minWords + 160) report(id, `model answer is long: ${words} words`)
  for (const n of p.model.notes) if (!p.model.text.includes(n.quote)) report(id, `note quote not in model: "${n.quote.slice(0, 60)}"`)
  if ((p.bulletChecks?.length ?? 0) !== p.checks.filter((c) => /^(bullet|part)-/.test(c)).length) report(id, 'bullet/part checks do not match')
  const results = checkEssay(p, p.model.text)
  const met = results.filter((r) => r.met).length
  const missed = results.filter((r) => !r.met).map((r) => r.id)
  if (met < minScore) report(id, `model meets ${met}/${results.length} (missed: ${missed.join(', ')})`)
  return `${words}w ${met}/${results.length}${missed.length ? ` (−${missed.join(',')})` : ''}`
}

for (const info of practiceSets) {
  if (only.length && !only.includes(info.id)) continue
  if (info.format === 'full') {
    const t = await loadFullTest(info.id)
    if (!t) {
      report(info.id, 'no data')
      continue
    }
    if (t.task1.task === 'task2' || t.task2.task !== 'task2') report(info.id, 'tasks in the wrong order')
    console.log(`${info.id}: T1 ${checkPrompt(t.task1.id, t.task1, 9)} · T2 ${checkPrompt(t.task2.id, t.task2, 9)}`)
  } else {
    const p = await loadPrompt(info.id)
    if (!p) {
      report(info.id, 'no data')
      continue
    }
    console.log(`${info.id}: ${checkPrompt(info.id, p, 9)}`)
  }
}
console.log(problems ? `\n${problems} problem(s)` : '\nAll writing prompts look consistent.')
await server.close()
process.exit(problems ? 1 : 0)
