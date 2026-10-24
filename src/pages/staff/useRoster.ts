import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SectionId } from '../../learn/types'

export const SECTION_NAME: Record<SectionId, string> = { reading: 'Reading', listening: 'Listening', writing: 'Writing' }

/** A readable starting password the admin can pass on: three short words and a number. */
export function suggestPassword() {
  const words = ['owl', 'moon', 'quill', 'lamp', 'star', 'fern', 'tide', 'reed', 'ink', 'oak', 'mist', 'pine']
  const pickWord = () => words[Math.floor(Math.random() * words.length)]
  return `${pickWord()}-${pickWord()}-${pickWord()}-${Math.floor(10 + Math.random() * 90)}`
}

/**
 * Re-reads roster data when the admin changes something (here or in another tab).
 * `read` is called on every refresh; keep it cheap or memoise inside.
 */
export function useLive<T>(read: () => T): [T, () => void] {
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick((t) => t + 1), [])
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('owlington:')) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])
  // `read` changes identity every render; the tick decides when to re-read.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(read, [tick])
  return [value, refresh]
}

export const formatDate = (iso: string | undefined, withYear = true) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) }) : '—'

/** "today", "3 days ago", "5 weeks ago". */
export function ago(iso: string | undefined) {
  if (!iso) return 'never'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 14) return `${days} days ago`
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

export const bandText = (b: number | null | undefined) => (typeof b === 'number' ? b.toFixed(1) : '—')
export const pct = (x: number) => `${Math.round(x * 100)}%`
