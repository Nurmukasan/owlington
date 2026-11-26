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
# merge number phrases into one display token BEFORE chunking (so "ридинг шесть с половиной" never splits)
REPT = [('девятьсот шестьдесят', '960'), ('четыре часа лиснинга', '4 часа Listening'), ('четыре ридинга', '4 Reading'), ('четыре райтинга', '4 Writing'), ('четыре спикинга', '4 Speaking'),
  ('лиснинг восемь', 'Listening 8.0'), ('ридинг семь с половиной', 'Reading 7.5'), ('райтинг шесть с половиной', 'Writing 6.5'), ('спикинг семь с половиной', 'Speaking 7.5'),
  ('общий семь с половиной', 'Общий 7.5'), ('день сороковой шесть с половиной', 'День 40: 6.5'), ('пятидесятый семь', 'День 50: 7.0'), ('снова шесть с половиной', 'снова 6.5'),
  ('четвертая шесть', 'Четвёртая 6.0'), ('мок пять с половиной', 'Mock 5.5'), ('мок шесть', 'Mock 6.0'), ('четыре блока по девяносто минут', '4 блока по 90 минут'),
  ('день тридцать первый', 'День 31'), ('тридцать первый', '31-й'), ('пробный лиснинг', 'Пробный Listening'), ('день шестидесятый', 'День 60'), ('день ноль', 'День 0'),
  ('номер шесть', '#6'), ('восемь часов', '8 часов'), ('сто двенадцать', '112'), ('шесть с половиной', '6.5'), ('пять с половиной', '5.5'), ('один выходной', '1 выходной'),
  ('от силы пять', 'от силы 5'), ('в шесть', 'в 6:00'), ('шесть часов', '6 часов'), ('шестьдесят', '60'), ('шестнадцать', '16'), ('шестнадцати', '16')]
bare = lambda t: re.sub(r'[^0-9a-zа-яё]', '', t.lower().replace('ё', 'е'))
nt, ns, ne, i = [], [], [], 0
while i < len(toks):
    for pat, rep in REPT:
        p = pat.split()
        if [bare(x) for x in toks[i:i + len(p)]] == [bare(x) for x in p]:
            last = toks[i + len(p) - 1]; punct = re.search(r'[^0-9A-Za-zА-Яа-яЁё]*$', last).group(0)
            r = rep[0].upper() + rep[1:] if toks[i][0].isupper() and rep[0].isalpha() else rep
            nt.append(r + punct); ns.append(start[i]); ne.append(end[i + len(p) - 1]); i += len(p); break
    else:
        nt.append(toks[i]); ns.append(start[i]); ne.append(end[i]); i += 1
toks, start, end = nt, ns, ne
chunks, cur = [], []
for i, t in enumerate(toks):
    cur.append(i)
    gap_next = (start[i + 1] - end[i]) if i + 1 < len(toks) else 9
    L = len(' '.join(toks[k] for k in cur)); nx = toks[i + 1] if i + 1 < len(toks) else ''
    ends_next = bool(re.search(r'[.?!…»]$', nx)) and L + 1 + len(nx) <= 34
    if re.search(r'[.?!…»]$', t) or (re.search(r'[,:]$', t) and len(cur) >= 3 and L >= 14) or (L >= 22 and not ends_next) or L >= 32 or gap_next > 1.5:
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
REP = []
HI = re.compile(r'\\d|Speaking|Listening|Writing|Reading|Mock|Сова|сова|Поворот|сон|Отдых|фокус|прогулка|перерыв')
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
