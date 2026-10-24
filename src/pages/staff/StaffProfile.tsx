import { useState, type FormEvent } from 'react'
import { useAuth, useUser } from '../../auth/auth-context'
import { AuthError, MIN_PASSWORD } from '../../auth/mockAuthApi'
import { Avatar } from '../../components/Avatar'
import { formatDate } from './useRoster'

/** A teacher's or the admin's own details: name, phone, email and password. */
export default function StaffProfile() {
  const user = useUser()
  const { updateProfile, changePassword } = useAuth()
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '', email: user.email, password: '' })
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [pw, setPw] = useState({ current: '', next: '' })
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const emailChanged = form.email.trim().toLowerCase() !== user.email

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setMsg(null)
    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        ...(emailChanged ? { email: form.email, password: form.password } : {}),
      })
      setForm((f) => ({ ...f, password: '' }))
      setMsg({ ok: true, text: 'Saved.' })
    } catch (err) {
      setMsg({ ok: false, text: err instanceof AuthError ? err.message : 'Something went wrong.' })
    }
  }

  const savePw = async (e: FormEvent) => {
    e.preventDefault()
    setPwMsg(null)
    try {
      await changePassword(pw.current, pw.next)
      setPw({ current: '', next: '' })
      setPwMsg({ ok: true, text: 'Password changed.' })
    } catch (err) {
      setPwMsg({ ok: false, text: err instanceof AuthError ? err.message : 'Something went wrong.' })
    }
  }

  return (
    <div className="staff-page staff-page--narrow">
      <header className="stu-head stu-head--me">
        <span className="stu-head__avatar">
          <Avatar user={user} scale={4} />
        </span>
        <div className="stu-head__who">
          <p className="staff-eyebrow">{user.role === 'admin' ? 'ADMINISTRATOR' : 'TEACHER'} · SINCE {formatDate(user.createdAt).toUpperCase()}</p>
          <h1>{user.name}</h1>
          {user.notes && <p className="stu-head__notes">{user.notes}</p>}
        </div>
      </header>

      <form className="staff-card staff-form" onSubmit={save}>
        <h2>Your details</h2>
        <div className="staff-form__row">
          <label className="staff-field">
            <span>First name</span>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} autoComplete="given-name" required />
          </label>
          <label className="staff-field">
            <span>Last name</span>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} autoComplete="family-name" required />
          </label>
        </div>
        <div className="staff-form__row">
          <label className="staff-field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required />
          </label>
          <label className="staff-field">
            <span>Phone</span>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
          </label>
        </div>
        {emailChanged && (
          <label className="staff-field">
            <span>Current password (to change your email)</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required />
          </label>
        )}
        {msg && (
          <p className={`staff-msg ${msg.ok ? 'is-ok' : 'is-err'}`} role={msg.ok ? 'status' : 'alert'}>
            {msg.text}
          </p>
        )}
        <button type="submit" className="staff-btn">
          Save details
        </button>
      </form>

      <form className="staff-card staff-form" onSubmit={savePw}>
        <h2>Password</h2>
        <input type="text" name="username" autoComplete="username" value={user.email} hidden readOnly />
        <div className="staff-form__row">
          <label className="staff-field">
            <span>Current password</span>
            <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" required />
          </label>
          <label className="staff-field">
            <span>New password</span>
            <input
              type="password"
              value={pw.next}
              onChange={(e) => setPw({ ...pw, next: e.target.value })}
              autoComplete="new-password"
              minLength={MIN_PASSWORD}
              required
            />
          </label>
        </div>
        {pwMsg && (
          <p className={`staff-msg ${pwMsg.ok ? 'is-ok' : 'is-err'}`} role={pwMsg.ok ? 'status' : 'alert'}>
            {pwMsg.text}
          </p>
        )}
        <button type="submit" className="staff-btn staff-btn--ghost">
          Change password
        </button>
      </form>
    </div>
  )
}
