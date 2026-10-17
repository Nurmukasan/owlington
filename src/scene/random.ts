export type Rng = () => number

/** Small, fast seeded PRNG so the forest looks the same on every visit. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const between = (rng: Rng, min: number, max: number) => min + rng() * (max - min)

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** 2D value noise in the 0..1 range. */
export function createNoise2D(rng: Rng) {
  const perm = new Uint8Array(512)
  const p = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  const values = Float32Array.from({ length: 256 }, () => rng())

  const hash = (x: number, y: number) => values[perm[(perm[x & 255] + y) & 511]]
  const smooth = (t: number) => t * t * (3 - 2 * t)

  return (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const u = smooth(x - xi)
    const v = smooth(y - yi)
    const a = hash(xi, yi)
    const b = hash(xi + 1, yi)
    const c = hash(xi, yi + 1)
    const d = hash(xi + 1, yi + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
}
