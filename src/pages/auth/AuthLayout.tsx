import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { OwlMascot } from '../../components/OwlMascot'
import { PixelSprite } from '../../components/PixelSprite'
import { OWL_HEAD } from '../../scene/sprites'
import { StarField } from '../landing/decor'
import './Auth.css'

interface AuthLayoutProps {
  title: string
  subtitle: ReactNode
  aside: { heading: string; text: string }
  children: ReactNode
}

export function AuthLayout({ title, subtitle, aside, children }: AuthLayoutProps) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <StarField count={60} seed={5} />
        <Link to="/" className="auth__brand">
          <PixelSprite sprite={OWL_HEAD} scale={2} />
          <span>Owlington</span>
        </Link>
        <div className="auth__owl">
          <div className="auth__moon" aria-hidden="true" />
          <OwlMascot />
        </div>
        <div className="auth__aside-copy">
          <p className="auth__aside-heading">{aside.heading}</p>
          <p>{aside.text}</p>
        </div>
      </aside>

      <main className="auth__main">
        <div className="auth__card">
          <h1>{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  )
}
