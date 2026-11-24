# mk.py — the script + ElevenLabs v4 requests (Higgsfield generate_audio_batch with {"ref": "sandbox:~/<ep>/audio/requests.json#/requests"}).
# Audio tags in [brackets] steer emotion: calm/soft in sad parts, energetic in happy parts. Stress marks (ли́снинг) fix pronunciation.
# ~340 words of narration -> ~147 s natural -> atempo 1.24 -> ~119 s, + ~20 s of character lines = 2:20.
import json, re
NAR = '165d9309-bb17-56ff-964a-5d6a38dab92f'      # Nadine  — narrator (chosen by the user)
KATYA = 'e9cfbbf0-4476-46be-b396-596eb774b165'    # Chloe   — young heroine (RU + EN)
MOM = 'ca83ca7f-c186-493d-bd69-0d765fa861b2'      # Elena   — mum
FRIEND = '2d51d9d0-b2a4-5e8b-9c63-f310adafd5f7'   # Kiki    — friend voice message
EXAM = '3811e986-0891-47cf-a1f5-78a1d62a547a'     # Imogen  — British examiner
N = ("[soft, intriguing] Что, если до айéлтс осталась всего неделя? "
"[calm, warm] Это Катя. Английский у неё неплохой — би-два, почти си-один. Но три месяца назад пробный тест показал... [pause] пять с половиной. Хотя мок-тестов она прорешала десятки. "
"[soft, a bit sad] Подруги с курсов готовились месяцами. А Катя работала в кофейне и помогала маме с младшими братьями. "
"[quiet] Катя не ответила. "
"[rising, determined] Но начались каникулы. И Катя отменила всё: смены, кино, встречи. Телефон — в ящик. "
"[energetic] Семь дней — это сто шестьдесят восемь часов. И каждый — на счету. "
"[confident, brisk] День первый. Правило номер один: старые методы уже не работают. Учить по сто слов в день — поздно. За неделю ты не выучишь английский. [pause] Ты выучишь экзамен. "
"[explaining, clear] Ли́снинг — четыре части, сорок вопросов. Ри́динг — три текста за час. Ра́йтинг — две задачи. Спи́кинг — три части. "
"[brisk] День второй. Правило номер два: не трать последнюю неделю на ра́йтинг — он растёт медленнее всего. Быстрые баллы — в ли́снинге и ри́динге. "
"[excited] Ответ почти никогда не повторяет вопрос — его перефразируют. «Закрыт по понедельникам» превращается в «не работает в начале недели». "
"[brisk] Для ра́йтинга — только структура: вступление, два абзаца, вывод. Не шедевр, а шаблон. Спи́кинг — двадцать минут вслух каждый день. "
"[calm, warm] Расписание: подъём в семь. Мок ровно в девять — как на настоящем экзамене. Пятьдесят минут работы, десять — отдыха. Отбой в одиннадцать. "
"[soft, wonder] Потому что сон — это тоже учёба. Ночью мозг переносит выученное из короткой памяти в долгую. Не выспалась — и часть знаний просто не сохранится. "
"[sad, slow] День четвёртый. Мок — шесть. Всего полбалла. Ночью Катя впервые заплакала. "
"[soft, tender] А сова просто осталась рядом. "
"[building, hopeful] День пятый — шесть с половиной. День шестой — семь! "
"[calm] День седьмой — никаких моков. Лёгкое повторение, прогулка и сон в десять. "
"[tense, quiet] День экзамена. Катя открыла задание — и всё было знакомо. Каждая часть. Каждая ловушка. "
"[suspense] Результат. [pause] Ли́снинг — восемь. Ри́динг — восемь. Ра́йтинг — шесть с половиной. Спи́кинг — семь. [excited, joyful] Общий балл — семь с половиной! "
"[warm, inspiring] Неделя — это не конец. Важно не только знать английский, но и понимать экзамен. Поймёшь структуру — и высокий балл твой. "
"[playful, warm] А сколько дней до айéлтс у тебя? Пиши в комментах. Сова с бантиком уже считает.")
D = {
 'friend': [(FRIEND, "[voice message, cheerful, fast, young girl] Ка-ать! Мы вчера мок писали — у меня семь! А ты как, готова?")],
 'katya1': [(KATYA, "[quiet, determined, to herself] Ладно. Сто шестьдесят восемь часов. Поехали.")],
 'mom':    [(MOM, "[soft, warm, caring mother, late at night] Катюш... ты за четыре дня сделала больше, чем многие за месяц. Иди спать, солнышко.")],
 'exam':   [(EXAM, "[calm, friendly British examiner] Good morning. Could you tell me your full name, please?"), (KATYA, "[calm, confident, polite, light accent] Good morning! My name is Katya.")],
}
req = [{'index': 0, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Narration', 'stability': 0.4, 'dialogue': [{'text': N, 'voice_type': 'preset', 'voice_id': NAR}]}},
       {'index': 1, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Narration take 2', 'stability': 0.4, 'dialogue': [{'text': N, 'voice_type': 'preset', 'voice_id': NAR}]}}]
for i, (k, lines) in enumerate(D.items(), 2):
    req.append({'index': i, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Dialogue line: ' + k, 'stability': 0.45, 'dialogue': [{'text': t, 'voice_type': 'preset', 'voice_id': v} for v, t in lines]}})
json.dump({'requests': req, 'keys': ['narr_a', 'narr_b'] + list(D)}, open('audio/requests.json', 'w'), ensure_ascii=False, indent=1)
open('script.txt', 'w').write(N)
print(len(re.sub(r'\[[^\]]*\]', '', N).split()), 'words', len(N), 'chars')
