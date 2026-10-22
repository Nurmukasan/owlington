import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '../../../auth/auth-context'
import { AuthError, MIN_PASSWORD, type User } from '../../../auth/mockAuthApi'
import { Avatar } from '../../../components/Avatar'
import { FEATHERS, featherIndexFor } from '../../../components/avatar-feathers'
import { PixelSprite } from '../../../components/PixelSprite'
import { OWL_HEAD } from '../../../scene/sprites'
import { DAILY_GOALS } from '../../../learn/progress'
import { setMuted, sfx, useSfxMuted } from '../../../learn/sfx'
import type { ProgressView } from '../../../learn/useProgress'

const PHOTO_PX = 160

type Status = { kind: 'ok' | 'error'; text: string } | null

const messageOf = (e: unknown) => (e instanceof AuthError ? e.message : 'Something went wrong. Please try again.')

/** Crops a picture to a centred square and shrinks it to a small JPEG data URL. */
async function squarePhoto(file: File) {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const side = Math.min(img.naturalWidth, img.naturalHeight)
    const canvas = document.createElement('canvas')
    canvas.width = PHOTO_PX
    canvas.height = PHOTO_PX
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no canvas')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, PHOTO_PX, PHOTO_PX)
    return canvas.toDataURL('image/jpeg', 0.85)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function Note({ status }: { status: Status }) {
  return (
    <p className={`pf-note ${status ? `is-${status.kind}` : ''}`} role={status?.kind === 'error' ? 'alert' : 'status'}>
      {status?.text}
    </p>
  )
}

function AvatarCard({ user }: { user: User }) {
  const { updateProfile } = useAuth()
  const [status, setStatus] = useState<Status>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const current = user.avatar?.kind === 'photo' ? -1 : featherIndexFor(user)

  const save = async (avatar: NonNullable<User['avatar']> | null, ok: string) => {
    setBusy(true)
    try {
      await updateProfile({ avatar })
      sfx.correct()
      setStatus({ kind: 'ok', text: ok })
    } catch (e) {
      setStatus({ kind: 'error', text: messageOf(e) })
    } finally {
      setBusy(false)
    }
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setStatus({ kind: 'error', text: 'That file isn’t a picture. Try a JPG or PNG.' })
      return
    }
    try {
      const src = await squarePhoto(file)
      await save({ kind: 'photo', src }, 'Photo saved. Looking sharp!')
    } catch {
      setStatus({ kind: 'error', text: 'Couldn’t read that picture. Try another one.' })
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <section className="pf-card pf-settings__avatar" aria-labelledby="pf-avatar-title">
      <header className="pf-card__head">
        <h2 id="pf-avatar-title" className="pf-card__title">
          Avatar
        </h2>
        <p className="pf-card__note">Pick your owlet’s feathers, or use a photo.</p>
      </header>
      <div className="pf-avatar">
        <span className="pf-avatar__preview">
          <Avatar user={user} scale={6} />
        </span>
        <div className="pf-avatar__pick">
          <ul className="pf-feathers" aria-label="Owlet feathers">
            {FEATHERS.map((f, i) => (
              <li key={f.name}>
                <button
                  type="button"
                  className={`pf-feather ${current === i ? 'is-active' : ''}`}
                  aria-pressed={current === i}
                  aria-label={f.name}
                  title={f.name}
                  disabled={busy}
                  onClick={() => save({ kind: 'owl', feathers: i }, `${f.name} it is!`)}
                >
                  <PixelSprite sprite={OWL_HEAD} palette={{ b: f.b, d: f.d }} scale={2} />
                </button>
              </li>
            ))}
          </ul>
          <div className="pf-avatar__photo">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="visually-hidden"
              id="pf-photo"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <label htmlFor="pf-photo" className={`btn btn--ghost notched ${busy ? 'is-busy' : ''}`}>
              {user.avatar?.kind === 'photo' ? 'Change photo' : 'Upload a photo'}
            </label>
            {user.avatar?.kind === 'photo' && (
              <button type="button" className="pf-linkbtn" disabled={busy} onClick={() => save(null, 'Photo removed — your owlet is back.')}>
                Remove photo
              </button>
            )}
          </div>
          <Note status={status} />
        </div>
      </div>
    </section>
  )
}

function AccountCard({ user }: { user: User }) {
  const { updateProfile } = useAuth()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<Status>(null)
  const [busy, setBusy] = useState(false)
  const emailChanged = email.trim().toLowerCase() !== user.email
  const dirty = name.trim() !== user.name || emailChanged

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!dirty) return
    setBusy(true)
    try {
      await updateProfile({ name, ...(emailChanged ? { email, password } : {}) })
      setPassword('')
      setStatus({ kind: 'ok', text: 'Saved.' })
    } catch (err) {
      setStatus({ kind: 'error', text: messageOf(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="pf-card" aria-labelledby="pf-account-title">
      <header className="pf-card__head">
        <h2 id="pf-account-title" className="pf-card__title">
          Account
        </h2>
      </header>
      <form className="pf-form" onSubmit={submit}>
        <label className="pf-field">
          <span>Name</span>
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
        <label className="pf-field">
          <span>Email</span>
          <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        {emailChanged && (
          <label className="pf-field">
            <span>Current password (to change your email)</span>
            <input
              name="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
        )}
        <div className="pf-form__foot">
          <button type="submit" className="btn btn--amber notched" disabled={!dirty || busy}>
            Save changes
          </button>
          <Note status={status} />
        </div>
      </form>
    </section>
  )
}

function PasswordCard() {
  const { changePassword } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [again, setAgain] = useState('')
  const [status, setStatus] = useState<Status>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (next !== again) {
      setStatus({ kind: 'error', text: 'The two new passwords don’t match.' })
      return
    }
    setBusy(true)
    try {
      await changePassword(current, next)
      setCurrent('')
      setNext('')
      setAgain('')
      setStatus({ kind: 'ok', text: 'Password changed.' })
    } catch (err) {
      setStatus({ kind: 'error', text: messageOf(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="pf-card" aria-labelledby="pf-password-title">
      <header className="pf-card__head">
        <h2 id="pf-password-title" className="pf-card__title">
          Password
        </h2>
      </header>
      <form className="pf-form" onSubmit={submit}>
        <input type="text" name="username" autoComplete="username" hidden readOnly />
        <label className="pf-field">
          <span>Current password</span>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </label>
        <label className="pf-field">
          <span>New password</span>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD}
            required
          />
        </label>
        <label className="pf-field">
          <span>New password again</span>
          <input
            type="password"
            value={again}
            onChange={(e) => setAgain(e.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD}
            required
          />
        </label>
        <p className="pf-field__hint">At least {MIN_PASSWORD} characters.</p>
        <div className="pf-form__foot">
          <button type="submit" className="btn btn--amber notched" disabled={busy}>
            Change password
          </button>
          <Note status={status} />
        </div>
      </form>
    </section>
  )
}

function PreferencesCard({ progress }: { progress: ProgressView }) {
  const muted = useSfxMuted()
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <section className="pf-card" aria-labelledby="pf-prefs-title">
      <header className="pf-card__head">
        <h2 id="pf-prefs-title" className="pf-card__title">
          Preferences
        </h2>
      </header>
      <div className="pf-prefs">
        <label className="pf-switch">
          <input
            type="checkbox"
            role="switch"
            checked={!muted}
            onChange={(e) => {
              setMuted(!e.target.checked)
              if (e.target.checked) sfx.click()
            }}
          />
          <span className="pf-switch__track" aria-hidden="true" />
          Sound effects
        </label>
        <label className="pf-select">
          <span>Daily goal</span>
          <select value={progress.today.goal} onChange={(e) => progress.setDailyGoal(Number(e.target.value))}>
            {DAILY_GOALS.map((g) => (
              <option key={g} value={g}>
                {g} XP a night
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="pf-prefs__out">
        <button
          type="button"
          className="btn btn--ghost notched"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          Log out
        </button>
      </div>
    </section>
  )
}

export function SettingsTab({ progress }: { progress: ProgressView }) {
  const user = useUser()
  return (
    <div className="pf-settings">
      <AvatarCard user={user} />
      <AccountCard user={user} />
      <PasswordCard />
      <PreferencesCard progress={progress} />
    </div>
  )
}
