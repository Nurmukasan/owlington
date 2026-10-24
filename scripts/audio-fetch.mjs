// Downloads finished ElevenLabs takes listed in a saved run-status JSON.
// Usage: node scripts/audio-fetch.mjs <status.json> <workdir>/<id>   (needs sessions.txt: "<chunk> <session>")
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const [statusFile, dir] = process.argv.slice(2)
const raw = JSON.parse(readFileSync(statusFile, 'utf8'))
const status = Array.isArray(raw) ? JSON.parse(raw[0].text) : raw.text ? JSON.parse(raw.text) : raw
const sessions = Object.fromEntries(
  readFileSync(`${dir}/sessions.txt`, 'utf8')
    .trim()
    .split('\n')
    .map((l) => l.trim().split(/\s+/).reverse()),
)
const pending = (status.generations ?? []).filter((g) => g.status !== 'completed').map((g) => g.status)
console.log(`all_completed=${status.all_completed} failures=${status.has_failures} pending=${pending.length}`)
for (const m of status.media ?? []) {
  const session = m.url.match(/content_generation\/([^/]+)\//)?.[1]
  const name = sessions[session]
  if (!name) continue
  const file = `${dir}/${name}.mp3`
  if (existsSync(file)) continue
  execFileSync('curl', ['-s', '-o', file, m.url])
  console.log(`saved ${name}.mp3`)
}
