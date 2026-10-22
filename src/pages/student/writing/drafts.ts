import { draftKey } from './content'

/** An autosaved, unsubmitted essay for one prompt. */
export interface Draft {
  text: string
  /** Planning notes, one per plan field. */
  plan: string[]
  /** Seconds spent writing so far. */
  elapsed: number
  updatedAt: string
}

export function loadDraft(userId: string, practiceId: string): Draft | null {
  try {
    const raw = localStorage.getItem(draftKey(userId, practiceId))
    if (!raw) return null
    const d = JSON.parse(raw) as Partial<Draft>
    if (typeof d.text !== 'string') return null
    return {
      text: d.text,
      plan: Array.isArray(d.plan) ? d.plan.map(String) : [],
      elapsed: Number(d.elapsed) || 0,
      updatedAt: d.updatedAt ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function saveDraft(userId: string, practiceId: string, draft: Draft) {
  try {
    localStorage.setItem(draftKey(userId, practiceId), JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function clearDraft(userId: string, practiceId: string) {
  try {
    localStorage.removeItem(draftKey(userId, practiceId))
  } catch {
    // ignore
  }
}

/** True when a draft holds anything worth resuming. */
export const hasContent = (d: Draft | null): d is Draft =>
  Boolean(d && (d.text.trim().length > 0 || d.plan.some((p) => p.trim().length > 0)))
