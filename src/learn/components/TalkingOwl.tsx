import { useEffect, useMemo, useState } from 'react'
import { PixelSprite } from '../../components/PixelSprite'
import { OWL_PALETTE, owlRows } from '../../scene/sprites'

interface TalkingOwlProps {
  /** Flaps its beak while true. */
  talking?: boolean
  /** Happy ^ ^ eyes, e.g. after a correct answer. */
  happy?: boolean
  look?: -1 | 0 | 1
  scale?: number
  className?: string
}

/** The pixel owl as a lively SVG sprite: blinks on its own and talks on demand. */
export function TalkingOwl({ talking = false, happy = false, look = 0, scale = 3, className = '' }: TalkingOwlProps) {
  const [beak, setBeak] = useState(false)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    if (!talking) return
    const id = window.setInterval(() => setBeak((b) => !b), 140)
    return () => window.clearInterval(id)
  }, [talking])

  useEffect(() => {
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          setBlink(true)
          window.setTimeout(() => setBlink(false), 130)
          schedule()
        },
        2000 + Math.random() * 3500,
      )
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [])

  const sprite = useMemo(
    () => ({
      rows: owlRows({ look, eyes: happy ? 'happy' : blink ? 'closed' : 'open', beakOpen: talking && beak }),
      palette: OWL_PALETTE,
    }),
    [look, happy, blink, talking, beak],
  )

  return <PixelSprite sprite={sprite} scale={scale} className={`talking-owl ${className}`} />
}
