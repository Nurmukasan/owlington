import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { homeFor, useAuth } from '../../auth/auth-context'
import { AuthError } from '../../auth/mockAuthApi'
import { AuthLayout } from './AuthLayout'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user && !busy) return <Navigate to={homeFor(user.role)} replace />

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError('')
    setBusy(true)
    try {
      const loggedIn = await login(String(form.get('email') ?? ''), String(form.get('password') ?? ''))
      const from = (location.state as { from?: string } | null)?.from
      const home = homeFor(loggedIn.role)
      navigate(from?.startsWith(home) ? from : home, { replace: true })
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <>
          New to Owlington? <Link to="/register">Create an account</Link>
        </>
      }
      aside={{
        heading: 'The owl kept your branch warm.',
        text: 'Log in to pick up where you left off — the stars are already out.',
      }}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>

        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--ink notched auth-form__submit" disabled={busy}>
          {busy ? 'Opening the forest…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}
