/*
 * Helpers for the practice page: question ranges, marking a whole paper, and
 * cutting transcript lines into answer / trap / plain pieces for the review.
 */
import { mark, wordsHeard, type Marked } from '../answers'
import { prefersReducedMotion } from '../hooks'
import { isPause, questionsOf, type PracticeSet, type Question, type ScriptItem, type SpokenLine, type TaskGroup } from '../practice-data'

export type Range = [number, number]
export type Mode = 'exam' | 'practice'
export type Answers = Record<number, string>
export type AudioSource = 'voices' | 'transcript'

/** Speech rates offered on the desk. */
export const RATES = [0.8, 0.9, 1, 1.1, 1.25]

/** "questions 1–5" → [1, 5]. */
export function rangeOf(label: string): Range | null {
  const m = label.match(/(\d+)\s*[–-]\s*(\d+)/)
  return m ? [Number(m[1]), Number(m[2])] : null
}

/** For every script item, the block of questions most recently announced (null before the first reading time). */
export function liveRanges(script: ScriptItem[]) {
  let current: Range | null = null
  return script.map((item) => {
    if (isPause(item)) current = rangeOf(item.label)
    return current
  })
}

export const groupRange = (g: TaskGroup): Range => [g.questions[0].n, g.questions[g.questions.length - 1].n]
export const inRange = (n: number, r: Range | null) => Boolean(r && n >= r[0] && n <= r[1])
export const rangeText = ([a, b]: Range) => (a === b ? `Question ${a}` : `Questions ${a}–${b}`)

/** How each task type is named on the catalogue and in results. */
export const GROUP_LABEL: Record<TaskGroup['type'], string> = {
  form: 'Form completion',
  notes: 'Note completion',
  choice: 'Multiple choice',
  map: 'Map labelling',
  matching: 'Matching',
}

/** Per-question results in the shape the profile's results view reads. */
export function attemptItems(set: PracticeSet, marks: Marked[]) {
  return set.groups.flatMap((g) =>
    g.questions.map((q) => {
      const m = marks.find((x) => x.n === q.n)
      const withText = (key: string) => {
        const text = optionText(set, q, key)
        return text ? `${key} — ${text}` : key
      }
      return {
        n: q.n,
        type: GROUP_LABEL[g.type],
        correct: Boolean(m?.correct),
        given: m?.given ? (q.kind === 'gap' ? m.given : withText(m.given)) : undefined,
        answer: q.kind === 'gap' ? q.answer : withText(q.answer),
      }
    }),
  )
}

export function markAll(set: PracticeSet, answers: Answers): Marked[] {
  const heard = wordsHeard(spokenLines(set).map((l) => l.t))
  return set.groups.flatMap((g) => g.questions.map((q) => mark(q, answers[q.n], g.limit, heard)))
}

export const answeredCount = (set: PracticeSet, answers: Answers) => questionsOf(set).filter((q) => (answers[q.n] ?? '').trim()).length

/** Index of the script line that proves a question's answer. */
export const evidenceIndex = (set: PracticeSet, q: Question) => set.script.findIndex((item) => !isPause(item) && item.t.includes(q.evidence))

/** Short human label for a question, as it appears on the paper. */
export function questionLabel(set: PracticeSet, q: Question) {
  if (q.kind === 'choice') return q.stem
  if (q.kind === 'letter') return q.label
  const group = set.groups.find((g) => g.questions.includes(q))
  const row = group?.rows?.find((r) => r.text.includes(`{${q.n}}`))
  if (!row) return `Gap ${q.n}`
  if (row.label) return row.label
  // Notes: show the words around the gap, trimmed.
  const [before, after = ''] = row.text.split(`{${q.n}}`)
  const clean = (s: string) => s.replace(/\{\d+\}/g, '…').trim()
  const b = clean(before).split(' ').slice(-5).join(' ')
  const a = clean(after).split(' ').slice(0, 4).join(' ')
  return `${b} ___ ${a}`.trim()
}

/** The text of a lettered option (choice options or the group's box / map letters). */
export function optionText(set: PracticeSet, q: Question, key: string) {
  if (q.kind === 'choice') return q.options.find((o) => o.key === key)?.text
  if (q.kind === 'letter') {
    const group = set.groups.find((g) => g.questions.includes(q))
    if (group?.type === 'map') return undefined
    return group?.options?.find((o) => o.key === key)?.text
  }
  return undefined
}

// ----------------------------------------------------------- transcript ---

export interface Piece {
  text: string
  kind?: 'answer' | 'trap'
  q?: number
  note?: string
}

/** Splits a line into plain text, answer evidence and planted distractors. */
export function piecesOf(line: SpokenLine, set: PracticeSet, showTraps = true): Piece[] {
  const marks: { at: number; len: number; piece: Piece }[] = []
  for (const q of questionsOf(set)) {
    const at = line.t.indexOf(q.evidence)
    if (at >= 0) marks.push({ at, len: q.evidence.length, piece: { text: q.evidence, kind: 'answer', q: q.n } })
  }
  if (showTraps) {
    for (const t of set.traps) {
      const at = line.t.indexOf(t.phrase)
      if (at >= 0 && !marks.some((m) => at < m.at + m.len && m.at < at + t.phrase.length))
        marks.push({ at, len: t.phrase.length, piece: { text: t.phrase, kind: 'trap', q: t.q, note: t.note } })
    }
  }
  marks.sort((a, b) => a.at - b.at)
  const out: Piece[] = []
  let cursor = 0
  for (const m of marks) {
    if (m.at < cursor) continue
    if (m.at > cursor) out.push({ text: line.t.slice(cursor, m.at) })
    out.push(m.piece)
    cursor = m.at + m.len
  }
  if (cursor < line.t.length) out.push({ text: line.t.slice(cursor) })
  return out
}

// ------------------------------------------------------------- speakers ---

const SPEAKER_COLORS = ['#6fe3cf', '#ffb627', '#ff6fcf', '#9b84ff', '#5fc8ff']

/** A stable colour per speaker: the announcer is a quiet grey-blue, the cast gets the station colours. */
export function speakerColor(set: PracticeSet, id: string) {
  if (id === 'ann') return '#8fa3d6'
  const cast = set.speakers.filter((s) => s.id !== 'ann')
  const i = cast.findIndex((s) => s.id === id)
  return SPEAKER_COLORS[Math.max(0, i) % SPEAKER_COLORS.length]
}

export const spokenLines = (set: PracticeSet) => set.script.filter((i): i is SpokenLine => !isPause(i))

/** Seconds of silent reading time in the script. */
export const readingSeconds = (set: PracticeSet) => set.script.reduce((s, i) => s + (isPause(i) ? i.wait : 0), 0)

// ------------------------------------------------------------ navigation ---

/** Scrolls a question into view, focuses its input and flashes it. */
export function focusQuestion(n: number) {
  const el = document.getElementById(`ls-q-${n}`)
  if (!el) return
  const target = el instanceof HTMLInputElement ? el : (el.querySelector<HTMLInputElement>('input:checked') ?? el.querySelector<HTMLInputElement>('input'))
  el.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  target?.focus({ preventScroll: true })
  const box = el.closest<HTMLElement>('[data-q]') ?? el
  box.classList.remove('is-flash')
  void box.offsetWidth
  box.classList.add('is-flash')
  window.setTimeout(() => box.classList.remove('is-flash'), 1300)
}
