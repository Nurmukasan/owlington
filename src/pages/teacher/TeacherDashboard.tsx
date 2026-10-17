import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '../../auth/auth-context'
import { PixelSprite } from '../../components/PixelSprite'
import { OWL_HEAD } from '../../scene/sprites'
import './teacher.css'

/** Placeholder — the teacher workspace gets its own design next. */
export default function TeacherDashboard() {
  const user = useUser()
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="teacher">
      <header className="teacher__nav">
        <Link to="/teacher" className="teacher__brand">
          <PixelSprite sprite={OWL_HEAD} scale={2} />
          <span>Owlington</span>
          <small>for teachers</small>
        </Link>
        <button
          type="button"
          className="btn btn--ink notched"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          Log out
        </button>
      </header>

      <main className="teacher__main">
        <p className="eyebrow eyebrow--ink">TEACHER DASHBOARD</p>
        <h1>
          Welcome, {user.name.split(' ')[0]}. <em>Your classroom is being built.</em>
        </h1>
        <p>
          Soon you’ll upload video lectures for Reading, Listening and Writing, organise them into courses and see
          how your students are doing. We’re designing this space next.
        </p>
      </main>
    </div>
  )
}
