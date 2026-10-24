import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { TalkingOwl } from '../../../learn/components/TalkingOwl'
import { sfx } from '../../../learn/sfx'
import { FlyingLetter, Inkwell, Lantern, PaperPlane, ProfessorCap, Quill } from './art'
import { useActive, useReducedMotion } from './hooks'

/** Sentences the quill writes, three lines each. */
const SENTENCES: [string, string, string][] = [
  ['Overall, the trend', 'is clear: every night', 'you write, you rise.'],
  ['In conclusion,', 'practice by lamplight', 'pays off at dawn.'],
  ['Moreover, one quiet', 'hour of writing beats', 'a week of worrying.'],
]

interface DeskSceneProps {
  /** Lines the professor owl says, in order. */
  tips: string[]
}

/**
 * The hero illustration: a writer's desk by a rainy window. A quill writes on
 * parchment (an ink reveal made only of transforms), dips into the inkwell,
 * and the professor owl reads over your shoulder.
 */
export function DeskScene({ tips }: DeskSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLSpanElement | null)[]>([])
  const active = useActive(sceneRef)
  const reduced = useReducedMotion()
  const [sentence, setSentence] = useState(0)
  const [vars, setVars] = useState<Record<string, string>>({})
  // The ink animation starts once the handwriting font has loaded, and restarts
  // after a resize: transform percentages are resolved when an animation starts.
  const [live, setLive] = useState(false)
  const [generation, setGeneration] = useState(0)

  // Measure line widths and the inkwell position so the quill tip tracks the ink.
  const measure = useCallback(() => {
    const box = linesRef.current
    const ink = inkRef.current
    if (!box) return
    const origin = box.getBoundingClientRect()
    const widths = textRefs.current.map((el) => (el ? el.getBoundingClientRect().width : 0))
    const first = textRefs.current[0]
    const lineRect = first?.parentElement?.parentElement?.getBoundingClientRect()
    const lh = lineRect ? lineRect.height : 30
    const base = lineRect ? lineRect.bottom - origin.top - lh * 0.22 : 24
    const next: Record<string, string> = {
      '--wr-w1': `${widths[0]}px`,
      '--wr-w2': `${widths[1]}px`,
      '--wr-w3': `${widths[2]}px`,
      '--wr-lh': `${lh}px`,
      '--wr-base': `${base}px`,
    }
    if (ink) {
      const r = ink.getBoundingClientRect()
      next['--wr-ink-x'] = `${r.left + r.width * 0.5 - origin.left}px`
      next['--wr-ink-y'] = `${r.top + r.height * 0.12 - origin.top}px`
    }
    setVars(next)
  }, [])

  useLayoutEffect(measure, [measure, sentence])

  useEffect(() => {
    let cancelled = false
    const fonts = document.fonts
    const start = () => {
      if (cancelled) return
      measure()
      setLive(true)
    }
    if (fonts) void fonts.ready.then(start)
    else window.setTimeout(start, 0)
    return () => {
      cancelled = true
    }
  }, [measure])

  useEffect(() => {
    const box = sceneRef.current
    if (!box || typeof ResizeObserver === 'undefined') return
    let timer = 0
    let lastWidth = box.getBoundingClientRect().width
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      if (Math.abs(width - lastWidth) < 1) return
      lastWidth = width
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        measure()
        setGeneration((g) => g + 1)
      }, 180)
    })
    ro.observe(box)
    return () => {
      ro.disconnect()
      window.clearTimeout(timer)
    }
  }, [measure])

  const lines = SENTENCES[sentence]

  return (
    <div ref={sceneRef} className={`wr-scene ${live ? 'is-live' : ''} ${active || reduced ? '' : 'wr-paused'}`}>
      <div className="wr-scene__art" aria-hidden="true">
      <div className="wr-window">
        <div className="wr-window__sky">
          <span className="wr-window__stars" />
          <span className="wr-window__stars wr-window__stars--twinkle" />
          <span className="wr-window__moon" />
          <span className="wr-window__cloud wr-window__cloud--a" />
          <span className="wr-window__cloud wr-window__cloud--b" />
          <span className="wr-window__roofs" />
          <PaperPlane className="wr-window__flyer wr-window__flyer--a" />
          <FlyingLetter className="wr-window__flyer wr-window__flyer--b" />
          <PaperPlane className="wr-window__flyer wr-window__flyer--c" />
          <span className="wr-rain wr-rain--slow" />
          <span className="wr-rain" />
          <span className="wr-window__drop" style={{ '--wr-d': 0 } as CSSProperties} />
          <span className="wr-window__drop" style={{ '--wr-d': 1 } as CSSProperties} />
          <span className="wr-window__drop" style={{ '--wr-d': 2 } as CSSProperties} />
          <span className="wr-window__drop" style={{ '--wr-d': 3 } as CSSProperties} />
          <span className="wr-window__glass" />
        </div>
        <span className="wr-window__bar wr-window__bar--v" />
        <span className="wr-window__bar wr-window__bar--h" />
        <span className="wr-window__sill" />
      </div>

      <span className="wr-scene__rod" />
      <span className="wr-scene__curtain" />
      <span className="wr-scene__tieback" />
      <span className="wr-scene__glow" />
      <span className="wr-scene__desk" />
      <span className="wr-scene__pool" />

      <div className="wr-scene__lantern">
        <Lantern />
      </div>

      <div className="wr-scene__paper">
        <span className="wr-scene__paper-under" />
        <div className="wr-scene__sheet">
          <span className="wr-scene__date wr-hand">Writing · Task 2</span>
          <div ref={linesRef} className="wr-ink" style={vars as CSSProperties}>
            {lines.map((line, i) => (
              <span key={`${generation}-${sentence}-${i}`} className={`wr-ink__line wr-ink__line--${i + 1}`}>
                <span className="wr-ink__mask">
                  <span
                    ref={(el) => {
                      textRefs.current[i] = el
                    }}
                    className="wr-ink__text wr-hand"
                  >
                    {line}
                  </span>
                </span>
              </span>
            ))}
            <span className="wr-ink__blot" />
            <div
              key={generation}
              className="wr-ink__quill"
              onAnimationIteration={(e) => {
                if (e.target === e.currentTarget) setSentence((s) => (s + 1) % SENTENCES.length)
              }}
            >
              <span className="wr-ink__quill-wiggle">
                <Quill width={44} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div ref={inkRef} className="wr-scene__inkwell">
        <Inkwell key={generation} />
      </div>

      <div className="wr-scene__books">
        <span className="wr-book wr-book--1" />
        <span className="wr-book wr-book--2" />
        <span className="wr-book wr-book--3" />
      </div>
      </div>

      <ProfessorOwl tips={tips} />
    </div>
  )
}

/** The professor: an owl in a mortarboard who types out tips (click for the next one). */
function ProfessorOwl({ tips }: { tips: string[] }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(0)
  const text = tips[index % tips.length] ?? ''

  useEffect(() => {
    if (reduced) return
    let n = 0
    const id = window.setInterval(() => {
      n += 2
      setShown(n)
      if (n >= text.length) window.clearInterval(id)
    }, 28)
    return () => window.clearInterval(id)
  }, [text, reduced])

  const visible = reduced ? text.length : Math.min(shown, text.length)
  const talking = visible < text.length

  const next = () => {
    sfx.owl('professor')
    setShown(0)
    setIndex((i) => (i + 1) % tips.length)
  }

  return (
    <div className="wr-prof">
      <div className="wr-prof__bubble">
        <p className="wr-prof__name" aria-hidden="true">
          PROFESSOR HOOT
        </p>
        <p className="wr-prof__text" aria-hidden="true">
          {text.slice(0, visible)}
          <span className="wr-prof__ghost">{text.slice(visible)}</span>
        </p>
        <p className="visually-hidden" aria-live="polite">
          Professor Hoot says: {text}
        </p>
        <button type="button" className="wr-prof__next" onClick={next}>
          Another tip <span aria-hidden="true">›</span>
        </button>
      </div>
      <button type="button" className="wr-prof__owl" onClick={next} aria-label="Ask Professor Hoot for another writing tip">
        <ProfessorCap scale={4} className="wr-prof__cap" />
        <TalkingOwl talking={talking} look={-1} scale={5} />
      </button>
    </div>
  )
}
