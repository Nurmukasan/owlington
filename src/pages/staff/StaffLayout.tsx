import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '../../auth/auth-context'
import { Avatar } from '../../components/Avatar'
import { PixelSprite } from '../../components/PixelSprite'
import { OWL_HEAD } from '../../scene/sprites'
import './staff.css'

/** The shared frame of the teacher and admin workspaces: a light "staff room" with a top bar. */
export default function StaffLayout() {
  const user = useUser()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const base = user.role === 'admin' ? '/admin' : '/teacher'
  const tab = new URLSearchParams(search).get('tab')
  const links =
    user.role === 'admin'
      ? [
          { to: '/admin', label: 'Students', on: pathname === '/admin' && tab !== 'teachers' },
          { to: '/admin?tab=teachers', label: 'Teachers', on: pathname === '/admin' && tab === 'teachers' },
        ]
      : [{ to: '/teacher', label: 'My students', on: pathname === '/teacher' }]

  return (
    <div className="staff">
      <header className="staff__bar">
        <NavLink to={base} end className="staff__brand">
          <PixelSprite sprite={OWL_HEAD} scale={2} />
          <span>Owlington</span>
          <small>{user.role === 'admin' ? 'ADMIN' : 'TEACHER'}</small>
        </NavLink>
        <nav className="staff__nav" aria-label="Workspace">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`staff__link ${l.on ? 'is-on' : ''}`} aria-current={l.on ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="staff__me">
          <NavLink to={`${base}/profile`} className="staff__profile" title="Your profile">
            <Avatar user={user} scale={2} />
            <span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
          </NavLink>
          <button
            type="button"
            className="staff__logout"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Log out
          </button>
        </div>
      </header>
      <main className="staff__main">
        <Outlet />
      </main>
    </div>
  )
}
