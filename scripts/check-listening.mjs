// Checks every listening broadcast: evidence in the script, answers in the evidence, word limits, ranges.
// Run: node scripts/check-listening.mjs [id ...]
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { practiceSets } = await server.ssrLoadModule('/src/pages/student/listening/content.ts')
const { loadSet } = await server.ssrLoadModule('/src/pages/student/listening/tests.ts')
const { countAnswer, overLimit } = await server.ssrLoadModule('/src/pages/student/listening/answers.ts')
const { liveRanges, GROUP_LABEL } = await server.ssrLoadModule('/src/pages/student/listening/practice/script.ts')

const only = process.argv.slice(2)
let problems = 0
const report = (id, msg) => {
  problems++
  console.log(`  ✗ ${id}: ${msg}`)
}
const tidy = (s) => s.toLowerCase().replace(/[‘’`]/g, "'").replace(/\s+/g, ' ').trim()
const letters = (s) => s.toLowerCase().replace(/[^a-z]/g, '')
const digits = (s) => s.replace(/[^\d]/g, '')

for (const info of practiceSets) {
  if (only.length && !only.includes(info.id)) continue
  const set = await loadSet(info.id)
  if (!set) {
    report(info.id, 'no data')
    continue
  }
  const qs = set.groups.flatMap((g) => g.questions)
  const lines = set.script.filter((i) => !('wait' in i))
  const words = lines.filter((l) => l.s !== 'ann').reduce((n, l) => n + l.t.split(/\s+/).length, 0)
  const chars = lines.reduce((n, l) => n + (l.say ?? l.t).length, 0)
  console.log(`${info.id}: ${qs.length} questions, ${lines.length} lines, ${words} words, ${chars} chars${set.audio ? ', recorded' : ''}`)
  if (qs.length !== info.questionCount) report(info.id, `catalogue says ${info.questionCount}, set has ${qs.length}`)
  const labels = [...new Set(set.groups.map((g) => GROUP_LABEL[g.type]))]
  const missing = labels.filter((l) => !info.kinds.includes(l))
  const extra = info.kinds.filter((l) => !labels.includes(l))
  if (missing.length || extra.length) report(info.id, `kinds differ: missing [${missing}] extra [${extra}]`)
  qs.forEach((q, i) => {
    if (i && q.n !== qs[i - 1].n + 1) report(info.id, `question ${q.n} out of sequence`)
  })
  const ranges = liveRanges(set.script).filter(Boolean)
  for (const q of qs) if (!ranges.some(([a, b]) => q.n >= a && q.n <= b)) report(info.id, `Q${q.n} never announced`)
  for (const sp of new Set(lines.map((l) => l.s))) if (!set.speakers.some((s) => s.id === sp)) report(info.id, `unknown speaker ${sp}`)

  for (const g of set.groups) {
    // a letter pin sitting on a shape's centred label hides the label
    for (const sh of g.map?.shapes ?? []) {
      if (!('w' in sh) || !sh.label) continue
      const [cx, cy] = [sh.x + sh.w / 2, sh.y + sh.h / 2]
      for (const [k, [x, y]] of Object.entries(g.map.points))
        if (Math.abs(x - cx) < 18 + sh.label.length * 4 && Math.abs(y - cy) < 22) report(info.id, `map letter ${k} covers the label "${sh.label}"`)
    }
    const said = g.instruction?.match(/Questions (\d+)–(\d+)/)
    if (said) {
      const [a, b] = [g.questions[0].n, g.questions[g.questions.length - 1].n]
      if (+said[1] !== a || +said[2] !== b) report(info.id, `instruction says Questions ${said[1]}–${said[2]}, group is ${a}–${b}`)
      const count = said.input.match(/Choose (\w+) answers/)?.[1]
      const WORDS = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT']
      if (count && WORDS.indexOf(count) !== g.questions.length) report(info.id, `instruction says ${count} answers, group has ${g.questions.length}`)
    }
    for (const q of g.questions) {
      const where = `${info.id} Q${q.n}`
      const line = lines.find((l) => l.t.includes(q.evidence))
      if (!line) {
        report(where, `evidence not in script: "${q.evidence}"`)
        continue
      }
      if (q.kind === 'gap') {
        const ev = tidy(q.evidence)
        const ok =
          ev.includes(tidy(q.answer)) ||
          (q.numeric && digits(ev).includes(digits(q.answer))) ||
          letters(q.evidence).includes(letters(q.answer))
        if (!ok) report(where, `answer "${q.answer}" not in evidence "${q.evidence}"`)
        for (const a of [q.answer, ...(q.accept ?? [])]) if (overLimit(a, g.limit)) report(where, `"${a}" over limit ${g.limit?.text}`)
      } else {
        const keys = (q.kind === 'choice' ? q.options : g.options ?? []).map((o) => o.key)
        if (!keys.includes(q.answer)) report(where, `answer ${q.answer} not an option`)
      }
      if (!q.explain || q.explain.length < 15) report(where, 'explanation too short')
    }
  }
  for (const t of set.traps) if (!lines.some((l) => l.t.includes(t.phrase))) report(info.id, `trap not in script: "${t.phrase}"`)
}
console.log(problems ? `\n${problems} problem(s)` : '\nAll listening tests look consistent.')
await server.close()
process.exit(problems ? 1 : 0)
