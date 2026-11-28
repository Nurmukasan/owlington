# anchors for the series episode: key -> start time of a phrase in the assembled voice track (edit/times.jsx)
import json, re
TL = json.load(open('audio/timeline.json'))
W = [w for w in TL['narr'] if re.sub(r'[^0-9a-zа-яё]', '', w['w'].lower().replace('ё', 'е'))]
# whisper sometimes returns a zero-length word (e.g. "writing" at 14.88-14.88): start it right after the previous word
for k in range(1, len(W)):
    if W[k]['e'] - W[k]['s'] < 0.05: W[k] = dict(W[k], s=max(W[k - 1]['e'] + 0.05, W[k]['s'] - 0.35))
_M = {'лиснинг': 'listening', 'листнинг': 'listening', 'спикинг': 'speaking', 'spiking': 'speaking', 'ридинг': 'reading', 'райтинг': 'writing'}
def norm(s):
    k = re.sub(r'[^0-9a-zа-яё]', '', s.lower()).replace('ё', 'е')
    return _M.get(k, k)
tk = [norm(w['w']) for w in W]
def hit(t, alt): return any(t.startswith(a) for a in (alt if isinstance(alt, tuple) else (alt,)))
def find(seq, after=0):
    for i in range(after, len(tk) - len(seq) + 1):
        if all(hit(tk[i + k], seq[k]) for k in range(len(seq))): return i
    raise SystemExit(f'not found {seq} after {after}: ' + ' '.join(tk[after:after + 30]))
def sstart(i):
    while i > 0 and not re.search(r'[.?!:»]$', W[i - 1]['w']): i -= 1
    return i
L_ = ('лиснинг', 'листнинг', 'listening')
S_ = ('спикинг', 'speaking', 'spiking')
A = [('checked', ['тимур', 'проверил'], 's'), ('h180', [('180', 'сто')], 'x'), ('spoiler', ['спойлер'], 's'), ('first60', ['первые'], 'x'),
 ('u8', ['вселенн'], 's'), ('nobooks', ['ни', 'учебник'], 's'), ('only', ['только', 'сериал'], 's'), ('three', ['по', ('три', '3'), 'серии'], 'x'),
 ('day0', ['день', ('0', 'ноль')], 's'), ('mock0', ['пробн'], 's'), ('all5', ['по', 'всем'], 'x'),
 ('ph1', ['этап', 'первый'], 's'), ('rusub', ['русские'], 'x'), ('excited', ['тимур', 'в', 'восторге'], 's'), ('joke', ['он', 'понимает'], 's'),
 ('reads', ['правда'], 's'), ('rus', ['по'], 'x'),
 ('d20', ['день', ('20', 'двадцат')], 's'), ('ep60', [('60', 'шестьдесят'), 'серий'], 's'), ('mockL1', ['пробный', L_], 's'), ('l5', [('5', 'пять')], 'x'), ('likeday0', ['как', 'в', 'день'], 's'),
 ('twist', ['поворот'], 's'), ('notlisten', ['мозг'], 'x'), ('reads2', ['а', 'читает'], 'x'), ('eyes', ['глаза'], 's'), ('noise', ['фоновый'], 'x'),
 ('ph2', ['этап', 'второй'], 's'), ('ensub', ['английские'], 'x'), ('ep1', ['первая', 'серия'], 's'), ('h15', ['полтора'], 'x'), ('pause', ['пауза'], 's'), ('rewind', ['перемотка'], 's'), ('dict', ['словарь'], 's'),
 ('phrases', ['зато'], 's'), ('gonna', [('im', 'i')], 'x'), ('noway', ['no', 'way'], 'x'), ('ykw', ['you', 'know', 'what'], 'x'),
 ('d40', ['день', ('40', 'сороков')], 's'), ('mockL2', ['пробный', L_], 's'), ('l6', [('6', 'шесть')], 'x'), ('r6', [('ридинг', 'reading')], 'x'), ('fastread', ['субтитры', 'научили'], 's'),
 ('ph3', ['этап', 'третий'], 's'), ('nosub', ['без', 'субтитров'], 'x'), ('half', ['первые', 'дни'], 's'), ('d50', ['а', 'к'], 's'), ('laughtrack', ['закадровый'], 'x'),
 ('d55', ['день', ('55', 'пятьдесят')], 's'), ('callw', ['звонок'], 's'),
 ('understood', ['тимур', 'понимал'], 's'), ('notsaid', ['но', 'за'], 's'),
 ('d60', ['день', ('60', 'шестидесят')], 's'), ('examw', ['экзамен'], 's'),
 ('result', ['результат'], 's'), ('rL', [L_], 'x'), ('ears', ['уши'], 's'), ('rR', [('ридинг', 'reading')], 'x'), ('rS', [S_], 'x'), ('ready', ['готовые'], 'x'), ('rW', [('райтинг', 'writing')], 'x'), ('noessay', ['сериалы', 'эссе'], 's'), ('overall', ['общий'], 's'),
 ('q', ['так', 'можно'], 's'), ('understand', ['понимать'], 's'), ('speakno', ['говорить'], 's'), ('trainer', ['сериал', 'это'], 's'),
 ('tip1', ['смотри'], 's'), ('tip2', ['повторяй'], 's'), ('tip3', ['выписывай'], 's'), ('useit', ['и', 'используй'], 'x'),
 ('cta', ['а', 'ты', 'смотришь'], 's'), ('comments', ['пиши'], 's'), ('check', ['сова', 'провер'], 's')]
T = {}; pos = 0
for key, seq, mode in A:
    i = find(seq, pos)
    j = sstart(i) if mode == 's' else i
    T[key] = round(W[j]['s'], 2); pos = i + 1
for k, (a, b) in TL['clips'].items(): T[k] = round(a, 2); T[k + '_end'] = round(b, 2)
T['END'] = TL['dur']
# hook counter roll: 16 values (3 episodes x day) that speed up and land exactly on the spoken "180" (used by sc.jsx and sfx.py)
_N, _t0, _L = 16, T['checked'] + 0.25, T['h180']
T['roll'] = [round(T['checked'] + 0.05, 3)] + [round(_t0 + (_L - _t0) * (1 - (1 - i / (_N - 1)) ** 1.6), 3) for i in range(1, _N)]
D = {k: [[w['w'], w['s'], w['e']] for w in v] for k, v in TL['dwords'].items()}
open('edit/times.jsx', 'w').write('export const T = ' + json.dumps(T) + '\nexport const D = ' + json.dumps(D, ensure_ascii=False) + '\n')
print(json.dumps(T))
