# Replace the result block ("Результат" ... "Говорить и писать — нет.") in narr_f.wav with the re-recorded take (new scores),
# sped up by the same atempo 1.2 and level-matched; everything after it just moves. Then re-run the narration ASR.
# usage (audio dir): python3 splice_results.py results.mp3  -> narr_f.wav (old kept as narr_f_old.wav)
import sys, json, re, subprocess, wave, os, numpy as np
SR = 48000
def load(f, tempo=None):
    af = ['-af', f'atempo={tempo}'] if tempo else []
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, *af, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
if not os.path.exists('narr_f_old.wav'): os.rename('narr_f.wav', 'narr_f_old.wav')
v = load('narr_f_old.wav'); W = json.load(open('words.json'))['narr_f']
n = lambda s: re.sub(r'[^а-яё]', '', s.lower())
i0 = next(i for i, w in enumerate(W) if n(w['w']).startswith('результат'))
prev = lambda i: next(n(W[j]['w']) for j in range(i - 1, -1, -1) if n(W[j]['w']))  # skip dash tokens
i1 = next(i for i in range(i0, len(W)) if n(W[i]['w']) == 'нет' and prev(i) == 'писать')
a = W[i0]['s'] - 0.03; b = W[i1]['e'] + 0.12
x = load(sys.argv[1], 1.2)
k = int(SR * 0.01); e = np.convolve(np.abs(x), np.ones(k) / k, 'same'); nz = np.where(e > 0.02)[0]
x = x[max(0, nz[0] - k): nz[-1] + 8 * k]
vr = lambda s: np.sqrt(np.mean(s[np.abs(s) > 0.02] ** 2))
x = x * (vr(v[int(SR * a):int(SR * b)]) / vr(x))
f = int(SR * 0.01); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
out = np.concatenate([v[:int(SR * a)], x, v[int(SR * b):]])
with wave.open('narr_f.wav', 'wb') as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
print('replaced %.2f-%.2f (%.2f s) with %.2f s' % (a, b, b - a, len(x) / SR))
