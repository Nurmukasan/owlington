import { useEffect, useRef, useState } from 'react'
import { floatText, pixelConfetti } from '../fx'
import { onProgressEvent, type AchievementIcon } from '../progress'
import { sfx } from '../sfx'
import { AchievementBadge } from './ProgressWidgets'

interface Toast {
  id: number
  eyebrow: string
  title: string
  text: string
  icon: AchievementIcon
}

let nextId = 1
const TOAST_MS = 5200
/** Several unlocks can land at once; show a few and queue the rest. */
const MAX_SHOWN = 3

/** Global toasts for unlocked achievements and rank-ups, plus "+XP" pops from the HUD. */
export function AchievementToaster() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef(new Map<number, number>())
  const shown = toasts.slice(0, MAX_SHOWN)

  // Each toast's clock starts when it comes on screen, not when it was queued.
  useEffect(() => {
    for (const t of shown) {
      if (timers.current.has(t.id)) continue
      const timer = window.setTimeout(() => {
        timers.current.delete(t.id)
        setToasts((list) => list.filter((x) => x.id !== t.id))
      }, TOAST_MS)
      timers.current.set(t.id, timer)
    }
  })

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const dismiss = (id: number) => {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((list) => list.filter((x) => x.id !== id))
  }

  useEffect(
    () =>
      onProgressEvent((event) => {
        if (event.type === 'xp') {
          const hud = document.querySelector('.hud__stats')
          const r = hud?.getBoundingClientRect()
          floatText(`+${event.amount} XP`, r ? { x: r.left + r.width / 2, y: r.bottom + 28 } : undefined)
          return
        }

        const toast: Toast =
          event.type === 'achievement'
            ? {
                id: nextId++,
                eyebrow: `ACHIEVEMENT · +${event.achievement.xp} XP`,
                title: event.achievement.title,
                text: event.achievement.description,
                icon: event.achievement.icon,
              }
            : {
                id: nextId++,
                eyebrow: 'RANK UP!',
                title: `Rank ${event.rank} · ${event.title}`,
                text: event.description,
                icon: 'owl',
              }

        setToasts((list) => [...list, toast])

        if (event.type === 'rank-up') {
          sfx.rankUp()
          pixelConfetti(undefined, { count: 90 })
        } else {
          sfx.unlock()
        }
      }),
    [],
  )

  return (
    <div className="toaster" aria-live="polite">
      {shown.map((t) => (
        <div key={t.id} className="toast pixel-panel">
          <AchievementBadge icon={t.icon} unlocked scale={3} className="toast__badge" />
          <div>
            <p className="toast__eyebrow">{t.eyebrow}</p>
            <p className="toast__title">{t.title}</p>
            <p className="toast__text">{t.text}</p>
          </div>
          <button
            type="button"
            className="toast__close"
            aria-label="Dismiss"
            onClick={() => dismiss(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
