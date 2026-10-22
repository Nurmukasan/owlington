import type { Attempt } from '../../../learn/progress'
import type { SectionStats } from '../../../learn/useProgress'
import type { Lecture, Level, PracticeInfo } from '../../../learn/types'
import { lectures, practiceSets } from './content'
import { loadDraft } from './practice-logic'

/** Small shared helpers for the Moonlit Library pages. */

export const SECTION = 'reading' as const
export const HUB_PATH = '/student/reading'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
export const roman = (n: number) => ROMAN[n - 1] ?? String(n)

const CALL_NUMBERS = ['RD 101', 'RD 204', 'RD 217', 'RD 342']
/** Library call number for the i-th practice set, e.g. "RD 204". */
export const callNumber = (i: number) => CALL_NUMBERS[i] ?? `RD ${400 + i}`

export const LEVEL_SHORT: Record<Level, string> = { Foundation: 'F', Intermediate: 'I', Advanced: 'A' }

export interface BookStyle {
  /** Spine cloth colour and a darker edge. */
  cloth: string
  edge: string
  /** Foil / tooling colour. */
  foil: string
  /** Spine height in % of the tallest book, and width in px. */
  height: number
  width: number
  pattern: 'bands' | 'diamonds' | 'dots' | 'stripes' | 'frame' | 'scales'
}

/** One distinct binding per volume, in shelf order. */
export const BOOK_STYLES: BookStyle[] = [
  { cloth: '#7d2533', edge: '#4a121c', foil: '#f2c45a', height: 92, width: 76, pattern: 'bands' },
  { cloth: '#2c5a40', edge: '#15301f', foil: '#e9d08a', height: 82, width: 68, pattern: 'diamonds' },
  { cloth: '#26396b', edge: '#121d3d', foil: '#f2c45a', height: 100, width: 84, pattern: 'frame' },
  { cloth: '#a8722a', edge: '#5e3d12', foil: '#fff0c4', height: 87, width: 72, pattern: 'stripes' },
  { cloth: '#5a2c5f', edge: '#311634', foil: '#f0c96a', height: 95, width: 80, pattern: 'dots' },
  { cloth: '#1f5e62', edge: '#0f3335', foil: '#f5d58a', height: 80, width: 66, pattern: 'scales' },
  { cloth: '#8e3b26', edge: '#4f1d10', foil: '#ffd98a', height: 90, width: 78, pattern: 'bands' },
  { cloth: '#3a3d5c', edge: '#1d1f33', foil: '#e8c873', height: 85, width: 74, pattern: 'diamonds' },
]

export const bookStyle = (index: number) => BOOK_STYLES[index % BOOK_STYLES.length]

export const lectureIndex = (id: string) => lectures.findIndex((l) => l.id === id)
export const practiceIndex = (id: string) => practiceSets.findIndex((p) => p.id === id)

export const accuracyOf = (a: Pick<Attempt, 'score' | 'total'>) => (a.total > 0 ? a.score / a.total : 0)
export const pct = (fraction: number) => `${Math.round(fraction * 100)}%`

/** "12 Oct" */
export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** "12 OCT 2026" for library due-date stamps. */
export function stampDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
}

export function isToday(iso: string | undefined) {
  if (!iso) return false
  const d = new Date(iso)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

/** Academic Reading raw score (out of 40) → band, using the commonly published conversion. */
const BAND_TABLE: [number, number][] = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [33, 7.5],
  [30, 7],
  [27, 6.5],
  [23, 6],
  [19, 5.5],
  [15, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
]

/**
 * About 30/40 on the Academic paper is Band 7. One threshold for the whole section:
 * the results ring, the Reading Log chart and every line of owl copy use it.
 */
export const BAND7_ACCURACY = 0.75
/** Scores from here on get the confetti (the brief's 70%), even if they are still Band 6.5. */
export const CELEBRATE_ACCURACY = 0.7

/** A rough band if this accuracy held across a full 40-question Academic paper. */
export function bandEstimate(score: number, total: number) {
  if (total <= 0) return 0
  const raw = Math.round((score / total) * 40)
  return BAND_TABLE.find(([min]) => raw >= min)?.[1] ?? 2
}

export type NextStep =
  | { kind: 'lecture'; lecture: Lecture; started: boolean; watched: number }
  | { kind: 'practice'; practice: PracticeInfo; best?: Attempt; reason: 'new' | 'improve' }
  | { kind: 'practice'; practice: PracticeInfo; best?: Attempt; reason: 'resume'; draft: DraftSummary }

/** A practice test left half-way (its saved bookmark). */
export interface DraftSummary {
  answered: number
  elapsed: number
  savedAt: string
}

/** Every practice set with a saved, unfinished attempt for this student. */
export function draftsFor(userId: string): Record<string, DraftSummary> {
  const out: Record<string, DraftSummary> = {}
  for (const p of practiceSets) {
    const d = loadDraft(userId, p.id)
    if (d) out[p.id] = { answered: Object.values(d.answers).filter((v) => v && v.trim()).length, elapsed: d.elapsed, savedAt: d.savedAt }
  }
  return out
}

/**
 * What the student should do next: finish a test left half-way, else continue/start
 * a lecture, else a new test, else beat the weakest best score.
 */
export function nextStep(
  stats: SectionStats,
  watchedOf: (id: string) => number,
  drafts: Record<string, DraftSummary> = {},
): NextStep | undefined {
  const latestDraft = Object.entries(drafts).sort(([, a], [, b]) => (b.savedAt > a.savedAt ? 1 : -1))[0]
  const draftSet = latestDraft && practiceSets.find((p) => p.id === latestDraft[0])
  if (draftSet) return { kind: 'practice', practice: draftSet, best: stats.best[draftSet.id], reason: 'resume', draft: latestDraft[1] }
  const lecture = stats.nextLecture
  if (lecture) {
    const watched = watchedOf(lecture.id)
    return { kind: 'lecture', lecture, started: watched > 0, watched }
  }
  return practiceStep(stats)
}

/** The practice test to borrow next: the first one never tried, else the weakest best score. */
export function practiceStep(stats: SectionStats): Extract<NextStep, { kind: 'practice' }> | undefined {
  const fresh = practiceSets.find((p) => !stats.best[p.id])
  if (fresh) return { kind: 'practice', practice: fresh, reason: 'new' }
  const weakest = [...practiceSets].sort((a, b) => accuracyOf(stats.best[a.id]) - accuracyOf(stats.best[b.id]))[0]
  if (weakest) return { kind: 'practice', practice: weakest, best: stats.best[weakest.id], reason: 'improve' }
  return undefined
}

/** The librarian's words of the night — genuinely useful IELTS Reading tips. */
export const LIBRARIAN_TIPS = [
  'Read the title and first paragraph slowly. They are the map for everything after them.',
  'NOT GIVEN means the passage is silent. If you can find a contradiction, it is FALSE instead.',
  'Word limits are strict: “NO MORE THAN TWO WORDS” means a third word costs the whole mark.',
  'Headings match the whole paragraph. If a heading fits only one sentence, it is a decoy.',
  'Most question types follow passage order. Matching headings and “which paragraph” do not.',
  'A word in an option that also appears in the passage is a warning sign, not a guarantee.',
  'There is no penalty for wrong answers. Never leave a box empty.',
  'Spelling counts. Copy words from the passage letter by letter.',
  'About 30 correct answers out of 40 is roughly Band 7 on the Academic test.',
  'Stuck for more than 90 seconds? Guess, flag the question and come back later.',
]
