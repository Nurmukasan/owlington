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
