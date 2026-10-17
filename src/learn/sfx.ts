/**
 * Tiny 8-bit sound effects, synthesised with the Web Audio API (no audio files).
 * They only ever play in response to something the student did, and can be
 * muted from the HUD.
 */
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'owlington:sfx'

type Note = [frequency: number, start: number, duration: number]

let muted = readMuted()
let context: AudioContext | null = null
const listeners = new Set<() => void>()

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off'
  } catch {
    return false
  }
}

function audio() {
  if (!context) {
    const Ctor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    context = new Ctor()
  }
  if (context.state === 'suspended') void context.resume()
  return context
}

function play(notes: Note[], type: OscillatorType = 'square', volume = 0.045) {
  if (muted) return
  const ctx = audio()
  if (!ctx) return
  const now = ctx.currentTime
  for (const [frequency, start, duration] of notes) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(frequency, now + start)
    gain.gain.setValueAtTime(0.0001, now + start)
    gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(now + start)
    osc.stop(now + start + duration + 0.02)
  }
}

export const sfx = {
  /** UI tick for buttons and selections. */
  click: () => play([[880, 0, 0.035]], 'square', 0.025),
  /** A soft page-turn / swap blip. */
  page: () => play([[523, 0, 0.05], [659, 0.04, 0.06]], 'triangle', 0.05),
  correct: () => play([[784, 0, 0.08], [1175, 0.08, 0.16]]),
  wrong: () => play([[233, 0, 0.12], [175, 0.1, 0.2]], 'sawtooth', 0.03),
  /** A practice or lecture finished. */
  complete: () => play([[523, 0, 0.09], [659, 0.09, 0.09], [784, 0.18, 0.09], [1047, 0.27, 0.28]]),
  levelUp: () =>
    play(
      [[523, 0, 0.07], [659, 0.07, 0.07], [784, 0.14, 0.07], [1047, 0.21, 0.07], [1319, 0.28, 0.07], [1568, 0.35, 0.35]],
      'square',
      0.04,
    ),
  unlock: () => play([[1319, 0, 0.06], [1760, 0.06, 0.06], [2093, 0.12, 0.22]], 'triangle', 0.07),
  /** Owl hoot: two soft low notes. */
  hoot: () => play([[392, 0, 0.18], [330, 0.22, 0.3]], 'sine', 0.08),
}

export function isMuted() {
  return muted
}

export function setMuted(value: boolean) {
  muted = value
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'off' : 'on')
  } catch {
    // ignore
  }
  listeners.forEach((l) => l())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useSfxMuted() {
  return useSyncExternalStore(subscribe, isMuted)
}
