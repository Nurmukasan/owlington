/*
 * Owl FM's "audio": recordings are read aloud with the Web Speech API.
 *
 * - Each speaker gets their own voice (and pitch), preferring the accents IELTS
 *   uses: British, Australian, American, plus Indian and others when present.
 * - The Broadcast engine plays a script line by line, with silent reading-time
 *   countdowns, pause/resume (resuming from the last spoken word), seeking and
 *   a "level" for the visualiser driven by word-boundary events.
 * - When speech is missing or stops responding, the same engine runs a
 *   "transcript" driver that reveals the words at speaking pace instead.
 */
import { useEffect, useState } from 'react'
import { isPause, type Recording, type ScriptItem, type Speaker, type SpokenLine } from './practice-data'

// ------------------------------------------------------------- voices ---

export const ACCENT_ORDER = ['en-GB', 'en-AU', 'en-US', 'en-IN', 'en-IE', 'en-NZ', 'en-CA', 'en-ZA']
const ACCENT_NAMES: Record<string, string> = {
  'en-GB': 'British',
  'en-AU': 'Australian',
  'en-US': 'American',
  'en-IN': 'Indian',
  'en-IE': 'Irish',
  'en-NZ': 'New Zealand',
  'en-CA': 'Canadian',
  'en-ZA': 'South African',
  other: 'Other English',
}

export const speechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function'

const langOf = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase()
export const accentOf = (v: SpeechSynthesisVoice) => ACCENT_ORDER.find((a) => langOf(v).startsWith(a.toLowerCase())) ?? 'other'
export const accentName = (code: string) => ACCENT_NAMES[code] ?? ACCENT_NAMES.other

const FEMALE =
  /female|woman|samantha|karen|moira|tessa|veena|fiona|victoria|allison|\bava\b|susan|zira|hazel|libby|sonia|natasha|catherine|serena|kate|emma|\bamy\b|joanna|kimberly|salli|\bivy\b|olivia|aria|jenny|michelle|nancy|\bsara\b|clara|isla|maisie|heera|neerja|rosie|kylie|nicole|martha|ruth|aditi|raveena|shelley|sandy|grandma|flo/i
const MALE =
  /\bmale\b|daniel|\balex\b|fred|rishi|oliver|arthur|thomas|gordon|\blee\b|david|\bmark\b|george|ryan|william|\bguy\b|brian|matthew|joey|justin|russell|\beric\b|christopher|roger|steffan|liam|prabhat|ravi|aaron|\btom\b|james|reed|rocko|grandpa|eddy|ralph|albert/i

export function genderOf(v: SpeechSynthesisVoice): 'f' | 'm' | null {
  if (FEMALE.test(v.name)) return 'f'
  if (MALE.test(v.name)) return 'm'
  return null
}

function englishVoices() {
  if (!speechSupported()) return []
  return window.speechSynthesis
    .getVoices()
    .filter((v) => /^en([-_]|$)/i.test(v.lang))
    .sort((a, b) => {
      const ai = ACCENT_ORDER.indexOf(accentOf(a))
      const bi = ACCENT_ORDER.indexOf(accentOf(b))
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.name.localeCompare(b.name)
    })
}

export type VoiceStatus = 'loading' | 'ready' | 'none' | 'unsupported'

/** The English voices this browser offers. Voices load late in some browsers, so this keeps checking briefly. */
export function useVoices() {
  const supported = speechSupported()
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => englishVoices())
  const [waited, setWaited] = useState(false)

  useEffect(() => {
    if (!supported) return
    const synth = window.speechSynthesis
    let key = ''
    const update = () => {
      const next = englishVoices()
      const nextKey = next.map((v) => v.voiceURI).join('|')
      if (nextKey !== key) {
        key = nextKey
        setVoices(next)
      }
    }
    update()
    synth.addEventListener('voiceschanged', update)
    const poll = window.setInterval(update, 400)
    const done = window.setTimeout(() => {
      window.clearInterval(poll)
      setWaited(true)
    }, 2600)
    return () => {
      synth.removeEventListener('voiceschanged', update)
      window.clearInterval(poll)
      window.clearTimeout(done)
    }
  }, [supported])

  const status: VoiceStatus = !supported ? 'unsupported' : voices.length ? 'ready' : waited ? 'none' : 'loading'
  return { voices, status }
}

// --------------------------------------------------------------- cast ---

export interface CastEntry {
  voiceURI: string | null
  pitch: number
}
export type Cast = Record<string, CastEntry>

/** Gives every speaker the best-matching voice, avoiding repeats; repeated voices get a different pitch. */
export function autoCast(speakers: Speaker[], voices: SpeechSynthesisVoice[]): Cast {
  const uses = new Map<string, number>()
  const cast: Cast = {}
  for (const sp of speakers) {
    const score = (v: SpeechSynthesisVoice) => {
      const ai = sp.accents.findIndex((a) => langOf(v).startsWith(a.toLowerCase()))
      const g = genderOf(v)
      let s = ai >= 0 ? 40 - ai * 7 : 0
      if (g === sp.gender) s += 30
      else if (g) s -= 35
      s -= (uses.get(v.voiceURI) ?? 0) * 70
      if (/natural|neural|online|enhanced|premium/i.test(v.name)) s += 6
      return s
    }
    const best = [...voices].sort((a, b) => score(b) - score(a))[0]
    const reused = best ? (uses.get(best.voiceURI) ?? 0) : 0
    if (best) uses.set(best.voiceURI, reused + 1)
    const base = sp.id === 'ann' ? 1 : sp.gender === 'f' ? 1.06 : 0.94
    const shift = reused * (sp.gender === 'f' ? 0.16 : -0.14)
    cast[sp.id] = { voiceURI: best?.voiceURI ?? null, pitch: Math.round((base + shift) * 100) / 100 }
  }
  return cast
}

// ------------------------------------------------------------- engine ---

/** speech: browser voices · audio: a studio recording · text: the transcript at speaking pace. */
export type Driver = 'speech' | 'text' | 'audio'
export type Phase = 'idle' | 'reading' | 'playing' | 'paused' | 'ended'

export interface BroadcastSnapshot {
  phase: Phase
  /** Current script item. */
  index: number
  /** Words of the current line already spoken / shown (display words). */
  word: number
  waitLeft: number
  waitTotal: number
  driver: Driver
  /** Speech stopped responding and the engine fell back to the transcript driver. */
  fellBack: boolean
  /** Furthest script item reached. */
  reached: number
}

const wordsOf = (s: string) => s.trim().split(/\s+/).filter(Boolean)
const spokenText = (line: SpokenLine) => line.say ?? line.t

/** Approximate reading time of one word at rate 1, in ms (≈165 words a minute with pauses). */
function wordMs(word: string) {
  const letters = word.replace(/[^a-z0-9£]/gi, '').length
  let ms = 150 + letters * 34
  if (/[,;:…–—]$/.test(word)) ms += 170
  if (/[.!?]["”’]?$/.test(word)) ms += 320
  return ms
}

export function estimateSeconds(items: ScriptItem[], rate = 1) {
  return items.reduce((sum, item) => {
    if (isPause(item)) return sum + item.wait
    return sum + wordsOf(item.t).reduce((s, w) => s + wordMs(w), 0) / 1000 / rate + 0.5
  }, 0)
}

interface BroadcastOptions {
  driver: Driver
  cast: Cast
  rate: number
  voices: SpeechSynthesisVoice[]
  recording?: Recording
}

export class Broadcast {
  private snap: BroadcastSnapshot
  private readonly listeners = new Set<() => void>()
  private gen = 0
  private timers: number[] = []
  private speaking = false
  private pulseAt = 0
  private pulseAmp = 0
  private boundaryAt = 0
  private waitEndsAt = 0
  private media: HTMLAudioElement | null = null
  private unlocked = false
  readonly items: ScriptItem[]
  readonly recording?: Recording
  cast: Cast
  rate: number
  voices: SpeechSynthesisVoice[]

  constructor(items: ScriptItem[], options: BroadcastOptions) {
    this.items = items
    this.cast = options.cast
    this.rate = options.rate
    this.voices = options.voices
    this.recording = options.recording
    this.snap = { phase: 'idle', index: 0, word: 0, waitLeft: 0, waitTotal: 0, driver: options.driver, fellBack: false, reached: 0 }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => this.snap

  private set(patch: Partial<BroadcastSnapshot>) {
    this.snap = { ...this.snap, ...patch }
    if (this.snap.index > this.snap.reached) this.snap.reached = this.snap.index
    this.listeners.forEach((l) => l())
  }

  // ----- controls

  play() {
    const { phase, index, word } = this.snap
    if (phase === 'playing' || phase === 'reading') return
    this.unlockMedia()
    if (phase === 'idle' || phase === 'ended') this.run(0, 0)
    else this.run(index, word)
  }

  pause() {
    const { phase } = this.snap
    if (phase !== 'playing' && phase !== 'reading') return
    const waitLeft = phase === 'reading' ? Math.max(0, (this.waitEndsAt - performance.now()) / 1000) : this.snap.waitLeft
    this.halt()
    this.set({ phase: 'paused', waitLeft })
  }

  toggle() {
    if (this.snap.phase === 'playing' || this.snap.phase === 'reading') this.pause()
    else this.play()
  }

  /** Jump to a script item; keeps playing if it was playing. */
  seek(index: number) {
    const clamped = Math.max(0, Math.min(this.items.length - 1, index))
    const wasRunning = this.snap.phase === 'playing' || this.snap.phase === 'reading'
    this.halt()
    const item = this.items[clamped]
    this.set({ index: clamped, word: 0, waitLeft: isPause(item) ? item.wait : 0, waitTotal: isPause(item) ? item.wait : 0 })
    if (wasRunning) this.run(clamped, 0)
    else this.set({ phase: 'paused' })
  }

  /** End a reading-time countdown early (practice mode). */
  skipWait() {
    if (this.snap.phase !== 'reading' && !(this.snap.phase === 'paused' && isPause(this.items[this.snap.index]))) return
    this.halt()
    this.next(this.snap.index)
  }

  /** New voices, cast or speed; they take effect from the next line. */
  configure(options: Partial<Omit<BroadcastOptions, 'driver'>>) {
    if (options.cast) this.cast = options.cast
    if (options.voices) this.voices = options.voices
    if (options.rate) this.rate = options.rate
  }

  setDriver(driver: Driver) {
    if (driver === this.snap.driver) return
    const running = this.snap.phase === 'playing'
    this.halt()
    this.set({ driver })
    if (running) this.run(this.snap.index, this.snap.word)
  }

  /** Stop everything (unmount). */
  destroy() {
    this.halt()
    this.listeners.clear()
    if (this.media) {
      this.media.removeAttribute('src')
      this.media.load()
      this.media = null
    }
  }

  /** 0..1 loudness for the visualiser at time `now` (performance.now()). */
  level(now: number) {
    if (this.snap.phase !== 'playing' || !this.speaking) return 0
    let e = this.pulseAmp * Math.exp(-(now - this.pulseAt) / 190)
    // Many voices never report word boundaries: fake a speech-like rhythm for them.
    if (this.snap.driver !== 'text' && now - this.boundaryAt > 900) {
      e = Math.max(e, 0.32 + 0.4 * Math.abs(Math.sin(now / 97) * Math.sin(now / 251 + 1)))
    }
    return Math.min(1, e + 0.12)
  }

  // ----- internals

  private halt() {
    this.gen++
    this.timers.forEach((t) => window.clearTimeout(t))
    this.timers = []
    this.speaking = false
    if (this.snap.driver === 'speech' && speechSupported()) window.speechSynthesis.cancel()
    this.media?.pause()
  }

  private getMedia() {
    if (!this.media && this.recording) {
      const a = new Audio()
      a.preload = 'auto'
      a.src = this.recording.src
      this.media = a
    }
    return this.media
  }

  /**
   * Some browsers only let a page play sound that starts inside a tap. The first tap on
   * Play starts the recording silently, so later lines (started by timers) are allowed to play.
   */
  private unlockMedia() {
    if (this.unlocked || this.snap.driver !== 'audio') return
    const media = this.getMedia()
    if (!media) return
    this.unlocked = true
    media.muted = true
    media.play().catch(() => {
      // Blocked or not loaded yet: the line itself will try again.
    })
  }

  private later(fn: () => void, ms: number) {
    const gen = this.gen
    this.timers.push(
      window.setTimeout(() => {
        if (gen === this.gen) fn()
      }, ms),
    )
  }

  private pulse(strength: number) {
    this.pulseAt = performance.now()
    this.pulseAmp = strength
  }

  private run(index: number, fromWord: number) {
    if (index >= this.items.length) {
      this.set({ phase: 'ended', index: this.items.length - 1, word: 0 })
      return
    }
    const item = this.items[index]
    if (isPause(item)) {
      const left = this.snap.index === index && this.snap.phase === 'paused' && this.snap.waitLeft > 0 ? this.snap.waitLeft : item.wait
      this.runWait(index, left, item.wait)
    } else if (this.snap.driver === 'audio') this.clipLine(index, item, fromWord)
    else if (this.snap.driver === 'speech') this.speakLine(index, item, fromWord)
    else this.textLine(index, item, fromWord)
  }

  private next(index: number) {
    const item = this.items[index]
    const nextItem = this.items[index + 1]
    const gap =
      !nextItem || isPause(item) || isPause(nextItem) ? 250 : item.s === 'ann' || nextItem.s === 'ann' ? 750 : item.s === nextItem.s ? 320 : 520
    this.speaking = false
    this.set({ word: isPause(item) ? 0 : wordsOf(item.t).length })
    this.later(() => this.run(index + 1, 0), gap / Math.max(0.6, this.rate))
  }

  private runWait(index: number, left: number, total: number) {
    this.halt()
    this.waitEndsAt = performance.now() + left * 1000
    this.set({ phase: 'reading', index, word: 0, waitLeft: left, waitTotal: total })
    const tick = () => {
      const remaining = Math.max(0, (this.waitEndsAt - performance.now()) / 1000)
      this.set({ waitLeft: remaining })
      if (remaining <= 0) this.next(index)
      else this.later(tick, Math.min(250, remaining * 1000))
    }
    this.later(tick, 250)
  }

  private textLine(index: number, line: SpokenLine, fromWord: number) {
    this.halt()
    const words = wordsOf(line.t)
    this.speaking = true
    this.set({ phase: 'playing', index, word: fromWord })
    const step = (w: number) => {
      if (w >= words.length) {
        this.next(index)
        return
      }
      const word = words[w]
      this.pulse(0.55 + Math.min(0.45, word.length / 14) * Math.random() + 0.1)
      this.set({ word: w + 1 })
      this.later(() => step(w + 1), wordMs(word) / this.rate)
    }
    this.later(() => step(fromWord), 60)
  }

  private speakLine(index: number, line: SpokenLine, fromWord: number) {
    this.halt()
    const gen = this.gen
    const synth = window.speechSynthesis
    const spoken = wordsOf(spokenText(line))
    const shown = wordsOf(line.t).length
    const start = Math.min(fromWord ? Math.round((fromWord / shown) * spoken.length) : 0, Math.max(0, spoken.length - 1))
    const text = spoken.slice(start).join(' ')
    const entry = this.cast[line.s]
    const voice = this.voices.find((v) => v.voiceURI === entry?.voiceURI) ?? this.voices[0]

    const u = new SpeechSynthesisUtterance(text)
    if (voice) {
      u.voice = voice
      u.lang = voice.lang
    } else u.lang = 'en-GB'
    u.rate = this.rate
    u.pitch = entry?.pitch ?? 1
    let started = false

    // Character offsets of each word in `text`, to turn boundary events into word counts.
    const offsets: number[] = []
    text.replace(/\S+/g, (m, offset: number) => {
      offsets.push(offset)
      return m
    })

    u.onstart = () => {
      if (gen !== this.gen) return
      started = true
      this.speaking = true
      this.pulse(0.7)
      const est = (spoken.length - start) * 420 + 6000
      this.later(() => this.next(index), est / this.rate)
    }
    u.onboundary = (e) => {
      if (gen !== this.gen || e.name !== 'word') return
      this.boundaryAt = performance.now()
      let w = 0
      while (w + 1 < offsets.length && offsets[w + 1] <= e.charIndex) w++
      const spokenSoFar = start + w + 1
      this.pulse(0.6 + Math.random() * 0.4)
      this.set({ word: Math.min(shown, Math.round((spokenSoFar / spoken.length) * shown)) })
    }
    u.onend = () => {
      if (gen !== this.gen) return
      this.next(index)
    }
    u.onerror = (e) => {
      if (gen !== this.gen || e.error === 'interrupted' || e.error === 'canceled') return
      this.fallBack(index)
    }

    this.set({ phase: 'playing', index, word: fromWord })
    // A cancel() right before speak() can swallow the new utterance in Chrome, so give it a beat.
    this.later(() => {
      synth.cancel()
      synth.resume()
      synth.speak(u)
    }, 40)
    // If the voice never starts, switch to the transcript driver so the test can go on.
    this.later(() => {
      if (!started) this.fallBack(index)
    }, 4000)
  }

  /** Play one line's stretch of the studio recording. */
  private clipLine(index: number, line: SpokenLine, fromWord: number) {
    this.halt()
    const gen = this.gen
    const clip = this.recording?.clips[index]
    const media = this.getMedia()
    if (!clip || !media) {
      this.fallBack(index)
      return
    }
    const [from, to] = clip
    const shown = wordsOf(line.t).length
    const startAt = from + (shown ? (fromWord / shown) * (to - from) : 0)
    this.set({ phase: 'playing', index, word: fromWord })
    let lastTime = -1
    let stalledSince = performance.now()

    const tick = () => {
      if (gen !== this.gen) return
      const t = media.currentTime
      if (t >= to - 0.04 || media.ended) {
        media.pause()
        this.next(index)
        return
      }
      if (t !== lastTime) {
        lastTime = t
        stalledSince = performance.now()
        this.speaking = true
        this.pulse(0.5 + Math.random() * 0.5)
        const word = Math.min(shown, Math.max(fromWord, Math.floor(((t - from) / (to - from)) * shown)))
        if (word !== this.snap.word) this.set({ word })
      } else if (performance.now() - stalledSince > 9000) {
        // The file stopped loading: carry on with the transcript.
        this.fallBack(index)
        return
      }
      this.later(tick, 80)
    }

    const begin = () => {
      if (gen !== this.gen) return
      media.muted = false
      media.playbackRate = this.rate
      media.currentTime = startAt
      media.play().then(
        () => {
          if (gen === this.gen) this.later(tick, 80)
        },
        () => {
          if (gen === this.gen) this.fallBack(index)
        },
      )
    }
    if (media.readyState >= 1) begin()
    else {
      media.addEventListener('loadedmetadata', begin, { once: true })
      media.addEventListener('error', () => gen === this.gen && this.fallBack(index), { once: true })
      this.later(() => {
        if (media.readyState < 1) this.fallBack(index)
      }, 12000)
    }
  }

  private fallBack(index: number) {
    this.halt()
    this.set({ driver: 'text', fellBack: true })
    const item = this.items[index]
    if (!isPause(item)) this.textLine(index, item, 0)
  }
}

/** Read one line on its own (e.g. "hear it again" in the review). Returns a stop function. */
export function speakOnce(line: SpokenLine, entry: CastEntry | undefined, voices: SpeechSynthesisVoice[], rate = 1, onEnd?: () => void) {
  if (!speechSupported() || !voices.length) return () => {}
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(spokenText(line))
  const voice = voices.find((v) => v.voiceURI === entry?.voiceURI) ?? voices[0]
  u.voice = voice
  u.lang = voice.lang
  u.rate = rate
  u.pitch = entry?.pitch ?? 1
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  window.setTimeout(() => synth.speak(u), 40)
  return () => synth.cancel()
}

/** Play one recorded line on its own (the review's "hear it again"). Returns a stop function. */
export function playClipOnce(recording: Recording, clip: [number, number], rate = 1, onEnd?: () => void) {
  const a = new Audio(recording.src)
  let timer = 0
  const stop = () => {
    window.clearInterval(timer)
    a.pause()
  }
  a.addEventListener(
    'loadedmetadata',
    () => {
      a.currentTime = clip[0]
      a.playbackRate = rate
      a.play().catch(() => onEnd?.())
      timer = window.setInterval(() => {
        if (a.currentTime >= clip[1] - 0.04 || a.ended) {
          stop()
          onEnd?.()
        }
      }, 60)
    },
    { once: true },
  )
  a.addEventListener('error', () => onEnd?.(), { once: true })
  return stop
}
