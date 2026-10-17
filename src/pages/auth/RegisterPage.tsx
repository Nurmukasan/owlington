import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { homeFor, useAuth } from '../../auth/auth-context'
import { AuthError, type Role } from '../../auth/mockAuthApi'
import { PixelSprite } from '../../components/PixelSprite'
import { BOOK_ICON, PENCIL_ICON } from '../../scene/sprites'
import { AuthLayout } from './AuthLayout'

const ROLES: { id: Role; title: string; text: string; icon: typeof BOOK_ICON }[] = [
  { id: 'student', title: 'Student', text: 'I’m preparing for IELTS', icon: BOOK_ICON },
  { id: 'teacher', title: 'Teacher', text: 'I teach IELTS', icon: PENCIL_ICON },
]

const MIN_PASSWORD = 8

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [role, setRole] = useState<Role>(params.get('role') === 'teacher' ? 'teacher' : 'student')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user && !busy) return <Navigate to={homeFor(user.role)} replace />

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (!name) return setError('Please tell us your name.')
    if (password.length < MIN_PASSWORD) return setError(`Your password needs at least ${MIN_PASSWORD} characters.`)

    setError('')
    setBusy(true)
    try {
      const created = await register({ name, email, password, role })
      navigate(homeFor(created.role), { replace: true })
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        <>
          Already have one? <Link to="/login">Log in</Link>
        </>
      }
      aside={{
        heading: 'A group of owls is called a parliament.',
        text: 'Welcome to ours — a moonlit place to get ready for IELTS Reading, Listening and Writing.',
      }}
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <fieldset className="role-picker">
          <legend>I am a…</legend>
          {ROLES.map((r) => (
            <label key={r.id} className={`role-option ${role === r.id ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={role === r.id}
                onChange={() => setRole(r.id)}
              />
              <span className="role-option__icon">
                <PixelSprite sprite={r.icon} scale={3} />
              </span>
              <span className="role-option__title">{r.title}</span>
              <span className="role-option__text">{r.text}</span>
            </label>
          ))}
        </fieldset>

        <label className="field">
          <span>Full name</span>
          <input name="name" autoComplete="name" placeholder="Aruzhan Bekova" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD}
            placeholder={`At least ${MIN_PASSWORD} characters`}
            required
          />
        </label>

        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--ink notched auth-form__submit" disabled={busy}>
          {busy ? 'Creating your nest…' : `Join as a ${role}`}
        </button>
      </form>
    </AuthLayout>
  )
}
