import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Attempt } from '../../../learn/progress'
import { ResultDetail, ResultRow } from '../../../learn/results/ResultViews'
import { SECTION_META, SECTION_ORDER, accuracyOf, attemptId, formatOf, formatWhen } from '../../../learn/results/results'
import { sfx } from '../../../learn/sfx'
import type { SectionId } from '../../../learn/types'
import type { ProgressView } from '../../../learn/useProgress'

type Sort = 'new' | 'best' | 'low'

const SORTS: [Sort, string][] = [
  ['new', 'Newest first'],
  ['best', 'Highest band'],
  ['low', 'Lowest band'],
]

function dayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Tonight'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return formatWhen(iso, false)
}

const bandOf = (a: Attempt) => (typeof a.band === 'number' ? a.band : accuracyOf(a) * 9)

/** Every test the student has taken, in one list and one design. */
export function ResultsTab({ progress, panelId }: { progress: ProgressView; panelId: string }) {
  const [params, setParams] = useSearchParams()
  const all = progress.state.attempts
  const openId = params.get('result')
  const section = (params.get('s') ?? '') as SectionId | ''
  const format = params.get('f') ?? ''
  const sort = (params.get('sort') ?? 'new') as Sort
  const firstRender = useRef(true)

  // Opening or closing a result starts at the top of the panel.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document.getElementById(panelId)?.scrollIntoView({ block: 'start' })
  }, [openId, panelId])

  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    setParams(next, { replace: true })
  }

  const listSearch = (() => {
    const p = new URLSearchParams(params)
    p.delete('result')
    return `/student/profile?${p.toString()}`
  })()

  const open = openId ? all.find((a) => attemptId(a) === openId) : undefined
  if (open) return <ResultDetail attempt={open} all={all} backTo={listSearch} />

  const counts = Object.fromEntries(SECTION_ORDER.map((s) => [s, all.filter((a) => a.section === s).length])) as Record<SectionId, number>
  const inSection = all.filter((a) => !section || a.section === section)
  const fullCount = inSection.filter((a) => formatOf(a) === 'full').length
  const shown = inSection
    .filter((a) => !format || formatOf(a) === format)
    .sort((a, b) => {
      if (sort === 'best') return bandOf(b) - bandOf(a) || (a.at < b.at ? 1 : -1)
      if (sort === 'low') return bandOf(a) - bandOf(b) || (a.at < b.at ? 1 : -1)
      return a.at < b.at ? 1 : -1
    })

  if (!all.length) {
    return (
      <div className="pf-empty">
        <p className="pf-empty__title">No results yet</p>
        <p>Every test you finish lands here: your band, your score and every answer, in one place.</p>
        <div className="pf-empty__links">
          {SECTION_ORDER.map((s) => (
            <Link key={s} to={`/student/${s}/practice`} className="btn btn--ghost notched">
              {SECTION_META[s].name} practice
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Group by day when the list is in time order.
  const groups: { label: string; items: Attempt[] }[] = []
  for (const a of shown) {
    const label = sort === 'new' ? dayLabel(a.at) : ''
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(a)
    else groups.push({ label, items: [a] })
  }

  return (
    <div className="pf-results">
      <div className="pf-filters">
        <div className="pf-chips" role="group" aria-label="Section">
          <button type="button" className={`pf-chip ${!section ? 'is-active' : ''}`} aria-pressed={!section} onClick={() => set({ s: '' })}>
            All <span>{all.length}</span>
          </button>
          {SECTION_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              className={`pf-chip ${section === s ? 'is-active' : ''}`}
              aria-pressed={section === s}
              disabled={!counts[s]}
              onClick={() => {
                sfx.click()
                set({ s: section === s ? '' : s })
              }}
            >
              <i style={{ background: SECTION_META[s].chart }} aria-hidden="true" />
              {SECTION_META[s].name} <span>{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="pf-filters__right">
          <label className="pf-select">
            <span>Format</span>
            <select value={format} onChange={(e) => set({ f: e.target.value })}>
              <option value="">All tests</option>
              <option value="full">Full tests ({fullCount})</option>
              <option value="focused">Focused ({inSection.length - fullCount})</option>
            </select>
          </label>
          <label className="pf-select">
            <span>Sort</span>
            <select value={sort} onChange={(e) => set({ sort: e.target.value === 'new' ? '' : e.target.value })}>
              {SORTS.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {shown.length ? (
        groups.map((g, gi) => (
          <section key={`${g.label}${gi}`} className="pf-results__group" aria-label={g.label || 'Results'}>
            {g.label && <h3 className="pf-results__day">{g.label}</h3>}
            <ol className="pf-results__list">
              {g.items.map((a, i) => (
                <ResultRow
                  key={attemptId(a)}
                  attempt={a}
                  all={all}
                  index={i}
                  to={`/student/profile?${new URLSearchParams({ ...Object.fromEntries(params), result: attemptId(a) }).toString()}`}
                />
              ))}
            </ol>
          </section>
        ))
      ) : (
        <p className="pf-empty pf-empty--inline">
          No {format === 'full' ? 'full tests' : 'focused tests'} {section ? `in ${SECTION_META[section].name} ` : ''}yet.{' '}
          <button type="button" className="pf-linkbtn" onClick={() => set({ s: '', f: '' })}>
            Show everything
          </button>
        </p>
      )}
    </div>
  )
}
