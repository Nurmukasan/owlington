// Splits a broadcast's script into ElevenLabs generations: one per speaker per part, in chunks.
// Usage: node scripts/audio-plan.mjs <id> <outdir>   → writes <outdir>/<id>/plan.json
import { mkdirSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const [id, outDir] = process.argv.slice(2)
const MAX = 2400
const SEP = ' [long pause] [long pause] '
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { loadSet } = await server.ssrLoadModule('/src/pages/student/listening/tests.ts')
const set = await loadSet(id)
const starts = set.parts?.map((p) => p.start) ?? [0]
const partOf = (i) => starts.filter((s) => s <= i).length
const chunks = []
const bySpeaker = new Map()
set.script.forEach((item, i) => {
  if ('wait' in item) return
  const key = item.s === 'ann' ? 'ann' : `${partOf(i)}-${item.s}`
  if (!bySpeaker.has(key)) bySpeaker.set(key, [])
  bySpeaker.get(key).push(i)
})
for (const [key, items] of bySpeaker) {
  const sp = set.speakers.find((s) => s.id === set.script[items[0]].s)
  let cur = []
  let len = 0
  const flush = () => {
    if (!cur.length) return
    const text = cur.map((i) => set.script[i].say ?? set.script[i].t).join(SEP)
    chunks.push({ name: `${key}-${chunks.filter((c) => c.key === key).length + 1}`, key, voice: sp.voice, items: cur, text, chars: text.length })
    cur = []
    len = 0
  }
  for (const i of items) {
    const t = set.script[i].say ?? set.script[i].t
    if (len + t.length > MAX) flush()
    cur.push(i)
    len += t.length + SEP.length
  }
  flush()
}
const dir = `${outDir}/${id}`
mkdirSync(dir, { recursive: true })
writeFileSync(`${dir}/plan.json`, JSON.stringify(chunks, null, 1))
console.log(chunks.map((c) => `${c.name}: ${c.items.length} lines, ${c.chars} chars, voice ${c.voice}`).join('\n'))
console.log('total chars', chunks.reduce((n, c) => n + c.chars, 0))
for (const c of chunks) if (!c.voice) console.log('NO VOICE for', c.name)
await server.close()
