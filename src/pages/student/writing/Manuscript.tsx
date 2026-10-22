import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ProgressRing, StreakFlame } from '../../../learn/components/ProgressWidgets'
import { TalkingOwl } from '../../../learn/components/TalkingOwl'
import type { Attempt, StreakInfo } from '../../../learn/progress'
import { BandChart, type BandPoint } from './BandChart'
import { CriteriaBars } from './CriteriaBars'
import { Quill } from './art'
import { useCountUp, useRevealed } from './hooks'
import { detailOf, formatBand, relativeTime, type WritingSummary } from './stats'

export interface ProfessorNote {
  text: string
  to: string
  cta: string
}

interface ManuscriptProps {
  summary: WritingSummary
  points: BandPoint[]
  streak: StreakInfo
  today: { xp: number; goal: number; met: boolean }
  sectionXp: number
  recent: Attempt[]
  titleOf: (practiceId: string) => string
  note: ProfessorNote
  /** Where the empty "recently sealed" card sends a brand-new student. */
  firstTo: string
}

const WORDS_PER_PAGE = 250
const MAX_SHEETS = 14
const MILESTONES = [
  { words: 250, name: 'First page' },
  { words: 1000, name: 'Pamphlet' },
  { words: 2500, name: 'Short story' },
  { words: 5000, name: 'Novella' },
  { words: 10000, name: 'Manuscript' },
]

/** Progress as "your manuscript": a growing stack of pages, bands over time and the four criteria. */
export function Manuscript({ summary, points, streak, today, sectionXp, recent, titleOf, note, firstTo }: ManuscriptProps) {
  const ref = useRef<HTMLDivElement>(null)
  const revealed = useRevealed(ref, 0.1)
  const words = useCountUp(summary.words, revealed, 1400)
  const pages = summary.words ? Math.max(1, Math.ceil(summary.words / WORDS_PER_PAGE)) : 0
  const sheets = Math.min(MAX_SHEETS, pages)
  const goal = Math.min(1, today.goal ? today.xp / today.goal : 0)
  const empty = summary.essays === 0
  const nextMilestone = MILESTONES.find((m) => summary.words < m.words)
  const prevWords = [...MILESTONES].reverse().find((m) => summary.words >= m.words)?.words ?? 0
  const milestoneProgress = nextMilestone ? (summary.words - prevWords) / (nextMilestone.words - prevWords) : 1

  return (
    <section className="wr-section wr-ms" aria-labelledby="wr-ms-title">
      <div className="wr-section-head">
        <p className="wr-eyebrow">Progress · your manuscript</p>
        <h2 id="wr-ms-title">
          Your <em>manuscript</em>
        </h2>
        <p>Every sealed essay adds pages to the stack. Watch your band estimates climb and see which criterion to polish next.</p>
      </div>

      <div ref={ref} className={`wr-ledgerbook ${revealed ? 'is-in' : ''} ${empty ? 'is-empty' : ''}`}>
        <div className="wr-ledgerbook__page wr-ledgerbook__page--left">
          <div className="wr-stack" aria-hidden="true">
            <span className="wr-stack__shadow" />
            {empty ? (
              <span className="wr-stack__sheet wr-stack__sheet--blank" style={{ '--wr-s': 0 } as CSSProperties}>
                <span className="wr-stack__lines" />
                <span className="wr-stack__quill">
                  <Quill width={34} />
                </span>
              </span>
            ) : (
              Array.from({ length: sheets }, (_, i) => (
                <span
                  key={i}
                  className="wr-stack__sheet"
                  style={{ '--wr-s': i, '--wr-r': `${((i * 37) % 7) - 3}deg` } as CSSProperties}
                >
                  {i === sheets - 1 && <span className="wr-stack__lines wr-stack__lines--written" />}
                </span>
              ))
            )}
            {pages > MAX_SHEETS && <span className="wr-stack__more">×{pages}</span>}
          </div>

          <div className="wr-ms__figures">
            <p className="wr-ms__hero">
              <span className="wr-ms__hero-value">{Math.round(words).toLocaleString('en-GB')}</span>
              <span className="wr-ms__hero-label">words written</span>
            </p>
            {empty ? (
              <p className="wr-ms__empty-copy">
                Your first page is waiting. Seal one essay and the stack begins — every 250 words adds a page.
              </p>
            ) : (
              <dl className="wr-ms__facts">
                <div>
                  <dt>Pages</dt>
                  <dd>{pages}</dd>
                </div>
                <div>
                  <dt>Essays sealed</dt>
                  <dd>{summary.essays}</dd>
                </div>
                <div>
                  <dt>Best band</dt>
                  <dd>{summary.bestBand === null ? '—' : formatBand(summary.bestBand)}</dd>
                </div>
                <div>
                  <dt>Writing XP</dt>
                  <dd>{sectionXp}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="wr-tonight">
            <ProgressRing
              value={goal}
              size={86}
              stroke={9}
              color="var(--wr-coral-ink)"
              track="rgb(27 42 74 / 0.12)"
              segments={12}
              label={`Tonight’s goal: ${today.xp} of ${today.goal} XP`}
              className="wr-tonight__ring"
            >
              <span className="wr-tonight__pct">{Math.round(goal * 100)}%</span>
            </ProgressRing>
            <div className="wr-tonight__copy">
              <p className="wr-tonight__title">
                {today.met ? 'Tonight’s goal met — bravo!' : 'Tonight’s ink'}
              </p>
              <p className="wr-tonight__xp">
                {today.xp} / {today.goal} XP
              </p>
              <p className="wr-tonight__streak">
                <StreakFlame streak={streak} scale={3} />
                <span>
                  {streak.days ? `${streak.days}-night streak` : 'No streak yet'}
                  {streak.best > streak.days ? ` · best ${streak.best}` : ''}
                </span>
              </p>
            </div>
          </div>

          <div className="wr-miles">
            <p className="wr-miles__next">
              {nextMilestone ? (
                <>
                  <strong>{(nextMilestone.words - summary.words).toLocaleString('en-GB')} words</strong> to your{' '}
                  <em>{nextMilestone.name}</em>
                </>
              ) : (
                <>Every milestone reached — a true manuscript!</>
              )}
            </p>
            <div
              className="wr-miles__track"
              role="progressbar"
              aria-label={nextMilestone ? `Progress to the ${nextMilestone.name} milestone` : 'All word milestones reached'}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(milestoneProgress * 100)}
            >
              <span style={{ '--wr-v': milestoneProgress } as CSSProperties} />
            </div>
            <ol className="wr-miles__list">
              {MILESTONES.map((m) => {
                const done = summary.words >= m.words
                return (
                  <li key={m.words} className={done ? 'is-done' : m === nextMilestone ? 'is-next' : ''}>
                    <span className="wr-miles__dot" aria-hidden="true">
                      {done ? '✓' : ''}
                    </span>
                    <span className="wr-miles__name">{m.name}</span>
                    <span className="wr-miles__words">
                      {m.words.toLocaleString('en-GB')}
                      <span className="visually-hidden"> words{done ? ', reached' : ''}</span>
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <span className="wr-ledgerbook__spine" aria-hidden="true" />

        <div className="wr-ledgerbook__page wr-ledgerbook__page--right">
          {points.length ? (
            <BandChart points={points} />
          ) : (
            <div className="wr-chart wr-chart--empty">
              <p className="wr-chart__head">
                <span className="wr-chart__title">Band estimate per essay</span>
              </p>
              <svg viewBox="0 0 400 150" className="wr-chart__ghost" aria-hidden="true">
                {[30, 60, 90, 120].map((yy) => (
                  <line key={yy} x1="10" x2="390" y1={yy} y2={yy} />
                ))}
                <path className="wr-chart__ghost-line" d="M20 118 C80 112 110 96 160 92 S250 64 300 52 S360 30 380 24" />
                <circle cx="380" cy="24" r="7" className="wr-chart__ghost-dot" />
              </svg>
              <p className="wr-chart__empty-copy">Your band line starts with your first sealed essay.</p>
            </div>
          )}
          <CriteriaBars latest={summary.latestCriteria} first={summary.firstCriteria} />
        </div>
      </div>

      <div className="wr-ms__below">
        <aside className="wr-note" aria-label="Professor Hoot’s note">
          <span className="wr-note__tape" aria-hidden="true" />
          <div className="wr-note__owl" aria-hidden="true">
            <TalkingOwl happy={!empty} scale={3} />
          </div>
          <div>
            <p className="wr-note__from">A note from Professor Hoot</p>
            <p className="wr-note__text wr-hand">{note.text}</p>
            <Link to={note.to} className="wr-btn wr-btn--ink wr-btn--small">
              {note.cta} <span className="wr-btn__arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>

        {recent.length === 0 && (
          <div className="wr-recent wr-recent--empty">
            <h3 className="wr-recent__title">Recently sealed</h3>
            <ol className="wr-recent__ghosts" aria-hidden="true">
              {[0, 1].map((i) => (
                <li key={i} className="wr-recent__ghost" style={{ '--wr-i': i } as CSSProperties}>
                  <span className="wr-recent__band">?</span>
                  <span className="wr-recent__ghost-lines">
                    <span />
                    <span />
                  </span>
                </li>
              ))}
            </ol>
            <p className="wr-recent__empty-copy">
              Your sealed essays will be filed here, each with its band, its checklist score and the full text to reread.
            </p>
            <Link to={firstTo} className="wr-recent__empty-cta">
              Seal your first: a 20-minute report <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {recent.length > 0 && (
          <div className="wr-recent">
            <h3 className="wr-recent__title">Recently sealed</h3>
            <ol className="wr-recent__list">
              {recent.map((a) => {
                const d = detailOf(a)
                return (
                  <li key={a.at}>
                    <Link to={`practice/${a.practiceId}`} className="wr-recent__item">
                      <span className="wr-recent__band" aria-hidden="true">
                        {a.band ? formatBand(a.band) : '—'}
                      </span>
                      <span className="wr-recent__main">
                        <span className="wr-recent__name">{titleOf(a.practiceId)}</span>
                        <span className="wr-recent__meta">
                          {relativeTime(a.at)} · {d.words} words · checklist {a.score}/{a.total} · +{a.xp} XP
                        </span>
                      </span>
                      <span className="visually-hidden">Band {a.band ? formatBand(a.band) : 'not assessed'}</span>
                      <span className="wr-recent__go" aria-hidden="true">
                        Read →
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
