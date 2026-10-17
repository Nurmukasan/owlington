import { Link } from 'react-router-dom'
import { NightScene } from '../components/NightScene'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="not-found">
      <NightScene className="not-found__scene" seed={404} />
      <div className="not-found__box pixel-panel">
        <p className="not-found__code">404</p>
        <h1>Lost in the woods</h1>
        <p>Even owls take a wrong turn sometimes. This page doesn’t exist.</p>
        <Link to="/" className="pixel-link">
          ◀ FLY HOME
        </Link>
      </div>
    </div>
  )
}
