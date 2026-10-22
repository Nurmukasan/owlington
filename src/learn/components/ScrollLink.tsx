import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { scrollToId } from '../scroll'

type ScrollLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  /** Id of the element to jump to (without "#"). */
  to: string
  block?: ScrollLogicalPosition
}

/**
 * An in-page jump link. Use it instead of `<a href="#id">`: on GitHub Pages the
 * app uses hash routing, where a bare "#id" link would be read as a route.
 */
export function ScrollLink({ to, block, onClick, ...rest }: ScrollLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    e.preventDefault()
    scrollToId(to, block)
  }
  return <a href={`#${to}`} onClick={handleClick} {...rest} />
}
