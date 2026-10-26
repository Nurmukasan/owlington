// Packs every unrecorded Owl FM broadcast into Google AI Studio speech jobs (Gemini TTS, single speaker):
// one job per speaker per part, lines as paragraphs with a long pause between them, so
// scripts/audio-build.mjs can cut the takes back into lines.
// Usage: node scripts/aistudio-pack.mjs <outdir>
//   <outdir>/<id>/plan.json      the chunk plan audio-build.mjs reads
//   <outdir>/<id>/<chunk>.txt    voice, style and text to paste into AI Studio; save the take as <id>__<chunk>.wav
import { mkdirSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const [outDir] = process.argv.slice(2)
const MAX = 1800
const ACCENT = { 'en-GB': 'British', 'en-AU': 'Australian', 'en-US': 'American', 'en-NZ': 'New Zealand', 'en-IE': 'Irish', 'en-ZA': 'South African', 'en-IN': 'Indian', 'en-CA': 'Canadian' }
const VOICES = {
  f: ['Kore', 'Aoede', 'Leda', 'Zephyr', 'Despina', 'Callirrhoe', 'Autonoe', 'Erinome'],
  m: ['Puck', 'Orus', 'Fenrir', 'Iapetus', 'Algieba', 'Enceladus', 'Umbriel', 'Achird'],
}
const ANNOUNCER = 'Charon'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { loadSet } = await server.ssrLoadModule('/src/pages/student/listening/tests.ts')
const { allPracticeSets: practiceSets } = await server.ssrLoadModule('/src/pages/student/listening/content.ts')
const manifest = ['test,title,file,voice,accent,speaker,lines,chars']
let jobs = 0
let total = 0
for (const info of practiceSets) {
  const set = await loadSet(info.id)
  if (set.audio) continue
  const starts = set.parts?.map((p) => p.start) ?? [0]
  const partOf = (i) => starts.filter((s) => s <= i).length
  // a distinct Gemini voice for every speaker in this broadcast
  const used = { f: 0, m: 0 }
  const voiceOf = {}
  for (const sp of set.speakers) voiceOf[sp.id] = sp.id === 'ann' ? ANNOUNCER : VOICES[sp.gender][used[sp.gender]++ % VOICES[sp.gender].length]
  const bySpeaker = new Map()
  set.script.forEach((item, i) => {
    if ('wait' in item) return
    const key = item.s === 'ann' ? 'ann' : `${partOf(i)}-${item.s}`
    if (!bySpeaker.has(key)) bySpeaker.set(key, [])
    bySpeaker.get(key).push(i)
  })
  const chunks = []
  for (const [key, items] of bySpeaker) {
    const sp = set.speakers.find((s) => s.id === set.script[items[0]].s)
    let cur = []
    let len = 0
    const flush = () => {
      if (!cur.length) return
      const lines = cur.map((i) => set.script[i].say ?? set.script[i].t)
      chunks.push({ name: `${key}-${chunks.filter((c) => c.key === key).length + 1}`, key, speaker: sp, items: cur, lines })
      cur = []
      len = 0
    }
    for (const i of items) {
      const t = set.script[i].say ?? set.script[i].t
      if (len + t.length > MAX) flush()
      cur.push(i)
      len += t.length + 2
    }
    flush()
  }
  const dir = `${outDir}/${info.id}`
  mkdirSync(dir, { recursive: true })
  writeFileSync(`${dir}/plan.json`, JSON.stringify(chunks.map(({ name, key, items, lines }) => ({ name, key, items, chars: lines.join('').length })), null, 1))
  for (const c of chunks) {
    const accent = ACCENT[c.speaker.accents[0]] ?? 'British'
    const voice = voiceOf[c.speaker.id]
    const file = `${info.id}__${c.name}.wav`
    const style =
      `Read aloud as ${c.speaker.name}, ${c.speaker.role.toLowerCase()}, in a recorded IELTS Listening test. ` +
      `Natural ${accent} English accent, calm and clear, at a normal exam pace. ` +
      `Read every paragraph exactly as written: do not add, skip or change any words, and do not read these instructions. ` +
      `After every paragraph, pause for two full seconds of silence before the next one.`
    const text = c.lines.join('\n\n')
    writeFileSync(
      `${dir}/${c.name}.txt`,
      `SAVE AS: ${file}\nMODE: Single-speaker audio\nVOICE: ${voice}\nPARAGRAPHS: ${c.lines.length}\n\nSTYLE INSTRUCTIONS:\n${style}\n\nTEXT:\n${text}\n`,
    )
    manifest.push([info.id, `"${info.title}"`, file, voice, accent, `"${c.speaker.name}"`, c.lines.length, text.length].join(','))
    jobs++
    total += text.length
  }
  console.log(`${info.id}: ${chunks.length} jobs`)
}
writeFileSync(`${outDir}/MANIFEST.csv`, manifest.join('\n') + '\n')
console.log(`${jobs} jobs, ${total} chars`)
await server.close()
