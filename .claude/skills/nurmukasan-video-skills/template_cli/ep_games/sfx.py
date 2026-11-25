import numpy as np, wave, json, re
TL=json.load(open('/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t6/timeline.json'))
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
import subprocess
def meme(name, start=0, dur=None, fade=0.3, sp=1.0):
    a=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',T6+'/audio/sfx/'+name+'.mp3','-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout,dtype=np.int16).astype(float)/32768
    a=a[int(start*SR):]
    if dur: a=a[:int(dur*SR)]
    n=int(fade*SR); a[-n:]*=np.linspace(1,0,n); return a
T6="/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t6"
at(0.0, whoosh()); at(0.05, power(), 0.8); at(0.9, tick()); at(1.6, tick())
at(s('n02')+0.05, pop()); mk=Wt('n02','пробный'); at(mk-0.1, thud()); at(mk, down(), 0.7)
at(Wt('n02','но')-0.1, glitch(), 0.7)
at(s('t01')-0.25, meme('dexter',0,3.4,0.6), 1.1)
at(s('n03')-0.05, big(), 0.8)
for w in ('английском','субтитрами','международные'): at(Wt('n03',w)-0.05, coin())
at(s('n04')-0.05, tick()); at(s('p01')-0.1, glitch(), 0.6)
fA=e('t02')+0.05
at(fA, meme('faaah',0.15,1.75,0.3), 1.0); at(fA+0.05, down(), 0.5)
at(s('n05')+0.1, blip())
at(Wt('n06','эмоции')-0.1, pop()); at(Wt('n06','любопытство')-0.1, ding())
at(s('n07')+0.1, pop()); at(Wt('n07','шведские')-0.1, pop())
at(s('t03')-0.1, fanfare(), 0.7); at(s('p02'), coin()); at(s('n09')+0.1, power()); at(s('n09')+0.2, arp(), 0.6)
at(s('n10')+0.1, blip()); at(e('mum')+0.05, meme('huss',0,2.35,0.15), 1.1)
at(s('n11')-0.05, heart(), 0.9); at(e('n11')+0.05, meme('almost',0,1.65,0.35), 1.0)
at(Wt('n12','эссе')-0.35, down(), 0.8)
at(s('n13')+0.05, big(), 0.9); at(s('ex1')-0.05, tick())
for w in ('ридинг','лиснинг','спикинг'):
    t=Wt('n14',w); at(t+0.5, ding())
t=Wt('n14','пять'); at(t+0.1, down(), 0.8); ov=Wt('n14','общий'); at(ov+0.6, thud()); at(ov+0.62, coin())
at(Wt('n15','какие')-0.1, pop()); at(Wt('n15','какие')+1.1, hoot())
out=np.clip(out,-1,1)
with wave.open(T6+'/audio/sfx.wav','wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype(np.int16).tobytes())
print('sfx ok', len(out)/SR)
