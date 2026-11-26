import json, re
A='7c2133e5-68ab-511f-9aed-9a67664382b1'; EXAM='3811e986-0891-47cf-a1f5-78a1d62a547a'; JAKE='bd072316-f77c-588b-b6e5-e46b9b03d008'
MOM='ca83ca7f-c186-493d-bd69-0d765fa861b2'; AUS='d8061b90-ff25-5882-8384-7a6a28806f30'; SCOT='6705e465-7b52-5915-a1d8-b1222885e01d'
N = ("[dramatic storyteller, crisp clear diction, brisk pace] Финальная серия. Вселенная номер четыре. Тимур не читает, не пишет и почти не говорит. Он только слушает. "
"День ноль. Пробный ли́снинг. "
"[deadpan] Тимур пишет: четырнадцать. Ли́снинг — пять. "
"Правило: каждый день — два часа английского на слух. "
"Первые две недели — фоном: пока играет, пока листает ленту. Двадцать часов. Мок — снова пять. "
"[surprised] Поворот: фоном — не считается. "
"Новое правило: диктант. Пауза, перемотка, каждое слово — на бумагу. Сова помогает — по-старинке. "
"Неделя третья. Скорость: один и двадцать пять... полтора... А потом обратно на обычную — и все говорят как в замедленной съёмке. "
"Неделя четвёртая. Рулетка акцентов. Австралия. "
"[deadpan] Терпимо. Шотландия. "
"[deadpan] Без комментариев. "
"День сороковой. Режим «locked in». Наушники — в автобусе, на улице, на кухне. "
"[deadpan] Не слышит. "
"День пятидесятый. Новый подкаст. Голос ведущего кажется знакомым... "
"День шестидесятый. Экзамен. И — та же ловушка. "
"[warm] Сорок. Тимур даже не моргнул. "
"[pause] Результат: ли́снинг — девять! Максимум. Спи́кинг — шесть с половиной, ри́динг — шесть, ра́йтинг — пять с половиной. Общий — семь. "
"[building tension] Четыре вселенные. Четыре Тимура. Четыре разных пути. "
"[quiet, thoughtful] Но кое-что было везде. Всегда есть Тимур. Всегда есть экзамен. [pause] И всегда есть сова. "
"[leaning in] А что, если прокачать всё сразу? [pause] Сова знает как.")
D = {
 'exam0': [(EXAM, "[calm recorded exam voice, British accent] The tour starts at fourteen... sorry, forty minutes past ten.")],
 'aus':   [(AUS, "[cheerful, fast, thick Australian accent] G'day mate! How ya goin'? Fair dinkum!")],
 'scot':  [(SCOT, "[very thick Scottish accent, fast, proud] It's a braw, bricht, moonlicht nicht the nicht!")],
 'mom':   [(MOM, "[shouting from the kitchen, annoyed Russian mom, in Russian] Тимур! Ужинать! Тиму-у-ур!!")],
 'jake':  [(JAKE, "[cheerful podcast host, thick Manchester accent] Alright mate! Welcome back to the pod, innit!")],
 'exam60':[(EXAM, "[calm recorded exam voice, British accent] The bus leaves at fourteen... sorry, forty minutes past nine.")],
}
req = [{'index': 0, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Narration: what if 60 days of listening only', 'stability': 0.4, 'dialogue': [{'text': N, 'voice_type': 'preset', 'voice_id': A}]}}]
for i, (k, lines) in enumerate(D.items(), 1):
    req.append({'index': i, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Dialogue line: ' + k, 'stability': 0.45, 'dialogue': [{'text': t, 'voice_type': 'preset', 'voice_id': v} for v, t in lines]}})
json.dump({'requests': req, 'keys': ['narr'] + list(D)}, open('audio/requests.json', 'w'), ensure_ascii=False, indent=1)
open('script.txt', 'w').write(N)
print(len(re.sub(r'\[[^\]]*\]', '', N).split()), 'words')
