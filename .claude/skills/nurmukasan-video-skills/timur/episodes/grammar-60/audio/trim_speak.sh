# Timur's speaking line came out with a repeat ("No, I had lived there. No, I had lived…"): cut 12.45-15.27 s
# so it reads "...living there. No, I had lived…", and shift the whisper words to match (run once, before assemble.py).
[ -f speak_full.mp3 ] || cp speak.mp3 speak_full.mp3
ffmpeg -v error -y -i speak_full.mp3 -filter_complex "[0:a]atrim=0:12.45,afade=t=out:st=12.40:d=0.05[a];[0:a]atrim=start=15.27,asetpts=PTS-STARTPTS,afade=t=in:d=0.05[b];[a][b]concat=n=2:v=0:a=1" -b:a 192k speak.mp3
python3 - <<'PY'
import json
W = json.load(open('words.json')); c0, c1 = 12.45, 15.27; d = c1 - c0
W['speak'] = [w for w in W['speak'] if w['e'] <= c0] + [dict(w, s=round(w['s'] - d, 3), e=round(w['e'] - d, 3)) for w in W['speak'] if w['s'] >= c1]
json.dump(W, open('words.json', 'w'), ensure_ascii=False)
PY
