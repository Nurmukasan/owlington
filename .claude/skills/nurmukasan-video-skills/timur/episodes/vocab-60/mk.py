import json, re
A='7c2133e5-68ab-511f-9aed-9a67664382b1'; EXAM='3811e986-0891-47cf-a1f5-78a1d62a547a'; JAKE='bd072316-f77c-588b-b6e5-e46b9b03d008'
TIM='b847bc29-f184-583a-8ad9-d1f1e16d1a60'
N = ("[engaging storyteller, crisp clear diction, brisk pace] Что будет, если шестьдесят дней учить только слова? По пятьдесят в день. Три тысячи слов. "
"Вселенная номер пять. Тот же Тимур. Только здесь — ни книг, ни разговоров. Только карточки. "
"День ноль. Пробный экзамен. Спи́кинг — пять. [deadpan] Тимур решил: просто не хватает слов. "
"Правило: каждый день — пятьдесят новых слов. Без пропусков. "
"День первый. "
"[deadpan] Два часа — и все пятьдесят в голове. "
"[surprised] А наутро половина вылетела. "
"Поворот: мозг забывает больше половины нового уже за сутки. Это кривая забывания. "
"Новое правило: повторения по графику. Сегодня, через день, через неделю. Сова следит. "
"Неделя вторая. Карточки везде: на холодильнике, на зеркале... на сове. "
"День тридцатый. Полторы тысячи слов. Тимур знает слова, которых не знает даже учитель. "
"День сорок пятый. Звонок от Джейка. "
"[deadpan] Тимур знал каждое слово в вопросе. [pause] Но ответить не смог. "
"[thoughtful] Потому что слова — это кирпичи. А речь — это дом. Без грамматики и практики кирпичи просто лежат кучей. "
"День шестидесятый. Три тысячи слов. Экзамен. "
"[pause] Результат: ри́динг — шесть с половиной, слова помогли. Ли́снинг — пять с половиной: на бумаге слова знакомые, а на слух — нет. Ра́йтинг — пять. Спи́кинг — пять. [deadpan] Как в день ноль. "
"Общий — пять с половиной. "
"[quiet, thoughtful] Три тысячи слов — это сила. Но слово, которое ты ни разу не сказал вслух, — ещё не твоё. "
"[warm] Учи слова в предложениях. Слушай, как их говорят. И сразу используй. Пять слов, сказанных вслух, лучше пятидесяти на карточке. "
"[leaning in] А сколько слов в день учишь ты? Пиши в комментах. Сова проверит.")
D = {
 'words': [(TIM, "[fast, mumbling to himself, memorizing flashcards] Abandon... ability... absolutely... abundant... accomplish...")],
 'jake':  [(JAKE, "[cheerful, fast, thick Manchester accent, on a video call] Alright mate! So what did you do last weekend?"),
           (TIM, "[nervous, long awkward pauses, broken English] I... weekend... I go... ubiquitous...?")],
 'exam':  [(EXAM, "[calm, friendly British examiner] Describe a place you like to visit."),
           (TIM, "[nervous, long pauses, broken English] Place... very... beautiful... quintessential...")],
}
req = [{'index': 0, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Narration: what if 60 days of vocabulary only', 'stability': 0.4, 'dialogue': [{'text': N, 'voice_type': 'preset', 'voice_id': A}]}}]
for i, (k, lines) in enumerate(D.items(), 1):
    req.append({'index': i, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Dialogue line: ' + k, 'stability': 0.45, 'dialogue': [{'text': t, 'voice_type': 'preset', 'voice_id': v} for v, t in lines]}})
json.dump({'requests': req, 'keys': ['narr'] + list(D)}, open('audio/requests.json', 'w'), ensure_ascii=False, indent=1)
open('script.txt', 'w').write(N)
print(len(re.sub(r'\[[^\]]*\]', '', N).split()), 'words')
