import numpy as np, wave, json, re
TL=json.load(open('/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t5/timeline.json'))
LN={l['k']:l for l in TL['lines']}
s=lambda k: LN[k]['start']; e=lambda k: LN[k]['end']
norm=lambda w: re.sub(r'[^a-zа-яё0-9]','',w.lower())
def Wt(k,sub,n=0): return [t for w,t in LN[k]['words'] if norm(sub) in norm(w)][n]
SR = 48000; DUR = TL['END']
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

def roll(d):
    o=[]; t=0
    while t<d: o.append(noise(0.03,0.18,0.01)); o.append(np.zeros(int(SR*0.035))); t+=0.065
    return lp(cat(o),4)
# ---- events ----
at(0.0, big(), 0.9); at(0.02, glitch()); at(0.3, whoosh()); at(0.65, thud()); at(0.66, power(), 0.8)
n2=s('n02'); mk=Wt('n02','мок')
at(n2+0.1, ding()); at(mk-0.12, thud()); at(mk-0.05, down(), 0.8); at(e('n02')-0.55, sweep(0.4,300,1500,0.06))
n3=s('n03')-0.08
for i in range(4): at(n3+i*0.55, glitch(), 0.7)
at(e('t01')-0.1, power())
at(s('n04'), pop()); k=Wt('n04','каждый')
for i in range(4): at(k+i*0.12, blip())
at(Wt('n05','сначала')-0.1, pop()); at(Wt('n05','вопросе')-0.1, pop()); at(Wt('n05','вопросе')+1.3, coin()); at(Wt('n05','если')-0.1, pop())
for i in range(3): at(Wt('n06','число')-0.1+i*0.08, blip())
at(s('x01'), pop()); at(Wt('x01','sorry')-0.05, thud(), 0.6); at(Wt('x01','forty')-0.05, coin())
for i in range(3): at(s('n07')+i*0.85, heart(), 0.9)
at(s('n07')+0.15, down(), 0.7)
for i in range(4): at(s('n08')+i*0.15, blip())
at(s('n08')+0.9, down()); at(e('n08')+0.3, sweep(0.3,900,300,0.06))
at(Wt('n09','второе')-0.1, pop()); k=Wt('n09','позиция')-0.1
for i in range(4): at(k+i*0.35, blip())
at(Wt('n09','первом',1)-0.1, ding())
k=Wt('n10','схема')-0.1
for i in range(3): at(k+i*0.3, pop())
at(Wt('n10','бойся')-0.1, coin())
at(s('mum')-0.05, tick()); at(s('n11')+1.6, hoot(), 0.8); at(s('n11')+0.1, power(), 0.7)
at(s('n12'), arp(), 0.8)
at(s('n13')+0.05, big()); at(s('inv'), tick())
r0=s('n14')
for w in ('лиснинг','ридинг','спикинг'):
    t=Wt('n14',w); at(t-0.6, roll(0.55), 0.8); at(t+0.35, ding())
t=Wt('n14','шесть'); at(t-1.3, roll(1.25), 0.9); at(t+0.3, coin())
ov=Wt('n14','общий')-0.1; at(ov, thud()); at(ov+0.02, fanfare())
at(s('j02')-0.1, blip()); at(s('n15')+0.1, pop()); at(Wt('n15','сова')-0.1, hoot())
out=np.clip(out,-1,1)
with wave.open('/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t5/audio/sfx.wav','wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype(np.int16).tobytes())
print('sfx ok', len(out)/SR)
