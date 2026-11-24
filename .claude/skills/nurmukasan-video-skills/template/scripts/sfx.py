# sfx.py — 8-bit sound effects generated with numpy, timed from edit/times.jsx. Mixed at volume 0.38 under the voice.
import numpy as np, wave, json, re
T = json.loads(re.search(r'export const T = (\{.*?\})\n', open('edit/times.jsx').read()).group(1))
c0 = lambda k: T[k] - 0.08
SR = 48000; DUR = T['END']
out = np.zeros(int(SR * DUR) + SR)
rng = np.random.default_rng(7)
def env(n, a=0.004, r=0.03):
    e = np.ones(n); ai = min(n // 3, int(SR * a)); ri = min(n // 2, int(SR * r))
    e[:ai] = np.linspace(0, 1, ai); e[-ri:] = np.minimum(e[-ri:], np.linspace(1, 0, ri)); return e
def sq(f, d, v=0.2, duty=0.5):
    t = np.arange(int(SR * d)) / SR
    return np.where((t * f) % 1 < duty, 1.0, -1.0) * v * env(len(t))
def tri(f, d, v=0.4, k=10):
    t = np.arange(int(SR * d)) / SR
    return (2 * np.abs(2 * ((t * f) % 1) - 1) - 1) * v * np.exp(-t * k)
def noise(d, v=0.3, k=0.04):
    n = rng.uniform(-1, 1, int(SR * d)); return n * v * np.exp(-np.arange(len(n)) / (SR * k))
def lp(x, n=40): return np.convolve(x, np.ones(n) / n, 'same')
def at(t, s, g=1.0):
    i = int(max(0, t) * SR); j = min(len(out), i + len(s)); out[i:j] += g * s[: j - i]
cat = lambda parts: np.concatenate(parts)
pop = lambda: sq(1318, 0.04, 0.12)                       # chip / card appears
blip = lambda: sq(988, 0.05, 0.13)
coin = lambda: cat([sq(988, 0.05, 0.12), sq(1318, 0.12, 0.12)])
ding = lambda: cat([sq(1318, 0.07, 0.11), sq(1760, 0.22, 0.10)])
power = lambda: cat([sq(f, 0.05, 0.12, 0.25) for f in (523, 659, 784, 1046, 1318)])   # rule / decision
big = lambda: cat([sq(f, 0.07, 0.14, 0.5) for f in (392, 523, 659, 784)] + [sq(1046, 0.28, 0.12, 0.5)])  # day banners
down = lambda: cat([sq(f, 0.09, 0.12, 0.5) for f in (523, 440, 349, 262)])            # bad news
thud = lambda: tri(70, 0.3, 0.9, 9) + np.pad(lp(noise(0.08, 0.3)), (0, int(SR * 0.3) - int(SR * 0.08)))  # stamp
tick = lambda: sq(1568, 0.02, 0.08)
whoosh = lambda: lp(noise(0.22, 0.25, 0.08), 12) * np.linspace(0.2, 1, int(SR * 0.22))
glitch = lambda: cat([sq(f, 0.03, 0.10, 0.3) for f in (1800, 300, 2400, 220, 1500, 900)])
hoot = lambda: tri(420, 0.2, 0.5, 6) + tri(380, 0.2, 0.35, 6)                          # the owl
heart = lambda: cat([tri(55, 0.12, 0.9, 14), np.zeros(int(SR * 0.08)), tri(50, 0.16, 0.7, 12)])
def sweep(d, f0, f1, v=0.1):
    t = np.arange(int(SR * d)) / SR; f = f0 + (f1 - f0) * t / d; ph = np.cumsum(f) / SR
    return np.where(ph % 1 < 0.5, 1.0, -1.0) * v * env(len(t), 0.01, 0.05)
def scribble(d):
    o = []
    while sum(len(x) for x in o) < SR * d:
        n = lp(rng.uniform(-1, 1, int(SR * (0.04 + rng.random() * 0.06))) * 0.10, 6); o.append(n); o.append(np.zeros(int(SR * rng.random() * 0.03)))
    return cat(o)[: int(SR * d)]
def rain(d, v=0.05):
    n = lp(rng.uniform(-1, 1, int(SR * d)), 18) * v * 3
    drops = np.zeros_like(n)
    for k in range(int(d * 14)): i = rng.integers(0, len(n) - 400); drops[i:i + 300] += tri(2000 + rng.random() * 1500, 300 / SR, 0.03, 60)
    e = np.minimum(1, np.arange(len(n)) / (SR * 0.6)) * np.minimum(1, (len(n) - np.arange(len(n))) / (SR * 0.8))
    return (n + drops) * e
arp = lambda: cat([tri(f, 0.11, 0.25, 8) for f in (523, 659, 784, 1046, 784, 1046, 1318, 1568)])
fanfare = lambda: cat([sq(f, d, 0.13, 0.5) for f, d in ((523, 0.1), (659, 0.1), (784, 0.1), (1046, 0.22), (784, 0.1), (1046, 0.45))])
# ---- timeline (episode example) ----
at(0.02, glitch()); at(0.08, big(), 0.8); at(0.55, heart(), 0.9); at(1.35, heart(), 0.8)
for k in range(5): at(0.7 + k * 0.4, tick())
at(c0('kat') - 0.1, whoosh()); at(T['kat'], pop()); at(c0('eng') + 0.1, blip()); at(T['b2'], coin()); at(T['c1'], ding())
at(c0('mock3') - 0.05, sweep(0.5, 1400, 250, 0.07)); at(T['mock3'] + 0.1, pop()); at(T['f55e'] + 0.2, thud()); at(T['f55e'] + 0.25, down(), 0.8)
at(T['dozens'] + 0.9, pop())
for k in ('friends', 'cafe', 'help'): at(c0(k) - 0.06, whoosh(), 0.6); at(T[k] + 0.3, pop())
at(T['friend'] - 0.2, ding())
at(T['noans'] + 0.1, sq(330, 0.12, 0.08))
at(T['holid'], power()); at(T['holid'] + 0.1, pop())
at(c0('cancel') + 0.05, pop())
for k in ('smeny', 'kino', 'vstr', 'phone'): at(T[k] + 0.1, scribble(0.25))
at(T['vstr'] + 0.55, thud(), 0.7)
at(c0('phone') + 0.75, tri(110, 0.18, 0.7, 14))
at(T['d7'], big()); at(T['h168'], thud()); at(T['h168'] + 0.02, power())
at(T['each'] + 0.1, pop())
at(T['katya1_end'] - 0.9, coin()); at(T['katya1_end'] - 0.9, power(), 0.7)
for k in ('day1', 'day2', 'day7', 'examday'): at(T[k], big())
at(T['rule1'] + 0.2, power()); at(T['rule2'] + 0.1, power())
at(T['w100'], glitch()); at(T['w100'] + 0.15, thud(), 0.6)
at(T['week'] + 1.2, scribble(0.3)); at(T['exam1'], thud()); at(T['exam1'] + 0.02, big(), 0.8)
for k in ('L', 'R', 'Wr', 'S'): at(T[k] - 0.1, coin())
for k in range(4): at(c0('slow') + 0.15 * (k + 1), tick())
at(T['fast'], ding()); at(T['ans'] + 0.2, pop()); at(c0('closed'), coin()); at(T['turns'], ding())
for k in ('intro', 'par2', 'concl'): at(T[k], blip())
at(T['par2'] + 0.35, blip()); at(T['tmpl'] + 0.3, thud(), 0.7)
at(c0('speak20') + 0.1, cat([sq(880, 0.06, 0.1), sq(660, 0.06, 0.1)]))
at(c0('sched') + 0.05, pop())
for k in ('up7', 'mock9', 'w50', 'off11'): at(T[k], coin(), 0.8)
at(c0('sleepedu'), tri(660, 1.2, 0.2, 2.5) + tri(990, 1.2, 0.12, 2.5))
at(c0('brain'), sweep(1.0, 300, 1200, 0.05)); at(c0('brain') + 0.3, arp(), 0.8); at(c0('brain') + 1.4, arp(), 0.6)
at(T['nosleep'], down())
at(T['day4'], down(), 0.9); at(T['m6'] + 0.1, thud(), 0.6)
at(c0('cry'), rain(T['owl'] - c0('cry') + 0.3))
at(c0('owl') + 0.4, hoot(), 0.8)
at(T['day5'], power()); at(T['m65'], coin()); at(T['day6'], power()); at(T['m7'], big())
at(T['nomocks'], pop()); at(T['walk'] + 0.6, pop()); at(T['walk'] + 1.4, pop())
for k in range(int((T['part'] - T['examday']) / 0.5)): at(T['examday'] + 0.4 + k * 0.5, tick())
at(T['part'], coin()); at(T['trap'], coin())
at(T['res'], big())
for k in range(int((T['rL'] - T['res'] - 0.4) / 0.06)): at(T['res'] + 0.3 + k * 0.06, tick(), 0.7)
for i, k in enumerate(('rL', 'rR', 'rW', 'rS')): at(T[k], sq(659 + i * 130, 0.14, 0.12))
at(c0('rO'), thud()); at(c0('rO') + 0.05, fanfare())
for k in range(10): at(c0('rO') + 0.3 + k * 0.11, sq(1500 + rng.random() * 900, 0.03, 0.06))
at(T['end1'], ding()); at(T['end3'], power())
at(c0('cta') + 0.1, pop()); at(c0('cta') + 0.4, hoot()); at(T['cta3'] + 0.3, ding())
out = np.clip(out[: int(SR * DUR)], -1, 1)
with wave.open('sfx.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('sfx ok', DUR)
