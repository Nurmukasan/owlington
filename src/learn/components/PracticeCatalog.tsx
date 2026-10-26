import type { CSSProperties, ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PixelSprite } from '../../components/PixelSprite'
import { TEST_ICON } from '../../scene/sprites'
import { CATALOG } from '../catalog'
import type { Attempt } from '../progress'
import { sfx } from '../sfx'
import type { Level, PracticeInfo, SectionId } from '../types'
import { useProgress } from '../useProgress'
import { TalkingOwl } from './TalkingOwl'
import './PracticeCatalog.css'

export interface InProgressNote {
  /** Short status, e.g. "5 of 12 answered". */
  label: string
  /** 0..1, for the little bar. */
  share?: number
}

interface PracticeCatalogProps {
  section: SectionId
  /** The section's world, e.g. "The Moonlit Library" — used for the breadcrumb. */
  worldName: string
  /** What a full test contains in this section, e.g. "3 passages · 40 questions · 60 minutes". */
  fullFormat: string
  /** Tests the student has started but not handed in (drafts kept by the section). */
  inProgress?: Record<string, InProgressNote>
  children?: ReactNode
}

type Tab = 'full' | 'focused'
type Status = 'all' | 'new' | 'started' | 'done'
type Sort = 'recommended' | 'short' | 'level' | 'best' | 'worst'

const LEVEL_RANK: Record<Level, number> = { Foundation: 1, Intermediate: 2, Advanced: 3 }
const accuracy = (a?: Attempt) => (a && a.total ? a.score / a.total : null)
const tagsOf = (p: PracticeInfo) => p.tags ?? p.kinds
const pct = (x: number) => `${Math.round(x * 100)}%`

const SORTS: { id: Sort; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'short', label: 'Shortest first' },
  { id: 'level', label: 'Easiest first' },
  { id: 'worst', label: 'Needs work first' },
  { id: 'best', label: 'Best score first' },
]

/**
 * The practice catalogue for one section, built to hold dozens of tests:
 * full tests and focused practice in separate tabs, filters by question type,
 * status and level, search and sorting. Filter state lives in the URL, so the
 * back button from a test returns to the same view. Themed per section with
 * the `catalog--<section>` class and --cat-* custom properties.
 */
export function PracticeCatalog({ section, worldName, fullFormat, inProgress = {}, children }: PracticeCatalogProps) {
  const progress = useProgress()
  const stats = progress.section(section)
  const all = CATALOG[section].practiceSets
  const [params, setParams] = useSearchParams()

  const fullTests = all.filter((p) => p.format === 'full')
  const focusedTests = all.filter((p) => p.format !== 'full')
  const tab: Tab = params.get('tab') === 'full' || !focusedTests.length ? 'full' : 'focused'
  const type = params.get('type') ?? ''
  const status = (params.get('status') as Status | null) ?? 'all'
  const sort = (params.get('sort') as Sort | null) ?? 'recommended'
  const level = params.get('level') ?? ''
  const query = params.get('q') ?? ''

  const set = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    setParams(next, { replace: true })
  }

  const statusOf = (p: PracticeInfo): Exclude<Status, 'all'> =>
    inProgress[p.id] ? 'started' : stats.best[p.id] ? 'done' : 'new'

  const pool = tab === 'full' ? fullTests : focusedTests
  const typeCounts = new Map<string, number>()
  for (const p of focusedTests) for (const t of tagsOf(p)) typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1)
  const types = [...typeCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  // A few dozen tests at most, so filtering and sorting on each render is cheap.
  const shown = (() => {
    const q = query.trim().toLowerCase()
    const list = pool.filter(
      (p) =>
        (tab === 'full' || !type || tagsOf(p).includes(type)) &&
        (status === 'all' || statusOf(p) === status) &&
        (!level || p.level === level) &&
        (!q || `${p.title} ${p.summary} ${p.kinds.join(' ')}`.toLowerCase().includes(q)),
    )
    const rank = (p: PracticeInfo) => {
      const s = statusOf(p)
      return s === 'started' ? 0 : s === 'new' ? 1 : 2
    }
    const index = (p: PracticeInfo) => all.indexOf(p)
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'short':
          return a.minutes - b.minutes || index(a) - index(b)
        case 'level':
          return LEVEL_RANK[a.level] - LEVEL_RANK[b.level] || index(a) - index(b)
        case 'best':
          return (accuracy(stats.best[b.id]) ?? -1) - (accuracy(stats.best[a.id]) ?? -1)
        case 'worst':
          return (accuracy(stats.best[a.id]) ?? 2) - (accuracy(stats.best[b.id]) ?? 2)
        default:
          // In progress → not tried (easiest first) → tried (weakest first).
          return (
            rank(a) - rank(b) ||
            (rank(a) === 2
              ? (accuracy(stats.best[a.id]) ?? 0) - (accuracy(stats.best[b.id]) ?? 0)
              : LEVEL_RANK[a.level] - LEVEL_RANK[b.level]) ||
            index(a) - index(b)
          )
      }
    })
  })()

  const done = all.filter((p) => stats.best[p.id]).length
  const filtersOn = Boolean(type || status !== 'all' || level || query)

  return (
    <div className={`catalog catalog--${section}`}>
      <div className="catalog__sky" aria-hidden="true" />
      <div className="catalog__inner">
        <nav className="catalog__crumbs" aria-label="Breadcrumb">
          <Link to={`/student/${section}`}>← {worldName}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Practice</span>
        </nav>

        <header className="catalog__head">
          <div>
            <p className="catalog__eyebrow">
              <PixelSprite sprite={TEST_ICON} scale={2} /> {section.toUpperCase()} · PRACTICE
            </p>
            <h1 className="catalog__title">Practice tests</h1>
            <p className="catalog__lead">
              <b>Full tests</b> are the real thing: {fullFormat}. <b>Focused practice</b> trains one question type at a time.
            </p>
          </div>
          <dl className="catalog__summary">
            <div>
              <dt>Tests</dt>
              <dd>{all.length}</dd>
            </div>
            <div>
              <dt>Tried</dt>
              <dd>{done}</dd>
            </div>
            <div>
              <dt>Average best</dt>
              <dd>{stats.practiceAttempted ? pct(Object.values(stats.best).reduce((s, a) => s + (accuracy(a) ?? 0), 0) / stats.practiceAttempted) : '—'}</dd>
            </div>
          </dl>
        </header>

        {children}

        <div className="catalog__tabs" role="tablist" aria-label="Kind of test">
          {(
            [
              ['full', 'Full tests', fullTests.length],
              ['focused', 'By question type', focusedTests.length],
            ] as const
          )
            // a kind with no tests yet (e.g. Listening broadcasts still unrecorded) gets no tab
            .filter(([id, , count]) => id === 'full' || count > 0)
            .map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`catalog-tab-${id}`}
              aria-selected={tab === id}
              aria-controls="catalog-panel"
              className={`catalog__tab ${tab === id ? 'is-active' : ''}`}
              onClick={() => {
                sfx.click()
                set({ tab: id, type: '' })
              }}
            >
              {label} <span className="catalog__count">{count}</span>
            </button>
          ))}
        </div>

        <section id="catalog-panel" role="tabpanel" aria-labelledby={`catalog-tab-${tab}`} className="catalog__panel">
          {tab === 'focused' && types.length > 0 && (
            <div className="catalog__types" role="group" aria-label="Question type">
              <button
                type="button"
                className={`catalog__chip ${!type ? 'is-active' : ''}`}
                aria-pressed={!type}
                onClick={() => set({ type: '' })}
              >
                All types <span>{focusedTests.length}</span>
              </button>
              {types.map(([t, n]) => (
                <button
                  key={t}
                  type="button"
                  className={`catalog__chip ${type === t ? 'is-active' : ''}`}
                  aria-pressed={type === t}
                  onClick={() => {
                    sfx.click()
                    set({ type: type === t ? '' : t })
                  }}
                >
                  {t} <span>{n}</span>
                </button>
              ))}
            </div>
          )}

          {pool.length > 0 && (
            <div className="catalog__tools">
              <label className="catalog__search">
                <span className="visually-hidden">Search tests</span>
                <input type="search" placeholder="Search tests…" value={query} onChange={(e) => set({ q: e.target.value })} />
              </label>
              <label className="catalog__select">
                <span>Status</span>
                <select value={status} onChange={(e) => set({ status: e.target.value === 'all' ? '' : e.target.value })}>
                  <option value="all">All</option>
                  <option value="new">Not started</option>
                  <option value="started">In progress</option>
                  <option value="done">Tried</option>
                </select>
              </label>
              <label className="catalog__select">
                <span>Level</span>
                <select value={level} onChange={(e) => set({ level: e.target.value })}>
                  <option value="">Any</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </label>
              <label className="catalog__select">
                <span>Sort</span>
                <select value={sort} onChange={(e) => set({ sort: e.target.value === 'recommended' ? '' : e.target.value })}>
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {pool.length > 0 && (
            <p className="catalog__showing" aria-live="polite">
              Showing {shown.length} of {pool.length}
              {filtersOn && (
                <button type="button" className="catalog__clear" onClick={() => set({ type: '', status: '', level: '', q: '' })}>
                  Clear filters
                </button>
              )}
            </p>
          )}

          {tab === 'full' && !fullTests.length ? (
            <div className="catalog__empty">
              <TalkingOwl happy scale={4} />
              <div>
                <p className="catalog__empty-title">Full tests are on their way</p>
                <p>
                  Each one will be a complete IELTS {section} paper — {fullFormat} — timed and marked like the real exam.
                </p>
                {focusedTests.length > 0 && (
                  <button type="button" className="catalog__empty-btn" onClick={() => set({ tab: 'focused' })}>
                    Practise by question type meanwhile →
                  </button>
                )}
              </div>
            </div>
          ) : shown.length === 0 ? (
            <div className="catalog__empty catalog__empty--small">
              <p className="catalog__empty-title">No tests match these filters</p>
              <button type="button" className="catalog__empty-btn" onClick={() => set({ type: '', status: '', level: '', q: '' })}>
                Clear filters
              </button>
            </div>
          ) : (
            <ol className={`catalog__grid ${tab === 'full' ? 'catalog__grid--full' : ''}`}>
              {shown.map((p, i) => {
                const best = stats.best[p.id]
                const acc = accuracy(best)
                const started = inProgress[p.id]
                const tries = stats.attempts.filter((a) => a.practiceId === p.id).length
                const number = all.indexOf(p) + 1
                const tags = tagsOf(p)
                return (
                  <li key={p.id} style={{ '--cat-i': Math.min(i, 12) } as CSSProperties}>
                    <Link
                      to={`/student/${section}/practice/${p.id}`}
                      className={`catalog__card ${started ? 'is-started' : best ? 'is-done' : ''}`}
                      onClick={() => sfx.click()}
                    >
                      <span className="catalog__card-top">
                        <span className="catalog__num">#{String(number).padStart(2, '0')}</span>
                        <span className="catalog__kind">{p.format === 'full' ? 'FULL TEST' : 'FOCUSED'}</span>
                        <span className="catalog__level" title={p.level}>
                          <span className="visually-hidden">{p.level}</span>
                          {[1, 2, 3].map((n) => (
                            <i key={n} className={n <= LEVEL_RANK[p.level] ? 'is-on' : ''} aria-hidden="true" />
                          ))}
                        </span>
                      </span>
                      <span className="catalog__card-title">{p.title}</span>
                      <span className="catalog__tags">
                        {tags.slice(0, 2).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                        {tags.length > 2 && <span>+{tags.length - 2}</span>}
                      </span>
                      <span className="catalog__meta">
                        {p.minutes} min · {p.questionCount} {section === 'writing' ? 'checkpoints' : 'questions'}
                      </span>
                      <span className="catalog__status">
                        {started ? (
                          <>
                            <span className="catalog__badge catalog__badge--started">IN PROGRESS</span>
                            <span>{started.label}</span>
                          </>
                        ) : best && acc !== null ? (
                          <>
                            <span className="catalog__badge catalog__badge--done">BEST {pct(acc)}</span>
                            <span>
                              {best.score}/{best.total}
                              {best.band !== undefined ? ` · band ${best.band}` : ''} · {tries} {tries === 1 ? 'try' : 'tries'}
                            </span>
                          </>
                        ) : (
                          <span className="catalog__badge">NOT STARTED</span>
                        )}
                        <span className="catalog__go" aria-hidden="true">
                          →
                        </span>
                      </span>
                      {(started?.share !== undefined || acc !== null) && (
                        <span className="catalog__bar" aria-hidden="true">
                          <span style={{ width: pct(started?.share ?? acc ?? 0) }} />
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}
