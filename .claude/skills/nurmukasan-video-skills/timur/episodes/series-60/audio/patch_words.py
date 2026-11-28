# v3 narration: whisper skipped "Этап третий: без субтитров. «Во все тяжкие» — понятна половина." (55.4-59.5 s);
# a separate pass on that stretch found the words, they are inserted here after "быстро." (run once after asr3.py).
import json
W = json.load(open('words.json')); n = W['narr_f']
i = next(k for k, w in enumerate(n) if w['w'] == 'быстро.')
add = [('Этап', 55.75, 56.1), ('третий:', 56.1, 56.32), ('без', 56.6, 56.86), ('субтитров.', 56.86, 57.44), ('«Во', 57.66, 57.86), ('все', 57.86, 58.0),
       ('тяжкие»', 58.0, 58.38), ('—', 58.38, 58.56), ('понятна', 58.56, 58.74), ('половина.', 58.74, 59.24)]
if n[i + 1]['w'] != 'Этап': n[i + 1:i + 1] = [{'w': a, 's': b, 'e': c} for a, b, c in add]
W['narr_f'] = n; json.dump(W, open('words.json', 'w'), ensure_ascii=False)
