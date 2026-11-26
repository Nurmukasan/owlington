# anchors for the vocab episode: key -> start time of a phrase in the assembled voice track (edit/times.jsx)
import json, re
TL = json.load(open('audio/timeline.json'))
W = [w for w in TL['narr'] if __import__('re').sub(r'[^0-9a-zа-яё]', '', w['w'].lower().replace('ё', 'е'))]
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
A = [('u6', ['вселенн'], 's'), ('allatonce', ['только', 'здесь'], 's'), ('rule', ['правило'], 's'), ('sleep8', [('восемь', '8'), 'час'], 'x'), ('rest16', ['остальные'], 'x'), ('noweek', ['без', 'выходн'], 's'),
 ('day0', ['день', ('ноль', '0')], 's'), ('d0score', ['пробн'], 's'), ('up6', ['подъем'], 's'), ('L4', ['четыре', 'часа'], 'x'), ('R4', ['четыре', ('ридинг', 'reading')], 'x'), ('W4', ['четыре', ('райтинг', 'writing')], 'x'), ('S4', ['четыре', ('спикинг', 'speaking')], 'x'),
 ('breakf', ['завтрак'], 's'), ('lunch', ['обед'], 's'), ('wk1', ['первая', 'неделя'], 's'), ('h112', [('сто', '112')], 'x'), ('m6', ['мок'], 'x'), ('wk2', ['вторая', 'неделя'], 's'), ('mugs', ['кружек'], 's'),
 ('wk3', ['третья', 'неделя'], 's'), ('wk4', ['четвертая'], 's'), ('less', ['меньше', 'чем'], 's'), ('twist', ['поворот'], 's'), ('brain', ['мозг'], 's'), ('attn', ['после'], 's'), ('eyes', ['водишь'], 'x'),
 ('sat16', ['тимур', 'сидел'], 's'), ('only5', ['а', 'учился'], 'x'), ('dream', ['даже', 'во', 'сне'], 's'), ('d31', ['день', ('тридцать', '31')], 's'), ('mockL', ['пробный', ('лиснинг', 'листнинг', 'listening')], 's'), ('closed', ['тимур', 'закрыл'], 's'),
 ('m55', ['мок'], 's'), ('likeday0', ['как', 'в', 'день'], 's'), ('owl', ['и', 'тогда'], 's'), ('lights', ['выключила'], 's'),
 ('rule2', ['новое', 'правило'], 's'), ('blocks', ['четыре', 'блока'], 'x'), ('breaks', ['между'], 's'), ('walk', ['каждый', 'день'], 's'), ('dayoff', ['один', 'выходной'], 's'), ('six', [('шесть', '6'), 'час'], 's'),
 ('d40', ['день', ('сороков', '40')], 's'), ('d50', [('пятидесят', '50')], 'x'), ('green', ['батарейка'], 's'), ('d60', ['день', ('шестидесят', '60')], 's'), ('examw', ['экзамен'], 's'),
 ('result', ['результат'], 's'), ('rL', [('лиснинг', 'листнинг', 'listening')], 'x'), ('rR', [('ридинг', 'reading')], 'x'), ('rW', [('райтинг', 'writing')], 'x'), ('rS', [('спикинг', 'speaking')], 'x'), ('overall', ['общий'], 's'),
 ('quality', ['учит', 'не'], 's'), ('focus6', [('шесть', '6'), 'час'], 's'), ('rest', ['отдых'], 's'), ('cta', ['а', 'сколько'], 's'), ('comments', ['пиши'], 's'), ('check', ['сова', 'провер'], 's')]
T = {}; pos = 0
for key, seq, mode in A:
    i = find(seq, pos)
    j = sstart(i) if mode == 's' else i
    T[key] = round(W[j]['s'], 2); pos = i + 1
for k, (a, b) in TL['clips'].items(): T[k] = round(a, 2); T[k + '_end'] = round(b, 2)
T['END'] = TL['dur']
D = {k: [[w['w'], w['s'], w['e']] for w in v] for k, v in TL['dwords'].items()}
open('edit/times.jsx', 'w').write('export const T = ' + json.dumps(T) + '\nexport const D = ' + json.dumps(D, ensure_ascii=False) + '\n')
print(json.dumps(T))
