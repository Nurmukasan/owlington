import type { Sprite } from '../../../scene/sprites'

/** Pixel sprites for the Moonlit Library (same text format as src/scene/sprites.ts). */

const INK = '#2a1418'

export const CANDLE_SPRITE: Sprite = {
  rows: [
    '...f...',
    '..fyf..',
    '..fyf..',
    '...k...',
    '.wwwww.',
    '.wcwws.',
    '.wcwws.',
    '.wwwws.',
    '.wwwws.',
    '.wwwws.',
    'bbbbbbb',
    '.bbbbb.',
  ],
  palette: { f: '#ff9a1f', y: '#ffe7a3', k: INK, w: '#f3e3c0', c: '#fffaf0', s: '#d6be8e', b: '#c8962e' },
}

export const QUILL_SPRITE: Sprite = {
  rows: [
    '.........ff',
    '........fwf',
    '.......fwf.',
    '......fwff.',
    '.....fwf...',
    '....fwff...',
    '...fwf.....',
    '..fff......',
    '.kk........',
    'kk.........',
  ],
  palette: { f: '#ffcf5c', w: '#fff3d1', k: INK },
}

export const HOURGLASS_SPRITE: Sprite = {
  rows: [
    'bbbbbbbbb',
    '.g.....g.',
    '.gsssssg.',
    '..gsssg..',
    '...gsg...',
    '....g....',
    '...g.g...',
    '..g.s.g..',
    '.g.sss.g.',
    'bbbbbbbbb',
  ],
  palette: { b: '#a8722a', g: '#cfe0ff', s: '#ffcf5c' },
}

export const SCROLL_SPRITE: Sprite = {
  rows: [
    '.oooooooo.',
    'owwwwwwwwo',
    '.owkkkkwo.',
    '.owwwwwwo.',
    '.owkkkwwo.',
    '.owwwwwwo.',
    '.owkkkkwo.',
    'owwwwwwwwo',
    '.oooooooo.',
  ],
  palette: { o: '#7a4a1e', w: '#f3e3c0', k: '#9b2f3a' },
}

export const FOIL_STAR_SPRITE: Sprite = {
  rows: [
    '...o...',
    '...o...',
    'ooooooo',
    '.ooooo.',
    '..ooo..',
    '.oo.oo.',
    'oo...oo',
  ],
  palette: { o: '#ffe7a3' },
}

export const KEY_SPRITE: Sprite = {
  rows: [
    '.ggg.......',
    'g...g......',
    'g...gggggg.',
    'g...g..g.g.',
    '.ggg...g.g.',
  ],
  palette: { g: '#ffcf5c' },
}

export const HIGHLIGHTER_SPRITE: Sprite = {
  rows: [
    '.......kk',
    '......kyyk',
    '.....kyyyk',
    '....kyyyk.',
    '...kddyk..',
    '..kddyk...',
    '.kccdk....',
    'kccck.....',
    'kcck......',
    '.kk.......',
  ].map((r) => r.padEnd(10, '.')),
  palette: { k: INK, y: '#ffcf5c', d: '#e0a630', c: '#ffe7a3' },
}

export const RIBBON_SPRITE: Sprite = {
  rows: ['.rrrrr.', '.rRrrr.', '.rRrrr.', '.rRrrr.', '.rRrrr.', '.rRrrr.', '.rr.rr.', '.r...r.'],
  palette: { r: '#c23b4a', R: '#e2606e' },
}

export const STAMP_SPRITE: Sprite = {
  rows: [
    '...hhhh...',
    '...hHhh...',
    '...hhhh...',
    '....hh....',
    '....hh....',
    '.bbbbbbbb.',
    'bBbbbbbbbb',
    'bbbbbbbbbb',
    '.iiiiiiii.',
  ],
  palette: { h: '#7a4a1e', H: '#a8722a', b: '#5b2a2e', B: '#9b2f3a', i: '#c23b4a' },
}
