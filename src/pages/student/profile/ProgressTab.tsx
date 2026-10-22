import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PixelSprite } from '../../../components/PixelSprite'
import { AchievementBadge, StreakFlame, XpBar } from '../../../learn/components/ProgressWidgets'
import { DAILY_GOALS, type Attempt } from '../../../learn/progress'
import { SECTION_META, SECTION_ORDER, formatBand, formatWhen, pct } from '../../../learn/results/results'
import { sfx } from '../../../learn/sfx'
import type { SectionId } from '../../../learn/types'
import type { ProgressView } from '../../../learn/useProgress'
import { ActivityHeatmap } from './ActivityHeatmap'
import { BandChart } from './BandChart'

/** Mean of the last three bands in a section, to the nearest half band. */
function currentBand(attempts: Attempt[]) {
  const recent = attempts.filter((a) => typeof a.band === 'number').slice(0, 3)
  if (!recent.length) return undefined
  const mean = recent.reduce((s, a) => s + (a.band as number), 0) / recent.length
  return Math.round(mean * 2) / 2
}

function SkillCard({ section, progress, index }: { section: SectionId; progress: ProgressView; index: number }) {
  const meta = SECTION_META[section]
  const stats = progress.section(section)
  const band = currentBand(stats.attempts)
  const bests = Object.values(stats.best)
  const avgBest = bests.length ? bests.reduce((s, a) => s + a.score / a.total, 0) / bests.length : null
  return (
    <article
      className="pf-skill"
      style={{ '--pf-color': meta.color, '--pf-chart': meta.chart, '--pf-i': index } as CSSProperties}
      aria-labelledby={`pf-skill-${section}`}
    >
      <header className="pf-skill__head">
        <span className="pf-skill__icon" aria-hidden="true">
          <PixelSprite sprite={meta.icon} scale={2} />
        </span>
        <div>
          <h3 id={`pf-skill-${section}`} className="pf-skill__name">
            {meta.name}
          </h3>
          <p className="pf-skill__world">{meta.world}</p>
        </div>
        <p className="pf-skill__band">
          <span>{formatBand(band)}</span>
          <small>{band === undefined ? 'no band yet' : 'current band'}</small>
        </p>
      </header>

      <dl className="pf-skill__facts">
        <div>
          <dt>Lectures</dt>
          <dd>
            {stats.lecturesCompleted}/{stats.lecturesTotal}
            <span className="pf-meter" aria-hidden="true">
              <span style={{ width: `${(stats.lecturesCompleted / Math.max(1, stats.lecturesTotal)) * 100}%` }} />
            </span>
          </dd>
        </div>
        <div>
          <dt>Tests tried</dt>
          <dd>
            {stats.practiceAttempted}/{stats.practiceTotal}
            <span className="pf-meter" aria-hidden="true">
              <span style={{ width: `${(stats.practiceAttempted / Math.max(1, stats.practiceTotal)) * 100}%` }} />
            </span>
          </dd>
        </div>
        <div>
          <dt>Average best</dt>
          <dd>{avgBest === null ? '—' : pct(avgBest)}</dd>
        </div>
        <div>
          <dt>XP</dt>
          <dd>{stats.xp}</dd>
        </div>
      </dl>

      <footer className="pf-skill__foot">
        <span>{stats.lastActivity ? `Last studied ${formatWhen(stats.lastActivity, false)}` : 'Not started yet'}</span>
        <Link to={`/student/${section}`} onClick={() => sfx.click()}>
          Open {meta.name} →
        </Link>
      </footer>
    </article>
  )
}

export function ProgressTab({ progress }: { progress: ProgressView }) {
  const { level, xp, streak, today, achievements, state } = progress
  const lecturesDone = SECTION_ORDER.reduce((s, sec) => s + progress.section(sec).lecturesCompleted, 0)
  const unlocked = achievements.filter((a) => a.unlockedAt).length
  const studiedSec = state.attempts.reduce((s, a) => s + a.durationSec, 0)

  return (
    <div className="pf-progress">
      <section className="pf-kpis" aria-label="At a glance">
        <article className="pf-tile pf-tile--level">
          <h2 className="pf-tile__label">Level</h2>
          <XpBar level={level} xp={xp} className="pf-xp" />
          <p className="pf-tile__note">
            {level.next - xp} XP to <strong>{level.nextTitle}</strong> · {xp} XP in total
          </p>
        </article>

        <article className="pf-tile">
          <h2 className="pf-tile__label">Streak</h2>
          <div className="pf-tile__row">
            <StreakFlame streak={streak} scale={3} className="pf-flame" />
            <p className="pf-tile__big">
              {streak.days}
              <small> {streak.days === 1 ? 'night' : 'nights'}</small>
            </p>
          </div>
          <p className="pf-tile__note">
            Best: {streak.best} {streak.best === 1 ? 'night' : 'nights'}
            {streak.days > 0 && !streak.activeToday ? ' · study tonight to keep it' : ''}
          </p>
        </article>

        <article className="pf-tile">
          <h2 className="pf-tile__label" id="pf-goal-label">
            Tonight’s goal
          </h2>
          <p className="pf-tile__big">
            {today.xp}
            <small> / {today.goal} XP</small>
          </p>
          <span className={`pf-meter pf-meter--goal ${today.met ? 'is-met' : ''}`} aria-hidden="true">
            <span style={{ width: `${Math.min(1, today.xp / Math.max(1, today.goal)) * 100}%` }} />
          </span>
          <div className="pf-goal" role="group" aria-labelledby="pf-goal-label">
            {DAILY_GOALS.map((g) => (
              <button
                key={g}
                type="button"
                className={`pf-goal__btn ${g === today.goal ? 'is-active' : ''}`}
                aria-pressed={g === today.goal}
                onClick={() => {
                  sfx.click()
                  progress.setDailyGoal(g)
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </article>

        <article className="pf-tile">
          <h2 className="pf-tile__label">Studied</h2>
          <dl className="pf-totals">
            <div>
              <dt>Tests</dt>
              <dd>{state.attempts.length}</dd>
            </div>
            <div>
              <dt>Lectures</dt>
              <dd>{lecturesDone}</dd>
            </div>
            <div>
              <dt>Test time</dt>
              <dd>{Math.round(studiedSec / 60)} min</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="pf-skills" aria-label="Your three skills">
        {SECTION_ORDER.map((s, i) => (
          <SkillCard key={s} section={s} progress={progress} index={i} />
        ))}
      </section>

      <section className="pf-card" aria-labelledby="pf-chart-title">
        <header className="pf-card__head">
          <h2 id="pf-chart-title" className="pf-card__title">
            Band over time
          </h2>
          <p className="pf-card__note">The estimated IELTS band of every test you take, by section.</p>
        </header>
        <BandChart attempts={state.attempts} />
      </section>

      <div className="pf-split">
        <section className="pf-card" aria-labelledby="pf-heat-title">
          <header className="pf-card__head">
            <h2 id="pf-heat-title" className="pf-card__title">
              Study nights
            </h2>
          </header>
          <ActivityHeatmap dailyXp={state.dailyXp} />
        </section>

        <section className="pf-card" aria-labelledby="pf-ach-title">
          <header className="pf-card__head">
            <h2 id="pf-ach-title" className="pf-card__title">
              Achievements
            </h2>
            <p className="pf-card__note">
              {unlocked} of {achievements.length} unlocked
            </p>
          </header>
          <ul className="pf-achievements">
            {achievements.map((a) => (
              <li key={a.id} className={`pf-ach ${a.unlockedAt ? 'is-unlocked' : ''}`}>
                <AchievementBadge icon={a.icon} unlocked={Boolean(a.unlockedAt)} scale={2} />
                <span className="pf-ach__text">
                  <strong>{a.title}</strong>
                  <span>{a.unlockedAt ? `Unlocked ${formatWhen(a.unlockedAt, false)}` : a.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
