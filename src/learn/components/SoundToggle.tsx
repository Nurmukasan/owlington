import { setMuted, sfx, useSfxMuted } from '../sfx'

export function SoundToggle({ className = '' }: { className?: string }) {
  const muted = useSfxMuted()
  return (
    <button
      type="button"
      className={`sound-toggle ${muted ? 'is-muted' : ''} ${className}`}
      aria-pressed={!muted}
      aria-label={muted ? 'Turn sound effects on' : 'Turn sound effects off'}
      title={muted ? 'Sound off' : 'Sound on'}
      onClick={() => {
        setMuted(!muted)
        if (muted) sfx.click()
      }}
    >
      <span aria-hidden="true">♪</span>
    </button>
  )
}
