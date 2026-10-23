import { useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useUser } from '../../../auth/auth-context'
import { Avatar } from '../../../components/Avatar'
import { XP_SOURCES, weekRange, weeklyLeaderboard, weeklyXp, type LeaderboardEntry, type WeeklyXp } from '../../../learn/leaderboard'
import { sfx } from '../../../learn/sfx'
import type { ProgressView } from '../../../learn/useProgress'

const MEDALS = ['gold', 'silver', 'bronze'] as const

const rangeText = (start: Date, end: Date) => {
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1)
  const day = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${day(start)} – ${day(last)}`
}

/** The XP split into focused tests, full tests and writing: one bar, scaled to the leader. */
function SplitBar({ week, max }: { week: WeeklyXp; max: number }) {
  return (
    <span className="pf-split-bar" style={{ width: `${(week.xp / Math.max(1, max)) * 100}%` }} aria-hidden="true">
      {XP_SOURCES.filter((s) => week.bySource[s.id] > 0).map((s) => (
        <i key={s.id} style={{ flexGrow: week.bySource[s.id], background: s.color }} title={`${s.label}: ${week.bySource[s.id]} XP`} />
      ))}
    </span>
  )
}

function Breakdown({ week }: { week: WeeklyXp }) {
  return (
    <span className="pf-breakdown">
      {XP_SOURCES.filter((s) => week.bySource[s.id] > 0).map((s) => (
        <span key={s.id}>
          <i style={{ background: s.color }} aria-hidden="true" />
          {s.label} <strong>{week.bySource[s.id]}</strong>
        </span>
      ))}
    </span>
  )
}

function Podium({ top, meId }: { top: LeaderboardEntry[]; meId: string }) {
  // Classic order: second, first, third.
  const order = [top[1], top[0], top[2]].filter((e): e is LeaderboardEntry => Boolean(e))
  return (
    <ol className="pf-podium" aria-label="Top three">
      {order.map((e) => {
        const medal = MEDALS[Math.min(e.place, 3) - 1]
        return (
          <li key={e.student.id} className={`pf-podium__spot is-${medal} ${e.student.id === meId ? 'is-me' : ''}`}>
            <span className="pf-podium__avatar">
              <Avatar user={e.student} scale={e.place === 1 ? 4 : 3} />
              <span className="pf-podium__medal" aria-hidden="true">
                {e.place}
              </span>
            </span>
            <span className="pf-podium__name">
              <span className="visually-hidden">Place {e.place}: </span>
              {e.student.name}
              {e.student.id === meId && <span className="pf-you">You</span>}
            </span>
            <span className="pf-podium__xp">{e.xp} XP</span>
            <span className="pf-podium__block" aria-hidden="true">
              {e.place}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Top of the week: the students who earned the most practice XP since Monday. */
export function LeaderboardTab({ progress }: { progress: ProgressView }) {
  const user = useUser()
  const [params, setParams] = useSearchParams()
  const [now] = useState(() => new Date())
  const lastWeek = params.get('week') === 'last'
  const { start, end } = weekRange(now, lastWeek ? -1 : 0)
  // Recomputed on every render: a handful of students, and it must follow your own new results.
  const board = weeklyLeaderboard(start, end)
  const mine = weeklyXp(progress.state.attempts, start, end)
  const me = board.find((e) => e.student.id === user.id)
  const daysLeft = Math.max(1, Math.ceil((weekRange(now).end.getTime() - now.getTime()) / 86_400_000))
  const max = board[0]?.xp ?? 1

  const setWeek = (last: boolean) => {
    if (last === lastWeek) return
    sfx.click()
    const next = new URLSearchParams(params)
    if (last) next.set('week', 'last')
    else next.delete('week')
    setParams(next, { replace: true })
  }

  return (
    <div className="pf-board">
      <section className="pf-card pf-board__intro" aria-labelledby="pf-board-title">
        <header className="pf-board__head">
          <div>
            <p className="pf-board__eyebrow">{rangeText(start, end)}</p>
            <h2 id="pf-board-title" className="pf-board__title">
              Top owls of the week
            </h2>
            <p className="pf-card__note">
              {lastWeek
                ? 'Final standings for last week.'
                : `Practice XP earned since Monday. A new week starts in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}.`}
            </p>
          </div>
          <div className="pf-seg" role="group" aria-label="Which week">
            <button type="button" aria-pressed={!lastWeek} className={!lastWeek ? 'is-active' : ''} onClick={() => setWeek(false)}>
              This week
            </button>
            <button type="button" aria-pressed={lastWeek} className={lastWeek ? 'is-active' : ''} onClick={() => setWeek(true)}>
              Last week
            </button>
          </div>
        </header>

        <div className="pf-board__me">
          {me ? (
            <p>
              You’re <strong>#{me.place}</strong> {lastWeek ? 'for last week' : 'this week'} with <strong>{me.xp} XP</strong>
              {me.place > 1 && board[0] ? ` — ${board[0].xp - me.xp + 1} XP more takes first place.` : '. Top of the tree!'}
            </p>
          ) : (
            <p>
              {lastWeek ? (
                'You didn’t earn practice XP last week.'
              ) : (
                <>
                  You haven’t earned practice XP this week yet. Take a test in <Link to="/student/reading/practice">Reading</Link>,{' '}
                  <Link to="/student/listening/practice">Listening</Link> or <Link to="/student/writing/practice">Writing</Link> to
                  join the board.
                </>
              )}
            </p>
          )}
          {mine.xp > 0 && <Breakdown week={mine} />}
        </div>
      </section>

      {board.length ? (
        <>
          <Podium top={board.slice(0, 3)} meId={user.id} />

          <section className="pf-card" aria-labelledby="pf-board-list">
            <header className="pf-card__head">
              <h3 id="pf-board-list" className="pf-card__title">
                Standings
              </h3>
              <ul className="pf-legend" aria-label="XP from">
                {XP_SOURCES.map((s) => (
                  <li key={s.id}>
                    <span className="pf-legend__swatch" style={{ background: s.color }} aria-hidden="true" />
                    {s.label}
                  </li>
                ))}
              </ul>
            </header>
            <ol className="pf-standings">
              {board.map((e, i) => (
                <li
                  key={e.student.id}
                  className={`pf-standing ${e.student.id === user.id ? 'is-me' : ''}`}
                  style={{ '--pf-i': Math.min(i, 12) } as CSSProperties}
                >
                  <span className={`pf-standing__place ${e.place <= 3 ? `is-${MEDALS[e.place - 1]}` : ''}`}>{e.place}</span>
                  <span className="pf-standing__avatar" aria-hidden="true">
                    <Avatar user={e.student} scale={2} />
                  </span>
                  <span className="pf-standing__main">
                    <span className="pf-standing__name">
                      {e.student.name}
                      {e.student.id === user.id && <span className="pf-you">You</span>}
                    </span>
                    <SplitBar week={e} max={max} />
                    <Breakdown week={e} />
                  </span>
                  <span className="pf-standing__xp">
                    {e.xp}
                    <small> XP</small>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : (
        <div className="pf-empty">
          <p className="pf-empty__title">The board is empty</p>
          <p>{lastWeek ? 'Nobody earned practice XP last week.' : 'Nobody has earned practice XP this week yet. Be the first owl up the tree!'}</p>
        </div>
      )}

      <section className="pf-card pf-rules" aria-labelledby="pf-rules-title">
        <h3 id="pf-rules-title" className="pf-card__title">
          How practice XP is earned
        </h3>
        <ul>
          <li>
            <i style={{ background: XP_SOURCES[0].color }} aria-hidden="true" />
            <strong>Focused tests:</strong> 1 XP for every correct answer. A 10-question test is worth up to 10 XP, a
            13-question test up to 13.
          </li>
          <li>
            <i style={{ background: XP_SOURCES[1].color }} aria-hidden="true" />
            <strong>Full tests:</strong> 1 XP for every correct answer, up to 40 XP for all 40 questions.
          </li>
          <li>
            <i style={{ background: XP_SOURCES[2].color }} aria-hidden="true" />
            <strong>Writing:</strong> your band in XP. A band 6 essay earns 6 XP.
          </li>
        </ul>
        <p className="pf-rules__note">The week runs Monday to Sunday. XP from lectures and achievements counts towards your rank, but not here.</p>
      </section>
    </div>
  )
}
