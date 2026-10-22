import type { User } from '../auth/mockAuthApi'
import { OWL_HEAD } from '../scene/sprites'
import { FEATHERS, featherIndexFor } from './avatar-feathers'
import { PixelSprite } from './PixelSprite'
import './Avatar.css'

/** The student's avatar: an uploaded photo, or an owlet in their feather colour. */
export function Avatar({ user, scale = 2 }: { user: User; scale?: number }) {
  if (user.avatar?.kind === 'photo') {
    const size = 18 * scale
    return <img className="avatar-photo" src={user.avatar.src} alt="" width={size} height={size} />
  }
  const { b, d } = FEATHERS[featherIndexFor(user)]
  return <PixelSprite sprite={OWL_HEAD} palette={{ b, d }} scale={scale} />
}
