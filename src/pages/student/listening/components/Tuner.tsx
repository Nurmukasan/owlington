import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Attempt } from '../../../../learn/progress'
import { sfx } from '../../../../learn/sfx'
import type { PracticeInfo } from '../../../../learn/types'
import { crackle } from '../hooks'
import { DIAL_MAX, DIAL_MIN, formatFreq, stationFor } from '../stations'
import { SignalBars } from './SignalBars'

const pct = (freq: number) => ((freq - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)) * 100
/** Position on the glass: the scale spans 4%…96% of it. */
const onGlass = (freq: number) => `${(4 + pct(freq) * 0.92).toFixed(2)}%`
const accuracyOf = (a?: Attempt) => (a && a.total ? a.score / a.total : null)

const MAJOR = [88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108]
const TICKS = Array.from({ length: (DIAL_MAX - DIAL_MIN) * 2 + 1 }, (_, i) => DIAL_MIN + i / 2)

interface TunerProps {
  sets: PracticeInfo[]
  best: Record<string, Attempt>
  attempts: Attempt[]
  initial: string
}

/** Practice sets as stations on an FM dial: a radio group of presets, a sliding needle and the station card. */
export function Tuner({ sets, best, attempts, initial }: TunerProps) {
  const [selected, setSelected] = useState(initial)
  const [tuning, setTuning] = useState(false)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(0, sets.findIndex((s) => s.id === selected))
  const set = sets[index]
  const station = stationFor(set.id, index)
  const top = best[set.id]
  const topAccuracy = accuracyOf(top)
  const history = attempts.filter((a) => a.practiceId === set.id)

  useEffect(() => {
    if (!tuning) return
    const t = window.setTimeout(() => setTuning(false), 620)
    return () => window.clearTimeout(t)
  }, [tuning])

  const choose = (i: number, focus = false) => {
    const next = sets[(i + sets.length) % sets.length]
    if (focus) buttons.current[(i + sets.length) % sets.length]?.focus()
    if (next.id === selected) return
    setSelected(next.id)
    setTuning(true)
    crackle()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (e.key in keys) {
      e.preventDefault()
      choose(index + keys[e.key], true)
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      choose(e.key === 'Home' ? 0 : sets.length - 1, true)
    }
  }

  return (
    <div className="ls-tuner">
      <div className={`ls-radio ${tuning ? 'is-tuning' : ''}`}>
        <div className="ls-radio__plate">
          <span className="ls-radio__brand">OWL FM</span>
          <span className="ls-radio__model">MIDNIGHT RECEIVER · MODEL 88</span>
          <span className="ls-radio__lamp" aria-hidden="true" />
        </div>

        <div className="ls-band" aria-hidden="true">
          <div className="ls-band__glass">
            <span className="ls-band__unit">MHz</span>
            <span className="ls-band__marquee">
              <span key={set.id}>
                NOW TUNED · {formatFreq(station.freq)} FM · {set.title.toUpperCase()} · {set.questionCount} QUESTIONS · {set.kinds.join(' + ').toUpperCase()} ·
              </span>
            </span>
            <svg className="ls-band__ticks" viewBox={`0 0 ${(DIAL_MAX - DIAL_MIN) * 10} 40`} preserveAspectRatio="none">
              {TICKS.map((f) => {
                const x = (f - DIAL_MIN) * 10
                const major = Number.isInteger(f) && f % 2 === 0
                const mid = Number.isInteger(f)
                return (
                  <line
                    key={f}
                    x1={x}
                    x2={x}
                    y1={40}
                    y2={major ? 12 : mid ? 22 : 30}
                    vectorEffect="non-scaling-stroke"
                    className={major ? 'is-major' : ''}
                  />
                )
              })}
            </svg>
            {MAJOR.map((f) => (
              <span key={f} className={`ls-band__num ${f % 4 === 0 ? '' : 'is-minor'}`} style={{ left: onGlass(f) }}>
                {f}
              </span>
            ))}
            {sets.map((s, i) => {
              const st = stationFor(s.id, i)
              return (
                <span key={s.id} className={`ls-band__station ${s.id === selected ? 'is-current' : ''}`} style={{ left: onGlass(st.freq) }}>
                  {st.part.replace('PART ', 'P')}
                </span>
              )
            })}
            <span className="ls-band__needle-track" style={{ transform: `translateX(${pct(station.freq)}%)` }}>
              <span className="ls-band__needle" />
            </span>
            <span className="ls-band__static" />
          </div>
        </div>

        <div className="ls-radio__controls">
          <div className="ls-presets" role="radiogroup" aria-label="Practice broadcasts" onKeyDown={onKeyDown}>
            {sets.map((s, i) => {
              const st = stationFor(s.id, i)
              const acc = accuracyOf(best[s.id])
              const checked = s.id === selected
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    buttons.current[i] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  className={`ls-preset ${checked ? 'is-on' : ''}`}
                  onClick={() => {
                    sfx.click()
                    choose(i)
                  }}
                  aria-label={`${formatFreq(st.freq)} FM, ${s.title}${acc === null ? ', not attempted' : `, best ${Math.round(acc * 100)}%`}`}
                >
                  <span className="ls-preset__freq">{formatFreq(st.freq)}</span>
                  <span className="ls-preset__part">{st.part}</span>
                  <SignalBars accuracy={acc} />
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="ls-knob"
            onClick={() => {
              sfx.click()
              choose(index + 1)
            }}
            aria-label="Turn the dial to the next broadcast"
            style={{ transform: `rotate(${-110 + index * (220 / Math.max(1, sets.length - 1))}deg)` }}
          >
            <span className="ls-knob__grip" aria-hidden="true" />
            <span className="ls-knob__mark" aria-hidden="true" />
          </button>
        </div>
      </div>

      <article key={set.id} className="ls-station" aria-live="polite">
        <header className="ls-station__head">
          <p className="ls-station__freq">
            <span>{formatFreq(station.freq)}</span>
            <small>FM</small>
          </p>
          <p className="ls-station__tags">
            <span className="ls-chip ls-chip--teal">{station.part}</span>
            <span className="ls-chip">{station.callsign}</span>
            <span className="ls-chip">{set.level}</span>
          </p>
        </header>
        <h3 className="ls-station__title">{set.title.replace(/^Part \d · /, '')}</h3>
        <p className="ls-station__summary">{set.summary}</p>
        <dl className="ls-station__facts">
          <div>
            <dt>Time</dt>
            <dd>~{set.minutes} min</dd>
          </div>
          <div>
            <dt>Questions</dt>
            <dd>{set.questionCount}</dd>
          </div>
          <div>
            <dt>Tasks</dt>
            <dd>{set.kinds.join(' · ')}</dd>
          </div>
        </dl>
        <div className="ls-station__signal">
          <SignalBars accuracy={topAccuracy} className="ls-bars--big" />
          {top ? (
            <p>
              <strong>
                Best {top.score}/{top.total}
              </strong>{' '}
              · {history.length} {history.length === 1 ? 'broadcast' : 'broadcasts'} · last{' '}
              {new Date(history[0].at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </p>
          ) : (
            <p>
              <strong>No signal yet.</strong> Tune in to set your first score.
            </p>
          )}
        </div>
        <Link to={`/student/listening/practice/${set.id}`} className="ls-btn ls-btn--teal ls-station__go" onClick={() => sfx.click()}>
          <span aria-hidden="true">▶</span> {top ? 'Tune in again' : 'Tune in'}
          <span className="visually-hidden">: {set.title}</span>
        </Link>
      </article>
    </div>
  )
}
