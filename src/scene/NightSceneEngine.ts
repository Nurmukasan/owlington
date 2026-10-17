import { between, clamp, createNoise2D, mulberry32, type Rng } from './random'
import { OWL_FEET_ROW, OWL_H, OWL_PALETTE, OWL_W, owlRows, type OwlPose } from './sprites'

/**
 * A procedurally generated, animated pixel-art night forest.
 *
 * The scene is drawn at a low "virtual" resolution (~220px tall) and scaled up
 * with `image-rendering: pixelated`, so every virtual pixel is a crisp square.
 * Static layers (sky, moon, hills, ground) are pre-rendered on resize; the
 * animated bits (stars, shooting stars, clouds, swaying trees, the owl and
 * fireflies) are drawn on top every frame.
 */

export interface OwlRect {
  x: number
  y: number
  width: number
  height: number
}

export interface NightSceneOptions {
  seed?: number
  owl?: boolean
  reducedMotion?: boolean
  onOwlRect?: (rect: OwlRect | null) => void
}

type RGB = [number, number, number]

const TARGET_ROWS = 220

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const bayer = (x: number, y: number) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16

function rgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

// --- palette ---------------------------------------------------------------

const SKY = ['#04051a', '#080a26', '#0d0f34', '#141543', '#1d1b52', '#2a2161', '#3b296d', '#512f75'].map(rgb)
const MILKY_WAY = rgb('#3d3c8c')
const MOON_GLOW = rgb('#6c62b4')
const MOON = ['#bfae80', '#dccd9c', '#efe3bd', '#fff9e6'].map(rgb)
const STAR_COLORS = ['#ffffff', '#dfe6ff', '#fff1cc', '#c3ccff']

const FAR_HILLS = { rim: rgb('#5b519f'), body: rgb('#2d2766'), deep: rgb('#241f57') }
const MID_HILLS = { rim: rgb('#36317a'), body: rgb('#1a1747'), deep: rgb('#15123d') }
const MIST = rgb('#4a4392')
const GROUND = { rim: rgb('#24245a'), body: rgb('#0b0b22'), deep: rgb('#07071a') }

interface TreeColors {
  body: RGB
  shade: RGB
  rim: RGB
  trunk: RGB
}

const MID_PINE: TreeColors = {
  body: rgb('#151440'),
  shade: rgb('#100f33'),
  rim: rgb('#2f2c6e'),
  trunk: rgb('#100f33'),
}
const FRONT_PINE: TreeColors = {
  body: rgb('#0b0c26'),
  shade: rgb('#07081c'),
  rim: rgb('#252a62'),
  trunk: rgb('#0e0b20'),
}

const LEAVES = ['#0a1224', '#111f38', '#1a3150', '#294a6e', '#3d6688'].map(rgb)
const BARK = { shade: rgb('#140e1d'), body: rgb('#1f1729'), rim: rgb('#3d2f4f'), top: rgb('#4b3b60') }

// --- small pixel buffer helper ----------------------------------------------

class PixelBuffer {
  readonly w: number
  readonly h: number
  readonly image: ImageData

  constructor(w: number, h: number) {
    this.w = Math.max(1, w)
    this.h = Math.max(1, h)
    this.image = new ImageData(this.w, this.h)
  }

  set(x: number, y: number, c: RGB, a = 255) {
    x |= 0
    y |= 0
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return
    const i = (y * this.w + x) * 4
    const d = this.image.data
    d[i] = c[0]
    d[i + 1] = c[1]
    d[i + 2] = c[2]
    d[i + 3] = a
  }

  filled(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return false
    return this.image.data[(y * this.w + x) * 4 + 3] > 0
  }

  get(x: number, y: number): RGB {
    const i = (y * this.w + x) * 4
    const d = this.image.data
    return [d[i], d[i + 1], d[i + 2]]
  }

  toCanvas() {
    const canvas = document.createElement('canvas')
    canvas.width = this.w
    canvas.height = this.h
    canvas.getContext('2d')!.putImageData(this.image, 0, 0)
    return canvas
  }
}

// --- scene element types ------------------------------------------------------

interface Star {
  x: number
  y: number
  alpha: number
  twinkle: number
  speed: number
  phase: number
  bright: boolean
}

interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  length: number
}

interface Cloud {
  sprite: HTMLCanvasElement
  x: number
  y: number
  speed: number
}

interface SwayingSprite {
  sprite: HTMLCanvasElement
  x: number
  y: number
  amp: number
  phase: number
  /** How strongly the sway grows towards the top (higher = stiffer base). */
  curve: number
}

interface Firefly {
  x: number
  y: number
  rx: number
  ry: number
  sx: number
  sy: number
  phase: number
  pulse: number
}

interface Particle {
  kind: 'note' | 'leaf'
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  phase: number
}

interface OwlState {
  x: number
  y: number
  nextBlink: number
  blinkUntil: number
  doubleBlinkAt: number
  nextLook: number
  lookUntil: number
  look: -1 | 0 | 1
  hootUntil: number
}

const NOTE_ROWS = ['.##', '.#.', '.#.', '##.', '##.']

export class NightSceneEngine {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly opts: Required<Omit<NightSceneOptions, 'onOwlRect'>> & Pick<NightSceneOptions, 'onOwlRect'>

  private W = 0
  private H = 0
  private cssScale = 1

  private moon = { x: 0, y: 0, r: 0 }
  private sky?: HTMLCanvasElement
  private moonSprite?: HTMLCanvasElement
  private farLayer?: HTMLCanvasElement
  private groundLayer?: HTMLCanvasElement
  private trunkLayer?: HTMLCanvasElement
  private starsByColor: Star[][] = []
  private clouds: Cloud[] = []
  private midTrees: SwayingSprite[] = []
  private frontTrees: SwayingSprite[] = []
  private fireflies: Firefly[] = []
  private meteors: Meteor[] = []
  private particles: Particle[] = []
  private crown: SwayingSprite | null = null
  private crownBox = { x: 0, y: 0, w: 0, h: 0 }
  private owl: OwlState | null = null
  private owlFrames = new Map<string, HTMLCanvasElement>()

  private raf = 0
  private active = true
  private running = false
  private t0 = performance.now()
  private lastT = 0
  private nextMeteor = 1.5
  private nextLeaf = 4

  constructor(canvas: HTMLCanvasElement, options: NightSceneOptions = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.opts = {
      seed: options.seed ?? 20261017,
      owl: options.owl ?? true,
      reducedMotion: options.reducedMotion ?? false,
      onOwlRect: options.onOwlRect,
    }
  }

  // --- public API -------------------------------------------------------------

  resize(cssWidth: number, cssHeight: number, dpr = 1) {
    if (cssWidth < 1 || cssHeight < 1) return
    const deviceScale = Math.max(2, Math.round((cssHeight * dpr) / TARGET_ROWS))
    this.cssScale = deviceScale / dpr
    const W = Math.ceil(cssWidth / this.cssScale)
    const H = Math.ceil(cssHeight / this.cssScale)

    this.canvas.style.width = `${W * this.cssScale}px`
    this.canvas.style.height = `${H * this.cssScale}px`
    if (W === this.W && H === this.H) return

    this.W = W
    this.H = H
    this.canvas.width = W
    this.canvas.height = H
    this.ctx.imageSmoothingEnabled = false
    this.build()
    this.reportOwl()

    // Always paint one frame right away so an inactive (off-screen) scene isn't blank.
    this.draw(this.now())
    this.start()
  }

  setActive(active: boolean) {
    this.active = active
    if (active) this.start()
    else this.stop()
  }

  /** Make the owl hoot: happy eyes, a little hop and floating music notes. */
  hoot() {
    if (!this.owl) return
    const t = this.now()
    this.owl.hootUntil = t + 0.9
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        kind: 'note',
        x: this.owl.x + OWL_W - 2 + i * 3,
        y: this.owl.y + 4 - i * 2,
        vx: 6 + Math.random() * 5,
        vy: -(10 + Math.random() * 6),
        age: -i * 0.18,
        life: 1.4,
        phase: Math.random() * 6,
      })
    }
    if (this.opts.reducedMotion) this.draw(t)
  }

  destroy() {
    this.stop()
    this.opts.onOwlRect?.(null)
  }

  // --- loop ---------------------------------------------------------------------

  private now() {
    return (performance.now() - this.t0) / 1000
  }

  private start() {
    if (this.running || !this.active || this.opts.reducedMotion || !this.W) return
    this.running = true
    this.lastT = this.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  private stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  private frame = () => {
    if (!this.running) return
    const t = this.now()
    const dt = Math.min(0.05, t - this.lastT)
    this.lastT = t
    this.update(t, dt)
    this.draw(t)
    this.raf = requestAnimationFrame(this.frame)
  }

  // --- generation -------------------------------------------------------------------

  private build() {
    const { W, H } = this
    const rng = mulberry32(this.opts.seed)
    const noise = createNoise2D(rng)

    const horizon = Math.round(H * 0.7)
    const groundY = Math.round(H * 0.9)
    const r = Math.round(clamp(Math.min(H * 0.19, W * 0.2), 14, 64))
    this.moon = { x: Math.round(W * (W < 200 ? 0.62 : 0.7)), y: Math.round(H * 0.6), r }

    this.sky = this.buildSky(noise, horizon)
    this.moonSprite = this.buildMoon(rng, noise)
    this.buildStars(rng, horizon)
    this.buildClouds(rng)

    const farProfile = this.profile(noise, horizon - H * 0.07, H * 0.09, 0.011, 3.1)
    const midProfile = this.profile(noise, horizon + H * 0.01, H * 0.05, 0.02, 9.7)
    const groundProfile = this.profile(noise, groundY, H * 0.035, 0.03, 17.3)

    this.farLayer = this.buildFarLayer(rng, farProfile, midProfile)
    this.midTrees = this.buildMidTrees(rng, midProfile)
    this.groundLayer = this.buildGround(rng, groundProfile)
    this.buildForeground(rng, groundProfile)
    this.buildFireflies(rng, horizon, groundY)

    this.meteors = []
    this.particles = []
  }

  private profile(noise: (x: number, y: number) => number, base: number, amp: number, freq: number, row: number) {
    const out = new Int16Array(this.W)
    for (let x = 0; x < this.W; x++) {
      const n = noise(x * freq, row) * 0.7 + noise(x * freq * 2.9, row + 4) * 0.3
      out[x] = Math.round(base - n * amp)
    }
    return out
  }

  private buildSky(noise: (x: number, y: number) => number, horizon: number) {
    const { W, H, moon } = this
    const buf = new PixelBuffer(W, H)
    const gradientEnd = horizon + H * 0.05

    // The Milky Way: a soft, clumpy band running across the sky.
    const ax = 0
    const ay = H * 0.48
    const bx = W
    const by = H * 0.02
    const len = Math.hypot(bx - ax, by - ay)
    const bandWidth = H * 0.17

    for (let y = 0; y < H; y++) {
      const t = clamp(y / gradientEnd, 0, 1)
      const idx = t * (SKY.length - 1)
      const i = Math.floor(idx)
      for (let x = 0; x < W; x++) {
        let c = idx - i > bayer(x, y) ? SKY[Math.min(i + 1, SKY.length - 1)] : SKY[i]

        const d = Math.abs((by - ay) * x - (bx - ax) * y + bx * ay - by * ax) / len
        const band = Math.max(0, 1 - d / bandWidth)
        if (band > 0) {
          const n = noise(x * 0.07, y * 0.07) * 0.6 + noise(x * 0.21, y * 0.21) * 0.4
          const s = band * band * (0.2 + n * 1.1)
          if (s * 0.6 > bayer(x + 1, y + 2)) c = mix(c, MILKY_WAY, 0.32)
        }

        const md = Math.hypot(x - moon.x, y - moon.y)
        if (md > moon.r) {
          const g = clamp(1 - (md - moon.r) / (moon.r * 2.4), 0, 1)
          const level = Math.floor(g * g * 3 + bayer(x, y))
          if (level > 0) c = mix(c, MOON_GLOW, level * 0.13)
        }

        buf.set(x, y, c)
      }
    }
    return buf.toCanvas()
  }

  private buildMoon(rng: Rng, noise: (x: number, y: number) => number) {
    const R = this.moon.r
    const size = R * 2 + 1
    const buf = new PixelBuffer(size, size)
    const craters = Array.from({ length: 7 + Math.floor(rng() * 4) }, () => {
      const a = rng() * Math.PI * 2
      const d = Math.sqrt(rng()) * 0.72
      return { x: Math.cos(a) * d, y: Math.sin(a) * d, r: between(rng, 0.05, 0.15) }
    })
    const L = { x: 0.38, y: -0.32, z: 0.87 }
    const limit = (R + 0.5) * (R + 0.5)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - R
        const dy = y - R
        if (dx * dx + dy * dy > limit) continue
        const nx = dx / R
        const ny = dy / R
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
        let v = 0.32 + (nx * L.x + ny * L.y + nz * L.z) * 0.72

        if (noise(nx * 1.7 + 11, ny * 1.7 + 5) > 0.58) v -= 0.2
        for (const c of craters) {
          const cd = Math.hypot(nx - c.x, ny - c.y)
          if (cd < c.r) v -= 0.17
          else if (cd < c.r + 1.2 / R && nx - c.x < 0 && ny - c.y > 0) v += 0.12
        }

        const level = clamp(Math.floor(v * 4 + (bayer(x, y) - 0.5) * 0.45), 0, 3)
        buf.set(x, y, MOON[level])
      }
    }
    return buf.toCanvas()
  }

  private buildStars(rng: Rng, horizon: number) {
    const { W, H, moon } = this
    const groups: Star[][] = STAR_COLORS.map(() => [])
    const attempts = Math.floor(W * horizon * 0.014)
    const ay = H * 0.48
    const by = H * 0.02
    const len = Math.hypot(W, by - ay)

    for (let i = 0; i < attempts; i++) {
      const x = Math.floor(rng() * W)
      const y = Math.floor(rng() * horizon)
      const band = Math.max(0, 1 - Math.abs((by - ay) * x - W * y + W * ay) / len / (H * 0.17))
      const p = 0.3 + band * 0.7 - Math.pow(y / horizon, 2) * 0.25
      if (rng() > p) continue
      if (Math.hypot(x - moon.x, y - moon.y) < moon.r * 1.25) continue

      const roll = rng()
      const bright = roll < 0.035
      const star: Star = {
        x,
        y,
        bright,
        alpha: bright ? 1 : roll < 0.16 ? between(rng, 0.7, 1) : between(rng, 0.2, 0.6),
        twinkle: bright ? 0.5 : between(rng, 0.15, 0.6),
        speed: between(rng, 0.6, 3.2),
        phase: rng() * Math.PI * 2,
      }
      groups[Math.floor(rng() * groups.length)].push(star)
    }
    this.starsByColor = groups
  }

  private buildClouds(rng: Rng) {
    const { W, H } = this
    const count = W > 260 ? 3 : 2
    this.clouds = Array.from({ length: count }, (_, i) => {
      const w = Math.round(between(rng, 0.14, 0.26) * Math.max(W, 200))
      const h = Math.round(between(rng, 7, 12))
      return {
        sprite: this.makeCloud(rng, w, h),
        x: between(rng, -w, W),
        y: Math.round(H * (0.2 + i * 0.12) + between(rng, -6, 6)),
        speed: between(rng, 1.2, 3.2),
      }
    })
  }

  private makeCloud(rng: Rng, w: number, h: number) {
    const buf = new PixelBuffer(w, h)
    const puffs = Array.from({ length: 4 + Math.floor(rng() * 3) }, () => ({
      x: between(rng, 0.15, 0.85) * w,
      y: h * between(rng, 0.45, 0.65),
      rx: between(rng, 0.12, 0.26) * w,
      ry: between(rng, 0.35, 0.55) * h,
    }))
    const inside = (x: number, y: number) =>
      y < h * 0.85 && puffs.some((p) => ((x - p.x) / p.rx) ** 2 + ((y - p.y) / p.ry) ** 2 <= 1)

    const rim = rgb('#7a70bd')
    const body = rgb('#38307a')
    const under = rgb('#29235e')
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!inside(x, y)) continue
        const c = !inside(x, y - 1) ? rim : y > h * 0.62 && bayer(x, y) < 0.7 ? under : body
        buf.set(x, y, c, 225)
      }
    }
    return buf.toCanvas()
  }

  private buildFarLayer(rng: Rng, far: Int16Array, mid: Int16Array) {
    const { W, H, moon } = this
    const buf = new PixelBuffer(W, H)

    for (let x = 0; x < W; x++) {
      const nearMoon = Math.abs(x - moon.x) < moon.r * 1.6
      for (let y = far[x]; y < H; y++) {
        const depth = (y - far[x]) / (H * 0.12)
        let c = depth > bayer(x, y) * 1.4 ? FAR_HILLS.deep : FAR_HILLS.body
        if (y === far[x] || (nearMoon && y === far[x] + 1 && bayer(x, y) > 0.5)) c = FAR_HILLS.rim
        buf.set(x, y, c)
      }
    }

    // A band of tiny pines along the ridge of the middle hills.
    let x = -2
    while (x < W + 2) {
      const h = Math.round(between(rng, 3, 9))
      const base = mid[clamp(x, 0, W - 1)] + 1
      for (let row = 0; row < h; row++) {
        const half = Math.floor((row / h) * (h * 0.35 + 1))
        for (let dx = -half; dx <= half; dx++) buf.set(x + dx, base - h + row, MID_HILLS.body)
      }
      buf.set(x, base - h - 1, MID_HILLS.body)
      x += Math.round(between(rng, 2, 5))
    }

    for (let x = 0; x < W; x++) {
      for (let y = mid[x]; y < H; y++) {
        const depth = (y - mid[x]) / (H * 0.1)
        let c = depth > bayer(x, y) * 1.6 ? MID_HILLS.deep : MID_HILLS.body
        if (y === mid[x] && Math.abs(x - moon.x) < moon.r * 2.2 && bayer(x, y) > 0.35) c = MID_HILLS.rim
        buf.set(x, y, c)
      }
    }

    // A thin layer of mist hugging the valley.
    const mistTop = Math.round(H * 0.73)
    const mistBottom = Math.round(H * 0.84)
    for (let y = mistTop; y < mistBottom; y++) {
      const f = 1 - Math.abs((y - (mistTop + mistBottom) / 2) / ((mistBottom - mistTop) / 2))
      for (let x = 0; x < W; x++) {
        if (!buf.filled(x, y)) continue
        if (f * 0.55 > bayer(x + 3, y)) buf.set(x, y, mix(buf.get(x, y), MIST, 0.35))
      }
    }

    return buf.toCanvas()
  }

  private makePine(rng: Rng, h: number, colors: TreeColors, slim = 1) {
    const trunkH = Math.max(2, Math.round(h * 0.09))
    const crownH = h - trunkH
    const maxHalf = Math.max(2, Math.round(h * 0.26 * slim))
    const w = maxHalf * 2 + 3
    const cx = Math.floor(w / 2)
    const buf = new PixelBuffer(w, h)
    const tiers = clamp(Math.round(crownH / 7), 2, 6)

    for (let y = 0; y < crownH; y++) {
      const tf = y / crownH
      const tierPos = (tf * tiers) % 1
      const envelope = 0.18 + tf * 0.82
      let half = y === 0 ? 0 : Math.round(maxHalf * envelope * (0.5 + 0.5 * tierPos))
      if (half > 1 && rng() < 0.25) half -= 1
      for (let dx = -half; dx <= half; dx++) {
        let c = colors.body
        if (dx >= half - (tierPos < 0.5 ? 0 : 1) && dx > 0) c = colors.rim
        else if (dx < -half * 0.3 && bayer(cx + dx, y) < 0.55) c = colors.shade
        else if (tierPos > 0.82 && bayer(cx + dx, y) < 0.6) c = colors.shade
        buf.set(cx + dx, y, c)
      }
    }
    const trunkW = h > 40 ? 2 : 1
    for (let y = crownH; y < h; y++) {
      for (let dx = 0; dx < trunkW; dx++) buf.set(cx + dx - (trunkW > 1 ? 1 : 0), y, colors.trunk)
    }
    return buf.toCanvas()
  }

  private buildMidTrees(rng: Rng, mid: Int16Array) {
    const { W, H, moon } = this
    const trees: SwayingSprite[] = []
    const count = Math.max(4, Math.round(W / 16))
    const xs = Array.from({ length: count }, () => Math.round(rng() * W))
    // Make sure a couple of pines stand in front of the moon — silhouettes look great.
    xs.push(moon.x - Math.round(moon.r * 0.55), moon.x + Math.round(moon.r * 0.4))

    for (const x of xs) {
      const h = Math.round(between(rng, H * 0.09, H * 0.19))
      const sprite = this.makePine(rng, h, MID_PINE)
      trees.push({
        sprite,
        x: x - Math.floor(sprite.width / 2),
        y: mid[clamp(x, 0, W - 1)] + Math.round(H * 0.035) - h,
        amp: 1.2,
        phase: rng() * Math.PI * 2,
        curve: 2,
      })
    }
    return trees.sort((a, b) => a.y + a.sprite.height - (b.y + b.sprite.height))
  }

  private buildGround(rng: Rng, ground: Int16Array) {
    const { W, H } = this
    const buf = new PixelBuffer(W, H)
    for (let x = 0; x < W; x++) {
      for (let y = ground[x]; y < H; y++) {
        const depth = (y - ground[x]) / (H * 0.06)
        const c = y === ground[x] ? GROUND.rim : depth > bayer(x, y) * 1.5 ? GROUND.deep : GROUND.body
        buf.set(x, y, c)
      }
      // grass tufts
      if (rng() < 0.35) {
        const blade = 1 + Math.floor(rng() * 3)
        for (let i = 1; i <= blade; i++) buf.set(x, ground[x] - i, i === blade ? GROUND.rim : GROUND.body)
      }
    }
    return buf.toCanvas()
  }

  private buildForeground(rng: Rng, ground: Int16Array) {
    const { W, H } = this
    const at = (x: number) => ground[clamp(Math.round(x), 0, W - 1)]
    const trees: SwayingSprite[] = []

    const narrow = W < 200
    const addPine = (x: number, h: number, amp: number) => {
      const sprite = this.makePine(rng, Math.round(h), FRONT_PINE, narrow ? 0.6 : 1)
      trees.push({
        sprite,
        x: Math.round(x - sprite.width / 2),
        y: at(x) + 2 - sprite.height,
        amp,
        phase: rng() * Math.PI * 2,
        curve: 2.2,
      })
    }

    addPine(W - Math.max(6, W * 0.035), H * (narrow ? 0.46 : 0.64), 2)
    if (W > 220) addPine(W - W * 0.15, H * 0.44, 1.6)
    if (W > 420) addPine(W * 0.42, H * 0.3, 1.3)
    addPine(Math.max(4, W * 0.02), H * 0.52, 1.8)

    this.frontTrees = trees
    this.buildOakAndOwl(rng, ground)
  }

  /** The big moonlit oak on the left — home of the owl. */
  private buildOakAndOwl(rng: Rng, ground: Int16Array) {
    const { W, H } = this
    const trunkX = Math.round(clamp(W * 0.15, 18, 110))
    const baseY = ground[clamp(trunkX, 0, W - 1)] + 2
    const branchY = Math.round(baseY - H * 0.36)
    const trunkTop = branchY - Math.round(H * 0.1)
    const branchLen = Math.round(clamp(W * 0.1, 22, 40))

    const trunk = new PixelBuffer(W, H)

    // Trunk — tapered, with root flare and moonlight on its right side.
    for (let y = trunkTop; y <= baseY; y++) {
      const f = (y - trunkTop) / (baseY - trunkTop)
      let half = 3 + Math.round(f * 2)
      if (y > baseY - 5) half += y - (baseY - 5)
      for (let dx = -half; dx <= half; dx++) {
        let c = BARK.body
        if (dx >= half - 1) c = BARK.rim
        else if (dx <= -half + 1) c = BARK.shade
        else if ((dx + 7 * Math.floor(y / 5)) % 4 === 0 && bayer(dx + 8, y) > 0.4) c = BARK.shade
        trunk.set(trunkX + dx, y, c)
      }
    }
    // A knot hole, because every owl tree needs one.
    const knotY = Math.round(branchY + (baseY - branchY) * 0.35)
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]) trunk.set(trunkX - 1 + dx, knotY + dy, BARK.shade)

    // The branch the owl sits on.
    const branchStart = trunkX + 3
    const tip = { x: branchStart + branchLen, y: branchY }
    for (let i = 0; i <= branchLen; i++) {
      const f = i / branchLen
      const y = branchY - Math.round(f * f * 3)
      const thick = f < 0.35 ? 3 : f < 0.8 ? 2 : 1
      for (let j = 0; j < thick; j++) trunk.set(branchStart + i, y + j, j === 0 ? BARK.top : BARK.body)
      if (i === branchLen) tip.y = y
    }
    // A little twig with a few leaves at the tip.
    for (let i = 1; i <= 4; i++) trunk.set(tip.x - i + 2, tip.y - i, BARK.body)
    for (let y = -3; y <= 3; y++) {
      for (let x = -3; x <= 3; x++) {
        if (x * x + y * y > 9 || bayer(x + 4, y + 4) > 0.8) continue
        trunk.set(tip.x + 1 + x, tip.y - 5 + y, LEAVES[x - y > 1 ? 3 : x - y > -2 ? 2 : 1])
      }
    }

    this.trunkLayer = trunk.toCanvas()

    // Owl position: feet on the branch, a bit out from the trunk.
    const owlCenter = branchStart + Math.round(branchLen * 0.45)
    const f = (owlCenter - branchStart) / branchLen
    const perchY = branchY - Math.round(f * f * 3)
    const owlX = owlCenter - Math.floor(OWL_W / 2)
    const owlY = perchY - OWL_FEET_ROW

    if (this.opts.owl) {
      const prev = this.owl
      this.owl = {
        x: owlX,
        y: owlY,
        nextBlink: prev?.nextBlink ?? 1.2,
        blinkUntil: 0,
        doubleBlinkAt: 0,
        nextLook: prev?.nextLook ?? 3,
        lookUntil: 0,
        look: 0,
        hootUntil: 0,
      }
    } else {
      this.owl = null
    }

    // Crown — a wide cluster of leafy blobs that hangs over the owl, lit by the moon (upper right).
    const R = Math.round(clamp(Math.min(H * 0.2, W * 0.28), 18, 54))
    const cx = Math.round(trunkX + R * 0.35)
    const cy = Math.round(owlY - R * 0.42)
    const blobs = [
      { x: 0, y: -R * 0.1, r: R * 0.78 },
      { x: -R * 0.75, y: R * 0.05, r: R * 0.5 },
      { x: R * 0.8, y: R * 0.05, r: R * 0.52 },
      ...Array.from({ length: 10 }, () => ({
        x: between(rng, -1, 1) * R * 1.05,
        y: between(rng, -0.75, 0.3) * R,
        r: between(rng, 0.3, 0.5) * R,
      })),
    ]
    const box = {
      x: Math.floor(cx - R * 2),
      y: Math.floor(cy - R * 1.4),
      w: Math.ceil(R * 4),
      h: Math.ceil(R * 2.4),
    }
    const crown = new PixelBuffer(box.w, box.h)
    // Leave a rounded hollow around the owl so the leaves frame its head.
    const hollowTop = owlY + 1
    const hollowCx = owlX + OWL_W / 2
    const inHollow = (sx: number, sy: number) => {
      if (!this.opts.owl || sx < owlX - 3 || sx > owlX + OWL_W + 2) return false
      if (sy >= hollowTop) return true
      const dx = (sx - hollowCx) / (OWL_W / 2 + 3)
      const dy = (sy - hollowTop) / 7
      return dx * dx + dy * dy <= 1
    }

    for (let y = 0; y < box.h; y++) {
      for (let x = 0; x < box.w; x++) {
        const sx = box.x + x
        const sy = box.y + y
        if (sy > branchY + 1 || inHollow(sx, sy)) continue
        let best = -1
        let bx = 0
        let by = 0
        let br = 1
        for (const b of blobs) {
          const d = Math.hypot(sx - (cx + b.x), sy - (cy + b.y))
          const depth = (b.r - d) / b.r
          if (depth > best) {
            best = depth
            bx = cx + b.x
            by = cy + b.y
            br = b.r
          }
        }
        if (best < 0) continue
        if (best < 0.14 && bayer(x * 3, y * 5) > 0.55) continue // ragged leafy edge

        const nx = (sx - bx) / br
        const ny = (sy - by) / br
        const light = nx * 0.62 - ny * 0.78 // moon is up and to the right
        const v = 0.42 + light * 0.42 + best * 0.18 - ((sy - box.y) / box.h) * 0.3
        const level = clamp(Math.floor(v * 4 + (bayer(x, y) - 0.5) * 0.8), 0, 4)
        crown.set(x, y, LEAVES[level])
      }
    }

    this.crownBox = box
    this.crown = { sprite: crown.toCanvas(), x: box.x, y: box.y, amp: 1, phase: 1.3, curve: 1.2 }
  }

  private buildFireflies(rng: Rng, horizon: number, groundY: number) {
    const { W, H } = this
    const count = clamp(Math.round((W * H) / 3200), 6, 34)
    this.fireflies = Array.from({ length: count }, () => ({
      x: rng() * W,
      y: between(rng, horizon - H * 0.05, groundY - 2),
      rx: between(rng, 4, 16),
      ry: between(rng, 2, 8),
      sx: between(rng, 0.15, 0.5),
      sy: between(rng, 0.2, 0.6),
      phase: rng() * Math.PI * 2,
      pulse: between(rng, 0.8, 2.2),
    }))
  }

  private reportOwl() {
    if (!this.opts.onOwlRect) return
    if (!this.owl) return this.opts.onOwlRect(null)
    const s = this.cssScale
    this.opts.onOwlRect({ x: this.owl.x * s, y: this.owl.y * s, width: OWL_W * s, height: OWL_H * s })
  }

  // --- update --------------------------------------------------------------------------

  private update(t: number, dt: number) {
    const { W, H } = this

    for (const c of this.clouds) {
      c.x += c.speed * dt
      if (c.x > W + 2) c.x = -c.sprite.width - 2
    }

    if (t > this.nextMeteor) {
      const dir = Math.random() < 0.5 ? -1 : 1
      const angle = 0.3 + Math.random() * 0.35
      const speed = H * (0.95 + Math.random() * 0.6)
      this.meteors.push({
        x: W * (0.15 + Math.random() * 0.75),
        y: H * (0.03 + Math.random() * 0.28),
        vx: Math.cos(angle) * speed * dir,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: 0.45 + Math.random() * 0.4,
        length: 10 + Math.random() * 14,
      })
      this.nextMeteor = t + 2.5 + Math.random() * 6.5
    }
    for (const m of this.meteors) {
      m.age += dt
      m.x += m.vx * dt
      m.y += m.vy * dt
    }
    this.meteors = this.meteors.filter((m) => m.age < m.life)

    if (t > this.nextLeaf && this.crownBox.w) {
      const b = this.crownBox
      this.particles.push({
        kind: 'leaf',
        x: b.x + b.w * (0.3 + Math.random() * 0.5),
        y: b.y + b.h * 0.75,
        vx: 2 + Math.random() * 3,
        vy: 7 + Math.random() * 4,
        age: 0,
        life: 9,
        phase: Math.random() * 6,
      })
      this.nextLeaf = t + 5 + Math.random() * 8
    }
    for (const p of this.particles) {
      p.age += dt
      if (p.age < 0) continue
      if (p.kind === 'leaf') {
        p.x += (p.vx + Math.sin(p.age * 2.2 + p.phase) * 6) * dt
        p.y += p.vy * dt
      } else {
        p.x += (p.vx + Math.sin(p.age * 6 + p.phase) * 8) * dt
        p.y += p.vy * dt
      }
    }
    this.particles = this.particles.filter((p) => p.age < p.life && p.y < H)

    const owl = this.owl
    if (owl) {
      if (t > owl.nextBlink) {
        owl.blinkUntil = t + 0.14
        owl.nextBlink = t + 2.2 + Math.random() * 3.6
        if (Math.random() < 0.25) owl.doubleBlinkAt = t + 0.32
      }
      if (owl.doubleBlinkAt && t > owl.doubleBlinkAt) {
        owl.blinkUntil = t + 0.12
        owl.doubleBlinkAt = 0
      }
      if (t > owl.nextLook) {
        owl.look = Math.random() < 0.5 ? -1 : 1
        owl.lookUntil = t + 0.8 + Math.random() * 1.6
        owl.nextLook = owl.lookUntil + 2 + Math.random() * 4
      }
      if (t > owl.lookUntil) owl.look = 0
    }
  }

  // --- drawing ---------------------------------------------------------------------------

  private draw(t: number) {
    const { ctx, W, H, moon } = this
    if (!this.sky) return
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(this.sky, 0, 0)

    this.drawStars(t)
    if (this.moonSprite) ctx.drawImage(this.moonSprite, moon.x - moon.r, moon.y - moon.r)
    this.drawMeteors()

    ctx.globalAlpha = 0.92
    for (const c of this.clouds) ctx.drawImage(c.sprite, Math.round(c.x), c.y)
    ctx.globalAlpha = 1

    if (this.farLayer) ctx.drawImage(this.farLayer, 0, 0)
    for (const tree of this.midTrees) this.drawSwaying(tree, t)
    if (this.groundLayer) ctx.drawImage(this.groundLayer, 0, 0)
    for (const tree of this.frontTrees) this.drawSwaying(tree, t)
    if (this.trunkLayer) ctx.drawImage(this.trunkLayer, 0, 0)
    if (this.crown) this.drawSwaying(this.crown, t)

    this.drawOwl(t)
    this.drawParticles()
    this.drawFireflies(t)
  }

  private drawStars(t: number) {
    const { ctx } = this
    const still = this.opts.reducedMotion
    for (let g = 0; g < this.starsByColor.length; g++) {
      ctx.fillStyle = STAR_COLORS[g]
      for (const s of this.starsByColor[g]) {
        const wave = still ? 1 : 0.5 + 0.5 * Math.sin(t * s.speed + s.phase)
        const a = Math.round(s.alpha * (1 - s.twinkle + s.twinkle * wave) * 5) / 5
        if (a <= 0) continue
        ctx.globalAlpha = a
        ctx.fillRect(s.x, s.y, 1, 1)
        if (s.bright) {
          ctx.globalAlpha = a * 0.45
          ctx.fillRect(s.x - 1, s.y, 1, 1)
          ctx.fillRect(s.x + 1, s.y, 1, 1)
          ctx.fillRect(s.x, s.y - 1, 1, 1)
          ctx.fillRect(s.x, s.y + 1, 1, 1)
          if (wave > 0.75) {
            ctx.globalAlpha = a * 0.2
            ctx.fillRect(s.x - 2, s.y, 1, 1)
            ctx.fillRect(s.x + 2, s.y, 1, 1)
            ctx.fillRect(s.x, s.y - 2, 1, 1)
            ctx.fillRect(s.x, s.y + 2, 1, 1)
          }
        }
      }
    }
    ctx.globalAlpha = 1
  }

  private drawMeteors() {
    const { ctx } = this
    for (const m of this.meteors) {
      const fade = Math.min(1, m.age / 0.08, (m.life - m.age) / 0.25)
      const speed = Math.hypot(m.vx, m.vy)
      const step = Math.max(Math.abs(m.vx), Math.abs(m.vy))
      const ux = m.vx / step
      const uy = m.vy / step
      const trail = Math.min(m.length, m.age * speed)
      for (let i = 0; i < trail; i++) {
        ctx.globalAlpha = fade * (1 - i / trail) * 0.95
        ctx.fillStyle = i < 2 ? '#ffffff' : i < trail * 0.4 ? '#e4e9ff' : '#9fb0ff'
        ctx.fillRect(Math.round(m.x - ux * i), Math.round(m.y - uy * i), 1, 1)
      }
      ctx.globalAlpha = fade * 0.5
      ctx.fillStyle = '#ffffff'
      const hx = Math.round(m.x)
      const hy = Math.round(m.y)
      ctx.fillRect(hx, hy - 1, 1, 1)
      ctx.fillRect(hx, hy + 1, 1, 1)
      ctx.fillRect(hx + Math.sign(m.vx), hy, 1, 1)
    }
    ctx.globalAlpha = 1
  }

  /** Draws a sprite in horizontal slices that lean further the higher they are. */
  private drawSwaying(tree: SwayingSprite, t: number) {
    const { ctx } = this
    const { sprite, x, y, amp, phase, curve } = tree
    const h = sprite.height
    const wind = this.opts.reducedMotion ? 0 : Math.sin(t * 0.9 + phase) * 0.6 + Math.sin(t * 0.37 + phase * 1.7) * 0.4
    const offsetAt = (row: number) => Math.round(amp * wind * Math.pow(1 - row / h, curve))

    let start = 0
    let prev = offsetAt(0)
    for (let row = 1; row <= h; row++) {
      const off = row < h ? offsetAt(row) : Number.NaN
      if (off !== prev) {
        const rows = row - start
        ctx.drawImage(sprite, 0, start, sprite.width, rows, x + prev, y + start, sprite.width, rows)
        start = row
        prev = off
      }
    }
  }

  private owlFrame(pose: OwlPose) {
    const key = `${pose.look}|${pose.eyes}|${pose.beakOpen}`
    let frame = this.owlFrames.get(key)
    if (!frame) {
      const rows = owlRows(pose)
      frame = document.createElement('canvas')
      frame.width = OWL_W
      frame.height = OWL_H
      const fctx = frame.getContext('2d')!
      rows.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          const color = OWL_PALETTE[row[x]]
          if (!color) continue
          fctx.fillStyle = color
          fctx.fillRect(x, y, 1, 1)
        }
      })
      this.owlFrames.set(key, frame)
    }
    return frame
  }

  private drawOwl(t: number) {
    const owl = this.owl
    if (!owl) return
    const hooting = t < owl.hootUntil
    const pose: OwlPose = {
      look: owl.look,
      eyes: hooting ? 'happy' : t < owl.blinkUntil ? 'closed' : 'open',
      beakOpen: hooting && Math.floor(t * 7) % 2 === 0,
    }
    const hop = hooting && Math.floor(t * 7) % 2 === 0 ? 1 : 0
    this.ctx.drawImage(this.owlFrame(pose), owl.x, owl.y - hop)
  }

  private drawParticles() {
    const { ctx } = this
    for (const p of this.particles) {
      if (p.age < 0) continue
      const x = Math.round(p.x)
      const y = Math.round(p.y)
      if (p.kind === 'leaf') {
        ctx.globalAlpha = Math.min(1, (p.life - p.age) / 1.5)
        ctx.fillStyle = '#3d6688'
        ctx.fillRect(x, y, 1, 1)
        ctx.fillStyle = '#294a6e'
        ctx.fillRect(x + (Math.sin(p.age * 2.2 + p.phase) > 0 ? 1 : -1), y + 1, 1, 1)
      } else {
        ctx.globalAlpha = Math.max(0, 1 - p.age / p.life)
        ctx.fillStyle = '#fff1cc'
        NOTE_ROWS.forEach((row, ry) => {
          for (let rx = 0; rx < row.length; rx++) if (row[rx] === '#') ctx.fillRect(x + rx, y + ry, 1, 1)
        })
      }
    }
    ctx.globalAlpha = 1
  }

  private drawFireflies(t: number) {
    const { ctx } = this
    for (const f of this.fireflies) {
      const glow = this.opts.reducedMotion ? 0.8 : 0.5 + 0.5 * Math.sin(t * f.pulse + f.phase)
      if (glow < 0.25) continue
      const x = Math.round(f.x + Math.sin(t * f.sx + f.phase) * f.rx)
      const y = Math.round(f.y + Math.cos(t * f.sy + f.phase * 1.3) * f.ry)
      if (glow > 0.65) {
        ctx.globalAlpha = (glow - 0.65) * 0.9
        ctx.fillStyle = '#b8ff5c'
        ctx.fillRect(x - 1, y, 3, 1)
        ctx.fillRect(x, y - 1, 1, 3)
      }
      ctx.globalAlpha = glow
      ctx.fillStyle = '#efffa8'
      ctx.fillRect(x, y, 1, 1)
    }
    ctx.globalAlpha = 1
  }
}
