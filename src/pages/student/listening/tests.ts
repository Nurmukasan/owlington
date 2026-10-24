import { PRACTICE_SETS, type PracticeSet, type Recording } from './practice-data'

/*
 * Every Owl FM broadcast, loaded on demand. Each file in ./tests/ is its own
 * small chunk; a broadcast that has been recorded also has <id>.audio.json
 * beside it (where each line sits in public/audio/listening/<id>.mp3).
 */

const FILES = import.meta.glob<PracticeSet>('./tests/*.ts', { import: 'default' })
const CLIPS = import.meta.glob<Recording['clips']>('./tests/*.audio.json', { import: 'default' })

export const recordingSrc = (id: string) => `${import.meta.env.BASE_URL}audio/listening/${id}.mp3`

export async function loadSet(id: string): Promise<PracticeSet | undefined> {
  const set = PRACTICE_SETS[id] ?? (await FILES[`./tests/${id}.ts`]?.())
  if (!set) return undefined
  const clips = await CLIPS[`./tests/${id}.audio.json`]?.()
  return clips ? { ...set, audio: { src: recordingSrc(id), clips } } : set
}
