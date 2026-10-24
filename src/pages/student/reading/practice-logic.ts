import type { GroupKind, PracticeSet, Question, QuestionGroup, ReadingTest } from './practice-data'

/*
 * Pure helpers for the Moonlit Library practice page: numbering, marking,
 * word limits, highlights and the saved draft. Imported only by the lazy
 * practice chunk.
 */

export interface NumberedQuestion {
  q: Question
  /** 1-based question number across the whole test. */
  n: number
  group: QuestionGroup
  /** Index of the group across the whole test. */
  groupIndex: number
  /** Index of the passage the question belongs to. */
  passage: number
}

export function numberQuestions(test: ReadingTest): NumberedQuestion[] {
  let n = 0
  let groupIndex = 0
  return test.passages.flatMap((set, passage) =>
    set.groups.flatMap((group) => {
      const gi = groupIndex++
      return group.questions.map((q) => ({ q, n: ++n, group, groupIndex: gi, passage }))
    }),
  )
}

/** "Questions 1–4" */
export function rangeLabel(items: NumberedQuestion[]) {
  const ns = items.map((x) => x.n)
  if (!ns.length) return ''
  return ns.length === 1 ? `Question ${ns[0]}` : `Questions ${ns[0]}–${ns[ns.length - 1]}`
}

// ------------------------------------------------------------ answers ---

export type Answers = Record<string, string>

const SMART = /[‘’`´]/g

/** Lower-case, straight quotes, single spaces, no surrounding punctuation. */
export function normalise(text: string) {
  return text
    .replace(SMART, "'")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[\s"'“”.,;:!?()]+|[\s"'“”.,;:!?()]+$/g, '')
}

/** IELTS counting: words are separated by spaces; a hyphenated word counts once. */
export function wordCount(text: string) {
  const t = text.trim()
  return t ? t.split(/\s+/).length : 0
}

export const isTyped = (x: NumberedQuestion) => x.q.type === 'gap' && !x.group.options

export function isOverLimit(x: NumberedQuestion, answer: string | undefined) {
  return Boolean(isTyped(x) && x.group.maxWords && answer && wordCount(answer) > x.group.maxWords)
}

export const isAnswered = (answer: string | undefined) => Boolean(answer && answer.trim())

/**
 * Whether an answer scores. "Choose TWO" answers score in either order, but the same letter
 * cannot score twice: `answers` holds the other answers of the pair.
 */
export function isCorrect(x: NumberedQuestion, answer: string | undefined, answers: Answers = {}): boolean {
  if (!isAnswered(answer)) return false
  const a = answer as string
  const { q } = x
  if (q.type === 'pick') {
    const pair = x.group.questions
    return pair.some((p) => p.type === 'pick' && p.answer === a) && !pair.some((p) => p.id !== q.id && answers[p.id] === a)
  }
  if (q.type === 'gap') {
    if (x.group.options) return a === q.answers[0]
    if (isOverLimit(x, a)) return false
    const given = normalise(a)
    return q.answers.some((accepted) => normalise(accepted) === given)
  }
  return a === q.answer
}

export interface Graded {
  x: NumberedQuestion
  answer: string
  correct: boolean
  answered: boolean
  overLimit: boolean
}

export function grade(questions: NumberedQuestion[], answers: Answers): Graded[] {
  return questions.map((x) => {
    const answer = answers[x.q.id] ?? ''
    return {
      x,
      answer,
      correct: isCorrect(x, answer, answers),
      answered: isAnswered(answer),
      overLimit: isOverLimit(x, answer),
    }
  })
}

// ------------------------------------------------------- display text ---

const LETTERS = 'ABCDEFGHIJ'
export const letter = (i: number) => LETTERS[i] ?? String(i + 1)

/** A readable version of an answer value, e.g. "B — Their body clock moves later". */
export function describe(x: NumberedQuestion, value: string | undefined): string {
  if (!isAnswered(value)) return ''
  const v = value as string
  const { q, group } = x
  if (q.type === 'mcq') {
    const i = LETTERS.indexOf(v)
    return q.options[i] ? `${v} — ${q.options[i]}` : v
  }
  if (q.type === 'choose' || q.type === 'pick' || (q.type === 'gap' && group.options)) {
    const option = group.options?.find((o) => o.value === v)
    if (!option) return v
    if (group.kind === 'paragraphs') return option.label
    return `${option.value} — ${option.label}`
  }
  return v
}

/** The correct answer, readable. */
export function correctText(x: NumberedQuestion) {
  const { q } = x
  if (q.type === 'gap') return describe(x, q.answers[0])
  return describe(x, q.answer)
}

/** Other typed answers that also score. */
export function alsoAccepted(x: NumberedQuestion) {
  return x.q.type === 'gap' && !x.group.options ? x.q.answers.slice(1) : []
}

// ------------------------------------------------------- question kinds ---

export const KIND_LABEL: Record<GroupKind, string> = {
  tfng: 'True / False / Not Given',
  ynng: 'Yes / No / Not Given',
  mcq: 'Multiple choice',
  choose2: 'Multiple choice (choose two)',
  headings: 'Matching headings',
  paragraphs: 'Matching information',
  features: 'Matching features',
  endings: 'Matching sentence endings',
  sentences: 'Sentence completion',
  summary: 'Summary completion',
  wordbox: 'Summary completion',
  notes: 'Note completion',
  table: 'Table completion',
  flow: 'Flow-chart completion',
  short: 'Short-answer questions',
}

/** The lecture that teaches each question type. */
export const KIND_LECTURE: Record<GroupKind, string> = {
  tfng: 'tfng',
  ynng: 'ynng',
  mcq: 'mcq',
  choose2: 'mcq',
  headings: 'headings',
  paragraphs: 'skim-scan',
  features: 'skim-scan',
  endings: 'paraphrase',
  sentences: 'completion',
  summary: 'completion',
  wordbox: 'completion',
  notes: 'completion',
  table: 'completion',
  flow: 'completion',
  short: 'completion',
}

/** One line on what each task asks you to do (shown on the intro card). */
export const KIND_HINT: Record<GroupKind, string> = {
  tfng: 'Does the passage agree, contradict, or say nothing?',
  ynng: 'Does the writer agree, disagree, or not say?',
  mcq: 'One correct option, three designed to tempt you.',
  choose2: 'Two correct options out of five, in either order.',
  headings: 'Match the main idea of each paragraph. Some headings are decoys.',
  paragraphs: 'Find which paragraph holds each piece of information.',
  features: 'Match each statement to a person, place or thing. Letters can repeat.',
  endings: 'Join each sentence start to the ending the passage supports.',
  sentences: 'Copy words from the passage, inside the word limit.',
  summary: 'Fill the gaps in a summary with words from the passage.',
  wordbox: 'Fill the gaps in a summary from a box of words.',
  notes: 'Complete a page of notes with words copied from the passage.',
  table: 'Fill the empty cells of a table with words from the passage.',
  flow: 'Follow a process step by step and fill in the missing stages.',
  short: 'Answer each question in a few words taken from the passage.',
}

export interface KindScore {
  kind: GroupKind
  label: string
  correct: number
  total: number
  lectureId: string
}

/** Score per question type, merging groups that share a label. */
export function scoreByKind(graded: Graded[]): KindScore[] {
  const map = new Map<string, KindScore>()
  for (const g of graded) {
    const kind = g.x.group.kind
    const label = KIND_LABEL[kind]
    const row = map.get(label) ?? { kind, label, correct: 0, total: 0, lectureId: KIND_LECTURE[kind] }
    row.total++
    if (g.correct) row.correct++
    map.set(label, row)
  }
  return [...map.values()]
}

/** Distinct kinds in a test, in order, merged by label. */
export function kindsOf(test: ReadingTest) {
  const seen = new Map<string, { kind: GroupKind; label: string; count: number }>()
  for (const g of test.passages.flatMap((p) => p.groups)) {
    const label = KIND_LABEL[g.kind]
    const row = seen.get(label) ?? { kind: g.kind, label, count: 0 }
    row.count += g.questions.length
    seen.set(label, row)
  }
  return [...seen.values()]
}

export function passageWords(set: PracticeSet) {
  return set.paragraphs.reduce((n, p) => n + p.sentences.reduce((m, s) => m + wordCount(s.text), 0), 0)
}

export const testWords = (test: ReadingTest) => test.passages.reduce((n, p) => n + passageWords(p), 0)

// ------------------------------------------------------------ highlights ---

export type Span = [start: number, end: number]
export type Highlights = Record<string, Span[]>

/** Add a span to a sentence's highlights, merging any that overlap or touch. */
export function addSpan(spans: Span[] = [], span: Span): Span[] {
  const all = [...spans, span].sort((a, b) => a[0] - b[0])
  const out: Span[] = []
  for (const [s, e] of all) {
    const last = out[out.length - 1]
    if (last && s <= last[1]) last[1] = Math.max(last[1], e)
    else out.push([s, e])
  }
  return out
}

export const highlightCount = (h: Highlights) => Object.values(h).reduce((n, spans) => n + spans.length, 0)

/** Highlights for every passage of a test, by passage index. */
export type TestHighlights = Highlights[]

export const allHighlightCount = (list: TestHighlights) => list.reduce((n, h) => n + highlightCount(h ?? {}), 0)

// ----------------------------------------------------------------- draft ---

export interface Draft {
  answers: Answers
  flagged: string[]
  highlights: TestHighlights
  elapsed: number
  savedAt: string
}

const draftKey = (userId: string, setId: string) => `owlington:rd-draft:${userId}:${setId}`

/** Drafts older than this are forgotten: a fortnight-old bookmark is no longer "where you left off". */
const DRAFT_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000
/** Below this many seconds, an untouched test is a peek, not a bookmark. */
const DRAFT_MIN_SECONDS = 60

/** True when a draft holds real work: an answer, a flag, a highlight or a minute of reading. */
export function draftHasWork(d: Pick<Draft, 'answers' | 'flagged' | 'highlights' | 'elapsed'>) {
  return (
    Object.values(d.answers).some(isAnswered) ||
    d.flagged.length > 0 ||
    allHighlightCount(d.highlights) > 0 ||
    d.elapsed >= DRAFT_MIN_SECONDS
  )
}

export function loadDraft(userId: string, setId: string): Draft | null {
  try {
    const raw = localStorage.getItem(draftKey(userId, setId))
    if (!raw) return null
    const d = JSON.parse(raw) as Draft
    if (!d || typeof d.answers !== 'object' || typeof d.elapsed !== 'number') return null
    const draft: Draft = {
      answers: d.answers ?? {},
      flagged: d.flagged ?? [],
      // Drafts from before multi-passage tests kept one passage's highlights.
      highlights: Array.isArray(d.highlights) ? d.highlights : [d.highlights ?? {}],
      elapsed: d.elapsed,
      savedAt: d.savedAt,
    }
    const age = Date.now() - new Date(draft.savedAt).getTime()
    if (!draftHasWork(draft) || !(age < DRAFT_MAX_AGE_MS)) {
      clearDraft(userId, setId)
      return null
    }
    return draft
  } catch {
    return null
  }
}

/** Keep a bookmark of the test in progress — or drop it, if nothing has been done yet. */
export function saveDraft(userId: string, setId: string, draft: Omit<Draft, 'savedAt'>) {
  if (!draftHasWork(draft)) {
    clearDraft(userId, setId)
    return
  }
  try {
    localStorage.setItem(draftKey(userId, setId), JSON.stringify({ ...draft, savedAt: new Date().toISOString() }))
  } catch {
    // Storage blocked: the draft simply isn't kept.
  }
}

export function clearDraft(userId: string, setId: string) {
  try {
    localStorage.removeItem(draftKey(userId, setId))
  } catch {
    // ignore
  }
}

// ------------------------------------------------------------- the owl ---

export function verdictLine(accuracy: number, band: number, band7: number) {
  const b = band.toFixed(1)
  if (accuracy >= 1) return 'Not a single mark missed. The whole library is applauding — very quietly, of course.'
  if (accuracy >= 0.85) return `Superb reading! At this accuracy you are in Band ${b} territory.`
  if (accuracy >= band7) return `Splendid! That is Band ${b} form — about ${Math.round(accuracy * 40)} of 40 on the real paper.`
  if (accuracy >= 0.7)
    return `Splendid — Band ${b} form, within touching distance of Band 7. One or two more marks per forty and you are there.`
  if (accuracy >= 0.5) return 'A solid night’s reading. Every mistake below is a lesson in disguise.'
  return 'Every expert reader started here. Let’s look at the evidence together — it is all in the passage.'
}
