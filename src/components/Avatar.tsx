import type { User } from '../auth/mockAuthApi'
import { OWL_HEAD } from '../scene/sprites'
import { PixelSprite } from './PixelSprite'

// Every student is an owlet; the feather colour is picked from their id.
const FEATHERS = [
  { b: '#7f5236', d: '#523220' },
  { b: '#5b63b8', d: '#3b4185' },
  { b: '#3f8f7f', d: '#286457' },
  { b: '#a0527a', d: '#723656' },
  { b: '#8c7a3a', d: '#5f5224' },
  { b: '#c0603f', d: '#86402a' },
]

function featherFor(id: string) {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return FEATHERS[h % FEATHERS.length]
}

export function Avatar({ user, scale = 2 }: { user: User; scale?: number }) {
  return <PixelSprite sprite={OWL_HEAD} palette={featherFor(user.id)} scale={scale} />
}
