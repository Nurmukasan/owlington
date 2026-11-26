# Splice a re-recorded first line over the start of voice.wav without moving anything after it
# (used when one word of the narration came out wrong, e.g. «айе́лтс» read as «аэлтс»).
# usage (episode dir): python3 audio/fix_line.py audio/line1.mp3  -> voice_fixed.wav
import sys, json, subprocess, wave
import numpy as np

src = sys.argv[1]
w = wave.open('voice.wav'); SR = w.getframerate()
v = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
W = json.load(open('audio/timeline.json'))['narr']
t0 = 0.02                                          # the voice starts on frame 0
nxt = next(x['s'] for x in W if x['s'] > 3.0)      # the next sentence («Шестьдесят дней подряд») stays where it is
room = nxt - 0.16 - t0

def dec(tempo):  # same treatment as the narration: atempo, mono, voice rate, silence trimmed
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-af', f'atempo={tempo:.4f}', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    k = int(SR * 0.01); e = np.convolve(np.abs(x), np.ones(k) / k, 'same'); nz = np.where(e > 0.02)[0]
    return x[max(0, nz[0] - k): nz[-1] + 5 * k]

x = dec(1.2)
if len(x) / SR > room: x = dec(1.2 * len(x) / SR / room)   # squeeze just enough to fit before the next sentence
vr = lambda a: np.sqrt(np.mean(a[np.abs(a) > 0.02] ** 2))
x = x * (vr(v[int(SR * t0):int(SR * (nxt - 0.1))]) / vr(x))  # same loudness as the line it replaces
f = int(SR * 0.008); x[-f:] *= np.linspace(1, 0, f)
out = v.copy(); end = int(SR * (nxt - 0.06))
out[:end] = 0; out[int(SR * t0):int(SR * t0) + len(x)] = x[:end - int(SR * t0)]
with wave.open('voice_fixed.wav', 'wb') as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
print('line %.2f-%.2f s (room until %.2f), next sentence at %.2f' % (t0, t0 + len(x) / SR, t0 + room, nxt))
