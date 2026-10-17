/**
 * Celebration effects drawn with plain DOM nodes and CSS animations
 * (styles live in learn.css). Both are skipped when reduced motion is on.
 */

const DEFAULT_COLORS = ['#ffb627', '#ffcf5c', '#6fe3cf', '#ff9a85', '#fff1c9', '#8f86ff']

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Point {
  x?: number
  y?: number
}

function centerOf(target?: Element | Point): { x: number; y: number } {
  if (target instanceof Element) {
    const r = target.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return { x: target?.x ?? window.innerWidth / 2, y: target?.y ?? window.innerHeight / 2 }
}

/** A burst of square pixel confetti from an element or a point (defaults to the screen centre). */
export function pixelConfetti(from?: Element | Point, options: { colors?: string[]; count?: number } = {}) {
  if (reducedMotion()) return
  const { x, y } = centerOf(from)
  const colors = options.colors ?? DEFAULT_COLORS
  const count = options.count ?? 48
  const layer = document.createElement('div')
  layer.className = 'fx-layer'
  layer.setAttribute('aria-hidden', 'true')

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span')
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5
    const speed = 120 + Math.random() * 260
    const size = [4, 6, 8][Math.floor(Math.random() * 3)]
    piece.className = 'fx-confetti'
    piece.style.left = `${x}px`
    piece.style.top = `${y}px`
    piece.style.width = `${size}px`
    piece.style.height = `${size}px`
    piece.style.background = colors[i % colors.length]
    piece.style.setProperty('--dx', `${Math.cos(angle) * speed}px`)
    piece.style.setProperty('--dy', `${Math.sin(angle) * speed}px`)
    piece.style.setProperty('--rot', `${(Math.random() - 0.5) * 720}deg`)
    piece.style.animationDuration = `${900 + Math.random() * 600}ms`
    layer.appendChild(piece)
  }
  document.body.appendChild(layer)
  window.setTimeout(() => layer.remove(), 1700)
}

/** Text that floats up and fades, e.g. "+50 XP". */
export function floatText(text: string, from?: Element | Point, color = '#ffb627') {
  if (reducedMotion()) return
  const { x, y } = centerOf(from)
  const el = document.createElement('span')
  el.className = 'fx-float'
  el.textContent = text
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.color = color
  el.setAttribute('aria-hidden', 'true')
  document.body.appendChild(el)
  window.setTimeout(() => el.remove(), 1400)
}
