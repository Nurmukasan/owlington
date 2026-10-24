import { useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUser } from '../../auth/auth-context'
import { getStudent, teacherName } from '../../auth/mockAuthApi'
import { Avatar } from '../../components/Avatar'
import { CATALOG } from '../../learn/catalog'
import { getProgressStore, lectureKey, type LectureProgress } from '../../learn/progress'
import { SECTIONS, studentReport, testFormat, testTitle } from '../../learn/roster'
import type { SectionId } from '../../learn/types'
import { ago, bandText, formatDate, pct, SECTION_NAME, useLive } from './useRoster'

const daysUntil = (date: string) => Math.ceil((new Date(`${date}T00:00:00`).getTime() - Date.now()) / 86400000)

/** One student, in full: contact details, each section's tests, bands and lectures, and recent results. */
export default function StudentDetail() {
  const { studentId = '' } = useParams()
  const me = useUser()
  const base = me.role === 'admin' ? '/admin' : '/teacher'
  const [data] = useLive(() => {
    const student = getStudent(studentId)
    return student ? { report: studentReport(student), teacher: teacherName(student.teacherId) } : null
  })
  const [shown, setShown] = useState(12)

  if (!data) {
    return (
      <div className="staff-page">
        <p className="staff-eyebrow">STUDENT</p>
        <h1>Student not found</h1>
        <p className="staff-lead">This student isn’t in your group (or no longer exists).</p>
        <Link to={base} className="staff-btn">
          ← Back to the list
        </Link>
      </div>
    )
  }

  const { report: r, teacher } = data
  const u = r.user
  const state = getProgressStore(u.id).getSnapshot()
  const exam = u.examDate ? daysUntil(u.examDate) : null

  return (
    <div className="staff-page">
      <Link to={base} className="staff-back">
        ← {me.role === 'admin' ? 'All students' : 'My students'}
      </Link>

      <header className="stu-head">
        <span className="stu-head__avatar">
          <Avatar user={u} scale={4} />
        </span>
        <div className="stu-head__who">
          <p className="staff-eyebrow">STUDENT · ADDED {formatDate(u.createdAt).toUpperCase()}</p>
          <h1>{u.name}</h1>
          <dl className="stu-head__facts">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${u.email}`}>{u.email}</a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{u.phone ? <a href={`tel:${u.phone.replace(/\s/g, '')}`}>{u.phone}</a> : '—'}</dd>
            </div>
            <div>
              <dt>Teacher</dt>
              <dd>{teacher ?? 'Not assigned'}</dd>
            </div>
            <div>
              <dt>Exam date</dt>
              <dd>{u.examDate ? `${formatDate(u.examDate)}${exam !== null ? ` · ${exam >= 0 ? `in ${exam} days` : 'taken'}` : ''}` : 'Not booked'}</dd>
            </div>
            <div>
              <dt>Last active</dt>
              <dd>{ago(r.lastActive)}</dd>
            </div>
            <div>
              <dt>Rank · XP</dt>
              <dd>
                {r.rank.title} · {r.xp} XP · streak {r.streak}
              </dd>
            </div>
          </dl>
          {u.notes && <p className="stu-head__notes">“{u.notes}”</p>}
        </div>
        <div className="stu-head__band">
          <span>Overall band</span>
          <strong>{bandText(r.overallBand)}</strong>
          <small>{u.targetBand ? `target ${u.targetBand.toFixed(1)}` : 'no target set'}</small>
          {u.targetBand && r.overallBand !== null && (
            <small className={r.overallBand >= u.targetBand ? 'is-ok' : 'is-gap'}>
              {r.overallBand >= u.targetBand ? 'on target' : `${(u.targetBand - r.overallBand).toFixed(1)} to go`}
            </small>
          )}
        </div>
      </header>

      <div className="stu-sections">
        {SECTIONS.map((s) => {
          const sec = r.sections[s]
          return (
            <section key={s} className={`stu-sec stu-sec--${s}`} aria-labelledby={`stu-sec-${s}`}>
              <h2 id={`stu-sec-${s}`}>{SECTION_NAME[s]}</h2>
              <dl className="stu-sec__stats">
                <div>
                  <dt>Tests done</dt>
                  <dd>
                    {pct(sec.testsShare)}
                    <small>
                      {sec.testsDone} of {sec.testsTotal}
                    </small>
                  </dd>
                </div>
                <div>
                  <dt>Average band</dt>
                  <dd>
                    {bandText(sec.avgBand)}
                    <small>best {bandText(sec.bestBand)}</small>
                  </dd>
                </div>
                <div>
                  <dt>Video lessons</dt>
                  <dd>
                    {sec.lecturesDone}/{sec.lecturesTotal}
                    <small>{sec.attempts} attempts in all</small>
                  </dd>
                </div>
              </dl>
              <span className="stu-sec__meter" aria-hidden="true">
                <span style={{ '--w': `${Math.round(sec.testsShare * 100)}%` } as CSSProperties} />
              </span>
              <LectureList section={s} progress={(id) => state.lectures[lectureKey(s, id)]} />
            </section>
          )
        })}
      </div>

      <section className="stu-results" aria-labelledby="stu-results-title">
        <h2 id="stu-results-title">Results</h2>
        {r.attempts.length === 0 ? (
          <p className="roster__empty">No tests taken yet.</p>
        ) : (
          <>
            <div className="roster__scroll">
              <table className="stu-results__table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Section</th>
                    <th scope="col">Test</th>
                    <th scope="col">Score</th>
                    <th scope="col">Band</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {r.attempts.slice(0, shown).map((a, i) => (
                    <tr key={`${a.at}-${i}`}>
                      <td>{formatDate(a.at)}</td>
                      <td>
                        <span className={`stu-chip stu-chip--${a.section}`}>{SECTION_NAME[a.section as SectionId]}</span>
                      </td>
                      <td>
                        {testTitle(a.section, a.practiceId)}
                        {testFormat(a.section, a.practiceId) === 'full' && <span className="stu-full">FULL</span>}
                      </td>
                      <td>
                        {a.score}/{a.total}
                        {a.section === 'writing' ? <small> checklist</small> : null}
                      </td>
                      <td>
                        <strong>{bandText(a.band)}</strong>
                      </td>
                      <td>{Math.max(1, Math.round(a.durationSec / 60))} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {shown < r.attempts.length && (
              <button type="button" className="staff-btn staff-btn--ghost" onClick={() => setShown((n) => n + 20)}>
                Show more ({r.attempts.length - shown} left)
              </button>
            )}
          </>
        )}
      </section>
    </div>
  )
}

function LectureList({ section, progress }: { section: SectionId; progress: (id: string) => LectureProgress | undefined }) {
  return (
    <details className="stu-lectures">
      <summary>Video lessons</summary>
      <ol>
        {CATALOG[section].lectures.map((l) => {
          const p = progress(l.id)
          const done = Boolean(p?.completedAt)
          const w = p?.watched ?? 0
          return (
            <li key={l.id} className={done ? 'is-done' : w > 0 ? 'is-started' : ''}>
              <span aria-hidden="true">{done ? '✓' : w > 0 ? '◐' : '·'}</span>
              {l.title}
              <small>{done ? `watched ${formatDate(p?.completedAt, false)}` : w > 0 ? `${Math.round(w * 100)}%` : 'not started'}</small>
            </li>
          )
        })}
      </ol>
    </details>
  )
}
