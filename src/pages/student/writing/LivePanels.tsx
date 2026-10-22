import { useState, type CSSProperties } from 'react'
import { formatClock } from '../../../learn/useTimer'
import { LINKER_GROUPS, type LinkerHit, type Sentence } from './analysis'

// ------------------------------------------------------------- ink timer ---

interface InkTimerProps {
  remaining: number
  total: number
  paused: boolean
  onTogglePause: () => void
  compact?: boolean
}

/** The countdown as an ink bottle that slowly empties. */
export function InkTimer({ remaining, total, paused, onTogglePause, compact = false }: InkTimerProps) {
  const level = Math.max(0, Math.min(1, remaining / total))
  const state = remaining < 0 ? 'is-over' : remaining <= 300 ? 'is-low' : ''
  const label = remaining < 0 ? `${formatClock(-remaining)} over` : `${formatClock(remaining)} left`
  return (
    <div className={`wr-timer ${state} ${paused ? 'is-paused' : ''} ${compact ? 'wr-timer--compact' : ''}`}>
      <div
        className="wr-timer__bottle"
        role="timer"
        aria-label={`Time: ${label}${paused ? ', paused' : ''}`}
        style={{ '--wr-v': level } as CSSProperties}
      >
        <span className="wr-timer__cork" aria-hidden="true" />
        <span className="wr-timer__glass" aria-hidden="true">
          <span className="wr-timer__ink" />
        </span>
      </div>
      <div className="wr-timer__read">
        <span className="wr-timer__time">{remaining < 0 ? `+${formatClock(-remaining)}` : formatClock(remaining)}</span>
        <span className="wr-timer__label">{paused ? 'paused' : remaining < 0 ? 'over time' : 'left'}</span>
      </div>
      <button type="button" className="wr-timer__pause" onClick={onTogglePause} aria-label={paused ? 'Resume the clock' : 'Pause the clock'}>
        {paused ? '▶' : '❚❚'}
      </button>
    </div>
  )
}

// ------------------------------------------------------------ word meter ---

interface WordMeterProps {
  words: number
  min: number
  paragraphs: number
  paragraphTarget: string
  bump?: number
}

/** Word count with a goal meter that fills like ink, plus the paragraph count. */
export function WordMeter({ words, min, paragraphs, paragraphTarget, bump = 0 }: WordMeterProps) {
  const scaleMax = Math.round(min * 1.4)
  const fill = Math.min(1, words / scaleMax)
  const met = words >= min
  return (
    <section className={`wr-panel wr-words ${met ? 'is-met' : ''}`} aria-label="Word count">
      <div className="wr-words__top">
        <p className="wr-words__count" key={bump}>
          <span className="wr-words__n">{words}</span>
          <span className="wr-words__of"> / {min} words</span>
        </p>
        <p className="wr-words__paras">
          <span className="wr-words__pn">
            {paragraphs}
            <span className="wr-words__pilcrow" aria-hidden="true">
              ¶
            </span>
            <span className="visually-hidden"> {paragraphs === 1 ? 'paragraph' : 'paragraphs'}</span>
          </span>
          <span className="wr-words__pt">aim {paragraphTarget}</span>
        </p>
      </div>
      <div
        className="wr-words__track"
        role="progressbar"
        aria-label={`${words} of ${min} words`}
        aria-valuemin={0}
        aria-valuemax={min}
        aria-valuenow={Math.min(words, min)}
      >
        <span className="wr-words__fill" style={{ transform: `scaleX(${fill})` }} />
        <span className="wr-words__goal" style={{ left: `${(min / scaleMax) * 100}%` }} aria-hidden="true" />
      </div>
      <p className="wr-words__note">
        {met ? `✓ Minimum reached${words > min * 1.3 ? ' — keep it focused' : ''}` : `${min - words} more to the minimum`}
      </p>
    </section>
  )
}

// -------------------------------------------------------------- cohesion ---

/** Linking words used so far, grouped by job, with over-used ones flagged. */
export function CohesionPanel({ linkers, target }: { linkers: LinkerHit[]; target: number }) {
  const variety = linkers.length
  return (
    <section className="wr-panel wr-cohesion" aria-labelledby="wr-cohesion-title">
      <div className="wr-panel__head">
        <h3 id="wr-cohesion-title">Cohesion</h3>
        <span className={`wr-panel__badge ${variety >= target ? 'is-good' : ''}`}>
          {variety} / {target}+ linkers
        </span>
      </div>
      <ul className="wr-cohesion__groups">
        {LINKER_GROUPS.map((g) => {
          const used = linkers.filter((l) => l.group === g.id)
          const suggestions = g.try.filter((t) => !used.some((u) => u.phrase === t)).slice(0, 2)
          return (
            <li key={g.id} className="wr-cohesion__group">
              <span className="wr-cohesion__label">{g.label}</span>
              <span className="wr-cohesion__chips">
                {used.map((l) => (
                  <span
                    key={l.phrase}
                    className={`wr-cohesion__chip ${l.overused ? 'is-over' : ''}`}
                    title={l.overused ? `Used ${l.count} times — try ${suggestions.join(' or ') || 'another linker'}` : undefined}
                  >
                    {l.phrase}
                    {l.count > 1 && <b>×{l.count}</b>}
                    {l.overused && <span className="visually-hidden"> — over-used</span>}
                  </span>
                ))}
                {!used.length && <span className="wr-cohesion__try">try “{suggestions[0] ?? g.try[0]}”</span>}
              </span>
            </li>
          )
        })}
      </ul>
      {linkers.some((l) => l.overused) && (
        <p className="wr-cohesion__warn" role="status">
          <span aria-hidden="true">!</span> Over-used:{' '}
          {linkers
            .filter((l) => l.overused)
            .map((l) => `“${l.phrase}” ×${l.count}`)
            .join(', ')}
          . Vary them or let the logic speak.
        </p>
      )}
    </section>
  )
}

// -------------------------------------------------------- sentence bars ---

const MAX_BARS = 28
const CAP = 40

/** Sentence-length variety: one thin bar per sentence, with the comfortable 12–22 word band shaded. */
export function SentenceBars({ sentences }: { sentences: Sentence[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const usable = sentences.filter((s) => s.words >= 3)
  const shown = usable.slice(-MAX_BARS)
  const offset = usable.length - shown.length
  const avg = usable.length ? usable.reduce((s, x) => s + x.words, 0) / usable.length : 0
  const short = usable.filter((s) => s.words <= 12).length
  const long = usable.filter((s) => s.words >= 22).length
  let verdict = 'Write a few sentences to see your rhythm.'
  if (usable.length >= 4) {
    if (avg > 28) verdict = 'Some very long sentences — check they stay under control.'
    else if (avg < 10) verdict = 'Mostly short sentences — try joining ideas with although, which or because.'
    else if (short && long) verdict = 'A nice mix of short and long sentences.'
    else verdict = 'Similar lengths — vary them for grammatical range.'
  }
  const h = hover !== null ? shown[hover] : null

  return (
    <section className="wr-panel wr-rhythm" aria-labelledby="wr-rhythm-title">
      <div className="wr-panel__head">
        <h3 id="wr-rhythm-title">Sentence rhythm</h3>
        <span className="wr-panel__badge">avg {avg ? avg.toFixed(1) : '–'}</span>
      </div>
      <div
        className="wr-rhythm__plot"
        role="img"
        aria-label={
          usable.length
            ? `${usable.length} sentences. Average ${avg.toFixed(1)} words; ${short} short, ${long} long. ${verdict}`
            : 'No sentences yet.'
        }
        onPointerLeave={() => setHover(null)}
      >
        <span className="wr-rhythm__band" style={{ bottom: `${(12 / CAP) * 100}%`, height: `${(10 / CAP) * 100}%` }} aria-hidden="true" />
        {shown.map((s, i) => (
          <span
            key={offset + i}
            className={`wr-rhythm__bar ${hover === i ? 'is-hover' : ''}`}
            style={{ '--wr-h': Math.min(1, s.words / CAP) } as CSSProperties}
            onPointerEnter={() => setHover(i)}
          />
        ))}
        {!shown.length && <span className="wr-rhythm__empty">Your sentences will appear here as bars.</span>}
      </div>
      <p className="wr-rhythm__note">
        {h && hover !== null ? (
          <>
            <strong>
              Sentence {offset + hover + 1} · {h.words} words
            </strong>{' '}
            “{h.text.length > 70 ? `${h.text.slice(0, 70)}…` : h.text}”
          </>
        ) : (
          verdict
        )}
      </p>
    </section>
  )
}
