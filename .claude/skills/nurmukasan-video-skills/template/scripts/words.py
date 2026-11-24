# audio/words.py — word timestamps for the sped-up narration and every character clip (faster-whisper is preinstalled in the Higgsfield sandbox)
# Before: ffmpeg -i narr.mp3 -filter:a atempo=1.24 -ar 48000 -ac 1 narr_f.wav   (1.2-1.24 keeps the voice natural)
from faster_whisper import WhisperModel
import json
m = WhisperModel('small', compute_type='int8')
out = {}
for k, f, lang in [('narr_f', 'narr_f.wav', 'ru'), ('friend', 'friend.mp3', 'ru'), ('katya1', 'katya1.mp3', 'ru'), ('mom', 'mom.mp3', 'ru'), ('exam', 'exam.mp3', 'en')]:
    seg, info = m.transcribe(f, language=lang, word_timestamps=True, beam_size=3)
    out[k] = [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)} for s in seg for w in s.words]
    print(k, ' '.join(w['w'] for w in out[k])[:200])
json.dump(out, open('words.json', 'w'), ensure_ascii=False)
