import { useEffect, useState } from 'react'
import { floatText, pixelConfetti } from '../fx'
import { onProgressEvent, XP_RULES, type AchievementIcon } from '../progress'
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

/** Global toasts for unlocked achievements and rank-ups, plus "+XP" pops from the HUD. */
export function AchievementToaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

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
                eyebrow: `ACHIEVEMENT · +${XP_RULES.achievement} XP`,
                title: event.achievement.title,
                text: event.achievement.description,
                icon: event.achievement.icon,
              }
            : {
                id: nextId++,
                eyebrow: 'RANK UP!',
                title: `Rank ${event.rank}`,
                text: `You’re now a ${event.title}. Hoo-ray!`,
                icon: 'owl',
              }

        setToasts((list) => [...list, toast])
        window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== toast.id)), TOAST_MS)

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
      {toasts.map((t) => (
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
            onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
