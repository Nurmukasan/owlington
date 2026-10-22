/*
 * The weekly leaderboard: who earned the most practice XP this week.
 *
 * Practice XP is 1 per correct answer in Reading and Listening (focused and full
 * tests alike) and the band for Writing; lectures don't count here. Until the backend
 * exists this ranks the students whose accounts live in this browser; replace
 * `weeklyLeaderboard` with an API call when they move to the server.
 */
import { listStudents, type PublicProfile } from '../auth/mockAuthApi'
import { findPractice } from './catalog'
import { getProgressStore, type Attempt } from './progress'

export type XpSource = 'focused' | 'full' | 'writing'

/** The three kinds of practice XP; colours validated as a categorical palette on the night surface. */
export const XP_SOURCES: { id: XpSource; label: string; color: string }[] = [
  { id: 'focused', label: 'Focused tests', color: '#1f9e8a' },
  { id: 'full', label: 'Full tests', color: '#8a63d2' },
  { id: 'writing', label: 'Writing', color: '#de5a45' },
]

export const sourceOf = (a: Attempt): XpSource =>
  a.section === 'writing' ? 'writing' : findPractice(a.section, a.practiceId)?.format === 'full' ? 'full' : 'focused'

/** Monday 00:00 (local time) of the week `offset` weeks from the one containing `now`, and the Monday after. */
export function weekRange(now: Date, offset = 0) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) + offset * 7)
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7)
  return { start, end }
}

export interface WeeklyXp {
  xp: number
  bySource: Record<XpSource, number>
  tests: number
}

export function weeklyXp(attempts: Attempt[], start: Date, end: Date): WeeklyXp {
  const bySource: Record<XpSource, number> = { focused: 0, full: 0, writing: 0 }
  let tests = 0
  for (const a of attempts) {
    const at = new Date(a.at)
    if (at < start || at >= end) continue
    bySource[sourceOf(a)] += a.xp
    tests++
  }
  return { xp: bySource.focused + bySource.full + bySource.writing, bySource, tests }
}

export interface LeaderboardEntry extends WeeklyXp {
  student: PublicProfile
  /** Shared by students on equal XP (1, 2, 2, 4…). */
  place: number
}

/** Students with practice XP in [start, end), most XP first. */
export function weeklyLeaderboard(start: Date, end: Date): LeaderboardEntry[] {
  const rows = listStudents()
    .map((student) => ({ student, ...weeklyXp(getProgressStore(student.id).getSnapshot().attempts, start, end) }))
    .filter((r) => r.xp > 0)
    .sort((a, b) => b.xp - a.xp || a.student.name.localeCompare(b.student.name))
  return rows.map((r) => ({ ...r, place: rows.findIndex((o) => o.xp === r.xp) + 1 }))
}
