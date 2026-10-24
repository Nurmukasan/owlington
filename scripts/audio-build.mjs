// Cuts each generation into lines at its longest pauses and assembles one recording per broadcast.
// Usage: node scripts/audio-build.mjs <id> <workdir> [--check]
//   <workdir>/<id>/plan.json + <name>.mp3 per chunk  →  public/audio/listening/<id>.mp3
//                                                        src/pages/student/listening/tests/<id>.audio.json
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const [id, work, flag] = process.argv.slice(2)
const RATE = 24000
const FRAME = RATE / 100 // 10 ms
const dir = `${work}/${id}`
const plan = JSON.parse(readFileSync(`${dir}/plan.json`, 'utf8'))

function decode(file) {
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(RATE), '-f', 's16le', '-'], { maxBuffer: 1 << 30 })
  return new Int16Array(raw.buffer, raw.byteOffset, raw.length / 2)
}

/** Silent runs (in frames) where the 10 ms RMS stays below the threshold. */
function silences(pcm, db = -40, minMs = 300) {
  const thr = 32768 * Math.pow(10, db / 20)
  const runs = []
  let start = -1
  const frames = Math.floor(pcm.length / FRAME)
  for (let f = 0; f <= frames; f++) {
    let quiet = true
    if (f < frames) {
      let sum = 0
      for (let i = f * FRAME; i < (f + 1) * FRAME; i++) sum += pcm[i] * pcm[i]
      quiet = Math.sqrt(sum / FRAME) < thr
    }
    if (quiet && f < frames && start < 0) start = f
    if ((!quiet || f === frames) && start >= 0) {
      if ((f - start) * 10 >= minMs) runs.push([start, f])
      start = -1
    }
  }
  return { runs, frames }
}

const segments = {}
let bad = 0
for (const chunk of plan) {
  const file = `${dir}/${chunk.name}.mp3`
  if (!existsSync(file)) {
    console.log(`missing ${file}`)
    bad++
    continue
  }
  const pcm = decode(file)
  const { runs, frames } = silences(pcm)
  // Ignore silence at the very start and end, then take the longest pauses as line breaks.
  const inner = runs.filter(([a, b]) => a > 5 && b < frames - 5)
  const need = chunk.items.length - 1
  const cuts = [...inner].sort((x, y) => y[1] - y[0] - (x[1] - x[0])).slice(0, need).sort((x, y) => x[0] - y[0])
  if (cuts.length < need) {
    console.log(`✗ ${chunk.name}: found ${cuts.length} pauses, need ${need}`)
    bad++
    continue
  }
  // Each line runs from the end of one break to the start of the next, with 60 ms of air either side.
  const lead = runs.find(([a]) => a <= 5)
  const tail = runs.find(([, b]) => b >= frames - 5)
  const bounds = [lead ? lead[1] : 0, ...cuts.flat(), tail ? tail[0] : frames]
  const segs = []
  for (let k = 0; k < chunk.items.length; k++) {
    const a = Math.max(0, bounds[2 * k] - 6)
    const b = Math.min(frames, bounds[2 * k + 1] + 6)
    segs.push([a * FRAME, b * FRAME])
  }
  // Sanity: seconds per character should be similar for every line of one voice.
  const rates = segs.map(([a, b], k) => (b - a) / RATE / Math.max(8, chunk.text.split(' [long pause] [long pause] ')[k].length))
  const med = [...rates].sort((x, y) => x - y)[Math.floor(rates.length / 2)]
  const shortest = Math.min(...cuts.map(([a, b]) => b - a)) * 10
  rates.forEach((r, k) => {
    if (r > med * 2.3 || r < med * 0.42)
      console.log(`  ? ${chunk.name} line ${k + 1} (#${chunk.items[k]}): ${(r / med).toFixed(2)}× the usual pace — "${chunk.text.split(' [long pause] [long pause] ')[k].slice(0, 60)}"`)
  })
  console.log(`${chunk.name}: ${segs.length} lines, shortest break ${shortest} ms, ${(pcm.length / RATE).toFixed(1)} s`)
  segments[chunk.name] = { pcm, segs }
}
if (bad || flag === '--check') process.exit(bad ? 1 : 0)

// Assemble in script order with half a second of silence between lines.
const order = plan.flatMap((c) => c.items.map((item, k) => ({ item, chunk: c.name, k }))).sort((a, b) => a.item - b.item)
const gap = new Int16Array(Math.round(RATE * 0.5))
const parts = [gap]
let pos = gap.length
const clips = {}
for (const { item, chunk, k } of order) {
  const { pcm, segs } = segments[chunk]
  const [a, b] = segs[k]
  const piece = pcm.subarray(a, b)
  clips[item] = [+(pos / RATE).toFixed(3), +((pos + piece.length) / RATE).toFixed(3)]
  parts.push(piece, gap)
  pos += piece.length + gap.length
}
const total = new Int16Array(pos)
let o = 0
for (const p of parts) {
  total.set(p, o)
  o += p.length
}
mkdirSync('public/audio/listening', { recursive: true })
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 's16le', '-ar', String(RATE), '-ac', '1', '-i', '-', '-b:a', '48k', `public/audio/listening/${id}.mp3`], {
  input: Buffer.from(total.buffer),
})
writeFileSync(`src/pages/student/listening/tests/${id}.audio.json`, JSON.stringify(clips))
console.log(`→ public/audio/listening/${id}.mp3 (${(pos / RATE / 60).toFixed(1)} min), ${order.length} clips`)
