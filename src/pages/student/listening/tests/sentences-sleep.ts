import { limit, part, person, sentences, test } from '../build'

const prof = person('prof', 'Dr Okoye', 'Lecturer', 'm', 'en-GB', 'onwK4e9ZLuTAKqWW03F9')

export default test('sentences-sleep', [
  part({
    n: 4,
    title: 'Why we dream',
    intro: 'You will hear part of a lecture about sleep and dreaming.',
    speakers: [prof],
    blocks: [
      {
        lines: `
          prof: We spend about a third of our lives asleep, and much of that time dreaming. Today I'll look at what dreams are and why we might have them.
          prof: Sleep moves in cycles of about ninety minutes. Most vivid dreams happen during a stage called REM sleep, named after the rapid eye movements that occur. During REM sleep, the brain is almost as active as when we're awake, but the muscles are temporarily paralysed, which stops us acting out our dreams.
          prof: Most people have four or five periods of REM sleep a night, and they get longer towards morning. That's why we're most likely to remember a dream if we wake up naturally rather than to an alarm.
          prof: One theory is that dreams help us process emotions. People who are deprived of REM sleep tend to react more strongly to upsetting images the next day.
          prof: Another theory links dreaming to memory. In experiments, people who learnt a maze and then dreamt about it performed better when tested later.
          prof: A third idea is that dreams are a kind of rehearsal. Many dreams involve being chased or threatened, and some researchers believe the brain is practising how to respond to danger in a safe environment.
          prof: Not everyone accepts that dreams have a purpose. Some scientists argue they're simply a side effect of the brain sorting information, with no function of their own.
          prof: Finally, a word about lucid dreams, in which the dreamer knows they are dreaming. Around half of people have had at least one, and with training, some people can even control what happens.
        `,
        groups: [
          sentences(
            limit(2, true),
            [
              'A sleep cycle lasts about [[90|ninety]] minutes.',
              'REM sleep is named after rapid [[eye movements]].',
              'During REM sleep the [[muscles]] cannot move.',
              'We remember dreams best if we wake up [[naturally]].',
              'Without REM sleep, people react more strongly to upsetting [[images]].',
              'People who dreamt about a [[maze]] did better in a later test.',
              'Some researchers think dreams let the brain practise responding to [[danger]].',
              'Some scientists say dreams are just a [[side effect]] of sorting information.',
              'In lucid dreams, trained people can [[control]] what happens.',
            ],
            [
              ['cycles of about ninety minutes', 'Sleep moves in cycles.'],
              ['named after the rapid eye movements', 'Most vivid dreams happen in REM sleep.'],
              ['the muscles are temporarily paralysed', 'This stops us acting out dreams.'],
              ['if we wake up naturally rather than to an alarm', 'REM periods get longer towards morning.'],
              ['react more strongly to upsetting images the next day', 'Dreams may help process emotions.'],
              ['people who learnt a maze and then dreamt about it performed better', 'A link with memory.'],
              ['practising how to respond to danger in a safe environment', 'The rehearsal theory.'],
              ["they're simply a side effect of the brain sorting information", 'They may have no function of their own.'],
              ['some people can even control what happens', 'This is possible with training.'],
            ],
          ),
        ],
      },
    ],
    traps: [['Most people have four or five periods of REM sleep a night', 34, 'Number of periods, not when we remember dreams.']],
  }),
])
