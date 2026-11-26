import { W, H, C, IMG } from './lib.jsx'
import { SHOTS } from './sc.jsx'
import { Caption5 } from './ui5.jsx'
import { CAPTIONS } from './captions.jsx'
import { T } from './times.jsx'

const END = T.END
const PLATES = 'max max_b room room_b room_open room_wide room_wide2 wall wall_b pile pile_b kitchen mirror mirror_talk mirror_talk2 klass klass_o call call_blink call_um call_um2 screen screen_talk examA examA_talk examB_um examB_blink examB_scared hall owl_open owl_wink owl_card sky'.split(' ')

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
      {CAPTIONS.map((c) => Caption5({ at: Math.max(0, c.at), dur: Math.min(c.dur, END - Math.max(0, c.at)), words: c.words }))}
    </frame>,
    { at: 0, dur: END }
  )
  p.cut(voice, { at: 0 })
}
