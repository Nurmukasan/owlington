import { PixelSprite } from '../../../../components/PixelSprite'
import { RADIO_TOWER } from '../sprites'

/** The Owl FM mast: pixel lattice, a blinking red beacon and signal rings rolling out from the top. */
export function RadioTower({ className = '' }: { className?: string }) {
  return (
    <div className={`ls-tower ${className}`} aria-hidden="true">
      <span className="ls-tower__rings">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="ls-tower__beacon" />
      <PixelSprite sprite={RADIO_TOWER} scale={4} className="ls-tower__mast" />
    </div>
  )
}
