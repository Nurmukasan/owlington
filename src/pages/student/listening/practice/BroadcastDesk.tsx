import { useMemo, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { sfx } from '../../../../learn/sfx'
import { formatClock } from '../../../../learn/useTimer'
import { DjOwl } from '../components/DjOwl'
import { isPause, paperRange, type PracticeSet, type SpokenLine } from '../practice-data'
import {
  ACCENT_ORDER,
  accentName,
  accentOf,
  estimateSeconds,
  speakOnce,
  type Broadcast,
  type BroadcastSnapshot,
  type Cast,
  type VoiceStatus,
} from '../speech'
import { RATES, rangeOf, rangeText, speakerColor, type AudioSource, type Mode } from './script'
import { Waveform } from './Waveform'

interface DeskProps {
  bc: Broadcast
  snap: BroadcastSnapshot
  set: PracticeSet
  freq: string
  part: string
  mode: Mode
  voices: SpeechSynthesisVoice[]
  voiceStatus: VoiceStatus
  cast: Cast
  onCast: (speaker: string, voiceURI: string) => void
  rate: number
  onRate: (rate: number) => void
  audio: AudioSource
  onAudio: (audio: AudioSource) => void
  captions: boolean
  onCaptions: (on: boolean) => void
  elapsed: number
  minutes: number
  onGoTo: (n: number) => void
}

const STATUS: Record<BroadcastSnapshot['phase'], string> = {
  idle: 'STANDBY',
  reading: 'READING TIME',
  playing: 'ON AIR',
  paused: 'PAUSED',
  ended: 'SIGNED OFF',
}

/** The live desk: the visualiser screen, captions, the tape scrubber and the transport. */
export function BroadcastDesk(props: DeskProps) {
  const { bc, snap, set, freq, part, mode, voices, voiceStatus, cast, rate, audio, captions, elapsed, minutes } = props
  const item = set.script[snap.index]
  const line = item && !isPause(item) ? item : null
  const speaker = line ? set.speakers.find((s) => s.id === line.s) : undefined
  const started = snap.phase !== 'idle'
  const running = snap.phase === 'playing' || snap.phase === 'reading'
  const exam = mode === 'exam'
  const locked = exam && started
  const pauseItem = item && isPause(item) ? item : null
  const waiting = Boolean(pauseItem) && (snap.phase === 'reading' || snap.phase === 'paused')
  const waitRange = pauseItem ? rangeOf(pauseItem.label) : null
  const transcript = snap.driver === 'text'
  const recorded = Boolean(set.audio)
  const showCaptions = transcript || (!exam && captions)
  const voicesReady = voiceStatus === 'ready'
  const voice = line && !transcript ? voices.find((v) => v.voiceURI === cast[line.s]?.voiceURI) : undefined

  const weights = useMemo(() => set.script.map((it) => (isPause(it) ? it.wait * 0.4 : estimateSeconds([it]))), [set])
  const lineCount = useMemo(() => set.script.filter((it) => !isPause(it)).length, [set])
  const lineNo = useMemo(() => set.script.slice(0, snap.index + 1).filter((it) => !isPause(it)).length, [set, snap.index])
  const firstLines = useMemo(() => {
    const map: Record<string, SpokenLine> = {}
    for (const it of set.script) if (!isPause(it) && !map[it.s]) map[it.s] = it
    return map
  }, [set])

  const fillOf = (i: number) => {
    if (i < snap.index || snap.phase === 'ended') return 1
    if (i > snap.index) return 0
    const it = set.script[i]
    if (isPause(it)) return snap.waitTotal ? 1 - snap.waitLeft / snap.waitTotal : 0
    const words = it.t.trim().split(/\s+/).length
    return words ? snap.word / words : 0
  }

  // ---------------------------------------------------------- controls
  const start = () => {
    sfx.click()
    bc.play()
  }
  const toggle = () => {
    sfx.click()
    bc.toggle()
  }
  const seek = (i: number) => {
    if (exam) return
    sfx.click()
    bc.seek(i)
  }
  const back = () => {
    // Restart the current line if it is under way, otherwise step back a line.
    seek(snap.word > 2 || (waiting && snap.waitLeft < (pauseItem?.wait ?? 0) - 2) ? snap.index : snap.index - 1)
  }
  const replay = () => {
    sfx.click()
    bc.seek(snap.index)
    bc.play()
  }
  const onTapeClick = (e: MouseEvent<HTMLDivElement>) => {
    const seg = (e.target as HTMLElement).closest<HTMLElement>('[data-i]')
    if (seg) seek(Number(seg.dataset.i))
  }
  const onTapeKey = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
    if (e.key in moves) {
      e.preventDefault()
      seek(snap.index + moves[e.key])
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      seek(e.key === 'Home' ? 0 : set.script.length - 1)
    } else if (e.key === ' ' || e.key === 'k') {
      e.preventDefault()
      toggle()
    }
  }

  const sample = (id: string) => {
    const first = firstLines[id]
    if (!first) return
    sfx.click()
    speakOnce(first, cast[id], voices, rate)
  }

  const grouped = useMemo(() => {
    const groups = new Map<string, SpeechSynthesisVoice[]>()
    for (const v of voices) {
      const a = accentOf(v)
      groups.set(a, [...(groups.get(a) ?? []), v])
    }
    return [...groups.entries()].sort((a, b) => {
      const ai = ACCENT_ORDER.indexOf(a[0])
      const bi = ACCENT_ORDER.indexOf(b[0])
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi)
    })
  }, [voices])

  const words = line ? line.t.trim().split(/\s+/) : []

  return (
    <section
      className={`ls-desk is-${snap.phase} ${exam ? 'is-exam' : 'is-practice'} ${transcript ? 'is-transcript' : ''}`}
      aria-label="Broadcast console"
    >
      <span className="ls-desk__owl" aria-hidden="true">
        <DjOwl happy={snap.phase === 'ended'} look={running ? 1 : 0} scale={3} className={running ? 'is-grooving' : ''} />
      </span>

      <header className="ls-desk__plate">
        <span className="ls-desk__brand">Owl FM</span>
        <span className="ls-desk__model">
          {freq} FM · {part}
        </span>
        <span className={`ls-onair-lamp ${running ? 'is-on' : ''}`} aria-hidden="true">
          ON AIR
        </span>
      </header>

      <p className="visually-hidden" aria-live="polite">
        {waiting && pauseItem
          ? `Reading time. Look at ${pauseItem.label}.`
          : snap.phase === 'ended'
            ? 'The broadcast has ended. Check your answers, then submit.'
            : ''}
      </p>
      <div className="ls-crt">
        <Waveform bc={bc} className="ls-crt__wave" />
        <div className="ls-crt__hud" aria-hidden="true">
          <span className="ls-crt__status">
            <i /> {STATUS[snap.phase]}
          </span>
          <span className="ls-crt__count">
            LINE {String(lineNo).padStart(2, '0')}/{String(lineCount).padStart(2, '0')}
          </span>
        </div>

        <p className="ls-crt__speaker">
          {line && speaker && started ? (
            <>
              <span className="ls-crt__dot" style={{ background: speakerColor(set, speaker.id) }} aria-hidden="true" />
              <span className="ls-crt__name">{speaker.name}</span>
              <span className="ls-crt__role">{speaker.role}</span>
              <span className="ls-crt__voice">
                {transcript
                  ? 'TRANSCRIPT'
                  : snap.driver === 'audio'
                    ? accentName(speaker.accents[0] ?? 'other').toUpperCase()
                    : voice
                      ? accentName(accentOf(voice)).toUpperCase()
                      : 'VOICE'}
              </span>
            </>
          ) : waiting && waitRange ? (
            <span className="ls-crt__role">Silence on air · reading time</span>
          ) : (
            <span className="ls-crt__role">{snap.phase === 'ended' ? 'Broadcast complete' : `${freq} FM · standing by`}</span>
          )}
        </p>

        {snap.phase === 'idle' && (
          <div className="ls-crt__cue">
            <button type="button" className="ls-bigplay" onClick={start}>
              <span className="ls-bigplay__icon" aria-hidden="true" />
              <span className="ls-bigplay__label">Start broadcast</span>
            </button>
            <p>{exam ? 'Exam mode · plays once, no pausing' : 'Practice mode · pause, rewind, replay'}</p>
          </div>
        )}

        {waiting && pauseItem && (
          <div className="ls-crt__reading" role="timer" aria-live="off">
            <svg viewBox="0 0 80 80" className="ls-crt__ring" aria-hidden="true">
              <circle cx="40" cy="40" r="34" className="ls-crt__ring-track" />
              <circle
                cx="40"
                cy="40"
                r="34"
                className="ls-crt__ring-value"
                pathLength={1}
                style={{ strokeDashoffset: 1 - (snap.waitTotal ? snap.waitLeft / snap.waitTotal : 0) } as CSSProperties}
              />
            </svg>
            <div className="ls-crt__reading-copy">
              <p className="ls-crt__kicker">READING TIME{snap.phase === 'paused' ? ' · PAUSED' : ''}</p>
              <p className="ls-crt__clock">{formatClock(Math.ceil(snap.waitLeft))}</p>
              <p className="ls-crt__task">Look at {pauseItem.label}</p>
              <div className="ls-crt__reading-actions">
                {waitRange && (
                  <button type="button" className="ls-btn ls-btn--small ls-btn--ghost" onClick={() => props.onGoTo(waitRange[0])}>
                    Go to Q{waitRange[0]}
                  </button>
                )}
                {!exam && (
                  <button
                    type="button"
                    className="ls-btn ls-btn--small ls-btn--ghost"
                    onClick={() => {
                      sfx.click()
                      bc.skipWait()
                    }}
                  >
                    Skip »
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {snap.phase === 'ended' && (
          <div className="ls-crt__cue ls-crt__cue--end">
            <p className="ls-crt__kicker">END OF BROADCAST</p>
            <p className="ls-crt__end">Check your answers, then submit.</p>
            {!exam && (
              <button type="button" className="ls-btn ls-btn--small ls-btn--ghost" onClick={start}>
                <span className="ls-icon-replay" aria-hidden="true" /> Play again
              </button>
            )}
          </div>
        )}
      </div>

      {showCaptions && (
        <div className={`ls-captions ${exam ? 'is-blind' : ''}`} aria-live="off">
          <span className="ls-captions__tag">{transcript ? 'TRANSCRIPT MODE' : 'CAPTIONS'}</span>
          {line && started && snap.phase !== 'ended' ? (
            <p className="ls-captions__line">
              <span className="ls-captions__who" style={{ color: speaker ? speakerColor(set, speaker.id) : undefined }}>
                {speaker?.name}:
              </span>{' '}
              {/* exam mode never puts unspoken words in the page, so nothing can be read ahead */}
              {(exam ? words.slice(0, snap.word) : words).map((w, i) => (
                <span key={i} className={i < snap.word ? 'is-said' : ''}>
                  {w}{' '}
                </span>
              ))}
            </p>
          ) : (
            <p className="ls-captions__idle">
              {waiting ? '· · · silence for reading time · · ·' : snap.phase === 'ended' ? '· · · end of transcript · · ·' : 'Words appear here as they are spoken.'}
            </p>
          )}
        </div>
      )}

      {/* tape scrubber */}
      <div className="ls-tape-row">
        <div
          className={`ls-tape ${exam ? 'is-locked' : ''}`}
          role={exam ? undefined : 'slider'}
          tabIndex={exam ? undefined : 0}
          aria-hidden={exam ? true : undefined}
          aria-label={exam ? undefined : 'Recording position'}
          aria-valuemin={exam ? undefined : 1}
          aria-valuemax={exam ? undefined : set.script.length}
          aria-valuenow={exam ? undefined : snap.index + 1}
          aria-valuetext={exam ? undefined : line && speaker ? `Line ${lineNo} of ${lineCount}, ${speaker.name}` : `Reading time, ${pauseItem?.label ?? ''}`}
          onClick={onTapeClick}
          onKeyDown={onTapeKey}
        >
          {set.script.map((it, i) => (
            <span
              key={i}
              data-i={i}
              className={`ls-tape__seg ${isPause(it) ? 'is-pause' : ''} ${i === snap.index && started ? 'is-now' : ''}`}
              style={{ flexGrow: weights[i], '--ls-fill': fillOf(i) } as CSSProperties}
              title={exam ? undefined : isPause(it) ? `Reading time: ${it.label}` : `${set.speakers.find((s) => s.id === it.s)?.name}: ${it.t.slice(0, 60)}…`}
            />
          ))}
        </div>
        <span className="ls-tape-row__time" aria-label={`Time on air ${formatClock(elapsed)}`}>
          {formatClock(elapsed)}
        </span>
      </div>

      {/* transport */}
      {exam ? (
        <div className="ls-transport ls-transport--exam">
          {snap.phase === 'paused' ? (
            <button type="button" className="ls-btn ls-btn--teal" onClick={start}>
              <span className="ls-icon-play" aria-hidden="true" /> Resume broadcast
            </button>
          ) : started ? (
            <p className="ls-transport__lock">
              <span className="ls-transport__lockicon" aria-hidden="true" />
              {snap.phase === 'ended' ? 'The broadcast has ended. In the exam you hear it once.' : 'Live: no pausing or replays in exam mode.'}
            </p>
          ) : (
            <button type="button" className="ls-btn ls-btn--teal" onClick={start}>
              <span className="ls-icon-play" aria-hidden="true" /> Start broadcast
            </button>
          )}
        </div>
      ) : (
        <div className="ls-transport" role="group" aria-label="Playback">
          <button type="button" className="ls-tbtn" onClick={back} disabled={!started} aria-label="Back to the start of this line">
            <span className="ls-tbtn__icon ls-tbtn__icon--prev" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`ls-tbtn ls-tbtn--main ${running ? 'is-on' : ''}`}
            onClick={snap.phase === 'idle' ? start : toggle}
            aria-label={running ? 'Pause' : snap.phase === 'ended' ? 'Play again from the start' : snap.phase === 'paused' ? 'Resume' : 'Play'}
          >
            <span className={`ls-tbtn__icon ${running ? 'ls-tbtn__icon--pause' : 'ls-tbtn__icon--play'}`} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="ls-tbtn"
            onClick={() => seek(snap.index + 1)}
            disabled={!started || snap.phase === 'ended'}
            aria-label="Skip to the next line"
          >
            <span className="ls-tbtn__icon ls-tbtn__icon--next" aria-hidden="true" />
          </button>
          <button type="button" className="ls-tbtn ls-tbtn--wide" onClick={replay} disabled={!started || !line} aria-label="Replay this line">
            <span className="ls-icon-replay" aria-hidden="true" /> LINE
          </button>
        </div>
      )}

      {/* settings */}
      <div className="ls-desk__settings">
        <div className="ls-desk__setting">
          <span className="ls-desk__label" id="ls-speed-label">
            SPEED
          </span>
          <div className="ls-segbtns" role="group" aria-labelledby="ls-speed-label">
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                className={r === rate ? 'is-on' : ''}
                aria-pressed={r === rate}
                disabled={locked}
                onClick={() => {
                  sfx.click()
                  props.onRate(r)
                }}
              >
                {r}×
              </button>
            ))}
          </div>
        </div>
        <div className="ls-desk__setting">
          <span className="ls-desk__label" id="ls-audio-label">
            AUDIO
          </span>
          <div className="ls-segbtns" role="group" aria-labelledby="ls-audio-label">
            <button
              type="button"
              className={audio === 'voices' && !transcript ? 'is-on' : ''}
              aria-pressed={audio === 'voices' && !transcript}
              disabled={locked || (!recorded && !voicesReady)}
              onClick={() => {
                sfx.click()
                props.onAudio('voices')
              }}
            >
              {recorded ? 'Recording' : 'Voices'}
            </button>
            <button
              type="button"
              className={transcript ? 'is-on' : ''}
              aria-pressed={transcript}
              disabled={locked}
              onClick={() => {
                sfx.click()
                props.onAudio('transcript')
              }}
            >
              Transcript
            </button>
          </div>
        </div>
        {!exam && !transcript && (
          <label className="ls-switch">
            <input type="checkbox" checked={captions} onChange={(e) => props.onCaptions(e.target.checked)} />
            <span className="ls-switch__track" aria-hidden="true" />
            Captions
          </label>
        )}
      </div>

      {!recorded && (voiceStatus === 'none' || voiceStatus === 'unsupported') && (
        <p className="ls-desk__note is-warn">
          <strong>No speech voices on this device</strong>, so lines appear word by word at speaking pace{exam ? ', once only' : ''}.
        </p>
      )}
      {!recorded && voiceStatus === 'loading' && <p className="ls-desk__note">Tuning in the voices…</p>}
      {snap.fellBack && (recorded || voicesReady) && (
        <p className="ls-desk__note is-warn">
          {recorded ? 'The recording could not be played' : 'The voice stopped responding'}, so the broadcast switched to transcript
          mode to keep the test going.
        </p>
      )}

      {!recorded && voicesReady && (
        <details className="ls-cast">
          <summary>
            <span>Cast &amp; voices</span>
            <small>
              {voices.length} English {voices.length === 1 ? 'voice' : 'voices'}
            </small>
          </summary>
          <ul className="ls-cast__list">
            {set.speakers.map((sp) => (
              <li key={sp.id} className="ls-cast__row">
                <span className="ls-cast__dot" style={{ background: speakerColor(set, sp.id) }} aria-hidden="true" />
                <label className="ls-cast__who" htmlFor={`ls-voice-${sp.id}`}>
                  {sp.name}
                  <small>{sp.role}</small>
                </label>
                <select
                  id={`ls-voice-${sp.id}`}
                  className="ls-select"
                  value={cast[sp.id]?.voiceURI ?? ''}
                  disabled={locked}
                  onChange={(e) => props.onCast(sp.id, e.target.value)}
                >
                  {grouped.map(([accent, list]) => (
                    <optgroup key={accent} label={accentName(accent)}>
                      {list.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button
                  type="button"
                  className="ls-cast__hear"
                  onClick={() => sample(sp.id)}
                  disabled={running}
                  aria-label={`Hear ${sp.name}'s voice`}
                  title={running ? 'Pause the broadcast to audition voices' : `Hear ${sp.name}`}
                >
                  <span className="ls-icon-play" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="ls-desk__foot">
        <span className={`ls-desk__mode ${exam ? 'is-exam' : ''}`}>
          <i aria-hidden="true" />
          {exam ? 'EXAM MODE' : 'PRACTICE MODE'}
        </span>
        <span>
          ~{minutes} min suggested · {rangeText(paperRange(set))}
        </span>
      </p>
    </section>
  )
}
