/*
 * Text analysis for the writing studio: words, paragraphs, sentences, linking
 * words, lexical variety and the objective 10-point checklist.
 *
 * Everything here is a pure function of the essay text, so the live panels and
 * the post-submit analysis always agree.
 */

import { countWords, judgeFloor, plural, wordTokens } from './words'

export { countWords, wordTokens }

// ------------------------------------------------------------------ linkers ---

export type LinkerGroup = 'addition' | 'contrast' | 'cause' | 'example' | 'sequence' | 'summary'

export const LINKER_GROUPS: { id: LinkerGroup; label: string; try: string[] }[] = [
  { id: 'addition', label: 'Adding', try: ['moreover', 'in addition', 'furthermore', 'what is more'] },
  { id: 'contrast', label: 'Contrasting', try: ['however', 'whereas', 'in contrast', 'nevertheless', 'although'] },
  { id: 'cause', label: 'Cause & result', try: ['as a result', 'consequently', 'therefore', 'due to'] },
  { id: 'example', label: 'Examples', try: ['for example', 'for instance', 'such as', 'in particular'] },
  { id: 'sequence', label: 'Sequencing', try: ['firstly', 'after that', 'subsequently', 'finally'] },
  { id: 'summary', label: 'Summing up', try: ['overall', 'in conclusion', 'to sum up', 'on balance'] },
]

/**
 * Where a linker has to stand to count:
 * - start: at the start of a sentence (for words like "first" or "next");
 * - clause: at the start of a sentence or clause — after a comma, a semicolon or "and";
 * - comma: straight after a comma (", so").
 */
type Position = 'start' | 'clause' | 'comma'

interface LinkerDef {
  phrase: string
  group: LinkerGroup
  /** More than this many uses reads as mechanical. */
  limit: number
  position?: Position
  /**
   * Reads the words after the match and returns the sense the linker has there:
   * a different group (temporal "while" is about time, not contrast) or null to skip it.
   */
  sense?: (after: string, before: string) => LinkerGroup | null
}

const L = (group: LinkerGroup, limit: number, phrases: string[], position?: Position): LinkerDef[] =>
  phrases.map((phrase) => ({ phrase, group, limit, position }))

/** "while people were still arriving", "while waiting" — while as a time word. */
const TEMPORAL_WHILE = /^\s+(?:(?:[\p{L}'-]+\s+){0,3}?(?:was|were|is|are|am|be|being)\s+(?:still\s+|also\s+|busy\s+)?[\p{L}]+ing\b|[\p{L}]+ing\b)/iu
/** "since 2004", "since then", "ever since" — since as a time word. */
const TEMPORAL_SINCE = /^\s+(?:\d|then\b|the\s+(?:start|beginning|end|early|late|mid|turn|first|last)\b|last\b|early\b|childhood\b|records\b)/i

const LINKER_DEFS: LinkerDef[] = [
  ...L('addition', 2, ['moreover', 'furthermore', 'in addition', 'additionally', 'what is more', 'besides']),
  ...L('addition', 4, ['also', 'as well as']),
  ...L('contrast', 2, [
    'however',
    'nevertheless',
    'nonetheless',
    'on the other hand',
    'on the one hand',
    'in contrast',
    'by contrast',
    'conversely',
    'even though',
    'in spite of',
    'on the contrary',
    'admittedly',
  ]),
  ...L('contrast', 3, ['whereas', 'although', 'despite']),
  { phrase: 'while', group: 'contrast', limit: 3, sense: (after) => (TEMPORAL_WHILE.test(after) ? 'sequence' : 'contrast') },
  ...L('contrast', 4, ['but']),
  ...L('cause', 2, [
    'as a result',
    'as a consequence',
    'consequently',
    'therefore',
    'thus',
    'hence',
    'for this reason',
    'owing to',
    'this means that',
    'which means that',
  ]),
  ...L('cause', 3, ['due to', 'because of']),
  ...L('cause', 4, ['because']),
  {
    phrase: 'since',
    group: 'cause',
    limit: 2,
    sense: (after, before) => (TEMPORAL_SINCE.test(after) || /\bever\s*$/.test(before) ? null : 'cause'),
  },
  {
    phrase: 'so',
    group: 'cause',
    limit: 3,
    position: 'comma',
    sense: (after) => (/^\s+(?:much|many|far|long|few|little|on|forth|called)\b/i.test(after) ? null : 'cause'),
  },
  ...L('example', 2, ['for example', 'for instance', 'in particular', 'to illustrate', 'a case in point', 'namely']),
  ...L('example', 3, ['such as']),
  ...L('sequence', 1, ['firstly', 'secondly', 'thirdly', 'lastly']),
  ...L('sequence', 2, ['first', 'second', 'next'], 'start'),
  ...L('sequence', 2, ['once'], 'clause'),
  ...L('sequence', 2, [
    'after that',
    'after this',
    'afterwards',
    'following this',
    'subsequently',
    'finally',
    'meanwhile',
    'at the same time',
    'to begin with',
    'initially',
  ]),
  ...L('sequence', 3, ['then']),
  ...L('summary', 1, ['in conclusion', 'to conclude', 'to sum up', 'in summary', 'in short', 'all in all', 'on balance']),
  ...L('summary', 2, ['overall']),
]

/** Longest phrases first, so "on the other hand" wins over "other". */
const LINKERS = [...LINKER_DEFS].sort((a, b) => b.phrase.length - a.phrase.length)

export interface LinkerHit {
  phrase: string
  group: LinkerGroup
  count: number
  limit: number
  overused: boolean
}

// ------------------------------------------------------------------ helpers ---

const LIMIT_OF = new Map<string, number>()

const STOPWORDS = new Set(
  `a about above after again against all almost also am an and any are aren't as at be because been before being below
  between both but by can could did do does doing down during each either even ever every few for from further had has
  have having he her here hers herself him himself his how i if in into is it its itself just less let like may me might
  more most much must my myself no nor not now of off often on once only or other others our ours ourselves out over
  own per quite rather really same she should so some such than that the their theirs them themselves then there these
  they this those though through to too under until up upon us very via was we well were what when where whether which
  while who whom whose why will with within without would yet you your yours yourself yourselves one two three four many
  however therefore moreover furthermore although whereas also because since thus hence overall firstly secondly finally
  example instance addition contrast result conclusion get got make made way thing things lot lots`
    .split(/\s+/)
    .filter(Boolean),
)

/** Normalises curly quotes so apostrophes match. */
export const normalise = (text: string) => text.replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"')

const bareWord = (token: string) =>
  normalise(token)
    .toLowerCase()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')

const ABBREVIATIONS = /\b(?:e\.g|i\.e|etc|mr|mrs|ms|dr|vs|approx)\.|\bno\.(?=\s*\d)/gi

/** Splits into sentences: at . ! ? followed by space, and at line breaks. */
export function splitSentences(text: string) {
  const masked = normalise(text).replace(ABBREVIATIONS, (m) => m.replace(/\./g, '․'))
  return masked
    .split(/(?<=[.!?…])["')\]]*\s+|\n+/)
    .map((s) => s.replace(/․/g, '.').trim())
    .filter((s) => wordTokens(s).length > 0)
}

/** Lines that are real paragraphs (6+ words), ignoring greetings and sign-offs. */
export function splitParagraphs(text: string) {
  return normalise(text)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => wordTokens(p).length >= 6)
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export interface LinkerRange {
  start: number
  end: number
  phrase: string
  group: LinkerGroup
}

/** Every linking word with its position, longest phrases first, never matching overlapping text twice. */
export function linkerRanges(text: string): LinkerRange[] {
  const lower = normalise(text).toLowerCase()
  const taken = new Uint8Array(lower.length)
  const out: LinkerRange[] = []
  for (const def of LINKERS) {
    const re = new RegExp(`(?<![\\p{L}'-])${escapeRe(def.phrase).replace(/ /g, '\\s+')}(?![\\p{L}'-])`, 'gu')
    for (const m of lower.matchAll(re)) {
      const start = m.index ?? 0
      const end = start + m[0].length
      if (taken.subarray(start, end).some((x) => x)) continue
      const before = lower.slice(Math.max(0, start - 80), start)
      if (def.position) {
        const trimmed = before.replace(/[ \t"'(]+$/, '')
        const atStart = !trimmed || /[.!?;:\n]$/.test(trimmed)
        const ok =
          def.position === 'start'
            ? atStart
            : def.position === 'comma'
              ? /,$/.test(trimmed)
              : atStart || /,$/.test(trimmed) || /(?:^|[^\p{L}])and$/u.test(trimmed)
        if (!ok) continue
      }
      const group = def.sense ? def.sense(lower.slice(end, end + 80), before) : def.group
      if (!group) continue
      taken.fill(1, start, end)
      out.push({ start, end, phrase: def.phrase, group })
    }
  }
  return out.sort((a, b) => a.start - b.start)
}

for (const d of LINKERS) LIMIT_OF.set(d.phrase, d.limit)

/** Counts each linking word (per sense) and flags the over-used ones. */
export function findLinkers(text: string): LinkerHit[] {
  const counts = new Map<string, { phrase: string; group: LinkerGroup; count: number }>()
  for (const r of linkerRanges(text)) {
    const key = `${r.phrase}|${r.group}`
    const hit = counts.get(key) ?? { phrase: r.phrase, group: r.group, count: 0 }
    hit.count += 1
    counts.set(key, hit)
  }
  return [...counts.values()]
    .map((h) => {
      const limit = LIMIT_OF.get(h.phrase) ?? 2
      return { ...h, limit, overused: h.count > limit }
    })
    .sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase))
}

/** Longest run of consecutive words shared by `a` and `b` (case and punctuation ignored). */
export function longestSharedRun(a: string, b: string) {
  const wa = wordTokens(a).map(bareWord).filter(Boolean)
  const wb = wordTokens(b).map(bareWord).filter(Boolean)
  let best = 0
  let bestEnd = 0
  let prev = new Array<number>(wb.length + 1).fill(0)
  for (let i = 1; i <= wa.length; i++) {
    const row = new Array<number>(wb.length + 1).fill(0)
    for (let j = 1; j <= wb.length; j++) {
      if (wa[i - 1] === wb[j - 1]) {
        row[j] = prev[j - 1] + 1
        if (row[j] > best) {
          best = row[j]
          bestEnd = i
        }
      }
    }
    prev = row
  }
  return { length: best, words: wa.slice(bestEnd - best, bestEnd).join(' ') }
}

// ----------------------------------------------------------------- analysis ---

export interface Sentence {
  text: string
  words: number
}

export interface TextAnalysis {
  words: number
  paragraphs: string[]
  sentences: Sentence[]
  avgSentence: number
  linkers: LinkerHit[]
  /** Number of different linking words or phrases. */
  linkerVariety: number
  overused: LinkerHit[]
  /** Share of different words among all words (0..1). */
  lexicalVariety: number
  /** Share of different words among content words (0..1) — steadier across lengths. */
  contentVariety: number
  /** Content words used three or more times, most frequent first. */
  repeated: { word: string; count: number; fromPrompt: boolean }[]
}

export function analyse(text: string, promptText = ''): TextAnalysis {
  const words = wordTokens(text)
  const paragraphs = splitParagraphs(text)
  const sentences = splitSentences(text).map((s) => ({ text: s, words: wordTokens(s).length }))
  const counted = sentences.filter((s) => s.words >= 3)
  const avgSentence = counted.length ? counted.reduce((sum, s) => sum + s.words, 0) / counted.length : 0
  const linkers = findLinkers(text)

  const bare = words.map(bareWord).filter((w) => /\p{L}/u.test(w))
  const content = bare.filter((w) => w.length > 2 && !STOPWORDS.has(w))
  const lexicalVariety = bare.length ? new Set(bare).size / bare.length : 0
  const contentVariety = content.length ? new Set(content).size / content.length : 0

  const promptWords = new Set(wordTokens(promptText).map(bareWord).map(stem))
  const freq = new Map<string, number>()
  for (const w of content) freq.set(w, (freq.get(w) ?? 0) + 1)
  const repeated = [...freq.entries()]
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([word, count]) => ({ word, count, fromPrompt: promptWords.has(stem(word)) }))

  return {
    words: words.length,
    paragraphs,
    sentences,
    avgSentence,
    linkers,
    linkerVariety: linkers.length,
    overused: linkers.filter((l) => l.overused),
    lexicalVariety,
    contentVariety,
    repeated,
  }
}

function stem(word: string) {
  return word.replace(/(ies|es|s|ing|ed)$/, '')
}

// ---------------------------------------------------------------- checklist ---

export type CheckId =
  | 'min-words'
  | 'paragraphs-3'
  | 'paragraphs-4'
  | 'paraphrase'
  | 'overview'
  | 'data'
  | 'trend-words'
  | 'comparisons'
  | 'no-opinion'
  | 'sequencers'
  | 'passive'
  | 'position'
  | 'both-views'
  | 'causes-solutions'
  | 'conclusion'
  | 'examples'
  | 'linkers-4'
  | 'linkers-5'
  | 'no-overuse'
  | 'sentence-variety'
  | 'lexical-variety'
  | 'salutation'
  | 'signoff'
  | 'purpose'
  | 'bullet-1'
  | 'bullet-2'
  | 'bullet-3'
  | 'no-contractions'
  | 'map-changes'
  | 'locations'
  | 'adv-disadv'
  | 'part-1'
  | 'part-2'

export type Criterion = 'TA' | 'CC' | 'LR' | 'GRA'

export interface CheckContext {
  text: string
  analysis: TextAnalysis
  minWords: number
  /** The question text, for the paraphrase check. */
  question: string
  /** Letter bullet points: a label and the words that show it was covered. */
  bullets?: { label: string; pattern: RegExp }[]
  /** Every value plotted in the Task 1 visual (for the data check). */
  figureValues?: number[]
  /** Numbers printed in the question and labels — citing them is not citing data. */
  ignoreNumbers?: number[]
}

export interface CheckResult {
  id: CheckId
  label: string
  criterion: Criterion
  met: boolean
  /** What we found in this essay. */
  found: string
  /** Why it matters / how to fix it. */
  why: string
}

const OPINION = /\b(i (?:strongly |firmly |fully |largely |partly |partially |completely |would )?(?:think|believe|agree|disagree|feel|argue|contend|support|oppose)|in my (?:view|opinion)|from my (?:perspective|point of view)|personally|it seems to me|i am convinced|this essay (?:will )?(?:argue|argues|disagree|agree|contend)s?)\b/i
/** An overview has to announce itself at the start of a sentence (“Clearly” mid-sentence is not one). */
const OVERVIEW =
  /^(?:overall|in general|generally speaking|broadly speaking|at a glance|in summary|on the whole|it is (?:clear|evident|noticeable|apparent|obvious) (?:from the (?:graph|chart|diagram|table|data)s? )?that|it can be (?:clearly )?seen (?:from the \w+ )?that|what stands out(?: most)? (?:is|was)|the most (?:striking|noticeable|significant|obvious|important) (?:feature|change|trend|point|difference|development)s?|the (?:main|key) (?:trends?|changes?|differences?|features?|stages?|points?))\b/i
const CONCLUSION = /\b(in conclusion|to conclude|to sum up|in summary|overall|all in all|on balance|in short|ultimately|to summari[sz]e)\b/i
const EXAMPLES = /\b(?:for example|for instance|such as|to illustrate|a case in point|a good example|this can be seen in|an example of)\b|(?<![\p{L}])e\.g\.(?=\s)/giu
const VIEWS = /\b(some (?:people|argue|believe|claim|think)|others (?:argue|believe|claim|think|say|feel)|other people|on the one hand|on the other hand|proponents|opponents|supporters|critics|those who|advocates|it is (?:often )?(?:said|argued|claimed)|many (?:people )?(?:believe|argue|feel))\b/gi
const CAUSES = /\b(causes?|reasons?|because|due to|result of|stems? from|leads? to|led to|is caused by|factors?|explains? why)\b/gi
const SOLUTIONS = /\b(solutions?|solve|address|tackle|should|could|measures?|steps?|encourage|introduce|ways? to|help to|reverse)\b/gi
const TREND_GROUPS: RegExp[] = [
  /\b(rise|rises|rose|risen|rising)\b/i,
  /\b(increase|increased|increases|increasing)\b/i,
  /\b(grow|grows|grew|grown|growing|growth)\b/i,
  /\b(climb|climbed|climbs|climbing)\b/i,
  /\b(surge|surged|soar|soared|jump|jumped|rocket|rocketed)\b/i,
  /\b(decline|declined|declines|declining)\b/i,
  /\b(fall|falls|fell|fallen|falling)\b/i,
  /\b(drop|drops|dropped|dropping)\b/i,
  /\b(decrease|decreased|decreases|decreasing)\b/i,
  /\b(dip|dipped|plummet|plummeted|slump|slumped)\b/i,
  /\b(fluctuat\w*)\b/i,
  /\b(peak|peaked|peaking|peaks)\b/i,
  /\b(plateau\w*|level(?:led|ed)? off|levelling off|leveling off)\b/i,
  /\b(remain\w* (?:stable|steady|constant|unchanged|flat)|stabilis\w*|stabiliz\w*)\b/i,
  /\b(doubl\w*|tripl\w*|quadrupl\w*|halv\w*)\b/i,
  /\b(recover\w*|rebound\w*)\b/i,
  /\b(overt(?:ake|ook|aken|aking))\b/i,
  /\b(eas(?:e|ed|ing) (?:off|back|gradually|slightly)|eased)\b/i,
]
const COMPARISONS = /\b(than|whereas|while|compared (?:with|to)|in comparison|similarly|likewise|the same as|the (?:highest|lowest|largest|smallest|most|least)|twice|three times|four times|half the|by contrast|in contrast)\b/gi
const SEQUENCE_GROUPS: RegExp[] = [
  /(?:^|[.!?]\s+|\n)(?:first|firstly|to begin with|initially|in the first stage|at the first stage)\b/i,
  /\bthen\b/i,
  /\bnext\b/i,
  /\b(after that|after this|afterwards|following this|after about|after around)\b/i,
  /\b(subsequently|later)\b/i,
  /(?:^|[.!?,]\s+|\n)once\b/i,
  /\b(the (?:next|following|second|third|fourth|fifth|sixth|seventh) (?:stage|step|phase))\b/i,
  /\b(finally|lastly|eventually|in the (?:final|last) (?:stage|step)|at the (?:final|last) stage|the (?:final|last) (?:stage|step))\b/i,
  /\b(before|at this point|at this stage|during which)\b/i,
  /\b(when|until)\b/i,
]
const PARTICIPLES =
  'made|sold|put|kept|left|sent|built|held|taken|given|cut|spread|fed|set|brought|bought|ground|done|grown|shown|known|chosen|frozen|thrown|drawn|driven|eaten|written|spun|torn|worn|sewn|sown|split|shut|hung|laid|paid|found|seen|run|begun|shaken|woven|stuck|struck|dug|lit|spent|won|bound|beaten|broken|fallen'
const PASSIVE = new RegExp(`\\b(?:am|is|are|was|were|be|been|being)\\s+(?:[a-z]+\\s+)?(?:[a-z]{2,}ed|${PARTICIPLES})\\b`, 'gi')
/** Any n't form, pronoun + 'm/'re/'ve/'ll/'d/'s (possessive 's on nouns is left alone), and could've & co. */
const CONTRACTIONS =
  /\b(?:[a-z]+n't|(?:i|you|we|they|he|she|it|there|that|this|who|what|where|when|here|how)'(?:m|re|ve|ll|d|s)|(?:could|would|should|must|might)'ve|let's)(?![\p{L}'])/giu
/** A closing line: short, and it starts with a closing formula. */
const CLOSING =
  /^(?:yours (?:sincerely|faithfully|truly)|sincerely|faithfully|kind regards|best regards|warm(?:est)? regards|regards|best wishes|all the best|take care|love|cheers|many thanks|with thanks|thanks again)\b/i
const PURPOSE = /\b(i am writing|i'm writing|i write to|i would like to|i wanted to|i want to|the purpose of this letter|i am contacting|in response to)\b/i

const CHANGE_GROUPS: RegExp[] = [
  /\b(demolish\w*|knock\w* down|pulled down|torn down)\b/i,
  /\b(replac\w*|gave way to|made way for)\b/i,
  /\b(convert\w*|turned into|transformed|redeveloped|became)\b/i,
  /\b(extend\w*|expand\w*|enlarg\w*|widen\w*)\b/i,
  /\b(construct\w*|built|erected|added|introduced|opened)\b/i,
  /\b(relocat\w*|moved|shifted)\b/i,
  /\b(remov\w*|disappeared|no longer|cleared|closed)\b/i,
  /\b(planted|landscaped|paved|pedestrianised|pedestrianized)\b/i,
  /\b(remain\w* (?:unchanged|the same|in place)|unchanged|retained|kept)\b/i,
]
const LOCATIONS =
  /\b(north|south|east|west|north-east|north-west|south-east|south-west|northern|southern|eastern|western|next to|opposite|beside|adjacent to|between|in the (?:centre|center|middle|corner)|alongside|across from|on the (?:left|right))\b/gi
const ADVANTAGES = /\b(advantages?|benefits?|positive|upside|beneficial|gains?)\b/i
const DISADVANTAGES = /\b(disadvantages?|drawbacks?|negative|downside|harmful|risks?|costs? of)\b/i

const firstSentenceMatching = (text: string, re: RegExp) => splitSentences(text).find((s) => re.test(s))
const quote = (s: string, max = 90) => `“${s.length > max ? `${s.slice(0, max).trimEnd()}…` : s}”`
const distinctMatches = (text: string, re: RegExp) =>
  new Set([...normalise(text).matchAll(re)].map((m) => m[0].toLowerCase().replace(/\s+/g, ' ')))

/** Checks that look for the absence of a fault only count once there is enough text to judge. */
const tooShort = (analysis: TextAnalysis, minWords: number) => analysis.words < judgeFloor(minWords)
const tooShortNote = (minWords: number) =>
  `Too short to judge yet — this point only counts from ${judgeFloor(minWords)} words.`

type CheckFn = (ctx: CheckContext) => Omit<CheckResult, 'id'>

export const CHECKS: Record<CheckId, CheckFn> = {
  'map-changes': ({ text }) => {
    const found = CHANGE_GROUPS.map((re) => normalise(text).match(re)?.[0]).filter((w): w is string => Boolean(w))
    return {
      label: 'Varied language of change (4+ kinds)',
      criterion: 'LR',
      met: found.length >= 4,
      found: found.length ? `Used: ${found.map((w) => w.toLowerCase()).join(', ')}.` : 'No verbs of change found yet (demolished, replaced, converted, extended…).',
      why: 'Map tasks reward precise verbs of change — and mostly in the passive: “was demolished”, “has been converted into”.',
    }
  },
  locations: ({ text }) => {
    const found = distinctMatches(text, LOCATIONS)
    return {
      label: 'Changes located precisely (4+ expressions)',
      criterion: 'TA',
      met: found.size >= 4,
      found: found.size ? `Used: ${[...found].slice(0, 8).join(', ')}.` : 'No location language found (in the north-east, next to, opposite…).',
      why: 'The reader cannot see the maps. Say where each change happened: compass points and prepositions of place.',
    }
  },
  'adv-disadv': ({ text }) => {
    const pro = firstSentenceMatching(text, ADVANTAGES)
    const con = firstSentenceMatching(text, DISADVANTAGES)
    return {
      label: 'Both advantages and disadvantages discussed',
      criterion: 'TA',
      met: Boolean(pro && con),
      found: pro && con ? `Advantages: ${quote(pro, 60)} · Disadvantages: ${quote(con, 60)}` : pro ? 'Advantages found, but no disadvantages yet.' : con ? 'Disadvantages found, but no advantages yet.' : 'Neither side is named yet.',
      why: 'The question asks about both sides (and often which outweighs the other). Give each side its own paragraph.',
    }
  },
  'part-1': (ctx) => partCheck(ctx, 0),
  'part-2': (ctx) => partCheck(ctx, 1),
  'min-words': ({ analysis, minWords }) => ({
    label: `At least ${minWords} words`,
    criterion: 'TA',
    met: analysis.words >= minWords,
    found: `${analysis.words} words${analysis.words < minWords ? ` — ${minWords - analysis.words} short` : ''}.`,
    why: 'Answers under the minimum lose marks for task fulfilment. Aim a little above it so a miscount never costs you.',
  }),
  'paragraphs-3': ({ analysis }) => ({
    label: 'Three or more paragraphs',
    criterion: 'CC',
    met: analysis.paragraphs.length >= 3,
    found: `${plural(analysis.paragraphs.length, 'paragraph')} found.`,
    why: 'Introduction, overview and detail paragraphs let the examiner see your organisation at a glance.',
  }),
  'paragraphs-4': ({ analysis }) => ({
    label: 'Four or more paragraphs',
    criterion: 'CC',
    met: analysis.paragraphs.length >= 4,
    found: `${plural(analysis.paragraphs.length, 'paragraph')} found.`,
    why: 'Clear paragraphing is part of Coherence & Cohesion. Each paragraph should have one central idea.',
  }),
  paraphrase: ({ analysis, question, minWords }) => {
    const run = longestSharedRun(analysis.paragraphs[0] ?? '', question)
    const short = tooShort(analysis, minWords)
    return {
      label: 'Introduction paraphrases the question',
      criterion: 'LR',
      met: !short && run.length < 8,
      found: short
        ? tooShortNote(minWords)
        : run.length
          ? `Longest stretch copied from the question: ${plural(run.length, 'word')} (“${run.words}”).`
          : 'Nothing copied from the question.',
      why: 'Copied words show none of your own vocabulary and may not be counted. Rephrase with synonyms and new structures.',
    }
  },
  overview: ({ analysis }) => {
    const ps = analysis.paragraphs
    const where = [...ps.slice(0, 2), ...(ps.length > 2 ? ps.slice(-1) : [])]
    const hit = where.map((p) => firstSentenceMatching(p, OVERVIEW)).find(Boolean)
    return {
      label: 'A clear overview of the main features',
      criterion: 'TA',
      met: Boolean(hit),
      found: hit
        ? `Overview: ${quote(hit)}`
        : 'No overview sentence found near the start or end (try starting one with “Overall, …”).',
      why: 'Without a clear overview of the main trends or stages, Task Achievement is held back however accurate the details are.',
    }
  },
  data: ({ text, figureValues = [], ignoreNumbers = [] }) => {
    const cited = [...normalise(text).matchAll(/(?<![\p{L}\p{N}.])\d+(?:\.\d+)?(?![\p{N}])/gu)]
      .map((m) => m[0])
      .filter((n) => !/^(19|20)\d\d$/.test(n) && !ignoreNumbers.includes(Number(n)))
    const fromFigure = figureValues.length
      ? cited.filter((n) => figureValues.some((v) => Math.abs(v - Number(n)) <= 0.1 + 1e-9))
      : cited
    const distinct = [...new Set(fromFigure.map((n) => String(Number(n))))]
    return {
      label: 'Key data supported with figures',
      criterion: 'TA',
      met: distinct.length >= 4,
      found: distinct.length
        ? `${plural(distinct.length, 'value')} from the visual cited: ${distinct.slice(0, 6).join(', ')}${
            distinct.length > 6 ? ' …' : '.'
          }`
        : 'No values from the visual cited (labels such as age ranges and years do not count).',
      why: 'Every key feature needs evidence from the visual: the values themselves, with units and dates. Aim for four or more.',
    }
  },
  'trend-words': ({ text }) => {
    const found = TREND_GROUPS.map((re) => text.match(re)?.[0]).filter((w): w is string => Boolean(w))
    return {
      label: 'Varied trend vocabulary (4+ kinds)',
      criterion: 'LR',
      met: found.length >= 4,
      found: found.length ? `Used: ${found.map((w) => w.toLowerCase()).join(', ')}.` : 'No trend verbs found yet.',
      why: 'Rise, decline, peak, level off, overtake… a range of precise trend language lifts Lexical Resource.',
    }
  },
  comparisons: ({ text }) => {
    const n = [...normalise(text).matchAll(COMPARISONS)].length
    return {
      label: 'Comparisons where relevant',
      criterion: 'TA',
      met: n >= 3,
      found: `${plural(n, 'comparison structure')} (than, whereas, the highest, twice…).`,
      why: 'Task 1 asks you to make comparisons. Compare groups at the key moments, not just describe each one.',
    }
  },
  'no-opinion': ({ text, analysis, minWords }) => {
    const hit = firstSentenceMatching(text, OPINION)
    const short = tooShort(analysis, minWords)
    return {
      label: 'Objective: no personal opinion',
      criterion: 'TA',
      met: !hit && !short,
      found: hit ? `Opinion found: ${quote(hit)}` : short ? tooShortNote(minWords) : 'Stays objective throughout.',
      why: 'Task 1 is a factual report. Opinions and invented reasons are irrelevant and can lower Task Achievement.',
    }
  },
  sequencers: ({ text }) => {
    const n = SEQUENCE_GROUPS.filter((re) => re.test(normalise(text))).length
    return {
      label: 'Stages linked with sequencers (4+ kinds)',
      criterion: 'CC',
      met: n >= 4,
      found: `${plural(n, 'kind')} of sequencing language (first, then, once, after that, finally…).`,
      why: 'A process description must be easy to follow from start to finish. Vary your sequencers instead of repeating “then”.',
    }
  },
  passive: ({ text }) => {
    const hits = [...normalise(text).matchAll(PASSIVE)].map((m) => m[0])
    return {
      label: 'Passive voice for the process (4+)',
      criterion: 'GRA',
      met: hits.length >= 4,
      found: hits.length ? `${plural(hits.length, 'passive')}: ${hits.slice(0, 4).map((h) => `“${h}”`).join(', ')}${hits.length > 4 ? '…' : ''}` : 'No passive forms found.',
      why: 'In a process the action matters more than who does it: “the grounds are collected”, “the mixture is heated”.',
    }
  },
  position: ({ analysis }) => {
    const ends = [analysis.paragraphs[0] ?? '', analysis.paragraphs.at(-1) ?? '']
    const hit = ends.map((p) => firstSentenceMatching(p, OPINION)).find(Boolean)
    return {
      label: 'Your position is clear (intro or conclusion)',
      criterion: 'TA',
      met: Boolean(hit),
      found: hit ? `Position: ${quote(hit)}` : 'No clear opinion phrase in the introduction or conclusion.',
      why: 'A clear position from the first paragraph to the last is a band 7 requirement for Task Response.',
    }
  },
  'both-views': ({ text }) => {
    const views = distinctMatches(text, VIEWS)
    return {
      label: 'Both views presented',
      criterion: 'TA',
      met: views.size >= 2,
      found: views.size ? `Signposts: ${[...views].slice(0, 4).map((v) => `“${v}”`).join(', ')}.` : 'No signposting of the two views found.',
      why: '“Discuss both views” means a fair, developed paragraph for each side — signposted so the examiner can see it.',
    }
  },
  'causes-solutions': ({ text }) => {
    const causes = [...normalise(text).matchAll(CAUSES)].length
    const solutions = [...normalise(text).matchAll(SOLUTIONS)].length
    return {
      label: 'Both questions answered: causes and solutions',
      criterion: 'TA',
      met: causes >= 2 && solutions >= 2,
      found: `${plural(causes, 'cause signal')} and ${plural(solutions, 'solution signal')}.`,
      why: 'A two-question prompt needs two clear halves. Missing either one caps your Task Response score.',
    }
  },
  conclusion: ({ analysis }) => {
    const last = analysis.paragraphs.at(-1) ?? ''
    const met = analysis.paragraphs.length >= 2 && CONCLUSION.test(last)
    return {
      label: 'A signalled conclusion',
      criterion: 'CC',
      met,
      found: met ? `Final paragraph: ${quote(last, 70)}` : 'The last paragraph does not read as a conclusion yet.',
      why: 'Close the loop: restate your answer in new words, with a clear signal like “In conclusion”.',
    }
  },
  examples: ({ text }) => {
    const n = [...normalise(text).matchAll(EXAMPLES)].length
    return {
      label: 'Ideas supported with examples (2+)',
      criterion: 'TA',
      met: n >= 2,
      found: `${plural(n, 'example signal')} (for example, for instance, such as…).`,
      why: 'Specific examples extend and support your main ideas — the difference between a band 6 and a band 7 paragraph.',
    }
  },
  'linkers-4': ({ analysis }) => ({
    label: 'Four or more different linking words',
    criterion: 'CC',
    met: analysis.linkerVariety >= 4,
    found: analysis.linkerVariety ? `${analysis.linkerVariety} different: ${analysis.linkers.map((l) => l.phrase).slice(0, 6).join(', ')}.` : 'No linking words found.',
    why: 'A range of cohesive devices, used for their exact meaning, is a core part of Coherence & Cohesion.',
  }),
  'linkers-5': ({ analysis }) => ({
    label: 'Five or more different linking words',
    criterion: 'CC',
    met: analysis.linkerVariety >= 5,
    found: analysis.linkerVariety ? `${analysis.linkerVariety} different: ${analysis.linkers.map((l) => l.phrase).slice(0, 6).join(', ')}.` : 'No linking words found.',
    why: 'A range of cohesive devices, used for their exact meaning, is a core part of Coherence & Cohesion.',
  }),
  'no-overuse': ({ analysis, minWords }) => ({
    label: 'No linking word over-used',
    criterion: 'CC',
    met: analysis.overused.length === 0 && !tooShort(analysis, minWords),
    found: analysis.overused.length
      ? `Over-used: ${analysis.overused.map((l) => `“${l.phrase}” ×${l.count}`).join(', ')}.`
      : tooShort(analysis, minWords)
        ? tooShortNote(minWords)
        : 'Every linker is used a sensible number of times.',
    why: 'Repeating the same linker sounds mechanical — examiners specifically note over-use.',
  }),
  'sentence-variety': ({ analysis }) => {
    const usable = analysis.sentences.filter((s) => s.words >= 3)
    const short = usable.filter((s) => s.words <= 12).length
    const long = usable.filter((s) => s.words >= 22).length
    return {
      label: 'A mix of short and long sentences',
      criterion: 'GRA',
      met: usable.length >= 5 && short >= 1 && long >= 1,
      found: `${plural(usable.length, 'sentence')}: ${short} short (≤ 12 words), ${long} long (≥ 22 words), average ${analysis.avgSentence.toFixed(1)}.`,
      why: 'Grammatical range shows in variety: crisp simple sentences alongside controlled complex ones.',
    }
  },
  'lexical-variety': ({ analysis, minWords }) => {
    const pct = Math.round(analysis.contentVariety * 100)
    const short = tooShort(analysis, minWords)
    return {
      label: 'Varied vocabulary (65%+ different content words)',
      criterion: 'LR',
      met: analysis.contentVariety >= 0.65 && !short,
      found: short
        ? `${pct}% different, but short texts always look varied. ${tooShortNote(minWords)}`
        : `${pct}% of your content words are different${analysis.repeated[0] ? `; most repeated: “${analysis.repeated[0].word}” ×${analysis.repeated[0].count}` : ''}.`,
      why: 'Rotating synonyms and word families shows lexical range; repeating the same words signals a limited vocabulary.',
    }
  },
  salutation: ({ text }) => {
    const first = normalise(text).split('\n').map((l) => l.trim()).find(Boolean) ?? ''
    const met = /^(dear|hi|hello)\b/i.test(first)
    return {
      label: 'Opens with a proper greeting',
      criterion: 'TA',
      met,
      found: met ? `Greeting: “${first}”` : 'The letter does not begin with “Dear …”.',
      why: 'A letter needs a greeting that suits the reader: here, “Dear Ms Okafor,”.',
    }
  },
  signoff: ({ text }) => {
    const lines = normalise(text).split('\n').map((l) => l.trim()).filter(Boolean)
    const first = lines[0] ?? ''
    // Scan up from the end: the sign-off is a short line (the name may follow it) that starts with a closing formula.
    const closing =
      lines
        .slice(-4)
        .reverse()
        .find((l) => wordTokens(l).length <= 4 && CLOSING.test(l)) ?? ''
    const toNamed = /^dear\s+(mr|mrs|ms|miss|mx|dr|professor)\b/i.test(first)
    const toUnknown = /^dear\s+(sir|madam)/i.test(first)
    let met = Boolean(closing)
    if (closing && toNamed) met = /^(yours sincerely|sincerely|kind regards|best regards)\b/i.test(closing)
    if (closing && toUnknown) met = /^(yours faithfully|faithfully)\b/i.test(closing)
    return {
      label: 'Sign-off matches the greeting',
      criterion: 'TA',
      met,
      found: closing
        ? `Sign-off: “${closing}”${met ? '' : toNamed ? ' — a named reader takes “Yours sincerely”.' : toUnknown ? ' — “Dear Sir or Madam” takes “Yours faithfully”.' : ''}`
        : 'No sign-off line found at the end (for example “Yours sincerely,” followed by your name).',
      why: '“Dear Ms Okafor” → “Yours sincerely”; “Dear Sir or Madam” → “Yours faithfully”. A mismatched close jars.',
    }
  },
  purpose: ({ analysis }) => {
    const opening = analysis.paragraphs[0] ?? ''
    const met = PURPOSE.test(opening)
    return {
      label: 'Purpose stated in the first paragraph',
      criterion: 'TA',
      met,
      found: met ? `Opening: ${quote(opening, 80)}` : 'The first paragraph does not say why you are writing.',
      why: 'The reader should know why you are writing from the first sentence: “I am writing to…”.',
    }
  },
  'bullet-1': (ctx) => bulletCheck(ctx, 0),
  'bullet-2': (ctx) => bulletCheck(ctx, 1),
  'bullet-3': (ctx) => bulletCheck(ctx, 2),
  'no-contractions': ({ text, analysis, minWords }) => {
    const hits = [...new Set([...normalise(text).matchAll(CONTRACTIONS)].map((m) => m[0].toLowerCase()))]
    const short = tooShort(analysis, minWords)
    return {
      label: 'Consistent, appropriate tone (no contractions)',
      criterion: 'TA',
      met: hits.length === 0 && !short,
      found: hits.length
        ? `Contractions: ${hits.slice(0, 5).map((h) => `“${h}”`).join(', ')}.`
        : short
          ? tooShortNote(minWords)
          : 'No contractions — the tone stays formal.',
      why: 'Writing to an organiser you barely know calls for a polite, fairly formal tone: “I am”, “do not”, “it is”.',
    }
  },
}

/**
 * Finds a different sentence (8+ words) for each bullet point. Bullets are matched
 * in every order and the order that covers the most bullets wins, so one sentence
 * can never tick all three, but a letter may still cover them out of order.
 */
function bulletSentences({ text, analysis, bullets = [] }: CheckContext): (string | undefined)[] {
  const body = analysis.paragraphs.slice(1).join('\n') || text
  const sentences = splitSentences(body).filter((s) => wordTokens(s).length >= 8)
  const orders = permutations(bullets.map((_, i) => i))
  let best: (string | undefined)[] = bullets.map(() => undefined)
  let bestCount = -1
  for (const order of orders) {
    const used = new Set<number>()
    const found: (string | undefined)[] = bullets.map(() => undefined)
    let from = 0
    for (const b of order) {
      let k = sentences.findIndex((s, j) => j >= from && !used.has(j) && bullets[b].pattern.test(s))
      if (k < 0) k = sentences.findIndex((s, j) => !used.has(j) && bullets[b].pattern.test(s))
      if (k < 0) continue
      used.add(k)
      from = k + 1
      found[b] = sentences[k]
    }
    const count = found.filter(Boolean).length
    if (count > bestCount) {
      best = found
      bestCount = count
    }
  }
  return best
}

function permutations(xs: number[]): number[][] {
  if (xs.length <= 1) return [xs]
  return xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((rest) => [x, ...rest]))
}

function bulletCheck(ctx: CheckContext, i: number): Omit<CheckResult, 'id'> {
  const bullet = ctx.bullets?.[i]
  const hit = bullet ? bulletSentences(ctx)[i] : undefined
  return {
    label: `Bullet ${i + 1} covered: ${bullet?.label ?? ''}`,
    criterion: 'TA',
    met: Boolean(hit),
    found: hit
      ? `Covered in: ${quote(hit, 80)}`
      : 'We could not find a sentence of its own (8+ words) for this bullet point in your letter.',
    why: 'Each bullet point should be clearly covered — ideally one paragraph each. A missing bullet limits Task Achievement.',
  }
}

function partCheck(ctx: CheckContext, i: number): Omit<CheckResult, 'id'> {
  const part = ctx.bullets?.[i]
  const hit = part ? bulletSentences(ctx)[i] : undefined
  return {
    label: `Question ${i + 1} answered: ${part?.label ?? ''}`,
    criterion: 'TA',
    met: Boolean(hit),
    found: hit ? `Answered in: ${quote(hit, 80)}` : 'We could not find a developed sentence (8+ words) that answers this part of the question.',
    why: 'A two-part question needs both parts answered fully — a body paragraph each is the safest plan. Missing one caps Task Response at band 5.',
  }
}

export function runChecks(ids: CheckId[], ctx: CheckContext): CheckResult[] {
  return ids.map((id) => ({ id, ...CHECKS[id](ctx) }))
}
