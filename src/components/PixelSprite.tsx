import { useMemo } from 'react'
import type { Palette, Sprite } from '../scene/sprites'

interface PixelSpriteProps {
  sprite: Sprite
  /** Size of one sprite pixel in CSS pixels. */
  scale?: number
  /** Override some palette colours (e.g. to recolour an avatar). */
  palette?: Palette
  title?: string
  className?: string
}

/** Renders a text-based pixel sprite as a crisp SVG made of merged runs. */
export function PixelSprite({ sprite, scale = 2, palette, title, className }: PixelSpriteProps) {
  const width = sprite.rows[0].length
  const height = sprite.rows.length

  const rects = useMemo(() => {
    const colors = { ...sprite.palette, ...palette }
    const out: { x: number; y: number; w: number; fill: string }[] = []
    sprite.rows.forEach((row, y) => {
      let x = 0
      while (x < row.length) {
        const ch = row[x]
        let end = x + 1
        while (end < row.length && row[end] === ch) end++
        if (colors[ch]) out.push({ x, y, w: end - x, fill: colors[ch] })
        x = end
      }
    })
    return out
  }, [sprite, palette])

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={width * scale}
      height={height * scale}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  )
}
