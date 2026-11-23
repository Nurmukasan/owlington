import { W, H, C, IMG, VID } from './lib.jsx'
import { SHOTS, OVERLAYS } from './sc.jsx'
import { Caption } from './ui.jsx'
import { CAPTIONS } from './captions.jsx'
import { T } from './times.jsx'
// every still in plates/ and every clip in clips/ must be listed here
const PL = 'room hook level mock55 pile friends cafe kitchen phone bedsad planner drawer eyes deskback trash listen readtop write mirror alarm sleep ressad cry hug sunrise happy park qclose speak reslap window calendar logo'.split(' ')
const CL = 'v_hook v_room v_bun v_brain v_cry v_cry2 v_owl v_sun v_hall v_jump v_cta'.split(' ')
export default async ({ project }) => {
  const p = await project({ dir: '.', size: '720x1280', fps: 24, background: C.ink })
  await p.add('PressStart2P-Regular.ttf')
  for (const k of PL) IMG[k] = await p.add(`plates/${k}.png`)
  for (const k of CL) VID[k] = await p.add(`clips/${k}.mp4`)
  const voice = await p.add('voice.wav')
  const END = T.END
  p.compose(
    <frame width={W} height={H} layout="none">
      {SHOTS()}
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={{ kind: 'radial', stops: [{ offset: 0, color: '#000000', opacity: 0 }, { offset: 0.6, color: '#000000', opacity: 0 }, { offset: 0.85, color: '#0a0614', opacity: 0.38 }] }} />
      <rect x={0} y={800} width={W} height={230} fill={{ kind: 'linear', angle: 90, stops: [{ offset: 0, color: '#0a0614', opacity: 0 }, { offset: 0.45, color: '#0a0614', opacity: 0.38 }, { offset: 1, color: '#0a0614', opacity: 0 }] }} />
      {OVERLAYS()}
      {CAPTIONS.map((c) => Caption({ at: Math.max(0, c.at), dur: Math.min(c.dur, END - Math.max(0, c.at)), words: c.words, who: c.who }))}
    </frame>,
    { at: 0, dur: END }
  )
  p.cut(voice, { at: 0 })
}
