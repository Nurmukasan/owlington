# shots.py — still frames for every shot (gpt_image_2_6, 9:16, ~0.75 credit each), batches of 12 via generate_image_batch
# {"ref": "sandbox:~/<ep>/gen/batchN.json#/requests"}. References: the character sheet + the master room (job ids work as media ids).
# After download: review contact sheets, regenerate any frame with a logic error (wrong place/time of day, owl where it can't be, etc.).
import json
ROOM = '5fa2c93f-b55e-4d12-a3ad-4dc8cd3c3f9b'   # master establishing shot of Katya's room
SHEET = '0c0dc3e9-e75f-4734-81bc-1773185e6c66'  # Katya + owl-with-bow character sheet
PRE = ("Vertical 9:16 frame, crisp detailed 16-bit pixel art in exactly the same style, palette and characters as the references "
"(KATYA: very pretty sweet 19-year-old girl, long wavy chestnut hair, lilac star hair clip, big brown eyes, rosy cheeks, lavender oversized sweater with white collar; "
"the brown owl with a cream face, big yellow eyes and a pink bow on its head). Hard pixel edges, flat 2-3 tone shading, no blur. "
"Correct natural proportions, nothing stretched, every object instantly recognisable. No text, no letters, no numbers anywhere. Main subject in the middle of the frame. Scene: ")
# (key, in_the_room?, prompt) — vary the ANGLE every shot: wide, over-the-shoulder, top-down, low angle, extreme close-up, through a window, side profile
S = [
('hook', 1, "night, medium close shot from the front at a slightly low angle: Katya at her white desk in her lavender bedroom, lit by the cold bluish glow of her open laptop, eyes wide in shock, both hands on her cheeks; behind her on the bookshelf the owl with the pink bow is startled with puffed feathers."),
('level', 1, "warm evening lamp light, waist-up close shot: Katya smiling sweetly and holding a thick English textbook with a plain blue cover against her chest, the cork board with polaroids behind her."),
('mock55', 1, "cool grey-blue memory flashback lighting, top-down view of the white desk: a printed answer sheet with rows of ticks and red crosses, a red pen, a cold cup of tea, a crumpled tissue, a pencil."),
('pile', 1, "low angle: a tall messy tower of dozens of thick practice test booklets on the white desk, Katya peeking out from behind the tower, tired, only her eyes and the top of her head visible, lamp light."),
('friends', 0, "bright daytime language-school classroom with plain beige walls, a blank whiteboard and big windows with daylight: three friendly girls (one with a short black bob in a mint hoodie, one with a blonde ponytail in a yellow cardigan, one with red curls in a denim shirt) studying together at one table with books, laptops and highlighters, laughing and confident. There is NO owl and NO Katya anywhere in this scene. Not the bedroom."),
('cafe', 0, "evening coffee shop seen from the customer side: Katya behind the counter as a barista in a dark green apron, hair in a low ponytail, pouring milk into a latte at a big espresso machine, tired but kind smile; a pastry display case, hanging warm lamps, a dark window with a night street."),
('kitchen', 0, "cosy family kitchen in the evening, three-quarter view: Katya at the kitchen table patiently helping two little brothers (about 7 and 9) with their homework notebooks; their mother in an apron cooking at the stove in the background with a steaming pot, warm hanging lamp."),
('phone', 1, "night, over-the-shoulder close-up: Katya's hands holding a smartphone in her bedroom; the phone screen is a plain evenly glowing empty light-grey rectangle with nothing on it."),
('bedsad', 1, "night, side view: Katya lying curled up on her bed in the dark, her phone face down on the lilac blanket beside her, staring at nothing, cool moonlight from the window, the owl on the shelf watching her sadly."),
('planner', 1, "bright morning light, top-down close-up: an open paper planner with two blank lined pages on the white desk, a red pen next to it, pastel sticky notes, the pink mug and the small cactus in a pink pot at the edge."),
('drawer', 1, "morning light, close-up from the side: Katya's hand placing her smartphone into an open drawer of the white desk."),
('bun', 1, "bright morning, low-angle hero shot in her bedroom: Katya tying her hair up into a messy bun with a pencil stuck in it, a confident determined look, the owl with the pink bow perched on her shoulder looking equally determined, the bright window behind her."),
('eyes', 1, "extreme close-up of Katya's determined face, hair up in a messy bun with a pencil in it, eyes sparkling, a small brave smile, morning light."),
('deskback', 1, "morning, medium shot from behind and slightly above, over Katya's shoulder: she sits at her white desk with an open laptop, a notebook and highlighters, her hair in a messy bun; on the cork board above the desk a large blank cream sheet of paper is pinned in the middle."),
('trash', 1, "close-up next to the desk: a big stack of blank white vocabulary flashcards falling into a small pink waste bin, a few cards fluttering in the air, Katya's hand letting go."),
('listen', 1, "daytime, side profile: Katya wearing big white over-ear headphones, reading a practice booklet and marking it with a yellow highlighter, focused and calm."),
('readtop', 1, "top-down: an open exam reading booklet whose text is drawn as rows of thin grey lines, two lines highlighted in yellow and pink, a highlighter pen and Katya's hand holding a pencil."),
('write', 1, "evening, front view slightly from above: Katya writing quickly on lined paper, concentrated, a neat stack of essay sheets beside her, the desk lamp glowing."),
('mirror', 1, "daytime: Katya standing in front of a tall standing mirror in her bedroom, holding her phone up to record herself, speaking with an open-hand gesture; her reflection is visible in the mirror; the owl watches from the shelf."),
('alarm', 1, "early sunrise light through the bedroom window: a round pink twin-bell alarm clock ringing on the nightstand in the foreground, Katya stretching and waking up in bed in the background."),
('sleep', 1, "night, top-down view: Katya sleeping peacefully in her bed under the lilac blanket, hugging the plush bunny, the owl with the pink bow asleep on the headboard, soft moonlight."),
('brain', 0, "ONLY a big beautiful glowing human brain floating in the middle of a dark navy starry space, side view, soft pink-lilac brain surface with clear folds, bright blue glowing neuron pathways with small blue light pulses travelling from a small glowing region deep in the centre out to the outer cortex. No people, no room, no furniture, just the brain and stars."),
('ressad', 1, "night, front view: Katya at her desk looking at her laptop with a disappointed sad face, lips pressed together, the room lit only by the laptop glow and the desk lamp."),
('cry', 1, "night, view from outside through the window glass covered in raindrops: Katya at her desk crying with her head on her folded arms, the desk lamp glowing warmly, the owl with the pink bow on the desk beside her."),
('momdoor', 1, "night: the bedroom door is open, Katya's mother in a cosy beige cardigan stands in the warm hallway light holding a mug of tea, a kind worried smile; Katya sits at the desk in the foreground, seen from behind."),
('hug', 1, "night, close shot: Katya's mother hugging her from behind as she sits at the desk, Katya with teary eyes and a small grateful smile, a mug of tea on the desk, warm light."),
('owllean', 1, "night, close-up on the desk: the owl with the pink bow snuggles against Katya's arm, Katya with tear-stained cheeks smiles softly at the owl, lamp light."),
('sunrise', 1, "bright golden sunrise flooding the bedroom: Katya at the desk wearing headphones, energetically writing answers and smiling, the owl with the pink bow cheering with both wings raised."),
('happy', 1, "daytime, front view: Katya at the desk looking at her laptop with a bright excited smile, both fists clenched in a small victory gesture."),
('park', 0, "wide shot at golden sunset: Katya walking calmly along a path in a pretty city park with orange autumn trees and benches, the owl with the pink bow sitting on her shoulder, peaceful and relaxed."),
('hall', 0, "bright MORNING daylight, wide shot from the back of a big modern exam hall with plain light-grey walls, tall windows with blue sky and daylight, a large round wall clock: rows of single wooden desks with students seen from behind; Katya sits in the middle row and calmly opens her test booklet. No moon, no night, no owl on the desks."),
('qclose', 0, "bright morning daylight in the exam hall, close-up over Katya's shoulder: an exam question booklet on a wooden desk with its text drawn as rows of thin grey lines, she underlines one line with a pencil, calm and confident; a transparent water bottle on the desk. No owl, no night."),
('speak', 0, "daytime IELTS speaking test room in a test centre (NOT her bedroom): plain light-grey walls, a window with daylight, a small table with a digital voice recorder; over the shoulder of a friendly female examiner with short grey hair and glasses holding a clipboard, Katya sits across the table in her lavender sweater smiling confidently and talking with a gesture."),
('reslap', 1, "evening, close-up: Katya's hands on her laptop at home, the laptop screen is a plain evenly glowing empty white rectangle with nothing on it, she holds her breath, lamp light."),
('jump', 1, "Katya jumping with joy in her bedroom, both arms up, hair flying, colourful confetti in the air, the owl with the pink bow flying around her happily flapping its wings."),
('window', 1, "calm dusk: Katya sitting on a cushioned window seat looking out at the city lights, holding a printed certificate, peaceful proud smile, the owl with the pink bow next to her."),
('owlcta', 1, "close-up of the owl with the pink bow sitting on its little wooden perch on top of the bookshelf, looking straight at the viewer, cute, the starry night window behind, plenty of empty wall space above it."),
('calendar', 1, "morning sunlight: the lavender bedroom wall with a paper wall calendar showing an empty grid, one whole row (a week) circled with a pink marker and a heart sticker, fairy lights above."),
]
reqs = []
for i, (k, room, p) in enumerate(S):
    med = [{'value': SHEET, 'role': 'image_references'}, {'value': ROOM, 'role': 'image_references'}]
    tail = "" if room else " Use only the pixel style and the characters from the references; the location is different."
    reqs.append({'index': i, 'params': {'model': 'gpt_image_2_6', 'aspect_ratio': '9:16', 'use_unlim': False, 'medias': med, 'prompt': PRE + p + tail}})
for b in range(0, len(reqs), 12):
    json.dump({'requests': reqs[b:b + 12]}, open(f'gen/batch{b // 12}.json', 'w'), ensure_ascii=False)
json.dump([k for k, _, _ in S], open('gen/keys.json', 'w'))
print(len(S))
