# Universe #7: "Что если 60 дней прокачивать только грамматику" — the classic Timur format (hours-16 is the template).
import json, re
A = '7c2133e5-68ab-511f-9aed-9a67664382b1'; EXAM = '3811e986-0891-47cf-a1f5-78a1d62a547a'; TIM = 'b847bc29-f184-583a-8ad9-d1f1e16d1a60'
N = ("[intense, gripping, fast] Что будет, если шестьдесят дней прокачивать только грамматику? Две тысячи четыреста упражнений. "
"[engaging storyteller, crisp clear diction, brisk pace] Вселенная номер семь. Тот же Тимур. Только здесь — ни сериалов, ни разговоров. Только учебник грамматики. "
"День ноль. Пробный экзамен: ли́снинг, ри́динг, ра́йтинг, спи́кинг — везде пять. [deadpan] Тимур решил: всё дело в ошибках. "
"Правило: сорок упражнений в день. Каждую ошибку — в тетрадь. "
"[excited] Первая неделя: все двенадцать времён. "
"Контрольная по грамматике — девяносто процентов! "
"Вторая неделя: артикли, пассив, условные предложения. Тимур объясняет сове третий тип условных. "
"[deadpan] Сова уснула. "
"[excited] День тридцатый. Тысяча двести упражнений. Пробный ра́йтинг — шесть! Ни одной ошибки во временах. "
"[tense, slow] А потом — пробный спи́кинг. "
"[deadpan] Тимур строил каждое предложение в голове, как упражнение. И пока он выбирал время — время вышло. "
"[surprised] Поворот: в а́йлтс грамматика — это только четверть оценки за ра́йтинг и спи́кинг. Остальное — слова, связность и беглость. А в ли́снинге и ри́динге её отдельно не оценивают вообще. "
"[thoughtful] Грамматика — это скелет. Но без слов и практики скелет не заговорит. "
"[calm] День шестидесятый. Две тысячи четыреста упражнений. Экзамен. "
"[suspense] Результат: ра́йтинг — шесть с половиной, предложения без ошибок. Ри́динг — пять с половиной: грамматику понимает, а слов не хватает. Ли́снинг — пять: на слух времена не помогают. Спи́кинг — пять: длинные паузы. "
"[deadpan] Общий — пять с половиной. "
"[quiet, thoughtful] Грамматика нужна. Но это инструмент, а не цель. "
"[warm] Двадцать минут правил в день — и сразу в дело: скажи вслух три предложения с новой конструкцией, вставь её в эссе, найди в тексте. Правило, которое ты ни разу не использовал, — ещё не твоё. "
"[playful, warm] А ты грамматику учишь или используешь? Пиши в комментах. Сова проверит.")
D = {
 'tenses': [(TIM, "[fast, mumbling to himself, memorizing grammar] I have been... he has been... they had been... I will have been...")],
 'speak':  [(EXAM, "[calm, friendly British examiner] So, tell me about your hometown."),
            (TIM, "[very slow, freezing, constantly correcting himself, long pauses] My hometown... is... was... has been... um... I have been living there... no... I had lived...")],
}
req = [{'index': 0, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Narration: what if 60 days of grammar only', 'stability': 0.4, 'dialogue': [{'text': N, 'voice_type': 'preset', 'voice_id': A}]}}]
for i, (k, lines) in enumerate(D.items(), 1):
    req.append({'index': i, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Dialogue line: ' + k, 'stability': 0.45, 'dialogue': [{'text': t, 'voice_type': 'preset', 'voice_id': v} for v, t in lines]}})
json.dump({'requests': req, 'keys': ['narr'] + list(D)}, open('audio/requests.json', 'w'), ensure_ascii=False, indent=1)
open('script.txt', 'w').write(N)
print(len(re.sub(r'\[[^\]]*\]', '', N).split()), 'words')
