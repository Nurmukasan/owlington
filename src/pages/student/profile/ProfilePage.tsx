import type { CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useUser } from '../../../auth/auth-context'
import { Avatar } from '../../../components/Avatar'
import { StreakFlame } from '../../../learn/components/ProgressWidgets'
import { sfx } from '../../../learn/sfx'
import { useProgress } from '../../../learn/useProgress'
import { ProgressTab } from './ProgressTab'
import { ResultsTab } from './ResultsTab'
import { SettingsTab } from './SettingsTab'
import './profile.css'

type Tab = 'progress' | 'results' | 'settings'

const PANEL_ID = 'pf-panel'

/** The student's profile: progress, every result in one design, and settings. */
export default function ProfilePage() {
  const user = useUser()
  const progress = useProgress()
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const tab: Tab = raw === 'results' || raw === 'settings' ? raw : 'progress'
  const joined = new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const tabs: [Tab, string, number | null][] = [
    ['progress', 'Progress', null],
    ['results', 'Results', progress.state.attempts.length],
    ['settings', 'Settings', null],
  ]

  return (
    <div className="pf">
      <header className="pf-head">
        <Link
          to="/student/profile?tab=settings"
          className="pf-head__avatar"
          aria-label="Change your avatar"
          title="Change your avatar"
          onClick={() => sfx.click()}
        >
          <Avatar user={user} scale={5} />
          <span className="pf-head__edit" aria-hidden="true">
            ✎
          </span>
        </Link>
        <div className="pf-head__who">
          <p className="pf-head__eyebrow">Student · joined {joined}</p>
          <h1 className="pf-head__name">{user.name}</h1>
          <p className="pf-head__meta">
            <span className="pf-head__level" style={{ '--pf-p': progress.level.progress } as CSSProperties}>
              LV {progress.level.level} · {progress.level.title}
            </span>
            <StreakFlame streak={progress.streak} scale={2} className="pf-head__flame" />
            <span className="pf-head__xp">{progress.xp} XP</span>
          </p>
        </div>
      </header>

      <div className="pf-tabs" role="tablist" aria-label="Profile">
        {tabs.map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`pf-tab-${id}`}
            aria-selected={tab === id}
            aria-controls={PANEL_ID}
            className={`pf-tab ${tab === id ? 'is-active' : ''}`}
            onClick={() => {
              if (tab === id) return
              sfx.click()
              setParams(id === 'progress' ? {} : { tab: id })
            }}
          >
            {label}
            {count !== null && <span className="pf-tab__count">{count}</span>}
          </button>
        ))}
      </div>

      <section id={PANEL_ID} className="pf-panel" role="tabpanel" aria-labelledby={`pf-tab-${tab}`}>
        {tab === 'progress' && <ProgressTab progress={progress} />}
        {tab === 'results' && <ResultsTab progress={progress} panelId={PANEL_ID} />}
        {tab === 'settings' && <SettingsTab progress={progress} />}
      </section>
    </div>
  )
}
