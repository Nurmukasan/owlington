import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NightSceneEngine, type OwlRect } from '../scene/NightSceneEngine'
import './NightScene.css'

export interface SceneSize {
  width: number
  height: number
}

interface NightSceneProps {
  className?: string
  seed?: number
  /** Show the owl on its branch. */
  owl?: boolean
  /** Stop animating (e.g. while another page covers the scene). */
  paused?: boolean
  onOwlClick?: () => void
  owlLabel?: string
  /** Render overlays positioned relative to the owl (e.g. a speech bubble). */
  children?: (owlRect: OwlRect | null, size: SceneSize) => ReactNode
}

export function NightScene({
  className = '',
  seed,
  owl = true,
  paused = false,
  onOwlClick,
  owlLabel = 'Say hi to the owl',
  children,
}: NightSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<NightSceneEngine | null>(null)
  const pausedRef = useRef(paused)
  const visibleRef = useRef(true)
  const [owlRect, setOwlRect] = useState<OwlRect | null>(null)
  const [size, setSize] = useState<SceneSize>({ width: 0, height: 0 })

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const engine = new NightSceneEngine(canvas, {
      seed,
      owl,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onOwlRect: setOwlRect,
    })
    engineRef.current = engine

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      engine.resize(width, height, window.devicePixelRatio || 1)
      setSize({ width, height })
    })
    resizeObserver.observe(wrap)

    // Don't burn battery animating a scene nobody can see.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      engine.setActive(entry.isIntersecting && !pausedRef.current)
    })
    visibilityObserver.observe(wrap)

    return () => {
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      engine.destroy()
      engineRef.current = null
    }
  }, [seed, owl])

  useEffect(() => {
    pausedRef.current = paused
    engineRef.current?.setActive(visibleRef.current && !paused)
  }, [paused])

  const handleOwlClick = () => {
    engineRef.current?.hoot()
    onOwlClick?.()
  }

  return (
    <div ref={wrapRef} className={`night-scene ${className}`}>
      <canvas ref={canvasRef} className="night-scene__canvas" aria-hidden="true" />
      <div className="night-scene__vignette" aria-hidden="true" />
      {owl && owlRect && (
        <button
          type="button"
          className="night-scene__owl"
          style={{ left: owlRect.x, top: owlRect.y, width: owlRect.width, height: owlRect.height }}
          onClick={handleOwlClick}
          aria-label={owlLabel}
        />
      )}
      {children?.(owlRect, size)}
    </div>
  )
}
