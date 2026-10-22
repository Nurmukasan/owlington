import { Link, NavLink } from 'react-router-dom'
import type { CSSProperties } from 'react'
import type { User } from '../../auth/mockAuthApi'
import { Avatar } from '../../components/Avatar'
import { PixelSprite } from '../../components/PixelSprite'
import { SECTIONS } from '../../data/sections'
import { SoundToggle } from '../../learn/components/SoundToggle'
import { StreakFlame } from '../../learn/components/ProgressWidgets'
import { useProgress } from '../../learn/useProgress'
import { OWL_HEAD } from '../../scene/sprites'

export function StudentNav({ user }: { user: User }) {
  const progress = useProgress()
  const { rank, streak, xp } = progress

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

      <div className="hud__stats" title={`Rank ${rank.rank} · ${rank.title} · ${xp} XP`}>
        <StreakFlame streak={streak} scale={2} />
        <span className="hud__level">
          <span aria-hidden="true">RANK</span>
          <span className="visually-hidden">Rank</span> {rank.rank}
        </span>
      </div>
      <SoundToggle className="hud__sound" />

      <NavLink to="/student/profile" className="hud__avatar" title={user.name} aria-label="Your profile">
        <Avatar user={user} scale={2} />
      </NavLink>
    </header>
  )
}
