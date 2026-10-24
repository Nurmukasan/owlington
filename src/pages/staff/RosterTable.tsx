import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { SECTIONS, type SectionReport, type StudentReport } from '../../learn/roster'
import type { SectionId } from '../../learn/types'
import { ago, bandText, formatDate, pct, SECTION_NAME } from './useRoster'


type SortKey = 'name' | 'added' | 'active' | 'overall' | `${SectionId}-band` | `${SectionId}-tests`

const SORTS: [SortKey, string][] = [
  ['name', 'Name (A–Z)'],
  ['added', 'Newest first'],
  ['active', 'Recently active'],
  ['overall', 'Overall band'],
  ...SECTIONS.flatMap((s): [SortKey, string][] => [
    [`${s}-band`, `${SECTION_NAME[s]} band`],
    [`${s}-tests`, `${SECTION_NAME[s]} tests done`],
  ]),
]

function sortValue(r: StudentReport, key: SortKey): number | string {
  if (key === 'name') return `${r.user.lastName} ${r.user.firstName}`.toLowerCase()
  if (key === 'added') return -new Date(r.user.createdAt).getTime()
  if (key === 'active') return r.lastActive ? -new Date(r.lastActive).getTime() : Infinity
  if (key === 'overall') return -(r.overallBand ?? -1)
  const [section, what] = key.split('-') as [SectionId, 'band' | 'tests']
  return what === 'band' ? -(r.sections[section].avgBand ?? -1) : -r.sections[section].testsShare
}

/** The roster: one row per student, with each section's tests, band and lectures. */
export function RosterTable({ reports, linkBase, empty }: { reports: StudentReport[]; linkBase: string; empty: string }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('name')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reports
      .filter((r) => !q || `${r.user.name} ${r.user.email} ${r.user.phone ?? ''}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const x = sortValue(a, sort)
        const y = sortValue(b, sort)
        return x < y ? -1 : x > y ? 1 : a.user.name.localeCompare(b.user.name)
      })
  }, [reports, query, sort])

  return (
    <section className="roster" aria-label="Students">
      <div className="roster__tools">
        <label className="staff-field staff-field--search">
          <span className="visually-hidden">Search students</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email or phone…" />
        </label>
        <label className="staff-field staff-field--inline">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORTS.map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <p className="roster__count">
          {rows.length === reports.length ? `${reports.length} students` : `${rows.length} of ${reports.length} students`}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="roster__empty">{reports.length ? 'No student matches that search.' : empty}</p>
      ) : (
        <div className="roster__scroll">
          <table className="roster__table">
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Added</th>
                {SECTIONS.map((s) => (
                  <th key={s} scope="col" className={`roster__sec roster__sec--${s}`}>
                    {SECTION_NAME[s]}
                  </th>
                ))}
                <th scope="col">Overall</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.user.id}>
                  <th scope="row" className="roster__who">
                    <Link to={`${linkBase}/${r.user.id}`} className="roster__name">
                      <Avatar user={r.user} scale={2} />
                      <span>
                        <strong>{r.user.name}</strong>
                        <small>{r.user.email}</small>
                        <small>{r.user.phone ?? ''}</small>
                      </span>
                    </Link>
                  </th>
                  <td className="roster__added" data-label="Added">
                    <span>{formatDate(r.user.createdAt)}</span>
                    <small>active {ago(r.lastActive)}</small>
                  </td>
                  {SECTIONS.map((s) => (
                    <td key={s} className={`roster__cell roster__cell--${s}`} data-label={SECTION_NAME[s]}>
                      <SectionCell report={r.sections[s]} />
                    </td>
                  ))}
                  <td className="roster__overall" data-label="Overall band">
                    <strong>{bandText(r.overallBand)}</strong>
                    {r.user.targetBand ? <small>target {r.user.targetBand.toFixed(1)}</small> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export function SectionCell({ report: s }: { report: SectionReport }) {
  return (
    <div className="sec-cell">
      <span className="sec-cell__line" aria-hidden="true">
        <span className="sec-cell__k">Tests</span>
        <span className="sec-cell__meter" aria-hidden="true">
          <span style={{ '--w': `${Math.round(s.testsShare * 100)}%` } as CSSProperties} />
        </span>
        <span className="sec-cell__v">{pct(s.testsShare)}</span>
      </span>
      <span className="sec-cell__line" aria-hidden="true">
        <span className="sec-cell__k">Band</span>
        <span className="sec-cell__band">{bandText(s.avgBand)}</span>
        <span className="sec-cell__k">Lectures</span>
        <span className="sec-cell__v">
          {s.lecturesDone}/{s.lecturesTotal}
        </span>
      </span>
      <span className="visually-hidden">
        {s.testsDone} of {s.testsTotal} tests done, average band {bandText(s.avgBand)}, {s.lecturesDone} of {s.lecturesTotal} video lessons watched.
      </span>
    </div>
  )
}
