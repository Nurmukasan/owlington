/**
 * Hand-made pixel art. Every sprite is a list of equal-length rows where each
 * character is a palette key and `.` is transparent.
 */

export type Palette = Record<string, string>

export interface Sprite {
  rows: string[]
  palette: Palette
}

// ---------------------------------------------------------------------------
// The Owlington owl
// ---------------------------------------------------------------------------

export const OWL_PALETTE: Palette = {
  o: '#1e120c', // outline
  b: '#7f5236', // feathers
  d: '#523220', // wings
  l: '#ecd0a2', // belly
  m: '#b98b5c', // belly chevrons
  w: '#f3e3c3', // facial disc
  y: '#ffb627', // iris
  k: '#120c08', // pupil
  h: '#ffffff', // eye shine
  n: '#f08a24', // beak
  f: '#e09a34', // feet
}

const OWL_BASE = [
  '..o..........o..',
  '..oo........oo..',
  '..obo......obo..',
  '.obbboooooobbbo.',
  '.obbbbbbbbbbbbo.',
  'obbwwwwbbwwwwbbo',
  'obwyyyywwyyyywbo',
  'obwyhkywwyhkywbo',
  'obwykkynnykkywbo',
  'obwyyyynnyyyywbo',
  'obbbwwwnnwwwbbbo',
  'odbbbllllllbbbdo',
  'oddblmlmmlmlbddo',
  'oddbllmllmllbddo',
  'oddbllllllllbddo',
  'oddblmlmmlmlbddo',
  'oddbllmllmllbddo',
  '.oddbllllllbddo.',
  '..oddbbbbbbddo..',
  '...ooffooffoo...',
  '......oddo......',
  '.......oo.......',
]

export const OWL_W = OWL_BASE[0].length
export const OWL_H = OWL_BASE.length
/** Row index of the feet — this row sits on the branch. */
export const OWL_FEET_ROW = 19

export type OwlEyes = 'open' | 'closed' | 'happy'

export interface OwlPose {
  /** Pupil direction: -1 left, 0 centre, 1 right. */
  look: -1 | 0 | 1
  eyes: OwlEyes
  beakOpen: boolean
}

const EYE_COLUMNS = [3, 9]
const EYE_TOP = 6

const CLOSED_EYE = ['wwww', 'wwww', 'oooo', 'wwww']
const HAPPY_EYE = ['wwww', 'woow', 'owwo', 'wwww']

export function owlRows(pose: OwlPose): string[] {
  const rows = OWL_BASE.map((row) => row.split(''))

  for (const x0 of EYE_COLUMNS) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        let ch = 'y'
        if (pose.eyes === 'closed') ch = CLOSED_EYE[r][c]
        else if (pose.eyes === 'happy') ch = HAPPY_EYE[r][c]
        else if (r === 1 || r === 2) {
          const p0 = 1 + pose.look
          if (c === p0) ch = r === 1 ? 'h' : 'k'
          else if (c === p0 + 1) ch = 'k'
        }
        rows[EYE_TOP + r][x0 + c] = ch
      }
    }
  }

  if (pose.beakOpen) {
    rows[9][7] = 'o'
    rows[9][8] = 'o'
  }

  return rows.map((row) => row.join(''))
}

/** Just the owl's head — used for the logo, favicon and avatars. */
export const OWL_HEAD: Sprite = {
  rows: [...OWL_BASE.slice(0, 11), '.obbbbbbbbbbbbo.', '..oooooooooooo..'],
  palette: OWL_PALETTE,
}

// ---------------------------------------------------------------------------
// Section icons
// ---------------------------------------------------------------------------

const ICON_INK = '#14163a'

export const BOOK_ICON: Sprite = {
  rows: [
    '.oooo..oooo.',
    'owwwwoowwwwo',
    'owaawoowaawo',
    'owwwwoowwwwo',
    'owaawoowaawo',
    'owwwwoowwwwo',
    'oooooooooooo',
  ],
  palette: { o: ICON_INK, w: '#fff7e6', a: '#ffb627' },
}

export const HEADPHONES_ICON: Sprite = {
  rows: [
    '...oooooo...',
    '..oaaaaaao..',
    '.oao....oao.',
    '.oo......oo.',
    'oo........oo',
    'oaao....oaao',
    'oaao....oaao',
    'oaao....oaao',
    '.oo......oo.',
  ],
  palette: { o: ICON_INK, a: '#6fe3cf' },
}

export const PENCIL_ICON: Sprite = {
  rows: [
    '.........oo.',
    '........oeeo',
    '.......oeeo.',
    '......oaao..',
    '.....oaao...',
    '....oaao....',
    '...oaao.....',
    '..owwo......',
    '.owwo.......',
    '.kko........',
    '.k..........',
  ],
  palette: { o: ICON_INK, e: '#ff7a9a', a: '#ff9a85', w: '#f3d6a4', k: ICON_INK },
}

export const STAR_ICON: Sprite = {
  rows: ['..o..', '..o..', 'ooooo', '..o..', '..o..'],
  palette: { o: '#ffe9a8' },
}

export const FLAME_ICON: Sprite = {
  rows: [
    '...r....',
    '...rr...',
    '..rro...',
    '..roor..',
    '.rooyor.',
    '.royyor.',
    'royyyyor',
    'royyyyor',
    '.ryyyyr.',
    '..rrrr..',
  ],
  palette: { r: '#ff5a36', o: '#ff9a1f', y: '#ffe066' },
}

export const TROPHY_ICON: Sprite = {
  rows: [
    'o.oooooo.o',
    'ooyyyyyyoo',
    'oyoyyhyoyo',
    'oyoyyhyoyo',
    '.ooyyyyoo.',
    '..oyyyyo..',
    '...oyyo...',
    '....oo....',
    '..oyyyyo..',
    '..oooooo..',
  ],
  palette: { o: ICON_INK, y: '#ffb627', h: '#fff1c9' },
}

export const TEST_ICON: Sprite = {
  rows: [
    'oooooooo..',
    'owwwwwwoo.',
    'owaawwwowo',
    'owwwwwwooo',
    'owaaaawwwo',
    'owwwwwwwwo',
    'owaaawwwwo',
    'owwwwwwwgo',
    'owaaawwggo',
    'owwwgwggwo',
    'owwwwggwwo',
    'oooooooooo',
  ],
  palette: { o: ICON_INK, w: '#fff7e6', a: '#9a9ab5', g: '#2f9e6e' },
}

// ---------------------------------------------------------------------------
// Achievement badges
// ---------------------------------------------------------------------------

/** Sharp-Eared Owl: a long-eared owl, tufts up. */
export const TUFTED_OWL_ICON: Sprite = {
  rows: [
    'o..........o',
    'oo........oo',
    'obo......obo',
    'obbooooooobo',
    'obbbbbbbbbbo',
    'obwwbbbbwwbo',
    'owyywbbwyywo',
    'owykwnnwykwo',
    'obwwbnnbwwbo',
    '.obbbbbbbbo.',
    '..oobbbboo..',
    '....oooo....',
  ],
  palette: { o: ICON_INK, b: '#7f5236', w: '#f3e3c3', y: '#ffb627', k: '#120c08', n: '#f08a24' },
}

/** The Owl Codebreaker: a golden key. */
export const KEY_ICON: Sprite = {
  rows: [
    '.oooo.......',
    'oyyyyo......',
    'oyooyo......',
    'oyooyooooooo',
    'oyyyyyyyyyyo',
    '.oooooyooyyo',
    '......oo.oyo',
    '.........oo.',
  ],
  palette: { o: ICON_INK, y: '#ffcf5c' },
}

/** Echoing Owl: a gold medal stamped with a 9. */
export const MEDAL_ICON: Sprite = {
  rows: [
    'oo........oo',
    'orro....orro',
    '.orro..orro.',
    '..orroorro..',
    '...oooooo...',
    '..oyyyyyyo..',
    '.oyyhhyyyyo.',
    '.oyhyyhyyyo.',
    '.oyyhhhyyyo.',
    '.oyyyyhyyyo.',
    '..oyhhyyyo..',
    '...oooooo...',
  ],
  palette: { o: ICON_INK, r: '#6fe3cf', y: '#ffcf5c', h: '#7a4b00' },
}

/** Skimming Owl: a magnifying glass. */
export const MAGNIFIER_ICON: Sprite = {
  rows: [
    '..oooo......',
    '.owwwwo.....',
    'owwhwwwo....',
    'owhwwwwo....',
    'owwwwwwo....',
    'owwwwwwo....',
    '.owwwwoo....',
    '..oooooao...',
    '.......oaao.',
    '........oaao',
    '.........oao',
    '..........o.',
  ],
  palette: { o: ICON_INK, w: '#bfe6ff', h: '#ffffff', a: '#c08a1e' },
}

/** True-False-Owl: a tick and a cross. */
export const TRUE_FALSE_ICON: Sprite = {
  rows: ['.....g.r...r', '....gg..r.r.', 'g..gg....r..', 'gggg....r.r.', '.gg....r...r'],
  palette: { g: '#4fd18b', r: '#ff6b6b' },
}

/** Bookworm Owl: an open book with a worm on top. */
export const BOOKWORM_ICON: Sprite = {
  rows: [
    '........gg..',
    '...ggg.gkgg.',
    '..g...gg....',
    '.oooo..oooo.',
    'owwwwoowwwwo',
    'owaawoowaawo',
    'owwwwoowwwwo',
    'owaawoowaawo',
    'owwwwoowwwwo',
    'oooooooooooo',
  ],
  palette: { o: ICON_INK, w: '#fff7e6', a: '#ffb627', g: '#7fd36b', k: '#14163a' },
}

/** Graph-Watching Owl: a bar chart climbing. */
export const GRAPH_ICON: Sprite = {
  rows: [
    'o........aa.',
    'o........aa.',
    'o.....cc.aa.',
    'o.....cc.aa.',
    'o..bb.cc.aa.',
    'o..bb.cc.aa.',
    'o..bb.cc.aa.',
    'o..bb.cc.aa.',
    'oooooooooooo',
  ],
  palette: { o: '#e8e6ff', a: '#ff9a85', b: '#9ad3ff', c: '#ffcf5c' },
}

/** Essay-Weaving Owl: a written scroll. */
export const SCROLL_ICON: Sprite = {
  rows: [
    '.oooooooooo.',
    'oyyyyyyyyyyo',
    '.owwwwwwwwo.',
    '.owaaaaawwo.',
    '.owwwwwwwwo.',
    '.owaaaaaawo.',
    '.owwwwwwwwo.',
    '.owaaaawwwo.',
    'oyyyyyyyyyyo',
    '.oooooooooo.',
  ],
  palette: { o: ICON_INK, y: '#d9b464', w: '#fbf4e4', a: '#8a8aa8' },
}
