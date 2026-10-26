// Voices the AI Studio job pack through the Gemini API (single-speaker TTS), one WAV per job.
// Usage: GEMINI_API_KEY=… node scripts/gemini-tts.mjs <packdir> [id…]
//   reads  <packdir>/<id>/<chunk>.txt   (written by scripts/aistudio-pack.mjs)
//   writes <packdir>/<id>/<id>__<chunk>.wav, which scripts/audio-build.mjs <id> <packdir> picks up.
// Takes that already exist are skipped, so the run can be repeated after a quota stop.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'

const [packDir, ...only] = process.argv.slice(2)
const KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.GEMINI_TTS_MODEL ?? 'gemini-2.5-pro-preview-tts'
if (!packDir || !KEY) {
  console.error('usage: GEMINI_API_KEY=… node scripts/gemini-tts.mjs <packdir> [id…]')
  process.exit(1)
}

const field = (txt, name) => txt.match(new RegExp(`^${name}: (.+)$`, 'm'))?.[1].trim()
const block = (txt, name, next) => {
  const start = txt.indexOf(`${name}:\n`)
  const end = next ? txt.indexOf(`\n\n${next}:\n`, start) : txt.length
  return txt.slice(start + name.length + 2, end).trim()
}

/** 16-bit mono PCM at 24 kHz (what Gemini TTS returns) wrapped in a WAV header. */
function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44)
  h.write('RIFF', 0)
  h.writeUInt32LE(36 + pcm.length, 4)
  h.write('WAVEfmt ', 8)
  h.writeUInt32LE(16, 16)
  h.writeUInt16LE(1, 20)
  h.writeUInt16LE(1, 22)
  h.writeUInt32LE(rate, 24)
  h.writeUInt32LE(rate * 2, 28)
  h.writeUInt16LE(2, 32)
  h.writeUInt16LE(16, 34)
  h.write('data', 36)
  h.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([h, pcm])
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function speak(style, text, voice) {
  const body = {
    contents: [{ parts: [{ text: `${style}\n\n${text}` }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    },
  }
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const json = await res.json()
      const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
      if (part) {
        const rate = Number(part.inlineData.mimeType?.match(/rate=(\d+)/)?.[1] ?? 24000)
        return wav(Buffer.from(part.inlineData.data, 'base64'), rate)
      }
      if (attempt >= 3) throw new Error(`no audio in response: ${JSON.stringify(json).slice(0, 300)}`)
    } else {
      const msg = await res.text()
      // a daily quota is spent for today: stop cleanly so the run can resume tomorrow
      if (res.status === 429 && /per ?day|PerDay/i.test(msg)) throw Object.assign(new Error('daily quota reached'), { quota: true })
      if (attempt >= 5 || (res.status !== 429 && res.status < 500)) throw new Error(`${res.status}: ${msg.slice(0, 300)}`)
    }
    await sleep(15000 * attempt)
  }
}

const ids = only.length ? only : readdirSync(packDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
let made = 0
for (const id of ids) {
  const dir = `${packDir}/${id}`
  for (const name of readdirSync(dir).filter((f) => f.endsWith('.txt')).sort()) {
    const txt = readFileSync(`${dir}/${name}`, 'utf8')
    const out = `${dir}/${field(txt, 'SAVE AS')}`
    if (existsSync(out)) continue
    try {
      writeFileSync(out, await speak(block(txt, 'STYLE INSTRUCTIONS', 'TEXT'), block(txt, 'TEXT'), field(txt, 'VOICE')))
      made++
      console.log(`✓ ${id}/${name}`)
    } catch (e) {
      console.log(`✗ ${id}/${name}: ${e.message}`)
      if (e.quota) {
        console.log(`stopped after ${made} new takes; run again later to continue`)
        process.exit(2)
      }
    }
  }
}
console.log(`${made} new takes`)
