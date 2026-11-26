# music bed: the grind cue under the first half (fades out into the burnout), silence + heartbeat at the crash,
# the comeback cue from the owl's night to the end with its loudest moment landing on "Общий — восемь!".
import numpy as np, json, re, subprocess, wave
T = json.loads(re.search(r'export const T = (\{.*?\})\n', open('edit/times.jsx').read()).group(1))
SR = 48000; N = int(SR * T['END'])
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def norm(x, rms=0.12): r = np.sqrt(np.mean(x[np.abs(x) > 0.01] ** 2)); return x * (rms / r)
out = np.zeros(N, np.float32)
g = load('audio/music_grind.mp3')
# the cue's drop (quiet intro -> full groove) lands on the hook counter's "960" (T.roll[-1])
hop = SR // 20
rm = np.array([np.sqrt(np.mean(g[i:i + hop] ** 2)) for i in range(0, len(g) - hop, hop)])
intro = np.median(rm[20:200])
drop = next(i for i in range(100, len(rm)) if rm[i] > 2.5 * intro) * hop / SR
land = T['roll'][-1]; off = max(0.0, drop - land)
g = g[int(SR * off):]; dpos = int(SR * (drop - off))
# beat period from the onset envelope of the groove, so the cue can be extended by whole bars without a hiccup
e = np.array([np.sqrt(np.mean(g[i:i + SR // 100] ** 2)) for i in range(dpos, len(g) - SR // 100, SR // 100)])
flux = np.maximum(0, np.diff(e)); flux -= flux.mean()
ac = np.correlate(flux, flux, 'full')[len(flux) - 1:]
lag = np.argmax(ac[33:100]) + 33; bar = 4 * lag * SR // 100  # beat 0.33-1.0 s (60-180 bpm), 4/4 bar
A = dpos + 2 * bar; B = A + ((len(g) - A) // bar) * bar  # A and B sit on the same bar phase
# refine the loop point: what plays before B must match what plays before A (onset envelopes, 5 ms hops)
oenv = lambda b: np.diff([np.sqrt(np.mean(g[i:i + SR // 200] ** 2)) for i in range(b - 2 * SR, b, SR // 200)])
ref = oenv(A)
B = max(range(B - int(0.4 * SR), min(B + int(0.4 * SR), len(g)) + 1, SR // 200), key=lambda b: float(np.dot(ref, oenv(b))))
xf = SR // 20; B0 = B
while len(g) < int(SR * (T['d30'] + 1.0)):
    seg = g[A:B].copy(); tail = g[B:B + xf]
    if len(tail) == xf: seg[:xf] = seg[:xf] * np.linspace(0, 1, xf) + tail * np.linspace(1, 0, xf)
    g = np.concatenate([g[:B], seg]); B = len(g)
g = norm(g)
g[:dpos] *= 1.8  # lift the tension intro under the hook a little
print('grind: drop %.2f -> %.2f (cue offset %.2f), beat %.2f s, loop %.2f -> %.2f, extended to %.1f s' % (drop, land, off, lag / 100, B0 / SR, A / SR, len(g) / SR))
env = np.ones(len(g), np.float32)
fs = min(int(SR * T['wk3']), len(g) - int(SR * 2.5)); fe = min(int(SR * T['d30']), len(g))
env[fs:fe] = np.linspace(1, 0, max(1, fe - fs)); env[fe:] = 0
env[: int(SR * 0.03)] = np.linspace(0, 1, int(SR * 0.03))
gg = (g * env)[:N]; out[: len(gg)] += gg
r = norm(load('audio/music_rise.mp3'), 0.13)
win = SR // 2; rms = np.array([np.sqrt(np.mean(r[i:i + win] ** 2)) for i in range(0, len(r) - win, SR // 10)])
peak_t = (np.argmax(rms[int(15 / 0.1):]) + int(15 / 0.1)) * 0.1 + 0.25
S = T['overall'] - peak_t
start = max(S, T['owl'] - 0.2); off = start - S
seg = r[int(SR * off):]
fade_in = int(SR * 1.2); seg[:fade_in] *= np.linspace(0, 1, fade_in)
i0 = int(SR * start); seg = seg[: N - i0]
fo = int(SR * 1.5); seg[-fo:] *= np.linspace(1, 0, fo)
out[i0:i0 + len(seg)] += seg
out = np.clip(out, -1, 1)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('music: grind 0..%.1f, rise from %.2f (cue offset %.2f, peak %.2f -> %.2f)' % (T['d30'], start, off, peak_t, T['overall']))
