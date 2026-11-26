# Universe #6: 60 days x 16 hours a day. Hook A (960 hours ... day 31 everything went wrong).
import json, re
A = '7c2133e5-68ab-511f-9aed-9a67664382b1'; EXAM = '3811e986-0891-47cf-a1f5-78a1d62a547a'; MOM = 'ca83ca7f-c186-493d-bd69-0d765fa861b2'
TIM = 'b847bc29-f184-583a-8ad9-d1f1e16d1a60'
N = ("[intense, fast, gripping] Девятьсот шестьдесят часов английского за шестьдесят дней. По шестнадцать часов в день. [pause] [ominous] На тридцать первый день всё пошло не так. "
"[engaging storyteller, crisp clear diction, brisk pace] Вселенная номер шесть. Тот же Тимур. Только здесь он прокачивает всё сразу. Правило простое: восемь часов — сон. Остальные шестнадцать — английский. Без выходных. "
"День ноль. Пробный экзамен — пять с половиной. "
"Подъём в шесть. Четыре часа ли́снинга, четыре — ри́динга, четыре — ра́йтинга, четыре — спи́кинга. Завтрак — под подкаст. Обед — над эссе. "
"[excited] Первая неделя — огонь. Сто двенадцать часов. Мок — шесть! "
"Вторая неделя — шесть с половиной. Кружек на столе всё больше. "
"[deadpan] Третья неделя — снова шесть с половиной. Четвёртая — шесть. Меньше, чем неделю назад. "
"[surprised] Поворот: часов всё больше, а баллов — меньше. "
"[explaining, clear] Мозг — не жёсткий диск. После нескольких часов без перерыва внимание падает, и ты просто водишь глазами по строчкам. Тимур сидел шестнадцать часов, а учился от силы пять. "
"[playful] Даже во сне за ним гонялись True, False и Not Given. "
"[tense, slow] День тридцать первый. Пробный ли́снинг. Тимур закрыл глаза на секунду... "
"[deadpan] Мок — пять с половиной. Как в день ноль. "
"[warm, mysterious] И тогда сова сделала то, что умеет лучше всех. [pause] Выключила свет. "
"[confident, brisk] Новое правило: четыре блока по девяносто минут. Между ними — перерыв. Каждый день — прогулка. Один выходной в неделю. Шесть часов вместо шестнадцати. "
"[hopeful, building] День сороковой — шесть с половиной. Пятидесятый — семь. Батарейка снова зелёная. "
"[calm] День шестидесятый. Экзамен. "
"[suspense] Результат: ли́снинг — восемь, ри́динг — семь с половиной, ра́йтинг — шесть с половиной, спи́кинг — семь с половиной. [excited, joyful] Общий — семь с половиной! "
"[warm, inspiring] Учит не количество часов, а их качество. Шесть часов с фокусом лучше шестнадцати на автопилоте. Отдых — это тоже подготовка. "
"[playful, warm] А сколько часов в день учишься ты? Пиши в комментах. Сова проверит, не перегибаешь ли.")
D = {
 'mom':  [(MOM, "[worried, calling through the door, caring Russian mom] Тимур, ты когда последний раз на улице был? Солнце видел вообще?")],
 'rec':  [(EXAM, "[calm recorded exam voice, British accent] This is the end of section four. You now have ten minutes to transfer your answers.")],
 'exam': [(EXAM, "[friendly British examiner] Tell me about something you enjoy doing in your free time."),
          (TIM, "[calm, confident, relaxed] Actually, I've recently got into long walks. It sounds simple, but it really clears my head.")],
}
req = [{'index': 0, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Narration: what if 60 days of 16 hours a day', 'stability': 0.4, 'dialogue': [{'text': N, 'voice_type': 'preset', 'voice_id': A}]}}]
for i, (k, lines) in enumerate(D.items(), 1):
    req.append({'index': i, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Dialogue line: ' + k, 'stability': 0.45, 'dialogue': [{'text': t, 'voice_type': 'preset', 'voice_id': v} for v, t in lines]}})
json.dump({'requests': req, 'keys': ['narr'] + list(D)}, open('audio/requests.json', 'w'), ensure_ascii=False, indent=1)
open('script.txt', 'w').write(N)
print(len(re.sub(r'\[[^\]]*\]', '', N).split()), 'words')
