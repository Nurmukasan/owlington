/*
 * A broadcast in progress, saved on this device so that leaving mid-test
 * (a HUD tab, the back button, a closed tab) never throws the answers away.
 * One draft per student and station; it expires after a day.
 */
import type { Answers } from './script'

export interface Draft {
  answers: Answers
  /** Seconds on air so far. */
  elapsed: number
  /** Script item the broadcast had reached. */
  index: number
  savedAt: number
}

const TTL = 24 * 60 * 60 * 1000
const keyOf = (userId: string, practiceId: string) => `owlington:listening:draft:${userId}:${practiceId}`

export function readDraft(userId: string, practiceId: string): Draft | null {
  try {
    const raw = localStorage.getItem(keyOf(userId, practiceId))
    if (!raw) return null
    const d = JSON.parse(raw) as Partial<Draft> | null
    if (!d || typeof d.savedAt !== 'number' || Date.now() - d.savedAt > TTL) {
      localStorage.removeItem(keyOf(userId, practiceId))
      return null
    }
    const answers: Answers = {}
    for (const [k, v] of Object.entries(d.answers ?? {})) {
      if (typeof v === 'string' && Number.isInteger(Number(k))) answers[Number(k)] = v.slice(0, 60)
    }
    return {
      answers,
      elapsed: Math.max(0, Math.round(Number(d.elapsed) || 0)),
      index: Math.max(0, Math.floor(Number(d.index) || 0)),
      savedAt: d.savedAt,
    }
  } catch {
    return null
  }
}

export function saveDraft(userId: string, practiceId: string, draft: Draft) {
  try {
    localStorage.setItem(keyOf(userId, practiceId), JSON.stringify(draft))
  } catch {
    // storage full or blocked: the beforeunload / leave warnings still protect the answers
  }
}

export function clearDraft(userId: string, practiceId: string) {
  try {
    localStorage.removeItem(keyOf(userId, practiceId))
  } catch {
    // nothing to clear
  }
}
