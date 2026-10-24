import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AuthError, MIN_PASSWORD, type User } from '../../auth/mockAuthApi'
import { suggestPassword } from './useRoster'

export interface AccountForm {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  notes: string
  targetBand: string
  examDate: string
  teacherId: string
}

interface AccountDialogProps {
  role: 'student' | 'teacher'
  /** The account being edited, or undefined to add a new one. */
  account?: User
  teachers: User[]
  onSave: (form: AccountForm) => Promise<void>
  onClose: () => void
}

/** Add or edit a student or a teacher. After adding, the dialog shows the login to pass on. */
export function AccountDialog({ role, account, teachers, onSave, onClose }: AccountDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [form, setForm] = useState<AccountForm>(() => ({
    firstName: account?.firstName ?? '',
    lastName: account?.lastName ?? '',
    email: account?.email ?? '',
    password: account ? '' : suggestPassword(),
    phone: account?.phone ?? '',
    notes: account?.notes ?? '',
    targetBand: account?.targetBand ? String(account.targetBand) : '',
    examDate: account?.examDate ?? '',
    teacherId: account?.teacherId ?? '',
  }))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ email: string; password: string } | null>(null)
  const set = (k: keyof AccountForm) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const noun = role === 'student' ? 'student' : 'teacher'

  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password && form.password.length < MIN_PASSWORD) {
      setError(`The password needs at least ${MIN_PASSWORD} characters.`)
      return
    }
    setBusy(true)
    try {
      await onSave(form)
      if (!account || form.password) setDone({ email: form.email.trim().toLowerCase(), password: form.password })
      else onClose()
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={ref}
      className="staff-dialog"
      aria-labelledby="staff-dialog-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      {done ? (
        <div className="staff-dialog__inner">
          <p className="staff-eyebrow">{account ? 'PASSWORD RESET' : `${noun.toUpperCase()} ADDED`}</p>
          <h2 id="staff-dialog-title">Pass these on</h2>
          <p>
            {form.firstName} can log in at the Owlington login page with:
          </p>
          <dl className="staff-creds">
            <div>
              <dt>Email</dt>
              <dd>{done.email}</dd>
            </div>
            <div>
              <dt>Password</dt>
              <dd>{done.password}</dd>
            </div>
          </dl>
          <p className="staff-hint">The password is shown only now. They can change it in their profile.</p>
          <div className="staff-dialog__actions">
            <button
              type="button"
              className="staff-btn staff-btn--ghost"
              onClick={() => navigator.clipboard?.writeText(`Email: ${done.email}\nPassword: ${done.password}`)}
            >
              Copy
            </button>
            <button type="button" className="staff-btn" onClick={onClose} autoFocus>
              Done
            </button>
          </div>
        </div>
      ) : (
        <form className="staff-dialog__inner staff-form" onSubmit={submit}>
          <p className="staff-eyebrow">{account ? `EDIT ${noun.toUpperCase()}` : `NEW ${noun.toUpperCase()}`}</p>
          <h2 id="staff-dialog-title">{account ? account.name : `Add a ${noun}`}</h2>
          <div className="staff-form__row">
            <label className="staff-field">
              <span>First name</span>
              <input value={form.firstName} onChange={set('firstName')} required autoFocus />
            </label>
            <label className="staff-field">
              <span>Last name</span>
              <input value={form.lastName} onChange={set('lastName')} required />
            </label>
          </div>
          <div className="staff-form__row">
            <label className="staff-field">
              <span>Email (their login)</span>
              <input type="email" value={form.email} onChange={set('email')} required />
            </label>
            <label className="staff-field">
              <span>Phone</span>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+7 7xx xxx xx xx" />
            </label>
          </div>
          {role === 'student' && (
            <div className="staff-form__row staff-form__row--3">
              <label className="staff-field">
                <span>Teacher</span>
                <select value={form.teacherId} onChange={set('teacherId')}>
                  <option value="">Not assigned yet</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="staff-field">
                <span>Target band</span>
                <select value={form.targetBand} onChange={set('targetBand')}>
                  <option value="">—</option>
                  {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => (
                    <option key={b} value={b}>
                      {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="staff-field">
                <span>Exam date</span>
                <input type="date" value={form.examDate} onChange={set('examDate')} />
              </label>
            </div>
          )}
          <label className="staff-field">
            <span>{role === 'student' ? 'Notes (level, goals, group…)' : 'About (subjects, experience…)'}</span>
            <textarea value={form.notes} onChange={set('notes')} rows={2} />
          </label>
          <label className="staff-field">
            <span>{account ? 'New password (leave empty to keep the current one)' : 'Starting password'}</span>
            <span className="staff-field__with-btn">
              <input value={form.password} onChange={set('password')} required={!account} minLength={MIN_PASSWORD} autoComplete="new-password" />
              <button type="button" className="staff-btn staff-btn--ghost staff-btn--small" onClick={() => setForm((f) => ({ ...f, password: suggestPassword() }))}>
                Generate
              </button>
            </span>
          </label>
          {error && (
            <p className="staff-msg is-err" role="alert">
              {error}
            </p>
          )}
          <div className="staff-dialog__actions">
            <button type="button" className="staff-btn staff-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="staff-btn" disabled={busy}>
              {account ? 'Save changes' : `Add ${noun}`}
            </button>
          </div>
        </form>
      )}
    </dialog>
  )
}
