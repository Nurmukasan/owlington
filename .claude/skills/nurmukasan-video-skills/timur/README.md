# Timur "60 days only X" pipeline (code-drawn pixel art, ~free)

Recovered from the Listening episode (universe #4). Everything is drawn with code: no image or video credits, only ElevenLabs voice.

- `plates/` — pixel-art library: `lib.jsx` (boxes/sprite/outlined), `chars.jsx` (Boy=Timur with modes/faces, Owl, Examiner, Jake, Mom, Teacher, Invigilator, Person...), `sets*.jsx` (bedroomNight, deskFront, examHall, examRoom, classroom, bathroom, jakeRoom, kitchen in plates.jsx...). `plates.jsx` lists every backdrop; render each to a 1440x2560 still with `dump.sh <names>` (`higgsedit frame . <i>.5`).
- `edit/` — higgsedit edit: `lib.jsx` (Layer, Scene with camera zoom/pan and plate swaps, popScale/popSlide), `ui.jsx` (Hud, PowerUp, Chip, BigTitle, Steps, Caption), `ui3.jsx` (box, T, Bubble, Wave, Glitch, Scores...), `sc.jsx` (shot list), `edit.jsx` (main).
- `audio/` + root scripts — `mk.py` (script + ElevenLabs requests), `asr.py` (faster-whisper words), `assemble2.py` (narration + character clips, cut at silence midpoints), `times.py` (anchors), `captions4.py`, `sfx.py` (8-bit SFX).
- Fonts: Press Start 2P etc. from github.com/google/fonts (ofl/pressstart2p) into `<ep>/fonts/`.
- `episodes/` — per-episode plates/script (vocab-60 = universe #5).

Episode rules (user): title + voice from frame 0, safe zones (x 56-664, nothing above y 120, right column free from y 600), captions centred at y 872, overlays never on faces.
