# Narration kept whole with its natural pauses; it is cut only inside real silences where a character line goes in
# so no word is clipped and no pause is shortened.
import json, re, subprocess, numpy as np
SR = 48000
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    a = max(0, idx[0] - int(0.04 * SR)); b = min(len(x), idx[-1] + int(0.08 * SR))
    return x[a:b], a / SR
W = json.load(open('words.json'))
narr = load('narr_f.wav'); nw = W['narr_f']
norm = lambda s: re.sub(r'[^0-9a-zа-яё]', '', s.lower()).replace('ё', 'е')
tk = [norm(w['w']) for w in nw]
def find(seq, after=0):
    for i in range(after, len(tk) - len(seq) + 1):
        if all(tk[i + k].startswith(seq[k]) for k in range(len(seq))): return i + len(seq) - 1
    raise SystemExit(f'not found {seq}')
def sent_end(i):
    while not re.search(r'[.?!]$', nw[i]['w']): i += 1
    return i
FR = int(0.01 * SR)
def rms(t):
    a = int(t * SR); s = narr[a:a + FR]
    return float(np.sqrt(np.mean(s ** 2))) if len(s) else 0.0
def gap_mid(i):
    """middle of the quietest stretch between word i and word i+1"""
    e = nw[i]['e']; n = nw[i + 1]['s'] if i + 1 < len(nw) else len(narr) / SR
    lo, hi = e - 0.05, max(n + 0.15, e + 0.1)
    ts = np.arange(lo, hi, 0.01); vals = np.array([rms(t) for t in ts])
    quiet = vals < 0.01
    best, run, start = None, 0, None
    for k, q in enumerate(quiet):
        if q:
            if run == 0: start = k
            run += 1
            if best is None or run > best[1]: best = (start, run)
        else: run = 0
    if best: return float(ts[best[0]] + best[1] * 0.005)
    return float(ts[int(np.argmin(vals))])
# insertion points: the sitcom line after "Он понимает каждую шутку.", Jake's call after "Звонок от Джейка.", the exam after "Экзамен."
cuts = []; pos = 0
for seq, name, se in [(['понимает', 'каждую'], 'show', True), (['звонок'], 'jake', True), (['экзамен'], 'exam', True)]:
    i = find(seq, pos)
    if se: i = sent_end(i)
    if name: cuts.append(('ins', gap_mid(i), name))
    pos = i + 1
cuts.sort(key=lambda c: c[1])
out, t, mapped, clips, dwords = [], 0.0, [], {}, {}
def put(x):
    global t
    out.append(x.astype(np.float32)); t += len(x) / SR
rn = np.sqrt(np.mean(narr[np.abs(narr) > 0.02] ** 2))
def level(x): rx = np.sqrt(np.mean(x[np.abs(x) > 0.02] ** 2)); return x * min(2.0, rn / rx)
def keep(a, b):
    o = t
    put(narr[int(a * SR):int(b * SR)])
    for w in nw:
        if a <= (w['s'] + w['e']) / 2 < b: mapped.append({'w': w['w'], 's': round(o + max(0.0, w['s'] - a), 3), 'e': round(o + w['e'] - a, 3)})
cur = max(0.0, nw[0]['s'] - 0.04)
put(np.zeros(int(0.02 * SR)))
for c in cuts:
    if c[0] == 'ins':
        _, m, name = c
        keep(cur, m); cur = m
        x, off = trim(load(name + '.mp3'))
        put(np.zeros(int(0.12 * SR))); c0 = t; put(level(x)); clips[name] = [round(c0, 3), round(t, 3)]
        dwords[name] = [{'w': d['w'], 's': round(c0 + d['s'] - off, 3), 'e': round(c0 + d['e'] - off, 3)} for d in W[name]]
        put(np.zeros(int(0.18 * SR)))
    else:
        _, m0, m1, f = c
        keep(cur, m0)
        x, off = trim(load(f)); c0 = t; put(level(x))
        if f == 'res_f.wav': mapped.extend({'w': d['w'], 's': round(c0 + d['s'] - off, 3), 'e': round(c0 + d['e'] - off, 3)} for d in W['res'])
        else: mapped.append({'w': nw[ti]['w'], 's': round(c0, 3), 'e': round(t, 3)})
        put(np.zeros(int(0.1 * SR)))
        cur = m1
keep(cur, len(narr) / SR)
put(np.zeros(int(0.6 * SR)))
y = np.concatenate(out); y = y / np.max(np.abs(y)) * 0.89
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', 'voice.wav'], input=y.tobytes())
mapped.sort(key=lambda w: w['s'])
json.dump({'narr': mapped, 'clips': clips, 'dwords': dwords, 'dur': round(len(y) / SR, 3)}, open('timeline.json', 'w'), ensure_ascii=False)
print('total', round(len(y) / SR, 2), clips)
