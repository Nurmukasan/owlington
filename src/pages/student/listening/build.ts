import type {
  MapSpec,
  Option,
  PracticeSet,
  Question,
  Row,
  ScriptItem,
  Speaker,
  TaskGroup,
  Trap,
  WordLimit,
} from './practice-data'

/*
 * Authoring helpers for Owl FM broadcasts. A test reads like a recording
 * script plus a question paper:
 *
 *   export default test('full-01', [
 *     part({
 *       n: 1,
 *       title: 'Booking a holiday cottage',
 *       intro: 'You will hear a woman phoning a holiday company.',
 *       speakers: [person('jo', 'Jo', 'Caller', 'f', 'en-GB'), …],
 *       blocks: [
 *         {
 *           lines: `
 *             agent: Good morning, Seaview Cottages.
 *             jo: Hello, I'd like to book a cottage. || (what the voice says, if different)
 *           `,
 *           groups: [form('Booking form', limit(1, true), ['Name: Jo [[Barnes]]', …], [['Jo Barnes', 'Why.']])],
 *         },
 *       ],
 *       traps: [['the 5th of March', 6, 'She corrects herself.']],
 *     }),
 *   ])
 *
 * The announcer's lines ("Part 1. You will hear…", "First, you have some time
 * to look at questions 1 to 5", the reading pauses) are written automatically
 * from the blocks, so question ranges always match the paper.
 *
 * Gaps are written [[answer|other accepted form]]. Each gap, and each question,
 * has a key: [evidence, explanation], where the evidence is a phrase copied
 * exactly from the script.
 */

export type Key = [evidence: string, explain: string]
type GroupMaker = (next: () => number) => TaskGroup

export const ANNOUNCER: Speaker = { id: 'ann', name: 'Announcer', role: 'Test announcer', gender: 'm', accents: ['en-GB'], voice: 'MMTfKxXgrCWYhXQllY7o' }

/** A speaker with their main accent (BCP 47), e.g. person('jo', 'Jo', 'Caller', 'f', 'en-AU'). */
export const person = (id: string, name: string, role: string, gender: 'f' | 'm', accent: string, voice?: string): Speaker => ({
  id,
  name,
  role,
  gender,
  accents: [accent, 'en-GB', 'en-AU', 'en-US'].filter((a, i, all) => all.indexOf(a) === i),
  ...(voice ? { voice } : {}),
})

const NUMBER_WORDS = ['', 'ONE', 'TWO', 'THREE']

/** "ONE WORD ONLY", "NO MORE THAN TWO WORDS AND/OR A NUMBER"… */
export function limit(words: number, number = false): WordLimit {
  const text =
    words === 1
      ? number
        ? 'ONE WORD AND/OR A NUMBER'
        : 'ONE WORD ONLY'
      : `NO MORE THAN ${NUMBER_WORDS[words]} WORDS${number ? ' AND/OR A NUMBER' : ''}`
  return { words, number, text }
}

const LETTERS = 'ABCDEFGHIJKLMNOP'
const lettered = (texts: string[]): Option[] => texts.map((text, i) => ({ key: LETTERS[i], text }))
const NUMERIC = /^[£$€]?\d[\d\s.,:/-]*(st|nd|rd|th|am|pm)?$/i

let groupCount = 0
const groupId = () => `g${++groupCount}`

/** Replaces [[answer|alt]] markers with {n}, collecting a gap question for each. */
function gapper(next: () => number, keys: Key[]) {
  const questions: Question[] = []
  const fill = (text: string) =>
    text.replace(/\[\[([^\]]+)\]\]/g, (_, content: string) => {
      const key = keys[questions.length]
      if (!key) throw new Error(`No key for gap "${content}"`)
      const [answer, ...accept] = content.split('|').map((a) => a.trim())
      const n = next()
      questions.push({
        kind: 'gap',
        n,
        answer,
        ...(accept.length ? { accept } : {}),
        ...(NUMERIC.test(answer) ? { numeric: true } : {}),
        evidence: key[0],
        explain: key[1],
      })
      return `{${n}}`
    })
  const done = () => {
    if (questions.length !== keys.length) throw new Error(`${questions.length} gaps but ${keys.length} keys`)
    return questions
  }
  return { fill, done }
}

// ------------------------------------------------------------- groups ---

/** Form completion. Rows are "Label: text"; "# Heading" starts a section; "= Label: text" is the worked example. */
export const form =
  (title: string, lim: WordLimit, rows: string[], keys: Key[]): GroupMaker =>
  (next) => {
    const g = gapper(next, keys)
    const out: Row[] = rows.map((row) => {
      if (row.startsWith('# ')) return { kind: 'heading', text: row.slice(2) }
      const example = row.startsWith('= ')
      const body = example ? row.slice(2) : row
      const cut = body.indexOf(': ')
      const label = cut >= 0 ? body.slice(0, cut) : ''
      const text = cut >= 0 ? body.slice(cut + 2) : body
      return { ...(example ? { kind: 'example' as const } : {}), label, text: g.fill(text) }
    })
    return { id: groupId(), type: 'form', instruction: 'Complete the form below.', limit: lim, title, rows: out, questions: g.done() }
  }

/** Note completion. "# Heading" lines are sub-headings. */
export const notes =
  (title: string, lim: WordLimit, rows: string[], keys: Key[]): GroupMaker =>
  (next) => {
    const g = gapper(next, keys)
    const out: Row[] = rows.map((row) => (row.startsWith('# ') ? { kind: 'sub', text: row.slice(2) } : { text: g.fill(row.replace(/^- /, '')) }))
    return { id: groupId(), type: 'notes', instruction: 'Complete the notes below.', limit: lim, title, rows: out, questions: g.done() }
  }

/** Sentence completion: one gap per sentence. */
export const sentences =
  (lim: WordLimit, rows: string[], keys: Key[]): GroupMaker =>
  (next) => {
    const g = gapper(next, keys)
    const out: Row[] = rows.map((row) => ({ text: g.fill(row) }))
    return { id: groupId(), type: 'sentences', instruction: 'Complete the sentences below.', limit: lim, rows: out, questions: g.done() }
  }

/** Table completion: column headings, then rows of cells. */
export const table =
  (title: string, lim: WordLimit, columns: string[], cells: string[][], keys: Key[]): GroupMaker =>
  (next) => {
    const g = gapper(next, keys)
    const out = cells.map((row) => row.map((cell) => g.fill(cell)))
    return { id: groupId(), type: 'table', instruction: 'Complete the table below.', limit: lim, title, columns, cells: out, questions: g.done() }
  }

/** Flow-chart completion: one box per step. */
export const flow =
  (title: string, lim: WordLimit, steps: string[], keys: Key[]): GroupMaker =>
  (next) => {
    const g = gapper(next, keys)
    const out: Row[] = steps.map((step) => ({ text: g.fill(step) }))
    return { id: groupId(), type: 'flow', instruction: 'Complete the flow-chart below.', limit: lim, title, rows: out, questions: g.done() }
  }

/** Multiple choice, one answer: [stem, options, answer letter, evidence, explanation]. */
export const mcq =
  (items: [string, string[], string, string, string][]): GroupMaker =>
  (next) => ({
    id: groupId(),
    type: 'choice',
    instruction: `Choose the correct letter, ${items[0][1].map((_, i) => LETTERS[i]).join(', ').replace(/, (\w)$/, ' or $1')}.`,
    questions: items.map(([stem, options, answer, evidence, explain]) => ({
      kind: 'choice',
      n: next(),
      stem,
      options: lettered(options),
      answer,
      evidence,
      explain,
    })),
  })

/** "Choose TWO letters": both answers score in either order. Keys follow the answers in alphabetical order. */
export const choose2 =
  (stem: string, options: string[], answers: [string, string], keys: [Key, Key]): GroupMaker =>
  (next) => ({
    id: groupId(),
    type: 'choose2',
    instruction: `Choose TWO letters, A–${LETTERS[options.length - 1]}.`,
    stem,
    options: lettered(options),
    questions: [...answers].sort().map((answer, i) => ({ kind: 'pick', n: next(), answer, evidence: keys[i][0], explain: keys[i][1] })),
  })

/** Matching from a box: [item, letter, evidence, explanation]. */
export const matching =
  (instruction: string, optionsTitle: string, options: string[], items: [string, string, string, string][]): GroupMaker =>
  (next) => ({
    id: groupId(),
    type: 'matching',
    instruction,
    optionsTitle,
    options: lettered(options),
    questions: items.map(([label, answer, evidence, explain]) => ({ kind: 'letter', n: next(), label, answer, evidence, explain })),
  })

/** Map or plan labelling: [place, letter, evidence, explanation]. */
export const map =
  (spec: MapSpec, items: [string, string, string, string][]): GroupMaker =>
  (next) => {
    const letters = Object.keys(spec.points)
    const questions: Question[] = items.map(([label, answer, evidence, explain]) => ({ kind: 'letter', n: next(), label, answer, evidence, explain }))
    return {
      id: groupId(),
      type: 'map',
      instruction: `Label the ${spec.ground === 'floor' ? 'plan' : 'map'} below. Choose the correct letter, ${letters[0]}–${letters[letters.length - 1]}.`,
      options: letters.map((key) => ({ key, text: '' })),
      map: spec,
      questions,
    }
  }

// ------------------------------------------------------------- script ---

/**
 * Lines of the form "who: what they say", optionally followed by
 * "|| what the voice actually says" (spelt-out names, numbers read aloud).
 */
export function lines(text: string): ScriptItem[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const cut = l.indexOf(': ')
      if (cut < 0) throw new Error(`Script line without a speaker: "${l}"`)
      const s = l.slice(0, cut)
      const [t, say] = l
        .slice(cut + 2)
        .split(' || ')
        .map((x) => x.trim())
      return say ? { s, t, say } : { s, t }
    })
}

const NOUN = ['', 'conversation', 'talk', 'discussion', 'lecture']
const READING = [0, 30, 30, 30, 45]

export interface Block {
  lines: string
  groups: GroupMaker[]
  /** Seconds of reading time before this block (defaults by part). */
  wait?: number
}

export interface PartSpec {
  n: 1 | 2 | 3 | 4
  title: string
  /** "You will hear…" — the announcer's description. */
  intro: string
  speakers: Speaker[]
  blocks: Block[]
  /** Planted distractors: [phrase from the script, question number, note]. */
  traps?: [string, number, string][]
}

export const part = (spec: PartSpec) => spec

/** A broadcast of one part (focused practice) or four (a full test). Question numbers follow the parts. */
export function test(id: string, parts: PartSpec[], opts: { start?: number } = {}): PracticeSet {
  let n = (opts.start ?? (parts.length === 1 ? (parts[0].n - 1) * 10 + 1 : 1)) - 1
  const next = () => ++n
  const script: ScriptItem[] = []
  const groups: TaskGroup[] = []
  const traps: Trap[] = []
  const speakers: Speaker[] = [ANNOUNCER]
  const meta: NonNullable<PracticeSet['parts']> = []
  const say = (t: string) => script.push({ s: 'ann', t })
  const range = (a: number, b: number) => `questions ${a} to ${b}`

  for (const p of parts) {
    for (const sp of p.speakers) if (!speakers.some((s) => s.id === sp.id)) speakers.push(sp)
    meta.push({ n: p.n, title: p.title, start: script.length })
    p.blocks.forEach((block, bi) => {
      const made = block.groups.map((make) => ({ ...make(next), part: p.n }))
      const first = made[0].questions[0].n
      const last = made[made.length - 1].questions[made[made.length - 1].questions.length - 1].n
      const wait = block.wait ?? READING[p.n]
      if (bi === 0) {
        say(`Part ${p.n}. ${p.intro}`)
        say(`First, you have some time to look at ${range(first, last)}.`)
      } else say(`Before you hear the rest of the ${NOUN[p.n]}, you have some time to look at ${range(first, last)}.`)
      script.push({ wait, label: `questions ${first}–${last}` })
      say(`Now listen ${bi === 0 ? 'carefully ' : ''}and answer ${range(first, last)}.`)
      script.push(...lines(block.lines))
      groups.push(...made)
    })
    say(`That is the end of Part ${p.n}. You now have some time to check your answers.`)
    for (const [phrase, q, note] of p.traps ?? []) traps.push({ phrase, q, note })
  }
  if (parts.length > 1) say('That is the end of the listening test.')

  return {
    id,
    context: parts.length === 1 ? parts[0].intro : 'A complete IELTS Listening paper: four recordings, forty questions.',
    speakers,
    script,
    groups,
    traps,
    ...(parts.length > 1 ? { parts: meta } : {}),
  }
}
