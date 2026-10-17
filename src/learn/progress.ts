/**
 * Learning progress: XP, levels, daily streaks, lecture progress, practice
 * attempts and achievements.
 *
 * Like the auth, this is stored per user in localStorage until the backend
 * exists. Components use it through `useProgress()`; the store emits
 * `ProgressEvent`s (XP gained, level-up, achievement) for toasts and effects.
 */
import { CATALOG } from './catalog'
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

export interface AttemptInput {
  practiceId: string
  /** Correct answers (or rubric points for writing). */
  score: number
  total: number
  durationSec: number
  /** Optional band estimate (e.g. self-assessed writing band). */
  band?: number
  /** Anything section-specific worth keeping: answers, word count, the essay… */
  detail?: Record<string, unknown>
}

export interface Attempt extends AttemptInput {
  section: SectionId
  at: string
  xp: number
}

export interface ProgressState {
  version: 1
  xp: number
  lectures: Record<string, LectureProgress>
  attempts: Attempt[]
  /** XP earned per local day (YYYY-MM-DD). A key with 0 still counts as an active day. */
  dailyXp: Record<string, number>
  achievements: Record<string, string>
  dailyGoal: number
}

const emptyState = (): ProgressState => ({
  version: 1,
  xp: 0,
  lectures: {},
  attempts: [],
  dailyXp: {},
  achievements: {},
  dailyGoal: 60,
})

// --- rules ----------------------------------------------------------------------

export const XP_RULES = {
  lectureComplete: 50,
  attemptAccuracy: 60,
  attemptPass: 20,
  attemptTry: 10,
  achievement: 25,
}

export const DAILY_GOALS = [30, 60, 100, 150]

export const lectureKey = (section: SectionId, lectureId: string) => `${section}:${lectureId}`

/** XP for one practice attempt: up to 60 for accuracy, plus 20 for passing (≥ 50%) or 10 for trying. */
export function attemptXp(score: number, total: number) {
  const accuracy = total > 0 ? Math.max(0, Math.min(1, score / total)) : 0
  return Math.round(accuracy * XP_RULES.attemptAccuracy) + (accuracy >= 0.5 ? XP_RULES.attemptPass : XP_RULES.attemptTry)
}

const LEVELS = [
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
const LEVEL_STEP_AFTER_LAST = 2500

export interface LevelInfo {
  level: number
  title: string
  /** XP at which this level started. */
  floor: number
  /** XP needed for the next level. */
  next: number
  /** 0..1 progress towards the next level. */
  progress: number
  nextTitle: string
}

export function levelFor(xp: number): LevelInfo {
  let i = 0
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].xp) i++
  if (i < LEVELS.length - 1) {
    const floor = LEVELS[i].xp
    const next = LEVELS[i + 1].xp
    return { level: i + 1, title: LEVELS[i].title, floor, next, progress: (xp - floor) / (next - floor), nextTitle: LEVELS[i + 1].title }
  }
  const last = LEVELS[LEVELS.length - 1]
  const extra = Math.floor((xp - last.xp) / LEVEL_STEP_AFTER_LAST)
  const floor = last.xp + extra * LEVEL_STEP_AFTER_LAST
  const next = floor + LEVEL_STEP_AFTER_LAST
  return { level: LEVELS.length + extra, title: last.title, floor, next, progress: (xp - floor) / (next - floor), nextTitle: last.title }
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

const completedLectures = (state: ProgressState, section?: SectionId) =>
  Object.entries(state.lectures).filter(([key, p]) => p.completedAt && (!section || key.startsWith(`${section}:`)))

const finishedAllLectures = (state: ProgressState, section: SectionId) => {
  const ids = CATALOG[section].lectures.map((l) => l.id)
  return ids.length > 0 && ids.every((id) => state.lectures[lectureKey(section, id)]?.completedAt)
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-light',
    title: 'First Light',
    description: 'Finish your first lecture.',
    icon: 'star',
    check: (s) => completedLectures(s).length > 0,
  },
  {
    id: 'test-flight',
    title: 'Test Flight',
    description: 'Complete your first practice test.',
    icon: 'star',
    check: (s) => s.attempts.length > 0,
  },
  {
    id: 'sharp-eyes',
    title: 'Sharp Eyes',
    description: 'Score 100% on a practice test.',
    icon: 'trophy',
    check: (s) => s.attempts.some((a) => a.total > 0 && a.score >= a.total),
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Study three days in a row.',
    icon: 'flame',
    check: (s) => streakFor(s.dailyXp).days >= 3,
  },
  {
    id: 'creature-of-habit',
    title: 'Creature of Habit',
    description: 'Keep a seven-day streak.',
    icon: 'flame',
    check: (s) => streakFor(s.dailyXp).days >= 7,
  },
  {
    id: 'triple-threat',
    title: 'Triple Threat',
    description: 'Practise Reading, Listening and Writing.',
    icon: 'trophy',
    check: (s) => new Set(s.attempts.map((a) => a.section)).size === 3,
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Complete ten practice tests.',
    icon: 'trophy',
    check: (s) => s.attempts.length >= 10,
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Finish every Reading lecture.',
    icon: 'book',
    check: (s) => finishedAllLectures(s, 'reading'),
  },
  {
    id: 'golden-ears',
    title: 'Golden Ears',
    description: 'Finish every Listening lecture.',
    icon: 'headphones',
    check: (s) => finishedAllLectures(s, 'listening'),
  },
  {
    id: 'inkslinger',
    title: 'Inkslinger',
    description: 'Finish every Writing lecture.',
    icon: 'pencil',
    check: (s) => finishedAllLectures(s, 'writing'),
  },
  {
    id: 'thousand-feathers',
    title: 'Thousand Feathers',
    description: 'Earn 1,000 XP.',
    icon: 'owl',
    check: (s) => s.xp >= 1000,
  },
]

// --- events ----------------------------------------------------------------------

export type ProgressEvent =
  | { type: 'xp'; amount: number; reason: string }
  | { type: 'level-up'; level: number; title: string }
  | { type: 'achievement'; achievement: Achievement }

type EventListener = (event: ProgressEvent) => void
const eventListeners = new Set<EventListener>()

/** Subscribe to XP, level-up and achievement events. Returns an unsubscribe function. */
export function onProgressEvent(listener: EventListener) {
  eventListeners.add(listener)
  return () => {
    eventListeners.delete(listener)
  }
}

// --- store ----------------------------------------------------------------------

const MAX_ATTEMPTS = 300
const MAX_DAYS = 400

function load(key: string): ProgressState {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    if (parsed.version !== 1) return emptyState()
    return { ...emptyState(), ...parsed }
  } catch {
    return emptyState()
  }
}

export class ProgressStore {
  private state: ProgressState
  private readonly key: string
  private readonly listeners = new Set<() => void>()

  constructor(userId: string) {
    this.key = `owlington:progress:${userId}`
    this.state = load(this.key)
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
    const attempt: Attempt = { ...input, section, at: new Date().toISOString(), xp: attemptXp(input.score, input.total) }
    const events: ProgressEvent[] = []
    let state: ProgressState = { ...this.state, attempts: [...this.state.attempts, attempt].slice(-MAX_ATTEMPTS) }
    state = this.addXp(state, attempt.xp, 'Practice complete', events)
    this.commit(state, events)
    return attempt
  }

  setDailyGoal = (goal: number) => {
    this.commit({ ...this.state, dailyGoal: goal }, [])
  }

  private addXp(state: ProgressState, amount: number, reason: string, events: ProgressEvent[]): ProgressState {
    const today = dayKey()
    const before = levelFor(state.xp).level
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

    const after = levelFor(next.xp)
    if (after.level > before) events.push({ type: 'level-up', level: after.level, title: after.title })
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
