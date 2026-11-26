import numpy as np, wave, json, re
T = json.loads(re.search(r'export const T = (\{.*?\})\n', open('edit/times.jsx').read()).group(1))
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
# timeline
for i, t in enumerate((0.05, T['u4'] * 0.33, T['u4'] * 0.66)): at(t, glitch()); at(t + 0.02, pop())
at(0.1, big()); at(T['u4'], glitch()); at(T['u4'] + 0.1, blip())
for i in range(3): at(T['not'] + i * 0.5, tri(140, 0.12, 0.5))
at(T['listen'], power())
at(T['day0'] + 0.05, big()); at(T['day0'] + 0.6, blip())
at(T['exam0'] - 0.1, pop())
for k in range(int((T['exam0_end'] - T['exam0'] - 1.7) / 0.15)): at(T['exam0'] + 1.5 + k * 0.15, tick())
at(T['writes'] + 0.6, down()); at(T['l5'] - 0.1, whoosh()); at(T['l5'] + 0.15, thud())
at(T['rule'] + 0.1, power())
at(T['h20'] - 0.6, tick()); at(T['h20'] - 0.3, tick()); at(T['h20'], tick()); at(T['h20'] + 0.3, tick()); at(T['mock5'], thud()); at(T['mock5'] + 0.1, down())
at(T['twist'], glitch()); at(T['twist'] + 0.05, big()); at(T['twist'] + 0.9, thud())
at(T['dict'] + 0.05, power())
at(T['pausew'], sq(400, 0.06, 0.12)); at(T['pausew'] + 0.5, sweep(0.35, 1400, 300, 0.07)); at(T['pausew'] + 1.1, scribble(1.4))
at(T['owl'] + 0.1, hoot()); at(T['owl'] + 0.4, cat([sq(220 + 20 * (i % 3), 0.04, 0.08) for i in range(14)]))
at(T['week3'] + 0.05, big()); at(T['speed'], sweep(1.6, 300, 1500, 0.06))
at(T['back'], sweep(0.8, 900, 200, 0.07)); at(T['back'] + 2.0, blip())
at(T['week4'] + 0.05, big())
for k in range(10): at(T['week4'] + 0.5 + k * max(0.06, (T['aus'] - T['week4'] - 1.3) / 10), tick())
at(T['aus'] - 0.35, coin())
for k in range(10): at(T['terp'] + 0.6 + k * max(0.05, (T['scot'] - T['terp'] - 1.0) / 10), tick())
at(T['scot'] - 0.3, coin())
for k in range(int((T['scot_end'] - T['scot'] - 0.9) / 0.15)): at(T['scot'] + 0.8 + k * 0.15, tick())
at(T['nocom'], down()); at(T['nocom'] + 0.2, thud())
at(T['day40'] + 0.05, big()); at(T['locked'], cat([sq(196, 0.05, 0.18), sq(392, 0.12, 0.16)])); at(T['locked'] + 0.05, thud())
at(T['busw'], whoosh()); at(T['streetw'], whoosh()); at(T['kitchenw'], whoosh())
at(T['nohear'] + 0.05, blip()); at(T['nohear'] + 0.5, blip())
at(T['day50'] + 0.05, big()); at(T['podcast'], coin()); at(T['voice'], sweep(0.5, 400, 800, 0.05))
at(T['jake'] - 0.1, pop()); at(T['jake'] + 0.8, ding())
at(T['day60'] + 0.05, big()); at(T['exam'], blip()); at(T['trap'], thud())
at(T['exam60'] - 0.1, pop())
at(T['forty'] + 0.2, coin()); at(T['noblink'] + 0.2, power())
at(T['result'] + 0.05, big())
for i in range(4): at(T['result'] + 0.6 + i * (T['four'] - T['result'] - 2.0) / 3.4, sq(659 + i * 130, 0.12, 0.13))
at(T['four'] - 1.2, big()); at(T['four'] - 1.2, thud())
for k in ('four', 'four2', 'four3'): at(T[k], glitch()); at(T[k] + 0.05, thud())
at(T['const'], rumble(T['allatonce'] - T['const'], 0.1))
at(T['always1'], blip()); at(T['always2'], blip()); at(T['owlc'], power()); at(T['owlc'] + 0.05, hoot())
at(T['allatonce'] + 0.1, whoosh()); at(T['knows'], big()); at(T['knows'] + 0.6, cat([sq(1318, 0.06, 0.12), sq(1760, 0.18, 0.12)]))
out = np.clip(out, -1, 1)
with wave.open('sfx.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('sfx ok', DUR)
