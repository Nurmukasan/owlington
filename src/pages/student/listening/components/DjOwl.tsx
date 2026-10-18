import { PixelSprite } from '../../../../components/PixelSprite'
import { TalkingOwl } from '../../../../learn/components/TalkingOwl'
import { DJ_HEADPHONES } from '../sprites'

interface DjOwlProps {
  talking?: boolean
  happy?: boolean
  look?: -1 | 0 | 1
  /** Size of one sprite pixel, in px (CSS may override with --ls-px). */
  scale?: number
  className?: string
}

/** The Owlington owl as Owl FM's night DJ: the talking sprite with headphones on top. */
export function DjOwl({ talking = false, happy = false, look = 0, scale = 4, className = '' }: DjOwlProps) {
  return (
    <span className={`ls-dj ${talking ? 'is-talking' : ''} ${className}`} style={{ ['--ls-px' as string]: `${scale}px` }} aria-hidden="true">
      <TalkingOwl talking={talking} happy={happy} look={look} scale={scale} className="ls-dj__owl" />
      <PixelSprite sprite={DJ_HEADPHONES} scale={scale} className="ls-dj__phones" />
    </span>
  )
}
