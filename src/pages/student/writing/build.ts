/*
 * Small builders for writing prompts, so each task module holds only what is
 * particular to it: the question, the visual, the model answer and its notes.
 * The checklist, plan fields and footers follow from the task type.
 */
import type { CheckId, Criterion } from './analysis'
import type { FullWritingTest } from './library'
import { T1_FOOTER, T2_FOOTER, type Figure, type WritingPrompt } from './prompts'

/** [exact quote from the model answer, criterion, margin note] */
export type Note = [string, Criterion, string]

const notes = (list: Note[]) => list.map(([quote, criterion, note]) => ({ quote, criterion, note }))
const tidy = (text: string) => text.trim().replace(/\n{3,}/g, '\n\n')

const T1_CHECKS: Record<string, CheckId[]> = {
  /** Change over time: line graphs, bar charts with years, tables of years. */
  trend: ['min-words', 'paragraphs-3', 'paraphrase', 'overview', 'data', 'trend-words', 'comparisons', 'no-opinion', 'linkers-4', 'sentence-variety'],
  /** One moment in time: comparisons instead of trends. */
  static: ['min-words', 'paragraphs-3', 'paraphrase', 'overview', 'data', 'comparisons', 'no-opinion', 'linkers-4', 'sentence-variety', 'lexical-variety'],
  process: ['min-words', 'paragraphs-3', 'paraphrase', 'overview', 'sequencers', 'passive', 'no-opinion', 'no-overuse', 'lexical-variety', 'sentence-variety'],
  map: ['min-words', 'paragraphs-3', 'paraphrase', 'overview', 'map-changes', 'locations', 'passive', 'no-opinion', 'linkers-4', 'sentence-variety'],
}

const T1_PLAN: Record<string, [string, string][]> = {
  trend: [
    ['Overview', 'The two or three biggest changes in one or two sentences — no numbers.'],
    ['Key feature 1', 'The most important group or trend, with start and end figures.'],
    ['Key feature 2', 'The others: compare them with the first, and note any crossing or peak.'],
  ],
  static: [
    ['Overview', 'What is largest, smallest, or most different? One or two sentences, no numbers.'],
    ['Key feature 1', 'The biggest categories, with figures, compared with each other.'],
    ['Key feature 2', 'The smaller categories, grouped sensibly, with figures.'],
  ],
  process: [
    ['Overview', 'How many stages, where it starts and ends, and whether it is natural or man-made.'],
    ['Stages 1–half', 'The first half of the process in the passive, with sequencers.'],
    ['Stages half–end', 'The rest of the process up to the final product.'],
  ],
  map: [
    ['Overview', 'The biggest change overall: more built-up? Greener? What stayed the same?'],
    ['Changes 1', 'One area of the map: what was there before, and what replaced it.'],
    ['Changes 2', 'The other area, with location words (north of, next to, opposite).'],
  ],
}

export interface Task1Spec {
  id: string
  /** What the exam paper says above the visual. */
  instructions: string
  figure: Figure
  /** The kind of description the visual needs (default: trend for line, static otherwise). */
  mode?: keyof typeof T1_CHECKS
  tips: string[]
  model: string
  notes: Note[]
}

export function task1(spec: Task1Spec): WritingPrompt {
  const mode = spec.mode ?? (spec.figure.kind === 'process' ? 'process' : spec.figure.kind === 'map' ? 'map' : spec.figure.kind === 'line' ? 'trend' : 'static')
  return {
    id: spec.id,
    task: 'task1-academic',
    minutes: 20,
    minWords: 150,
    instructions: [spec.instructions],
    footer: T1_FOOTER,
    question: spec.instructions,
    figure: spec.figure,
    plan: T1_PLAN[mode].map(([label, hint]) => ({ label, hint })),
    tips: spec.tips,
    checks: T1_CHECKS[mode],
    model: { text: tidy(spec.model), notes: notes(spec.notes) },
  }
}

export type EssayType = 'opinion' | 'discussion' | 'advantages' | 'problem' | 'two-part'

const T2_CHECKS: Record<EssayType, CheckId[]> = {
  opinion: ['min-words', 'paragraphs-4', 'paraphrase', 'position', 'conclusion', 'examples', 'linkers-5', 'no-overuse', 'sentence-variety', 'lexical-variety'],
  discussion: ['min-words', 'paragraphs-4', 'paraphrase', 'both-views', 'position', 'conclusion', 'examples', 'linkers-5', 'no-overuse', 'sentence-variety'],
  advantages: ['min-words', 'paragraphs-4', 'paraphrase', 'adv-disadv', 'position', 'conclusion', 'examples', 'linkers-5', 'no-overuse', 'sentence-variety'],
  problem: ['min-words', 'paragraphs-4', 'paraphrase', 'causes-solutions', 'conclusion', 'examples', 'linkers-5', 'no-overuse', 'sentence-variety', 'lexical-variety'],
  'two-part': ['min-words', 'paragraphs-4', 'paraphrase', 'part-1', 'part-2', 'conclusion', 'examples', 'linkers-5', 'no-overuse', 'sentence-variety'],
}

const T2_PLAN: Record<EssayType, [string, string][]> = {
  opinion: [
    ['Position', 'Agree, disagree or partly agree — and the one reason that decides it.'],
    ['Idea 1', 'Your strongest reason + a specific example.'],
    ['Idea 2', 'A second reason, or the opposing view and why it is weaker.'],
  ],
  discussion: [
    ['View A', 'Why some people hold the first view — two reasons and an example.'],
    ['View B', 'Why others hold the second view — two reasons and an example.'],
    ['My view', 'Which side you lean to, stated in the introduction and the conclusion.'],
  ],
  advantages: [
    ['Advantages', 'Two clear benefits, each explained with an example.'],
    ['Disadvantages', 'Two drawbacks, each explained with an example.'],
    ['Verdict', 'Which side outweighs the other, and why (if the question asks).'],
  ],
  problem: [
    ['Causes / problems', 'Two causes or problems, each explained.'],
    ['Solutions', 'A practical solution for each cause, and who should act.'],
    ['Example', 'One concrete example that makes a solution believable.'],
  ],
  'two-part': [
    ['Answer to question 1', 'A direct answer with two reasons.'],
    ['Answer to question 2', 'A direct answer with a reason and an example.'],
    ['Link', 'How the two answers connect — use it in the conclusion.'],
  ],
}

export interface Task2Spec {
  id: string
  type: EssayType
  /** The statement, then the question(s), as printed. */
  instructions: string[]
  /** Two-part questions: what each answer should talk about, for the checklist. */
  parts?: [string, RegExp][]
  tips: string[]
  model: string
  notes: Note[]
}

export function task2(spec: Task2Spec): WritingPrompt {
  return {
    id: spec.id,
    task: 'task2',
    minutes: 40,
    minWords: 250,
    instructions: spec.instructions,
    footer: T2_FOOTER,
    question: spec.instructions.join(' '),
    plan: T2_PLAN[spec.type].map(([label, hint]) => ({ label, hint })),
    tips: spec.tips,
    checks: T2_CHECKS[spec.type],
    ...(spec.parts ? { bulletChecks: spec.parts.map(([label, pattern]) => ({ label, pattern })) } : {}),
    model: { text: tidy(spec.model), notes: notes(spec.notes) },
  }
}

export const fullTest = (id: string, task1: WritingPrompt, task2: WritingPrompt): FullWritingTest => ({ id, task1, task2 })
