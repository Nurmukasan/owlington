# times.py — anchors: key -> time of the first word of a phrase (whisper spelling, digits as whisper writes them).
# Writes edit/times.jsx: T (anchors + clip starts/ends + END) and D (character-clip words).
import json, re
TL = json.load(open('audio/timeline.json'))
norm = lambda s: re.sub(r'[^0-9a-zа-яё]', '', s.lower()).replace('ё', 'е')
ws = [(norm(w['w']), w['s'], w['e']) for w in TL['narr'] if norm(w['w'])]  # skip dash-only tokens
def find(seq, after=0.0, end=False):
    seq = [norm(x) for x in seq.split()]
    for i in range(len(ws) - len(seq) + 1):
        if ws[i][1] < after: continue
        if all(ws[i + k][0].startswith(seq[k]) for k in range(len(seq))):
            return round(ws[i + len(seq) - 1][2] if end else ws[i][1], 3)
    raise SystemExit('not found: ' + ' '.join(seq))
# in script order; every anchor is searched after the previous one
A = [('kat','это катя'),('eng','английский'),('b2','b2'),('c1','почти c1'),('mock3','но три'),('f55','показал'),('dozens','хотя'),('friends','подруги'),
 ('cafe','а катя работала'),('help','помогала'),('noans','катя не ответила'),('holid','но начались'),('cancel','и катя отменила'),('smeny','смены'),('kino','кино'),('vstr','встречи'),('phone','телефон'),
 ('d7','7 дней'),('h168','168'),('each','и каждый'),('day1','день первый'),('rule1','правила'),('old','старые'),('w100','учить по'),('week','за неделю'),('exam1','ты выучишь экзамен'),
 ('L','listening 4'),('R','reading 3'),('Wr','writing 2'),('S','speaking 3'),('day2','день второй'),('rule2','правила'),('notw','не трать'),('slow','он растет'),('fast','быстрые'),('ans','ответ почти'),('para','его перефразируют'),
 ('closed','закрыт'),('turns','превращается'),('wstruct','для райтинга'),('intro','вступление'),('par2','абзаца'),('concl','вывод'),('tmpl','нишед'),('speak20','speaking 20'),
 ('sched','расписание'),('up7','подъем'),('mock9','мог ровно'),('real','как на'),('w50','50'),('off11','отбой'),('sleepedu','потому что сон'),('brain','ночью мозг'),('nosleep','не высп'),
 ('day4','день 4'),('m6','мог 6'),('half','всего'),('cry','ночью катя'),('owl','а сова'),('day5','день 5'),('m65','6 с половиной'),('day6','день 6'),('m7','7'),('day7','день 7'),('nomocks','никаких'),('walk','легкое'),
 ('examday','день экзамена'),('opened','катя открыла'),('part','каждая часть'),('trap','каждая ловушка'),('res','результат'),('rL','listening 8'),('rR','reading 8'),('rW','writing 6'),('rS','speaking 7'),('rO','общий'),
 ('end1','неделя это'),('end2','важно'),('end3','поймешь'),('cta','а сколько'),('cta2','пиши'),('cta3','сова с')]
T = {}; last = 0.0
for k, s in A:
    after = last if k not in ('m7',) else T['day6']
    T[k] = find(s, after); last = T[k]
T['f55e'] = find('показал', 0, True)
for k, (a, b) in TL['clips'].items(): T[k] = a; T[k + '_end'] = b
T['END'] = TL['dur']
D = {k: [[w['w'], w['s'], w['e']] for w in v] for k, v in TL['dwords'].items()}
open('edit/times.jsx', 'w').write('export const T = ' + json.dumps(T) + '\nexport const D = ' + json.dumps(D, ensure_ascii=False) + '\n')
print(json.dumps(T))
