import { Link } from 'react-router-dom'
import { lectures } from './content'

/** PLACEHOLDER — replaced by the Reading section build. */
export default function ReadingHub() {
  return (
    <div style={{ padding: 'calc(var(--hud-space) + 24px) 24px', color: '#fff' }}>
      <h1>Reading</h1>
      {lectures.map((l) => (
        <Link key={l.id} to={`lecture/${l.id}`} style={{ display: 'block', color: '#ffb627' }}>
          {l.title}
        </Link>
      ))}
    </div>
  )
}
