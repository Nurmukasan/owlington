import json, re, difflib
TL = json.load(open('audio/timeline.json'))
W = TL['narr']
script = open('script.txt').read()
spoken = re.sub(r'\[[^\]]*\]', '', script).replace('́', '')
_M = {'лиснинг': 'listening', 'спикинг': 'speaking', 'ридинг': 'reading', 'райтинг': 'writing', 'мок': 'mock', 'листнинг': 'listening'}
norm = lambda s: _M.get(re.sub(r'[^0-9a-zа-яё]', '', s.lower()).replace('ё', 'е'), re.sub(r'[^0-9a-zа-яё]', '', s.lower()).replace('ё', 'е'))
toks = [t for t in spoken.split() if norm(t)]
wn = [norm(x['w']) for x in W]; tn = [norm(t) for t in toks]
sm = difflib.SequenceMatcher(None, tn, wn, autojunk=False)
start = [None] * len(toks); end = [None] * len(toks)
for a, b, size in sm.get_matching_blocks():
    for k in range(size): start[a + k] = W[b + k]['s']; end[a + k] = W[b + k]['e']
known = [i for i in range(len(toks)) if start[i] is not None]
for i in range(len(toks)):
    if start[i] is None:
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        if lo is None: start[i] = 0.15; end[i] = start[hi]
        elif hi is None: start[i] = end[lo]; end[i] = end[lo] + 0.4
        elif start[hi] - end[lo] > 2.0:
            start[i] = start[hi] - 0.5 * (hi - i); end[i] = start[i] + 0.4
        else:
            f = (i - lo) / (hi - lo); start[i] = end[lo] + (start[hi] - end[lo]) * f; end[i] = start[i] + 0.25
print('unmatched', len(toks) - len(known))
chunks, cur = [], []
for i, t in enumerate(toks):
    cur.append(i)
    gap_next = (start[i + 1] - end[i]) if i + 1 < len(toks) else 9
    L = len(' '.join(toks[k] for k in cur)); nx = toks[i + 1] if i + 1 < len(toks) else ''
    ends_next = bool(re.search(r'[.?!…»]$', nx)) and L + 1 + len(nx) <= 34
    if re.search(r'[.?!…»]$', t) or (re.search(r'[,:]$', t) and len(cur) >= 3 and L >= 14) or (L >= 22 and not ends_next) or L >= 32 or gap_next > 1.5:
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
REP = [('шестьдесят дней', '60 дней'), ('По пятьдесят', 'По 50'), ('Три тысячи слов', '3000 слов'), ('номер пять', '#5'), ('День ноль', 'День 0'), ('день ноль', 'день 0'),
  ('Спикинг пять.', 'Speaking 5.0.'), ('каждый день пятьдесят', 'каждый день 50'), ('День первый', 'День 1'), ('Два часа и все пятьдесят', '2 часа и все 50'),
  ('Неделя вторая', 'Неделя 2'), ('День тридцатый', 'День 30'), ('Полторы тысячи', '1500'), ('День сорок пятый', 'День 45'), ('День шестидесятый', 'День 60'),
  ('ридинг шесть с половиной,', 'Reading 6.5,'), ('Лиснинг пять с половиной:', 'Listening 5.5:'), ('Райтинг пять.', 'Writing 5.0.'),
  ('Общий пять с половиной.', 'Общий 5.5.'), ('Пять слов,', '5 слов,'), ('пятидесяти', '50')]
HI = re.compile(r'\d|Speaking|Listening|Writing|Reading|Сова|сове|Поворот|кирпичи|дом|вслух|карточки')
out = []
for c in chunks:
    text = ' '.join(toks[i] for i in c)
    for a, b in REP: text = text.replace(a, b)
    text = text.replace(' — ', ' ').replace('— ', '').replace(' —', '')
    out.append({'t0': start[c[0]], 't1': end[c[-1]], 'words': text.split()})
caps = []
for k, c in enumerate(out):
    at = max(0, c['t0'] - 0.08)
    nxt = out[k + 1]['t0'] - 0.08 if k + 1 < len(out) else c['t1'] + 1.0
    end_ = nxt if nxt - c['t1'] < 0.8 else c['t1'] + 0.5
    n = len(c['words'])
    words = [[w, round(c['t0'] + (c['t1'] - c['t0']) * j / n - at, 2), bool(HI.search(w))] for j, w in enumerate(c['words'])]
    caps.append({'at': round(at, 2), 'dur': round(end_ - at, 2), 'words': words})
starts = sorted(v[0] for v in TL['clips'].values())
for cp in caps:
    for st_ in starts:
        if cp['at'] < st_ < cp['at'] + cp['dur']: cp['dur'] = round(st_ - cp['at'] - 0.05, 2)
open('edit/captions.jsx', 'w').write('export const CAPTIONS = ' + json.dumps(caps, ensure_ascii=False) + '\n')
print(len(caps))
for c in caps: print(c['at'], c['dur'], ' '.join(w[0] for w in c['words']))
