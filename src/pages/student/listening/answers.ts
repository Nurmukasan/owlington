import type { GapQuestion, Question, WordLimit } from './practice-data'

/*
 * Marking, IELTS style: case and extra spaces never matter, spelling does,
 * numbers may be written with or without spaces / £ / ordinal endings, and an
 * answer over the word limit scores nothing.
 */

export type Verdict = 'correct' | 'wrong' | 'blank' | 'limit' | 'spelling' | 'plural' | 'misheard'

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

/** "notebooks" for "notebook", "library" for "libraries": the right word in the wrong number. */
function pluralSlip(given: string, key: string) {
  const forms = (w: string) => [w + 's', w + 'es', w.endsWith('y') ? w.slice(0, -1) + 'ies' : '']
  return forms(key).includes(given) || forms(given).includes(key)
}

const VOWEL = /[aeiouy]/

/** Same length, one letter swapped, and both letters are vowels ("patch" for "pitch"). */
function vowelSwap(a: string, b: string) {
  if (a.length !== b.length) return false
  const diff = [...a].map((c, i) => [c, b[i]]).filter(([x, y]) => x !== y)
  return diff.length === 1 && VOWEL.test(diff[0][0]) && VOWEL.test(diff[0][1])
}

/**
 * Why a near-miss gap answer lost the mark, so the review teaches the right lesson:
 * - plural: right word, wrong number (the Numbers & spelling tape warns about this);
 * - spelling: the right word, misspelt (same first letter, small slip in a longer word);
 * - misheard: a different word that sounds close ("light" for "night"), or a word that was
 *   actually said in the recording (a distractor);
 * - wrong: anything else.
 */
function nearMiss(q: GapQuestion, raw: string, heard?: Set<string>): Verdict {
  if (q.numeric) return 'wrong'
  const given = tidy(raw)
  const key = tidy(q.answer)
  if (pluralSlip(given, key) || (q.accept ?? []).some((a) => pluralSlip(given, tidy(a)))) return 'plural'
  const d = distance(given, key)
  if (d > 2 || key.length < 4) return 'wrong'
  if (heard?.has(given)) return 'misheard'
  const spelling =
    given[0] === key[0] && ((d === 1 && key.length >= 5) || key.length >= 7) && !(key.length <= 5 && vowelSwap(given, key))
  return spelling ? 'spelling' : 'misheard'
}

/** Lower-case words of a recording, to tell a misheard distractor from a spelling slip. */
export function wordsHeard(lines: string[]) {
  return new Set(lines.flatMap((t) => tidy(t).split(/[^a-z0-9'-]+/).filter(Boolean)))
}

export function mark(q: Question, raw: string | undefined, limit?: WordLimit, heard?: Set<string>): Marked {
  const given = (raw ?? '').trim()
  if (!given) return { n: q.n, given, correct: false, verdict: 'blank' }

  if (q.kind !== 'gap') {
    const correct = given.toUpperCase() === q.answer
    return { n: q.n, given: given.toUpperCase(), correct, verdict: correct ? 'correct' : 'wrong' }
  }

  if (overLimit(given, limit)) return { n: q.n, given, correct: false, verdict: 'limit' }
  if (matchesGap(q, given)) return { n: q.n, given, correct: true, verdict: 'correct' }
  return { n: q.n, given, correct: false, verdict: nearMiss(q, given, heard) }
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
  [2, 2],
  // Band 0 means "did not attempt"; anyone who sat the test is at least a 1.
  [0, 1],
]

/** A rough band for this accuracy, as if it held across all 40 questions. */
export function bandForAccuracy(accuracy: number) {
  const raw = Math.round(accuracy * 40)
  return BANDS.find(([min]) => raw >= min)?.[1] ?? 1
}

/** How a band estimate is shown: very low estimates read "below 2.5" rather than a discouraging 1.0. */
export const bandText = (band: number) => (band < 2.5 ? 'Below 2.5' : band.toFixed(1))
