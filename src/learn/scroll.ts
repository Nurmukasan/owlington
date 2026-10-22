const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Scrolls to an element on the page and moves keyboard focus to it. */
export function scrollToId(id: string, block: ScrollLogicalPosition = 'start') {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
