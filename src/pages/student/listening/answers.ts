import type { GapQuestion, Question, WordLimit } from './practice-data'

/*
 * Marking, IELTS style: case and extra spaces never matter, spelling does,
 * numbers may be written with or without spaces / £ / ordinal endings, and an
 * answer over the word limit scores nothing.
 */

export type Verdict = 'correct' | 'wrong' | 'blank' | 'limit' | 'spelling'

export interface Marked {
  n: number
  given: string
  correct: boolean
  verdict: Verdict
}

const tidy = (s: string) =>
  s
    .toLowerCase()
    .replace(/[‘’`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^["']+|["'.,;:!?]+$/g, '')
    .trim()

const NUMERIC_TOKEN = /^[£$€]?\d[\d.,:/-]*(st|nd|rd|th|am|pm)?$/i

/** Numbers compared as bare digits: "£95.00" → "95", "12th" → "12", "07946 381552" → "07946381552". */
function digits(s: string) {
  return tidy(s)
    .replace(/[£$€,\s-]/g, '')
    .replace(/(\d)(st|nd|rd|th)$/i, '$1')
    .replace(/\.0+$/, '')
}

/** Words and numbers in an answer; neighbouring number groups (a phone number) count as one number. */
export function countAnswer(raw: string) {
  const tokens = tidy(raw).split(' ').filter(Boolean)
  let words = 0
  let numbers = 0
  let prevNumeric = false
  for (const token of tokens) {
    const numeric = NUMERIC_TOKEN.test(token)
    if (numeric && !prevNumeric) numbers++
    if (!numeric) words++
    prevNumeric = numeric
  }
  return { words, numbers }
}

export function overLimit(raw: string, limit?: WordLimit) {
  if (!limit || !raw.trim()) return false
  const { words, numbers } = countAnswer(raw)
  if (limit.number) return words > limit.words || numbers > 1
  return words + numbers > limit.words
}

function distance(a: string, b: string) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return dp[b.length]
}

function matchesGap(q: GapQuestion, raw: string) {
  const accepted = [q.answer, ...(q.accept ?? [])]
  const given = tidy(raw)
  if (accepted.some((a) => tidy(a) === given)) return true
  if (q.numeric) {
    const d = digits(raw)
    return /^\d+$/.test(d) && accepted.some((a) => digits(a) === d)
  }
  return false
}

export function mark(q: Question, raw: string | undefined, limit?: WordLimit): Marked {
  const given = (raw ?? '').trim()
  if (!given) return { n: q.n, given, correct: false, verdict: 'blank' }

  if (q.kind !== 'gap') {
    const correct = given.toUpperCase() === q.answer
    return { n: q.n, given: given.toUpperCase(), correct, verdict: correct ? 'correct' : 'wrong' }
  }

  if (overLimit(given, limit)) return { n: q.n, given, correct: false, verdict: 'limit' }
  if (matchesGap(q, given)) return { n: q.n, given, correct: true, verdict: 'correct' }
  const near = !q.numeric && q.answer.length >= 4 && distance(tidy(given), tidy(q.answer)) <= 2
  return { n: q.n, given, correct: false, verdict: near ? 'spelling' : 'wrong' }
}

/** IELTS Listening raw score → band (the published conversion is close to this). */
const BANDS: [number, number][] = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [32, 7.5],
  [30, 7],
  [26, 6.5],
  [23, 6],
  [18, 5.5],
  [16, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [0, 0],
]

/** A rough band for this accuracy, as if it held across all 40 questions. */
export function bandForAccuracy(accuracy: number) {
  const raw = Math.round(accuracy * 40)
  return BANDS.find(([min]) => raw >= min)?.[1] ?? 0
}
