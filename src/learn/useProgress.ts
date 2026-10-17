import { useMemo, useSyncExternalStore } from 'react'
import { useUser } from '../auth/auth-context'
import { CATALOG } from './catalog'
import {
  ACHIEVEMENTS,
  dayKey,
  getProgressStore,
  lectureKey,
  levelFor,
  streakFor,
  type Attempt,
  type ProgressState,
  type ProgressStore,
} from './progress'
import type { Lecture, SectionId } from './types'

export interface SectionStats {
  lecturesTotal: number
  lecturesCompleted: number
  /** Average watched fraction across all lectures, 0..1. */
  lectureFraction: number
  /** The lecture to continue: the most recently started unfinished one, else the first unfinished one. */
  nextLecture?: Lecture
  practiceTotal: number
  /** Number of different practice sets attempted at least once. */
  practiceAttempted: number
  /** This section's attempts, newest first. */
  attempts: Attempt[]
  /** Best attempt per practice set id (highest accuracy, then most recent). */
  best: Record<string, Attempt>
  /** Average accuracy of the last 10 attempts, 0..1 — or null if none yet. */
  accuracy: number | null
  /** XP earned in this section (lectures + practice, excluding achievement bonuses). */
  xp: number
  lastActivity?: string
}

const accuracyOf = (a: Attempt) => (a.total > 0 ? a.score / a.total : 0)

function sectionStats(state: ProgressState, section: SectionId): SectionStats {
  const { lectures, practiceSets } = CATALOG[section]
  const progress = lectures.map((l) => state.lectures[lectureKey(section, l.id)])
  const completed = progress.filter((p) => p?.completedAt).length
  const fraction = lectures.length ? progress.reduce((sum, p) => sum + (p?.watched ?? 0), 0) / lectures.length : 0

  const started = lectures
    .map((l, i) => ({ l, p: progress[i] }))
    .filter(({ p }) => p && !p.completedAt && p.watched > 0)
    .sort((a, b) => (b.p!.updatedAt > a.p!.updatedAt ? 1 : -1))
  const nextLecture = started[0]?.l ?? lectures.find((_, i) => !progress[i]?.completedAt)

  const attempts = state.attempts.filter((a) => a.section === section).reverse()
  const best: Record<string, Attempt> = {}
  for (const a of attempts) {
    const current = best[a.practiceId]
    if (!current || accuracyOf(a) > accuracyOf(current)) best[a.practiceId] = a
  }
  const recent = attempts.slice(0, 10)
  const accuracy = recent.length ? recent.reduce((s, a) => s + accuracyOf(a), 0) / recent.length : null

  const times = [
    ...attempts.map((a) => a.at),
    ...progress.flatMap((p) => (p ? [p.updatedAt] : [])),
  ].sort()

  return {
    lecturesTotal: lectures.length,
    lecturesCompleted: completed,
    lectureFraction: fraction,
    nextLecture,
    practiceTotal: practiceSets.length,
    practiceAttempted: Object.keys(best).length,
    attempts,
    best,
    accuracy,
    xp: completed * 50 + attempts.reduce((s, a) => s + a.xp, 0),
    lastActivity: times[times.length - 1],
  }
}

function createView(state: ProgressState, store: ProgressStore) {
  const today = dayKey()
  const todayXp = state.dailyXp[today] ?? 0
  return {
    state,
    xp: state.xp,
    level: levelFor(state.xp),
    streak: streakFor(state.dailyXp, today),
    today: { xp: todayXp, goal: state.dailyGoal, met: todayXp >= state.dailyGoal },
    achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlockedAt: state.achievements[a.id] })),
    lecture: (section: SectionId, lectureId: string) => state.lectures[lectureKey(section, lectureId)],
    section: (section: SectionId) => sectionStats(state, section),
    updateLecture: store.updateLecture,
    recordAttempt: store.recordAttempt,
    setDailyGoal: store.setDailyGoal,
  }
}

export type ProgressView = ReturnType<typeof createView>

/** The signed-in student's progress. Only use inside student routes. */
export function useProgress(): ProgressView {
  const user = useUser()
  const store = getProgressStore(user.id)
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot)
  return useMemo(() => createView(state, store), [state, store])
}
