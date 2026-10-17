import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type Ref,
} from 'react'
import { pixelConfetti } from '../fx'
import { XP_RULES } from '../progress'
import { sfx } from '../sfx'
import type { Lecture, LectureVideo, SectionId } from '../types'
import { useProgress } from '../useProgress'
import { formatClock } from '../useTimer'
import { TalkingOwl } from './TalkingOwl'

export interface LecturePlayerHandle {
  play: () => void
  pause: () => void
  /** Jump to the first slide of a chapter (notes mode only). */
  seekToChapter: (chapter: number) => void
}

interface LecturePlayerProps {
  section: SectionId
  lecture: Lecture
  className?: string
  ref?: Ref<LecturePlayerHandle>
  /** Notes mode: called with the current chapter (-1 = title card, chapters.length = the end card). */
  onChapterChange?: (chapter: number) => void
  /** Called once, the moment the lecture becomes complete for the first time. */
  onComplete?: () => void
}

/**
 * Plays a lecture and tracks how much of it the student has seen.
 *
 * - A real video (`lecture.video`) plays as soon as a teacher uploads one.
 * - Until then it shows an animated "notes preview": the owl presents each key
 *   point of every chapter like slides in a video, with a timeline and resume.
 *
 * Style hooks: `.lecture-player` and the `--lp-*` custom properties in learn.css.
 */
export function LecturePlayer(props: LecturePlayerProps) {
  const video = props.lecture.video
  if (video?.kind === 'file') return <FileVideo {...props} video={video} />
  if (video?.kind === 'youtube') return <YoutubeVideo {...props} video={video} />
  return <NotesPlayer {...props} />
}

function useCelebrate(onComplete?: () => void) {
  return (target: Element | null) => {
    sfx.complete()
    pixelConfetti(target ?? undefined, { count: 70 })
    onComplete?.()
  }
}

// ------------------------------------------------------------------ notes ---

interface Slide {
  kind: 'title' | 'point' | 'end'
  chapter: number
  chapterTitle: string
  text: string
}

interface Position {
  index: number
  /** Seconds into the current slide (already scaled by playback speed). */
  t: number
}

const SPEEDS = [1, 1.5, 2]
const words = (s: string) => s.trim().split(/\s+/).length
const slideSeconds = (s: Slide) => (s.kind === 'point' ? Math.min(14, Math.max(5, 3 + words(s.text) * 0.33)) : 4)
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function buildSlides(lecture: Lecture): Slide[] {
  const slides: Slide[] = [{ kind: 'title', chapter: -1, chapterTitle: '', text: lecture.title }]
  lecture.chapters.forEach((ch, ci) =>
    ch.points.forEach((point) => slides.push({ kind: 'point', chapter: ci, chapterTitle: ch.title, text: point })),
  )
  slides.push({ kind: 'end', chapter: lecture.chapters.length, chapterTitle: '', text: 'Lecture complete' })
  return slides
}

function NotesPlayer({ section, lecture, className = '', ref, onChapterChange, onComplete }: LecturePlayerProps) {
  const progress = useProgress()
  const { updateLecture } = progress
  const [saved] = useState(() => progress.lecture(section, lecture.id))
  const slides = useMemo(() => buildSlides(lecture), [lecture])
  const durations = useMemo(() => slides.map(slideSeconds), [slides])
  const starts = useMemo(() => durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0)), [durations])
  const total = starts[starts.length - 1] + durations[durations.length - 1]
  const last = slides.length - 1

  const [pos, setPos] = useState<Position>(() => ({
    index: saved && !saved.completedAt ? Math.min(Math.max(0, Math.round(saved.position)), last) : 0,
    t: 0,
  }))
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [justCompleted, setJustCompleted] = useState(false)
  const [reduced] = useState(prefersReducedMotion)

  const posRef = useRef(pos)
  const maxWatched = useRef(saved?.watched ?? 0)
  const [seen, setSeen] = useState(saved?.watched ?? 0)
  const lastSave = useRef(0)
  const screenRef = useRef<HTMLDivElement>(null)
  const celebrate = useCelebrate(onComplete)

  const save = (p: Position, force: boolean) => {
    const fraction = p.index === last ? 1 : (starts[p.index] + Math.min(p.t, durations[p.index])) / total
    if (fraction > maxWatched.current) {
      maxWatched.current = fraction
      setSeen(fraction)
    }
    const now = performance.now()
    if (!force && now - lastSave.current < 3000) return
    lastSave.current = now
    const result = updateLecture(section, lecture.id, { watched: maxWatched.current, position: p.index })
    if (result.justCompleted) {
      setJustCompleted(true)
      celebrate(screenRef.current)
    }
  }

  const go = (next: Position) => {
    const prev = posRef.current
    posRef.current = next
    setPos(next)
    save(next, next.index !== prev.index)
    if (slides[next.index].chapter !== slides[prev.index].chapter) onChapterChange?.(slides[next.index].chapter)
  }

  // Effects below always call the latest versions of these.
  const latest = useRef({ go, save, onChapterChange })
  useEffect(() => {
    latest.current = { go, save, onChapterChange }
  })

  // Report the starting chapter.
  useEffect(() => {
    latest.current.onChapterChange?.(slides[posRef.current.index].chapter)
  }, [slides])

  // Playback clock.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let then = performance.now()
    const tick = (now: number) => {
      const dt = ((now - then) / 1000) * speed
      then = now
      let { index, t } = posRef.current
      t += dt
      while (t >= durations[index] && index < last) {
        t -= durations[index]
        index++
      }
      const ended = index === last && t >= durations[index]
      if (ended) t = durations[index]
      latest.current.go({ index, t })
      if (ended) setPlaying(false)
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, speed, durations, last])

  // Save when pausing.
  useEffect(() => {
    if (!playing) latest.current.save(posRef.current, true)
  }, [playing])

  const togglePlay = () => {
    sfx.click()
    if (!playing && posRef.current.index === last) go({ index: 0, t: 0 })
    setPlaying((p) => !p)
  }
  const step = (delta: number) => {
    sfx.page()
    go({ index: Math.min(last, Math.max(0, posRef.current.index + delta)), t: 0 })
  }
  const seekToTime = (time: number) => {
    const clamped = Math.min(total, Math.max(0, time))
    let index = 0
    while (index < last && starts[index + 1] <= clamped) index++
    go({ index, t: clamped - starts[index] })
  }

  useImperativeHandle(ref, () => ({
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    seekToChapter: (chapter: number) => {
      const index = slides.findIndex((s) => s.chapter === chapter)
      if (index >= 0) go({ index, t: 0 })
    },
  }))

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLButtonElement && (e.key === ' ' || e.key === 'Enter')) return
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault()
      togglePlay()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    }
  }

  const onTimelinePointer = (e: PointerEvent<HTMLDivElement>) => {
    if (e.type === 'pointermove' && e.buttons !== 1) return
    const rect = e.currentTarget.getBoundingClientRect()
    seekToTime(((e.clientX - rect.left) / rect.width) * total)
  }

  const slide = slides[pos.index]
  const duration = durations[pos.index]
  const typingShare = Math.min(1, pos.t / (duration * 0.55))
  // Type the point out while playing; show it whole when paused (so it can be read) or with reduced motion.
  const shownText = reduced || !playing ? slide.text : slide.text.slice(0, Math.ceil(slide.text.length * typingShare))
  const isTyping = playing && slide.kind === 'point' && shownText.length < slide.text.length
  const elapsed = starts[pos.index] + Math.min(pos.t, duration)
  const pointSlides = slides.filter((s) => s.kind === 'point').length
  const pointNumber = slides.slice(0, pos.index + 1).filter((s) => s.kind === 'point').length
  const chapterStarts = lecture.chapters.map((_, ci) => starts[slides.findIndex((s) => s.chapter === ci)] / total)

  return (
    <div
      className={`lecture-player ${playing ? 'is-playing' : 'is-paused'} ${className}`}
      onKeyDown={onKeyDown}
    >
      <div
        ref={screenRef}
        className={`lp-screen lp-screen--${slide.kind}`}
        onClick={togglePlay}
        role="button"
        tabIndex={0}
        aria-label={playing ? 'Pause lecture' : 'Play lecture'}
      >
        <div className="lp-screen__stars" aria-hidden="true" />
        <span className="lp-chip" aria-hidden="true">
          <span className="lp-chip__dot" /> NOTES PREVIEW · VIDEO COMING SOON
        </span>

        <div key={pos.index} className="lp-slide" aria-hidden="true">
          {slide.kind === 'title' && (
            <>
              <p className="lp-slide__eyebrow">LECTURE</p>
              <p className="lp-slide__title">{lecture.title}</p>
              <p className="lp-slide__meta">
                {lecture.minutes} min video · {lecture.level} · {lecture.chapters.length} chapters
              </p>
            </>
          )}
          {slide.kind === 'point' && (
            <>
              <p className="lp-slide__eyebrow">
                CHAPTER {slide.chapter + 1} · {slide.chapterTitle.toUpperCase()}
              </p>
              <p className="lp-slide__text">
                {shownText}
                {isTyping && <span className="lp-caret" />}
              </p>
            </>
          )}
          {slide.kind === 'end' && (
            <>
              <p className="lp-slide__eyebrow">{justCompleted ? `LECTURE COMPLETE · +${XP_RULES.lectureComplete} XP` : 'THE END'}</p>
              <p className="lp-slide__title">Hoo-ray, you made it!</p>
              <ul className="lp-slide__recap">
                {lecture.chapters.map((ch) => (
                  <li key={ch.title}>{ch.title}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="lp-owl" aria-hidden="true">
          <TalkingOwl talking={isTyping} happy={slide.kind === 'end'} scale={3} />
        </div>
        {slide.kind === 'point' && (
          <span className="lp-counter" aria-hidden="true">
            {pointNumber}/{pointSlides}
          </span>
        )}
        {!playing && (
          <span className="lp-bigplay" aria-hidden="true">
            {pos.index === last ? '↻' : '▶'}
          </span>
        )}
        <p className="visually-hidden" aria-live="polite">
          {slide.kind === 'point' ? `Chapter ${slide.chapter + 1}, ${slide.chapterTitle}: ${slide.text}` : slide.text}
        </p>
      </div>

      <div className="lp-controls">
        <button type="button" className="lp-btn lp-btn--play" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" className="lp-btn" onClick={() => step(-1)} aria-label="Previous slide" disabled={pos.index === 0}>
          ◀◀
        </button>
        <button type="button" className="lp-btn" onClick={() => step(1)} aria-label="Next slide" disabled={pos.index === last}>
          ▶▶
        </button>
        <span className="lp-time">
          {formatClock(elapsed / speed)} / {formatClock(total / speed)}
        </span>
        <div
          className="lp-timeline"
          role="slider"
          tabIndex={0}
          aria-label="Lecture timeline"
          aria-valuemin={0}
          aria-valuemax={Math.round(total)}
          aria-valuenow={Math.round(elapsed)}
          aria-valuetext={`${formatClock(elapsed / speed)} of ${formatClock(total / speed)}`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            onTimelinePointer(e)
          }}
          onPointerMove={onTimelinePointer}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault()
              e.stopPropagation()
              seekToTime(elapsed + (e.key === 'ArrowRight' ? 5 : -5))
            }
          }}
        >
          <div className="lp-timeline__seen" style={{ width: `${seen * 100}%` }} />
          <div className="lp-timeline__fill" style={{ width: `${(elapsed / total) * 100}%` }} />
          {chapterStarts.map((x, i) => (
            <span key={i} className="lp-timeline__mark" style={{ left: `${x * 100}%` }} title={lecture.chapters[i].title} />
          ))}
          <span className="lp-timeline__head" style={{ left: `${(elapsed / total) * 100}%` }} />
        </div>
        <button
          type="button"
          className="lp-btn lp-btn--speed"
          onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
          aria-label={`Playback speed ${speed}×`}
        >
          {speed}×
        </button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ video ---

function FileVideo({
  section,
  lecture,
  className = '',
  onComplete,
  video,
}: LecturePlayerProps & { video: Extract<LectureVideo, { kind: 'file' }> }) {
  const progress = useProgress()
  const { updateLecture } = progress
  const [saved] = useState(() => progress.lecture(section, lecture.id))
  const ref = useRef<HTMLVideoElement>(null)
  const maxWatched = useRef(saved?.watched ?? 0)
  const lastSave = useRef(0)
  const celebrate = useCelebrate(onComplete)

  const track = (force: boolean) => {
    const v = ref.current
    if (!v || !v.duration) return
    maxWatched.current = Math.max(maxWatched.current, v.ended ? 1 : v.currentTime / v.duration)
    if (!force && performance.now() - lastSave.current < 4000) return
    lastSave.current = performance.now()
    if (updateLecture(section, lecture.id, { watched: maxWatched.current, position: v.currentTime }).justCompleted) {
      celebrate(v)
    }
  }

  return (
    <div className={`lecture-player lecture-player--video ${className}`}>
      <video
        ref={ref}
        className="lp-video"
        src={video.src}
        poster={video.poster}
        controls
        preload="metadata"
        onLoadedMetadata={(e) => {
          if (saved && !saved.completedAt) e.currentTarget.currentTime = saved.position
        }}
        onTimeUpdate={() => track(false)}
        onPause={() => track(true)}
        onEnded={() => track(true)}
      />
    </div>
  )
}

function YoutubeVideo({
  section,
  lecture,
  className = '',
  onComplete,
  video,
}: LecturePlayerProps & { video: Extract<LectureVideo, { kind: 'youtube' }> }) {
  const progress = useProgress()
  const done = Boolean(progress.lecture(section, lecture.id)?.completedAt)
  const celebrate = useCelebrate(onComplete)
  const frameRef = useRef<HTMLIFrameElement>(null)

  return (
    <div className={`lecture-player lecture-player--video ${className}`}>
      <iframe
        ref={frameRef}
        className="lp-video"
        src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
        title={lecture.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="lp-controls">
        <button
          type="button"
          className="lp-btn lp-btn--mark"
          disabled={done}
          onClick={() => {
            if (progress.updateLecture(section, lecture.id, { watched: 1, position: 0 }).justCompleted) {
              celebrate(frameRef.current)
            }
          }}
        >
          {done ? '✓ Watched' : 'Mark as watched'}
        </button>
      </div>
    </div>
  )
}
