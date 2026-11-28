# music bed (grammar-60): the grind cue from the hook through the confident first month, fading out into the speaking mock;
# no music through the freeze and the twist; the rise cue comes in softly at "Грамматика нужна" and carries the advice to the end.
import numpy as np, json, re, subprocess, wave
T = json.loads(re.search(r'export const T = (\{.*?\})\n', open('edit/times.jsx').read()).group(1))
SR = 48000; N = int(SR * T['END'])
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def norm(x, rms=0.12): r = np.sqrt(np.mean(x[np.abs(x) > 0.01] ** 2)); return x * (rms / r)
out = np.zeros(N, np.float32)
g = load('audio/music_grind.mp3')
# the cue's drop (quiet intro -> full groove) lands on the hook counter's "2400"
hop = SR // 20
rm = np.array([np.sqrt(np.mean(g[i:i + hop] ** 2)) for i in range(0, len(g) - hop, hop)])
intro = np.median(rm[20:200])
drop = next(i for i in range(100, len(rm)) if rm[i] > 2.5 * intro) * hop / SR
land = T['roll'][-1]; off = max(0.0, drop - land)
g = norm(g[int(SR * off):]); dpos = int(SR * (drop - off))
g[:dpos] *= 1.8
need = int(SR * T['speak'])
if len(g) < need:  # loop the groove with a 1.5 s crossfade from the tail into the part right after the drop
    xf = int(1.5 * SR); tt = np.linspace(0, np.pi / 2, xf); A = dpos + 2 * SR
    while len(g) < need:
        L = len(g); seg = g[A:A + (L - A)]
        g = np.concatenate([g[:L - xf], g[L - xf:] * np.cos(tt) + seg[:xf] * np.sin(tt), seg[xf:]])
env = np.ones(len(g), np.float32)
fs = int(SR * T['mockS']); fe = min(len(g), int(SR * (T['speak'] + 0.8)))
env[fs:fe] = np.linspace(1, 0, max(1, fe - fs)); env[fe:] = 0
gg = (g * env)[:N]; out[:len(gg)] += gg
r = norm(load('audio/music_rise.mp3'), 0.09)
i0 = int(SR * (T['tool'] - 0.2)); seg = r[: N - i0].copy()
fi = int(SR * 1.5); seg[:fi] *= np.linspace(0, 1, fi)
fo = int(SR * 2.0); seg[-fo:] *= np.linspace(1, 0, fo)
out[i0:i0 + len(seg)] += seg
out = np.clip(out, -1, 1)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('music: grind drop %.2f -> %.2f, fade %.1f-%.1f, rise from %.2f' % (drop, land, T['mockS'], T['speak'] + 0.8, T['tool'] - 0.2))
