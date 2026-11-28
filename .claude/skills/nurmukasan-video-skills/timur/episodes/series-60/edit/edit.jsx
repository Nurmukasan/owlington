import { W, H, C, IMG } from './lib.jsx'
import { SHOTS, VID } from './sc.jsx'
import { Caption5 } from './ui6.jsx'
import { CAPTIONS } from './captions.jsx'
import { T } from './times.jsx'

const END = T.END
const PLATES = 'hook hook_b fresh fresh_b laugh laugh_b read read_b dull wide tired tired_b focus happy happy_b nosub nosub_b laugh3 laugh3_b call call_talk call_um call_um2 call_blink end tv tv_talk tv_talk2 tv_laugh jscreen jscreen_talk jscreen_q examB_um examB_blink hall owl_open owl_wink sky scr_sher scr_sher_1 scr_sher_2 scr_sher_3 scr_bb scr_got examA examA_talk examA_huh examB_epic examB_epic_talk'.split(' ')

export default async ({ project }) => {
  const p = await project({ dir: '.', size: '720x1280', fps: 24, background: C.navy1 })
  await p.add('../fonts/PressStart2P-Regular.ttf')
  for (const k of PLATES) IMG[k] = await p.add(`plates/${k}.png`)
  VID.got = await p.add('plates/scr_got.mp4')
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
