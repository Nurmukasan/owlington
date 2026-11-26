import { W, H, C, IMG } from './lib.jsx'
import { SHOTS } from './sc.jsx'
import { Caption } from './ui.jsx'
import { CAPTIONS } from './captions.jsx'
import { T } from './times.jsx'

const END = T.END
const PLATES = ['u1', 'u2', 'u3', 'u3b', 'bus', 'bus_b', ...'room room_open room_blink room_wide room_wide2 room_smile room_happy room_up dict dict_b dict_owl speed1 speed2 slow bed bed_b bed_sad kitchen kitchen_shout kitchen_shout2 street street_b hall close close_scared close_smirk close_calm sheet owl_open owl_wink owl_happy sky'.split(' ')]

export default async ({ project }) => {
  const p = await project({ dir: '.', size: '720x1280', fps: 24, background: C.navy1 })
  await p.add('../fonts/PressStart2P-Regular.ttf')
  for (const k of PLATES) IMG[k] = await p.add(`plates/${k}.png`)
  const voice = await p.add('../voice.wav')
  const shots = [...SHOTS].sort((a, b) => a[0] - b[0])
  p.compose(
    <frame width={W} height={H} layout="none">
      {shots.map(([t, S], i) => S({ at: t, dur: (i + 1 < shots.length ? shots[i + 1][0] : END) - t }))}
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={{ kind: 'radial', stops: [{ offset: 0, color: '#000000', opacity: 0 }, { offset: 0.55, color: '#000000', opacity: 0 }, { offset: 0.8, color: '#05060f', opacity: 0.42 }] }} />
      {CAPTIONS.map((c) => Caption({ at: Math.max(0, c.at), dur: Math.min(c.dur, END - Math.max(0, c.at)), words: c.words }))}
    </frame>,
    { at: 0, dur: END }
  )
  p.cut(voice, { at: 0 })
}
