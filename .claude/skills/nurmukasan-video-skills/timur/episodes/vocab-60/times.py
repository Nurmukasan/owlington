# anchors for the vocab episode: key -> start time of a phrase in the assembled voice track (edit/times.jsx)
import json, re
TL = json.load(open('audio/timeline.json'))
W = TL['narr']
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
A = [('u5', ['вселенн'], 's'), ('nobooks', ['только', 'здесь'], 's'), ('onlycards', ['только', 'карточк'], 's'),
 ('day0', ['день', ('ноль', '0')], 's'), ('probe', ['пробн'], 's'), ('s5', ['speaking'], 'x'), ('decided', ['тимур', 'решил'], 's'),
 ('rule', ['правило'], 's'), ('nomiss', ['без', 'пропуск'], 's'), ('day1', ['день', ('перв', '1')], 's'), ('twoh', [('два', '2'), 'час'], 's'),
 ('morning', [('наутро', 'на')], 's'), ('twist', ['поворот'], 's'), ('brainf', ['мозг'], 'x'), ('curve', ['это', 'крив'], 's'),
 ('rule2', ['новое', 'правило'], 's'), ('today', ['сегодня'], 'x'), ('nextday', ['через', 'день'], 'x'), ('nextweek', ['через', 'недел'], 'x'),
 ('owlw', ['сова', 'следит'], 's'), ('week2', ['неделя', ('втор', '2')], 's'), ('fridge', ['холодильник'], 'x'), ('mirrorw', ['зеркал'], 'x'), ('onowl', [('сове', 'сова', 'сов')], 'x'),
 ('day30', ['день', ('тридцат', '30')], 's'), ('w1500', [('полтор', '1500')], 'x'), ('teacher', ['тимур', 'знает'], 's'),
 ('day45', ['день', ('сорок', '45')], 's'), ('callw', ['звонок'], 's'), ('knew', ['тимур', 'знал'], 's'), ('couldnt', ['но', 'ответить'], 's'),
 ('bricks', ['потому'], 's'), ('house', ['а', 'речь'], 's'), ('without', ['без', 'грамматик'], 's'),
 ('day60', ['день', ('шестидесят', '60')], 's'), ('w3000', [('три', '3000')], 's'), ('examw', ['экзамен'], 's'),
 ('result', ['результат'], 's'), ('rR', ['reading'], 'x'), ('helped', ['слова', 'помогли'], 'x'), ('rL', ['listening'], 'x'), ('byear', ['на', 'бумаге'], 'x'),
 ('rW', ['writing'], 'x'), ('rS', ['speaking'], 'x'), ('likeday0', ['как', 'в', 'день'], 's'), ('overall', ['общий'], 's'),
 ('power', [('три', '3000')], 's'), ('notyours', ['но', 'слово'], 's'), ('tips', ['учи', 'слова'], 's'), ('listenw', ['слушай'], 's'), ('usew', ['и', 'сразу'], 's'),
 ('five', [('пять', '5'), 'слов'], 's'), ('cta', ['а', 'сколько'], 's'), ('comments', ['пиши'], 's'), ('check', ['сова', 'провер'], 's')]
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
