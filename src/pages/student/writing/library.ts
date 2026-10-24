/*
 * Loads writing prompts on demand. The first six live in prompts.ts; every
 * later prompt (focused practice) is its own module under tasks/, and each
 * full test (Task 1 + Task 2) is a module under tests/.
 */
import { PROMPTS, type WritingPrompt } from './prompts'

export interface FullWritingTest {
  id: string
  task1: WritingPrompt
  task2: WritingPrompt
}

const TASKS = import.meta.glob<WritingPrompt>('./tasks/*.ts', { import: 'default' })
const TESTS = import.meta.glob<FullWritingTest>('./tests/*.ts', { import: 'default' })

export async function loadPrompt(id: string): Promise<WritingPrompt | undefined> {
  const built = PROMPTS.find((p) => p.id === id)
  if (built) return built
  const load = TASKS[`./tasks/${id}.ts`]
  return load ? load() : undefined
}

export async function loadFullTest(id: string): Promise<FullWritingTest | undefined> {
  const load = TESTS[`./tests/${id}.ts`]
  return load ? load() : undefined
}

/** Task 2 counts twice as much as Task 1; the result is rounded to the nearest half band (quarters round up). */
export function fullBand(task1: number, task2: number) {
  return Math.floor(((task1 + task2 * 2) / 3) * 2 + 0.5) / 2
}
