import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { PixelSprite } from '../../../components/PixelSprite'
import { AchievementBadge, RankBar, StreakFlame } from '../../../learn/components/ProgressWidgets'
import { RANKS, type Attempt } from '../../../learn/progress'
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
  const { rank, xp, streak, today, achievements, state } = progress
  const lecturesDone = SECTION_ORDER.reduce((s, sec) => s + progress.section(sec).lecturesCompleted, 0)
  const unlocked = achievements.filter((a) => a.unlockedAt).length
  const studiedSec = state.attempts.reduce((s, a) => s + a.durationSec, 0)

  return (
    <div className="pf-progress">
      <section className="pf-kpis" aria-label="At a glance">
        <article className="pf-tile pf-tile--level">
          <h2 className="pf-tile__label">Rank</h2>
          <RankBar rank={rank} xp={xp} className="pf-xp" />
          <p className="pf-tile__note pf-tile__motto">{rank.description}</p>
          <p className="pf-tile__note">
            {rank.next === null ? (
              'The highest rank there is.'
            ) : (
              <>
                {rank.next - xp} XP to <strong>{rank.nextTitle}</strong>
              </>
            )}{' '}
            · {xp} XP in total
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
          <h2 className="pf-tile__label">Tonight’s goal</h2>
          <p className="pf-tile__big">
            {today.xp}
            <small> / {today.goal} XP</small>
          </p>
          <span className={`pf-meter pf-meter--goal ${today.met ? 'is-met' : ''}`} aria-hidden="true">
            <span style={{ width: `${Math.min(1, today.xp / Math.max(1, today.goal)) * 100}%` }} />
          </span>
          <p className="pf-tile__note">
            {today.met
              ? today.xp > today.goal
                ? `Goal met, plus ${today.xp - today.goal} bonus XP. Everything past ${today.goal} is extra.`
                : `Goal met! Anything more tonight is a bonus.`
              : `${today.goal - today.xp} XP to go. Every correct answer is 1 XP.`}
          </p>
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

        <section className="pf-card" aria-labelledby="pf-ranks-title">
          <header className="pf-card__head">
            <h2 id="pf-ranks-title" className="pf-card__title">
              Ranks
            </h2>
            <p className="pf-card__note">{rank.next === null ? 'You reached the top.' : `${rank.next - xp} XP to the next`}</p>
          </header>
          <ol className="pf-ranks">
            {RANKS.map((r, i) => {
              const where = i + 1 < rank.rank ? 'passed' : i + 1 === rank.rank ? 'current' : 'ahead'
              return (
                <li key={r.title} className={`pf-rank is-${where}`} aria-current={where === 'current' ? 'step' : undefined}>
                  <span className="pf-rank__n">{i + 1}</span>
                  <span className="pf-rank__text">
                    <strong>{r.title}</strong>
                    <span>{r.description}</span>
                  </span>
                  <span className="pf-rank__xp">
                    {where === 'passed' ? <span aria-label="reached">✓</span> : `${r.xp.toLocaleString('en-GB')} XP`}
                  </span>
                </li>
              )
            })}
          </ol>
        </section>
      </div>

      <section className="pf-card" aria-labelledby="pf-ach-title">
        <header className="pf-card__head">
          <h2 id="pf-ach-title" className="pf-card__title">
            Achievements
          </h2>
          <p className="pf-card__note">
            {unlocked} of {achievements.length} unlocked · {achievements.filter((a) => a.unlockedAt).reduce((s, a) => s + a.xp, 0)} XP
            earned
          </p>
        </header>
        <div className="pf-ach-groups">
          {SECTION_ORDER.map((sec) => (
            <section key={sec} className="pf-ach-group" style={{ '--pf-color': SECTION_META[sec].color } as CSSProperties} aria-label={SECTION_META[sec].name}>
              <h3 className="pf-ach-group__title">
                <PixelSprite sprite={SECTION_META[sec].icon} scale={2} />
                {SECTION_META[sec].name}
              </h3>
              <ul className="pf-achievements">
                {achievements
                  .filter((a) => a.section === sec)
                  .map((a) => (
                    <li key={a.id} className={`pf-ach ${a.unlockedAt ? 'is-unlocked' : ''}`}>
                      <AchievementBadge icon={a.icon} unlocked={Boolean(a.unlockedAt)} scale={3} />
                      <span className="pf-ach__text">
                        <strong>{a.title}</strong>
                        <span>{a.description}</span>
                        {a.unlockedAt ? (
                          <span className="pf-ach__done">✓ Unlocked {formatWhen(a.unlockedAt, false)}</span>
                        ) : (
                          a.goal > 1 && (
                            <span className="pf-ach__progress">
                              <span className="pf-meter" aria-hidden="true">
                                <span style={{ width: `${(a.have / a.goal) * 100}%` }} />
                              </span>
                              {a.have} / {a.goal}
                            </span>
                          )
                        )}
                      </span>
                      <span className="pf-ach__xp">+{a.xp} XP</span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
