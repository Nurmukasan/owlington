/**
 * Learning progress: XP, ranks, daily streaks, lecture progress, practice
 * attempts and achievements.
 *
 * Like the auth, this is stored per user in localStorage until the backend
 * exists. Components use it through `useProgress()`; the store emits
 * `ProgressEvent`s (XP gained, rank-up, achievement) for toasts and effects.
 */
import { CATALOG, findPractice } from './catalog'
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

/** What a test's first attempt scored: XP and achievements only ever look at this. */
export interface FirstAttempt {
  at: string
  score: number
  total: number
  band?: number
}

export interface ProgressState {
  version: 5
  xp: number
  lectures: Record<string, LectureProgress>
  attempts: Attempt[]
  /** Each test's first attempt (`section:practiceId`). Kept apart from the attempts, which are trimmed. */
  firsts: Record<string, FirstAttempt>
  /**
   * XP earned per local day (YYYY-MM-DD). A day is active (it keeps the streak) when the student finished a
   * new lesson or a first test attempt, so a key with 0 still counts. Retakes and half-watched lessons don't.
   */
  dailyXp: Record<string, number>
  achievements: Record<string, string>
}

const emptyState = (): ProgressState => ({
  version: 5,
  xp: 0,
  lectures: {},
  attempts: [],
  firsts: {},
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
 * XP for a test's first attempt (retakes earn none).
 * - Reading and Listening: 1 XP per correct answer (a 40-question full test is worth up to 40).
 * - Writing full test: 5 XP per half band (band 6.5 → 65 XP).
 * - Writing focused task: 1 XP per half band (band 6.5 → 13 XP).
 */
export function attemptXp({ section, practiceId, score, band }: { section: SectionId; practiceId: string; score: number; band?: number }) {
  if (section !== 'writing') return Math.max(0, Math.round(score))
  const halves = Math.max(0, Math.round((band ?? 0) * 2))
  return findPractice(section, practiceId)?.format === 'full' ? halves * 5 : halves
}

export const RANKS = [
  { title: 'Owl Egg', xp: 0, description: 'Warm, round and full of promise.' },
  { title: 'Tiny Owlet', xp: 50, description: 'Out of the shell and blinking at the page.' },
  { title: 'Curious Owlet', xp: 150, description: 'Asks “why?” about every question.' },
  { title: 'Brave Owlet', xp: 350, description: 'Takes on full tests without a flinch.' },
  { title: 'Moonwing Owl', xp: 700, description: 'First real flights under the moon.' },
  { title: 'Nightwatch Owl', xp: 1200, description: 'Steady, every night, wide awake.' },
  { title: 'Scholar Owl', xp: 1900, description: 'Knows the exam inside out.' },
  { title: 'Sage Owl', xp: 2800, description: 'Others come to this owl for advice.' },
  { title: 'Grandmaster Owl', xp: 3700, description: 'Few questions left that can surprise it.' },
  { title: 'Legendary Owl', xp: 4700, description: 'The owl the forest tells stories about.' },
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

export type AchievementGroup = 'lessons' | 'questions' | 'writing' | 'mastery'

/** How the profile groups the achievements, in order. */
export const ACHIEVEMENT_GROUPS: { id: AchievementGroup; title: string; icon: AchievementIcon; color: string }[] = [
  { id: 'lessons', title: 'Lessons & tests', icon: 'book', color: 'var(--reading)' },
  { id: 'questions', title: 'Reading & Listening', icon: 'headphones', color: 'var(--listening)' },
  { id: 'writing', title: 'Writing', icon: 'pencil', color: 'var(--writing)' },
  { id: 'mastery', title: 'Streaks & mastery', icon: 'trophy', color: '#b99cff' },
]

export interface Achievement {
  id: string
  title: string
  description: string
  icon: AchievementIcon
  group: AchievementGroup
  /** XP awarded once, when it unlocks. */
  xp: number
  /** How many are needed: 1 for a one-off feat, 100 for "100 questions". */
  goal: number
  /** How many the student has so far; it unlocks when this reaches `goal`. */
  count: (state: ProgressState) => number
}

const SECTIONS: SectionId[] = ['reading', 'listening', 'writing']
const LESSONS = (section: SectionId) => CATALOG[section].lectures.length
const ALL_LESSONS = SECTIONS.reduce((n, s) => n + LESSONS(s), 0)
const TESTS = (section: SectionId) => CATALOG[section].practiceSets.length
const ALL_TESTS = SECTIONS.reduce((n, s) => n + TESTS(s), 0)

/** Finished lessons, in one section or all. */
const lessonsDone = (state: ProgressState, section?: SectionId) =>
  (section ? [section] : SECTIONS).reduce(
    (n, s) => n + CATALOG[s].lectures.filter((l) => state.lectures[lectureKey(s, l.id)]?.completedAt).length,
    0,
  )

/** First attempts in a section that are still in the catalogue, with the test they belong to. */
function firstsIn(state: ProgressState, section: SectionId) {
  return CATALOG[section].practiceSets.flatMap((info) => {
    const first = state.firsts[practiceKey(section, info.id)]
    return first ? [{ info, first }] : []
  })
}

const isFullInfo = (info: PracticeInfo) => info.format === 'full'
/** 36/40 on a full test; the same 90% on a shorter one. */
const isStrong = (f: FirstAttempt) => f.total > 0 && f.score >= Math.ceil(f.total * 0.9)
const strongFull = (state: ProgressState, section: SectionId) => firstsIn(state, section).filter((x) => isFullInfo(x.info) && isStrong(x.first)).length
const correctAnswers = (state: ProgressState) =>
  [...firstsIn(state, 'reading'), ...firstsIn(state, 'listening')].reduce((n, x) => n + x.first.score, 0)
const fullWritingAtLeast = (state: ProgressState, band: number) =>
  firstsIn(state, 'writing').filter((x) => isFullInfo(x.info) && (x.first.band ?? 0) >= band).length
const bestStreak = (state: ProgressState) => streakFor(state.dailyXp).best

export const ACHIEVEMENTS: Achievement[] = [
  // Lessons & tests
  { id: 'first-hoot', title: 'First Hoot', description: 'Complete your first video lesson.', icon: 'owl', group: 'lessons', xp: 10, goal: 1, count: (s) => lessonsDone(s) },
  { id: 'quill-owl', title: 'Quill Owl', description: `Complete all ${LESSONS('writing')} Writing lessons.`, icon: 'pencil', group: 'lessons', xp: 30, goal: LESSONS('writing'), count: (s) => lessonsDone(s, 'writing') },
  { id: 'echo-owl', title: 'Echo Owl', description: `Complete all ${LESSONS('listening')} Listening lessons.`, icon: 'headphones', group: 'lessons', xp: 30, goal: LESSONS('listening'), count: (s) => lessonsDone(s, 'listening') },
  { id: 'sharp-eyed-owl', title: 'Sharp-Eyed Owl', description: `Complete all ${LESSONS('reading')} Reading lessons.`, icon: 'magnifier', group: 'lessons', xp: 30, goal: LESSONS('reading'), count: (s) => lessonsDone(s, 'reading') },
  { id: 'library-owl', title: 'Library Owl', description: `Complete all ${ALL_LESSONS} video lessons.`, icon: 'bookworm', group: 'lessons', xp: 50, goal: ALL_LESSONS, count: (s) => lessonsDone(s) },
  { id: 'first-flight', title: 'Owl’s First Flight', description: 'Complete your first full test.', icon: 'star', group: 'lessons', xp: 10, goal: 1, count: (s) => SECTIONS.reduce((n, sec) => n + firstsIn(s, sec).filter((x) => isFullInfo(x.info)).length, 0) },
  { id: 'reading-explorer', title: 'Reading Explorer Owl', description: `Complete a first attempt at all ${TESTS('reading')} Reading tests.`, icon: 'book', group: 'lessons', xp: 40, goal: TESTS('reading'), count: (s) => firstsIn(s, 'reading').length },
  { id: 'listening-explorer', title: 'Listening Explorer Owl', description: `Complete a first attempt at all ${TESTS('listening')} Listening tests.`, icon: 'tufted-owl', group: 'lessons', xp: 40, goal: TESTS('listening'), count: (s) => firstsIn(s, 'listening').length },
  { id: 'writing-explorer', title: 'Writing Explorer Owl', description: `Complete a first attempt at all ${TESTS('writing')} Writing tests.`, icon: 'scroll', group: 'lessons', xp: 60, goal: TESTS('writing'), count: (s) => firstsIn(s, 'writing').length },
  // Reading & Listening
  { id: 'keen-eyed-owl', title: 'Keen-Eyed Owl', description: 'Answer 100 unique Reading or Listening questions correctly on first test attempts.', icon: 'key', group: 'questions', xp: 20, goal: 100, count: correctAnswers },
  { id: 'focused-owl', title: 'Focused Owl', description: 'Answer 400 unique Reading or Listening questions correctly on first test attempts.', icon: 'true-false', group: 'questions', xp: 40, goal: 400, count: correctAnswers },
  { id: 'wise-hunter-owl', title: 'Wise Hunter Owl', description: 'Answer 800 unique Reading or Listening questions correctly on first test attempts.', icon: 'medal', group: 'questions', xp: 60, goal: 800, count: correctAnswers },
  { id: 'master-hunter-owl', title: 'Master Hunter Owl', description: 'Answer 1,440 unique Reading or Listening questions correctly on first test attempts.', icon: 'trophy', group: 'questions', xp: 100, goal: 1440, count: correctAnswers },
  { id: 'precision-owl', title: 'Precision Owl', description: 'Score at least 36/40 on your first attempt at a Reading or Listening full test.', icon: 'star', group: 'questions', xp: 30, goal: 1, count: (s) => strongFull(s, 'reading') + strongFull(s, 'listening') },
  { id: 'flawless-owl', title: 'Flawless Owl', description: 'Score 40/40 on your first attempt at a Reading or Listening full test.', icon: 'medal', group: 'questions', xp: 70, goal: 1, count: (s) => [...firstsIn(s, 'reading'), ...firstsIn(s, 'listening')].filter((x) => isFullInfo(x.info) && x.first.score >= x.first.total && x.first.total > 0).length },
  { id: 'elite-owl', title: 'Elite Owl', description: 'Score at least 36/40 on 5 different Reading and 5 different Listening full tests, first attempts only.', icon: 'trophy', group: 'questions', xp: 120, goal: 10, count: (s) => Math.min(5, strongFull(s, 'reading')) + Math.min(5, strongFull(s, 'listening')) },
  // Writing
  { id: 'quill-apprentice-owl', title: 'Quill Apprentice Owl', description: 'Achieve band 6.0 or higher on your first attempt at a full Writing test.', icon: 'pencil', group: 'writing', xp: 30, goal: 1, count: (s) => fullWritingAtLeast(s, 6) },
  { id: 'quill-scholar-owl', title: 'Quill Scholar Owl', description: 'Achieve band 7.0 or higher on your first attempt at a full Writing test.', icon: 'scroll', group: 'writing', xp: 60, goal: 1, count: (s) => fullWritingAtLeast(s, 7) },
  { id: 'golden-quill-owl', title: 'Golden Quill Owl', description: 'Achieve band 8.0 or higher on your first attempt at a full Writing test.', icon: 'medal', group: 'writing', xp: 120, goal: 1, count: (s) => fullWritingAtLeast(s, 8) },
  { id: 'master-quill-owl', title: 'Master Quill Owl', description: 'Achieve band 7.5 or higher on 5 different full Writing tests, first attempts only.', icon: 'trophy', group: 'writing', xp: 100, goal: 5, count: (s) => fullWritingAtLeast(s, 7.5) },
  // Streaks & mastery
  { id: 'daily-hooter', title: 'Daily Hooter', description: 'Complete a new lesson or a first test attempt every day for 7 days in a row.', icon: 'flame', group: 'mastery', xp: 20, goal: 7, count: bestStreak },
  { id: 'devoted-owl', title: 'Devoted Owl', description: 'Complete a new lesson or a first test attempt every day for 14 days in a row.', icon: 'flame', group: 'mastery', xp: 50, goal: 14, count: bestStreak },
  { id: 'unstoppable-owl', title: 'Unstoppable Owl', description: 'Complete a new lesson or a first test attempt every day for 30 days in a row.', icon: 'flame', group: 'mastery', xp: 80, goal: 30, count: bestStreak },
  { id: 'academy-graduate', title: 'Owl Academy Graduate', description: `Complete all ${ALL_LESSONS} lessons and a first attempt at every test in all three sections.`, icon: 'owl', group: 'mastery', xp: 100, goal: ALL_LESSONS + ALL_TESTS, count: (s) => lessonsDone(s) + SECTIONS.reduce((n, sec) => n + firstsIn(s, sec).length, 0) },
  {
    id: 'owl-crown',
    title: 'The Owl Crown',
    description: `Complete all ${ALL_LESSONS} lessons, score at least 36/40 (90%) on every Reading and Listening test and band 7.5+ on every Writing test, all on first attempts.`,
    icon: 'trophy',
    group: 'mastery',
    xp: 200,
    goal: ALL_LESSONS + ALL_TESTS,
    count: (s) =>
      lessonsDone(s) +
      firstsIn(s, 'reading').filter((x) => isStrong(x.first)).length +
      firstsIn(s, 'listening').filter((x) => isStrong(x.first)).length +
      firstsIn(s, 'writing').filter((x) => (x.first.band ?? 0) >= 7.5).length,
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

/**
 * Credits XP for a new lesson or a first test attempt at `at`: the day becomes active (it keeps the
 * streak, even with 0 XP) and any achievement that now qualifies unlocks, once, with its own XP.
 */
function credit(state: ProgressState, amount: number, at: string, reason: string, events: ProgressEvent[]): ProgressState {
  const day = dayKey(new Date(at))
  let next: ProgressState = {
    ...state,
    xp: state.xp + amount,
    dailyXp: trimDays({ ...state.dailyXp, [day]: (state.dailyXp[day] ?? 0) + amount }),
  }
  if (amount > 0) events.push({ type: 'xp', amount, reason })
  for (let guard = 0; guard < ACHIEVEMENTS.length; guard++) {
    const fresh = ACHIEVEMENTS.find((a) => !next.achievements[a.id] && a.count(next) >= a.goal)
    if (!fresh) break
    next = {
      ...next,
      xp: next.xp + fresh.xp,
      dailyXp: { ...next.dailyXp, [day]: (next.dailyXp[day] ?? 0) + fresh.xp },
      achievements: { ...next.achievements, [fresh.id]: at },
    }
    events.push({ type: 'achievement', achievement: fresh })
  }
  return next
}

/** Adds a finished attempt: XP and a streak day only if it's the test's first attempt. */
function addAttempt(state: ProgressState, input: AttemptInput & { section: SectionId; at: string }, events: ProgressEvent[]) {
  const key = practiceKey(input.section, input.practiceId)
  const repeat = Boolean(state.firsts[key])
  const attempt: Attempt = { ...input, xp: repeat ? 0 : attemptXp(input), ...(repeat ? { repeat } : {}) }
  let next: ProgressState = { ...state, attempts: [...state.attempts, attempt].slice(-MAX_ATTEMPTS) }
  if (!repeat) {
    const first: FirstAttempt = { at: input.at, score: input.score, total: input.total, ...(typeof input.band === 'number' ? { band: input.band } : {}) }
    next = credit({ ...next, firsts: { ...next.firsts, [key]: first } }, attempt.xp, input.at, 'Practice complete', events)
  }
  return { state: next, attempt }
}

/**
 * Builds progress from its history under today's rules: lessons and attempts are replayed in order,
 * so XP, active days, first attempts and achievements are all recomputed. Used to move older saves
 * onto the current rules, and by the demo seed.
 */
export function rebuildProgress(history: { lectures?: Record<string, LectureProgress>; attempts?: Attempt[] }): ProgressState {
  const lectures = history.lectures ?? {}
  const steps = [
    ...Object.values(lectures).flatMap((l) => (l.completedAt ? [{ at: l.completedAt, attempt: undefined }] : [])),
    ...(history.attempts ?? []).map((a) => ({ at: a.at, attempt: a })),
  ].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
  let state: ProgressState = { ...emptyState(), lectures }
  for (const step of steps) {
    if (step.attempt) {
      const { xp: _xp, repeat: _repeat, ...input } = step.attempt
      state = addAttempt(state, input, []).state
    } else {
      state = credit(state, XP_RULES.lectureComplete, step.at, 'Lecture complete', [])
    }
  }
  return state
}

function load(key: string): { state: ProgressState; migrated: boolean } {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { state: emptyState(), migrated: false }
    const stored = JSON.parse(raw) as Stored
    // An older save (other XP rules, ranks or achievements): replay its history under the current rules.
    if (stored.version !== 5) return { state: rebuildProgress(stored), migrated: true }
    return { state: { ...emptyState(), ...stored, version: 5 }, migrated: false }
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
    const before = rankFor(this.state.xp).rank
    let state: ProgressState = { ...this.state, lectures: { ...this.state.lectures, [key]: next } }
    if (justCompleted) state = credit(state, XP_RULES.lectureComplete, now, 'Lecture complete', events)
    this.rankUp(before, state, events)
    this.commit(state, events)
    return { justCompleted }
  }

  /** Record a finished practice attempt; returns it with the XP it earned (none for a retake). */
  recordAttempt = (section: SectionId, input: AttemptInput): Attempt => {
    this.sync()
    const events: ProgressEvent[] = []
    const before = rankFor(this.state.xp).rank
    const { state, attempt } = addAttempt(this.state, { ...input, section, at: new Date().toISOString() }, events)
    this.rankUp(before, state, events)
    this.commit(state, events)
    return attempt
  }

  private rankUp(before: number, state: ProgressState, events: ProgressEvent[]) {
    const after = rankFor(state.xp)
    if (after.rank > before) events.push({ type: 'rank-up', rank: after.rank, title: after.title, description: after.description })
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
