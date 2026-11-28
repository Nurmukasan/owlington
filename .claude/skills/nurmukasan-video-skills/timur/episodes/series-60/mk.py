# Final scores (user's choice): L 8.0, R 6.0, S 6.5, W 5.0 -> 6.375 -> 6.5; the result block was re-recorded and spliced in (audio/splice_results.py).
# Universe #8: "Можно ли выучить английский, просто смотря сериалы?" — 60 days, 180 episodes:
# Russian subtitles (days 1-20) -> English subtitles (21-40) -> no subtitles (41-60). Classic Timur format (grammar-60 is the template).
# Pronunciation rules: never list the four skills in one breath (спикинг -> «спайкинг»); IELTS is not named in the narration.
import json, re
A = '7c2133e5-68ab-511f-9aed-9a67664382b1'; TIM = 'b847bc29-f184-583a-8ad9-d1f1e16d1a60'
JAKE = 'bd072316-f77c-588b-b6e5-e46b9b03d008'; KIKI = '2d51d9d0-b2a4-5e8b-9c63-f310adafd5f7'
N = ("[intense, gripping, fast] Можно ли выучить английский, просто смотря сериалы? Тимур проверил. Шестьдесят дней. Сто восемьдесят серий. "
"[deadpan] Спойлер: первые шестьдесят — впустую. "
"[engaging storyteller, crisp clear diction, brisk pace] Вселенная номер восемь. Тот же Тимур. Ни учебников, ни репетиторов. Только сериалы — по три серии в день. "
"День ноль. Пробный экзамен: по всем навыкам — пять. "
"Этап первый: русские субтитры. [excited] Тимур в восторге! Он понимает каждую шутку. "
"[deadpan] Правда, читает он её по-русски. "
"[tense, slow] День двадцатый. Шестьдесят серий. Пробный ли́снинг — пять. Как в день ноль. "
"[surprised] Поворот: с русскими субтитрами мозг не слушает, а читает. Глаза сами бегут вниз, и английская речь превращается в фоновый шум. "
"[determined] Этап второй: английские субтитры. [tired] Первая серия — полтора часа вместо двадцати минут. Пауза. Перемотка. Словарь. "
"[warm] Зато в тетради появляются живые фразы: I'm gonna... No way... You know what? "
"[excited] День сороковой. Пробный ли́снинг — шесть! И ри́динг — тоже шесть: субтитры научили читать быстро. "
"[tense] Этап третий: без субтитров. Первые дни Тимур понимает половину. "
"[excited, warm] А к пятидесятому дню он смеётся над шуткой раньше, чем закадровый смех. "
"[engaging] День пятьдесят пятый. Звонок от Джейка. "
"[deadpan] Тимур понимал каждое слово. Но за шестьдесят дней он не сказал вслух ни одного своего предложения. "
"[calm] День шестидесятый. Экзамен. "
"[suspense] Результат: ли́снинг — восемь! Уши прокачаны. Ри́динг — шесть. "
"Спи́кинг — шесть с половиной: выручили готовые фразы из сериалов, но своих мыслей мало. "
"Ра́йтинг — пять: сериалы эссе не пишут. [excited] Общий — шесть с половиной! "
"[thoughtful] Так можно ли выучить английский по сериалам? Понимать — да. Говорить — наполовину. Писать — нет. Сериал — это тренажёр для ушей, а не учитель. "
"[warm] Смотри с английскими субтитрами. Повторяй за героями вслух. Выписывай пять фраз из серии — и используй их сам. "
"[playful, warm] А ты смотришь с субтитрами или без? Пиши в комментах. Сова проверит.")
D = {
 'show': [(KIKI, "[fast, over-the-top sitcom, outraged] Oh my God! Did you just eat my sandwich? MY sandwich?!")],
 'jake': [(JAKE, "[cheerful, fast, thick Manchester accent, on a video call] Alright mate! What've you been up to?"),
          (TIM, "[confident, casual, sitcom style] Oh, you know... How you doin'?"),
          (JAKE, "[cheerful, fast, thick Manchester accent] Good! So, tell me about your plans for the summer."),
          (TIM, "[nervous, long awkward pauses] Uh... I... gonna... um... You know what?...")],
}
req = [{'index': 0, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Narration: what if 60 days of series only', 'stability': 0.4, 'dialogue': [{'text': N, 'voice_type': 'preset', 'voice_id': A}]}}]
for i, (k, lines) in enumerate(D.items(), 1):
    req.append({'index': i, 'params': {'model': 'elevenlabs_v4', 'prompt': 'Dialogue line: ' + k, 'stability': 0.45, 'dialogue': [{'text': t, 'voice_type': 'preset', 'voice_id': v} for v, t in lines]}})
for r in req: r['params']['folder_id'] = 'abd74583-6d81-4494-b1aa-1af6d76451f5'
json.dump({'requests': req, 'keys': ['narr'] + list(D)}, open('audio/requests.json', 'w'), ensure_ascii=False, indent=1)
open('script.txt', 'w').write(N)
print(len(re.sub(r'\[[^\]]*\]', '', N).split()), 'words')
