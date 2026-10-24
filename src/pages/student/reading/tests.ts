import { PRACTICE, type ReadingTest } from './practice-data'

/*
 * Every reading test, loaded on demand: each file in ./tests/ becomes its own
 * small chunk, so opening one test never downloads the other forty.
 */

const FILES = import.meta.glob<ReadingTest>('./tests/*.ts', { import: 'default' })

export async function loadTest(id: string): Promise<ReadingTest | undefined> {
  if (PRACTICE[id]) return PRACTICE[id]
  const load = FILES[`./tests/${id}.ts`]
  return load ? load() : undefined
}
