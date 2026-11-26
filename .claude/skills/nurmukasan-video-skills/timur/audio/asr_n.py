from faster_whisper import WhisperModel
import json
m = WhisperModel('medium', device='cpu', compute_type='int8')
W = json.load(open('words.json'))
segs, info = m.transcribe('narr_f.wav', language='ru', word_timestamps=True)
W['narr_f'] = [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)} for s in segs for w in s.words]
print(' '.join(w['w'] for w in W['narr_f']))
json.dump(W, open('words.json', 'w'), ensure_ascii=False)
print('DONE')
