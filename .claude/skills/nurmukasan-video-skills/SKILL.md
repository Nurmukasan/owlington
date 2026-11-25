---
name: nurmukasan-video-skills
description: Nurmukasan's Owlington video playbook — how to make the "Что если…" IELTS pixel-art shorts (TikTok/Reels, 2-2.5 min) exactly like the Katya "one week before IELTS" episode the user loved - script & directing, voices, AI pixel-art stills with varied camera angles, Kling camera-motion clips on a budget, higgsedit edit with the lilac UI kit, karaoke captions, 8-bit SFX, safe zones, render/upload, covers, plus the user's standing rules (comment replies, Telegram, book recommendations). Use for any new Owlington video, cover, episode description or comment reply.
---

# Nurmukasan video skills — Owlington «Что если…»

The reference episode: **«Что если до IELTS осталась всего неделя?» (Катя, 2:21)** —
https://d2ol7oe51mr4n9.cloudfront.net/user_3KxFmbQfyWKL3YsBolHSttAGFiE/0ddeecb1-ceaf-4602-a45c-91bdc10e689d.mp4
The user's verdict: «вот можешь же когда хочешь… сохрани стиль, озвучку, директирование, движение камеры — всё». Every new video matches this level or beats it.

Code template (copy, then rewrite the episode-specific parts): `template/` next to this file
(`scripts/mk.py shots.py words.py assemble.py times.py captions.py sfx.py`, `edit/lib.jsx ui.jsx edit.jsx sc.example.jsx`).

---

## 0. Standing rules about the user (always)

- Reply in **Russian**. The user gave blanket permission («разрешаю тебе всё, не проси меня больше») — act, don't ask, except for spending above the budgets below.
- Brand: **Owlington | IELTS по ночам**. TikTok/Instagram `owlington.fm`, Telegram channel **owlingtonedu** (t.me/owlingtonedu).
- Owl mascot is in every video (the series motto: «всегда есть сова»). Katya's owl wears a **pink bow**.
- **Comment replies** (TikTok/IG): sound like a real person — short, casual, lowercase ok, light slang, at most 1 emoji (none if the user says «без эмодзи»). No `**`, no `•`, no polished "AI" phrasing or em-dash lists. One recommendation per reply.
- **Book recommendations: only books from our Telegram channel**, always mention «в нашем тгк owlingtonedu». Current list: B1 — The Wonderful Wizard of Oz, Peter Pan, Alice in Wonderland; B1+ — The Adventures of Sherlock Holmes, Treasure Island, Around the World in Eighty Days; B2 — The Hound of the Baskervilles, The Time Machine, The War of the Worlds.
- **Podcast recommendations (Listening): only from our Telegram listening post**, mention «в нашем тгк owlingtonedu». B1 — 6 Minute English (youtube.com/@bbclearningenglish), All Ears English (youtube.com/@AllEarsEnglishPodcast), IELTS Energy (youtube.com/channel/UCOJ3eBlqtM-alGOS2Qyh34g); B1+ — Luke's English Podcast (youtube.com/@LukesEnglishPodcast), Thinking in English (youtube.com/@thinkinginenglishpodcast), Aussie English (youtube.com/channel/UCPIAvE0MO9pyWGNh5OoYInQ); B2 — The Scottish English Podcast (youtube.com/playlist?list=PLCRkHoZ9BMJHffr67uFqbolGmWVO27BKV), The Diary Of A CEO (youtube.com/@TheDiaryOfACEO), TED (youtube.com/@TED).
- **Telegram posts**: written in the user's voice (male, «я»/«мы» for the team), casual, a few emoji ok, hook first, plain URLs (no markdown links), split by level B1 / B1+ / B2 like the books post, end with a question for comments. Plain, simple descriptions (what it is, accent, why it helps) — no jokes, no quoted phrases from the video as punchlines, no polished AI phrasing («неприятно, но работает», «без скидок», «идеально под…»). Never invent facts about the audience («вы спрашивали в комментах») or the channel unless the user said so. Tie the post to the video's in-story rules; Timur/Katya are characters, never present their scores as real results.
- «Где найти Маргарет / носителя» → Slowly (letters), HelloTalk, Tandem.
- Price questions: «цена зависит от ваших целей, можно записаться на бесплатную консультацию».
- Never promise things that aren't real; the stories are fiction (profile is labelled AI) — never sell a course with Timur/Katya results as real.
- Never put model names/IDs into anything published.

## 1. Budget (the user feels credit spend)

| item | price | per episode |
|---|---|---|
| gpt_image_2_6 still 9:16 | 0.75 | ~45-50 stills incl. re-dos ≈ 35-40 |
| Kling 3.0 **pro**, sound off, 9:16 | 1.75 / s (3 s = 5.25, 4 s = 7, 5 s = 8.75) | **≤ 70-80 total** — ~10 clips |
| ElevenLabs v4 narration + lines + 2 takes | ~25-40 | |
| **Episode total** | **≈ 150-160** | ask before going over |

Don't animate every shot ("не все кадры должны двигать камерой туда-сюда"). ~10 hero clips; everything else is a still with a different camera angle + an edit-camera move. Check `balance` before and after.

## 2. Story & directing (what made it work)

Length **1:30-1:45** from episode 6 on (Katya ran 2:20 and lost viewers; never under 1:00). Prefer a **series of complete episodes** (like Timur's 4 universes: each one has its own hook and its own score reveal) over cutting one story into «часть 1 / часть 2». If a story really needs two parts: each 1:10-1:30, part 1 ends on a cliffhanger right before the result, part 2 opens with a 3-s recap, post it within 24 h, add both to a TikTok playlist and pin a comment with the link. Keep the structure below but cut the weakest teaching beats; ~260 words of narration. Structure (Katya episode, times in brackets):
1. **Hook ≤ 3 s** — the question as a big title + a ticking number (`168:00:00`), heroine in shock, camera push-in clip, heartbeat SFX.
2. **Who + stakes** (3-17 s) — name tag, level bar (B2→C1), the bad mock as a red stamp, «moks решено 40+», friends prepared for months vs she worked in a café and helped mum with brothers → empathy.
3. **Twist of pain** — friend's voice message (waveform UI), heroine doesn't answer («Прочитано · 23:48»).
4. **Decision** — holidays; planner items struck through on the words; phone into the drawer; «7 дней = 168 часов»; hero shot (bun + pencil, low angle, orbit clip); her own line «Ладно. 168 часов. Поехали.» → HUD appears.
5. **Teaching, concrete and correct** (36-80 s) — Rule №1 «старые методы уже не работают» (no 100 words/day) → «ты учишь не английский, а экзамен» → the 4-part structure board; Rule №2 «не трать последнюю неделю на writing» + growth-speed chart; paraphrase with a real example; essay template; 20 min speaking aloud; the daily schedule; sleep = study + glowing brain with blue neurons (short → long memory).
6. **Low point** (87-99 s) — mock barely moves, she cries at night in the rain (clip through the rainy window), mum with tea + hug, the owl snuggles.
7. **Montage up** — mock bars 6.0 → 6.5 → 7.0, rest day (park), «никаких моков, сон в 22:00».
8. **Exam** — dolly clip down the exam hall, «каждая часть, каждая ловушка», speaking dialogue in English.
9. **Reveal** — result card fills row by row with a drumroll, OVERALL slam + confetti clip + fanfare.
10. **Message + CTA** — «Неделя — это не конец… пойми структуру → высокий балл», «Сколько дней до IELTS у тебя? Пиши в комменты ↓», Owlington logo, owl wink clip.

Rules: ~3.5 s per shot on average, cut **0.08 s before** the word that starts the next beat; every beat has one on-screen element (card/chip/number) synced to its word; no scene for the sake of a scene; check logic (time of day, location, who is present, numbers add up: IELTS overall = mean of 4, .25 → .5, .75 → next whole).

## 3. Characters & look (AI pixel art, gpt_image_2_6)

- Style: crisp detailed 16-bit pixel art, hard pixel edges, flat 2-3 tone shading, cosy night/lavender palette, **correct proportions — nothing stretched**, every object instantly recognisable, **no text/letters/numbers inside the image** (all text is UI in the edit).
- Order: (1) **character sheet** (16:9, 3 variants, pick one) → (2) **master room** wide shot with the heroine (2 variants) → (3) all shots with `image_references = [sheet, master room]` (job ids work as media ids) using the `PRE` prefix in `template/scripts/shots.py`.
- **Vary the camera angle every shot**: wide establishing, over-the-shoulder, top-down, low-angle hero, extreme close-up, side profile, through the rainy window, from the back of a hall, POV hands with phone.
- Leave blank surfaces for overlays (empty phone screen, empty laptop screen, blank sheet on the cork board).
- Out-of-room scenes: add «the location is different», forbid the owl/heroine when they shouldn't be there, state daylight/morning for exams.
- Review contact sheets (`montage … -tile 5x2`) and regenerate every frame with a logic error. Katya fixes: owl in friends' classroom, moon in a morning exam hall, speaking test in her bedroom, a person inside the brain shot.

Saved assets (Higgsfield ids):
- Katya + owl-with-bow sheet job **0c0dc3e9-e75f-4734-81bc-1773185e6c66**; Katya's master room job **5fa2c93f-b55e-4d12-a3ad-4dc8cd3c3f9b**.
- Series owl mascot media **3075ad85-4c10-4568-b595-f584af2b3438**; Timur listening frames media **b4faf92b-98a9-4f25-998b-9509f5ce2ead** (room) and **f27e37a8-553f-4ea6-97ed-a341be462030** (close-up); Writing cover job **7e836168-3ef1-48cd-9978-f24d825cdcba**.
- Katya: very pretty, sweet, polite 19-y-o; long wavy chestnut hair, lilac star hair clip, big brown eyes, rosy cheeks, lavender oversized sweater + white collar, jeans, white sneakers. Owl: brown, cream face, big yellow eyes, ear tufts, pink bow.

## 4. Camera motion clips (Kling 3.0 pro)

`generate_video_batch` items: `{model:'kling3_0', mode:'pro', sound:'off', aspect_ratio:'9:16', duration:3|4|5, medias:[{value:<still job id>, role:'start_image'}], prompt, use_unlim:false}`.
Prompt = one camera move + one small action + this suffix:
`Keep the exact crisp 16-bit pixel-art style, colours and character designs of the start frame; no morphing, no extra limbs, no text, smooth natural motion.`
Moves that worked: fast dramatic push-in (hook); slow dolly forward with slight arc (room intro); low-angle crane up + slight orbit (decision hero shot); slow orbit with blue pulses travelling (brain); slow push-in through rain on glass (crying); gentle drift close-up (owl snuggle); dolly down the aisle (exam hall); quick swoop + slight rotate with confetti (result); slow push-in + wink (CTA owl); sideways slide with golden light sweep (montage).
**Double-check the start_image id is the intended still** (one clip got the wrong frame). Inspect frames at 10/50/95 % — use only the clean part (the jump clip morphs at the end → used the first 1.9 s). Re-encode for the edit:
`ffmpeg -i in.mp4 -vf "scale=720:1280,setpts=K*PTS" -an -c:v libx264 -crf 16 -pix_fmt yuv420p -r 24 clips/name.mp4` (K > 1 slows a short clip to fit).

## 5. Voices & audio (ElevenLabs v4 via Higgsfield)

| role | voice | id |
|---|---|---|
| Narrator (female, chosen by the user) | Nadine | 165d9309-bb17-56ff-964a-5d6a38dab92f |
| Heroine (young, sweet, RU + EN) | Chloe | e9cfbbf0-4476-46be-b396-596eb774b165 |
| Mum | Elena | ca83ca7f-c186-493d-bd69-0d765fa861b2 |
| Friend (voice message) | Kiki | 2d51d9d0-b2a4-5e8b-9c63-f310adafd5f7 |
| British examiner | Imogen | 3811e986-0891-47cf-a1f5-78a1d62a547a |
| Old male narrator (Timur seasons) | Alexey | 7c2133e5-68ab-511f-9aed-9a67664382b1 |

- Narrator energetic in happy beats, calm and soft in sad ones — written as audio tags per sentence (`[sad, slow]`, `[excited, joyful]`, `[pause]`). Stress marks for English skill names in Cyrillic (`ли́снинг`, `ра́йтинг`); IELTS written `айéлтс`; levels `би-два`, `си-один`.
- ~340 words of narration → ~147 s natural → `atempo=1.24` → ~119 s, + ~20 s of character lines = 2:20. Generate **2 narration takes**, pick the cleaner one by whisper transcript.
- Pipeline (sandbox, `~/what-if/<ep>/audio`): download mp3s → `ffmpeg -i narr.mp3 -filter:a atempo=1.24 -ar 48000 -ac 1 narr_f.wav` → `words.py` → `assemble.py` (cuts only inside silences, inserts character lines, level-matches) → `voice.wav` + `timeline.json` → `times.py` (anchors, skips dash tokens) → `captions.py` → `sfx.py`.
- Final mix: `ffmpeg -i raw.mp4 -i sfx.wav -filter_complex "[1:a]volume=0.38[s];[0:a][s]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-15.5:TP=-1.2:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 out.mp4`.

## 6. Edit (higgsedit, 720×1280, 24 fps) — template/edit

- `Scene` = still with eased zoom/pan (`zoom:[a,b], pan:[x0,x1], panY:[y0,y1]`); `Clip` = video (`trimStart` = `from`). Vignette + soft dark band behind captions on top of the shots.
- **Gotchas** (all hit at least once):
  - `SHOTS`/`OVERLAYS` must be functions called inside compose (IMG/VID are filled first).
  - Every nested `<Layer>` must end inside its parent: `dur = parentDur - at`. `Layer` clamps negative `at`.
  - Only one opacity track per layer (DayCard: offsetY + one opacity keyframe list).
  - Vector paths (pixel icons, owl head sprite) vanish in layers that **scale** or move **up/left** → use `popSlide` (moves down) for anything with icons; `popScale`/`slam` only for rects + text.
  - `<frame>` can't sit inside `<row>`; text has no background; supported: rect `radius`, `strokeColor`, linear/radial gradients; text `strokeColor`/`shadow`.
  - Press Start 2P: `→ ↓ × ■ · ~ №` work; `≠ ✓ ✗ ☀ ☾` and emoji don't.
  - Undefined `T[key]` → «duration must be a finite number» (add the anchor to times.py).
- UI kit (`ui.jsx`): lilac/pink palette, rounded panels with shadow + highlight line, tabs, chips, **HUD** (day N/7 pips + hours left + mock), Title, DayCard, RuleCard, karaoke `Caption` with speaker tab (КАТЯ pink, МАМА mint, АНЯ · ГОЛОСОВОЕ yellow, EXAMINER sky). Episode cards in `sc.example.jsx`: CEFR bar, chat with voice-message waveform, struck planner, IELTS structure board, growth chart, paraphrase cards, essay template, schedule, brain labels, progress bars, results report, OVERALL slam, CTA + logo.
- Hide the HUD in emotional/full-screen moments (crying, mum, brain, speaking test).
- **NEVER cover the heroine's face or the key action (the user's #1 complaint).** Don't shrink the panels — move them. Before placing any card, look at the still/clip frames and find where the face is, then put the card on a free area: wall/window above the head (y 124-360 when the HUD is hidden or the head is low), or desk/legs/floor below the chin (y 560-860). Clips move (orbit/jump) — check frames across the whole clip. Final placements in Katya v4 (measured): hook timer → under the title (y 282, the push-in brings her face to y 540-800); level bar → wall above her head (y 236); plans list → compact card at the top (y 124-300, face y 525-645); «168 ЧАСОВ» in the bun shot → legs/floor (y 580, chip y 756); «100 слов» → wall (y 222-322); growth chart → compact at the top (y 150-340, HUD hidden for those 2 s); rule №2 → y 660; paraphrase → y 568-850; schedule → compact low (y 622-858); sleep chip → blanket (y 720); mock 6.0 → laptop (y 660); progress bars → low (y 656-846); park chips → small, left of her (x 60); results → compact at the top (y 124-374); OVERALL 7.5 → legs (y 650); ending cards → above her head (y 130/246). If a card must sit where the face is, reframe the still so the face leaves the shot (essay: zoom 2.0 on the notebook).
- A card must not hide the action it describes (plans card ends at the drawer cut so the phone-into-drawer is visible).
- The user allows **resizing** cards (smaller is fine) — a visible face beats a big card.
- **Measure the face across the WHOLE shot, on frames WITHOUT overlays**: build a copy of the edit with only `SHOTS()` (no OVERLAYS/CAPTIONS), render each shot at start+0.08 / middle / end-0.08 with a red line every 100 px, read the eyes→chin y-range in every frame (clips push in/orbit, Ken-Burns zooms move the face down). Then place each card fully outside the union of those ranges. Also check the **captions** (tab y 822, text y 872-960) against the face: extreme close-ups and low framings put the mouth there — reframe the still (pan/zoom) or regenerate it with «face in the UPPER half, eyes at ~32 % from the top» (Katya v4: new `eyes2` still; calendar shot reframed so her face sits at y 580-700).
- **Measure, don't guess** (guessing from small thumbnails failed three times): render the frame with `higgsedit frame . <t>`, draw a red line every 100 px (PIL), look at it at ≥ 220 px wide and write down the face's y-range for every shot. Close-ups put the face much lower than expected (Katya with the book: face y 500-820, at the desk: 495-610). Then place the card fully outside that range; if only the top is free, hide the HUD for those seconds and put the card at y 150 (growth chart).
- Final check before render: a grid sheet of every shot that has an overlay — every face visible, nothing in front of eyes/mouth.

## 7. Safe zones (TikTok + Instagram) — mandatory

720×1280: text/panels inside **x 56-664**; nothing important above **y 120** (HUD starts at 128); captions **centred** at **y 872** in a 540-px row (x 90-630, centre 360 — the user wants them exactly centred, not shifted left); keep the right column (x > 610) free of text from y ≈ 600 down (TikTok buttons); IG grid shows the centre 3:4 — the cover's title must fit it.

## 8. Render, verify, deliver

1. `higgsedit build edit.jsx` → contact sheets `higgsedit sheet . --times … --cols 8` for the whole timeline; fix overlaps, faces, logic.
2. `higgsedit render . --quality final --out renders/raw.mp4` with sandbox `size:"xl"`, `background:true` (~3 min).
3. Mix SFX (above) → `ffmpeg -i mix.mp4 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart -c:a copy final.mp4` (~50 MB).
4. Spot-check frames inside every clip in the final file.
5. `media_upload` (video/mp4) → PUT with retry (got HTTP 520 once; `--upload-file` retry worked) → `media_confirm` → `register_what_if_result` → `show_result` → send the cloudfront link.
6. Report: plot beats, what moves, credits spent / balance left; offer description + cover.

## 9. Covers & descriptions

- Cover the user liked: AI flat pixel art (same style, no neon glow/gloss), big yellow pixel title with dark outline + red shadow (e.g. «60 ДНЕЙ / ТОЛЬКО LISTENING»), white-on-dark score badge («5.0 → 9.0»), the hero centre, owl present; **exact Owlington logo small in the top-left corner** — render it from the site sprite (`OWL_HEAD` from `src/scene/sprites.ts`) + Fraunces 650 (SOFT 100, WONK 1), colour #fff1c9, via Playwright in the sandbox (`NODE_PATH=$(npm root -g)`), never redraw it by hand.
- Description: 1-2 short lines with a hook + score jump, «книги и материалы бесплатно в тг: owlingtonedu», 5 hashtags incl. `#ielts #английский #higgsfield` + the skill hashtag.

## 10. Episode history

Timur 60 days (the «4 вселенные» series, finale = Listening, 1:45, ended with the teaser «А если всё сразу?»). Listening beats: rule «2 часа English в день», background listening doesn't count («фоном → мозг в игре»), twist «по-старинке», dictation «1 мин аудио = 10 мин», podcast speed 1.0x → 1.25x → 1.5x, accent roulette UK/USA/Australia/Scotland/India/Ireland, «терпимо», day 40 «locked in», mum «Тимур! Ужинать!» unheard, day 50 the fictional podcast «Manchester Mornings», day 60 exam «та же ловушка» (fourteen… sorry, forty). Reading R 8.5 → overall 7.0; Speaking S 8.0 (L7 R6 W6) → 7.0; Writing W 8.0 (R6 S6 L5.5) → 6.5; Listening L 9.0 (S8 R6.5 W6) → 7.5.
Katya one week: L 8.0, R 8.0, W 6.5, S 7.0 → 7.5 (mock 5.5 three months before; level B2-C1).
Stats (TikTok, first 6 h): ep 5 Katya (2:20) — ~1K views, avg watch 43.2 s (31 %), full watch 6.65 %, 9 follows, most viewers left at 0:01 → the first frame loses people. Ep 4 Timur Listening (1:45) went viral. Lessons for next episodes: action + voice from frame 0 (no fade-in, no calm opener), 3-5-word title readable in 1 s, aim for ~1:30-1:45 (never under 1:00), tease the result in the first 3 s, keep the series' recurring hero/hook the audience already knows.
Next: Timur ep 5 «А если всё сразу?» (2:00, Timur v2 redesign, mock 5.5 → 7.5) — full production pack in `episodes/timur-05-vse-srazu.md`.
Next ideas the audience asked for: «прокачать всё сразу», new heroes, «что если…» ideas tied to IELTS (неделя до экзамена, только ИИ, только игры и сериалы, сдать 5 раз подряд).

## 11. Cloud Claude Code pipeline (Higgsfield CLI) — used for Timur ep 5

The claude.ai Higgsfield connector in cloud Claude Code is read-only. Generation works through the **Higgsfield CLI**:
`npm i -g @higgsfield/cli` → `higgsfield auth login` (loopback: the user opens the link, sends back the `localhost:8765/callback?...` URL, curl it inside the container) → `higgsfield workspace set <id>`.
Network hosts needed (environment allowlist): clerk.higgsfield.ai, fnf-api-gw.higgsfield.ai, fnf.higgsfield.ai, higgsfield.ai, upload.higgsfield.ai, d8j0ntlcm91z4.cloudfront.net, d2ol7oe51mr4n9.cloudfront.net.
Code: `template_cli/` — `tools/gen.py` (any model, downloads result), `shots.py`+`run_stills.py` (stills, gpt_image_2_6 quality high 2k 9:16 ≈ 2 cr), `clips.py` (kling3_0 pro), `assemble.py` (per-line ElevenLabs v4 → trim, atempo 1.25 narration / 1.06 lines, speech2text VTT → word times), `sfx.py`, `edit/engine.js`+`spec.js` (HTML compositor: Ken Burns, clip frames, pixel UI cards, HUD, karaoke captions) and `tools/render.js` (Playwright → ffmpeg). Final mix: voice + sfx 0.38 + ElevenLabs Music bed 0.16 side-chain ducked.
Voices of the Timur universe: narrator Alexey 7c2133e5…, Timur **Dylan b847bc29-f184-583a-8ad9-d1f1e16d1a60**, Jake **Archie bd072316-f77c-588b-b6e5-e46b9b03d008**, Margaret **Mabel fa64fba4-ad02-405e-99d0-1f085d87c706**, invigilator Alistair d9d5c263-f84e-4752-97b5-3750fcc6fd2f, examiner Imogen, mum Elena.
Timur v2 sheet job 690b6e44-5ca0-46e8-b2dd-fe96421445f1, room v2 master job 521d1bd5-23ce-4715-b01d-7f0a211e0aef, original pixel owl upload 00328c28-cccb-4526-9e45-460d6319d9cb (pass it to EVERY shot with the owl: the user wants the mascot unchanged and pixel).
Lessons (user caught these): a reverse angle must respect the room layout (no door where the window is — shoot the opposite wall); people full body with feet when the frame shows the floor; seated people at a desk get ADULT proportions spelled out in the prompt (desk top at belly-button height, thighs horizontal, lower legs as long as the thighs down to the floor, chair seat at knee height) — otherwise legs vanish into the dark or come out «как у лилипута»; side views of someone at a desk with drawers keep breaking (chair through the drawers, short legs) — prefer the front view from the room master: he sits BEHIND the desk facing camera, the desk front hides legs and chair; when fixing one thing by editing a still, also name the furniture to keep (Timur's desk: two drawers left, cabinet right, knee space in the middle); Kling adds stray owls in other locations → say «NO owl, no animal, no figurine» and cut clips before morphing; STT may mishear a stressed word at the start of a line («Ра́йтинг» → lead with «Теперь ра́йтинг»).
Card layout v2 (the user's feedback on Timur ep 5: «иллюстрации не пропорциональные, не в центре, слишком большие, закрывают лицо и интересные кадры»):
- Put information ON the object it belongs to: e-mail and mock results on the laptop screen, exam results on the phone screen. Bake it INTO the still with `ui/fit.py`: flood-fill mask of the blank screen from its centre, crisp UI resized to the mask bbox, pasted through the mask (exact bezel/corners, moves with the camera). The user rejected a floating HTML card («видно что фотку тупо поставил») and also a pixelated/glare version («убого») — keep it crisp and exactly inside the screen, nothing else. Split the shot per UI state with a shared `span` so the camera move stays continuous.
- Everything else: compact cards 420-520 px wide, always horizontally centred (`CARD`, `ROW`+`CHIPC`), in the free zone of THAT shot: wall/board above the head (y 236-440) or desk/legs below the hands (y 600-790, captions start at 818). Measure with `tools/bare.js` (bare frames + 100 px grid at start/middle/end of every card) before placing.
- Drop cards that only repeat the voice (e.g. «20 мин на текст», a second «ДЕНЬ 30» banner when the HUD already shows it); merge pairs of chips into one card.
- Style: 4 px border, 12 px radius, slightly translucent gradient, ink outline + soft drop, 11 px tabs.

## 12. Hook = for COLD viewers (lesson from Timur ep 5)
Eps 3-6 had better retention/likes than eps 1-2 but far fewer views: the hooks spoke to fans of the series («Четыре вселенные. Четыре Тимура. А теперь — один.»), so people from the For You feed swiped away in 1-2 s. Retention and like % only count those who stayed; reach is decided by the 1-2 s swipe rate and shares/saves. Visual polish and credits spent do not buy reach.
- First frame: the OUTCOME for a stranger — a big score jump «5.5 → ?.?» resolving to 7.5 within 1 s, the hero in motion (victory clip), voice from 0.0: «С пяти с половиной — до семи с половиной. За шестьдесят дней. Вот что он делал каждый день.» Then straight to stakes.
- No series lore, character names or «серия N» in the first 3 s. Lore can come later.
- Prefer hooks about the viewer's problem or a concrete trick («ты теряешь балл на этой ловушке») and a comment question people want to answer.
- Before judging a video, check «Источники трафика» (% For You) and the first-2-s drop on the retention graph.

