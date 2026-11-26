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
# timeline (hours-16)
heart = lambda: cat([tri(55, 0.12, 0.9, 14), np.zeros(int(SR * 0.08)), tri(50, 0.16, 0.7, 12)])
clank = lambda: tri(320, 0.18, 0.5, 18) + np.pad(noise(0.05, 0.25, 0.01), (0, int(SR * 0.18) - int(SR * 0.05)))
click = lambda: cat([sq(1400, 0.02, 0.16), np.zeros(int(SR * 0.03)), sq(700, 0.03, 0.12)])
fanfare = lambda: cat([sq(f, d, 0.13, 0.5) for f, d in ((523, 0.1), (659, 0.1), (784, 0.1), (1046, 0.22), (784, 0.1), (1046, 0.45))])
at(0.0, big()); at(0.02, thud())
for t in T['roll'][1:-1]: at(t, tick())  # one tick per counter step, faster and faster
at(T['roll'][-1], coin()); at(T['roll'][-1] + 0.01, thud())  # lands on the spoken "960"
at(T['u6'], glitch()); at(T['u6'] + 0.1, blip())
for i in range(4): at(T['notone'] + 0.4 + i * 0.3, pop())
at(T['allatonce'], power())
at(T['day0'] + 0.05, big()); at(T['mock0'], whoosh()); at(T['all5'] + 0.1, thud()); at(T['all5'] + 0.15, down())
for k in ('L0', 'R0', 'W0', 'S0'): at(T[k], pop())
at(T['rule'] + 0.15, power()); at(T['wake7'], cat([sq(1760, 0.07, 0.12), np.zeros(int(SR * 0.05)), sq(1760, 0.07, 0.12)])); at(T['bed2'], blip()); at(T['rest'] + 0.2, pop())
at(T['wk1'] + 0.05, big())
for k in range(8): at(T['h112'] - 0.4 + k * 0.12, tick())
at(T['h112'] + 0.6, coin()); at(T['m6'] + 0.05, ding())
at(T['wk2'] + 0.05, big()); at(T['cans'] + 0.6, clank()); at(T['cans'] + 1.3, clank()); at(T['cans'] + 1.9, clank())
at(T['mom'] - 0.1, pop()); at(T['noans'], blip())
at(T['wk3'] + 0.05, down())
for k in range(3): at(T['page'] + 0.4 + k * 0.6, np.convolve(noise(0.12, 0.2, 0.05), np.ones(10) / 10, 'same'))
at(T['noword'], down())
at(T['d30'] + 0.05, big()); at(T['mockL'], blip()); at(T['closed'] + 0.4, sweep(1.2, 700, 150, 0.06))
hb = T['closed'] + 1.4
while hb < T['m5'] - 0.4: at(hb, heart()); hb += 1.0
at(T['m5'], thud()); at(T['m5'] + 0.05, down()); at(T['likeday0'], down())
at(T['twist'], glitch()); at(T['twist'] + 0.05, big()); at(T['h480'], thud()); at(T['zero'], down())
at(T['brain'], sweep(1.2, 900, 200, 0.05)); at(T['nosleep'], blip()); at(T['real4'], thud())
at(T['owl'] + 0.2, hoot()); at(T['owl'] + 0.95, click())
at(T['rule2'] + 0.05, power())
for k in ('blocks', 'sleep8', 'walk'): at(T[k], pop())
at(T['d40'] + 0.05, big()); at(T['d40'] + 0.6, coin()); at(T['d50'], coin()); at(T['d50'] + 0.3, ding()); at(T['half'], power())
at(T['d60'] + 0.05, big()); at(T['examw'], blip()); at(T['exam'] - 0.1, pop())
at(T['result'] + 0.05, big())
for i, k in enumerate(('rL', 'rR', 'rW', 'rS')): at(T[k], sq(659 + i * 130, 0.14, 0.13))
at(T['overall'] - 0.05, thud()); at(T['overall'], fanfare())
for k in range(10): at(T['overall'] + 0.3 + k * 0.11, sq(1500 + rng.random() * 900, 0.03, 0.06))
at(T['moral'], ding()); at(T['notsit'], pop()); at(T['rest2'], power())
at(T['cta'] + 0.1, whoosh()); at(T['cta'] + 0.3, hoot()); at(T['comments'], pop()); at(T['check'] + 0.5, cat([sq(1318, 0.06, 0.12), sq(1760, 0.18, 0.12)]))
out = np.clip(out, -1, 1)
with wave.open('sfx.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('sfx ok', DUR)
