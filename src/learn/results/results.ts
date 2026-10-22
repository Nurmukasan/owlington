/*
 * Helpers for the unified results view in the student profile. Every section's
 * attempts are shown the same way: an IELTS band up front, the raw score beside it,
 * a breakdown by question type and the question-by-question detail.
 */
import { BOOK_ICON, HEADPHONES_ICON, PENCIL_ICON, type Sprite } from '../../scene/sprites'
import { findPractice } from '../catalog'
import type { Attempt, AttemptItem } from '../progress'
import type { PracticeFormat, SectionId } from '../types'

export const SECTION_ORDER: SectionId[] = ['reading', 'listening', 'writing']

export const SECTION_META: Record<SectionId, { name: string; world: string; icon: Sprite; color: string; chart: string }> = {
  // `color` is the brand tint for badges; `chart` is the darker step for chart marks
  // (validated as a categorical palette against the night surface).
  reading: { name: 'Reading', world: 'The Moonlit Library', icon: BOOK_ICON, color: 'var(--reading)', chart: '#c08a1e' },
  listening: { name: 'Listening', world: 'Owl FM', icon: HEADPHONES_ICON, color: 'var(--listening)', chart: '#1f9e8a' },
  writing: { name: 'Writing', world: 'The Inkwell Study', icon: PENCIL_ICON, color: 'var(--writing)', chart: '#de5a45' },
}

/** A stable id for an attempt, used in the profile URL. */
export const attemptId = (a: Attempt) => `${a.section}~${a.at}`

export const titleOf = (a: Attempt) => findPractice(a.section, a.practiceId)?.title ?? 'Practice test'

export const formatOf = (a: Attempt): PracticeFormat => findPractice(a.section, a.practiceId)?.format ?? 'focused'

export const accuracyOf = (a: Attempt) => (a.total > 0 ? a.score / a.total : 0)

export const pct = (x: number) => `${Math.round(x * 100)}%`

export const formatBand = (band: number | undefined) => (typeof band === 'number' ? band.toFixed(1) : '—')

/** "31 / 40 correct" or, for writing, "7 / 10 checks met". */
export const scoreText = (a: Attempt) => `${a.score} / ${a.total} ${a.section === 'writing' ? 'checks met' : 'correct'}`

export function formatDuration(sec: number) {
  if (sec < 60) return `${Math.max(1, Math.round(sec))} sec`
  const min = Math.round(sec / 60)
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${min % 60} min`
}

export function formatWhen(iso: string, withTime = true) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return withTime ? `${date}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : date
}

/** The attempt on the same test just before this one, if any. `all` may be in any order. */
export function previousAttempt(all: Attempt[], a: Attempt) {
  return all
    .filter((x) => x.section === a.section && x.practiceId === a.practiceId && x.at < a.at)
    .sort((x, y) => (x.at < y.at ? 1 : -1))[0]
}

export interface TypeTally {
  type: string
  correct: number
  total: number
}

/** Correct / total per question type, in the order the types first appear in the test. */
export function tallyByType(items: AttemptItem[]): TypeTally[] {
  const byType = new Map<string, TypeTally>()
  for (const item of items) {
    const t = byType.get(item.type) ?? { type: item.type, correct: 0, total: 0 }
    t.total++
    if (item.correct) t.correct++
    byType.set(item.type, t)
  }
  return [...byType.values()]
}

/** "+0.5", "−1.0" or "±0" for a band change. */
export function bandDelta(now: number | undefined, before: number | undefined) {
  if (typeof now !== 'number' || typeof before !== 'number') return null
  const d = Math.round((now - before) * 2) / 2
  return { value: d, text: d > 0 ? `+${d.toFixed(1)}` : d < 0 ? `−${Math.abs(d).toFixed(1)}` : '±0' }
}

/** Where this attempt's report lives in the student's profile. */
export const profileResultPath = (a: Attempt) =>
  `/student/profile?${new URLSearchParams({ tab: 'results', result: attemptId(a) }).toString()}`
