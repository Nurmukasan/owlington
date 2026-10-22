import type { CSSProperties } from 'react'
import { PixelSprite } from '../../../components/PixelSprite'
import { SectionGateway } from '../../../learn/components/SectionGateway'
import { PENCIL_ICON } from '../../../scene/sprites'
import { DeskScene } from './DeskScene'
import { useCountUp } from './hooks'
import { formatBand } from './stats'

interface HubHeroProps {
  lettersRead: number
  lettersTotal: number
  essays: number
  words: number
  bestBand: number | null
  tips: string[]
}

export function HubHero({ lettersRead, lettersTotal, essays, words, bestBand, tips }: HubHeroProps) {
  const shownWords = useCountUp(words)
  return (
    <header className="wr-hero">
      <div className="wr-hero__copy">
        <p className="wr-eyebrow wr-hero__eyebrow">
          <PixelSprite sprite={PENCIL_ICON} scale={2} />
          Writing · lamps lit till dawn
        </p>
        <h1 className="wr-hero__title wr-display">
          <span className="wr-hero__word">The</span>{' '}
          <span className="wr-hero__ink">
            Inkwell
            <svg className="wr-hero__flourish" viewBox="0 0 320 40" aria-hidden="true" preserveAspectRatio="none">
              <path d="M4 26 C60 8 120 34 176 20 S270 6 316 18" pathLength={1} />
              <path d="M228 32 C252 24 278 27 300 34" pathLength={1} />
            </svg>
          </span>
          <br />
          <span className="wr-hero__word wr-hero__word--2">Study</span>
        </h1>
        <p className="wr-hero__lead">
          Sealed letters from the professor and timed assignments on lined paper, marked against the four IELTS criteria.
          Pull up a chair — the ink is fresh.
        </p>

        <SectionGateway section="writing" icon={PENCIL_ICON} lectureNoun="letter" className="wr-gateway" />

        <dl className="wr-ledger">
          <div className="wr-ledger__card" style={{ '--wr-tilt': '-2deg' } as CSSProperties}>
            <dt>Letters read</dt>
            <dd>
              <span className="wr-ledger__value">{lettersRead}</span>
              <span className="wr-ledger__of">/{lettersTotal}</span>
            </dd>
          </div>
          <div className="wr-ledger__card" style={{ '--wr-tilt': '1.5deg' } as CSSProperties}>
            <dt>Essays sealed</dt>
            <dd>
              <span className="wr-ledger__value">{essays}</span>
            </dd>
          </div>
          <div className="wr-ledger__card" style={{ '--wr-tilt': '-1deg' } as CSSProperties}>
            <dt>Words written</dt>
            <dd>
              <span className="wr-ledger__value">{Math.round(shownWords).toLocaleString('en-GB')}</span>
            </dd>
          </div>
          <div className="wr-ledger__card" style={{ '--wr-tilt': '2deg' } as CSSProperties}>
            <dt>Best band</dt>
            <dd>
              <span className="wr-ledger__value">{bestBand === null ? '—' : formatBand(bestBand)}</span>
            </dd>
          </div>
        </dl>
      </div>

      <DeskScene tips={tips} />
    </header>
  )
}
