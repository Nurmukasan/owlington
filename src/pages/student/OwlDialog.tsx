import { useEffect, useImperativeHandle, useState, type Ref } from 'react'
import { sfx } from '../../learn/sfx'
import type { SceneSize } from '../../components/NightScene'
import type { OwlRect } from '../../scene/NightSceneEngine'

export interface OwlDialogHandle {
  /** Finish typing the current line, or move to the next one. */
  advance: () => void
}

interface OwlDialogProps {
  ref?: Ref<OwlDialogHandle>
  /** Shown once, in order, before the tips. */
  intro: string[]
  /** Cycled forever after the intro. */
  tips: string[]
  owlRect: OwlRect | null
  sceneSize: SceneSize
}

const CHAR_DELAY_MS = 26
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** An RPG-style speech box for the owl, typed out one letter at a time. */
export function OwlDialog({ ref, intro, tips, owlRect, sceneSize }: OwlDialogProps) {
  const lines = [...intro, ...tips]
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? Infinity : 0))
  const text = lines[index % lines.length]
  const done = typed >= text.length

  useEffect(() => {
    if (done) return
    const id = window.setTimeout(() => {
      setTyped((n) => n + 1)
      sfx.talk('forest')
    }, CHAR_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [typed, done])

  const advance = () => {
    if (!done) {
      setTyped(Infinity)
      return
    }
    setIndex((i) => (i + 1 < lines.length ? i + 1 : intro.length))
    setTyped(prefersReducedMotion() ? Infinity : 0)
  }

  useImperativeHandle(ref, () => ({ advance }))

  if (!owlRect) return null

  const wide = sceneSize.width >= 760
  const left = owlRect.x + owlRect.width + 18
  const style = wide
    ? {
        left,
        top: Math.max(110, owlRect.y - 64),
        width: Math.min(400, sceneSize.width - left - 32),
      }
    : undefined

  return (
    <div className={`owl-dialog pixel-panel ${wide ? 'owl-dialog--beside' : 'owl-dialog--bottom'}`} style={style}>
      <p className="owl-dialog__speaker">OWL</p>
      <p className="owl-dialog__text" aria-live="polite">
        <span aria-hidden="true">{text.slice(0, typed)}</span>
        <span className="visually-hidden">{text}</span>
      </p>
      <button type="button" className="owl-dialog__next" onClick={advance}>
        {done ? 'NEXT' : 'SKIP'} <span aria-hidden="true">▼</span>
      </button>
    </div>
  )
}
