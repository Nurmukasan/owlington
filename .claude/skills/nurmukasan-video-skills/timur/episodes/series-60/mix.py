# music bed (series-60): the playful chiptune under the binge (stage 1) fading out into the day-20 mock; back in for stages 2-3,
# out again when Timur freezes on Jake's question; the rise cue from the exam result to the end, its peak on "Общий — шесть!".
import numpy as np, json, re, subprocess, wave
T = json.loads(re.search(r'export const T = (\{.*?\})\n', open('edit/times.jsx').read()).group(1))
SR = 48000; N = int(SR * T['END'])
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def norm(x, rms=0.12): r = np.sqrt(np.mean(x[np.abs(x) > 0.01] ** 2)); return x * (rms / r)
out = np.zeros(N, np.float32)
fun = norm(load('audio/music_fun.mp3'), 0.11)
def place(src, t0, t1, off=0.0, fi=0.3, fo=1.5):
    a = int(SR * t0); n = min(int(SR * (t1 - t0)), len(src) - int(SR * off), N - a)
    seg = src[int(SR * off):int(SR * off) + n].copy()
    k = int(SR * fi); seg[:k] *= np.linspace(0, 1, k)
    k = min(int(SR * fo), n); seg[-k:] *= np.linspace(1, 0, k)
    out[a:a + n] += seg
place(fun, 0.0, T['l5'] + 0.6, fi=0.02, fo=1.6)
place(fun, T['ph2'] - 0.2, T['jake'] + (T['jake_end'] - T['jake']) * 0.55, off=12.0, fi=1.0, fo=1.4)
r = norm(load('audio/music_rise.mp3'), 0.12)
win = SR // 2; rms = np.array([np.sqrt(np.mean(r[i:i + win] ** 2)) for i in range(0, len(r) - win, SR // 10)])
peak_t = (np.argmax(rms[int(15 / 0.1):]) + int(15 / 0.1)) * 0.1 + 0.25
S = T['overall'] - peak_t; start = max(S, T['result'] - 0.3); off = start - S
seg = r[int(SR * off):]; i0 = int(SR * start); seg = seg[: N - i0].copy()
k = int(SR * 1.0); seg[:k] *= np.linspace(0, 1, k); k = int(SR * 1.8); seg[-k:] *= np.linspace(1, 0, k)
out[i0:i0 + len(seg)] += seg
out = np.clip(out, -1, 1)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print('music ok: rise from %.2f (offset %.2f, peak %.2f -> %.2f)' % (start, off, peak_t, T['overall']))
