# anchors for the grammar episode: key -> start time of a phrase in the assembled voice track (edit/times.jsx)
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
A = [('h2400', [('2400', 'две')], 'x'), ('u7', ['вселенн'], 's'), ('notone', ['только', 'здесь'], 's'), ('book', ['только', 'учебник'], 's'),
 ('day0', ['день', ('0', 'ноль')], 's'), ('mock0', ['пробн'], 's'), ('L0', [L_], 'x'), ('R0', [('ридинг', 'reading')], 'x'), ('W0', [('райтинг', 'writing')], 'x'), ('S0', [S_], 'x'), ('all5', ['везде'], 'x'),
 ('decided', ['тимур', 'решил'], 's'), ('errors', ['все', 'дело'], 'x'),
 ('rule', ['правил'], 's'), ('ex40', [('40', 'сорок'), 'упражн'], 'x'), ('notebook', ['каждую'], 's'),
 ('wk1', ['первая', 'неделя'], 's'), ('t12', ['все', ('12', 'двенадцат')], 'x'), ('test90', ['контрольн'], 's'), ('p90', [('90', 'девяносто')], 'x'),
 ('wk2', ['вторая', 'неделя'], 's'), ('art', ['артикл'], 'x'), ('passive', ['пассив'], 'x'), ('cond', ['условные'], 'x'), ('explain', ['тимур', 'объясняет'], 's'), ('owlsleep', ['сова', 'уснула'], 's'),
 ('d30', ['день', ('30', 'тридцат')], 's'), ('ex1200', [('1200', 'тысяча')], 's'), ('mockW', ['пробный', ('райтинг', 'writing')], 's'), ('w6', [('6', 'шесть')], 'x'), ('noerr', ['ни', 'одной'], 's'),
 ('mockS', ['а', 'потом'], 's'), ('built', ['тимур', 'строил'], 's'), ('choosing', ['и', 'пока'], 's'), ('timeout', ['время', 'вышло'], 'x'),
 ('twist', ['поворот'], 's'), ('quarter', ['четверть'], 'x'), ('rest', ['остальное'], 's'), ('fluency', ['беглость'], 'x'), ('notLR', ['а', 'в', L_], 's'),
 ('skeleton', ['грамматика', 'это', 'скелет'], 's'), ('nospeak', ['но', 'без'], 's'),
 ('d60', ['день', ('60', 'шестидесят')], 's'), ('examw', ['экзамен'], 's'),
 ('result', ['результат'], 's'), ('rW', [('райтинг', 'writing')], 'x'), ('rR', [('ридинг', 'reading')], 'x'), ('rL', [L_], 'x'), ('rS', [S_], 'x'), ('overall', ['общий'], 's'),
 ('tool', ['грамматика', 'нужна'], 's'), ('notgoal', ['но', 'это', 'инструмент'], 's'), ('min20', [('20', 'двадцать'), 'минут'], 's'), ('aloud', ['скажи'], 'x'), ('essay', ['вставь'], 'x'), ('text', ['найди'], 'x'),
 ('notyours', ['правило', 'которое'], 's'), ('cta', ['а', 'ты', 'грамматику'], 's'), ('comments', ['пиши'], 's'), ('check', ['сова', 'провер'], 's')]
T = {}; pos = 0
for key, seq, mode in A:
    i = find(seq, pos)
    j = sstart(i) if mode == 's' else i
    T[key] = round(W[j]['s'], 2); pos = i + 1
for k, (a, b) in TL['clips'].items(): T[k] = round(a, 2); T[k + '_end'] = round(b, 2)
T['END'] = TL['dur']
# hook counter roll: 16 values (40 exercises x day) that speed up and land exactly on the spoken "2400" (used by sc.jsx and sfx.py)
_N, _t0, _L = 16, 0.45, T['h2400']
T['roll'] = [0.25] + [round(_t0 + (_L - _t0) * (1 - (1 - i / (_N - 1)) ** 1.6), 3) for i in range(1, _N)]
D = {k: [[w['w'], w['s'], w['e']] for w in v] for k, v in TL['dwords'].items()}
open('edit/times.jsx', 'w').write('export const T = ' + json.dumps(T) + '\nexport const D = ' + json.dumps(D, ensure_ascii=False) + '\n')
print(json.dumps(T))
