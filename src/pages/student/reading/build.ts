import type { Choice, Layout, Paragraph, PracticeSet, Question, QuestionGroup, ReadingTest, Segment } from './practice-data'

/*
 * Authoring helpers for reading tests. A test file reads almost like the
 * printed paper:
 *
 *   export default test('rt-01', [
 *     passage({
 *       title: 'The Night Shift',
 *       sub: 'While the bees sleep…',
 *       text: `
 *         A
 *         First sentence of paragraph A.
 *         Second sentence.
 *
 *         B
 *         …`,
 *       groups: [
 *         tfng([['Statement', 'T', 'A2', 'Why it is TRUE.'], …]),
 *         summary('Title', 2, 'Text with a [[gap|also accepted]] in it.', [['B3', 'Why.']]),
 *       ],
 *     }),
 *   ])
 *
 * Paragraphs are blocks separated by a blank line: the first line is the
 * letter, every other line is one sentence (sentence ids are "A1", "A2"…).
 * Gaps are written [[answer|alternative]]; in word-box tasks the gap holds
 * the word from the box. Evidence is a list of sentence ids, "B3 C1".
 */

/** Sentence ids that prove an answer, e.g. "B3 C1". */
type Ev = string
/** Evidence and explanation for one gap, in the order the gaps appear. */
export type Key = [ev: Ev, why: string]

interface Context {
  paragraphs: Paragraph[]
}
type GroupMaker = (ctx: Context) => QuestionGroup

const evidence = (ev: Ev) => ev.split(/[\s,]+/).filter(Boolean)

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii']
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const LIMIT_WORDS = ['', 'ONE', 'TWO', 'THREE']

/** "ONE WORD ONLY", "NO MORE THAN TWO WORDS", "ONE WORD AND/OR A NUMBER"… */
export function limitText(maxWords: number, number = false) {
  if (maxWords === 1) return number ? 'ONE WORD AND/OR A NUMBER' : 'ONE WORD ONLY'
  return `NO MORE THAN ${LIMIT_WORDS[maxWords]} WORDS${number ? ' AND/OR A NUMBER' : ''}`
}

const lettered = (labels: string[]): Choice[] => labels.map((label, i) => ({ value: LETTERS[i], label }))
const span = (labels: string[]) => `${labels[0]}–${labels[labels.length - 1]}`

/** Split "[[a|b]]" gaps out of a line of text. */
function segmentsOf(text: string, onGap: (content: string) => number): Segment[] {
  const out: Segment[] = []
  let last = 0
  for (const m of text.matchAll(/\[\[([^\]]+)\]\]/g)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(onGap(m[1]))
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** The text around one gap of a line: other gaps on the line show as blanks. */
function around(segs: Segment[], index: number) {
  const pos = segs.indexOf(index)
  const text = (part: Segment[]) =>
    part
      .map((s) => (typeof s === 'number' ? '______' : s))
      .join('')
      .replace(/\s+/g, ' ')
  return { before: text(segs.slice(0, pos)).trim(), after: text(segs.slice(pos + 1)).trim() }
}

/**
 * Turns gap markers into questions. With a word box, each marker holds a word from the box
 * and the answer is that word's letter; otherwise the marker lists the accepted answers.
 */
function gapFactory(keys: Key[], words?: string[]) {
  const questions: Question[] = []
  const add = (content: string) => {
    const key = keys[questions.length]
    if (!key) throw new Error(`No key for gap "${content}"`)
    let answers = content.split('|').map((a) => a.trim())
    if (words) {
      const i = words.indexOf(content.trim())
      if (i < 0) throw new Error(`"${content}" is not in the word box`)
      answers = [LETTERS[i]]
    }
    questions.push({ id: '', type: 'gap', before: '', after: '', answers, evidence: evidence(key[0]), explanation: key[1] })
    return questions.length - 1
  }
  const done = () => {
    if (questions.length !== keys.length) throw new Error(`${questions.length} gaps but ${keys.length} keys`)
    return questions
  }
  return { add, done }
}

/** Fill in each gap question's before/after from the line it sits on. */
function placeGaps(questions: Question[], lines: Segment[][]) {
  for (const segs of lines)
    for (const s of segs)
      if (typeof s === 'number') {
        const q = questions[s]
        if (q.type === 'gap') Object.assign(q, around(segs, s))
      }
}

function completion(
  kind: 'notes' | 'table' | 'flow',
  what: string,
  title: string,
  maxWords: number,
  words: string[] | undefined,
  number: boolean,
  build: (add: (content: string) => number) => { layout: Layout; lines: Segment[][] },
  keys: Key[],
): GroupMaker {
  return () => {
    const gaps = gapFactory(keys, words)
    const { layout, lines } = build(gaps.add)
    const questions = gaps.done()
    placeGaps(questions, lines)
    const limit = words ? undefined : limitText(maxWords, number)
    return {
      kind,
      instructions: words
        ? `Complete the ${what} using the list of words, ${span([...LETTERS.slice(0, words.length)])}, below.`
        : `Complete the ${what} below. Choose ${limit} from the passage for each answer.`,
      maxWords: words ? undefined : maxWords,
      limit,
      options: words ? lettered(words) : undefined,
      optionsTitle: words ? 'Word box' : undefined,
      summaryTitle: title,
      layout,
      questions,
    }
  }
}

// ------------------------------------------------------------- groups ---

const TF = { T: 'TRUE', F: 'FALSE', NG: 'NOT GIVEN' } as const
const YN = { Y: 'YES', N: 'NO', NG: 'NOT GIVEN' } as const

/** True / False / Not Given: [statement, 'T' | 'F' | 'NG', evidence, why]. */
export const tfng =
  (items: [string, keyof typeof TF, Ev, string][]): GroupMaker =>
  () => ({
    kind: 'tfng',
    instructions: 'Do the following statements agree with the information given in the reading passage?',
    questions: items.map(([prompt, a, ev, why]) => ({
      id: '',
      type: 'tfng',
      prompt,
      answer: TF[a],
      evidence: evidence(ev),
      explanation: why,
    })),
  })

/** Yes / No / Not Given: [statement, 'Y' | 'N' | 'NG', evidence, why]. */
export const ynng =
  (items: [string, keyof typeof YN, Ev, string][]): GroupMaker =>
  () => ({
    kind: 'ynng',
    instructions: 'Do the following statements agree with the claims of the writer in the reading passage?',
    questions: items.map(([prompt, a, ev, why]) => ({
      id: '',
      type: 'ynng',
      prompt,
      answer: YN[a],
      evidence: evidence(ev),
      explanation: why,
    })),
  })

/** Multiple choice, one answer: [question, options, letter, evidence, why]. */
export const mcq =
  (items: [string, string[], string, Ev, string][]): GroupMaker =>
  () => ({
    kind: 'mcq',
    instructions: `Choose the correct letter, ${items[0][1].map((_, i) => LETTERS[i]).join(', ').replace(/, (\w)$/, ' or $1')}.`,
    questions: items.map(([prompt, options, answer, ev, why]) => ({
      id: '',
      type: 'mcq',
      prompt,
      options,
      answer,
      evidence: evidence(ev),
      explanation: why,
    })),
  })

/** "Choose TWO letters": both answers score, in either order. Keys follow the answers in alphabetical order. */
export const choose2 =
  (prompt: string, options: string[], answers: [string, string], keys: [Key, Key]): GroupMaker =>
  () => {
    const sorted = [...answers].sort()
    return {
      kind: 'choose2',
      instructions: `Choose TWO letters, ${span([...LETTERS.slice(0, options.length)])}.`,
      prompt,
      options: lettered(options),
      questions: sorted.map((answer, i) => ({
        id: '',
        type: 'pick',
        answer,
        evidence: evidence(keys[i][0]),
        explanation: keys[i][1],
      })),
    }
  }

/** Matching headings: [paragraph, roman numeral, evidence, why]. Headings are numbered i, ii, iii… */
export const headings =
  (list: string[], items: [string, string, Ev, string][]): GroupMaker =>
  ({ paragraphs }) => {
    const labels = paragraphs.map((p) => p.label)
    const asked = items.map((i) => i[0])
    const which =
      asked.length === labels.length
        ? 'each paragraph'
        : `paragraphs ${asked.length > 2 && labels.indexOf(asked[asked.length - 1]) - labels.indexOf(asked[0]) === asked.length - 1 ? span(asked) : asked.join(', ').replace(/, (\w)$/, ' and $1')}`
    return {
      kind: 'headings',
      instructions: `The reading passage has ${NUMBER_WORDS[labels.length]} paragraphs, ${span(labels)}. Choose the correct heading for ${which} from the list of headings below.`,
      optionsTitle: 'List of Headings',
      options: list.map((label, i) => ({ value: ROMAN[i], label })),
      questions: items.map(([paragraph, answer, ev, why]) => ({
        id: '',
        type: 'choose',
        prompt: `Paragraph ${paragraph}`,
        paragraph,
        answer,
        evidence: evidence(ev),
        explanation: why,
      })),
    }
  }

/** Which paragraph contains the following information: [information, letter, evidence, why]. */
export const info =
  (items: [string, string, Ev, string][], reuse = false): GroupMaker =>
  ({ paragraphs }) => {
    const labels = paragraphs.map((p) => p.label)
    return {
      kind: 'paragraphs',
      instructions: `The reading passage has ${NUMBER_WORDS[labels.length]} paragraphs, ${span(labels)}. Which paragraph contains the following information? Choose the correct letter, ${span(labels)}.${reuse ? ' NB You may use any letter more than once.' : ''}`,
      options: labels.map((l) => ({ value: l, label: `Paragraph ${l}` })),
      questions: items.map(([prompt, answer, ev, why]) => ({
        id: '',
        type: 'choose',
        prompt,
        answer,
        evidence: evidence(ev),
        explanation: why,
      })),
    }
  }

/**
 * Matching features: statements matched to a list of people, places or dates.
 * `noun` is [singular, plural], e.g. ['researcher', 'researchers'].
 */
export const features =
  (noun: [string, string], list: string[], items: [string, string, Ev, string][], reuse = true): GroupMaker =>
  () => ({
    kind: 'features',
    instructions: `Look at the following statements and the list of ${noun[1]} below. Match each statement with the correct ${noun[0]}, ${span([...LETTERS.slice(0, list.length)])}.${reuse ? ' NB You may use any letter more than once.' : ''}`,
    optionsTitle: `List of ${noun[1][0].toUpperCase()}${noun[1].slice(1)}`,
    options: lettered(list),
    questions: items.map(([prompt, answer, ev, why]) => ({
      id: '',
      type: 'choose',
      prompt,
      answer,
      evidence: evidence(ev),
      explanation: why,
    })),
  })

/** Matching sentence endings: [sentence start, letter, evidence, why]. */
export const endings =
  (list: string[], items: [string, string, Ev, string][]): GroupMaker =>
  () => ({
    kind: 'endings',
    instructions: `Complete each sentence with the correct ending, ${span([...LETTERS.slice(0, list.length)])}, below.`,
    optionsTitle: 'Sentence endings',
    options: lettered(list),
    questions: items.map(([prompt, answer, ev, why]) => ({
      id: '',
      type: 'choose',
      prompt,
      answer,
      evidence: evidence(ev),
      explanation: why,
    })),
  })

/** Sentence completion: [sentence with one [[gap]], evidence, why]. */
export const sentences =
  (maxWords: number, items: [string, Ev, string][], number = false): GroupMaker =>
  () => {
    const gaps = gapFactory(items.map(([, ev, why]) => [ev, why]))
    const lines = items.map(([text]) => segmentsOf(text, gaps.add))
    const questions = gaps.done()
    placeGaps(questions, lines)
    const limit = limitText(maxWords, number)
    return {
      kind: 'sentences',
      instructions: `Complete the sentences below. Choose ${limit} from the passage for each answer.`,
      maxWords,
      limit,
      questions,
    }
  }

/** Summary completion with words from the passage (or, given `words`, from a box). */
export function summary(
  title: string,
  maxWords: number,
  text: string,
  keys: Key[],
  opts: { words?: string[]; number?: boolean } = {},
): GroupMaker {
  return () => {
    const { words, number = false } = opts
    const gaps = gapFactory(keys, words)
    const segs = segmentsOf(text.replace(/\s+/g, ' ').trim(), gaps.add)
    const questions = gaps.done()
    // Each gap carries the text since the previous gap; the last one also carries the tail.
    let before = ''
    for (const s of segs) {
      if (typeof s === 'string') {
        before += s
        continue
      }
      const q = questions[s]
      if (q.type === 'gap') {
        q.before = before.trim()
        q.after = ''
      }
      before = ''
    }
    const lastQ = questions[questions.length - 1]
    if (lastQ?.type === 'gap') lastQ.after = before.trim()
    const limit = words ? undefined : limitText(maxWords, number)
    return {
      kind: words ? 'wordbox' : 'summary',
      instructions: words
        ? `Complete the summary using the list of words and phrases, ${span([...LETTERS.slice(0, words.length)])}, below.`
        : `Complete the summary below. Choose ${limit} from the passage for each answer.`,
      maxWords: words ? undefined : maxWords,
      limit,
      options: words ? lettered(words) : undefined,
      optionsTitle: words ? 'Word box' : undefined,
      summaryTitle: title,
      questions,
    }
  }
}

/** Note completion. Lines starting "# " are headings and "- " are bullets. */
export const notes = (
  title: string,
  maxWords: number,
  lines: string[],
  keys: Key[],
  opts: { words?: string[]; number?: boolean } = {},
) =>
  completion('notes', 'notes', title, maxWords, opts.words, opts.number ?? false, (add) => {
    const parsed = lines.map((line) => {
      const heading = line.startsWith('# ')
      const bullet = line.startsWith('- ')
      return { segs: segmentsOf(heading || bullet ? line.slice(2) : line, add), heading, bullet }
    })
    return { layout: { type: 'notes', lines: parsed }, lines: parsed.map((l) => l.segs) }
  }, keys)

/** Table completion: a header row, then rows of cells that may hold gaps. */
export const table = (
  title: string,
  maxWords: number,
  head: string[],
  rows: string[][],
  keys: Key[],
  opts: { words?: string[]; number?: boolean } = {},
) =>
  completion('table', 'table', title, maxWords, opts.words, opts.number ?? false, (add) => {
    const cells = rows.map((row) => row.map((cell) => segmentsOf(cell, add)))
    return { layout: { type: 'table', head, rows: cells }, lines: cells.flat() }
  }, keys)

/** Flow-chart completion: one box per step. */
export const flow = (
  title: string,
  maxWords: number,
  steps: string[],
  keys: Key[],
  opts: { words?: string[]; number?: boolean } = {},
) =>
  completion('flow', 'flow-chart', title, maxWords, opts.words, opts.number ?? false, (add) => {
    const boxes = steps.map((step) => segmentsOf(step, add))
    return { layout: { type: 'flow', steps: boxes }, lines: boxes }
  }, keys)

/** Short-answer questions: [question, accepted answers "a|b", evidence, why]. */
export const short =
  (maxWords: number, items: [string, string, Ev, string][], number = false): GroupMaker =>
  () => {
    const limit = limitText(maxWords, number)
    return {
      kind: 'short',
      instructions: `Answer the questions below. Choose ${limit} from the passage for each answer.`,
      maxWords,
      limit,
      questions: items.map(([before, answers, ev, why]) => ({
        id: '',
        type: 'gap',
        before,
        after: '',
        answers: answers.split('|').map((a) => a.trim()),
        evidence: evidence(ev),
        explanation: why,
      })),
    }
  }

// ------------------------------------------------------------ passages ---

function parseText(text: string): Paragraph[] {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const [label, ...lines] = block
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
      return { label, sentences: lines.map((t, i) => ({ id: `${label}${i + 1}`, text: t })) }
    })
}

export interface PassageSpec {
  title: string
  sub: string
  text: string
  groups: GroupMaker[]
}

export function passage(spec: PassageSpec): PracticeSet {
  const paragraphs = parseText(spec.text)
  return {
    id: '',
    passageTitle: spec.title,
    passageSubtitle: spec.sub,
    paragraphs,
    groups: spec.groups.map((make) => make({ paragraphs })),
  }
}

/** A test of one or three passages; question ids are "<test id>-<number>". */
export function test(id: string, passages: PracticeSet[]): ReadingTest {
  let n = 0
  passages.forEach((p, i) => {
    p.id = `${id}-p${i + 1}`
    for (const g of p.groups) for (const q of g.questions) q.id = `${id}-${++n}`
  })
  return { id, passages }
}
