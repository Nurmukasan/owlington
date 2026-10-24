import { useUser } from '../../auth/auth-context'
import { listMyStudents } from '../../auth/mockAuthApi'
import { SECTIONS, studentReport } from '../../learn/roster'
import { RosterTable } from './RosterTable'
import { bandText, pct, SECTION_NAME, useLive } from './useRoster'

/** The teacher's home: the students the admin has given them, and how each is doing. */
export default function TeacherHome() {
  const user = useUser()
  const [{ reports, active }] = useLive(() => {
    const list = listMyStudents().map(studentReport)
    const weekAgo = Date.now() - 7 * 86400000
    return { reports: list, active: list.filter((r) => r.lastActive && new Date(r.lastActive).getTime() > weekAgo).length }
  })
  const bands = reports.map((r) => r.overallBand).filter((b): b is number => b !== null)
  const avgOverall = bands.length ? Math.round((bands.reduce((a, b) => a + b, 0) / bands.length) * 2) / 2 : null

  return (
    <div className="staff-page">
      <header className="staff-head">
        <p className="staff-eyebrow">TEACHER · MY STUDENTS</p>
        <h1>Good to see you, {user.firstName}.</h1>
        <p className="staff-lead">
          These are the students the administrator has placed with you. Open a student to see every test, band and video lesson.
        </p>
      </header>

      <ul className="staff-tiles" aria-label="Your group at a glance">
        <li>
          <span>Students</span>
          <strong>{reports.length}</strong>
        </li>
        <li>
          <span>Active this week</span>
          <strong>
            {active}
            <small>/{reports.length}</small>
          </strong>
        </li>
        <li>
          <span>Average overall band</span>
          <strong>{bandText(avgOverall)}</strong>
        </li>
        {SECTIONS.map((s) => {
          const share = reports.length ? reports.reduce((n, r) => n + r.sections[s].testsShare, 0) / reports.length : 0
          return (
            <li key={s} className={`staff-tiles__sec staff-tiles__sec--${s}`}>
              <span>{SECTION_NAME[s]} tests done</span>
              <strong>{pct(share)}</strong>
            </li>
          )
        })}
      </ul>

      <RosterTable
        reports={reports}
        linkBase="/teacher/student"
        empty="No students yet. When the administrator assigns students to you, they will appear here."
      />
    </div>
  )
}
