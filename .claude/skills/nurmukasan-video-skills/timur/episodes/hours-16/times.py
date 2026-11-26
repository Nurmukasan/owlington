# anchors for the vocab episode: key -> start time of a phrase in the assembled voice track (edit/times.jsx)
import json, re
TL = json.load(open('audio/timeline.json'))
W = [w for w in TL['narr'] if re.sub(r'[^0-9a-zа-яё]', '', w['w'].lower().replace('ё', 'е'))]
# whisper sometimes returns a zero-length word (e.g. "writing" at 14.88-14.88): start it right after the previous word
for k in range(1, len(W)):
    if W[k]['e'] - W[k]['s'] < 0.05: W[k] = dict(W[k], s=max(W[k - 1]['e'] + 0.05, W[k]['s'] - 0.35))
_M = {'лиснинг': 'listening', 'листнинг': 'listening', 'спикинг': 'speaking', 'ридинг': 'reading', 'райтинг': 'writing'}
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
A = [('days60', [('шестьдесят', '60'), 'дней'], 's'), ('h960', [('девятьсот', '960')], 'x'), ('u6', ['вселенн'], 's'), ('notone', ['только', 'здесь'], 's'), ('allatonce', ['он', 'качает'], 's'),
 ('day0', ['день', ('ноль', '0')], 's'), ('mock0', ['пробн'], 's'), ('L0', [L_], 'x'), ('R0', [('ридинг', 'reading')], 'x'), ('W0', [('райтинг', 'writing')], 'x'), ('S0', [('спикинг', 'speaking')], 'x'), ('all5', ['везде'], 'x'),
 ('rule', ['правил'], 's'), ('wake7', ['подъем'], 'x'), ('bed2', ['отбой'], 'x'), ('h16', [('шестнадцать', '16'), 'час'], 's'), ('rest', ['остальное'], 's'),
 ('wk1', ['первая', 'неделя'], 's'), ('h112', [('сто', '112')], 's'), ('m6', [('мок', 'мог')], 's'), ('wk2', ['вторая', 'неделя'], 's'), ('cans', ['банок'], 's'),
 ('noans', ['тимур', 'не', 'ответил'], 's'), ('phonesw', ['он', 'был'], 's'), ('wk3', ['третья', 'неделя'], 's'), ('page', ['одну'], 's'), ('noword', ['и', 'не', 'помнит'], 'x'),
 ('d30', ['день', ('тридцат', '30')], 's'), ('mockL', ['пробный', L_], 's'), ('closed', ['тимур', 'закрыл'], 's'), ('m5', [('мок', 'мог')], 's'), ('likeday0', ['как', 'в', 'день'], 's'),
 ('twist', ['поворот'], 's'), ('h480', [('четыреста', '480')], 'x'), ('zero', ['и', 'ноль'], 'x'),
 ('brain', ['мозг'], 's'), ('attn', ['после'], 's'), ('nosleep', ['а', 'без', 'сна'], 'x'), ('sat', ['тимур', 'сидел'], 's'), ('real4', ['а', 'реально'], 'x'),
 ('owl', ['той', 'ночью'], 's'), ('rule2', ['новое', 'правил'], 's'), ('h8', [('восемь', '8'), 'час'], 'x'), ('blocks', [('пятьдесят', '50'), 'минут'], 's'), ('sleep8', ['сон'], 's'), ('walk', ['и', 'каждый'], 's'),
 ('d40', ['день', ('сороков', '40')], 's'), ('d50', [('пятидесят', '50')], 'x'), ('half', ['часов', 'в', 'два'], 's'), ('d60', ['день', ('шестидесят', '60')], 's'), ('examw', ['экзамен'], 's'),
 ('result', ['результат'], 's'), ('rL', [L_], 'x'), ('rR', [('ридинг', 'reading')], 'x'), ('rW', [('райтинг', 'writing')], 'x'), ('rS', [('спикинг', 'speaking')], 'x'), ('overall', ['общий'], 's'),
 ('moral', [('шестнадцать', '16'), 'час'], 's'), ('notsit', ['важно'], 's'), ('rest2', ['отдых'], 's'), ('cta', ['а', 'сколько'], 's'), ('comments', ['пиши'], 's'), ('check', ['сова', 'провер'], 's')]
T = {}; pos = 0
for key, seq, mode in A:
    i = find(seq, pos)
    j = sstart(i) if mode == 's' else i
    T[key] = round(W[j]['s'], 2); pos = i + 1
for k, (a, b) in TL['clips'].items(): T[k] = round(a, 2); T[k + '_end'] = round(b, 2)
T['END'] = TL['dur']
# hook counter roll: 16 values (16 h x day) that speed up and land exactly on the spoken "960" (used by sc.jsx and sfx.py)
_N, _t0, _L = 16, 0.45, T['h960']
T['roll'] = [0.25] + [round(_t0 + (_L - _t0) * (1 - (1 - i / (_N - 1)) ** 1.6), 3) for i in range(1, _N)]
D = {k: [[w['w'], w['s'], w['e']] for w in v] for k, v in TL['dwords'].items()}
open('edit/times.jsx', 'w').write('export const T = ' + json.dumps(T) + '\nexport const D = ' + json.dumps(D, ensure_ascii=False) + '\n')
print(json.dumps(T))
