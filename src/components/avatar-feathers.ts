import type { User } from '../auth/mockAuthApi'

/** Preset owlet feather colours (b = body, d = wings) a student can pick from. */
export const FEATHERS = [
  { name: 'Barn brown', b: '#7f5236', d: '#523220' },
  { name: 'Midnight blue', b: '#5b63b8', d: '#3b4185' },
  { name: 'Forest teal', b: '#3f8f7f', d: '#286457' },
  { name: 'Plum', b: '#a0527a', d: '#723656' },
  { name: 'Olive', b: '#8c7a3a', d: '#5f5224' },
  { name: 'Fox red', b: '#c0603f', d: '#86402a' },
  { name: 'Snowy', b: '#c9c6d6', d: '#8f8ba3' },
  { name: 'Raven', b: '#3c3a52', d: '#24233a' },
]

/** The feather index for a user: their pick, or a stable default from their id. */
export function featherIndexFor(user: User) {
  if (user.avatar?.kind === 'owl') return user.avatar.feathers % FEATHERS.length
  let h = 0
  for (const ch of user.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h % 6
}
