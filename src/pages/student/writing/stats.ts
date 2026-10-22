import type { Attempt } from '../../../learn/progress'
import type { Criterion } from './analysis'
import { metaFor } from './content'
import { judgeFloor } from './words'

/** What a writing attempt keeps in `detail`. */
export interface WritingDetail {
  words: number
  text: string
  /** Self-assessed band per criterion. */
  criteria?: Partial<Record<Criterion, number>>
  /** Checklist ids that were met. */
  met?: string[]
}

export const CRITERIA: { id: Criterion; name: string; short: string; lecture: string }[] = [
  { id: 'TA', name: 'Task Achievement / Response', short: 'Task', lecture: 'essay-types' },
  { id: 'CC', name: 'Coherence & Cohesion', short: 'Coherence', lecture: 'coherence-cohesion' },
  { id: 'LR', name: 'Lexical Resource', short: 'Vocabulary', lecture: 'lexical-resource' },
  { id: 'GRA', name: 'Grammatical Range & Accuracy', short: 'Grammar', lecture: 'grammar-range' },
]

export function detailOf(a: Attempt): WritingDetail {
  const d = (a.detail ?? {}) as Partial<WritingDetail>
  return {
    words: typeof d.words === 'number' ? d.words : 0,
    text: typeof d.text === 'string' ? d.text : '',
    criteria: d.criteria && typeof d.criteria === 'object' ? d.criteria : undefined,
    met: Array.isArray(d.met) ? d.met : undefined,
  }
}

export interface WritingSummary {
  words: number
  essays: number
  bestBand: number | null
  /** Oldest first. */
  bands: { at: string; band: number; practiceId: string; score: number; total: number }[]
  latestCriteria?: Partial<Record<Criterion, number>>
  firstCriteria?: Partial<Record<Criterion, number>>
  assessed: number
}

/**
 * A band estimate only counts towards records and the chart when the text was
 * long enough to judge (half the minimum): a near-empty sheet graded 8 proves nothing.
 */
export const hasJudgedBand = (a: Attempt) =>
  typeof a.band === 'number' && a.band > 0 && detailOf(a).words >= judgeFloor(metaFor(a.practiceId).minWords)

/** Highest judged band among `attempts`, or null. */
export const bestBandOf = (attempts: Attempt[]) =>
  attempts.reduce<number | null>((b, a) => (hasJudgedBand(a) && (b === null || (a.band as number) > b) ? (a.band as number) : b), null)

/** `attempts` newest first (as SectionStats gives them). */
export function summarise(attempts: Attempt[]): WritingSummary {
  const oldestFirst = [...attempts].reverse()
  const withBand = oldestFirst.filter(hasJudgedBand)
  const withCriteria = withBand.filter((a) => detailOf(a).criteria)
  return {
    words: attempts.reduce((sum, a) => sum + detailOf(a).words, 0),
    essays: attempts.length,
    bestBand: withBand.length ? Math.max(...withBand.map((a) => a.band as number)) : null,
    bands: withBand.map((a) => ({ at: a.at, band: a.band as number, practiceId: a.practiceId, score: a.score, total: a.total })),
    latestCriteria: withCriteria.length ? detailOf(withCriteria[withCriteria.length - 1]).criteria : undefined,
    firstCriteria: withCriteria.length > 1 ? detailOf(withCriteria[0]).criteria : undefined,
    assessed: withCriteria.length,
  }
}

export const formatBand = (b: number) => b.toFixed(1)

export function formatDate(iso: string, withTime = false) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
}

/** "3 min ago", "yesterday", "12 Oct". */
export function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
  if (diff < 172800) return 'yesterday'
  return formatDate(iso)
}
