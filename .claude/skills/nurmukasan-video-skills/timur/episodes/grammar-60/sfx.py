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
# timeline (grammar-60)
heart = lambda: cat([tri(55, 0.12, 0.9, 14), np.zeros(int(SR * 0.08)), tri(50, 0.16, 0.7, 12)])
fanfare_sad = lambda: cat([sq(f, d, 0.13, 0.5) for f, d in ((523, 0.12), (494, 0.12), (466, 0.12), (440, 0.4))])
page = lambda: np.convolve(noise(0.12, 0.2, 0.05), np.ones(10) / 10, 'same')
at(0.0, big()); at(0.02, thud())
for t in T['roll'][1:-1]: at(t, tick())  # one tick per counter step, faster and faster
at(T['roll'][-1], coin()); at(T['roll'][-1] + 0.01, thud())  # lands on the spoken "2400"
at(T['u7'], glitch()); at(T['u7'] + 0.1, blip())
at(T['notone'] + 0.5, pop()); at(T['notone'] + 1.1, pop()); at(T['book'], power())
at(T['day0'] + 0.05, big()); at(T['mock0'], whoosh()); at(T['all5'] + 0.1, thud()); at(T['all5'] + 0.15, down())
for k in ('L0', 'R0', 'W0', 'S0'): at(T[k], pop())
at(T['errors'], blip())
at(T['rule'] + 0.05, power()); at(T['notebook'] + 0.2, scribble(0.8))
at(T['wk1'] + 0.05, big())
for k in range(4): at(T['t12'] + 0.15 + k * 0.22, tick())
at(T['tenses'] - 0.1, pop()); at(T['tenses'] + 0.3, scribble(3.5))
at(T['test90'] + 0.1, whoosh()); at(T['p90'], thud()); at(T['p90'] + 0.05, ding())
at(T['wk2'] + 0.05, big())
for k in ('art', 'passive', 'cond'): at(T[k], pop()); at(T[k] + 0.05, page())
at(T['explain'] + 0.1, pop()); at(T['owlsleep'] - 0.1, sweep(0.8, 600, 200, 0.05)); at(T['owlsleep'] + 0.4, hoot())
at(T['d30'] + 0.05, big())
for k in range(4): at(T['ex1200'] + 0.15 + k * 0.2, tick())
at(T['mockW'] + 0.05, whoosh()); at(T['w6'], thud()); at(T['w6'] + 0.05, ding()); at(T['noerr'], coin())
at(T['mockS'] + 0.05, down()); at(T['speak'] - 0.1, pop())
hb = T['built'] + 0.2
while hb < T['timeout'] - 0.3: at(hb, heart()); hb += 0.9
for i in range(4): at(T['built'] + 0.3 + i * 0.45, blip())
at(T['timeout'], cat([sq(880, 0.15, 0.14), sq(660, 0.3, 0.14)]))
at(T['twist'], glitch()); at(T['twist'] + 0.05, big()); at(T['quarter'], thud())
for i in range(3): at(T['rest'] + i * 0.35, pop())
at(T['notLR'] + 0.2, pop()); at(T['notLR'] + 0.5, pop()); at(T['notLR'] + 1.2, down())
rattle = lambda: cat([np.pad(tri(900 + 200 * (k % 3), 0.05, 0.25, 40), (0, int(SR * 0.03))) for k in range(6)])  # bones clacking
at(T['skeleton'], rattle()); at(T['nospeak'] + 0.2, pop()); at(T['nospeak'] + 0.6, blip()); at(T['nospeak'] + 0.8, pop())
at(T['d60'] + 0.05, big()); at(T['d60'] + 0.9, coin()); at(T['examw'], blip())
at(T['result'] + 0.05, big())
for i, k in enumerate(('rW', 'rR', 'rL', 'rS')): at(T[k], sq(659 + i * 130, 0.14, 0.13))
at(T['overall'] - 0.05, thud()); at(T['overall'], fanfare_sad())
at(T['tool'], ding()); at(T['notgoal'] + 0.4, pop())
at(T['min20'] + 0.05, power())
for k in ('aloud', 'essay', 'text'): at(T[k], pop())
at(T['aloud'] + 0.1, coin()); at(T['notyours'], blip())
at(T['cta'] + 0.1, whoosh()); at(T['cta'] + 0.3, hoot()); at(T['comments'], pop()); at(T['check'] + 0.5, cat([sq(1318, 0.06, 0.12), sq(1760, 0.18, 0.12)]))
out = np.clip(out, -1, 1)
with wave.open('sfx.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('sfx ok', DUR)
