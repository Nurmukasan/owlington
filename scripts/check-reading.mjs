// Checks every reading test against its catalogue entry and the passage text.
// Run: node scripts/check-reading.mjs [test-id ...]
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { practiceSets } = await server.ssrLoadModule('/src/pages/student/reading/content.ts')
const { loadTest } = await server.ssrLoadModule('/src/pages/student/reading/tests.ts')
const { KIND_LABEL, wordCount, normalise } = await server.ssrLoadModule('/src/pages/student/reading/practice-logic.ts')

const only = process.argv.slice(2)
let problems = 0
const seenIds = new Set()
const report = (id, msg) => {
  problems++
  console.log(`  ✗ ${id}: ${msg}`)
}

for (const info of practiceSets) {
  if (only.length && !only.includes(info.id)) continue
  const test = await loadTest(info.id)
  if (!test) {
    report(info.id, 'no test data')
    continue
  }
  const qs = test.passages.flatMap((p) => p.groups.flatMap((g) => g.questions))
  const words = test.passages.map((p) => p.paragraphs.reduce((n, para) => n + para.sentences.reduce((m, s) => m + wordCount(s.text), 0), 0))
  const tf = { TRUE: 0, FALSE: 0, 'NOT GIVEN': 0, YES: 0, NO: 0 }
  console.log(`${info.id} (${info.format ?? 'focused'}): ${qs.length} questions, ${test.passages.length} passage(s), words ${words.join('/')}`)
  if (qs.length !== info.questionCount) report(info.id, `catalogue says ${info.questionCount} questions, test has ${qs.length}`)
  if (info.format === 'full' && (qs.length !== 40 || test.passages.length !== 3)) report(info.id, 'a full test needs 3 passages and 40 questions')
  const labels = [...new Set(test.passages.flatMap((p) => p.groups.map((g) => KIND_LABEL[g.kind])))]
  const missing = labels.filter((l) => !info.kinds.includes(l))
  const extra = info.kinds.filter((l) => !labels.includes(l))
  if (missing.length || extra.length) report(info.id, `kinds differ: missing [${missing}] extra [${extra}]`)

  test.passages.forEach((p, pi) => {
    const sids = new Map(p.paragraphs.flatMap((para) => para.sentences.map((s) => [s.id, s.text])))
    const full = [...sids.values()].join(' ').toLowerCase()
    for (const g of p.groups) {
      for (const q of g.questions) {
        const where = `${q.id} (P${pi + 1} ${g.kind})`
        if (seenIds.has(q.id)) report(where, 'duplicate id')
        seenIds.add(q.id)
        if (!q.evidence.length) report(where, 'no evidence')
        for (const e of q.evidence) if (!sids.has(e)) report(where, `evidence ${e} not in passage`)
        if (!q.explanation || q.explanation.length < 20) report(where, 'explanation missing or too short')
        if (q.type === 'tfng' || q.type === 'ynng') tf[q.answer]++
        if (q.type === 'mcq') {
          const i = 'ABCDEFG'.indexOf(q.answer)
          if (i < 0 || i >= q.options.length) report(where, `answer ${q.answer} out of range`)
        }
        if (q.type === 'choose' || q.type === 'pick') {
          if (!g.options?.some((o) => o.value === q.answer)) report(where, `answer ${q.answer} not an option`)
        }
        if (q.type === 'choose' && g.kind === 'headings' && q.paragraph && !sids.has(`${q.paragraph}1`))
          report(where, `paragraph ${q.paragraph} does not exist`)
        if (q.type === 'gap') {
          if (g.options) {
            if (!g.options.some((o) => o.value === q.answers[0])) report(where, `answer ${q.answers[0]} not in the box`)
          } else {
            for (const a of q.answers)
              if (g.maxWords && wordCount(a) > g.maxWords) report(where, `"${a}" is over the ${g.maxWords}-word limit`)
            const main = normalise(q.answers[0])
            const evText = q.evidence.map((e) => sids.get(e) ?? '').join(' ').toLowerCase()
            if (!full.includes(main)) report(where, `"${q.answers[0]}" is not in the passage`)
            else if (!evText.includes(main)) report(where, `"${q.answers[0]}" is not in its evidence ${q.evidence}`)
          }
        }
      }
      if (g.kind === 'choose2') {
        const picks = g.questions.map((q) => q.answer)
        if (new Set(picks).size !== picks.length) report(`${p.id} choose2`, 'duplicate answers')
      }
      if (g.kind === 'headings' && g.options && g.options.length <= g.questions.length)
        report(`${p.id} headings`, 'needs more headings than questions')
    }
  })
  const tfLine = Object.entries(tf)
    .filter(([, n]) => n)
    .map(([k, n]) => `${k} ${n}`)
    .join(', ')
  if (tfLine) console.log(`    ${tfLine}`)
}

console.log(problems ? `\n${problems} problem(s)` : '\nAll reading tests look consistent.')
await server.close()
process.exit(problems ? 1 : 0)
