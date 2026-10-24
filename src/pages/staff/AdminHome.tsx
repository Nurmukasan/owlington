import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { assignStudents, createAccount, deleteAccount, listAccounts, updateAccount, type User } from '../../auth/mockAuthApi'
import { Avatar } from '../../components/Avatar'
import { studentReport } from '../../learn/roster'
import { AccountDialog, type AccountForm } from './AccountDialog'
import { bandText, formatDate, useLive } from './useRoster'

type Editing = { role: 'student' | 'teacher'; account?: User } | null

const toChanges = (f: AccountForm, role: 'student' | 'teacher') => ({
  firstName: f.firstName,
  lastName: f.lastName,
  email: f.email,
  phone: f.phone,
  notes: f.notes,
  ...(f.password ? { password: f.password } : {}),
  ...(role === 'student'
    ? { targetBand: f.targetBand ? Number(f.targetBand) : 0, examDate: f.examDate, teacherId: f.teacherId || null }
    : {}),
})

/** The admin's workspace: every student and teacher, and who looks after whom. */
export default function AdminHome() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'teachers' ? 'teachers' : 'students'
  const [data, refresh] = useLive(() => ({ students: listAccounts('student'), teachers: listAccounts('teacher') }))
  const [editing, setEditing] = useState<Editing>(null)

  const save = async (f: AccountForm) => {
    if (!editing) return
    const { role, account } = editing
    if (account) await updateAccount(account.id, toChanges(f, role))
    else
      await createAccount({
        role,
        firstName: f.firstName,
        lastName: f.lastName,
        email: f.email,
        password: f.password,
        phone: f.phone,
        notes: f.notes,
        ...(role === 'student' ? { targetBand: f.targetBand ? Number(f.targetBand) : undefined, examDate: f.examDate || undefined, teacherId: f.teacherId || undefined } : {}),
      })
    refresh()
  }

  return (
    <div className="staff-page">
      <header className="staff-head staff-head--row">
        <div>
          <p className="staff-eyebrow">ADMIN</p>
          <h1>{tab === 'students' ? 'Students' : 'Teachers'}</h1>
          <p className="staff-lead">
            {tab === 'students'
              ? 'Every student account. Add students, then place each one with a teacher — teachers only ever see their own group.'
              : 'Every teacher account. Each teacher sees only the students you assign to them.'}
          </p>
        </div>
        <button type="button" className="staff-btn" onClick={() => setEditing({ role: tab === 'students' ? 'student' : 'teacher' })}>
          + Add {tab === 'students' ? 'student' : 'teacher'}
        </button>
      </header>

      <nav className="staff-tabs" aria-label="Accounts">
        <button type="button" className={tab === 'students' ? 'is-on' : ''} aria-pressed={tab === 'students'} onClick={() => setParams({})}>
          Students <span>{data.students.length}</span>
        </button>
        <button type="button" className={tab === 'teachers' ? 'is-on' : ''} aria-pressed={tab === 'teachers'} onClick={() => setParams({ tab: 'teachers' })}>
          Teachers <span>{data.teachers.length}</span>
        </button>
      </nav>

      {tab === 'students' ? (
        <StudentsAdmin students={data.students} teachers={data.teachers} onEdit={(account) => setEditing({ role: 'student', account })} refresh={refresh} />
      ) : (
        <TeachersAdmin
          students={data.students}
          teachers={data.teachers}
          onEdit={(account) => setEditing({ role: 'teacher', account })}
          onShowGroup={(id) => setParams({ teacher: id })}
          refresh={refresh}
        />
      )}

      {editing && (
        <AccountDialog
          key={editing.account?.id ?? `new-${editing.role}`}
          role={editing.role}
          account={editing.account}
          teachers={data.teachers}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function StudentsAdmin({ students, teachers, onEdit, refresh }: { students: User[]; teachers: User[]; onEdit: (u: User) => void; refresh: () => void }) {
  const [params, setParams] = useSearchParams()
  const filter = params.get('teacher') ?? 'all'
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [target, setTarget] = useState('')
  const [note, setNote] = useState('')
  const teacherName = useMemo(() => new Map(teachers.map((t) => [t.id, t.name])), [teachers])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students
      .filter((s) => (filter === 'all' ? true : filter === 'none' ? !s.teacherId : s.teacherId === filter))
      .filter((s) => !q || `${s.name} ${s.email} ${s.phone ?? ''}`.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [students, filter, query])
  const bands = useMemo(() => new Map(rows.map((s) => [s.id, studentReport(s).overallBand])), [rows])
  const unassigned = students.filter((s) => !s.teacherId).length
  const allOn = rows.length > 0 && rows.every((r) => selected.has(r.id))

  const toggle = (id: string) =>
    setSelected((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const assign = (ids: string[], teacherId: string | null) => {
    assignStudents(ids, teacherId)
    setNote(
      `${ids.length} ${ids.length === 1 ? 'student' : 'students'} ${teacherId ? `assigned to ${teacherName.get(teacherId)}` : 'unassigned'}.`,
    )
    setSelected(new Set())
    refresh()
  }

  return (
    <section aria-label="Students">
      <div className="roster__tools">
        <label className="staff-field staff-field--search">
          <span className="visually-hidden">Search students</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email or phone…" />
        </label>
        <label className="staff-field staff-field--inline">
          <span>Teacher</span>
          <select
            value={filter}
            onChange={(e) => {
              setSelected(new Set())
              setParams(e.target.value === 'all' ? {} : { teacher: e.target.value })
            }}
          >
            <option value="all">All students</option>
            <option value="none">Not assigned ({unassigned})</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <p className="roster__count">{rows.length} shown</p>
      </div>

      <div className={`staff-bulk ${selected.size ? 'is-on' : ''}`} role="region" aria-label="Selected students">
        <strong>{selected.size} selected</strong>
        <label className="staff-field staff-field--inline">
          <span>Assign to</span>
          <select value={target} onChange={(e) => setTarget(e.target.value)} disabled={!selected.size}>
            <option value="">Choose a teacher…</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="staff-btn staff-btn--small" disabled={!selected.size || !target} onClick={() => assign([...selected], target)}>
          Assign
        </button>
        <button type="button" className="staff-btn staff-btn--ghost staff-btn--small" disabled={!selected.size} onClick={() => assign([...selected], null)}>
          Unassign
        </button>
        {note && (
          <span className="staff-msg is-ok" role="status">
            {note}
          </span>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="roster__empty">{students.length ? 'No student matches.' : 'No students yet — add the first one.'}</p>
      ) : (
        <div className="roster__scroll">
          <table className="roster__table admin-table">
            <thead>
              <tr>
                <th scope="col" className="admin-table__check">
                  <input
                    type="checkbox"
                    aria-label="Select all shown"
                    checked={allOn}
                    onChange={() => setSelected(allOn ? new Set() : new Set(rows.map((r) => r.id)))}
                  />
                </th>
                <th scope="col">Student</th>
                <th scope="col">Added</th>
                <th scope="col">Teacher</th>
                <th scope="col">Target · now</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className={selected.has(s.id) ? 'is-selected' : ''}>
                  <td className="admin-table__check">
                    <input type="checkbox" aria-label={`Select ${s.name}`} checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
                  </td>
                  <th scope="row" className="roster__who">
                    <Link to={`/admin/student/${s.id}`} className="roster__name">
                      <Avatar user={s} scale={2} />
                      <span>
                        <strong>{s.name}</strong>
                        <small>{s.email}</small>
                        <small>{s.phone ?? ''}</small>
                      </span>
                    </Link>
                  </th>
                  <td data-label="Added">{formatDate(s.createdAt)}</td>
                  <td data-label="Teacher">
                    <select
                      className="admin-table__teacher"
                      aria-label={`Teacher for ${s.name}`}
                      value={s.teacherId ?? ''}
                      onChange={(e) => assign([s.id], e.target.value || null)}
                    >
                      <option value="">— not assigned —</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Target · now">
                    {s.targetBand ? s.targetBand.toFixed(1) : '—'} · <strong>{bandText(bands.get(s.id))}</strong>
                  </td>
                  <td className="admin-table__actions">
                    <button type="button" className="staff-link" onClick={() => onEdit(s)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="staff-link staff-link--danger"
                      onClick={() => {
                        if (!window.confirm(`Remove ${s.name}? Their account and progress will be deleted.`)) return
                        deleteAccount(s.id)
                        refresh()
                      }}
                    >
                      Remove
                    </button>
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

function TeachersAdmin({
  students,
  teachers,
  onEdit,
  onShowGroup,
  refresh,
}: {
  students: User[]
  teachers: User[]
  onEdit: (u: User) => void
  onShowGroup: (id: string) => void
  refresh: () => void
}) {
  const counts = new Map<string, number>()
  for (const s of students) if (s.teacherId) counts.set(s.teacherId, (counts.get(s.teacherId) ?? 0) + 1)

  if (!teachers.length) return <p className="roster__empty">No teachers yet — add the first one.</p>
  return (
    <ul className="admin-teachers">
      {teachers.map((t) => (
        <li key={t.id} className="admin-teacher">
          <span className="admin-teacher__avatar">
            <Avatar user={t} scale={3} />
          </span>
          <div className="admin-teacher__body">
            <h2>{t.name}</h2>
            <p className="admin-teacher__contact">
              {t.email}
              {t.phone ? ` · ${t.phone}` : ''}
            </p>
            {t.notes && <p className="admin-teacher__notes">{t.notes}</p>}
            <p className="admin-teacher__since">Added {formatDate(t.createdAt)}</p>
          </div>
          <div className="admin-teacher__side">
            <button type="button" className="admin-teacher__count" onClick={() => onShowGroup(t.id)}>
              <strong>{counts.get(t.id) ?? 0}</strong>
              <span>students →</span>
            </button>
            <div className="admin-teacher__actions">
              <button type="button" className="staff-link" onClick={() => onEdit(t)}>
                Edit
              </button>
              <button
                type="button"
                className="staff-link staff-link--danger"
                onClick={() => {
                  if (!window.confirm(`Remove ${t.name}? Their ${counts.get(t.id) ?? 0} students will become unassigned.`)) return
                  deleteAccount(t.id)
                  refresh()
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
