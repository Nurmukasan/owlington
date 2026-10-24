/**
 * Learning progress: XP, ranks, daily streaks, lecture progress, practice
 * attempts and achievements.
 *
 * Like the auth, this is stored per user in localStorage until the backend
 * exists. Components use it through `useProgress()`; the store emits
 * `ProgressEvent`s (XP gained, rank-up, achievement) for toasts and effects.
 */
import { findPractice } from './catalog'
import type { PracticeInfo, SectionId } from './types'

// --- state ----------------------------------------------------------------------

export interface LectureProgress {
  /** Highest fraction of the lecture seen, 0..1. */
  watched: number
  /** Where to resume: slide index (notes player) or seconds (video). */
  position: number
  completedAt?: string
  updatedAt: string
}

/** One scored item of an attempt, in a shape every section shares (used by the profile's results). */
export interface AttemptItem {
  /** Question number as printed in the test. */
  n: number
  /** Question or task type, e.g. "True / False / Not Given". */
  type: string
  /** What was checked, when the number alone doesn't say (e.g. a writing checklist point). */
  label?: string
  correct: boolean
  /** What the student answered (readable), if anything. */
  given?: string
  /** The correct answer (readable). */
  answer?: string
}

export interface AttemptInput {
  practiceId: string
  /** Correct answers (or rubric points for writing). */
  score: number
  total: number
  durationSec: number
  /** Optional band estimate (e.g. self-assessed writing band). */
  band?: number
  /** Per-question results for the unified results view. */
  items?: AttemptItem[]
  /** Writing: the band given for each assessment criterion. */
  criteria?: { label: string; band: number }[]
  /** Writing: words written. */
  words?: number
  /** Anything section-specific worth keeping: answers, the essay… */
  detail?: Record<string, unknown>
}

export interface Attempt extends AttemptInput {
  section: SectionId
  at: string
  xp: number
  /** A retake of a test already done: XP is earned on the first attempt only. */
  repeat?: boolean
}

export interface ProgressState {
  version: 4
  xp: number
  lectures: Record<string, LectureProgress>
  attempts: Attempt[]
  /** Tests that have paid out their XP (`section:practiceId` → when). Kept apart from the attempts, which are trimmed. */
  rewarded: Record<string, string>
  /** XP earned per local day (YYYY-MM-DD). A key with 0 still counts as an active day. */
  dailyXp: Record<string, number>
  achievements: Record<string, string>
}

const emptyState = (): ProgressState => ({
  version: 4,
  xp: 0,
  lectures: {},
  attempts: [],
  rewarded: {},
  dailyXp: {},
  achievements: {},
})

// --- rules ----------------------------------------------------------------------

export const XP_RULES = {
  lectureComplete: 5,
}

/** XP a night to keep "tonight's goal". Anything beyond it is a bonus. */
export const DAILY_GOAL = 30

export const lectureKey = (section: SectionId, lectureId: string) => `${section}:${lectureId}`
export const practiceKey = (section: SectionId, practiceId: string) => `${section}:${practiceId}`

/** How an attempt's XP reads in lists and results: "+12 XP", or that a retake earns none. */
export const xpLabel = (a: Pick<Attempt, 'xp' | 'repeat'>) => (a.repeat ? 'retake · no XP' : `+${a.xp} XP`)

/**
 * XP for a test's first attempt (retakes earn none). Reading and Listening: 1 XP per correct answer, so a
 * 10-question focused test is worth up to 10 XP and a 40-question full test up to 40.
 * Writing: the band, so a band 6 essay earns 6 XP (half bands round up: 6.5 → 7).
 */
export function attemptXp({ section, score, band }: { section: SectionId; score: number; band?: number }) {
  if (section === 'writing') return Math.max(0, Math.round(band ?? 0))
  return Math.max(0, Math.round(score))
}

export const RANKS = [
  { title: 'Fledgling', xp: 0, description: 'A student taking the first steps.' },
  { title: 'Owlet', xp: 1000, description: 'A student soaking up knowledge.' },
  { title: 'Night Watcher', xp: 1200, description: 'An adept learning what is hidden.' },
  { title: 'Feather Scholar', xp: 1400, description: 'A master who has gathered wisdom.' },
  { title: 'Silver Wing', xp: 1600, description: 'Keeper of the ancient scrolls.' },
  { title: 'Arch-Owl', xp: 1800, description: 'The high mage — or the dean.' },
  { title: 'The Silent Glide', xp: 2500, description: 'A legend who has reached perfect enlightenment.' },
]

export interface RankInfo {
  rank: number
  title: string
  description: string
  /** XP at which this rank started. */
  floor: number
  /** XP needed for the next rank, or null at the top rank. */
  next: number | null
  nextTitle: string | null
  /** 0..1 progress towards the next rank (1 at the top). */
  progress: number
}

export function rankFor(xp: number): RankInfo {
  let i = 0
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++
  const current = RANKS[i]
  const next = RANKS[i + 1]
  return {
    rank: i + 1,
    title: current.title,
    description: current.description,
    floor: current.xp,
    next: next?.xp ?? null,
    nextTitle: next?.title ?? null,
    progress: next ? (xp - current.xp) / (next.xp - current.xp) : 1,
  }
}

// --- dates & streaks ------------------------------------------------------------------

export function dayKey(date = new Date()) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

function previousDay(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d - 1))
}

export interface StreakInfo {
  /** Consecutive active days ending today (or yesterday, if today isn't done yet). */
  days: number
  activeToday: boolean
  best: number
}

export function streakFor(dailyXp: Record<string, number>, today = dayKey()): StreakInfo {
  const active = new Set(Object.keys(dailyXp))
  const activeToday = active.has(today)
  let days = 0
  let cursor = activeToday ? today : previousDay(today)
  while (active.has(cursor)) {
    days++
    cursor = previousDay(cursor)
  }

  let best = 0
  for (const key of active) {
    if (active.has(previousDay(key))) continue // only count from the start of each run
    const [y, m, d] = key.split('-').map(Number)
    let run = 0
    while (active.has(dayKey(new Date(y, m - 1, d + run)))) run++
    best = Math.max(best, run)
  }
  return { days, activeToday, best }
}

// --- achievements ------------------------------------------------------------------

export type AchievementIcon =
  | 'star'
  | 'flame'
  | 'trophy'
  | 'book'
  | 'headphones'
  | 'pencil'
  | 'owl'
  | 'tufted-owl'
  | 'key'
  | 'medal'
  | 'magnifier'
  | 'true-false'
  | 'bookworm'
  | 'graph'
  | 'scroll'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: AchievementIcon
  section: SectionId
  /** XP awarded once, when it unlocks. */
  xp: number
  /** How many are needed: 1 for a one-off feat, 10 for "ten full tests". */
  goal: number
  /** How many the student has so far; it unlocks when this reaches `goal`. */
  count: (state: ProgressState) => number
}

const infoOf = (a: Attempt) => findPractice(a.section, a.practiceId)
const isFull = (a: Attempt) => infoOf(a)?.format === 'full'
const isPerfect = (a: Attempt) => a.total > 0 && a.score >= a.total
const hasBand = (a: Attempt, min: number) => typeof a.band === 'number' && a.band >= min
/** The Task 1 band of a Writing attempt: a focused Task 1 prompt, or the Task 1 half of a full test. */
function taskOneBand(a: Attempt) {
  if (isFull(a)) {
    const tasks = (a.detail as { tasks?: unknown } | undefined)?.tasks
    return Array.isArray(tasks) && typeof tasks[0] === 'number' ? tasks[0] : 0
  }
  return (focusOf(infoOf(a)) ?? '').startsWith('Task 1') && typeof a.band === 'number' ? a.band : 0
}

/** The one question type a focused test drills: its only tag. Mixed or full tests have none. */
export function focusOf(info: PracticeInfo | undefined) {
  if (!info || info.format === 'full') return undefined
  const tags = info.tags ?? info.kinds
  return tags.length === 1 ? tags[0] : undefined
}

/** Different tests (not attempts) in a section that pass `test`, so retakes don't count twice. */
const distinctTests = (state: ProgressState, section: SectionId, test: (a: Attempt) => boolean) =>
  new Set(state.attempts.filter((a) => a.section === section && test(a)).map((a) => a.practiceId)).size

const once = (state: ProgressState, section: SectionId, test: (a: Attempt) => boolean) =>
  state.attempts.some((a) => a.section === section && test(a)) ? 1 : 0

export const ACHIEVEMENTS: Achievement[] = [
  // Listening
  {
    id: 'sharp-eared-owl',
    title: 'Sharp-Eared Owl',
    description: 'Complete 10 different Listening full tests.',
    icon: 'tufted-owl',
    section: 'listening',
    xp: 100,
    goal: 10,
    count: (s) => distinctTests(s, 'listening', isFull),
  },
  {
    id: 'owl-codebreaker',
    title: 'The Owl Codebreaker',
    description: 'Get every answer right in 3 different spelling tasks.',
    icon: 'key',
    section: 'listening',
    xp: 20,
    goal: 3,
    count: (s) => distinctTests(s, 'listening', (a) => isPerfect(a) && /spell/i.test(focusOf(infoOf(a)) ?? '')),
  },
  {
    id: 'echoing-owl',
    title: 'Echoing Owl',
    description: 'Score band 8.5–9.0 on a Listening full test.',
    icon: 'medal',
    section: 'listening',
    xp: 200,
    goal: 1,
    count: (s) => once(s, 'listening', (a) => isFull(a) && hasBand(a, 8.5)),
  },
  // Reading
  {
    id: 'skimming-owl',
    title: 'Skimming Owl',
    description: 'Finish a skimming & scanning focused test without a single mistake.',
    icon: 'magnifier',
    section: 'reading',
    xp: 30,
    goal: 1,
    count: (s) => once(s, 'reading', (a) => isPerfect(a) && /skim/i.test(focusOf(infoOf(a)) ?? '')),
  },
  {
    id: 'true-false-owl',
    title: 'True-False-Owl',
    description: 'Complete a True / False / Not Given focused test.',
    icon: 'true-false',
    section: 'reading',
    xp: 10,
    goal: 1,
    count: (s) => once(s, 'reading', (a) => focusOf(infoOf(a)) === 'True / False / Not Given'),
  },
  {
    id: 'bookworm-owl',
    title: 'Bookworm Owl',
    description: 'Complete 10 different Reading full tests.',
    icon: 'bookworm',
    section: 'reading',
    xp: 100,
    goal: 10,
    count: (s) => distinctTests(s, 'reading', isFull),
  },
  // Writing
  {
    id: 'graph-watching-owl',
    title: 'Graph-Watching Owl',
    description: 'Score band 8.5–9.0 on a Writing Task 1.',
    icon: 'graph',
    section: 'writing',
    xp: 50,
    goal: 1,
    count: (s) => once(s, 'writing', (a) => taskOneBand(a) >= 8.5),
  },
  {
    id: 'essay-weaving-owl',
    title: 'Essay-Weaving Owl',
    description: 'Score band 7.5 or higher on a Writing full test.',
    icon: 'scroll',
    section: 'writing',
    xp: 100,
    goal: 1,
    count: (s) => once(s, 'writing', (a) => isFull(a) && hasBand(a, 7.5)),
  },
]

// --- events ----------------------------------------------------------------------

export type ProgressEvent =
  | { type: 'xp'; amount: number; reason: string }
  | { type: 'rank-up'; rank: number; title: string; description: string }
  | { type: 'achievement'; achievement: Achievement }

type EventListener = (event: ProgressEvent) => void
const eventListeners = new Set<EventListener>()

/** Subscribe to XP, rank-up and achievement events. Returns an unsubscribe function. */
export function onProgressEvent(listener: EventListener) {
  eventListeners.add(listener)
  return () => {
    eventListeners.delete(listener)
  }
}

// --- store ----------------------------------------------------------------------

const MAX_ATTEMPTS = 300
const MAX_DAYS = 400

type Stored = Omit<Partial<ProgressState>, 'version'> & { version?: number }

/** Moves XP on the total and on the day `iso` falls on; days never drop below zero. */
function shiftXp(state: Omit<ProgressState, 'version'>, iso: string, delta: number) {
  state.xp += delta
  const day = dayKey(new Date(iso))
  if (day in state.dailyXp) state.dailyXp[day] = Math.max(0, state.dailyXp[day] + delta)
}

/**
 * Version 1 → 2: practice XP became "1 XP per correct answer" (Writing: the band), and
 * the first, placeholder set of achievements was retired along with its XP bonus.
 * Each day's XP is corrected too, so streaks and tonight's goal stay consistent.
 */
function migrateFromV1(old: Stored): Stored {
  const state = { ...emptyState(), ...old, dailyXp: { ...old.dailyXp } }
  state.attempts = state.attempts.map((a) => {
    const fresh = attemptXp(a)
    shiftXp(state, a.at, fresh - a.xp)
    return { ...a, xp: fresh }
  })
  // The retired achievements were worth 25 XP each.
  for (const at of Object.values(state.achievements)) shiftXp(state, at, -25)
  return { ...state, achievements: {}, version: 2 }
}

/** Version 2 → 3: a finished lecture is worth 5 XP instead of 50. */
function migrateFromV2(old: Stored): Stored {
  const state = { ...emptyState(), ...old, dailyXp: { ...old.dailyXp } }
  for (const lecture of Object.values(state.lectures)) {
    if (lecture.completedAt) shiftXp(state, lecture.completedAt, XP_RULES.lectureComplete - 50)
  }
  return { ...state, version: 3 }
}

/** Version 3 → 4: a test pays XP on its first attempt only; the XP retakes earned is taken back. */
function migrateFromV3(old: Stored): Stored {
  const state = { ...emptyState(), ...old, dailyXp: { ...old.dailyXp }, rewarded: {} as Record<string, string> }
  state.attempts = [...state.attempts]
    .sort((a, b) => (a.at < b.at ? -1 : 1))
    .map((a) => {
      const key = practiceKey(a.section, a.practiceId)
      if (!state.rewarded[key]) {
        state.rewarded[key] = a.at
        return a
      }
      shiftXp(state, a.at, -a.xp)
      return { ...a, xp: 0, repeat: true }
    })
  return { ...state, version: 4 }
}

function load(key: string): { state: ProgressState; migrated: boolean } {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { state: emptyState(), migrated: false }
    let stored = JSON.parse(raw) as Stored
    const from = stored.version
    if (stored.version === 1) stored = migrateFromV1(stored)
    if (stored.version === 2) stored = migrateFromV2(stored)
    if (stored.version === 3) stored = migrateFromV3(stored)
    if (stored.version !== 4) return { state: emptyState(), migrated: false }
    const state: ProgressState = { ...emptyState(), ...stored, version: 4 }
    // dailyGoal was a setting until version 2; the goal is fixed now.
    delete (state as Partial<{ dailyGoal: number }>).dailyGoal
    return { state: { ...state, xp: Math.max(0, state.xp) }, migrated: from !== 4 }
  } catch {
    return { state: emptyState(), migrated: false }
  }
}

export class ProgressStore {
  private state: ProgressState
  private readonly key: string
  private readonly listeners = new Set<() => void>()
  /** The saved JSON this store last read or wrote, to notice when another tab has saved since. */
  private raw: string | null = null

  constructor(userId: string) {
    this.key = `owlington:progress:${userId}`
    const { state, migrated } = load(this.key)
    this.state = state
    this.raw = readRaw(this.key)
    if (migrated) this.commit(state, [])
    // Another tab saved: pick it up so this one never pays out the same XP twice.
    window.addEventListener('storage', (e) => {
      if (e.key === this.key && this.sync()) this.listeners.forEach((l) => l())
    })
  }

  /** Reload when the saved progress changed under us. Returns whether it did. */
  private sync() {
    const raw = readRaw(this.key)
    if (raw === this.raw) return false
    this.raw = raw
    this.state = load(this.key).state
    return true
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => this.state

  /** Save lecture progress. Crossing 95% completes the lecture once (+XP_RULES.lectureComplete). */
  updateLecture = (section: SectionId, lectureId: string, update: { watched: number; position: number }) => {
    this.sync()
    const key = lectureKey(section, lectureId)
    const prev = this.state.lectures[key]
    const watched = Math.max(prev?.watched ?? 0, Math.min(1, update.watched))
    const now = new Date().toISOString()
    const justCompleted = !prev?.completedAt && watched >= 0.95
    const next: LectureProgress = {
      watched,
      position: update.position,
      completedAt: prev?.completedAt ?? (justCompleted ? now : undefined),
      updatedAt: now,
    }
    const events: ProgressEvent[] = []
    let state: ProgressState = { ...this.state, lectures: { ...this.state.lectures, [key]: next } }
    state = this.addXp(state, justCompleted ? XP_RULES.lectureComplete : 0, 'Lecture complete', events)
    this.commit(state, events)
    return { justCompleted }
  }

  /** Record a finished practice attempt; returns it with the XP it earned (none for a retake). */
  recordAttempt = (section: SectionId, input: AttemptInput): Attempt => {
    this.sync()
    const at = new Date().toISOString()
    const key = practiceKey(section, input.practiceId)
    const repeat = Boolean(this.state.rewarded[key])
    const attempt: Attempt = { ...input, section, at, xp: repeat ? 0 : attemptXp({ ...input, section }), ...(repeat ? { repeat } : {}) }
    const events: ProgressEvent[] = []
    let state: ProgressState = {
      ...this.state,
      attempts: [...this.state.attempts, attempt].slice(-MAX_ATTEMPTS),
      rewarded: repeat ? this.state.rewarded : { ...this.state.rewarded, [key]: at },
    }
    state = this.addXp(state, attempt.xp, 'Practice complete', events)
    this.commit(state, events)
    return attempt
  }

  private addXp(state: ProgressState, amount: number, reason: string, events: ProgressEvent[]): ProgressState {
    const today = dayKey()
    const before = rankFor(state.xp).rank
    let next: ProgressState = {
      ...state,
      xp: state.xp + amount,
      dailyXp: trimDays({ ...state.dailyXp, [today]: (state.dailyXp[today] ?? 0) + amount }),
    }
    if (amount > 0) events.push({ type: 'xp', amount, reason })

    // Unlock achievements (each one is worth XP, which may unlock more).
    for (let guard = 0; guard < ACHIEVEMENTS.length; guard++) {
      const fresh = ACHIEVEMENTS.find((a) => !next.achievements[a.id] && a.count(next) >= a.goal)
      if (!fresh) break
      next = {
        ...next,
        xp: next.xp + fresh.xp,
        dailyXp: { ...next.dailyXp, [today]: (next.dailyXp[today] ?? 0) + fresh.xp },
        achievements: { ...next.achievements, [fresh.id]: new Date().toISOString() },
      }
      events.push({ type: 'achievement', achievement: fresh })
    }

    const after = rankFor(next.xp)
    if (after.rank > before) events.push({ type: 'rank-up', rank: after.rank, title: after.title, description: after.description })
    return next
  }

  private commit(state: ProgressState, events: ProgressEvent[]) {
    this.state = state
    try {
      const raw = JSON.stringify(state)
      localStorage.setItem(this.key, raw)
      this.raw = raw
    } catch {
      // Storage full or blocked — progress still works for this session.
    }
    this.listeners.forEach((l) => l())
    events.forEach((e) => eventListeners.forEach((l) => l(e)))
  }
}

function readRaw(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function trimDays(days: Record<string, number>) {
  const keys = Object.keys(days)
  if (keys.length <= MAX_DAYS) return days
  return Object.fromEntries(keys.sort().slice(-MAX_DAYS).map((k) => [k, days[k]]))
}

const stores = new Map<string, ProgressStore>()

export function getProgressStore(userId: string) {
  let store = stores.get(userId)
  if (!store) {
    store = new ProgressStore(userId)
    stores.set(userId, store)
  }
  return store
}
