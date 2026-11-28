import numpy as np, wave, json, re
_src = open('edit/times.jsx').read()
T = json.loads(re.search(r'export const T = (\{.*?\})\n', _src).group(1))
SR = 48000; DUR = T['END']
out = np.zeros(int(SR * DUR))
rng = np.random.default_rng(3)
def sq(f, d, v=0.25, duty=0.5):
    t = np.arange(int(SR * d)) / SR
    w = np.where((t * f) % 1 < duty, 1.0, -1.0) * v
    return w * np.minimum(1, (len(t) - np.arange(len(t))) / (SR * 0.02))
def tri(f, d, v=0.4, k=18):
    t = np.arange(int(SR * d)) / SR
    return (2 * np.abs(2 * ((t * f) % 1) - 1) - 1) * v * np.exp(-t * k)
def noise(d, v=0.3, k=0.04):
    n = rng.uniform(-1, 1, int(SR * d)); return n * v * np.exp(-np.arange(len(n)) / (SR * k))
def at(t, s):
    i = int(t * SR); j = min(len(out), i + len(s)); out[i:j] += s[: j - i]
cat = lambda parts: np.concatenate(parts)
blip = lambda: sq(988, 0.05, 0.16)
pop = lambda: sq(1318, 0.04, 0.12)
power = lambda: cat([sq(f, 0.055, 0.15, 0.25) for f in (523, 659, 784, 1046, 1318)])
tick = lambda: sq(1568, 0.025, 0.10)
thud = lambda: tri(70, 0.25, 0.9) + np.pad(noise(0.08, 0.2), (0, int(SR * 0.25) - int(SR * 0.08)))
whoosh = lambda: noise(0.18, 0.12)
glitch = lambda: cat([sq(f, 0.03, 0.12, 0.3) for f in (1800, 300, 2400, 220, 1500, 900)])
big = lambda: cat([sq(f, 0.07, 0.17, 0.5) for f in (392, 523, 659, 784)] + [sq(1046, 0.25, 0.15, 0.5)])
down = lambda: cat([sq(f, 0.09, 0.15, 0.5) for f in (523, 440, 349, 262)])
coin = lambda: cat([sq(988, 0.05, 0.14), sq(1318, 0.12, 0.14)])
hoot = lambda: tri(420, 0.18, 0.6) + tri(380, 0.18, 0.4)
ding = lambda: cat([sq(1318, 0.08, 0.13), sq(1760, 0.2, 0.12)])
def scribble(d):  # pen on paper: filtered noise bursts
    o = []
    while sum(len(x) for x in o) < SR * d:
        n = rng.uniform(-1, 1, int(SR * (0.05 + rng.random() * 0.08))) * 0.07
        n = np.convolve(n, np.ones(6) / 6, 'same'); o.append(n); o.append(np.zeros(int(SR * rng.random() * 0.04)))
    return cat(o)[: int(SR * d)]
def sweep(d, f0, f1, v=0.13):
    t = np.arange(int(SR * d)) / SR; f = f0 + (f1 - f0) * t / d; ph = np.cumsum(f) / SR
    return np.where(ph % 1 < 0.5, 1.0, -1.0) * v
def rumble(d, v=0.18):
    n = rng.uniform(-1, 1, int(SR * d)); n = np.convolve(n, np.ones(120) / 120, 'same') * v * 6
    return n * np.minimum(1, np.arange(len(n)) / (SR * 0.3)) * np.minimum(1, (len(n) - np.arange(len(n))) / (SR * 0.3))
bell = lambda: sum(tri(f, 1.2, 0.35, 3) for f in (880, 1320, 1760))
# timeline (series-60)
heart = lambda: cat([tri(55, 0.12, 0.9, 14), np.zeros(int(SR * 0.08)), tri(50, 0.16, 0.7, 12)])
fanfare = lambda: cat([sq(f, d, 0.13, 0.5) for f, d in ((523, 0.1), (659, 0.1), (784, 0.1), (1046, 0.22), (784, 0.1), (1046, 0.45))])
page = lambda: np.convolve(noise(0.12, 0.2, 0.05), np.ones(10) / 10, 'same')
beep = lambda f=1200: sq(f, 0.06, 0.1)
ring = lambda: cat([cat([sq(1318, 0.05, 0.12), sq(1046, 0.05, 0.12)]) for _ in range(4)] + [np.zeros(int(SR * 0.25))] + [cat([sq(1318, 0.05, 0.12), sq(1046, 0.05, 0.12)]) for _ in range(4)])
rewind = lambda: sweep(0.45, 300, 1600, 0.07)
at(0.0, big()); at(0.02, thud())
at(T['checked'], whoosh())
for t in T['roll'][1:-1]: at(t, tick())
at(T['roll'][-1], coin()); at(T['roll'][-1] + 0.01, thud())
at(T['spoiler'], glitch()); at(T['spoiler'] + 0.05, thud()); at(T['first60'], down())
at(T['u8'], glitch()); at(T['u8'] + 0.1, blip())
at(T['nobooks'], pop()); at(T['nobooks'] + 0.7, pop()); at(T['three'], power())
at(T['day0'] + 0.05, big()); at(T['mock0'], whoosh()); at(T['all5'] + 0.4, thud()); at(T['all5'] + 0.45, down())
at(T['ph1'] + 0.05, big()); at(T['rusub'], pop()); at(T['joke'], ding())
at(T['show'] - 0.1, pop())
at(T['rus'], blip())
at(T['d20'] + 0.05, big())
for k in range(3): at(T['ep60'] + 0.15 + k * 0.25, tick())
at(T['mockL1'] + 0.05, whoosh()); at(T['l5'], thud()); at(T['l5'] + 0.05, down()); at(T['likeday0'], down())
at(T['twist'], glitch()); at(T['twist'] + 0.05, big()); at(T['notlisten'] + 0.2, power()); at(T['noise'], sweep(1.0, 900, 200, 0.05))
at(T['ph2'] + 0.05, big()); at(T['ensub'], pop())
for k in range(3): at(T['ep1'] + 0.2 + k * 0.3, tick())
at(T['h15'], thud()); at(T['pause'], beep(900)); at(T['rewind'], rewind()); at(T['dict'], page())
at(T['phrases'] + 0.1, pop())
for k in ('gonna', 'noway', 'ykw'): at(T[k], cat([sq(988, 0.04, 0.12), sq(1318, 0.06, 0.12)]))
at(T['d40'] + 0.05, big()); at(T['mockL2'] + 0.05, whoosh()); at(T['l6'], thud()); at(T['l6'] + 0.05, ding()); at(T['r6'], coin()); at(T['fastread'], pop())
at(T['ph3'] + 0.05, big()); at(T['nosub'], pop()); at(T['half'] + 0.2, sweep(0.6, 300, 600, 0.05))
at(T['d50'] + 0.05, big()); at(T['d50'] + 0.4, sweep(1.2, 400, 1200, 0.05)); at(T['laughtrack'], ding())
at(T['d55'] + 0.05, big()); at(T['callw'], ring())
at(T['understood'] + 0.1, pop()); at(T['notsaid'], down())
at(T['d60'] + 0.05, big()); at(T['examw'], blip())
at(T['result'] + 0.05, big())
for i, k in enumerate(('rL', 'rR', 'rS', 'rW')): at(T[k], sq(659 + i * 130, 0.14, 0.13))
at(T['overall'] - 0.05, thud()); at(T['overall'], fanfare())
for k in range(10): at(T['overall'] + 0.3 + k * 0.11, sq(1500 + rng.random() * 900, 0.03, 0.06))
at(T['q'], ding()); at(T['understand'], coin()); at(T['speakno'], blip()); at(T['writeno'], down()); at(T['trainer'], power())
at(T['tip1'] + 0.05, power()); at(T['tip2'], pop()); at(T['tip3'], pop())
at(T['cta'] + 0.1, whoosh()); at(T['cta'] + 0.3, hoot()); at(T['comments'], pop()); at(T['check'] + 0.5, cat([sq(1318, 0.06, 0.12), sq(1760, 0.18, 0.12)]))
out = np.clip(out, -1, 1)
with wave.open('sfx.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('sfx ok', DUR)
