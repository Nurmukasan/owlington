import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { AchievementBadge, ProgressRing, XpBar } from '../../../learn/components/ProgressWidgets'
import { DAILY_GOALS } from '../../../learn/progress'
import { sfx } from '../../../learn/sfx'
import type { ProgressView, SectionStats } from '../../../learn/useProgress'
import { formatClock } from '../../../learn/useTimer'
import { AccuracyChart } from './AccuracyChart'
import { LibrarianOwl } from './LibrarianOwl'
import { BurningCandle } from './Candle'
import { practiceSets } from './content'
import { BAND7_ACCURACY, CELEBRATE_ACCURACY, HUB_PATH, accuracyOf, isToday, pct, practiceStep, shortDate, type NextStep } from './library'
import { SectionHeader } from './SectionHeader'
import { useCountUp, useReveal } from './hooks'

const READING_ACHIEVEMENTS = ['first-light', 'test-flight', 'sharp-eyes', 'bookworm']

const titleOf = (id: string) => practiceSets.find((p) => p.id === id)?.title ?? id

interface ReadingLogProps {
  readerName: string
  stats: SectionStats
  progress: ProgressView
  step: NextStep | undefined
}

export function ReadingLog({ readerName, stats, progress, step }: ReadingLogProps) {
  const [ref, inView] = useReveal<HTMLDivElement>()
  const xp = useCountUp(stats.xp, inView)
  const accuracy = useCountUp(stats.accuracy === null ? 0 : stats.accuracy * 100, inView)
  const { today, streak } = progress
  const chronological = [...stats.attempts].reverse()

  const readToday = Object.entries(progress.state.lectures).some(([key, p]) => key.startsWith('reading:') && isToday(p.updatedAt))
  const testedToday = stats.attempts.some((a) => isToday(a.at))
  const practice = step?.kind === 'practice' ? step : practiceStep(stats)
  const plan = [
    {
      done: readToday,
      text: 'Read a chapter from the stacks',
      to: stats.nextLecture ? `${HUB_PATH}/lecture/${stats.nextLecture.id}` : '#rd-stacks',
    },
    {
      done: testedToday,
      text: 'Borrow a practice test',
      to: practice ? `${HUB_PATH}/practice/${practice.practice.id}` : '#rd-catalogue',
    },
    { done: today.met, text: `Reach tonight’s goal of ${today.goal} XP`, to: '#rd-stacks' },
  ]
  const planDone = plan.filter((p) => p.done).length
  const achievements = progress.achievements.filter((a) => READING_ACHIEVEMENTS.includes(a.id))

  const note =
    stats.accuracy === null
      ? 'Every lecture and test you finish is written into this journal. The first entry is the hardest — and the best.'
      : stats.accuracy >= BAND7_ACCURACY
        ? `Averaging ${pct(stats.accuracy)} lately. That’s Band 7 territory — keep the candle burning!`
        : `Averaging ${pct(stats.accuracy)} over your recent tests. Review the misses and watch this line climb.`

  return (
    <section className="rd-section rd-log" id="rd-log" aria-labelledby="rd-log-title">
      <SectionHeader id="rd-log-title" plate="YOUR PROGRESS" title="The Reading Log" note={note} />

      <div ref={ref} className={`rd-journal ${inView ? 'is-in' : ''}`}>
        <span className="rd-journal__ribbon" aria-hidden="true" />
        <div className="rd-journal__page rd-journal__page--left">
          <AccuracyChart attempts={chronological} />

          <h3 className="rd-journal__h">Recent entries</h3>
          {stats.attempts.length ? (
            <ol className="rd-ledger">
              {stats.attempts.slice(0, 5).map((a, i) => (
                <li key={a.at} className="rd-ledger__row" style={{ '--rd-i': i } as CSSProperties}>
                  <span className="rd-ledger__date">{shortDate(a.at)}</span>
                  <Link className="rd-ledger__title" to={`${HUB_PATH}/practice/${a.practiceId}`}>
                    {titleOf(a.practiceId)}
                  </Link>
                  <span className="rd-ledger__score">
                    {a.score}/{a.total}
                  </span>
                  <span className={`rd-ledger__pct ${accuracyOf(a) >= CELEBRATE_ACCURACY ? 'is-good' : ''}`}>{pct(accuracyOf(a))}</span>
                  <span className="rd-ledger__time">{formatClock(a.durationSec)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rd-journal__empty">No entries yet — the ink is waiting.</p>
          )}

          <div className="rd-bookplate" aria-label={`Bookplate: ${readerName}, level ${progress.level.level} ${progress.level.title}`}>
            <div className="rd-bookplate__frame">
              <p className="rd-bookplate__ex" aria-hidden="true">
                EX LIBRIS
              </p>
              <LibrarianOwl scale={3} className="rd-bookplate__owl" />
              <p className="rd-bookplate__name">{readerName}</p>
              <p className="rd-bookplate__sub">
                Reader of the Moonlit Library · Lv {progress.level.level} {progress.level.title}
              </p>
            </div>
          </div>
        </div>

        <div className="rd-journal__page rd-journal__page--right">
          <XpBar level={progress.level} xp={progress.xp} className="rd-journal__xp" />

          <div className="rd-tally">
            <div className="rd-tally__item">
              <ProgressRing
                value={inView ? stats.lecturesCompleted / Math.max(1, stats.lecturesTotal) : 0}
                size={92}
                stroke={9}
                segments={stats.lecturesTotal}
                color="#9b2f3a"
                track="rgb(42 20 24 / 0.12)"
                label={`${stats.lecturesCompleted} of ${stats.lecturesTotal} lectures finished`}
                className="rd-tally__ring"
              >
                <span className="rd-tally__ringtext">
                  {stats.lecturesCompleted}
                  <small>/{stats.lecturesTotal}</small>
                </span>
              </ProgressRing>
              <p className="rd-tally__label">Lectures read</p>
            </div>
            <div className="rd-tally__item">
              <p className="rd-tally__big">{Math.round(xp)}</p>
              <p className="rd-tally__label">Reading XP</p>
            </div>
            <div className="rd-tally__item">
              <p className="rd-tally__big">{stats.accuracy === null ? '—' : `${Math.round(accuracy)}%`}</p>
              <p className="rd-tally__label">Accuracy, last 10</p>
            </div>
            <div className="rd-tally__item rd-tally__item--candle">
              <BurningCandle fraction={0.45 + 0.55 * Math.min(1, streak.days / 7)} lit={streak.activeToday} className="rd-tally__candle" />
              <div>
                <p className="rd-tally__big">
                  {streak.days}
                  <small> {streak.days === 1 ? 'night' : 'nights'}</small>
                </p>
                <p className="rd-tally__label">{streak.activeToday ? `Streak · best ${streak.best}` : streak.days ? 'Light it tonight!' : 'Start a streak'}</p>
              </div>
            </div>
          </div>

          <div className="rd-goal">
            <div className="rd-goal__head">
              <h3 className="rd-journal__h">Tonight’s goal</h3>
              <span className="rd-goal__value">
                {today.xp} / {today.goal} XP {today.met && <b>✓ met</b>}
              </span>
            </div>
            <div
              className="rd-goal__bar"
              role="progressbar"
              aria-label="Tonight’s XP goal"
              aria-valuemin={0}
              aria-valuemax={today.goal}
              aria-valuenow={Math.min(today.xp, today.goal)}
            >
              <span style={{ width: inView ? pct(Math.min(1, today.xp / Math.max(1, today.goal))) : 0 }} />
            </div>
            <fieldset className="rd-goal__pick">
              <legend>Nightly goal</legend>
              {DAILY_GOALS.map((g) => (
                <label key={g} className={`rd-goal__opt ${g === today.goal ? 'is-on' : ''}`}>
                  <input
                    type="radio"
                    name="rd-daily-goal"
                    value={g}
                    checked={g === today.goal}
                    onChange={() => {
                      sfx.click()
                      progress.setDailyGoal(g)
                    }}
                  />
                  {g}
                </label>
              ))}
            </fieldset>
          </div>

          <div className="rd-plan">
            <h3 className="rd-journal__h">
              Tonight’s reading list <span className="rd-plan__count">{planDone}/3</span>
            </h3>
            <ul className="rd-plan__list">
              {plan.map((item) => (
                <li key={item.text} className={`rd-plan__item ${item.done ? 'is-done' : ''}`}>
                  <span className="rd-plan__box" aria-hidden="true">
                    {item.done ? '✓' : ''}
                  </span>
                  {item.to.startsWith('#') ? (
                    <a href={item.to}>{item.text}</a>
                  ) : (
                    <Link to={item.to}>{item.text}</Link>
                  )}
                  <span className="visually-hidden">{item.done ? ' (done)' : ' (to do)'}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rd-medals">
            <h3 className="rd-journal__h">Honours</h3>
            <p className="rd-medals__note">Bookworm belongs to this library; the others count across all three sections.</p>
            <ul className="rd-medals__list">
              {achievements.map((a) => (
                <li key={a.id} className={`rd-medal ${a.unlockedAt ? 'is-on' : ''}`}>
                  <AchievementBadge icon={a.icon} unlocked={Boolean(a.unlockedAt)} scale={2} className="rd-medal__badge" />
                  <span>
                    <b>{a.title}</b>
                    <small>{a.unlockedAt ? `Earned ${shortDate(a.unlockedAt)}` : a.description}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
