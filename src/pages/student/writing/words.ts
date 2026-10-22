/*
 * The one word counter for the Writing section. It is tiny and pure, so the hub
 * can use it without pulling in the analysis engine, and the hub, the studio,
 * the tray and the model answers always agree on a count.
 */

/** Word tokens as IELTS would count them: anything between spaces with a letter or digit. */
export function wordTokens(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter((t) => /[\p{L}\p{N}]/u.test(t))
}

export const countWords = (text: string) => wordTokens(text).length

/** The shortest draft that can be handed in: 40% of the minimum (60 words for Task 1, 100 for Task 2). */
export const handInFloor = (minWords: number) => Math.ceil(minWords * 0.4)

/** Below half the minimum, checks that look for the absence of a fault prove nothing. */
export const judgeFloor = (minWords: number) => Math.ceil(minWords * 0.5)

/** "1 word", "3 words". */
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
