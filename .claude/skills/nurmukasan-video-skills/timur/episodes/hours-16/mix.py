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
g = norm(load('audio/music_grind.mp3'))
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
