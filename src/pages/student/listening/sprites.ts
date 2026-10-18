import type { Sprite } from '../../../scene/sprites'

/** Builds a symmetric sprite row from its left half. */
const mirror = (left: string) => left + [...left].reverse().join('')

/**
 * DJ headphones, drawn to sit over the 16×22 owl sprite: 20 columns wide,
 * placed 2 sprite-pixels left of the owl so the ear cups hug its head.
 */
export const DJ_HEADPHONES: Sprite = {
  rows: [
    '....oooooo',
    '...occcccc',
    '..occooooo',
    '.occo.....',
    '.oco......',
    'oaaao.....',
    'oahao.....',
    'oaaao.....',
    'oamao.....',
    'oaaao.....',
    '.ooo......',
  ].map(mirror),
  palette: { o: '#0a1130', c: '#3d4f8a', a: '#6fe3cf', h: '#e6fffa', m: '#ff6fcf' },
}

/** A lattice radio tower, generated so the bracing stays perfectly regular. */
function towerRows(height: number, width: number): string[] {
  const cx = Math.floor(width / 2)
  const mast = 12
  const rows: string[] = []
  for (let y = 0; y < height; y++) {
    const row = Array.from({ length: width }, () => '.')
    if (y < mast) {
      row[cx] = 's'
      if (y === 4 || y === 8) {
        row[cx - 1] = 's'
        row[cx + 1] = 's'
      }
    } else {
      const t = (y - mast) / (height - mast - 1)
      const half = Math.max(1, Math.round(1 + t * (cx - 1)))
      const l = cx - half
      const r = cx + half
      const seg = (y - mast) % 8
      if (seg === 0) for (let x = l; x <= r; x++) row[x] = 'o'
      else {
        const f = seg / 8
        row[Math.round(l + (r - l) * f)] = 'd'
        row[Math.round(r - (r - l) * f)] = 'd'
      }
      row[l] = 'o'
      row[r] = 'h'
    }
    rows.push(row.join(''))
  }
  return rows
}

export const RADIO_TOWER: Sprite = {
  rows: towerRows(78, 23),
  palette: { o: '#33437a', h: '#5367a8', d: '#26325e', s: '#6b7fc4' },
}
