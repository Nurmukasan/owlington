# captions.py — karaoke captions: script tokens aligned to whisper words (difflib), number words -> digits,
# skill names -> English, max 5 words per chunk, captions never run into a character clip, character lines get their own colour/tab.
import json, re, difflib
TL = json.load(open('audio/timeline.json'))
W = TL['narr']
script = open('script.txt').read()
spoken = re.sub(r'\[[^\]]*\]', '', script).replace('́', '')      # drop audio tags and stress marks
spoken = spoken.replace('айéлтс', 'IELTS').replace('айе́лтс', 'IELTS')
# 1) BEFORE alignment: write numbers the way whisper writes them (so they match)
PRE = [('сто шестьдесят восемь', '168'), ('по сто слов', 'по 100 слов'), ('четыре части', '4 части'), ('сорок вопросов', '40 вопросов'), ('три текста', '3 текста'),
 ('две задачи', '2 задачи'), ('три части', '3 части'), ('два абзаца', '2 абзаца'), ('двадцать минут', '20 минут'), ('Пятьдесят минут', '50 минут'), ('десять — отдыха', '10 — отдыха'),
 ('в одиннадцать', 'в 11'), ('подъём в семь', 'подъём в 7'), ('в девять', 'в 9'), ('сон в десять', 'сон в 10'), ('День четвёртый', 'День 4'), ('День пятый', 'День 5'),
 ('День шестой — семь', 'День 6 — 7'), ('День седьмой', 'День 7'), ('Мок — шесть', 'Мок — 6'), ('Семь дней', '7 дней'), ('номер один', '№1'), ('номер два', '№2'),
 ('пять с половиной', '5.5'), ('шесть с половиной', '6.5'), ('семь с половиной', '7.5'), ('Лиснинг — восемь', 'Лиснинг — 8'), ('Ридинг — восемь', 'Ридинг — 8'), ('Спикинг — семь', 'Спикинг — 7')]
for a, b in PRE: spoken = spoken.replace(a, b)
_M = {'лиснинг': 'listening', 'спикинг': 'speaking', 'ридинг': 'reading', 'райтинг': 'writing', 'мок': 'мог', 'ielts': 'айлдс', 'бидва': 'b2', 'сиодин': 'c1'}
def norm(s):
    k = re.sub(r'[^0-9a-zа-яё]', '', s.lower()).replace('ё', 'е')
    return _M.get(k, k)
toks = [t for t in spoken.split() if norm(t)]   # NB: lone dashes are dropped here
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
        else:
            f = (i - lo) / (hi - lo); start[i] = end[lo] + (start[hi] - end[lo]) * f; end[i] = start[i] + 0.25
print('unmatched', len(toks) - len(known), [toks[i] for i in range(len(toks)) if i not in known][:40])
chunks, cur = [], []
for i, t in enumerate(toks):
    cur.append(i)
    gap_next = (start[i + 1] - end[i]) if i + 1 < len(toks) else 9
    if re.search(r'[.?!…»]$', t) or (re.search(r'[,:]$', t) and len(cur) >= 3) or len(cur) >= 5 or gap_next > 1.2:
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
# 2) AFTER alignment: display formatting (order matters: longer forms first)
REP = [('би-два,', 'B2,'), ('си-один.', 'C1.'), ('День первый.', 'День 1.'), ('День второй.', 'День 2.'),
 ('райтинга', 'Writing'), ('лиснинге', 'Listening'), ('ридинге.', 'Reading.'), ('Лиснинг', 'Listening'), ('Ридинг', 'Reading'), ('Райтинг', 'Writing'), ('Спикинг', 'Speaking'), ('райтинг', 'Writing'),
 ('в 7.', 'в 7:00.'), ('в 9', 'в 9:00'), ('в 11.', 'в 23:00.'), ('в 10.', 'в 22:00.'), ('Мок 6.', 'Мок 6.0.'), ('День 6 7!', 'День 6 7.0!'), ('Listening 8.', 'Listening 8.0.'), ('Reading 8.', 'Reading 8.0.'), ('Speaking 7.', 'Speaking 7.0.')]
HI = re.compile(r'\d|Speaking|Listening|Writing|Reading|IELTS|Сова|сова|B2|C1|экзамен|структуру|сон|шаблон')
out = []
for c in chunks:
    text = ' '.join(toks[i] for i in c)
    for a, b in REP: text = text.replace(a, b)
    text = text.replace(' — ', ' ').replace('— ', '').replace(' —', '')
    text = re.sub(r'(Listening|Reading|Writing|Speaking|Мок|День \d) (?=\d)', r'\1: ', text)
    out.append({'t0': start[c[0]], 't1': end[c[-1]], 'words': text.split()})
caps = []
for k, c in enumerate(out):
    at = max(0, c['t0'] - 0.08)
    nxt = out[k + 1]['t0'] - 0.08 if k + 1 < len(out) else c['t1'] + 1.0
    end_ = nxt if nxt - c['t1'] < 0.8 else c['t1'] + 0.5
    n = len(c['words'])
    words = [[w, round(c['t0'] + (c['t1'] - c['t0']) * j / n - at, 2), bool(HI.search(w))] for j, w in enumerate(c['words'])]
    caps.append({'at': round(at, 2), 'dur': round(end_ - at, 2), 'words': words, 'who': 'n'})
starts = sorted(v[0] for v in TL['clips'].values())
for cp in caps:   # a narration caption never runs into a character line
    for st_ in starts:
        if cp['at'] < st_ < cp['at'] + cp['dur']: cp['dur'] = round(st_ - cp['at'] - 0.05, 2)
# character lines (from their own transcripts), one chunk per sentence; who: f friend, k Katya, m mum, e examiner
LINES = {'friend': ('f', ['Ка-ать!', 'Мы вчера мок писали,', 'у меня 7.0!', 'А ты как, готова?']),
         'katya1': ('k', ['Ладно.', '168 часов.', 'Поехали.']),
         'mom': ('m', ['Катюш...', 'ты за четыре дня сделала больше,', 'чем многие за месяц.', 'Иди спать, солнышко.']),
         'exam': ('e', ['Good morning.', 'Could you tell me your full name, please?', 'Good morning!', 'My name is Katya.'])}
for k, (who, lines) in LINES.items():
    dw = TL['dwords'][k]; a, b = TL['clips'][k]
    nw = [len(l.split()) for l in lines]; tot = sum(nw); idx = 0
    for j, l in enumerate(lines):
        i0 = round(idx * len(dw) / tot); i1 = round((idx + nw[j]) * len(dw) / tot) - 1; idx += nw[j]
        t0 = dw[min(i0, len(dw) - 1)]['s'] - 0.06; t1 = dw[min(max(i1, i0), len(dw) - 1)]['e']
        nx = (dw[min(round(idx * len(dw) / tot), len(dw) - 1)]['s'] - 0.06) if j + 1 < len(lines) else b + 0.1
        n = len(l.split())
        words = [[w, round((t1 - t0) * q / n, 2), False] for q, w in enumerate(l.split())]
        caps.append({'at': round(t0, 2), 'dur': round(max(0.4, nx - t0), 2), 'words': words, 'who': who})
caps.sort(key=lambda c: c['at'])
open('edit/captions.jsx', 'w').write('export const CAPTIONS = ' + json.dumps(caps, ensure_ascii=False) + '\n')
print(len(caps))
for c in caps: print(c['at'], c['dur'], c['who'], ' '.join(w[0] for w in c['words']))
