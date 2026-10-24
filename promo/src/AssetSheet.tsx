/** Still renders of the mascot and logo, used as Seedance reference images (promo/seedance/). */
import { PixelSprite } from '../../src/components/PixelSprite'
import { OWL_HEAD } from '../../src/scene/sprites'
import { Owl, type OwlPose } from './Owl'

const POSES: Record<string, OwlPose> = {
  front: {},
  point: { wingR: 105, tilt: 8, lookX: 0.8, lookY: -0.3 },
  happy: { happy: true, wingL: 70, wingR: 70, hop: 10 },
  wink: { wink: 1, wingR: 60, tilt: -8, beak: 0.6 },
  nod: { nod: 1, happy: true },
}

export function AssetSheet({ name }: { name: string }) {
  if (name === 'logo') {
    return (
      <div id="asset" style={{ display: 'inline-flex', alignItems: 'center', gap: 36, padding: 40, color: '#fff1c9', fontFamily: 'var(--font-pixel)', fontSize: 96, textShadow: '8px 8px 0 #3b2b6e' }}>
        <PixelSprite sprite={OWL_HEAD} scale={14} />
        OWLINGTON
      </div>
    )
  }
  if (name === 'sheet') {
    return (
      <div id="asset" style={{ display: 'flex', gap: 30, padding: 60, background: '#f7f0e3' }}>
        {Object.entries(POSES).map(([k, p]) => (
          <div key={k} style={{ display: 'grid', justifyItems: 'center', gap: 10, fontFamily: 'var(--font-pixel)', fontSize: 22, color: '#14163a' }}>
            <Owl id={`sheet-${k}`} width={300} pose={p} />
            {k.toUpperCase()}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div id="asset" style={{ display: 'inline-block', padding: 30 }}>
      <Owl id="asset-owl" width={700} pose={POSES[name] ?? {}} shadow={false} />
    </div>
  )
}
