import json, re
TL = json.load(open('audio/timeline.json'))
W = TL['narr']
norm = lambda s: re.sub(r'[^0-9a-zа-яё]', '', s.lower()).replace('ё', 'е')
tk = [norm(w['w']) for w in W]
def find(seq, after=0):
    for i in range(after, len(tk) - len(seq) + 1):
        if all(tk[i + k].startswith(seq[k]) for k in range(len(seq))): return i
    raise SystemExit(f'not found {seq} after {after}')
def sstart(i):
    while i > 0 and not re.search(r'[.?!:»]$', W[i - 1]['w']): i -= 1
    return i
def prevsent(i):
    i = sstart(i); return sstart(i - 1) if i > 0 else 0
A = [('u4', ['вселенная'], 's'), ('not', ['тимур', 'не', 'читает'], 's'), ('listen', ['он', 'только'], 's'), ('day0', ['день'], 's'), ('writes', ['тимур', 'пишет'], 's'),
 ('l5', ['listening'], 's'), ('rule', ['правило'], 's'), ('bg', ['первые'], 's'), ('h20', ['двадцать', 'часов'], 's'), ('mock5', ['снова'], 's'), ('twist', ['поворот'], 's'),
 ('dict', ['новое', 'правило'], 's'), ('pausew', ['пауза'], 's'), ('owl', ['сова', 'помогает'], 's'), ('week3', ['неделя', 'третья'], 's'), ('speed', ['скорость'], 's'),
 ('back', ['а', 'потом', 'обратно'], 's'), ('week4', ['неделя', 'четвертая'], 's'), ('roul', ['рулетка'], 's'), ('terp', ['австралия'], 'n'), ('nocom', ['без', 'комментариев'], 's'),
 ('day40', ['день'], 's'), ('locked', ['режим'], 's'), ('busw', ['автобусе'], 'x'), ('streetw', ['улице'], 'x'), ('kitchenw', ['кухне'], 'x'), ('nohear', ['не', 'слышит'], 's'),
 ('day50', ['день'], 's'), ('podcast', ['новый', 'подкаст'], 's'), ('voice', ['голос'], 's'), ('day60', ['день'], 's'), ('exam', ['экзамен'], 's'), ('trap', ['и', 'та', 'же'], 's'),
 ('forty', ['сорок'], 's'), ('noblink', ['тимур', 'даже'], 's'), ('result', ['результат'], 's'), ('live', ['два', 'месяца'], 'x'), ('overall', ['общий'], 'x'), ('pods', ['сотня'], 'x'), ('four', ['четыре', 'вселенные'], 's'), ('four2', ['четыре', 'тимура'], 's'),
 ('four3', ['четыре', 'разных'], 's'), ('const', ['но', 'кое'], 's'), ('always1', ['всегда', 'есть', 'тимур'], 's'), ('always2', ['всегда', 'есть', 'экзамен'], 's'),
 ('owlc', ['и', 'всегда'], 's'), ('allatonce', ['а', 'что', 'если'], 's'), ('knows', ['сова', 'знает'], 's')]
T = {}; pos = 0
for key, seq, mode in A:
    i = find(seq, pos)
    j = i if mode == 'x' else i + len(seq) if mode == 'n' else sstart(i) if mode == 's' else prevsent(i)
    T[key] = round(W[j]['s'], 2); pos = i + (0 if mode == 'p' else 1) if mode != 'p' else i
for k, (a, b) in TL['clips'].items(): T[k] = round(a, 2); T[k + '_end'] = round(b, 2)
T['END'] = TL['dur']
D = {k: [[d['w'], round(d['s'], 2), round(d['e'], 2)] for d in v] for k, v in TL['dwords'].items()}
open('edit/times.jsx', 'w').write('export const T = ' + json.dumps(T) + '\nexport const D = ' + json.dumps(D, ensure_ascii=False) + '\n')
for k, v in T.items(): print(k, v, end=' | ')
