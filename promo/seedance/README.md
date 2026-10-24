# Owlington — промо 30 с, 9:16 (Seedance 2.0 на Higgsfield)

Промпты написаны по скиллу **04-course-promo** из
[rediumvex/ai-video-generator-claude](https://github.com/rediumvex/ai-video-generator-claude)
(хук — из **01-viral-hook**). Seedance делает 4–15 с за генерацию, поэтому ролик собирается из
трёх кусков: **11 с + 12 с + 7 с = 30 с**.

Все картинки в `assets/` сняты с настоящего сайта (демо-ученики) или отрисованы из
`src/components/OwlMascot.tsx`, поэтому сова, логотип и интерфейс — фирменные, а не придуманные моделью.

---

## Шаг 0. Один раз: персонаж

Seedance держит лицо героя между генерациями только по картинке. Сначала сделай key-art героя
(Higgsfield → Image, любая модель) и сохрани как `student.png` — это `image1` во всех трёх кусках.

```
Stylized 3D animation character, Pixar-like, soft subsurface skin, 20-year-old Central Asian young man,
short dark-brown hair with a fringe swept to the left, warm medium skin, friendly brown eyes,
teal-navy hoodie with amber drawstrings, sitting at a wooden desk with a silver laptop,
cozy evening dorm room: window with a moonlit forest, string of warm fairy lights, shelf with colourful books,
yellow mug, open notebook. Three-quarter view, warm lamp light from the right, cool screen glow on the face.
Full body visible to the waist, clean background detail, 9:16.
```

## Материалы

| Тег в промпте | Файл | Что это |
|---|---|---|
| student | `student.png` (шаг 0) | герой |
| owl | `assets/owl-front.png` | маскот, как на сайте |
| owl poses | `assets/owl-sheet.png` | позы: front / point / happy / wink / nod |
| logo | `assets/owl-logo.png` | логотип OWLINGTON |
| landing | `assets/site-landing.png` | главная страница |
| reading hub | `assets/site-reading-hub.png` | раздел Reading |
| lesson | `assets/site-lesson.png` | видеоурок |
| reading test | `assets/site-reading-test.png` | тест Reading |
| listening test | `assets/site-listening-test.png` | тест Listening |
| writing editor | `assets/site-writing-editor.png` | эссе в редакторе |
| writing review | `assets/site-writing-review.png` | разбор эссе: цифры, повторы, чек-лист |
| self-assessment | `assets/site-writing-selfassess.png` | самооценка по 4 критериям |
| writing result | `assets/site-writing-result.png` | итог Writing + достижения |
| rank before | `assets/site-profile-before-rankup.png` | Nightwatch Owl, 1 895 XP |
| rank after | `assets/site-profile-scholar.png` | Scholar Owl, 1 905 XP |
| band 8 | `assets/site-result-band8.png` | Reading 35/40, Band ≈ 8.0 |
| night forest | `assets/site-dashboard.png` | пиксельный ночной лес |

Загружай в генерацию в указанном порядке — номера `@material[imageN]` ниже соответствуют порядку.

---

## Генерация 1 — Хук, сова, учёба (11 с)

Материалы: 1 `student.png` · 2 `owl-front` · 3 `owl-sheet` · 4 `owl-logo` · 5 `site-landing` ·
6 `site-reading-hub` · 7 `site-lesson` · 8 `site-reading-test` · 9 `site-listening-test`

```
Seedance 2.0 prompt — 11 seconds, 9:16 vertical, stylized 3D animation (Pixar-like), cozy evening study room.
The student is always @material[image1] — same face, hoodie, laptop and room in every shot.
The owl is always @material[image2] (poses in @material[image3]): round brown owl, big amber eyes,
cream chevron belly, ear tufts. Never redesign it.

HOOK [0:00–0:03]
Extreme close-up of hands typing on the laptop, cool blue moonlight, f/1.8 shallow focus.
Fast dolly pull-back in 0.7s reveals the student at a desk of scattered notes, slightly lost.
He clicks the touchpad: the screen shows @material[image5]; room light shifts from cold blue to warm amber-violet.
Sound: keyboard clicks only, then a bass hit as the screen lights up. The viewer should feel: "that's me."

OWL [0:03–0:06]
On screen beside the logo @material[image4] the owl blinks, tilts its head, hops out of the laptop
onto a stack of books, one wing flap, then points its wing at the screen.
Camera pushes into the screen and through it into a pixel-art night forest where @material[image6] floats.

STUDY [0:06–0:11]
Linked 1.2s shots: the student watches the lesson @material[image7]; the cursor highlights a sentence
in @material[image8]; he puts on headphones and the cursor clicks the right answer in @material[image9],
soft green flash; the owl nods. Keep interface text sharp and unchanged.

Lighting: 3000K desk lamp key from right, 6500K screen glow on face, teal window rim light.
Music: modern electronic, 120 BPM, building. No voice, no added text.
```

## Генерация 2 — Writing и прогресс (12 с)

Материалы: 1 `student.png` · 2 `owl-front` · 3 `owl-sheet` · 4 `site-writing-editor` ·
5 `site-writing-review` · 6 `site-writing-selfassess` · 7 `site-writing-result` ·
8 `site-profile-before-rankup` · 9 `site-profile-scholar`

```
Seedance 2.0 prompt — 12 seconds, 9:16 vertical, same 3D style, same student @material[image1],
same owl @material[image2] (poses @material[image3]), same room as before.

WRITING [0:00–0:07]
Over-the-shoulder shot: the student types an essay in @material[image4], rhythmic keyboard clicks.
Snap zoom into the screen. Slow, steady glide across the review @material[image5] so the English text
stays readable; one sentence lights up and the owl, standing by the laptop, points at it with its wing.
The student adds a sentence; a checklist line turns green with a soft click.
Quick lateral move across the self-assessment @material[image6]: Structure, Vocabulary, Grammar.
The viewer should feel: "I finally see what to fix."

PROGRESS [0:07–0:12]
Match cut: the highlighted line stretches into a gold XP bar.
Three 0.6s shots of the same desk: warm evening lamp, deep night with headphones, morning daylight.
Then the profile: achievements from @material[image7] slide in, the XP bar fills on @material[image8]
and the rank turns into "Scholar Owl" exactly as in @material[image9]. Gold sparkle burst,
achievement chime. The owl spreads its wings.

Lighting: warm 3000K key, cool screen fill; daylight 5500K in the morning shot.
Music: same 120 BPM track, adds claps and a riser into the rank-up. No voice, no added text.
```

## Генерация 3 — Результат и финал (7 с)

Материалы: 1 `student.png` · 2 `owl-happy` · 3 `owl-wink` · 4 `owl-front` · 5 `site-result-band8` ·
6 `site-dashboard`

```
Seedance 2.0 prompt — 7 seconds, 9:16 vertical, same 3D style, same student @material[image1],
same owl @material[image4].

RESULT [0:00–0:03]
Hard cut to the laptop screen: @material[image5]. Camera holds still on "35/40" and "Band estimate ≈ 8.0"
for 1.5s so it can be read. Soft impact hit, music drops out for a breath.

REACTION [0:03–0:05]
The student smiles and makes a small, restrained fist pump. The owl hops and opens its wings
like @material[image2]. Light turns warmer, fine gold dust in the air. The viewer should feel: proud.

CTA [0:05–0:07]
Camera pulls back: the student and the owl side by side at the laptop.
Hard cut to the pixel night forest of @material[image6] with the upper and middle frame left empty
for the logo. The owl winks and waves one wing like @material[image3]. Final music hit, then hold.
No added text.
```

---

## Монтаж (CapCut / таймлайн Higgsfield)

1. Склей 1 → 2 → 3, экспорт 1080 × 1920 (Seedance отдаёт 720p — включи апскейл).
2. Надписи кладём в монтаже, а не в промпте: Seedance искажает русский текст.

| Время | Надпись |
|---|---|
| 0:00.9–0:02.9 | «IELTS. С чего начать?» |
| 0:06.3 / 0:07.6 / 0:09.6 → до 0:10.9 | «Смотри.» / «Практикуйся.» / «Разбирайся.» |
| 0:19.9–0:22.9 | «Видишь свой прогресс» |
| 0:23.4–0:25.0 | «Practice Band 8.0» + мелко: «оценка пробного теста, не официальный результат IELTS» |
| 0:27.0–0:30.0 | логотип `assets/owl-logo.png`, «Твой путь к высокому IELTS», кнопка «Начни подготовку» |

3. Озвучка — отдельной дорожкой, молодой мужской голос, музыку под голосом приглушить до −18 dB:

| Старт | Реплика |
|---|---|
| 0:00.3 | Готовишься к IELTS? |
| 0:02.4 | Начни с понятного плана. |
| 0:04.5 | В Owlington всё под рукой: |
| 0:06.2 | видеоуроки, Reading, Listening и Writing. |
| 0:09.3 | Решай тесты, разбирай свои работы |
| 0:18.3 | и следи за прогрессом. |
| 0:20.2 | Каждый урок — шаг вперёд. |
| 0:24.0 | А наша сова всегда рядом. |
| 0:26.4 | Owlington. |
| 0:27.2 | Учись с интересом. |
| 0:28.2 | Двигайся к своему высокому баллу. |

Эти же строки — субтитры (низ кадра, выше зоны интерфейса TikTok).

## Как пересобрать референсы

Нужен dev-сервер (`npx vite --port 5173` в корне репозитория), затем:

```
node promo/seedance/capture.mjs                    # сова, логотип, экраны сайта
node promo/seedance/capture-rank.mjs keys.json     # Band 8.0 и ранг Scholar Owl (keys.json — ответы к Reading Full Test 1)
```
