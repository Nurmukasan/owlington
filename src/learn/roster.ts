/**
 * What a teacher (or the admin) sees of a student's learning: a compact report
 * built from the student's progress. Until the backend exists, progress is
 * read from this browser's storage, like everything else.
 */
import type { User } from '../auth/mockAuthApi'
import { CATALOG, findPractice } from './catalog'
import { getProgressStore, rankFor, streakFor, type Attempt, type ProgressState } from './progress'
import type { SectionId } from './types'
import { sectionStats } from './useProgress'

export const SECTIONS: SectionId[] = ['reading', 'listening', 'writing']

export interface SectionReport {
  testsTotal: number
  /** Different tests tried at least once. */
  testsDone: number
  /** testsDone / testsTotal, 0..1. */
  testsShare: number
  /** Average band over the tests tried (each test's latest band), or null. */
  avgBand: number | null
  bestBand: number | null
  lecturesTotal: number
  lecturesDone: number
  attempts: number
  lastActivity?: string
}

export interface StudentReport {
  user: User
  sections: Record<SectionId, SectionReport>
  /** Mean of the section averages that exist. */
  overallBand: number | null
  xp: number
  rank: ReturnType<typeof rankFor>
  streak: number
  lastActive?: string
  /** All attempts, newest first. */
  attempts: Attempt[]
}

const round1 = (n: number) => Math.round(n * 10) / 10

export function sectionReport(state: ProgressState, section: SectionId): SectionReport {
  const stats = sectionStats(state, section)
  const latest = new Map<string, Attempt>()
  for (const a of stats.attempts) if (!latest.has(a.practiceId)) latest.set(a.practiceId, a) // attempts are newest first
  const bands = [...latest.values()].map((a) => a.band).filter((b): b is number => typeof b === 'number' && b > 0)
  const all = stats.attempts.map((a) => a.band).filter((b): b is number => typeof b === 'number' && b > 0)
  const total = CATALOG[section].practiceSets.length
  return {
    testsTotal: total,
    testsDone: stats.practiceAttempted,
    testsShare: total ? stats.practiceAttempted / total : 0,
    avgBand: bands.length ? round1(bands.reduce((s, b) => s + b, 0) / bands.length) : null,
    bestBand: all.length ? Math.max(...all) : null,
    lecturesTotal: stats.lecturesTotal,
    lecturesDone: stats.lecturesCompleted,
    attempts: stats.attempts.length,
    lastActivity: stats.lastActivity,
  }
}

export function studentReport(user: User): StudentReport {
  const state = getProgressStore(user.id).getSnapshot()
  const sections = Object.fromEntries(SECTIONS.map((s) => [s, sectionReport(state, s)])) as Record<SectionId, SectionReport>
  const avgs = SECTIONS.map((s) => sections[s].avgBand).filter((b): b is number => b !== null)
  const last = SECTIONS.map((s) => sections[s].lastActivity).filter(Boolean).sort()
  return {
    user,
    sections,
    overallBand: avgs.length ? Math.round((avgs.reduce((a, b) => a + b, 0) / avgs.length) * 2) / 2 : null,
    xp: state.xp,
    rank: rankFor(state.xp),
    streak: streakFor(state.dailyXp).days,
    lastActive: last[last.length - 1],
    attempts: [...state.attempts].reverse(),
  }
}

/** Title of a test, for result lists. */
export const testTitle = (section: SectionId, id: string) => findPractice(section, id)?.title ?? id
export const testFormat = (section: SectionId, id: string) => findPractice(section, id)?.format ?? 'focused'
