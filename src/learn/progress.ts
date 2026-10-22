/**
 * Learning progress: XP, ranks, daily streaks, lecture progress, practice
 * attempts and achievements.
 *
 * Like the auth, this is stored per user in localStorage until the backend
 * exists. Components use it through `useProgress()`; the store emits
 * `ProgressEvent`s (XP gained, rank-up, achievement) for toasts and effects.
 */
import type { SectionId } from './types'

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
}

export interface ProgressState {
  version: 2
  xp: number
  lectures: Record<string, LectureProgress>
  attempts: Attempt[]
  /** XP earned per local day (YYYY-MM-DD). A key with 0 still counts as an active day. */
  dailyXp: Record<string, number>
  achievements: Record<string, string>
}

const emptyState = (): ProgressState => ({
  version: 2,
  xp: 0,
  lectures: {},
  attempts: [],
  dailyXp: {},
  achievements: {},
})

// --- rules ----------------------------------------------------------------------

export const XP_RULES = {
  lectureComplete: 50,
  achievement: 25,
}

/** XP a night to keep "tonight's goal". Anything beyond it is a bonus. */
export const DAILY_GOAL = 30

export const lectureKey = (section: SectionId, lectureId: string) => `${section}:${lectureId}`

/**
 * XP for one practice attempt. Reading and Listening: 1 XP per correct answer, so a
 * 10-question focused test is worth up to 10 XP and a 40-question full test up to 40.
 * Writing: the band, so a band 6 essay earns 6 XP (half bands round up: 6.5 → 7).
 */
export function attemptXp({ section, score, band }: { section: SectionId; score: number; band?: number }) {
  if (section === 'writing') return Math.max(0, Math.round(band ?? 0))
  return Math.max(0, Math.round(score))
}

// Placeholder ranks until the final list (names and XP for each) is decided.
const RANKS = [
  { title: 'Owlet', xp: 0 },
  { title: 'Fledgling', xp: 150 },
  { title: 'Night Flyer', xp: 400 },
  { title: 'Moon Watcher', xp: 800 },
  { title: 'Star Reader', xp: 1400 },
  { title: 'Wise Owl', xp: 2200 },
  { title: 'Grand Owl', xp: 3300 },
  { title: 'Owl Sage', xp: 4800 },
  { title: 'Legend of the Night', xp: 7000 },
]
const RANK_STEP_AFTER_LAST = 2500

export interface RankInfo {
  rank: number
  title: string
  /** XP at which this rank started. */
  floor: number
  /** XP needed for the next rank. */
  next: number
  /** 0..1 progress towards the next rank. */
  progress: number
  nextTitle: string
}

export function rankFor(xp: number): RankInfo {
  let i = 0
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++
  if (i < RANKS.length - 1) {
    const floor = RANKS[i].xp
    const next = RANKS[i + 1].xp
    return { rank: i + 1, title: RANKS[i].title, floor, next, progress: (xp - floor) / (next - floor), nextTitle: RANKS[i + 1].title }
  }
  const last = RANKS[RANKS.length - 1]
  const extra = Math.floor((xp - last.xp) / RANK_STEP_AFTER_LAST)
  const floor = last.xp + extra * RANK_STEP_AFTER_LAST
  const next = floor + RANK_STEP_AFTER_LAST
  return { rank: RANKS.length + extra, title: last.title, floor, next, progress: (xp - floor) / (next - floor), nextTitle: last.title }
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

export type AchievementIcon = 'star' | 'flame' | 'trophy' | 'book' | 'headphones' | 'pencil' | 'owl'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: AchievementIcon
  check: (state: ProgressState) => boolean
}

/**
 * The achievements students can unlock. Empty until the final list is decided; the
 * machinery (check after every XP change → unlock once → toast → +25 XP) is ready.
 */
export const ACHIEVEMENTS: Achievement[] = []

// --- events ----------------------------------------------------------------------

export type ProgressEvent =
  | { type: 'xp'; amount: number; reason: string }
  | { type: 'rank-up'; rank: number; title: string }
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

/**
 * Version 1 → 2: practice XP became "1 XP per correct answer" (Writing: the band), and
 * the first, placeholder set of achievements was retired along with its XP bonus.
 * Each day's XP is corrected too, so streaks and tonight's goal stay consistent.
 */
function migrateFromV1(old: Omit<Partial<ProgressState>, 'version'>): ProgressState {
  const base = { ...emptyState(), ...old }
  let xp = base.xp
  const dailyXp = { ...base.dailyXp }
  const shift = (iso: string, delta: number) => {
    const day = dayKey(new Date(iso))
    if (day in dailyXp) dailyXp[day] = Math.max(0, dailyXp[day] + delta)
  }
  const attempts = base.attempts.map((a) => {
    const fresh = attemptXp(a)
    xp += fresh - a.xp
    shift(a.at, fresh - a.xp)
    return { ...a, xp: fresh }
  })
  for (const at of Object.values(base.achievements)) {
    xp -= XP_RULES.achievement
    shift(at, -XP_RULES.achievement)
  }
  return { version: 2, xp: Math.max(0, xp), lectures: base.lectures, attempts, dailyXp, achievements: {} }
}

function load(key: string): { state: ProgressState; migrated: boolean } {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { state: emptyState(), migrated: false }
    const parsed = JSON.parse(raw) as Omit<Partial<ProgressState>, 'version'> & { version?: number }
    if (parsed.version === 1) return { state: migrateFromV1(parsed), migrated: true }
    if (parsed.version !== 2) return { state: emptyState(), migrated: false }
    return { state: { ...emptyState(), ...parsed, version: 2 }, migrated: false }
  } catch {
    return { state: emptyState(), migrated: false }
  }
}

export class ProgressStore {
  private state: ProgressState
  private readonly key: string
  private readonly listeners = new Set<() => void>()

  constructor(userId: string) {
    this.key = `owlington:progress:${userId}`
    const { state, migrated } = load(this.key)
    this.state = state
    if (migrated) this.commit(state, [])
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => this.state

  /** Save lecture progress. Crossing 95% completes the lecture once (+50 XP). */
  updateLecture = (section: SectionId, lectureId: string, update: { watched: number; position: number }) => {
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

  /** Record a finished practice attempt; returns it with the XP it earned. */
  recordAttempt = (section: SectionId, input: AttemptInput): Attempt => {
    const attempt: Attempt = { ...input, section, at: new Date().toISOString(), xp: attemptXp({ ...input, section }) }
    const events: ProgressEvent[] = []
    let state: ProgressState = { ...this.state, attempts: [...this.state.attempts, attempt].slice(-MAX_ATTEMPTS) }
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

    // Unlock achievements (each one is worth a little XP, which may unlock more).
    for (let guard = 0; guard < ACHIEVEMENTS.length; guard++) {
      const fresh = ACHIEVEMENTS.find((a) => !next.achievements[a.id] && a.check(next))
      if (!fresh) break
      next = {
        ...next,
        xp: next.xp + XP_RULES.achievement,
        dailyXp: { ...next.dailyXp, [today]: (next.dailyXp[today] ?? 0) + XP_RULES.achievement },
        achievements: { ...next.achievements, [fresh.id]: new Date().toISOString() },
      }
      events.push({ type: 'achievement', achievement: fresh })
    }

    const after = rankFor(next.xp)
    if (after.rank > before) events.push({ type: 'rank-up', rank: after.rank, title: after.title })
    return next
  }

  private commit(state: ProgressState, events: ProgressEvent[]) {
    this.state = state
    try {
      localStorage.setItem(this.key, JSON.stringify(state))
    } catch {
      // Storage full or blocked — progress still works for this session.
    }
    this.listeners.forEach((l) => l())
    events.forEach((e) => eventListeners.forEach((l) => l(e)))
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
