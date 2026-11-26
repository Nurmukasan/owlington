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
REPT = [('девятьсот шестьдесят', '960'), ('лиснинг восемь с половиной', 'Listening 8.5'), ('ридинг восемь с половиной', 'Reading 8.5'), ('райтинг семь', 'Writing 7.0'),
  ('спикинг восемь', 'Speaking 8.0'), ('общий восемь', 'Общий 8.0'), ('день сороковой шесть с половиной', 'День 40: 6.5'), ('пятидесятый семь с половиной', 'День 50: 7.5'),
  ('пробный лиснинг', 'Пробный Listening'), ('четыреста восемьдесят', '480'), ('день тридцатый', 'День 30'), ('день шестидесятый', 'День 60'), ('день ноль', 'День 0'),
  ('номер шесть', '#6'), ('везде пять', 'везде 5.0'), ('подъем в семь', 'подъём в 7:00'), ('отбой в два ночи', 'отбой в 2:00'), ('сто двенадцать', '112'),
  ('мок шесть', 'Mock 6.0'), ('мок пять', 'Mock 5.0'), ('шесть с половиной', '6.5'), ('восемь часов', '8 часов'), ('пятьдесят минут', '50 минут'), ('десять', '10'),
  ('может четыре', 'может, 4'), ('шестнадцать', '16'), ('шестьдесят', '60'), ('айелтс', 'IELTS'),
  ('лиснинг', 'Listening'), ('ридинг', 'Reading'), ('райтинг', 'Writing'), ('спикинг', 'Speaking')]
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
HI = re.compile(r'\d|Speaking|Listening|Writing|Reading|Mock|IELTS|Сова|сова|Поворот|сон|Сон|Отдых|прогулка|наушниках')
print(len(caps))
for c in caps: print(c['at'], c['dur'], ' '.join(w[0] for w in c['words']))
