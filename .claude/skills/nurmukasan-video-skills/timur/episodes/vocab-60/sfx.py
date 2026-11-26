import numpy as np, wave, json, re
_src = open('edit/times.jsx').read()
T = json.loads(re.search(r'export const T = (\{.*?\})\n', _src).group(1))
D_WORDS = [w[1] for w in json.loads(re.search(r'export const D = (\{.*\})', _src).group(1)).get('words', [])]
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
# timeline (vocab episode)
flip = lambda: np.convolve(noise(0.06, 0.25, 0.02), np.ones(8) / 8, 'same')   # a flashcard flip
at(0.0, big()); at(0.02, thud())
for k in range(6): at(0.35 + k * max(0.12, (T['u5'] - 1.0) / 6), coin() if k == 5 else tick())
for k in range(8): at(0.2 + k * 0.33, flip())
at(T['u5'], glitch()); at(T['u5'] + 0.1, blip()); at(T['nobooks'] + 0.4, tri(140, 0.12, 0.5)); at(T['nobooks'] + 0.9, tri(140, 0.12, 0.5)); at(T['onlycards'], power())
at(T['day0'] + 0.05, big()); at(T['probe'], whoosh()); at(T['s5'] + 0.1, thud()); at(T['s5'] + 0.15, down()); at(T['decided'], blip())
at(T['rule'] + 0.1, power()); at(T['nomiss'], pop())
at(T['day1'] + 0.05, big())
for d in D_WORDS: at(d - 0.04, flip()); at(d, pop())
for k in range(4): at(T['twoh'] + k * 0.33, tick())
at(T['twoh'] + 1.0, ding())
at(T['morning'], sweep(0.6, 1200, 300, 0.06)); [at(T['morning'] + 0.3 + i * 0.25, whoosh()) for i in range(4)]; at(T['morning'] + 1.2, down())
at(T['twist'], glitch()); at(T['twist'] + 0.05, big()); at(T['brainf'], sweep(1.4, 1400, 260, 0.05)); at(T['curve'], thud())
at(T['rule2'] + 0.05, power())
for k in ('today', 'nextday', 'nextweek'): at(T[k], coin())
at(T['owlw'] + 0.1, hoot())
at(T['week2'] + 0.05, big()); at(T['week2'] + 0.6, pop())
for k in ('fridge', 'mirrorw'): at(T[k] - 0.1, whoosh()); at(T[k], flip()); at(T[k] + 0.05, pop())
at(T['onowl'] - 0.15, whoosh()); at(T['onowl'], hoot())
at(T['day30'] + 0.05, big())
for k in range(4): at(T['day30'] + 0.6 + k * 0.3, tick())
at(T['teacher'] + 0.3, scribble(0.4)); at(T['teacher'] + 0.9, scribble(0.45)); at(T['teacher'] + 1.5, scribble(0.5)); at(T['teacher'] + 2.2, sweep(0.4, 500, 900, 0.06))
at(T['day45'] + 0.05, big())
for k in range(3): at(T['callw'] + k * 0.5, cat([sq(880, 0.08, 0.12), sq(1174, 0.12, 0.12)]))
at(T['jake'] - 0.05, pop())
at(T['knew'] + 0.1, blip())
for i in range(6): at(T['knew'] + 0.1 + i * 0.3, cat([sq(1318, 0.04, 0.10), sq(1760, 0.06, 0.10)]))
at(T['couldnt'], down()); at(T['couldnt'] + 0.1, thud())
at(T['bricks'], thud()); at(T['house'], power())
for i in range(33): at(T['house'] + i * 0.022, tick())
at(T['house'] + 0.6, thud()); at(T['house'] + 0.85, ding())
at(T['without'] + 0.3, sweep(0.4, 900, 300, 0.06)); at(T['practice'] + 0.1, down())
at(T['pile'], rumble(0.8, 0.22)); at(T['pile'] + 0.05, thud()); at(T['pile'] + 0.35, thud())
at(T['day60'] + 0.05, big()); at(T['w3000'], coin()); at(T['examw'], blip())
at(T['exam'] - 0.05, pop())
at(T['result'] + 0.05, big())
for i, k in enumerate(('rR', 'rL', 'rW', 'rS')): at(T[k], sq(659 + i * 130, 0.12, 0.13))
at(T['helped'], ding()); at(T['likeday0'], down()); at(T['overall'], thud()); at(T['overall'] + 0.05, down())
at(T['power'] + 0.05, power()); at(T['notyours'], thud())
for k in ('tips', 'listenw', 'usew'): at(T[k], blip())
at(T['five'], big())
at(T['cta'] + 0.1, whoosh()); at(T['cta'] + 0.3, hoot()); at(T['comments'], pop()); at(T['check'] + 0.5, cat([sq(1318, 0.06, 0.12), sq(1760, 0.18, 0.12)]))
out = np.clip(out, -1, 1)
with wave.open('sfx.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('sfx ok', DUR)
