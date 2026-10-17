import { Link, NavLink } from 'react-router-dom'
import type { CSSProperties } from 'react'
import type { User } from '../../auth/mockAuthApi'
import { Avatar } from '../../components/Avatar'
import { PixelSprite } from '../../components/PixelSprite'
import { SECTIONS } from '../../data/sections'
import { OWL_HEAD } from '../../scene/sprites'

export function StudentNav({ user }: { user: User }) {
  return (
    <header className="hud pixel-panel">
      <Link to="/student" className="hud__brand" aria-label="Owlington — dashboard">
        <PixelSprite sprite={OWL_HEAD} scale={2} />
        <span className="hud__brand-name">OWLINGTON</span>
      </Link>

      <nav className="hud__tabs" aria-label="Sections">
        {SECTIONS.map((section) => (
          <NavLink
            key={section.id}
            to={`/student/${section.id}`}
            className="hud__tab notched"
            style={{ '--accent': section.color } as CSSProperties}
          >
            <PixelSprite sprite={section.icon} scale={2} className="hud__tab-icon" />
            <span>{section.title.toUpperCase()}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/student/profile" className="hud__avatar" title={user.name} aria-label="Your profile">
        <Avatar user={user} scale={2} />
      </NavLink>
    </header>
  )
}
