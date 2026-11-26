from faster_whisper import WhisperModel
import json
m = WhisperModel('medium', device='cpu', compute_type='int8')
out = {}
for f, lang, ext in [('narr_f','ru','wav'),('exam0','en','mp3'),('aus','en','mp3'),('scot','en','mp3'),('mom','ru','mp3'),('jake','en','mp3'),('exam60','en','mp3')]:
    segs, info = m.transcribe(f'{f}.{ext}', language=lang, word_timestamps=True)
    out[f] = [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)} for s in segs for w in s.words]
    print(f, '|', ' '.join(w['w'] for w in out[f]), flush=True)
json.dump(out, open('words.json', 'w'), ensure_ascii=False)
print('DONE')
