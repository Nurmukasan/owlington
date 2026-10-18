import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PixelSprite } from '../../../components/PixelSprite'
import type { ProgressView, SectionStats } from '../../../learn/useProgress'
import { lectures } from './content'
import { FloatingCandle } from './Candle'
import { HUB_PATH, LEVEL_SHORT, SECTION, bookStyle, pct, roman, shortDate } from './library'
import { SectionHeader } from './SectionHeader'
import { useReveal } from './hooks'
import { CANDLE_SPRITE, FOIL_STAR_SPRITE } from './sprites'

const SPINE_TITLES: Record<string, string> = {
  'skim-scan': 'Skim & Scan',
  tfng: 'True or False?',
  ynng: 'The Writer’s View',
  headings: 'Headings',
  completion: 'Fill the Gap',
  mcq: 'Multiple Choice',
  paraphrase: 'Paraphrase',
  timing: 'Sixty Minutes',
}

export function LectureStacks({ stats, progress }: { stats: SectionStats; progress: ProgressView }) {
  const [ref, inView] = useReveal<HTMLDivElement>()
  const recommended = stats.nextLecture?.id ?? lectures[0]?.id
  const [activeId, setActiveId] = useState(recommended)
  const active = lectures.find((l) => l.id === activeId) ?? lectures[0]
  const activeIndex = lectures.indexOf(active)
  const activeProgress = progress.lecture(SECTION, active.id)
  const activeWatched = activeProgress?.watched ?? 0

  const note =
    stats.lecturesCompleted === 0
      ? 'Eight volumes, one for every Reading skill. Pull one off the shelf — start with Volume I.'
      : stats.lecturesCompleted === stats.lecturesTotal
        ? 'Every volume finished. A gold star on every spine! Revisit any book before test day.'
        : `${stats.lecturesCompleted} of ${stats.lecturesTotal} volumes finished. Gold stars mark the books you’ve closed.`

  return (
    <section className="rd-section rd-stacks" id="rd-stacks" aria-labelledby="rd-stacks-title">
      <SectionHeader id="rd-stacks-title" plate={`VOLUMES I–${roman(lectures.length)}`} title="The Lecture Stacks" note={note} />

      <div ref={ref} className={`rd-stacks__layout ${inView ? 'is-in' : ''}`}>
        <div className="rd-bookcase-main">
          <div className="rd-bookcase-main__crown" aria-hidden="true" />
          <FloatingCandle x="6%" y="-18px" size={0.75} delay={1.2} className="rd-fcandle--shelf" />
          <ul className="rd-shelf" onMouseLeave={() => setActiveId(recommended)}>
            {lectures.map((lecture, i) => {
              const style = bookStyle(i)
              const p = progress.lecture(SECTION, lecture.id)
              const watched = p?.watched ?? 0
              const done = Boolean(p?.completedAt)
              const isNext = lecture.id === recommended && !done
              const status = done ? 'finished' : watched > 0 ? `${pct(watched)} read` : 'not started'
              return (
                <li
                  key={lecture.id}
                  className="rd-shelf__slot"
                  style={{ '--rd-i': i } as CSSProperties}
                >
                  <Link
                    to={`${HUB_PATH}/lecture/${lecture.id}`}
                    className={`rd-book rd-book--${style.pattern} ${done ? 'is-done' : ''} ${isNext ? 'is-next' : ''} ${lecture.id === activeId ? 'is-active' : ''}`}
                    style={
                      {
                        '--rd-cloth': style.cloth,
                        '--rd-edge': style.edge,
                        '--rd-foil': style.foil,
                        '--rd-h': style.height,
                        '--rd-w': `${style.width}px`,
                        '--rd-watched': watched,
                      } as CSSProperties
                    }
                    aria-label={`Volume ${i + 1}: ${lecture.title}. ${lecture.level}, ${lecture.minutes} minutes, ${status}.`}
                    onMouseEnter={() => setActiveId(lecture.id)}
                    onFocus={() => setActiveId(lecture.id)}
                  >
                    <span className="rd-book__body" aria-hidden="true">
                      <span className="rd-book__spine">
                        <span className="rd-book__cap" />
                        <span className="rd-book__vol">{roman(i + 1)}</span>
                        <span className="rd-book__title">{SPINE_TITLES[lecture.id] ?? lecture.title}</span>
                        <span className="rd-book__notches">
                          {lecture.chapters.map((c) => (
                            <i key={c.title} />
                          ))}
                        </span>
                        <span className="rd-book__level">{LEVEL_SHORT[lecture.level]}</span>
                        <span className="rd-book__foot" />
                        {done && (
                          <span className="rd-book__star">
                            <PixelSprite sprite={FOIL_STAR_SPRITE} scale={2} />
                          </span>
                        )}
                        <span className="rd-book__shine" />
                      </span>
                      <span className="rd-book__cover">
                        <span className="rd-book__cover-title">{lecture.title}</span>
                      </span>
                      {watched > 0 && <span className="rd-book__ribbon" />}
                    </span>
                    {isNext && (
                      <span className="rd-book__next" aria-hidden="true">
                        {watched > 0 ? 'RESUME' : 'NEXT'}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
            <li className="rd-shelf__slot rd-shelf__slot--deco" aria-hidden="true">
              <span className="rd-shelf__stack">
                <i />
                <i />
                <i />
              </span>
              <span className="rd-shelf__stub">
                <PixelSprite sprite={CANDLE_SPRITE} scale={3} />
              </span>
            </li>
          </ul>
          <div className="rd-bookcase-main__base" aria-hidden="true" />
        </div>

        <aside className="rd-slip" aria-label="Catalogue slip for the selected volume" style={{ '--rd-cloth': bookStyle(activeIndex).cloth } as CSSProperties}>
          <div className="rd-slip__inner" key={active.id}>
            <p className="rd-slip__eyebrow">
              <span>CATALOGUE SLIP</span>
              <span>VOL. {roman(activeIndex + 1)}</span>
            </p>
            <h3 className="rd-slip__title">{active.title}</h3>
            <p className="rd-slip__meta">
              <span>{active.level}</span>
              <span>{active.minutes} min</span>
              <span>{active.chapters.length} chapters</span>
            </p>
            <p className="rd-slip__summary">{active.summary}</p>
            <ol className="rd-slip__chapters">
              {active.chapters.map((c, ci) => (
                <li key={c.title}>
                  <span>{roman(ci + 1)}.</span> {c.title}
                </li>
              ))}
            </ol>
            <div className="rd-slip__progress">
              <span className="rd-slip__bar" aria-hidden="true">
                <span style={{ width: pct(activeWatched) }} />
              </span>
              <span className="rd-slip__status">
                {activeProgress?.completedAt
                  ? `Finished ${shortDate(activeProgress.completedAt)}`
                  : activeWatched > 0
                    ? `${pct(activeWatched)} read`
                    : 'Not opened yet'}
              </span>
            </div>
            <Link to={`${HUB_PATH}/lecture/${active.id}`} className="rd-btn rd-btn--gold rd-slip__cta">
              {activeProgress?.completedAt ? 'Read it again' : activeWatched > 0 ? 'Continue reading' : 'Open the book'}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
