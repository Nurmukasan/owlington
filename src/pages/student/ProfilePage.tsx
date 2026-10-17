import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '../../auth/auth-context'
import { Avatar } from '../../components/Avatar'

/** Student profile — placeholder until we design it properly. */
export default function ProfilePage() {
  const user = useUser()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const joined = new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <section className="panel pixel-panel" style={{ '--accent': 'var(--amber)' } as CSSProperties}>
      <header className="panel__header">
        <span className="panel__icon panel__icon--avatar">
          <Avatar user={user} scale={5} />
        </span>
        <div>
          <p className="panel__eyebrow">STUDENT · JOINED {joined.toUpperCase()}</p>
          <h1 className="panel__title panel__title--name">{user.name}</h1>
          <p className="panel__email">{user.email}</p>
        </div>
      </header>

      <div className="panel__empty">
        <p className="panel__empty-title">Your profile is still hatching</p>
        <p>Soon you’ll find your progress, target band, saved lectures and settings here.</p>
      </div>

      <div className="panel__actions">
        <Link to="/student" className="panel__back">
          ◀ Back to the forest
        </Link>
        <button
          type="button"
          className="pixel-button notched"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          LOG OUT
        </button>
      </div>
    </section>
  )
}
